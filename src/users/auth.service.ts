import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes, scrypt as _script } from 'crypto';
import { promisify } from 'util';
import { UsersService } from './users.service';

const scrypt = promisify(_script);

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async signup(email: string, password: string) {
    //check if email exists
    const users = await this.userService.findByEmail(email);
    if (users.length) {
      throw new BadRequestException('Email already in use');
    }

    //hash the password
    //generate salt
    const salt = randomBytes(8).toString('hex');

    //hash password and salt
    const hash = (await scrypt(password, salt, 64)) as Buffer;
    const hashedPassword = salt + '.' + hash.toString('hex');
    const user = await this.userService.create(email, hashedPassword);

    return user;
  }

  async signin(email: string, password: string) {
    //check if email exists
    const [user] = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('Email not found');
    }

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 64)) as Buffer;

    if (hash.toString('hex') !== storedHash) {
      throw new BadRequestException('Incorrect Pasword');
    }

    return user;
  }
}
