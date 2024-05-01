import { Optional } from '@nestjs/common';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength
} from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @MinLength(5, { message: 'UUID must have at least 5 characters.' })
  author: string;

  @IsNumber()
  priority: number;

  @IsArray()
  dependencies: string[];

  @IsNumber()
  status: number;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  id: string;
}
