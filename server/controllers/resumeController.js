const crypto = require("crypto");
const User = require("../models/User");
const {
  uploadToS3,
  deleteFromS3,
  generateDownloadUrl,
} = require("../services/s3Service");

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a resume",
      });
    }

    if (req.user.role !== "jobseeker") {
      return res.status(403).json({
        success: false,
        message: "Only jobseekers can upload resumes",
      });
    }

    const userId = req.user._id.toString();

    const extension = req.file.originalname
      .split(".")
      .pop()
      .toLowerCase();

    const uniqueName = `${crypto.randomUUID()}_resume.${extension}`;

    const s3Key = `resumes/${userId}/${uniqueName}`;

    await uploadToS3({
      buffer: req.file.buffer,
      key: s3Key,
      contentType: req.file.mimetype,
    });

    const user = await User.findById(userId);

    if (user.resume?.s3Key) {
      await deleteFromS3(user.resume.s3Key);
    }

    user.resume = {
      originalName: req.file.originalname,
      s3Key,
      mimeType: req.file.mimetype,
      size: req.file.size,
      uploadedAt: new Date(),
    };

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Resume uploaded successfully",
      resume: user.resume,
    });
  } catch (error) {
    console.error("Resume upload error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to upload resume",
    });
  }
};

const deleteResume = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user || !user.resume?.s3Key) {
      return res.status(404).json({
        success: false,
        message: "No resume found",
      });
    }

    await deleteFromS3(user.resume.s3Key);

    user.resume = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Resume deleted successfully",
    });
  } catch (error) {
    console.error("Resume deletion error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete resume",
    });
  }
};

const getResumeMetadata = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("resume");

    if (!user?.resume?.s3Key) {
      return res.status(404).json({
        success: false,
        message: "No resume found",
      });
    }

    return res.status(200).json({
      success: true,
      resume: user.resume,
    });
  } catch (error) {
    console.error("Get resume error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch resume",
    });
  }
};
const downloadResume = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("resume");

    if (!user?.resume?.s3Key) {
      return res.status(404).json({
        success: false,
        message: "No resume found",
      });
    }

    const url = await generateDownloadUrl(user.resume.s3Key);

    return res.status(200).json({
      success: true,
      url,
      expiresIn: 300,
    });
  } catch (error) {
    console.error("Resume download error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate resume download URL",
    });
  }
};

module.exports = {
  uploadResume,
  deleteResume,
  getResumeMetadata,
  downloadResume,
};