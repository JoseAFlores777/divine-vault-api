import { UserDocument } from '../entities/user.entity';
import { SanitizedUserDto_response } from './sanitized-user.dto';

export type InternalUserSearchDto_response = UserDocument;

export class SanitizedUserSearchDto_response extends SanitizedUserDto_response {}
