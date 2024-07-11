import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || "SECRETS",
      signOptions: {
        expiresIn: "24h"
      }}),
    forwardRef(() => UserModule)
  ],
  exports: [AuthService, JwtModule]
})
export class AuthModule {}
