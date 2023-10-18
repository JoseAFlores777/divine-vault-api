import { Tokens } from 'src/auth/dto/tokens.dto';
import { CreateUserDto_request, SanitizedUserDto_response } from 'src/user/dto';

export class RegisterDTO_request extends CreateUserDto_request {}

export class RegisterDTO_response {
  constructor(
    public user: SanitizedUserDto_response,
    public tokens: Tokens
  ) {}
}
