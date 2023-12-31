import { createMock } from '@golevelup/ts-jest';
import { faker } from '@faker-js/faker';
import { LoggerInterface } from '../../../common/application/service/logger';
import EmailSender from '../service/email/email.types';
import BidderRepository from '../../../auction/domain/repositories/bidder.repository';
import BidderNotificationRepository from '../../domain/repositories/bidder-notification.repository';
import { AuctionRepository } from '../../../auction/domain/repositories/auction.repository';
import SendEmailToWinnerUseCase from './send-email-to-winner.usecase';
import buildBid from '../../../../../test/util/bid.mock';
import buildBidder from '../../../../../test/util/bidder.mock';
import buildAuction from '../../../../../test/util/auction.mock';

describe('SendEmailToWinnerUseCase', () => {
  let loggerMock: LoggerInterface;
  let emailSenderMock: EmailSender;
  let bidderRepositoryMock: BidderRepository;
  let bidderNotificationRepositoryMock: BidderNotificationRepository;
  let auctionRepositoryMock: AuctionRepository;
  const fromEmailAdress = faker.internet.email();

  let useCase: SendEmailToWinnerUseCase;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();

    loggerMock = createMock<LoggerInterface>();
    emailSenderMock = createMock<EmailSender>();
    bidderRepositoryMock = createMock<BidderRepository>();
    bidderNotificationRepositoryMock = createMock<BidderNotificationRepository>();
    auctionRepositoryMock = createMock<AuctionRepository>();

    useCase = new SendEmailToWinnerUseCase(
      loggerMock,
      emailSenderMock,
      bidderRepositoryMock,
      bidderNotificationRepositoryMock,
      auctionRepositoryMock,
      fromEmailAdress,
    );
  });

  it('should send email to the winner and save notification', async () => {
    const bid = buildBid();
    const bidder = buildBidder();
    const auction = buildAuction({ bids: [bid] });

    jest
      .spyOn(bidderRepositoryMock, 'findById')
      .mockResolvedValueOnce(bidder);

    jest
      .spyOn(auctionRepositoryMock, 'findById')
      .mockResolvedValueOnce(auction);

    const auctionId = auction.getId();

    await useCase.execute({ auctionId });

    expect(bidderRepositoryMock.findById).toHaveBeenCalled();
    expect(auctionRepositoryMock.findById).toHaveBeenCalled();
    expect(emailSenderMock.send).toHaveBeenCalled();
    expect(bidderNotificationRepositoryMock.save).toHaveBeenCalled();
  });

  it('should skip email notification when the auction has no bid', async () => {
    const bidder = buildBidder();
    const auction = buildAuction({ bids: [] });

    jest
      .spyOn(bidderRepositoryMock, 'findById')
      .mockResolvedValueOnce(bidder);

    jest
      .spyOn(auctionRepositoryMock, 'findById')
      .mockResolvedValueOnce(auction);

    const auctionId = auction.getId();

    await useCase.execute({ auctionId });

    expect(bidderRepositoryMock.findById).not.toHaveBeenCalled();
    expect(emailSenderMock.send).not.toHaveBeenCalled();
    expect(bidderNotificationRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should not propagate error when it fails to save the notifcation confirmation', async () => {
    const bid = buildBid();
    const bidder = buildBidder();
    const auction = buildAuction({ bids: [bid] });

    jest
      .spyOn(bidderRepositoryMock, 'findById')
      .mockResolvedValueOnce(bidder);

    jest
      .spyOn(auctionRepositoryMock, 'findById')
      .mockResolvedValueOnce(auction);

    jest
      .spyOn(bidderNotificationRepositoryMock, 'save')
      .mockRejectedValueOnce(new Error('Failed to save notification'));

    const auctionId = auction.getId();

    await useCase.execute({ auctionId });

    expect(bidderRepositoryMock.findById).toHaveBeenCalled();
    expect(auctionRepositoryMock.findById).toHaveBeenCalled();
    expect(emailSenderMock.send).toHaveBeenCalled();
    expect(bidderNotificationRepositoryMock.save).toHaveBeenCalled();
  });
});
