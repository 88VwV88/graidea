import { Request, Response } from "express";
import mongoose from "mongoose";
import { User } from "../../user/models";
import { Teacher } from "../models";
import { hashPassword, randomPassword } from "../../../utils/password";
import { sendEmail } from "../../../utils/emailConfig";

export class TeacherController {
  signup = async (req: Request, res: Response): Promise<void> => {
    const session = await mongoose.startSession();

    try {
      await session.withTransaction(async () => {
        const {
          name,
          email,
          phone,
          yearOfExperience,
          degreeName,
          skills,
          salary,
        } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email }).session(session);
        if (existingUser) {
          throw new Error("User with this email already exists");
        }

        // Generate random password
        const randomPass = randomPassword(12);
        const hashedPassword = await hashPassword(randomPass);

        // Get profile image URL from uploaded file
        let profileImageUrl: string | undefined;
        if (req.file) {
          profileImageUrl = (req.file as any).location; // S3 file location
        }

        // Create user
        const user = new User({
          name,
          email,
          password: hashedPassword,
          phone,
          roles: ["teacher"],
          profileImageUrl,
        });

        const savedUser = await user.save({ session });

        // Create teacher profile
        const teacher = new Teacher({
          userId: savedUser._id,
          yearOfExperience,
          degreeName,
          photoUrl: profileImageUrl,
          skills: Array.isArray(skills)
            ? skills
            : skills.split(",").map((s: string) => s.trim()),
          salary,
          coursesEnrolled: [],
        });

        const savedTeacher = await teacher.save({ session });

        // Send email with hashed password
        const emailSubject = "Welcome to Graidea - Your Teacher Account";
        const emailText = `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>Welcome to Graidea</title>
    </head>
    <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f4f4f7;">

      <table align="center" width="100%" cellpadding="0" cellspacing="0" style="padding:20px 0;">
        <tr>
          <td>
            <table align="center" cellpadding="0" cellspacing="0" width="600" style="background-color:#ffffff; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.1); padding:30px;">
              
              <!-- Header -->
              <tr>
                <td align="center" style="padding-bottom:20px;">
                  <h1 style="color:#4A90E2; margin:0;">Welcome to Graidea!</h1>
                </td>
              </tr>

              <!-- Message -->
              <tr>
                <td style="color:#333; font-size:16px; line-height:1.6;">
                  <p>Dear <strong>${name}</strong>,</p>

                  <p>Your teacher account has been successfully created.</p>

                  <h3 style="color:#4A90E2; margin-top:25px;">Your Login Credentials:</h3>
                  <p><strong>Email:</strong> ${email}</p>
                  <p><strong>Password:</strong> ${randomPass}</p>
                  <p style="color:#888; font-size:14px;">Please keep this password secure and change it after your first login.</p>

                  <h3 style="color:#4A90E2; margin-top:25px;">Your Profile Details:</h3>
                  <ul style="padding-left:18px; margin:10px 0;">
                    <li><strong>Experience:</strong> ${yearOfExperience} years</li>
                    <li><strong>Degree:</strong> ${degreeName}</li>
                    <li><strong>Skills:</strong> ${
                      Array.isArray(skills) ? skills.join(", ") : skills
                    }</li>
                    <li><strong>Salary:</strong> $Rs{salary} lacs</li>
                  </ul>

                  <p>You can now access your teacher dashboard and start managing your courses.</p>

                  <p style="margin-top:30px;">Best regards,<br/><strong>The Graidea Team</strong></p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>

    </body>
  </html>`;

        await sendEmail(email, emailSubject, emailText);

        // Return response
        res.status(201).json({
          success: true,
          message:
            "Teacher account created successfully. Login credentials sent to email.",
          data: {
            user: {
              _id: savedUser._id,
              name: savedUser.name,
              email: savedUser.email,
              phone: savedUser.phone,
              roles: savedUser.roles,
              profileImageUrl: savedUser.profileImageUrl,
              createdAt: (savedUser as any).createdAt,
              updatedAt: (savedUser as any).updatedAt,
            },
            teacher: {
              _id: savedTeacher._id,
              userId: savedTeacher.userId,
              yearOfExperience: savedTeacher.yearOfExperience,
              degreeName: savedTeacher.degreeName,
              photoUrl: savedTeacher.photoUrl,
              skills: savedTeacher.skills,
              salary: savedTeacher.salary,
              coursesEnrolled: savedTeacher.coursesEnrolled,
              createdAt: savedTeacher.createdAt,
              updatedAt: savedTeacher.updatedAt,
            },
          },
        });
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Teacher signup failed",
      });
    } finally {
      await session.endSession();
    }
  };

  // Get teacher profile by userId
  getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;

      const teacher = await Teacher.findOne({ userId })
        .populate("userId", "name email phone profileImageUrl")
        .populate("coursesEnrolled", "title description");

      if (!teacher) {
        res.status(404).json({
          success: false,
          message: "Teacher profile not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Teacher profile retrieved successfully",
        data: teacher,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to retrieve teacher profile",
      });
    }
  };

  // Update teacher profile
  updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
      const updateData = req.body;

      // Get profile image URL from uploaded file if any
      if (req.file) {
        updateData.photoUrl = (req.file as any).location;
      }

      // Handle skills array if it's a string
      if (updateData.skills && typeof updateData.skills === "string") {
        updateData.skills = updateData.skills
          .split(",")
          .map((s: string) => s.trim());
      }

      const teacher = await Teacher.findOneAndUpdate(
        { userId },
        { $set: updateData },
        { new: true, runValidators: true }
      ).populate("userId", "name email phone profileImageUrl");

      if (!teacher) {
        res.status(404).json({
          success: false,
          message: "Teacher profile not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Teacher profile updated successfully",
        data: teacher,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to update teacher profile",
      });
    }
  };

  // Get all teachers
  getAllTeachers = async (req: Request, res: Response): Promise<void> => {
    try {
      const teachers = await Teacher.find()
        .populate("userId", "name email phone profileImageUrl")
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        message: "Teachers retrieved successfully",
        data: teachers,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to retrieve teachers",
      });
    }
  };
}
