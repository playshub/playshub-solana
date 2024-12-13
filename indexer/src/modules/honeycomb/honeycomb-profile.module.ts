import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HoneycombProfileService } from './honeycomb-profile.service';
import { HoneycombProfileController } from './honeycomb-profile.controller';

@Module({
  imports: [ConfigModule],
  controllers: [HoneycombProfileController],
  providers: [HoneycombProfileService],
  exports: [],
})
export class HoneycombProfileModule {}
