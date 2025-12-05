import { REGEX } from './constants.js';

/**
 * 验证结果接口
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * 验证规则接口
 */
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  email?: boolean;
  phone?: boolean;
  url?: boolean;
  idCard?: boolean;
  number?: boolean;
  decimal?: boolean;
  password?: boolean;
  username?: boolean;
  custom?: (value: any) => boolean | string;
}

/**
 * 基础验证器类
 */
export class Validator {
  private errors: string[] = [];

  constructor(
    private value: any,
    private fieldName: string = '字段'
  ) {}

  /**
   * 必填验证
   */
  required(message?: string): this {
    if (this.value === null || this.value === undefined || this.value === '') {
      this.errors.push(message || `${this.fieldName}不能为空`);
    }
    return this;
  }

  /**
   * 最小长度验证
   */
  minLength(min: number, message?: string): this {
    if (this.value && this.value.length < min) {
      this.errors.push(message || `${this.fieldName}长度不能少于${min}个字符`);
    }
    return this;
  }

  /**
   * 最大长度验证
   */
  maxLength(max: number, message?: string): this {
    if (this.value && this.value.length > max) {
      this.errors.push(message || `${this.fieldName}长度不能超过${max}个字符`);
    }
    return this;
  }

  /**
   * 长度范围验证
   */
  length(min: number, max: number, message?: string): this {
    if (this.value) {
      const length = this.value.length;
      if (length < min || length > max) {
        this.errors.push(message || `${this.fieldName}长度必须在${min}-${max}个字符之间`);
      }
    }
    return this;
  }

  /**
   * 最小值验证
   */
  min(min: number, message?: string): this {
    const num = Number(this.value);
    if (!isNaN(num) && num < min) {
      this.errors.push(message || `${this.fieldName}不能小于${min}`);
    }
    return this;
  }

  /**
   * 最大值验证
   */
  max(max: number, message?: string): this {
    const num = Number(this.value);
    if (!isNaN(num) && num > max) {
      this.errors.push(message || `${this.fieldName}不能大于${max}`);
    }
    return this;
  }

  /**
   * 数值范围验证
   */
  range(min: number, max: number, message?: string): this {
    const num = Number(this.value);
    if (!isNaN(num) && (num < min || num > max)) {
      this.errors.push(message || `${this.fieldName}必须在${min}-${max}之间`);
    }
    return this;
  }

  /**
   * 正则表达式验证
   */
  pattern(regex: RegExp, message?: string): this {
    if (this.value && !regex.test(String(this.value))) {
      this.errors.push(message || `${this.fieldName}格式不正确`);
    }
    return this;
  }

  /**
   * 邮箱验证
   */
  email(message?: string): this {
    if (this.value && !REGEX.EMAIL.test(String(this.value))) {
      this.errors.push(message || '请输入有效的邮箱地址');
    }
    return this;
  }

  /**
   * 手机号验证
   */
  phone(message?: string): this {
    if (this.value && !REGEX.PHONE.test(String(this.value))) {
      this.errors.push(message || '请输入有效的手机号码');
    }
    return this;
  }

  /**
   * URL验证
   */
  url(message?: string): this {
    if (this.value && !REGEX.URL.test(String(this.value))) {
      this.errors.push(message || '请输入有效的网址');
    }
    return this;
  }

  /**
   * 身份证号验证
   */
  idCard(message?: string): this {
    if (this.value && !REGEX.IDCARD.test(String(this.value))) {
      this.errors.push(message || '请输入有效的身份证号码');
    }
    return this;
  }

  /**
   * 数字验证
   */
  number(message?: string): this {
    if (this.value && !REGEX.NUMBER.test(String(this.value))) {
      this.errors.push(message || `${this.fieldName}必须是数字`);
    }
    return this;
  }

  /**
   * 小数验证
   */
  decimal(message?: string): this {
    if (this.value && !REGEX.DECIMAL.test(String(this.value))) {
      this.errors.push(message || `${this.fieldName}必须是数字或小数`);
    }
    return this;
  }

  /**
   * 密码强度验证
   */
  password(message?: string): this {
    if (this.value && !REGEX.PASSWORD.test(String(this.value))) {
      this.errors.push(message || '密码必须包含大小写字母和数字，长度至少8位');
    }
    return this;
  }

  /**
   * 用户名验证
   */
  username(message?: string): this {
    if (this.value && !REGEX.USERNAME.test(String(this.value))) {
      this.errors.push(message || '用户名只能包含字母、数字、下划线和连字符，长度3-20位');
    }
    return this;
  }

  /**
   * 自定义验证
   */
  custom(validator: (value: any) => boolean | string, message?: string): this {
    if (this.value) {
      const result = validator(this.value);
      if (result !== true) {
        this.errors.push(
          typeof result === 'string' ? result : message || `${this.fieldName}验证失败`
        );
      }
    }
    return this;
  }

  /**
   * 获取验证结果
   */
  validate(): ValidationResult {
    return {
      valid: this.errors.length === 0,
      errors: [...this.errors],
    };
  }
}

/**
 * 创建验证器
 */
export function validate(value: any, fieldName: string = '字段'): Validator {
  return new Validator(value, fieldName);
}

/**
 * 验证对象
 */
export function validateObject(
  obj: Record<string, any>,
  rules: Record<string, ValidationRule>
): Record<string, string[]> {
  const errors: Record<string, string[]> = {};

  for (const [field, rule] of Object.entries(rules)) {
    const value = obj[field];
    const validator = validate(value, field);

    if (rule.required) {
      validator.required();
    }

    if (rule.minLength !== undefined) {
      validator.minLength(rule.minLength);
    }

    if (rule.maxLength !== undefined) {
      validator.maxLength(rule.maxLength);
    }

    if (rule.min !== undefined) {
      validator.min(rule.min);
    }

    if (rule.max !== undefined) {
      validator.max(rule.max);
    }

    if (rule.pattern) {
      validator.pattern(rule.pattern);
    }

    if (rule.email) {
      validator.email();
    }

    if (rule.phone) {
      validator.phone();
    }

    if (rule.url) {
      validator.url();
    }

    if (rule.idCard) {
      validator.idCard();
    }

    if (rule.number) {
      validator.number();
    }

    if (rule.decimal) {
      validator.decimal();
    }

    if (rule.password) {
      validator.password();
    }

    if (rule.username) {
      validator.username();
    }

    if (rule.custom) {
      validator.custom(rule.custom);
    }

    const result = validator.validate();
    if (!result.valid) {
      errors[field] = result.errors;
    }
  }

  return errors;
}

/**
 * 验证登录表单
 */
export function validateLoginForm(data: { username: string; password: string }): ValidationResult {
  const errors: string[] = [];

  if (!data.username?.trim()) {
    errors.push('用户名不能为空');
  } else if (data.username.length < 3) {
    errors.push('用户名长度不能少于3位');
  }

  if (!data.password?.trim()) {
    errors.push('密码不能为空');
  } else if (data.password.length < 6) {
    errors.push('密码长度不能少于6位');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * 验证注册表单
 */
export function validateRegisterForm(data: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}): ValidationResult {
  const errors: string[] = [];

  if (!data.name?.trim()) {
    errors.push('姓名不能为空');
  } else if (data.name.trim().length < 2) {
    errors.push('姓名长度不能少于2个字符');
  }

  if (!data.email?.trim()) {
    errors.push('邮箱不能为空');
  } else if (!REGEX.EMAIL.test(data.email)) {
    errors.push('请输入有效的邮箱地址');
  }

  if (!data.password?.trim()) {
    errors.push('密码不能为空');
  } else if (!REGEX.PASSWORD.test(data.password)) {
    errors.push('密码必须包含大小写字母和数字，长度至少8位');
  }

  if (data.password !== data.confirmPassword) {
    errors.push('两次输入的密码不一致');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * 验证忘记密码表单
 */
export function validateForgotPasswordForm(data: { email: string }): ValidationResult {
  const errors: string[] = [];

  if (!data.email?.trim()) {
    errors.push('邮箱不能为空');
  } else if (!REGEX.EMAIL.test(data.email)) {
    errors.push('请输入有效的邮箱地址');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * 验证重置密码表单
 */
export function validateResetPasswordForm(data: {
  password: string;
  confirmPassword: string;
}): ValidationResult {
  const errors: string[] = [];

  if (!data.password?.trim()) {
    errors.push('新密码不能为空');
  } else if (!REGEX.PASSWORD.test(data.password)) {
    errors.push('密码必须包含大小写字母和数字，长度至少8位');
  }

  if (data.password !== data.confirmPassword) {
    errors.push('两次输入的密码不一致');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * 验证修改密码表单
 */
export function validateChangePasswordForm(data: {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}): ValidationResult {
  const errors: string[] = [];

  if (!data.oldPassword?.trim()) {
    errors.push('原密码不能为空');
  }

  if (!data.newPassword?.trim()) {
    errors.push('新密码不能为空');
  } else if (!REGEX.PASSWORD.test(data.newPassword)) {
    errors.push('密码必须包含大小写字母和数字，长度至少8位');
  }

  if (data.oldPassword === data.newPassword) {
    errors.push('新密码不能与原密码相同');
  }

  if (data.newPassword !== data.confirmPassword) {
    errors.push('两次输入的密码不一致');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * 验证用户表单
 */
export function validateUserForm(data: {
  username: string;
  email: string;
  nickname: string;
  phone?: string;
  roleIds: string[];
}): ValidationResult {
  const errors: string[] = [];

  if (!data.username?.trim()) {
    errors.push('用户名不能为空');
  } else if (!REGEX.USERNAME.test(data.username)) {
    errors.push('用户名只能包含字母、数字、下划线和连字符，长度3-20位');
  }

  if (!data.email?.trim()) {
    errors.push('邮箱不能为空');
  } else if (!REGEX.EMAIL.test(data.email)) {
    errors.push('请输入有效的邮箱地址');
  }

  if (!data.nickname?.trim()) {
    errors.push('昵称不能为空');
  }

  if (data.phone && !REGEX.PHONE.test(data.phone)) {
    errors.push('请输入有效的手机号码');
  }

  if (!data.roleIds || data.roleIds.length === 0) {
    errors.push('请至少选择一个角色');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * 验证角色表单
 */
export function validateRoleForm(data: {
  name: string;
  code: string;
  permissions: string[];
}): ValidationResult {
  const errors: string[] = [];

  if (!data.name?.trim()) {
    errors.push('角色名称不能为空');
  }

  if (!data.code?.trim()) {
    errors.push('角色编码不能为空');
  }

  if (!data.permissions || data.permissions.length === 0) {
    errors.push('请至少选择一个权限');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * 验证权限表单
 */
export function validatePermissionForm(data: {
  name: string;
  code: string;
  resource: string;
  action: string;
  type: 'menu' | 'button' | 'api';
}): ValidationResult {
  const errors: string[] = [];

  if (!data.name?.trim()) {
    errors.push('权限名称不能为空');
  }

  if (!data.code?.trim()) {
    errors.push('权限编码不能为空');
  }

  if (!data.resource?.trim()) {
    errors.push('资源不能为空');
  }

  if (!data.action?.trim()) {
    errors.push('操作不能为空');
  }

  if (!data.type) {
    errors.push('权限类型不能为空');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * 验证邮箱验证码表单
 */
export function validateEmailCodeForm(data: { email: string; code: string }): ValidationResult {
  const errors: string[] = [];

  if (!data.email?.trim()) {
    errors.push('邮箱不能为空');
  } else if (!REGEX.EMAIL.test(data.email)) {
    errors.push('请输入有效的邮箱地址');
  }

  if (!data.code?.trim()) {
    errors.push('验证码不能为空');
  } else if (data.code.length !== 6) {
    errors.push('验证码长度为6位');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * 验证手机号验证码表单
 */
export function validatePhoneCodeForm(data: { phone: string; code: string }): ValidationResult {
  const errors: string[] = [];

  if (!data.phone?.trim()) {
    errors.push('手机号不能为空');
  } else if (!REGEX.PHONE.test(data.phone)) {
    errors.push('请输入有效的手机号码');
  }

  if (!data.code?.trim()) {
    errors.push('验证码不能为空');
  } else if (data.code.length !== 6) {
    errors.push('验证码长度为6位');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * 验证个人资料表单
 */
export function validateProfileForm(data: {
  nickname: string;
  phone?: string;
  email?: string;
}): ValidationResult {
  const errors: string[] = [];

  if (!data.nickname?.trim()) {
    errors.push('昵称不能为空');
  }

  if (data.phone && !REGEX.PHONE.test(data.phone)) {
    errors.push('请输入有效的手机号码');
  }

  if (data.email && !REGEX.EMAIL.test(data.email)) {
    errors.push('请输入有效的邮箱地址');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * 验证通用表单
 */
export function validateForm(
  data: Record<string, any>,
  rules: Record<string, ValidationRule>
): ValidationResult {
  const errors = validateObject(data, rules);
  const errorMessages = Object.values(errors).flat();

  return {
    valid: errorMessages.length === 0,
    errors: errorMessages,
  };
}
