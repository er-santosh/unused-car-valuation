import { UserDto } from './dtos/user.dto';
import { Serialize } from './../interceptors/serialize.interceptor';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';

@Controller('auth')
@Serialize(UserDto) //serialize all routes
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Post('/signup')
  createUser(@Body() body: CreateUserDto) {
    this.usersService.create(body.email, body.password);
  }

  // @Serialize(UserDto) //route based serializer
  @Get('/:id')
  findUser(@Param('id') id: string) {
    return this.usersService.findOneById(parseInt(id));
  }

  @Get()
  findUserByEmail(@Query('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  @Delete('/:id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id), body);
  }
}
