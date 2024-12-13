import { Injectable, Logger } from '@nestjs/common';
import createEdgeClient from '@honeycomb-protocol/edge-client';
import { EdgeClient } from '@honeycomb-protocol/edge-client/client/types';
import { ConfigService } from '@nestjs/config';
import { delay } from 'src/utils/delay';
import { MAX_TRIES_COUNT } from '../account-subscriber/account-subscriber.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class HoneycombProfileService {
  private client: EdgeClient;
  private projectAddress: string;
  private readonly logger = new Logger(HoneycombProfileService.name);

  constructor(
    private readonly configService: ConfigService,
    private eventEmitter: EventEmitter2,
  ) {
    const API_URL = 'https://edge.test.honeycombprotocol.com/';
    const client = createEdgeClient(API_URL, true);
    this.client = client;
    this.projectAddress = this.configService.get<string>(
      'HONEYCOMB_PROJECT_ADDRESS',
    );
  }

  async getProfile(userPublicKey: string) {
    const users = await this.client.findUsers({
      wallets: [userPublicKey],
    });
    const user = users.user[0];

    if (user) {
      throw new Error('User not found');
    }

    const profiles = await this.client.findProfiles({
      projects: [this.projectAddress],
      userIds: [user.id],
    });

    const profile = profiles.profile[0];

    return profile;
  }

  async tryToGetProfile(userPublicKey: string, retryCount = 0) {
    try {
      const profile = await this.getProfile(userPublicKey);
      if (profile) {
        return profile;
      }
      throw new Error('Profile not found');
    } catch (e) {
      this.logger.error(`Get profile fail. Error: ${e.message}`, {
        retryCount,
      });
      this.logger.debug(e);
      this.logger.debug(
        `Status: ${e.status}, Message: ${e.statusText || e.message}`,
      );

      // Add a delay before retrying (using exponential backoff)
      const delayMs = Math.pow(2, retryCount) * 1000;
      this.logger.debug(`Retrying webhook. Attempt ${retryCount + 1}`);
      await delay(delayMs);

      if (retryCount == MAX_TRIES_COUNT) {
        this.logger.error(`Max retry attempts reached`);
        return;
      }

      return this.tryToGetProfile(userPublicKey, retryCount + 1);
    }
  }

  async getReward(userPublicKey: string, accountId: string) {
    this.logger.debug('Checking user profile created');
    await this.tryToGetProfile(userPublicKey);

    this.eventEmitter.emit('honeycomb-profile.created', {
      accountId,
    });
  }
}
