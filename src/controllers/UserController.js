import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import fs from "fs/promises";
import path from "path";
import { v4 as uuid } from "uuid";


const __dirname = path.resolve();

// Path to users.json file
const USERS_FILE = path.join(__dirname, "src", "data", "users.json");

// Zod schemas
const registerSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Helper functions
const readUsers = async () => {
  try {
    const data = await fs.readFile(USERS_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }
    throw error;
  }
};

const writeUsers = async (users) => {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
};

const findUserByEmail = async (email) => {
  const users = await readUsers();
  return users.find((user) => user.email === email);
};

const createUser = async (userData) => {
  const users = await readUsers();
  const newUser = {
    id: uuid(),
    ...userData,
    createdAt: new Date(),
  };
  users.push(newUser);
  await writeUsers(users);
  return newUser;
};

// Controller: Register
export const register = async (req, res) => {
  try {
    const validationResult = registerSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: validationResult.error.errors,
      });
    }
    const { email, password, name } = validationResult.data;
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ success: false, error: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await createUser({
      email,
      password: hashedPassword,
      name,
    });
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    return res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// Controller: Login
export const login = async (req, res) => {
  try {
    const validationResult = loginSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: validationResult.error.errors,
      });
    }
    const { email, password } = validationResult.data;
    const user = await findUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};
