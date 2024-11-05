import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertController } from './alert.controller';
import { AlertService } from './alert.service';
import { Alert } from './entities/alert.entity';
import { MailModule } from '../mail/mail.module';
import { PriceModule } from '../price/price.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Alert]),  // Register Alert entity
    MailModule,  // Import MailModule for email functionality
    PriceModule,  // Import PriceModule for price functionality
  ],
  controllers: [AlertController],
  providers: [AlertService],
  exports: [AlertService], // Export if other modules need to use AlertService
})
export class AlertModule {}
