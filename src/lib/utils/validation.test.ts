import { describe, it, expect } from 'vitest';
import {
  validate,
  validateObject,
  validateLoginForm,
  validateRegisterForm,
  validateForgotPasswordForm,
  validateResetPasswordForm,
  validateChangePasswordForm,
  validateUserForm,
  validateRoleForm,
  validatePermissionForm,
  validateEmailCodeForm,
  validatePhoneCodeForm,
  validateProfileForm,
  validateForm,
} from './validation';

describe('Validator 类', () => {
  describe('required', () => {
    it('空值验证失败', () => {
      const result = validate('', '用户名').required().validate();
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('用户名不能为空');
    });

    it('非空值验证通过', () => {
      const result = validate('test', '用户名').required().validate();
      expect(result.valid).toBe(true);
    });
  });

  describe('minLength', () => {
    it('长度不足验证失败', () => {
      const result = validate('ab', '用户名').minLength(3).validate();
      expect(result.valid).toBe(false);
    });

    it('长度足够验证通过', () => {
      const result = validate('abc', '用户名').minLength(3).validate();
      expect(result.valid).toBe(true);
    });
  });

  describe('maxLength', () => {
    it('长度超出验证失败', () => {
      const result = validate('abcdef', '用户名').maxLength(5).validate();
      expect(result.valid).toBe(false);
    });

    it('长度未超出验证通过', () => {
      const result = validate('abc', '用户名').maxLength(5).validate();
      expect(result.valid).toBe(true);
    });
  });

  describe('email', () => {
    it('有效邮箱验证通过', () => {
      const result = validate('test@example.com', '邮箱').email().validate();
      expect(result.valid).toBe(true);
    });

    it('无效邮箱验证失败', () => {
      const result = validate('invalid', '邮箱').email().validate();
      expect(result.valid).toBe(false);
    });
  });

  describe('phone', () => {
    it('有效手机号验证通过', () => {
      const result = validate('13812345678', '手机号').phone().validate();
      expect(result.valid).toBe(true);
    });

    it('无效手机号验证失败', () => {
      const result = validate('1234567890', '手机号').phone().validate();
      expect(result.valid).toBe(false);
    });
  });

  describe('number', () => {
    it('数字验证通过', () => {
      const result = validate('123', '数值').number().validate();
      expect(result.valid).toBe(true);
    });

    it('非数字验证失败', () => {
      const result = validate('abc', '数值').number().validate();
      expect(result.valid).toBe(false);
    });
  });

  describe('链式验证', () => {
    it('多重验证全部通过', () => {
      const result = validate('test@example.com', '邮箱').required().email().validate();
      expect(result.valid).toBe(true);
    });

    it('多重验证部分失败', () => {
      const result = validate('', '邮箱').required().email().validate();
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });
});

describe('validateObject', () => {
  it('验证对象所有字段', () => {
    const data = { username: '', email: 'invalid' };
    const rules = {
      username: { required: true },
      email: { email: true },
    };
    const errors = validateObject(data, rules);
    expect(errors['username']).toBeDefined();
    expect(errors['email']).toBeDefined();
  });

  it('无错误时返回空对象', () => {
    const data = { username: 'test', email: 'test@example.com' };
    const rules = {
      username: { required: true },
      email: { email: true },
    };
    const errors = validateObject(data, rules);
    expect(Object.keys(errors).length).toBe(0);
  });
});

describe('validateLoginForm', () => {
  it('验证有效登录表单', () => {
    const result = validateLoginForm({ username: 'admin', password: '123456' });
    expect(result.valid).toBe(true);
  });

  it('用户名为空验证失败', () => {
    const result = validateLoginForm({ username: '', password: '123456' });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('用户名不能为空');
  });

  it('密码过短验证失败', () => {
    const result = validateLoginForm({ username: 'admin', password: '12345' });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('密码长度不能少于6位');
  });
});

describe('validateRegisterForm', () => {
  it('验证有效注册表单', () => {
    const result = validateRegisterForm({
      name: '测试用户',
      email: 'test@example.com',
      password: 'Password123',
      confirmPassword: 'Password123',
    });
    expect(result.valid).toBe(true);
  });

  it('密码不一致验证失败', () => {
    const result = validateRegisterForm({
      name: '测试用户',
      email: 'test@example.com',
      password: 'Password123',
      confirmPassword: 'Password456',
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('两次输入的密码不一致');
  });

  it('邮箱格式无效验证失败', () => {
    const result = validateRegisterForm({
      name: '测试用户',
      email: 'invalid',
      password: 'Password123',
      confirmPassword: 'Password123',
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('请输入有效的邮箱地址');
  });
});

describe('validateForgotPasswordForm', () => {
  it('验证有效邮箱', () => {
    const result = validateForgotPasswordForm({ email: 'test@example.com' });
    expect(result.valid).toBe(true);
  });

  it('邮箱为空验证失败', () => {
    const result = validateForgotPasswordForm({ email: '' });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('邮箱不能为空');
  });
});

describe('validateResetPasswordForm', () => {
  it('验证有效重置密码表单', () => {
    const result = validateResetPasswordForm({
      password: 'NewPassword123',
      confirmPassword: 'NewPassword123',
    });
    expect(result.valid).toBe(true);
  });

  it('密码不一致验证失败', () => {
    const result = validateResetPasswordForm({
      password: 'NewPassword123',
      confirmPassword: 'DifferentPassword',
    });
    expect(result.valid).toBe(false);
  });
});

describe('validateChangePasswordForm', () => {
  it('验证有效修改密码表单', () => {
    const result = validateChangePasswordForm({
      oldPassword: 'OldPassword123',
      newPassword: 'NewPassword456',
      confirmPassword: 'NewPassword456',
    });
    expect(result.valid).toBe(true);
  });

  it('新旧密码相同验证失败', () => {
    const result = validateChangePasswordForm({
      oldPassword: 'Password123',
      newPassword: 'Password123',
      confirmPassword: 'Password123',
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('新密码不能与原密码相同');
  });
});

describe('validateUserForm', () => {
  it('验证有效用户表单', () => {
    const result = validateUserForm({
      username: 'testuser',
      email: 'test@example.com',
      nickname: '测试用户',
      roleIds: ['1'],
    });
    expect(result.valid).toBe(true);
  });

  it('未选择角色验证失败', () => {
    const result = validateUserForm({
      username: 'testuser',
      email: 'test@example.com',
      nickname: '测试用户',
      roleIds: [],
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('请至少选择一个角色');
  });
});

describe('validateRoleForm', () => {
  it('验证有效角色表单', () => {
    const result = validateRoleForm({
      name: '管理员',
      code: 'admin',
      permissions: ['read', 'write'],
    });
    expect(result.valid).toBe(true);
  });

  it('未选择权限验证失败', () => {
    const result = validateRoleForm({
      name: '管理员',
      code: 'admin',
      permissions: [],
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('请至少选择一个权限');
  });
});

describe('validatePermissionForm', () => {
  it('验证有效权限表单', () => {
    const result = validatePermissionForm({
      name: '用户管理',
      code: 'user:manage',
      resource: 'user',
      action: 'manage',
      type: 'menu',
    });
    expect(result.valid).toBe(true);
  });

  it('缺少必填字段验证失败', () => {
    const result = validatePermissionForm({
      name: '',
      code: 'user:manage',
      resource: 'user',
      action: 'manage',
      type: 'menu',
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('权限名称不能为空');
  });
});

describe('validateEmailCodeForm', () => {
  it('验证有效邮箱验证码表单', () => {
    const result = validateEmailCodeForm({
      email: 'test@example.com',
      code: '123456',
    });
    expect(result.valid).toBe(true);
  });

  it('验证码长度错误验证失败', () => {
    const result = validateEmailCodeForm({
      email: 'test@example.com',
      code: '12345',
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('验证码长度为6位');
  });
});

describe('validatePhoneCodeForm', () => {
  it('验证有效手机验证码表单', () => {
    const result = validatePhoneCodeForm({
      phone: '13812345678',
      code: '123456',
    });
    expect(result.valid).toBe(true);
  });

  it('手机号格式错误验证失败', () => {
    const result = validatePhoneCodeForm({
      phone: '12345678901',
      code: '123456',
    });
    expect(result.valid).toBe(false);
  });
});

describe('validateProfileForm', () => {
  it('验证有效个人资料表单', () => {
    const result = validateProfileForm({
      nickname: '测试用户',
      phone: '13812345678',
      email: 'test@example.com',
    });
    expect(result.valid).toBe(true);
  });

  it('昵称为空验证失败', () => {
    const result = validateProfileForm({
      nickname: '',
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('昵称不能为空');
  });
});

describe('validateForm', () => {
  it('验证通用表单', () => {
    const result = validateForm(
      { name: 'test', age: 25 },
      {
        name: { required: true, minLength: 2 },
        age: { min: 18, max: 100 },
      }
    );
    expect(result.valid).toBe(true);
  });

  it('通用表单验证失败返回错误', () => {
    const result = validateForm(
      { name: '', age: 150 },
      {
        name: { required: true },
        age: { max: 100 },
      }
    );
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });
});
