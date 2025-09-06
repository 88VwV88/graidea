import { UserRepository } from '../repository'
import { comparePassword, hashPassword } from '../../../utils/password'
import { getJwtToken } from '../../../utils/token'

export class UserService {
  private userRepository: UserRepository

  constructor() {
    this.userRepository = new UserRepository()
  }

  async signup(userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    roles: string[];
    profileImageUrl?: string;
  }) {
    // Check if user already exists
    const existingUser = await this.userRepository.findUserByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(userData.password);

    // Create user
    const user = await this.userRepository.createUser({
      ...userData,
      password: hashedPassword,
    });

    // Generate JWT token
    const token = getJwtToken({
      email: user.email,
      userId: user._id.toString(),
      roles: user.roles
    });

    // Return user data without password
    const { password, ...userResponse } = user.toObject();
    return {
      user: userResponse,
      token
    };
  }

  async login(email: string, password: string) {
    // Find user by email
    const user = await this.userRepository.findUserByEmail(email)
    if (!user) {
      throw new Error('Invalid credentials')
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password)
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Generate JWT token
    const token = getJwtToken({
      email: user.email,
      userId: user._id.toString(),
      roles: user.roles
    });

    // Return user data without password
    const { password: _, ...userResponse } = user.toObject();
    return {
      user: userResponse,
      token
    };
  }

}
