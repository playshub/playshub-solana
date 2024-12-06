import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Connection,
  PublicKey,
  SignaturesForAddressOptions,
} from '@solana/web3.js';

@Injectable()
export class SolanaRpcService {
  private connection: Connection;
  private receiptAddress: PublicKey;

  constructor(private readonly configService: ConfigService) {
    const rpcUrl = this.configService.get('SOLANA_RPC_URL');
    const receiptAddress = this.configService.get('SOLANA_RECEIPT_ADDRESS');

    this.connection = new Connection(rpcUrl, 'confirmed');
    this.receiptAddress = new PublicKey(receiptAddress);
  }

  async getSignaturesForAddress(options?: SignaturesForAddressOptions) {
    return this.connection.getSignaturesForAddress(
      this.receiptAddress,
      options,
    );
  }

  async getTransactions(signatures: string[]) {
    return this.connection.getParsedTransactions(signatures);
  }
}
