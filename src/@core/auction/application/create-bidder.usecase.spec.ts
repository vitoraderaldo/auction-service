import { createMock } from '@golevelup/ts-jest';
import { faker } from '@faker-js/faker';
import BidderRepository from '../domain/repositories/bidder.repository';
import buildBidder from '../../../../test/util/bidder.mock';
import CreateBidderUseCase from './create-bidder.usecase';

describe('Create Bidder Use Case', () => {
  let useCase: CreateBidderUseCase;
  let bidderRepository: BidderRepository;

  beforeEach(() => {
    bidderRepository = createMock<BidderRepository>();

    useCase = new CreateBidderUseCase(bidderRepository);
  });

  it('should not create a bidder if already exists', async () => {
    const bidder = buildBidder();
    jest
      .spyOn(bidderRepository, 'findByEmail')
      .mockResolvedValueOnce(bidder);

    const input = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
    };

    const result = useCase.execute(input);
    await expect(result).rejects.toThrow('Bidder already exists');
  });

  it('should create a bidder', async () => {
    jest
      .spyOn(bidderRepository, 'findByEmail')
      .mockResolvedValueOnce(null);

    const saveSpy = jest.spyOn(bidderRepository, 'save');

    const input = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
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
