import { Router } from "express";
import { createLink, getAllLinks, getLink, deleteLink } 
from "../controllers/linkscontroller.js";

const router = Router();

router.post("/", createLink);
router.get("/", getAllLinks);
router.get("/:code", getLink);
router.delete("/:code", deleteLink);

export default router;
