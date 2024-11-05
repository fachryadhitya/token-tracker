import { IsEmail, IsEnum, IsNumber } from 'class-validator';
import { Chain } from '../../utils/chain.enum';

export class CreateAlertDto {
  @IsEnum(Chain, { message: 'Chain must be either ethereum or polygon' })
  chain: Chain;

  @IsEmail()
  email: string;

  @IsNumber()
  targetPrice: number;
}
