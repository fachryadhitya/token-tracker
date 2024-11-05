import { Controller, Post, Body, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AlertService } from './alert.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { Alert } from './entities/alert.entity';

@ApiTags('alerts')
@Controller('alerts')
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Create a price alert',
    description: 'Creates a new price alert for a specific token. The alert will trigger when the token reaches the target price.'
  })
  @ApiBody({
    type: CreateAlertDto,
    examples: {
      ethereum: {
        summary: 'Token Alert',
        description: 'Example of creating an alert for an ERC-20 token, for this project, we only support Ethereum and Polygon',
        value: {
          chain: 'ethereum',
          email: 'user@example.com',
          targetPrice: 1500,
        }
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'The alert has been successfully created.',
    type: Alert
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Invalid input (e.g., invalid email or token address)' 
  })
  createAlert(@Body() createAlertDto: CreateAlertDto) {
    return this.alertService.createAlert(createAlertDto);
  }

  @Get('/check')
  @ApiOperation({ 
    summary: 'Check all alerts',
    description: 'Manually triggers a check of all active price alerts against current prices'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns the number of alerts checked and triggered',
    schema: {
      type: 'object',
      properties: {
        checked: { type: 'number', example: 10 },
        triggered: { type: 'number', example: 2 }
      }
    }
  })
  checkAlerts() {
    return this.alertService.checkAlertsSchedule();
  }
}
