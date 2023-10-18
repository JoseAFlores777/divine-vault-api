import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { Tokens } from 'src/auth/dto/tokens.dto';
import { SanitizedUserDto_response } from '../../user/dto/sanitized-user.dto';

export class LoginDTO_request {
  @Transform(({ value }) => value.trim())
  @IsString()
  @IsOptional()
  username: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @Length(6, 20)
  @IsNotEmpty()
  password: string;
}

export class LoginDTO_response {
  constructor(
    public user: SanitizedUserDto_response,
    public tokens: Tokens
  ) {}
}
