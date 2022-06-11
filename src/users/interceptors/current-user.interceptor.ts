import { UsersService } from './../users.service';
import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private userService: UsersService) {}
  async intercept(context: ExecutionContext, handler: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const { userId } = request.session;

    if (userId) {
      request.currentUser = await this.userService.findOneById(userId);
    }

    return handler.handle();
  }
}
