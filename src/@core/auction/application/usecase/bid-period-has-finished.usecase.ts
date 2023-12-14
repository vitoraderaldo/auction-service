import { LoggerInterface } from '../../../common/application/service/logger';
import { EventPublisher } from '../../../common/domain/domain-events/domain-event';
import Auction from '../../domain/entities/auction.entity';
import { AuctionRepository } from '../../domain/repositories/auction.repository';
import { AuctionStatusEnum } from '../../domain/value-objects/auction-status.vo';

export interface BidPeriodHasFinishedOutput {
  total: number;
  success: number;
  failure: number;
  updatedAuctions: {
    id: string;
    status: AuctionStatusEnum,
  }[]
}

export default class BidPeriodHasFinishedUseCase {
  private MAX_AUCTIONS_PER_EXECUTION = 10;

  constructor(
    private readonly auctionRepository: AuctionRepository,
    private readonly eventPublisher: EventPublisher,
    private readonly logger: LoggerInterface,
  ) {}

  async execute(): Promise<BidPeriodHasFinishedOutput> {
    this.logger.info('Starting to update auctions with expired bid period');

    const auctions = await this.auctionRepository.findExpiredPublishedAuctions(
      this.MAX_AUCTIONS_PER_EXECUTION,
    );

    const promises = auctions.map((auction) => this.handleBidPeriodExpiration(auction));
    const results = await Promise.allSettled(promises);

    const updatedAuctions = results
      .filter((result) => result.status === 'fulfilled')
      .map((result: PromiseFulfilledResult<Auction>) => result.value);

    const failures = results.filter((result) => result.status === 'rejected')
      .map((result: PromiseRejectedResult) => result);

    this.logErrors(failures);

    this.logger.info('Finished to update auctions with expired bid period', {
      auctionIds: auctions.map((auction) => auction.getId()),
    });

    return {
      total: auctions.length,
      success: updatedAuctions.length,
      failure: failures.length,
      updatedAuctions: updatedAuctions.map((auction) => ({
        id: auction.getId(),
        status: auction.getStatus(),
      })),
    };
  }

  private logErrors(failures: PromiseRejectedResult[]): void {
    failures.forEach((failure) => this.logger.error('', failure.reason));
  }

  private async handleBidPeriodExpiration(auction: Auction): Promise<Auction> {
    auction.transitionToBidPeriodFinished();
    await this.auctionRepository.update(auction);
    this.eventPublisher.publish(auction.getEvents());
    return auction;
  }
}
