import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);
  const port = configService.get('port');

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Crypto Price Tracker API')
    .setDescription('API for tracking cryptocurrency prices and sending alerts')
    .setVersion('1.0')
    .addTag('prices')
    .addTag('alerts')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  console.log({port});
  await app.listen(port);
}

bootstrap();
