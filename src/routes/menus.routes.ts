import { Router, Request, Response } from "express";
import { MulterRequest } from "../types/multer.types";

const router = Router();
const prisma = require("../db/index");
const uploader = require("../middlewares/cloudinary.middleware");

// Create menu
router.post("/create", uploader.single("menuImg"), async (req: MulterRequest, res: Response) => {
  try {
    const { owner_id, restaurant_id, language, menuImg } = req.body;
    
    const menuToCreate = {
      owner_id,
      restaurant_id,
      language,
      menuImg: req.file ? req.file.path : menuImg,
    };

    const responseFromDB = await prisma.menu.create({
      data: menuToCreate,
    });
    
    res.status(201).json(responseFromDB);
  } catch (err) {
    console.error(err);
    res.status(500).json({ errorMessage: "Error creating menu" });
  }
});

// Get all menus
router.get("/all-menus", async (_: Request, res: Response) => {
  try {
    const menus = await prisma.menu.findMany({
      include: {
        owner: true,
        restaurant: true,
        dishes: true,
      },
    });
    res.status(200).json({ allMenus: menus });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errorMessage: "Error fetching menus" });
  }
});

// Get all menus for one user
router.get("/all-menus-one-user", async (req: Request, res: Response) => {
  try {
    const { ownerId } = req.query;
    
    const menus = await prisma.menu.findMany({
      where: {
        owner_id: ownerId as string,
      },
      include: {
        restaurant: true,
        dishes: true,
      },
    });
    
    res.status(200).json({ allMenusForOneUser: menus });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errorMessage: "Error fetching user menus" });
  }
});

// Get one menu
router.get("/one-menu/:menuId", async (req: Request, res: Response) => {
  try {
    const { menuId } = req.params;
    
    const menu = await prisma.menu.findUnique({
      where: {
        id: menuId,
      },
      include: {
        owner: true,
        restaurant: true,
        dishes: true,
      },
    });
    
    res.status(200).json({ oneMenu: menu });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errorMessage: "Error fetching menu" });
  }
});

// Update menu
router.patch("/update-menu/:menuId", async (req: Request, res: Response) => {
  try {
    const { menuId } = req.params;
    const { owner_id, restaurant_id, language, menuImg, dishes } = req.body;
    
    // First update the menu
    const updatedMenu = await prisma.menu.update({
      where: {
        id: menuId,
      },
      data: {
        owner_id,
        restaurant_id,
        language,
        menuImg,
      },
    });

    // If dishes are provided, update them
    if (dishes && Array.isArray(dishes)) {
      // First delete existing dishes for this menu
      await prisma.dish.deleteMany({
        where: {
          menu_id: menuId,
        },
      });

      // Then create new dishes
      await prisma.dish.createMany({
        data: dishes.map(dish => ({
          ...dish,
          menu_id: menuId,
        })),
      });
    }

    // Fetch the updated menu with its dishes
    const finalMenu = await prisma.menu.findUnique({
      where: {
        id: menuId,
      },
      include: {
        dishes: true,
      },
    });
    
    res.status(200).json(finalMenu);
  } catch (err) {
    console.error(err);
    res.status(500).json({ errorMessage: "Error updating menu" });
  }
});

// Delete menu
router.delete("/delete-menu/:menuId", async (req: Request, res: Response) => {
  try {
    const { menuId } = req.params;
    
    // First delete all dishes associated with the menu
    await prisma.dish.deleteMany({
      where: {
        menu_id: menuId
      }
    });
    
    // Then delete the menu
    await prisma.menu.delete({
      where: {
        id: menuId,
      },
    });
    
    res.status(204).json({ message: "Menu deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errorMessage: "Error deleting menu" });
  }
});

export default router;
