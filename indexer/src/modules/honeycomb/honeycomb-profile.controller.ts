import { Body, Controller, Get, Post } from '@nestjs/common';
import { GetRewardDto } from './dtos/get-reward.dto';
import { HoneycombProfileService } from './honeycomb-profile.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller('honeycomb-profile')
export class HoneycombProfileController {
  constructor(
    private readonly honeycombProfileService: HoneycombProfileService,
  ) {}

  @Post('reward')
  reward(@Body() getRewardDto: GetRewardDto) {
    return this.honeycombProfileService.getReward(
      getRewardDto.userPublicKey,
      getRewardDto.accountId,
    );
  }
}
