import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Alert } from './entities/alert.entity';
import { CreateAlertDto } from './dto/create-alert.dto';
import { MailService } from '../mail/mail.service';
import { PriceService } from '../price/price.service';
import { TOKEN_ADDRESS } from 'src/utils/token';
import { Chain } from 'src/utils/chain.enum';

@Injectable()
export class AlertService {
  constructor(
    @InjectRepository(Alert)
    private alertRepository: Repository<Alert>,
    private mailService: MailService,
    private priceService: PriceService,
  ) {}

  async createAlert(createAlertDto: CreateAlertDto) {
    const alert = this.alertRepository.create(createAlertDto);
    
    if (alert.chain === Chain.ETHEREUM) {
      alert.tokenAddress = TOKEN_ADDRESS.ETH;
    } else {
      alert.tokenAddress = TOKEN_ADDRESS.POLYGON;
    }

    return this.alertRepository.save(alert);
  }

  @Cron(CronExpression.EVERY_HOUR)
  async checkAlertsSchedule() {
    // Get unique combinations of chain and tokenAddress from active alerts
    const activeAlerts = await this.alertRepository
      .createQueryBuilder('alert')
      .select('DISTINCT alert.chain, alert.tokenAddress')
      .where('alert.triggered = :triggered', { triggered: false })
      .getRawMany();

    if (activeAlerts.length === 0) return { checked: 0, triggered: 0 };

    // Get unique token addresses
    const tokenAddresses = [...new Set(activeAlerts.map(alert => alert.tokenAddress))];
    
    // Fetch prices for all needed tokens at once
    const prices = await this.priceService.fetchPrice('0x1', tokenAddresses);
    
    // Create a map of token addresses to their prices
    const priceMap = Object.fromEntries(
      tokenAddresses.map((address, index) => [address, prices[index]])
    );

    // Check alerts for each chain/token combination
    for (const alert of activeAlerts) {
      const currentPrice = priceMap[alert.tokenAddress];
      await this.checkAlerts(
        alert.chain,
        alert.tokenAddress,
        currentPrice
      );
    }
  }

  private async checkAlerts(chain: Chain, tokenAddress: string, currentPrice: number) {
    const alerts = await this.alertRepository.find({
      where: {
        chain,
        tokenAddress,
        triggered: false,
      },
    });

    for (const alert of alerts) {
      if (currentPrice >= alert.targetPrice) {
        
        await this.mailService.sendTargetPriceAlert(
          alert.email,
          chain,
          alert.targetPrice,
          currentPrice,
        );
        
        alert.triggered = true;
        await this.alertRepository.save(alert);
      }
    }
  }
}
