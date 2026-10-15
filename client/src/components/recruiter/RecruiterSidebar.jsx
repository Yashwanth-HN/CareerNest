
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBriefcase,
  FaPlusCircle,
  FaUsers,
} from "react-icons/fa";

function RecruiterSidebar() {
  const menu = [
    {
      name: "Dashboard",
      icon: <FaTachometerAlt />,
      path: "/recruiter/dashboard",
    },
    {
      name: "My Jobs",
      icon: <FaBriefcase />,
      path: "/recruiter/my-jobs",
    },
    {
      name: "Create Job",
      icon: <FaPlusCircle />,
      path: "/recruiter/create-job",
    },
    {
      name: "Applicants",
      icon: <FaUsers />,
      path: "/recruiter/my-jobs",
    },
  ];

  return (
    <aside className="w-64 h-screen bg-gray-900 text-white p-6">
      <h2 className="text-2xl font-bold mb-8">
        Recruiter
      </h2>

      <div className="space-y-2">
        {menu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg ${
                isActive
                  ? "bg-blue-600"
                  : "hover:bg-gray-800"
              }`
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </div>
    </aside>
  );
}

export default RecruiterSidebar;
