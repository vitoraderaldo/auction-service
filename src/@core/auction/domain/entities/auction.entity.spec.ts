import { IsoStringDate } from '../../../common/domain/value-objects/iso-string-data.vo';
import { Price } from '../../../common/domain/value-objects/price.vo';
import { AuctionPhoto } from '../value-objects/auction-photo.vo';
import {
  AuctionStatus,
  AuctionStatusEnum,
} from '../value-objects/auction-status.vo';
import {
  Auction,
  AuctionConstructorProps,
  AuctionCreateProps,
  AuctionId,
} from './auction.entity';

describe('Auction', () => {
  let auction: Auction;
  let validAuctionProps: AuctionConstructorProps;

  beforeEach(() => {
    validAuctionProps = {
      id: new AuctionId(),
      title: 'Test Auction',
      description: 'Auction description',
      photos: [new AuctionPhoto({ link: 'https://example.com/photo.jpg' })],
      startDate: new IsoStringDate('2023-01-01T00:00:00.000Z'),
      endDate: new IsoStringDate('2023-01-02T00:00:00.000Z'),
      startPrice: new Price(100),
      currentPrice: null,
      status: new AuctionStatus(AuctionStatusEnum.CREATED),
      auctioneerId: 'auctioneer-id',
      createdAt: new IsoStringDate('2023-01-01T00:00:00.000Z'),
      updatedAt: new IsoStringDate('2023-01-01T00:00:00.000Z'),
    };

    auction = new Auction(validAuctionProps);
  });

  describe('constructor', () => {
    it('should create an Auction instance with valid properties', () => {
      expect(auction).toBeInstanceOf(Auction);
      expect(auction.toJSON()).toEqual(validAuctionProps);
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
        endDate: new IsoStringDate('2023-01-01T00:00:00.000Z'),
        startDate: new IsoStringDate('2023-01-02T00:00:00.000Z'),
      };
      expect(() => new Auction(invalidProps)).toThrow(
        'End date must be after start date',
      );
    });
  });

  describe('create', () => {
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
      expect(auction).toBeInstanceOf(Auction);
      expect(auction.id).toBeInstanceOf(AuctionId);
      expect(
        auction.status.isEqualTo(new AuctionStatus(AuctionStatusEnum.CREATED)),
      ).toBe(true);
      expect(auction.currentPrice).toBeNull();
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

  describe('publish', () => {
    it('should publish an auction', () => {
      const expectedStatus = new AuctionStatus(AuctionStatusEnum.PUBLISHED);
      auction.publish();
      expect(auction.status.isEqualTo(expectedStatus)).toBe(true);
    });

    it.each`
      status
      ${AuctionStatusEnum.PUBLISHED}
      ${AuctionStatusEnum.BID_PERIOD_FINISHED}
    `(
      'should not publish when status is $status',
      ({ status }: { status: AuctionStatusEnum }) => {
        auction = new Auction({
          ...validAuctionProps,
          status: new AuctionStatus(status),
        });

        expect(() => auction.publish()).toThrow(
          `Auction can not be published with status ${auction.status.toString()}`,
        );
      },
    );
  });
});
