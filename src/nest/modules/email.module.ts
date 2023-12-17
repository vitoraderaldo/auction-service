import { Module } from '@nestjs/common';
import { EnvironmentConfigInterface } from '../../@core/common/application/service/environment-config.interface';
import SendGridSdk from '../../@core/notification/infra/email/sendgrid/sendgrid-sdk';
import ConfModule from './config.module';
import NotifyWinningBidderSendGrid from '../../@core/notification/infra/email/sendgrid/cases/notify-winning-bidder';
import SendGridService from '../../@core/notification/infra/email/sendgrid/send-grid.service';
import { SendgridClient } from '../../@core/notification/infra/email/sendgrid/sendgrid.interface';
import SendPaymentRequestToWinnerSendGrid from '../../@core/notification/infra/email/sendgrid/cases/send-payment-request-to-winner';

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
      provide: SendPaymentRequestToWinnerSendGrid,
      useFactory: (
        sendGridClient: SendgridClient,
        config: EnvironmentConfigInterface,
      ) => new SendPaymentRequestToWinnerSendGrid(sendGridClient, config.getSendGrid().templates),
      inject: ['SendgridClient', 'EnvironmentConfigInterface'],
    },
    {
      provide: SendGridService,
      useFactory: (
        notifyWinningBidder: NotifyWinningBidderSendGrid,
        sendPaymentRequestToWinnerSendGrid: SendPaymentRequestToWinnerSendGrid,
      ) => new SendGridService(notifyWinningBidder, sendPaymentRequestToWinnerSendGrid),
      inject: [NotifyWinningBidderSendGrid, SendPaymentRequestToWinnerSendGrid],
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
