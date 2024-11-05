import { Controller, Get, Param } from '@nestjs/common';
import { PriceService } from './price.service';
import { ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';

@ApiTags('prices')
@Controller('prices')
export class PriceController {
  constructor(private readonly priceService: PriceService) {}

  @Get(':chain')
  @ApiOperation({ summary: 'Get hourly prices for a specific chain' })
  @ApiParam({ 
    name: 'chain', 
    description: 'Blockchain network identifier (e.g., "0x1" for Ethereum)',
    example: '0x1'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns hourly price data for the last 24 hours',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          hour: { type: 'string', format: 'date-time' },
          chain: { type: 'string' },
          tokenAddress: { type: 'string' },
          price: { type: 'string' },
          tokenName: { type: 'string' }
        }
      }
    }
  })
  getHourlyPrices(@Param('chain') chain: string) {
    return this.priceService.getHourlyPrices(chain);
  }
}
