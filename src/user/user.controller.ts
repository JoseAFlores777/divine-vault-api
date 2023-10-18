import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/common/guards';
import { ParseObjectIdPipe } from '../common/pipes/ParseObjectIdPipe';
import { CreateUserDto_request, UpdateUserDto_request } from './dto';
import { UserService } from './user.service';

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() data: CreateUserDto_request) {
    return this.userService.create(data);
  }

  @UseGuards(AccessTokenGuard)
  @Patch('/:id')
  update(@Param('id', ParseObjectIdPipe) id: string, @Body() data: UpdateUserDto_request) {
    return this.userService.update(id, data);
  }

  // @Get()
  // findOne(): CreateUserDto {
  //   console.log('controller');
  //   const user = {
  //     username: 'Kamil',
  //     firstName: 'Kamil',
  //     lastName: 'Mysliwiec',
  //     password: 'Mysliwiec',
  //     hola:'hola'
  //   }
  //   return new CreateUserDto({...user});
  // }
}
