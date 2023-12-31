import { faker } from '@faker-js/faker';
import { connect, Mongoose } from 'mongoose';
import AuctioneerSchema, {
  AuctioneerModel,
  AuctioneerMongoInterface,
} from '../schemas/auctioneer.schema';
import AuctioneerMongoRepository from './auctioneer-mongo.repository';
import Auctioneer from '../../../../domain/entities/auctioneer.entity';
import buildAuctioneer from '../../../../../../../test/util/auctioneer.mock';

describe('AuctioneerMongoRepository', () => {
  let connection: Mongoose;
  let model: AuctioneerModel;
  let repository: AuctioneerMongoRepository;

  beforeEach(async () => {
    if (!connection) {
      connection = await connect(process.env.MONGO_URI, { dbName: faker.string.uuid() });
    }

    model = AuctioneerSchema.getModel(connection);
    repository = new AuctioneerMongoRepository(model);
    await connection.connection.db.dropDatabase();
  });

  afterAll(async () => {
    await connection.disconnect();
  });

  it('should save an auctioneer on the database', async () => {
    const auctioneer = Auctioneer.create({
      email: 'john.doe@email.com',
      name: { firstName: 'John', lastName: 'Doe' },
      registration: '12/345-A',
    });

    await repository.create(auctioneer);

    const savedAuctioneer = await model.findOne<Auctioneer>({
      id: auctioneer.getId(),
    }).exec();

    expect(savedAuctioneer.toJSON()).toEqual(
      expect.objectContaining({
        email: 'john.doe@email.com',
        firstName: 'John',
        lastName: 'Doe',
        registration: '12/345-A',
      }),
    );
  });

  it('should find an auctioneer by id as AuctioneerId', async () => {
    const auctioneer = Auctioneer.create({
      email: 'john.doe@email.com',
      name: { firstName: 'John', lastName: 'Doe' },
      registration: '12/345-A',
    });
    await repository.create(auctioneer);

    const foundAuctioneer = await repository.findById(auctioneer.getId());

    const auctioneerData = auctioneer.toJSON();
    const databaseData = foundAuctioneer.toJSON();

    expect(foundAuctioneer).toBeInstanceOf(Auctioneer);
    expect(databaseData.id).toEqual(auctioneerData.id);
    expect(databaseData.email).toEqual(auctioneerData.email);
    expect(databaseData.firstName).toEqual(auctioneerData.firstName);
    expect(databaseData.lastName).toEqual(auctioneerData.lastName);
    expect(databaseData.registration).toEqual(auctioneerData.registration);
    expect(databaseData.createdAt).toBeTruthy();
    expect(databaseData.updatedAt).toBeTruthy();
  });

  it('should find an auctioneer by id as string', async () => {
    const auctioneer = Auctioneer.create({
      email: 'john.doe@email.com',
      name: { firstName: 'John', lastName: 'Doe' },
      registration: '12/345-A',
    });
    await repository.create(auctioneer);

    const foundAuctioneer = await model.findOne<AuctioneerMongoInterface>({
      id: auctioneer.getId(),
    }).exec();

    expect(foundAuctioneer.id).toEqual(auctioneer.getId());
    expect(foundAuctioneer.email).toEqual('john.doe@email.com');
    expect(foundAuctioneer.firstName).toEqual('John');
    expect(foundAuctioneer.lastName).toEqual('Doe');
    expect(foundAuctioneer.registration).toEqual('12/345-A');
    expect(foundAuctioneer.createdAt).toBeInstanceOf(Date);
    expect(foundAuctioneer.updatedAt).toBeInstanceOf(Date);
  });

  describe('Find by email or registration', () => {
    it('should find an auctioneer by email', async () => {
      const email = faker.internet.email();
      const registration = '12/345-A';

      const auctioneer = buildAuctioneer({ email, registration });
      await repository.create(auctioneer);

      const foundAuctioneer = await repository.findByRegistrationOrEmail({
        email,
        registration: '',
      });

      const auctioneerData = auctioneer.toJSON();
      const foundAuctioneerData = foundAuctioneer.toJSON();

      expect(foundAuctioneer).toBeInstanceOf(Auctioneer);
      expect(foundAuctioneerData.id).toEqual(auctioneerData.id);
      expect(foundAuctioneerData.email).toEqual(auctioneerData.email);
      expect(foundAuctioneerData.firstName).toEqual(auctioneerData.firstName);
      expect(foundAuctioneerData.lastName).toEqual(auctioneerData.lastName);
      expect(foundAuctioneerData.registration).toEqual(auctioneerData.registration);
      expect(foundAuctioneerData.createdAt).toBeTruthy();
      expect(foundAuctioneerData.updatedAt).toBeTruthy();
    });

    it('should find an auctioneer by registration', async () => {
      const email = faker.internet.email();
      const registration = '12/345-A';

      const auctioneer = buildAuctioneer({ email, registration });
      await repository.create(auctioneer);

      const foundAuctioneer = await repository.findByRegistrationOrEmail({
        email: '',
        registration,
      });

      const auctioneerData = auctioneer.toJSON();
      const foundAuctioneerData = foundAuctioneer.toJSON();

      expect(foundAuctioneer).toBeInstanceOf(Auctioneer);
      expect(foundAuctioneerData.id).toEqual(auctioneerData.id);
      expect(foundAuctioneerData.email).toEqual(auctioneerData.email);
      expect(foundAuctioneerData.firstName).toEqual(auctioneerData.firstName);
      expect(foundAuctioneerData.lastName).toEqual(auctioneerData.lastName);
      expect(foundAuctioneerData.registration).toEqual(auctioneerData.registration);
      expect(foundAuctioneerData.createdAt).toBeTruthy();
      expect(foundAuctioneerData.updatedAt).toBeTruthy();
    });
  });
});
