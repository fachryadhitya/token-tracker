import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PriceModule } from './price/price.module';
import { AlertModule } from './alert/alert.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [PriceModule, AlertModule, MailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
