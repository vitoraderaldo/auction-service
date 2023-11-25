import { Controller, Get } from '@nestjs/common';

@Controller('/v1/health')
export default class HealthController {
  private okMessage = 'OK';

  @Get()
  getHealth(): string {
    return this.okMessage;
  }
}
