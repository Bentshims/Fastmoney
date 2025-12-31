
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export class UserPayload {
    sub: string;
    email: string;
    role: string;
    businessId: string;
}

export const CurrentUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);
