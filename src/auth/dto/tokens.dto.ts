import { SanitizedUserDto_response } from 'src/user/dto/sanitized-user.dto';

export class Tokens {
  accessToken: string;
  refreshToken: string;
}

export class RefreshToken_response {
  constructor(
    public user: SanitizedUserDto_response,
    public tokens: Tokens
  ) {}
}
