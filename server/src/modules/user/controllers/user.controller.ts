import { Request, Response } from 'express'
import { UserService } from '../services'
import { AuthenticatedRequest } from '../../../types'
import { User } from '../models'


export class UserController {
  private userService: UserService

  constructor() {
    this.userService = new UserService()
  }

  signup = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, email, password, phone, roles } = req.body
      
      // Get profile image URL from uploaded file
      let profileImageUrl: string | undefined;
      if (req.file) {
        profileImageUrl = (req.file as any).location; // S3 file location
      }

      const result = await this.userService.signup({
        name,
        email,
        password,
        phone,
        roles,
        profileImageUrl
      });

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: result,
      })
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Signup failed',
      })
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body
      const result = await this.userService.login(email, password);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result,
      })
    } catch (error: any) {
      res.status(401).json({
        success: false,
        message: error.message || 'Login failed',
      })
    }
  };

  


}
