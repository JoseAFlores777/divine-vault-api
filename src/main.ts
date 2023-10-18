import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import configureGlobalValidationPipe from './config/globalPipes.config';
import setupSwagger from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configureGlobalValidationPipe(app);
  setupSwagger(app);
  await app.listen(3000);
}
bootstrap();
