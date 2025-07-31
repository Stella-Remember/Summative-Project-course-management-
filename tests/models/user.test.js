const { User } = require('../../src/models');
const { sequelize } = require('../../src/models');

describe('User Model', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  beforeEach(async () => {
    await User.destroy({ where: {} });
  });

  describe('User Creation', () => {
    it('should create a user with valid data', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        first_name: 'John',
        last_name: 'Doe',
        role: 'student'
      };

      const user = await User.create(userData);
      
      expect(user.email).toBe(userData.email);
      expect(user.first_name).toBe(userData.first_name);
      expect(user.last_name).toBe(userData.last_name);
      expect(user.role).toBe(userData.role);
      expect(user.is_active).toBe(true);
      expect(user.password).not.toBe(userData.password); // Should be hashed
    });

    it('should not create a user with invalid email', async () => {
      const userData = {
        email: 'invalid-email',
        password: 'password123',
        first_name: 'John',
        last_name: 'Doe',
        role: 'student'
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it('should not create a user with short password', async () => {
      const userData = {
        email: 'test@example.com',
        password: '123',
        first_name: 'John',
        last_name: 'Doe',
        role: 'student'
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it('should not create a user with invalid role', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        first_name: 'John',
        last_name: 'Doe',
        role: 'invalid_role'
      };

      await expect(User.create(userData)).rejects.toThrow();
    });
  });

  describe('User Methods', () => {
    let user;

    beforeEach(async () => {
      user = await User.create({
        email: 'test@example.com',
        password: 'password123',
        first_name: 'John',
        last_name: 'Doe',
        role: 'student'
      });
    });

    it('should compare password correctly', async () => {
      const isValid = await user.comparePassword('password123');
      expect(isValid).toBe(true);

      const isInvalid = await user.comparePassword('wrongpassword');
      expect(isInvalid).toBe(false);
    });

    it('should not include password in JSON output', () => {
      const json = user.toJSON();
      expect(json.password).toBeUndefined();
      expect(json.email).toBe('test@example.com');
    });
  });

  describe('User Validation', () => {
    it('should not allow duplicate emails', async () => {
      await User.create({
        email: 'duplicate@example.com',
        password: 'password123',
        first_name: 'John',
        last_name: 'Doe',
        role: 'student'
      });

      await expect(User.create({
        email: 'duplicate@example.com',
        password: 'password456',
        first_name: 'Jane',
        last_name: 'Smith',
        role: 'facilitator'
      })).rejects.toThrow();
    });

    it('should validate first_name length', async () => {
      await expect(User.create({
        email: 'test@example.com',
        password: 'password123',
        first_name: 'A',
        last_name: 'Doe',
        role: 'student'
      })).rejects.toThrow();
    });

    it('should validate last_name length', async () => {
      await expect(User.create({
        email: 'test@example.com',
        password: 'password123',
        first_name: 'John',
        last_name: 'D',
        role: 'student'
      })).rejects.toThrow();
    });
  });
});