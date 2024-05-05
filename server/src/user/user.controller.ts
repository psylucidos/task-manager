import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.userService.create(createUserDto);
  // }

  // @Get()
  // findAll() {
  //   return this.userService.findAll();
  // }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    if (id === req.user.id) { // only execute request if client is user
      if (id.length === 36) {
        return this.userService.findOne(id);
      } else {
        throw new HttpException('Invalid ID format!', HttpStatus.BAD_REQUEST);
      }
    } else {
      throw new HttpException('Not authorized to get task!', HttpStatus.UNAUTHORIZED);
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Request() req) {
    if (id === req.user.id) { // only execute request if client is user
      if (id.length === 36) {
        return this.userService.update(id, updateUserDto);
      } else {
        throw new HttpException('Invalid ID format!', HttpStatus.BAD_REQUEST);
      }
    } else {
      throw new HttpException('Not authorized to get task!', HttpStatus.UNAUTHORIZED);
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    if (id === req.user.id) { // only execute request if client is user
      if (id.length === 36) {
        return this.userService.remove(id);
      } else {
        throw new HttpException('Invalid ID format!', HttpStatus.BAD_REQUEST);
      }
    } else {
      throw new HttpException('Not authorized to get task!', HttpStatus.UNAUTHORIZED);
    }
  }
}
