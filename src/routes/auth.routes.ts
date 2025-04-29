// const router = require("express").Router();
import { Router, Request, Response } from "express";
const router = Router();
const prisma = require("../db/index");

// Create restaurant
router.post("/signup", async (req: Request, res: Response) => {
  try {
    // Destructure the expected fields from req.body
    const { id, username, email } = req.body;

    const responseFromDB = await prisma.user.create({
      data: {
        id,        // Required field
        username,    // Optional field
        email, // Optional field
      },
    });
    res.status(201).json(responseFromDB);
  } catch (err) {
    console.error(err);
    res.status(500).json({ errorMessage: "Error creating User" });
  }
});

router.get("/one-user/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const responseFromDB = await prisma.user.findUnique({
      where: { id: userId },
    });
    res.status(200).json(responseFromDB);
  } catch (err) {
    console.error(err);
    res.status(500).json({ errorMessage: "Error fetching User" });
  }
});

export default router;
