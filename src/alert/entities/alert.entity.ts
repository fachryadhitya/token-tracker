import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Chain } from '../../utils/chain.enum';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Alert {
  @ApiProperty({
    description: 'The unique identifier of the alert',
    example: 1
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'The blockchain network for the token',
    enum: Chain,
    example: Chain.ETHEREUM,
    default: Chain.ETHEREUM
  })
  @Column({
    type: 'enum',
    enum: Chain,
    default: Chain.ETHEREUM
  })
  chain: Chain;

  @ApiProperty({
    description: 'Email address to send the alert notification',
    example: 'user@example.com'
  })
  @Column()
  email: string;

  @ApiProperty({
    description: 'Target price that will trigger the alert',
    example: 1500.50
  })
  @Column()
  targetPrice: number;

  @ApiProperty({
    description: 'Contract address of the token',
    example: '0x1234567890abcdef1234567890abcdef12345678'
  })
  @Column()
  tokenAddress: string;

  @ApiProperty({
    description: 'Indicates if the alert has been triggered',
    default: false,
    example: false
  })
  @Column({ default: false })
  triggered: boolean;
}
