import express from "express";
import {
  createLink,
  getAllLinks,
  getLinkStats,
  deleteLink
} from "../controllers/linkscontroller.js";

const router = express.Router();

router.post("/", createLink);
router.get("/", getAllLinks);
router.get("/:code", getLinkStats);
router.delete("/:code", deleteLink);

export default router;
