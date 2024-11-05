import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertController } from './alert.controller';
import { AlertService } from './alert.service';
import { Alert } from './entities/alert.entity';
import { MailModule } from '../mail/mail.module';
import { PriceModule } from '../price/price.module';

@Module({
  imports: [TypeOrmModule.forFeature([Alert]), MailModule, PriceModule],
  controllers: [AlertController],
  providers: [AlertService],
  exports: [AlertService], 
})
export class AlertModule {}
