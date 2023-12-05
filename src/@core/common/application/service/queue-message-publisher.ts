export default interface QueueMessagePublisher {
  publish(payload: object): Promise<void>;
}
