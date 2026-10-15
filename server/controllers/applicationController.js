const Application = require("../models/Application");
const Job = require("../models/Job");
const User = require("../models/User");
const { generateDownloadUrl } = require("../services/s3service");

const applyJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Check whether the job exists
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    // Check whether the jobseeker has already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.user.id,
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job",
      });
    }

    // Create the application
    const application = await Application.create({
      job: jobId,
      applicant: req.user.id,
    });

    res.status(201).json({
      message: "Job application submitted successfully",
      application,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
// @desc    Jobseeker Dashboard Stats
// @route   GET /api/applications/dashboard-stats
// @access  Private - Jobseeker

const getDashboardStats = async (req, res) => {
  try {
    const applications = await Application.find({
  applicant: req.user.id,
}).populate("job");

// Ignore applications whose job has been deleted
const validApplications = applications.filter(
  (app) => app.job !== null
);;

    const totalApplied = validApplications.length;

    const accepted = validApplications.filter(
      (app) => app.status === "accepted"
    ).length;

    const pending = validApplications.filter(
      (app) => app.status === "pending"
    ).length;

    const rejected = validApplications.filter(
      (app) => app.status === "rejected"
    ).length;

    res.json({
      success: true,
      totalApplied,
      accepted,
      pending,
      rejected,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      applicant: req.user.id,
    }).populate("job");

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
const getJobApplicants = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Check whether the job exists
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    // Check whether logged-in recruiter owns this job
    if (job.createdBy.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to view applicants for this job",
      });
    }

    // Find all applications for this job
    const applications = await Application.find({
      job: jobId,
    }).populate("applicant", "name email");

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    // Check whether the status is valid
    const allowedStatuses = ["pending", "accepted", "rejected"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid application status",
      });
    }

    // Find the application
    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    // Find the job associated with this application
    const job = await Job.findById(application.job);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    // Check whether the logged-in recruiter owns the job
    if (job.createdBy.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to update this application",
      });
    }

    // Update application status
    application.status = status;

    await application.save();

    res.status(200).json({
      success: true,
      message: "Application status updated successfully",
      application,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getApplicantResume = async (req, res) => {
  try {
    const { applicationId } = req.params;

    // 1. Find the application
    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // 2. Find the associated job
    const job = await Job.findById(application.job);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // 3. Verify recruiter ownership
    if (job.createdBy.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this resume",
      });
    }

    // 4. Retrieve the applicant's resume metadata
    const applicant = await User.findById(application.applicant)
      .select("resume");

    if (!applicant || !applicant.resume?.s3Key) {
      return res.status(404).json({
        success: false,
        message: "Applicant has not uploaded a resume",
      });
    }

    // 5. Generate a temporary download URL
    const downloadUrl = await generateDownloadUrl(
      applicant.resume.s3Key
    );

    return res.status(200).json({
      success: true,
      message: "Resume access granted",
      resume: {
        originalName: applicant.resume.originalName,
        mimeType: applicant.resume.mimeType,
        size: applicant.resume.size,
        downloadUrl,
        expiresIn: 300,
      },
    });
  } catch (error) {
    console.error("Get applicant resume error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve applicant resume",
    });
  }
};

module.exports = {
  applyJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus,
  getDashboardStats,
  getApplicantResume,
};