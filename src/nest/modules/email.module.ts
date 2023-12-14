import { Module } from '@nestjs/common';
import { EnvironmentConfigInterface } from '../../@core/common/application/service/environment-config.interface';
import SendGridSdk from '../../@core/notification/infra/email/sendgrid/sendgrid-sdk';
import ConfModule from './config.module';
import NotifyWinningBidderSendGrid from '../../@core/notification/infra/email/sendgrid/cases/notify-winning-bidder';
import SendGridService from '../../@core/notification/infra/email/sendgrid/send-grid.service';
import { SendgridClient } from '../../@core/notification/infra/email/sendgrid/sendgrid.interface';

@Module({
  imports: [ConfModule],
  providers: [
    {
      provide: 'SendgridClient',
      useFactory: (
        config: EnvironmentConfigInterface,
      ) => new SendGridSdk(config.getSendGrid()),
      inject: ['EnvironmentConfigInterface'],
    },
    {
      provide: NotifyWinningBidderSendGrid,
      useFactory: (
        sendGridClient: SendgridClient,
        config: EnvironmentConfigInterface,
      ) => new NotifyWinningBidderSendGrid(sendGridClient, config.getSendGrid().templates),
      inject: ['SendgridClient', 'EnvironmentConfigInterface'],
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
