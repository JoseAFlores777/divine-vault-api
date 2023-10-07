import { INestApplication, ValidationPipe } from '@nestjs/common';

export default function configureGlobalValidationPipe(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );
}
