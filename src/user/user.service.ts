import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { LoginDTO } from '../auth/dto/login.dto';
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

  findAll() {
    return `This action returns all user`;
  }

  async findByUsernameAndEmail(userData: LoginDTO) {
    const { username, email } = userData;
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
    return user;
  }

  async findByLogin(UserDTO: LoginDTO) {
    const { email, password } = UserDTO;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new BadRequestException('user doestn exists');
    }
    if (await bcrypt.compare(password, user.password)) {
      return this.sanitizeUser(user);
    } else {
      throw new BadRequestException('invalid credential');
    }
  }

  async findByPayload(payload: any) {
    const { email } = payload;
    return await this.userModel.findOne({ email });
  }

  // return user object without password
  sanitizeUser(user: User) {
    const sanitized = user.toObject();
    delete sanitized['password'];
    delete sanitized['createdAt'];
    delete sanitized['updatedAt'];
    delete sanitized['__v'];
    return sanitized;
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
