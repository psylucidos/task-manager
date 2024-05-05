import {
  Controller,
  Request,
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
  create(@Body() createTaskDto: CreateTaskDto, @Request() req) {
    if (createTaskDto.author !== req.user.id) {
      throw new HttpException('Not authorized to author task!', HttpStatus.UNAUTHORIZED);
    }

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

  // @Get()
  // findAll() {
  //   return this.taskService.findAll();
  // }

  @Get('/author/:id')
  findByAuthor(@Param('id') id: string, @Request() req) {
    if (id === req.user.id) { // only execute request if client is author
      if (id.length === 36) {
        return this.taskService.findByAuthor(id);
      } else {
        throw new HttpException('Invalid ID format!', HttpStatus.BAD_REQUEST);
      }
    } else {
      throw new HttpException('Not authorized to get task!', HttpStatus.UNAUTHORIZED);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    if (id.length === 36) {
      const targetTask = await this.taskService.findOne(id);
      if (targetTask) {
        if (targetTask.author === req.user.id) { // only return request if client is author
          return targetTask;
        } else {
          throw new HttpException('Not authorized to get task!', HttpStatus.UNAUTHORIZED);
        }
      } else {
        throw new HttpException('Cant find task!', HttpStatus.BAD_REQUEST);
      }
    } else {
      throw new HttpException('Invalid ID format!', HttpStatus.BAD_REQUEST);
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @Request() req) {
    if (updateTaskDto.author !== req.user.id) {
      throw new HttpException('Not authorized to author task!', HttpStatus.UNAUTHORIZED);
    }

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
  async remove(@Param('id') id: string, @Request() req) {
    if (id.length === 36) {
      const targetTask = await this.taskService.findOne(id);
      if (targetTask) {
        if (targetTask.author === req.user.id) { // only execute request if client is author
          return this.taskService.remove(id);
        } else {
          throw new HttpException('Not authorized to delete task!', HttpStatus.UNAUTHORIZED);
        }
      } else {
        throw new HttpException('Cant find task!', HttpStatus.BAD_REQUEST);
      }
    } else {
      throw new HttpException('Invalid ID format!', HttpStatus.BAD_REQUEST);
    }
  }
}
