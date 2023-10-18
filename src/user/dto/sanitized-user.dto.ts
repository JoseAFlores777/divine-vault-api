import { Expose, plainToClass } from 'class-transformer';
import { UserDocument } from '../entities/user.entity';

export class SanitizedUserDto_response {
  @Expose()
  id: string;

  @Expose()
  username: string;

  @Expose()
  email: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  constructor(partial: Partial<UserDocument>) {
    Object.assign(
      this,
      plainToClass(SanitizedUserDto_response, partial, { excludeExtraneousValues: true })
    );
  }
}
