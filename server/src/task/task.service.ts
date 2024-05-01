import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
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

  private async getDependenciesOfDependent(dependentID: string): Promise<string[]> {
    let dependent = await this.findOne(dependentID);
    return dependent.dependencies;
  }

  private async isCircular(newTaskID: string, dependencyIDs: string[]): Promise<boolean> {
    for (let i = 0; i < dependencyIDs.length; i++) {
      let dependentID = dependencyIDs[i];
      let dependencies = await this.getDependenciesOfDependent(dependentID)
      if (dependencies.includes(newTaskID)) {
        return true;
      } else {
        let nextLayer = await this.isCircular(newTaskID, dependencies);
        if (nextLayer === false) {
          continue;
        } else {
          return true;
        }
      }
    }

    return false;
  }

  private async checkForCircularDependencies(taskID: string, oldDependencies: string[], newDependencies: string[]): Promise<boolean> {
    let dependencies = [];
    newDependencies.forEach(newDependency => {
      if (!oldDependencies.includes(newDependency)) {
        dependencies.push(newDependency);
      }
    });

    return await this.isCircular(taskID, dependencies);
  }

  private async checkIfDoable(taskID: string, dependencies: string[]): Promise<boolean> {
    for(let i = 0; i < dependencies.length; i++) {
      let dependentID = dependencies[i];
      let dependent = await this.findOne(dependentID);

      if (dependent.status === 2) { // task is complete - no need to look up dependency tree
        continue;
      } else {
        return false;
      }
    }

    return true;
  }

  create(createTaskDto: CreateTaskDto): Promise<Task> {
    const task: Task = new Task();
    task.author = createTaskDto.author;
    task.priority = createTaskDto.priority;
    task.dependencies = createTaskDto.dependencies;
    task.status = createTaskDto.status;
    task.title = createTaskDto.title;
    task.description = createTaskDto.description;

    if (createTaskDto.id) {
      task.id = createTaskDto.id;
    }

    return this.taskRepository.save(task);
  }

  findAll(): Promise<Task[]> {
    return this.taskRepository.find();
  }

  findByAuthor(id: string): Promise<Task[]> {
    return this.taskRepository.find({
      where: {
        author: id
      }
    });
  }

  async findOne(id: string): Promise<Task> {
    if (id.length === 36) {
      let task = await this.taskRepository.findOneBy({ id });
      if (task === null) {
        throw new HttpException('No task found!', HttpStatus.BAD_REQUEST);
      } else {
        task.doable = await this.checkIfDoable(task.id, task.dependencies);
        return task;
      }
    } else {
      throw new HttpException('Invalid ID!', HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const currentTask = await this.findOne(id);
    const hasCircularDependencies = await this.checkForCircularDependencies(id, currentTask.dependencies, updateTaskDto.dependencies);

    if (hasCircularDependencies) {
      throw new HttpException('Circular dependency structure detected!', HttpStatus.CONFLICT);
    } else {
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
  }

  remove(id: string): Promise<{ affected?: number }> {
    return this.taskRepository.delete(id);
  }
}
