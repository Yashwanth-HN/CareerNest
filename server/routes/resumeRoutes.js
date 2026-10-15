const express = require("express");

const {
  uploadResume,
  deleteResume,
  getResumeMetadata,
  downloadResume,
} = require("../controllers/resumeController");

const { protect } = require("../middleware/authMiddleware");
const { uploadResume: uploadResumeMiddleware } = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post(
  "/upload",
  protect,
  uploadResumeMiddleware,
  uploadResume
);

router.get(
  "/download",
  protect,
  downloadResume
);

router.get(
  "/",
  protect,
  getResumeMetadata
);

router.delete(
  "/",
  protect,
  deleteResume
);

module.exports = router;