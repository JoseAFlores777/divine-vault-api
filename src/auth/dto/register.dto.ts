import { Tokens } from 'src/auth/dto/tokens.dto';
import { SanitizedUserDto_response } from 'src/user/dto/sanitized-user.dto';
import { CreateUserDto_request } from '../../user/dto/create-user.dto';

export class RegisterDTO_request extends CreateUserDto_request {}

export class RegisterDTO_response {
  constructor(
    public user: SanitizedUserDto_response,
    public tokens: Tokens
  ) {}
}
