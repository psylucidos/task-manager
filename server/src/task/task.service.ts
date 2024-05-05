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
    let dependent = await this.taskRepository.findOneBy({ id: dependentID });
    if (!dependent) {
      return [];
    } else {
      return dependent.dependencies;
    }
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

  private async checkIfDoable(dependencies: string[], subtasks: string[]): Promise<boolean> {
    for(let i = 0; i < dependencies.length; i++) {
      let dependentID = dependencies[i];
      let dependent = await this.taskRepository.findOneBy({ id: dependentID });

      if (!dependent || dependent.status === 2) { // task is complete - no need to look up dependency tree
        continue;
      } else {
        return false;
      }
    }

    for(let i = 0; i < subtasks.length; i++) {
      let subtaskID = subtasks[i];
      let subtask = await this.taskRepository.findOneBy({ id: subtaskID });

      if (!subtask || subtask.status === 2) { // subtask is complete
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
    task.duedate = createTaskDto.duedate;
    task.priority = createTaskDto.priority;
    task.dependencies = createTaskDto.dependencies;
    task.subtasks = createTaskDto.subtasks;
    task.status = createTaskDto.status;
    task.title = createTaskDto.title;
    task.description = createTaskDto.description;

    if (createTaskDto.id) {
      task.id = createTaskDto.id;
    }

    return this.taskRepository.save(task);
  }

  async findAll(): Promise<Task[]> {
    let tasks = await this.taskRepository.find();

    for(let i = 0; i < tasks.length; i++) {
      tasks[i].doable = await this.checkIfDoable(tasks[i].dependencies, tasks[i].subtasks);
    }

    return tasks;
  }

  async findByAuthor(id: string): Promise<Task[]> {
    let tasks = await this.taskRepository.find({
      where: {
        author: id
      }
    });

    for(let i = 0; i < tasks.length; i++) {
      tasks[i].doable = await this.checkIfDoable(tasks[i].dependencies, tasks[i].subtasks);
    }

    return tasks;
  }

  async findOne(id: string): Promise<Task> {
    let task = await this.taskRepository.findOneBy({ id });
    if (task === null) {
      return null;
    } else {
      task.doable = await this.checkIfDoable(task.dependencies, task.subtasks);
      return task;
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
      task.duedate = updateTaskDto.duedate;
      task.priority = updateTaskDto.priority;
      task.dependencies = updateTaskDto.dependencies;
      task.subtasks = updateTaskDto.subtasks;
      task.status = updateTaskDto.status;
      task.title = updateTaskDto.title;
      task.description = updateTaskDto.description;
      return this.taskRepository.save(task);
    }
  }

  async remove(id: string): Promise<{ affected?: number }> {
    const targetTask = await this.taskRepository.findOneBy({ id });

    if (targetTask) {
      const authorID = targetTask.author;
      const allTasks = await this.findByAuthor(authorID);

      allTasks.forEach(task => {
        if (task.dependencies.includes(id)) {
          task.dependencies.splice(task.dependencies.indexOf(id), 1);
          const newTask: Task = new Task();
          newTask.id = task.id;
          newTask.author = task.author;
          newTask.duedate = task.duedate;
          newTask.priority = task.priority;
          newTask.dependencies = task.dependencies;
          newTask.subtasks = task.subtasks;
          newTask.status = task.status;
          newTask.title = task.title;
          newTask.description = task.description;
          this.taskRepository.save(newTask);
        }
      });

      return this.taskRepository.delete(id);
    } else {
      throw new HttpException('No task found!', HttpStatus.BAD_REQUEST);
    }
  }
}
