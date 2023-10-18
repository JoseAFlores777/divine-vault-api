import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ErrorHandlerService } from '../common/services/errorHandler.service';
import {
  CreateUserDto_request,
  CreateUserDto_response,
  InternalUserSearchDto_response,
  UpdateUserDto_request,
  UpdateUserDto_response,
} from './dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly errorHandlerService: ErrorHandlerService
  ) {}

  async create(createUserDto: CreateUserDto_request): Promise<CreateUserDto_response> {
    const { username, email } = createUserDto;

    const user = await this.userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (user) {
      throw new ConflictException(`This user already exists`);
    }

    try {
      const createdUser = new this.userModel(createUserDto);
      await createdUser.save();
      return createdUser;
    } catch (error) {
      this.errorHandlerService.handleError(error);
    }
  }

  async update(
    id: string,
    updateUserDto_request: UpdateUserDto_request
  ): Promise<UpdateUserDto_response> {
    let response;
    try {
      response = await this.userModel
        .findByIdAndUpdate(id, updateUserDto_request, { new: true })
        .exec();
    } catch (error) {
      this.errorHandlerService.handleError(error);
    }

    if (!response) {
      throw new ConflictException(`The user does not exists`);
    }
    return new UpdateUserDto_response(response);
  }

  async findByUsernameAndEmail(
    username: string,
    email: string
  ): Promise<InternalUserSearchDto_response> {
    const user = await this.userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (!user) {
      throw new ConflictException(`The user does not exists`);
    }

    return user;
  }

  async findById(UserId: string): Promise<InternalUserSearchDto_response> {
    const user = await this.userModel.findById(UserId);
    if (!user) {
      throw new BadRequestException('user doestn exists');
    }
    return user;
  }
}
