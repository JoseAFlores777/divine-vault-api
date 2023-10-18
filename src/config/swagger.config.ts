import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export default function setupSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('My REST API documentation')
    .setVersion('1.0.0')
    .addTag('Api Tag')
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('api', app, document);
}
