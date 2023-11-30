import { createMock } from '@golevelup/ts-jest';
import { faker } from '@faker-js/faker';
import AuctioneerRepository from '../domain/repositories/auctioneer.repository';
import CreateAuctioneerUseCase from './create-auctioneer.usecase';
import buildAuctioneer from '../../../../test/util/auctioneer.mock';
import AuctioneerAlreadyExistsError from '../../common/error/auctioneer-already-exists';

describe('CreateAuctioneerUseCase', () => {
  let auctioneerRepository: AuctioneerRepository;
  let useCase: CreateAuctioneerUseCase;

  beforeEach(async () => {
    auctioneerRepository = createMock<AuctioneerRepository>();
    useCase = new CreateAuctioneerUseCase(auctioneerRepository);
  });

  it('should not create an auctioneer if it already exists', async () => {
    const auctioneer = buildAuctioneer();

    jest
      .spyOn(auctioneerRepository, 'findByRegistrationOrEmail')
      .mockResolvedValueOnce(auctioneer);

    const input = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      registration: auctioneer.getRegistration(),
    };

    const response = useCase.execute(input);
    await expect(response).rejects.toThrow(AuctioneerAlreadyExistsError);
  });

  it('should create an auctioneer successfully', async () => {
    jest
      .spyOn(auctioneerRepository, 'findByRegistrationOrEmail')
      .mockResolvedValueOnce(null);

    const saveSpy = jest.spyOn(auctioneerRepository, 'create');

    const input = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      registration: '12/123-C',
    };

    const response = await useCase.execute(input);

    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(response.id).toBeDefined();
    expect(response.firstName).toEqual(input.firstName);
    expect(response.lastName).toBe(input.lastName);
    expect(response.email).toEqual(input.email);
    expect(response.registration).toEqual(input.registration);
    expect(response.createdAt).toBeDefined();
    expect(response.updatedAt).toBeDefined();
  });
});
