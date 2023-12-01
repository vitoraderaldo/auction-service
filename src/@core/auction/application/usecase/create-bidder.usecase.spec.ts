import { createMock } from '@golevelup/ts-jest';
import { faker } from '@faker-js/faker';
import BidderRepository from '../../domain/repositories/bidder.repository';
import buildBidder from '../../../../../test/util/bidder.mock';
import CreateBidderUseCase from './create-bidder.usecase';
import BidderAlreadyExistsError from '../../../common/error/bidder-already-exists';
import { generateFirstName, generateLastName } from '../../../../../test/util/string-generation';

describe('Create Bidder Use Case', () => {
  let useCase: CreateBidderUseCase;
  let bidderRepository: BidderRepository;

  beforeEach(() => {
    bidderRepository = createMock<BidderRepository>();

    useCase = new CreateBidderUseCase(bidderRepository, console);
  });

  it('should not create a bidder if already exists', async () => {
    const bidder = buildBidder();
    jest
      .spyOn(bidderRepository, 'findByEmail')
      .mockResolvedValueOnce(bidder);

    const input = {
      firstName: generateFirstName(),
      lastName: generateLastName(),
      email: faker.internet.email(),
    };

    try {
      await useCase.execute(input);
      expect(true).toEqual(false);
    } catch (err) {
      expect(err).toBeInstanceOf(BidderAlreadyExistsError);
      expect(err.details).toEqual({
        email: input.email,
      });
    }
  });

  it('should create a bidder', async () => {
    jest
      .spyOn(bidderRepository, 'findByEmail')
      .mockResolvedValueOnce(null);

    const saveSpy = jest.spyOn(bidderRepository, 'create');

    const input = {
      firstName: generateFirstName(),
      lastName: generateLastName(),
      email: faker.internet.email(),
    };

    const result = await useCase.execute(input);
    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(result.id).toBeDefined();
    expect(result.firstName).toEqual(input.firstName);
    expect(result.lastName).toEqual(input.lastName);
    expect(result.email).toEqual(input.email);
    expect(result.createdAt).toBeTruthy();
    expect(result.updatedAt).toBeTruthy();
  });
});
