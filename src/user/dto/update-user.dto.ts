import { PartialType } from '@nestjs/swagger';
import { CreateUserDto_request, CreateUserDto_response } from './create-user.dto';

export class UpdateUserDto_request extends PartialType(CreateUserDto_request) {}
export class UpdateUserDto_response extends CreateUserDto_response {}
