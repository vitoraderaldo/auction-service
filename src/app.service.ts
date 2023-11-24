import { Injectable } from '@nestjs/common';

@Injectable()
export default class AppService {
  private readonly message = 'Hello World!';

  getHello(): string {
    return this.message;
  }
}
