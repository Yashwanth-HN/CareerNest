import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Home from "./pages/public/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";
import JobSeekerDashboard from "./pages/jobseeker/JobSeekerDashboard";
import Jobs from "./pages/public/Jobs";
import Companies from "./pages/public/Companies";
import About from "./pages/public/About";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ResetPassword from "./pages/auth/ResetPassword";
import ForgotPassword from "./pages/auth/ForgotPassword";
import JobDetails from "./pages/public/JobDetails";
import RecruiterLayout from "./layouts/RecruiterLayout";

import MyJobs from "./pages/recruiter/MyJobs";
import CreateJob from "./pages/recruiter/CreateJob";
import Applicants from "./pages/recruiter/Applicants";
import EditJob from "./pages/recruiter/EditJob";
import JobSeekerLayout from "./layouts/JobSeekerLayout";

import MyApplications from "./pages/jobseeker/MyApplications";
import Profile from "./pages/jobseeker/Profile";


function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/recruiter"
            element={
              <ProtectedRoute role="recruiter">
                <RecruiterLayout />
              </ProtectedRoute>
            }
          >
            <Route
              path="dashboard"
              element={<RecruiterDashboard />}
            />
            <Route path="my-jobs" element={<MyJobs />} />
            <Route path="create-job" element={<CreateJob />} />
            <Route path="applicants/:jobId" element={<Applicants />}
/>
            <Route
              path="edit-job/:id"
              element={<EditJob />}
            />
          </Route>
          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />
          <Route
            path="/reset-password/:token"
            element={<ResetPassword />}
          />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/jobseeker"
            element={
              <ProtectedRoute role="jobseeker">
                <JobSeekerLayout />
              </ProtectedRoute>
            }
          >
            <Route
                  path="dashboard"
                  element={<JobSeekerDashboard />}
                />

            <Route
              path="applications"
              element={<MyApplications />}
            />

            <Route
              path="profile"
              element={<Profile />}
            />
          </Route>
        </Routes>
        <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
      />
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;