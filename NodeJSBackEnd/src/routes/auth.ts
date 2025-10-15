//Node Module Imports
import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//Prisma Imports
import { PrismaClient } from "../../generated/prisma";

//Project Imports
import { AuthRequest, verifyToken } from "../middleware/token";

//Prisma Init
const prisma = new PrismaClient();
const router = Router();

//Signup Route
router.post("/signup", async (req, res) => {
  const { userid, password, firstname, lastname, hostel } = req.body;
  console.log(req.body);

  if (!userid || !password || !firstname || !lastname || !hostel) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { userid } });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { userid, password: hashedPassword, firstname, lastname, hostel },
    });

    res.json({
      user: {
        userid: user.userid,
        firstname: user.firstname,
        lastname: user.lastname,
        subjects: user.subjects,
        hostel: user.hostel,
        dpcolor: user.dpcolor,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Signin Route
router.post("/signin", async (req, res) => {
  const { userid, password } = req.body;
  // console.log(req.body);

  // Basic validation
  if (!userid || !password) {
    return res.status(400).json({ error: "userid and password are required" });
  }

  try {
    
    // Check if user exists
    const user = await prisma.user.findUnique({ where: { userid } });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate JWT (using userid as payload)
    const token = jwt.sign(
      { userid: user.userid },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1h" }
    );

    res.json({
      user: {
        userid: user.userid,
        firstname: user.firstname,
        lastname: user.lastname,
        subjects: user.subjects,
        hostel: user.hostel,
        dpcolor: user.dpcolor,
      },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/updatecourses", verifyToken, async (req: AuthRequest, res) => {
  const { subjects } = req.body;

  if (!subjects || !Array.isArray(subjects)) {
    return res.status(400).json({ error: "Subjects must be an array" });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { userid: req.user!.userid },
      data: { subjects },
    });

    res.json({
      message: "Courses updated successfully",
      subjects: updatedUser.subjects,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
