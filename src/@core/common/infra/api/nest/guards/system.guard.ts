import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export default class SystemGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const systemId = request.headers.authorization as string;
      // todo: replace with actual token validation
      request.systemId = systemId;
      return !!systemId;
    } catch (error) {
      return false;
    }
  }
}
