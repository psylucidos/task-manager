import {
  IsNotEmpty,
} from 'class-validator';

export class AccessToken {
  @IsNotEmpty()
  access_token: string;

  @IsNotEmpty()
  id: string;
  
  @IsNotEmpty()
  username: string;
}

// { access_token: this.jwtService.sign(payload) }
