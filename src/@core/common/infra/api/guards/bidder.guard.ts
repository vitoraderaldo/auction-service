/* eslint-disable class-methods-use-this */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export default class BidderGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const bidderId = request.headers.authorization as string;
      // todo: replace with actual token validation
      request.bidderId = bidderId;
      return !!bidderId;
    } catch (error) {
      return false;
    }
  }
}
