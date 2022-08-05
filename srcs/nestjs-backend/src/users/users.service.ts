import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {LocalFileDto} from './dtos/localFile.dto';
import {User} from './entities/users.entity';
import {LocalFilesService} from './localFiles.service';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User) private repo: Repository<User>,
		private localFilesService: LocalFilesService
	) {}

	async turnOffTwoFactorAuthentication(userId: number) {
		return this.repo.update(userId, {
			twoFactorAuthenticationFlag: false
		});
	}

	async turnOntTwoFactorAuthentication(userId: number) {
		return this.repo.update(userId, {
			twoFactorAuthenticationFlag: true	
		});
	}

	async setTwoFactorAuthenticationSecret(secret: string, userId: number) {
		return this.repo.update(userId, {
			twoFactorAuthenticationSecret: secret
		});
	}

	async addAvatar(userId: number, fileData: LocalFileDto) {
		const avatar = await this.localFilesService.saveLocalFileData(fileData);
		await this.repo.update(userId, {
			avatarId: avatar.id,
			defaultAvatar: false,
		})
	}

	async getFriends(user: User) {
		const t_user = await this.repo.findOne({
			relations: ['sentFriendRequests', 'recivedFriendRequests'],
			where: {id: user.id},
		});

		return t_user.recivedFriendRequests;
	}

	create(email: string, password: string, firstName: string, lastName: string) {
		const user = this.repo.create({ email, password, firstName, lastName });

		return this.repo.save(user);
	}

	findOne(id: number) {
		if (!id) {
			return null;
		}

		return this.repo.findOneBy({id});
	}

	// auth42Login(req) {
	// 	if (!req.user) {
	// 	  return 'No user from 42'
	// 	}
	// 	return {
	// 	  message: 'User Info from 42',
	// 	  user: req.user
	// 	}
	//   }

	findEmail(email: string) {
		return this.repo.findBy({email});
	}

	findLogin(login: string) {
		return this.repo.findBy({login});
	}

	async update(user: User, attrs: Partial<User>) {
	/*	console.log(111)
		console.log(attrs)
		console.log(attrs.firstName?.length)
		if (attrs.login?.length == 0 
			|| attrs.firstName?.length == 0 
			|| attrs.lastName?.length == 0 ) {
				throw new BadRequestException('Empty');
			}*/
		if (attrs.email && attrs.email != user.email) {
			
			const email = await this.findEmail(attrs.email);

			if (email.length) {
				throw new BadRequestException('email in use');
			}
		}
		if (attrs.login && attrs.login != user.login)  {
			
			const login = await this.findLogin(attrs.login);

			if (login.length) {
				throw new BadRequestException('login in use');
			}
		}
		Object.assign(user, attrs);
		return this.repo.save(user);	
	}

	async remove(id: number) {
		const user = await this.findOne(id);
		if (!user) {
			throw new NotFoundException('user not found');
		}
		return this.repo.remove(user);
	}
}
