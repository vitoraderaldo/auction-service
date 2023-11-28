/* eslint-disable class-methods-use-this */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export default class AuctioneerGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const auctioneerId = request.headers.authorization as string;
      // todo: replace with actual token validation
      request.auctioneerId = auctioneerId;
      return !!auctioneerId;
    } catch (error) {
      return false;
    }
  }
}
