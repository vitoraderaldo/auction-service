import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AuctioneerId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.auctioneerId;
  },
);

export const BidderId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.bidderId;
  },
);
