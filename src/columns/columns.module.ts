import { Module } from '@nestjs/common';
import { ColumnsController } from './columns.controller';
import { ColumnsService } from './columns.service';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [ColumnsController],
  providers: [ColumnsService],
  imports: [PrismaModule, AuthModule]
})
export class ColumnsModule {}
