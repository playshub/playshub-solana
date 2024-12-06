import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SolanaRpcService } from '../solana-rpc/solana-rpc.service';
import { ConfirmedSignatureInfo, ParsedInstruction } from '@solana/web3.js';
import { delay } from 'src/utils/delay';

export const MAX_TRIES_COUNT = 5;
export const MEMO_PROGRAM_ID = 'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr';

@Injectable()
export class AccountSubscriberService {
  private logger = new Logger(AccountSubscriberService.name);

  private latestTxSignature = null;

  private processing: boolean = false; // Only 1 worker is working

  constructor(
    private solanaRpcService: SolanaRpcService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async sync() {
    if (this.processing) {
      return;
    }

    this.logger.debug(`Sync latest transactions every 10 seconds`);
    try {
      this.processing = true;
      const { latestTxSignature } = await this.getTransactions();
      if (latestTxSignature) {
        this.latestTxSignature = latestTxSignature;
      }
    } catch (error) {
      // Ignore errors
      this.logger.debug(error);
      this.logger.error('Error while syncing latest transactions');
    }

    this.processing = false;
  }

  private async getTransactions(): Promise<{
    latestTxSignature: string;
  }> {
    this.logger.debug(`Try to fetch  transactions latest`);

    const transactions = await this.tryGetTransactions();

    const filterTransactions = [];
    for (const tx of transactions) {
      if (tx.signature == this.latestTxSignature) {
        break;
      }
      filterTransactions.push(tx);
    }

    if (filterTransactions.length == 0) {
      return { latestTxSignature: this.latestTxSignature };
    }

    this.logger.debug(`Found new ${filterTransactions.length} transactions!`);
    this.processTransactions(filterTransactions);

    return { latestTxSignature: transactions[0].signature };
  }

  private async processTransactions(signatures: ConfirmedSignatureInfo[]) {
    const txs = await this.solanaRpcService.getTransactions(
      signatures.map((tx) => tx.signature),
    );

    const parsedMemos = txs
      .map((tx) => {
        const memo = tx.transaction.message.instructions.find(
          (instruction) => instruction.programId.toString() === MEMO_PROGRAM_ID,
        ) as ParsedInstruction;

        if (memo) {
          return JSON.parse(memo.parsed);
        }
      })
      .filter((memo) => memo);

    this.eventEmitter.emit('sol.transactions', parsedMemos);
  }

  private async tryGetTransactions(
    retryCount = 0,
  ): Promise<ConfirmedSignatureInfo[]> {
    try {
      const transactions = await this.solanaRpcService.getSignaturesForAddress({
        limit: 10,
      });
      return transactions;
    } catch (e) {
      this.logger.error('Calling to RPC failed');
      this.logger.debug(e);

      // Add a delay before retrying (using exponential backoff)
      const delayMs = Math.pow(2, retryCount) * 1000;
      this.logger.debug(`Retrying webhook. Attempt ${retryCount + 1}`);
      await delay(delayMs);

      if (retryCount == MAX_TRIES_COUNT) {
        this.logger.error(`Maximum try ${MAX_TRIES_COUNT} times reach`);
        throw e;
      }

      return this.tryGetTransactions(retryCount + 1);
    }
  }
}
