import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { FriendRequest } from './friendRequest.entity';
import { CurrentUserMiddleware } from './middleware/current-user.middleware';
import { GoogleStrategy } from './google.strategy';
import {FriendRequestService} from './friendRequest.service';
import {FriendRequestController} from './friendRequest.controller';

@Module({
	imports: [TypeOrmModule.forFeature([User]), TypeOrmModule.forFeature([FriendRequest])],
	controllers: [UsersController, FriendRequestController],
  providers: [
		UsersService,
		AuthService,
		FriendRequestService,
		GoogleStrategy,
	]
})

export class UsersModule {
	configure(consume: MiddlewareConsumer) {
		consume.apply(CurrentUserMiddleware).forRoutes('*');
	}
}
