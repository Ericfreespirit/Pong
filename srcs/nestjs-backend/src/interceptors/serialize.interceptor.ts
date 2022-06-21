import {
	UseInterceptors,
	NestInterceptor,
	ExecutionContext,
	CallHandler
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';

export function Serialize(dto: ClassConstructor) {
	return UseInterceptors(new SerializeInterceptor(dto));
}

interface ClassConstructor {
	new (...args: any[]): {}
}

export class SerializeInterceptor implements NestInterceptor {	

	constructor (private dto: ClassConstructor) {}

	intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
		return handler.handle().pipe(
			map((data: any) => {
				return plainToClass(this.dto, data, {
					excludeExtraneousValues: true,
				});
			})
		);
	}	
}
