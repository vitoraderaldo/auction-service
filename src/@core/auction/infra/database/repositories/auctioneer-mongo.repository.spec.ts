import { connect, Mongoose } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import {
  AuctioneerModel,
  AuctioneerSchema,
} from '../schemas/auctioneer.schema';
import { AuctioneerMongoRepository } from './auctioneer-mongo.repository';
import { Auctioneer } from '../../../domain/entities/auctioneer.entity';
import { Email } from '../../../../common/domain/value-objects/email.vo';
import { PersonName } from '../../../../common/domain/value-objects/person-name.vo';
import { AuctioneerRegistration } from '../../../domain/value-objects/auctioneer-registration.vo';

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
      email: new Email('john.doe@email.com'),
      name: new PersonName({ firstName: 'John', lastName: 'Doe' }),
      registration: new AuctioneerRegistration('12/345-A'),
    });

    await repository.save(auctioneer);

    const savedAuctioneer = await model.findOne({ id: auctioneer.id.value });
    expect(savedAuctioneer).toEqual(
      expect.objectContaining({
        id: auctioneer.id.value,
        email: auctioneer.email.value,
        firstName: auctioneer.name.value.firstName,
        lastName: auctioneer.name.value.lastName,
        registration: auctioneer.registration.value,
      }),
    );
  });

  it('should find an auctioneer by id as AuctioneerId', async () => {
    const auctioneer = Auctioneer.create({
      email: new Email('john.doe@email.com'),
      name: new PersonName({ firstName: 'John', lastName: 'Doe' }),
      registration: new AuctioneerRegistration('12/345-A'),
    });
    await repository.save(auctioneer);

    const foundAuctioneer = await repository.findById(auctioneer.id);

    expect(foundAuctioneer).toBeInstanceOf(Auctioneer);
    expect(foundAuctioneer).toStrictEqual(auctioneer);
  });

  it('should find an auctioneer by id as string', async () => {
    const auctioneer = Auctioneer.create({
      email: new Email('john.doe@email.com'),
      name: new PersonName({ firstName: 'John', lastName: 'Doe' }),
      registration: new AuctioneerRegistration('12/345-A'),
    });
    await repository.save(auctioneer);

    const foundAuctioneer = await repository.findById(auctioneer.id.value);

    expect(foundAuctioneer).toBeInstanceOf(Auctioneer);
    expect(foundAuctioneer).toStrictEqual(auctioneer);
  });
});
