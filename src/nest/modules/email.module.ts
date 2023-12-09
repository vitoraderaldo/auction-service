import { Module } from '@nestjs/common';
import { EnvironmentConfigInterface } from '../../@core/common/domain/environment-config.interface';
import SendGridSdk from '../../@core/notification/infra/email/sendgrid/sendgrid-sdk';
import ConfModule from './config.module';
import NotifyWinningBidderSendGrid from '../../@core/notification/infra/email/sendgrid/cases/notify-winning-bidder';
import SendGridClient from '../../@core/notification/infra/email/sendgrid/sendgrid.interface';
import SendGridService from '../../@core/notification/infra/email/sendgrid/send-grid.service';

@Module({
  imports: [ConfModule],
  providers: [
    {
      provide: 'SendGridClient',
      useFactory: (
        config: EnvironmentConfigInterface,
      ) => new SendGridSdk(config.getSendGrid()),
      inject: ['EnvironmentConfigInterface'],
    },
    {
      provide: NotifyWinningBidderSendGrid,
      useFactory: (
        sendGridClient: SendGridClient,
        config: EnvironmentConfigInterface,
      ) => new NotifyWinningBidderSendGrid(sendGridClient, config.getSendGrid().templates),
      inject: ['SendGridClient', 'EnvironmentConfigInterface'],
    },
    {
      provide: SendGridService,
      useFactory: (
        notifyWinningBidder: NotifyWinningBidderSendGrid,
      ) => new SendGridService(notifyWinningBidder),
      inject: [NotifyWinningBidderSendGrid],
    },
    {
      provide: 'EmailSender',
      useFactory: (
        sendGridService: SendGridService,
      ) => sendGridService,
      inject: [SendGridService],
    },
  ],
  exports: ['EmailSender'],
})
export default class EmailModule {}
