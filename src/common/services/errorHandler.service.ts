import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { MongoError } from 'mongodb';

@Injectable()
export class ErrorHandlerService {
  handleError(error: MongoError | any): void {
    switch (error.code) {
      case 11000:
        throw new BadRequestException(
          `Duplicate key error. Data: ${JSON.stringify(error.keyValue)}`
        );
      case 11010:
        throw new BadRequestException(
          `Duplicate key error (composite unique index). Data: ${JSON.stringify(error.keyValue)}`
        );
      case 121:
        throw new BadRequestException('Duplicate key error (deprecated).');
      default:
        console.error(error);
        throw new InternalServerErrorException(
          'An error occurred while processing the request. Check the logs for details.'
        );
    }
  }
}
