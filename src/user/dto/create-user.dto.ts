import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { UserDocument } from '../entities/user.entity';

export class CreateUserDto_request {
  @Transform(({ value }) => value.trim())
  @IsString()
  @Length(4, 20)
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @Length(6, 20)
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  createdAt: Date;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  updatedAt: Date;

  @IsOptional()
  refreshToken: string;
}

export type CreateUserDto_response = UserDocument;
