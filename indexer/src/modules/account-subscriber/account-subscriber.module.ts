import { Module } from '@nestjs/common';
import { AccountSubscriberService } from './account-subscriber.service';
import { SolanaRpcModule } from '../solana-rpc/solana-rpc.module';

@Module({ imports: [SolanaRpcModule], providers: [AccountSubscriberService] })
export class AccountSubscriberModule {}
