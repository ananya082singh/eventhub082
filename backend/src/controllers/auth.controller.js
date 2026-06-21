const bcrypt = require('bcryptjs');
const prisma = require('../prismaClient');
const { generateToken } = require('../utils/jwt');
const ApiError = require('../utils/ApiError');

const SALT_ROUNDS = 10;

/**
 * POST /api/v1/auth/register
 * Creates a new user account with hashed password and returns a JWT.
 */
async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ApiError(409, 'An account with this email already exists.');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user
    const user = await prisma.user.create({
      data: { name, email, passwordHash },
      select: { id: true, name: true, email: true, createdAt: true },
    });

    // Generate JWT
    const token = generateToken({ id: user.id, email: user.email });

    res.status(201).json({
      success: true,
      message: 'Registration successful.',
      data: { user, token },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/auth/login
 * Authenticates a user with email/password and returns a JWT.
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new ApiError(401, 'Invalid email or password.');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid email or password.');
    }

    // Generate JWT
    const token = generateToken({ id: user.id, email: user.email });

    res.json({
      success: true,
      message: 'Login successful.',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { register, login };
