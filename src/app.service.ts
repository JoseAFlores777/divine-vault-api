import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): any {
    return {
      statusCode: 200,
      body: 'Hello from lambda', // <-- here
    };
  }
}
