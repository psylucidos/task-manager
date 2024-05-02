import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpException
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    for(let i = 0; i < createTaskDto.dependencies.length; i++) {
      if (createTaskDto.dependencies[i].length !== 36) {
        throw new HttpException('Invalid dependency ID format!', HttpStatus.BAD_REQUEST);
      }
    }

    for(let i = 0; i < createTaskDto.subtasks.length; i++) {
      if (createTaskDto.subtasks[i].length !== 36) {
        throw new HttpException('Invalid subtask ID format!', HttpStatus.BAD_REQUEST);
      }
    }

    return this.taskService.create(createTaskDto);
  }

  @Get()
  findAll() {
    return this.taskService.findAll();
  }

  @Get('/author/:id')
  findByAuthor(@Param('id') id: string) {
    if (id.length === 36) {
      return this.taskService.findByAuthor(id);
    } else {
      throw new HttpException('Invalid ID format!', HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    if (id.length === 36) {
      return this.taskService.findOne(id);
    } else {
      throw new HttpException('Invalid ID format!', HttpStatus.BAD_REQUEST);
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    for(let i = 0; i < updateTaskDto.dependencies.length; i++) {
      if (updateTaskDto.dependencies[i].length !== 36) {
        throw new HttpException('Invalid dependency ID format!', HttpStatus.BAD_REQUEST);
      }
    }

    for(let i = 0; i < updateTaskDto.subtasks.length; i++) {
      if (updateTaskDto.subtasks[i].length !== 36) {
        throw new HttpException('Invalid subtask ID format!', HttpStatus.BAD_REQUEST);
      }
    }

    if (id.length === 36) {
      return this.taskService.update(id, updateTaskDto);
    } else {
      throw new HttpException('Invalid ID format!', HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    if (id.length === 36) {
      return this.taskService.remove(id);
    } else {
      throw new HttpException('Invalid ID format!', HttpStatus.BAD_REQUEST);
    }
  }
}
