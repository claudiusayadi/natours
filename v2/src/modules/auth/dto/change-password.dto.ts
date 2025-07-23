import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

/**
 * Change password data
 */
export class ChangePasswordDto {
  /**
   * Current password
   * @example "oldpassword123"
   */
  @IsString()
  @IsNotEmpty()
  passwordCurrent: string;

  /**
   * New password
   * Password must meet the following criteria:
   * - at least 8 characters long
   * - at least one lowercase letter
   * - at least one uppercase letter
   * - at least one number
   * - at least one symbol
   * @example "newpassword123"
   */
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'Password must be at least 8 characters long, with at least one lowercase letter, one uppercase letter, one number, and one symbol.',
    },
  )
  password: string;
}
