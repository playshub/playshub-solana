import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { AccountSubscriberModule } from './modules/account-subscriber/account-subscriber.module';
import { NotificationModule } from './modules/notification/notification.module';
import { TelegramBotModule } from './modules/telegram-bot/telegram-bot.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),

    AccountSubscriberModule,
    NotificationModule,
    TelegramBotModule,
  ],
})
export class AppModule {}
