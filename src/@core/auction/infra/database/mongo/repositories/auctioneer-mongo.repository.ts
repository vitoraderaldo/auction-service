import AuctioneerRepository from '../../../../domain/repositories/auctioneer.repository';
import Auctioneer from '../../../../domain/entities/auctioneer.entity';
import AuctioneerSchema, {
  AuctioneerModel,
} from '../schemas/auctioneer.schema';
import Uuid from '../../../../../common/domain/value-objects/uuid.vo';

export default class AuctioneerMongoRepository implements AuctioneerRepository {
  constructor(private readonly model: AuctioneerModel) {}

  async findById(id: Uuid | string): Promise<Auctioneer> {
    const value = typeof id === 'string' ? new Uuid(id) : id;
    const document = await this.model.findOne({
      id: value.value,
    }).exec();

    return AuctioneerSchema.toDomain(document);
  }

  async create(auctioneer: Auctioneer): Promise<void> {
    const data = AuctioneerSchema.toDatabase(auctioneer);
    await this.model.create(data);
  }

  async findByRegistrationOrEmail(params: {
    registration: string
    email: string
  }): Promise<Auctioneer> {
    const document = await this.model.findOne({
      $or: [
        { registration: params.registration },
        { email: params.email },
      ],
    }).exec();
    return AuctioneerSchema.toDomain(document);
  }
}
