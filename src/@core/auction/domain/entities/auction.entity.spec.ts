import { randomUUID } from 'crypto';
import buildAuction from '../../../../../test/util/auction.mock';
import Uuid from '../../../common/domain/value-objects/uuid.vo';
import { AuctionStatusEnum } from '../value-objects/auction-status.vo';
import Auction, {
  AuctionConstructorProps,
  AuctionCreateProps,
} from './auction.entity';
import buildBid from '../../../../../test/util/bid.mock';
import Price from '../../../common/domain/value-objects/price.vo';
import Bid from './bid.entity';

describe('Auction', () => {
  let validAuctionProps: AuctionConstructorProps;

  beforeEach(() => {
    validAuctionProps = {
      id: new Uuid(),
      title: 'Test Auction',
      description: 'Auction description',
      photos: [{ link: 'https://example.com/photo.jpg' }],
      startDate: '2023-01-01T00:00:00.000Z',
      endDate: '2023-01-02T00:00:00.000Z',
      startPrice: 100,
      status: AuctionStatusEnum.CREATED,
      auctioneerId: 'auctioneer-id',
      bids: [],
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
    };
  });

  describe('Constructor', () => {
    it('should create an Auction instance with valid properties', () => {
      const auction = new Auction(validAuctionProps);
      expect(auction).toBeInstanceOf(Auction);
      expect(auction.toJSON()).toEqual({
        ...validAuctionProps,
        id: validAuctionProps.id.value.toString(),
      });
    });

    it('should throw an errors without auctioneer', () => {
      const invalidProps = { ...validAuctionProps, auctioneerId: '' };
      expect(() => new Auction(invalidProps)).toThrow('Invalid auctioneer');
    });

    it('should throw an error with title containing few characters', () => {
      const invalidProps = { ...validAuctionProps, title: 'titl' };
      expect(() => new Auction(invalidProps)).toThrow(
        'Title must be at least 5 characters long',
      );
    });

    it('should throw an error with title containing many characters', () => {
      const invalidProps = { ...validAuctionProps, title: 'a'.repeat(101) };
      expect(() => new Auction(invalidProps)).toThrow(
        'Title must be less than 100 characters long',
      );
    });

    it('should throw an error with description containing few characters', () => {
      const invalidProps = { ...validAuctionProps, description: 'descripti' };
      expect(() => new Auction(invalidProps)).toThrow(
        'Description must be at least 10 characters long',
      );
    });

    it('should throw an error if description with description containing many characters', () => {
      const invalidProps = {
        ...validAuctionProps,
        description: 'a'.repeat(10001),
      };
      expect(() => new Auction(invalidProps)).toThrow(
        'Description must be less than 10000 characters long',
      );
    });

    it('should throw an error if start date is after end date', () => {
      const invalidProps = {
        ...validAuctionProps,
        endDate: '2023-01-01T00:00:00.000Z',
        startDate: '2023-01-02T00:00:00.000Z',
      };
      expect(() => new Auction(invalidProps)).toThrow(
        'End date must be after start date',
      );
    });
  });

  describe('Create', () => {
    it('should create a new Auction instance with default values', () => {
      const startDate = new Date();
      startDate.setUTCHours(startDate.getUTCHours() + 1);

      const endDate = new Date();
      endDate.setUTCDate(endDate.getUTCDate() + 15);

      const createProps: AuctionCreateProps = {
        title: 'New Auction',
        description: 'New auction description',
        photos: [],
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        startPrice: 50,
        auctioneerId: 'auctioneer-id',
      };

      const auction = Auction.create(createProps);
      const data = auction.toJSON();

      expect(auction).toBeInstanceOf(Auction);
      expect(data.id).toBeTruthy();
      expect(data.status).toEqual(AuctionStatusEnum.CREATED);
    });

    it('should throw an error if the start date is in the past', () => {
      const createProps: AuctionCreateProps = {
        title: 'New Auction',
        description: 'New auction description',
        photos: [],
        startDate: '2023-01-01T00:00:00.000Z',
        endDate: '2023-01-01T00:00:00.000Z',
        startPrice: 50,
        auctioneerId: 'auctioneer-id',
      };

      expect(() => Auction.create(createProps)).toThrow(
        'Start date must not be in the past',
      );
    });
  });

  describe('Publish', () => {
    it('should publish an auction', () => {
      const auction = new Auction(validAuctionProps);
      const expectedStatus = AuctionStatusEnum.PUBLISHED;
      auction.publish();
      const auctionData = auction.toJSON();
      expect(auctionData.status).toEqual(expectedStatus);
    });

    it.each`
      status
      ${AuctionStatusEnum.PUBLISHED}
      ${AuctionStatusEnum.BID_PERIOD_FINISHED}
    `(
      'should not publish when status is $status',
      ({ status }: { status: AuctionStatusEnum }) => {
        const auction = new Auction({
          ...validAuctionProps,
          status,
        });
        const data = auction.toJSON();

        expect(() => auction.publish()).toThrow(
          `Auction can not be published with status ${data.status}`,
        );
      },
    );
  });

  describe('Bid', () => {
    it.each`
      status
      ${AuctionStatusEnum.CREATED}
      ${AuctionStatusEnum.BID_PERIOD_FINISHED}
    `('should not add a bid if auction status is $status', ({ status }: { status: AuctionStatusEnum }) => {
      const auction = buildAuction({
        status,
      });

      const input = {
        bidderId: randomUUID(),
        value: 200,
      };

      expect(() => auction.createBid(input)).toThrow(
        `Auction can not receive bid when status is '${status}'`,
      );
    });

    it('should not add a bid when bid period has not started', () => {
      const status = AuctionStatusEnum.PUBLISHED;
      const oneHourLater = new Date();
      oneHourLater.setUTCHours(oneHourLater.getUTCHours() + 1);

      const auction = buildAuction({
        status,
        startDate: oneHourLater.toISOString(),
      });

      const input = {
        bidderId: randomUUID(),
        value: 200,
      };

      expect(() => auction.createBid(input)).toThrow(
        'Bid period has not started yet',
      );
    });

    it('should not add a bid when bid period has finished', () => {
      const status = AuctionStatusEnum.PUBLISHED;

      const fitfteenDaysAgo = new Date();
      fitfteenDaysAgo.setUTCDate(fitfteenDaysAgo.getUTCDate() - 15);

      const fiveMinutesAgo = new Date();
      fiveMinutesAgo.setUTCMinutes(fiveMinutesAgo.getUTCMinutes() - 5);

      const auction = buildAuction({
        status,
        startDate: fitfteenDaysAgo.toISOString(),
        endDate: fiveMinutesAgo.toISOString(),
      });

      const input = {
        bidderId: randomUUID(),
        value: 200,
      };

      expect(() => auction.createBid(input)).toThrow(
        'Bid period is over',
      );
    });

    it('should not add a bid when it is lower than the start price', () => {
      const status = AuctionStatusEnum.PUBLISHED;
      const startPrice = 100;

      const auction = buildAuction({
        status,
        startPrice,
      });

      const input = {
        bidderId: randomUUID(),
        value: startPrice - 1,
      };

      expect(() => auction.createBid(input)).toThrow(
        'Bid value must be greater than start price',
      );
    });

    it('should not add a bid when it is lower than the highest bid', () => {
      const status = AuctionStatusEnum.PUBLISHED;
      const startPrice = 90;

      const bids = [
        buildBid({ value: new Price(200) }),
        buildBid({ value: new Price(300) }),
        buildBid({ value: new Price(100) }),
      ];

      const auction = buildAuction({
        status,
        startPrice,
        bids,
      });

      const input = {
        bidderId: randomUUID(),
        value: 300,
      };

      expect(() => auction.createBid(input)).toThrow(
        'Bid value is not greater than other bids',
      );
    });

    it('should add a bid successfully', () => {
      const status = AuctionStatusEnum.PUBLISHED;
      const startPrice = 100;

      const bids = [
        buildBid({ value: new Price(200) }),
        buildBid({ value: new Price(300) }),
        buildBid({ value: new Price(100) }),
      ];

      const auction = buildAuction({
        status,
        startPrice,
        bids,
      });

      const input = {
        bidderId: randomUUID(),
        value: 301,
      };

      const bid = auction.createBid(input);

      const bidData = bid.toJSON();
      const auctionBids = auction.toJSON().bids;

      expect(bid).toBeInstanceOf(Bid);
      expect(bidData.id).toBeTruthy();
      expect(bidData.auctionId).toEqual(auction.getId());
      expect(bidData.bidderId).toEqual(input.bidderId);
      expect(bidData.value).toEqual(input.value);
      expect(bidData.createdAt).toBeTruthy();
      expect(bidData.updatedAt).toBeTruthy();
      expect(auctionBids).toHaveLength(4);
    });
  });
});
