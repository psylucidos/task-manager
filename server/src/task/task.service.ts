import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>
  ) {}

  create(createTaskDto: CreateTaskDto): Promise<Task> {
    const task: Task = new Task();
    task.author = createTaskDto.author;
    task.priority = createTaskDto.priority;
    task.dependencies = createTaskDto.dependencies;
    task.status = createTaskDto.status;
    task.title = createTaskDto.title;
    task.description = createTaskDto.description;
    return this.taskRepository.save(task);
  }

  findAll(): Promise<Task[]> {
    return this.taskRepository.find();
  }

  findOne(id: string): Promise<Task> {
    return this.taskRepository.findOneBy({ id });
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task: Task = new Task();
    task.id = id;
    task.author = updateTaskDto.author;
    task.priority = updateTaskDto.priority;
    task.dependencies = updateTaskDto.dependencies;
    task.status = updateTaskDto.status;
    task.title = updateTaskDto.title;
    task.description = updateTaskDto.description;
    return this.taskRepository.save(task);
  }

  remove(id: string): Promise<{ affected?: number }> {
    return this.taskRepository.delete(id);
  }
}
