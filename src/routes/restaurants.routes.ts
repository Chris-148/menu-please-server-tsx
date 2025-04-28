// const router = require("express").Router();
import { Router, Request, Response } from "express";
const router = Router();
const prisma = require("../db/index");

// Create restaurant
router.post("/create", async (req: Request, res: Response) => {
  try {
    // Destructure the expected fields from req.body
    const { name, location, restaurantImage } = req.body;

    const responseFromDB = await prisma.restaurant.create({
      data: {
        name,        // Required field
        location,    // Optional field
        restaurantImage, // Optional field
      },
    });
    res.status(201).json(responseFromDB);
  } catch (err) {
    console.error(err);
    res.status(500).json({ errorMessage: "Error creating restaurant" });
  }
});

// Get all restaurants
router.get("/all-restaurants", async (_: Request, res: Response) => {
  try {
    const restaurants = await prisma.restaurant.findMany({
      include: {
        menus: true,
      },
    });
    res.status(200).json({ allRestaurants: restaurants });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errorMessage: "Error fetching restaurants" });
  }
});

// Update restaurant
router.patch("/update-restaurants/:restaurantId", async (req: Request, res: Response) => {
  try {
    const { restaurantId } = req.params;
    const { name, location, restaurantImage } = req.body;

    const updatedRestaurant = await prisma.restaurant.update({
      where: {
        id: restaurantId,
      },
      data: {
        name,
        location,
        restaurantImage,
      },
    });

    res.status(200).json(updatedRestaurant);
  } catch (err) {
    console.error(err);
    res.status(500).json({ errorMessage: "Error updating restaurant" });
  }
});

// Delete restaurant
router.delete("/delete-restaurant/:restaurantId", async (req: Request, res: Response) => {
  try {
    const { restaurantId } = req.params;

    await prisma.restaurant.delete({
      where: {
        id: restaurantId,
      },
    });

    res.status(204).json({ message: "Restaurant deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errorMessage: "Error deleting restaurant" });
  }
});

module.exports = router;
