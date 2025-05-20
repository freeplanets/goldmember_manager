import { Module } from '@nestjs/common';
import { UsersController } from '../controller/users.controller';
import { UsersService } from '../service/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../dto/schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { LoginToken, LoginTokenSchema } from '../dto/schemas/login-token.schema';

@Module({
  imports: [
    JwtModule,
    MongooseModule.forFeature([
      {name: User.name, schema:UserSchema},
      {name: LoginToken.name, schema: LoginTokenSchema},
    ])
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
