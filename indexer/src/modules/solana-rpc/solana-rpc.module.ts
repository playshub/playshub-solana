import { Module } from '@nestjs/common';
import { SolanaRpcService } from './solana-rpc.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [SolanaRpcService],
  exports: [SolanaRpcService],
})
export class SolanaRpcModule {}
