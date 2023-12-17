// eslint-disable-next-line import/no-extraneous-dependencies
import { SQSClient, PurgeQueueCommand } from '@aws-sdk/client-sqs';
import { INestApplication } from '@nestjs/common';
import { SqsHelper, SqsQueueName } from '../../../src/@core/notification/infra/queue/sqs/client/sqs-helper';

export default class LocalStackSqs {
  private constructor(
    private readonly sqsHelper: SqsHelper,
  ) {}

  static async purgeAppQueues(app: INestApplication): Promise<void> {
    const sqsHelper = app.get(SqsHelper);
    const instance = new LocalStackSqs(sqsHelper);
    await instance.purgeQueues();
  }

  private async purgeQueues() {
    const queues = Object.values(SqsQueueName);

    const client = new SQSClient({
      endpoint: this.sqsHelper.getEndpoint(),
      region: this.sqsHelper.getRegion(),
    });

    const promises = queues.map((queueName) => {
      const queueUrl = this.sqsHelper.getQueueUrl(queueName);
      const command = new PurgeQueueCommand({ QueueUrl: queueUrl });
      return client.send(command);
    });

    await Promise.all(promises);
  }
}
