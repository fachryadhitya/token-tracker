import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Price } from './entities/price.entity';
import { MailService } from '../mail/mail.service';
import Moralis from 'moralis';
import { TOKEN_ADDRESS } from 'src/utils/token';

@Injectable()
export class PriceService implements OnModuleInit {
  constructor(
    @InjectRepository(Price)
    private priceRepository: Repository<Price>,
    private mailService: MailService,
  ) {}

  async onModuleInit() {
    // Initialize Moralis when the module starts
    await Moralis.start({
      apiKey: process.env.MORALIS_API_KEY,
    });
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async trackPrices() {
    const prices = await this.fetchPrice('0x1', [TOKEN_ADDRESS.ETH, TOKEN_ADDRESS.POLYGON]);
    console.log({prices});
    prices.forEach((price) => {
      this.savePrice('0x1', price.tokenAddress, price.price );
      this.checkPriceChange('0x1', price.tokenAddress);
    });
  }

  async fetchPrice(chain: string, tokenAddress: string[]): Promise<{
    tokenAddress: string,
    price: number,
  }[]> {
    const response = await Moralis.EvmApi.token.getMultipleTokenPrices({
      chain,
      include: 'percent_change',
    }, {
      tokens: tokenAddress.map((address) => ({
        tokenAddress: address,
      })),
    });

    return response.raw.map((price) => ({
      tokenAddress: price.tokenAddress,
      price: price.usdPrice,
    }));
  }

  private async savePrice(chain: string, tokenAddress: string, price: number) {
    const priceEntity = this.priceRepository.create({
      chain,
      tokenAddress: tokenAddress.toLowerCase(),
      price,
    });
    await this.priceRepository.save(priceEntity);
  }

  private async checkPriceChange(chain: string, tokenAddress: string) {
    const currentPrice = await this.priceRepository.findOne({
      where: { chain, tokenAddress },
      order: { timestamp: 'DESC' },
    });

    const hourAgoPrice = await this.priceRepository.findOne({
      where: {
        chain,
        tokenAddress,
        timestamp: LessThanOrEqual(new Date(Date.now() - 1 * 60 * 60 * 1000)), // Get price from 1 hour ago
      },
      order: { timestamp: 'DESC' },
    });

    if (currentPrice && hourAgoPrice) {
      const changePercent = ((currentPrice.price - hourAgoPrice.price) / hourAgoPrice.price) * 100;
      
      if (changePercent > 3) {
        await this.mailService.sendPriceAlert(
          'hyperhire_assignment@hyperhire.in',
          chain,
          changePercent,
          currentPrice.price,
          tokenAddress
        );
      }
    }
  }

  async getHourlyPrices(chain: string) {
    const prices = await this.priceRepository
      .createQueryBuilder('price')
      .select([
        'date_trunc(\'hour\', price.timestamp) as hour',
        'price.chain',
        'LOWER(price.tokenAddress) as tokenAddress',
        'AVG(price.price) as price'
      ])
      .where('price.chain = :chain', { chain })
      .andWhere('price.timestamp >= NOW() - INTERVAL \'24 HOURS\'')
      .groupBy('date_trunc(\'hour\', price.timestamp), price.chain, LOWER(price.tokenAddress)')
      .orderBy('hour', 'DESC')
      .getRawMany();

    // Map token addresses to their names
    const reversedTokens = Object.entries(TOKEN_ADDRESS).reduce((acc, [key, value]) => {
      acc[value.toLowerCase()] = key;
      return acc;
    }, {});

    const data = prices.map((price) => ({
      hour: price.hour,
      chain: price.price_chain,
      tokenAddress: price.tokenaddress,
      price: price.price,
      tokenName: reversedTokens[price.tokenaddress]
    }));

    return data;
  }
}
