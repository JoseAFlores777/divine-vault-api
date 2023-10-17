import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ErrorHandlerService } from '../common/services/errorHandler.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly errorHandlerService: ErrorHandlerService
  ) {}

  async create(createUserDto: CreateUserDto) {
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
      return this.sanitizeUser(createdUser);
    } catch (error) {
      this.errorHandlerService.handleError(error);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserDocument> {
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
  }

  async findByUsernameAndEmail(username: string, email: string) {
    const user = await this.userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (!user) {
      throw new ConflictException(`The user does not exists`);
    }

    return user;
  }

  async findById(UserId: string) {
    const user = await this.userModel.findById(UserId);
    if (!user) {
      throw new BadRequestException('user doestn exists');
    }
    return this.sanitizeUser(user);
  }

  sanitizeUser(user: User) {
    const sanitized = user.toObject();
    delete sanitized['password'];
    delete sanitized['createdAt'];
    delete sanitized['updatedAt'];

    delete sanitized['__v'];
    return sanitized;
  }
}
