import { useContext, useEffect, useRef, useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaUserTag,
  FaEdit,
  FaSave,
  FaFilePdf,
  FaCloudUploadAlt,
  FaDownload,
  FaTrash,
  FaSyncAlt,
} from "react-icons/fa";
import {
  getProfile,
  updateProfile,
} from "../../services/authService";
import {
  getResume,
  uploadResume,
  getResumeDownloadUrl,
  deleteResume,
} from "../../services/resumeService";
import { toast } from "react-toastify";
import AuthContext from "../../context/AuthContext";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_EXTENSIONS = ["pdf", "doc", "docx"];

function Profile() {
  const [user, setUser] = useState(null);
  const { updateUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [resume, setResume] = useState(null);
  const [resumeLoading, setResumeLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchProfile();
    fetchResume();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getProfile();

      setUser(data.user);
      setFormData({
        name: data.user.name,
        email: data.user.email,
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load profile"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchResume = async () => {
    setResumeLoading(true);

    try {
      const data = await getResume();
      setResume(data.resume);
    } catch (error) {
      if (error.response?.status === 404) {
        setResume(null);
      } else {
        toast.error(
          error.response?.data?.message ||
            "Failed to load resume details"
        );
      }
    } finally {
      setResumeLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      const data = await updateProfile(formData);

      toast.success(data.message);
      setUser(data.user);
      updateUser(data.user);
      setIsEditing(false);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Profile update failed"
      );
    }
  };

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];

    // Allow selecting the same file again later.
    event.target.value = "";

    if (!file) return;

    const extension = file.name.split(".").pop().toLowerCase();

    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      toast.error("Only PDF, DOC, and DOCX files are allowed");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Resume must be 5 MB or smaller");
      return;
    }

    setUploading(true);

    try {
      const data = await uploadResume(file);
      setResume(data.resume);
      toast.success(data.message || "Resume uploaded successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to upload resume"
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);

    try {
      const data = await getResumeDownloadUrl();

      if (!data.url) {
        throw new Error("Download URL was not returned");
      }

      // Open synchronously to reduce popup-blocker issues.
      const openedWindow = window.open("about:blank", "_blank");

      if (openedWindow) {
        openedWindow.opener = null;
        openedWindow.location.href = data.url;
      } else {
        window.location.assign(data.url);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to open resume"
      );
    } finally {
      setDownloading(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your resume? This cannot be undone."
    );

    if (!confirmed) return;

    setDeleting(true);

    try {
      const data = await deleteResume();
      setResume(null);
      toast.success(data.message || "Resume deleted successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to delete resume"
      );
    } finally {
      setDeleting(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="mt-6 text-lg text-gray-600">
          Loading Profile...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-gray-50 min-h-screen p-8">
        <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
          <p className="text-gray-600">
            Unable to load your profile. Please try again.
          </p>
          <button
            onClick={fetchProfile}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      {/* Profile hero */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 rounded-3xl p-10 text-white shadow-xl mb-10">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-28 h-28 rounded-full bg-white text-blue-700 flex items-center justify-center text-5xl font-bold shadow-lg">
            {user.name.charAt(0).toUpperCase()}
          </div>

          <div>
            <h1 className="text-5xl font-bold">{user.name}</h1>
            <p className="text-blue-100 text-lg mt-3">
              Manage your CareerNest profile and keep your
              information updated for recruiters.
            </p>
          </div>
        </div>
      </div>

      {/* Profile information */}
      <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
        <h2 className="text-3xl font-bold mb-8">
          Profile Information
        </h2>

        <div className="space-y-8">
          <div>
            <label className="flex items-center gap-3 font-semibold mb-3">
              <FaUser className="text-blue-600" />
              Full Name
            </label>

            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            ) : (
              <p className="text-xl">{user.name}</p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-3 font-semibold mb-3">
              <FaEnvelope className="text-green-600" />
              Email Address
            </label>

            {isEditing ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            ) : (
              <p className="text-xl">{user.email}</p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-3 font-semibold mb-3">
              <FaUserTag className="text-purple-600" />
              Role
            </label>

            <span className="inline-block bg-purple-100 text-purple-700 px-4 py-2 rounded-full capitalize font-semibold">
              {user.role}
            </span>
          </div>
        </div>

        <div className="mt-10">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl flex items-center gap-3 transition"
            >
              <FaSave />
              Save Changes
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl flex items-center gap-3 transition"
            >
              <FaEdit />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Resume management */}
      {user.role === "jobseeker" && (
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-3xl font-bold">
                My Resume
              </h2>
              <p className="text-gray-500 mt-2">
                Keep your resume updated for your job applications.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchResume}
              disabled={resumeLoading}
              className="self-start sm:self-auto border border-gray-300 hover:bg-gray-50 disabled:opacity-50 px-4 py-2 rounded-xl flex items-center gap-2 transition"
            >
              <FaSyncAlt className={resumeLoading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={handleUpload}
          />

          {resumeLoading ? (
            <div className="flex items-center gap-3 py-8 text-gray-500">
              <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              Loading resume details...
            </div>
          ) : resume ? (
            <div className="border border-gray-200 rounded-2xl p-5">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl">
                  <FaFilePdf />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-lg break-words">
                    {resume.originalName}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {typeof resume.size === "number"
                      ? formatFileSize(resume.size)
                      : "File size unavailable"}
                    {" · "}
                    {resume.uploadedAt
                      ? `Uploaded ${new Date(
                          resume.uploadedAt
                        ).toLocaleDateString()}`
                      : "Upload date unavailable"}
                  </p>
                  <p className="text-sm text-green-700 mt-2">
                    Resume uploaded successfully
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleDownload}
                    disabled={downloading || deleting || uploading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition"
                  >
                    <FaDownload />
                    {downloading ? "Opening..." : "View / Download"}
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading || deleting || downloading}
                    className="border border-blue-600 text-blue-600 hover:bg-blue-50 disabled:opacity-50 px-4 py-2 rounded-xl flex items-center gap-2 transition"
                  >
                    <FaSyncAlt />
                    Replace
                  </button>

                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleting || uploading || downloading}
                    className="border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50 px-4 py-2 rounded-xl flex items-center gap-2 transition"
                  >
                    <FaTrash />
                    {deleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-3xl">
                <FaCloudUploadAlt />
              </div>

              <h3 className="text-xl font-semibold mt-4">
                No resume uploaded yet
              </h3>

              <p className="text-gray-500 mt-2">
                Upload your resume so you can use it for your job applications.
              </p>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="mt-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl inline-flex items-center gap-2 transition"
              >
                <FaCloudUploadAlt />
                {uploading ? "Uploading..." : "Upload Resume"}
              </button>

              <p className="text-sm text-gray-400 mt-4">
                PDF, DOC or DOCX · Maximum size 5 MB
              </p>
            </div>
          )}

          {uploading && (
            <p className="text-sm text-blue-600 mt-4">
              Uploading your resume securely...
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default Profile;