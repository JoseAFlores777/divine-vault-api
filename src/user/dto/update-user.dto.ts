import { PartialType } from '@nestjs/swagger';

import { CreateUserDto_request, SanitizedUserDto_response } from 'src/user/dto';

export class UpdateUserDto_request extends PartialType(CreateUserDto_request) {}
export class UpdateUserDto_response extends SanitizedUserDto_response {}
