import { Module } from '@nestjs/common';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [CardsController],
  providers: [CardsService],
  imports: [PrismaModule, AuthModule]
})
export class CardsModule {}
