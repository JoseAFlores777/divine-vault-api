import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import setupSwagger from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

setupSwagger(app);
  await app.listen(3000);
}
bootstrap();
