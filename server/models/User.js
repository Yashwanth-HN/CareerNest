const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["jobseeker", "recruiter", "admin"],
      default: "jobseeker",
    },
    resume: {
  originalName: {
    type: String,
  },

  s3Key: {
    type: String,
  },

  mimeType: {
    type: String,
  },

  size: {
    type: Number,
  },

  uploadedAt: {
    type: Date,
  },
},
    resetPasswordToken: {
        type: String,
      },

      resetPasswordExpire: {
        type: Date,
      },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;