import { httpClient } from '../client.js';
import type {
  LoginDto,
  RegisterDto,
  LoginResponse,
  RefreshTokenDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  ChangePasswordDto,
  UpdateUserDto,
  User,
} from '$lib/types/auth.js';
import type { ApiResponse } from '$lib/types/index.js';

/**
 * 认证服务
 */
export class AuthService {
  /**
   * 用户登录
   */
  async login(data: LoginDto): Promise<ApiResponse<LoginResponse>> {
    return httpClient.post<LoginResponse>('/auth/login', data);
  }

  /**
   * 用户注册
   */
  async register(data: RegisterDto): Promise<ApiResponse<LoginResponse>> {
    return httpClient.post<LoginResponse>('/auth/register', data);
  }

  /**
   * 用户登出
   */
  async logout(): Promise<ApiResponse<null>> {
    return httpClient.post<null>('/auth/logout');
  }

  /**
   * 刷新令牌
   */
  async refreshToken(
    data: RefreshTokenDto
  ): Promise<ApiResponse<{ accessToken: string; refreshToken: string; expiresIn: number }>> {
    return httpClient.post('/auth/refresh', data);
  }

  /**
   * 获取当前用户信息
   */
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return httpClient.get<User>('/auth/me');
  }

  /**
   * 忘记密码
   */
  async forgotPassword(
    data: ForgotPasswordDto
  ): Promise<ApiResponse<{ email: string; resetToken: string }>> {
    return httpClient.post('/auth/forgot-password', data);
  }

  /**
   * 重置密码
   */
  async resetPassword(data: ResetPasswordDto): Promise<ApiResponse<null>> {
    return httpClient.post('/auth/reset-password', data);
  }

  /**
   * 修改密码
   */
  async changePassword(data: ChangePasswordDto): Promise<ApiResponse<null>> {
    return httpClient.put('/auth/change-password', data);
  }

  /**
   * 更新用户资料
   */
  async updateProfile(data: UpdateUserDto): Promise<ApiResponse<User>> {
    return httpClient.put<User>('/auth/profile', data);
  }

  /**
   * 上传头像
   */
  async uploadAvatar(file: File): Promise<ApiResponse<{ avatar: string }>> {
    const formData = new FormData();
    formData.append('avatar', file);

    return httpClient.post('/auth/avatar', formData, {
      headers: {
        // 让浏览器自动设置 Content-Type
      },
    });
  }
}

/**
 * 导出认证服务实例
 */
export const authService = new AuthService();
