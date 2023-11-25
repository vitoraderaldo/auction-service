import { connect, Mongoose } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import AuctioneerSchema, {
  AuctioneerModel, AuctioneerMongoInterface,
} from '../schemas/auctioneer.schema';
import AuctioneerMongoRepository from './auctioneer-mongo.repository';
import Auctioneer from '../../../domain/entities/auctioneer.entity';

describe('AuctioneerMongoRepository', () => {
  let mongoServer: MongoMemoryServer;
  let connection: Mongoose;
  let model: AuctioneerModel;
  let repository: AuctioneerMongoRepository;

  beforeEach(async () => {
    if (!connection) {
      mongoServer = await MongoMemoryServer.create();
      connection = await connect(mongoServer.getUri());
    }

    model = AuctioneerSchema.getModel(connection);
    repository = new AuctioneerMongoRepository(model);
    await connection.connection.db.dropDatabase();
  });

  afterAll(async () => {
    await connection.disconnect();
    mongoServer.stop();
  });

  it('should save an auctioneer on the database', async () => {
    const auctioneer = Auctioneer.create({
      email: 'john.doe@email.com',
      name: { firstName: 'John', lastName: 'Doe' },
      registration: '12/345-A',
    });

    await repository.save(auctioneer);

    const savedAuctioneer = await model.findOne<Auctioneer>({ id: auctioneer.getId() });

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
    await repository.save(auctioneer);

    const foundAuctioneer = await repository.findById(auctioneer.getId());

    expect(foundAuctioneer).toBeInstanceOf(Auctioneer);
    expect(foundAuctioneer).toStrictEqual(auctioneer);
  });

  it('should find an auctioneer by id as string', async () => {
    const auctioneer = Auctioneer.create({
      email: 'john.doe@email.com',
      name: { firstName: 'John', lastName: 'Doe' },
      registration: '12/345-A',
    });
    await repository.save(auctioneer);

    const foundAuctioneer = await model.findOne<AuctioneerMongoInterface>({
      id: auctioneer.getId(),
    });

    expect(foundAuctioneer.id).toEqual(auctioneer.getId());
    expect(foundAuctioneer.email).toEqual('john.doe@email.com');
    expect(foundAuctioneer.firstName).toEqual('John');
    expect(foundAuctioneer.lastName).toEqual('Doe');
    expect(foundAuctioneer.registration).toEqual('12/345-A');
    expect(foundAuctioneer.createdAt).toBeInstanceOf(Date);
    expect(foundAuctioneer.updatedAt).toBeInstanceOf(Date);
  });
});
