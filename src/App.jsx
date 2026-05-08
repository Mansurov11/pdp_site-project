import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Layout from "./pages/Layout/Layout";
import Login from "./pages/Login/Login";
import LandingPage from "./pages/LandingPage/LandingPage";
import Dashboard from "./pages/Dashboard/Dashboard";
import Classes from "./pages/Classes/Classes";
import ClassDetail from "./pages/Classes/ClassDetail";
import CreateClass from "./pages/Classes/CreateClass";
import History from "./pages/History/History";
import Profile from "./pages/Profile/Profile";
import Statistics from "./pages/Statistics/Statistics";
import StudentLayout from "./pages/Student/StudentLayout";
import StudentHome from "./pages/Student/StudentHome";
import StudentLeaders from "./pages/Student/StudentLeaders";
import StudentRules from "./pages/Student/StudentRules";
import StudentComplain from "./pages/Student/StudentComplain";
import StudentProfile from "./pages/Student/StudentProfile";
import AdminTeachers from "./pages/Admin/AdminTeachers";
import AdminRules from "./pages/Admin/AdminRules";
import AdminAppeals from "./pages/Admin/AdminAppeals";
import { ToastContainer } from "react-toastify";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

const StudentRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (!token) return <Navigate to="/login" replace />;
  if (user.role && user.role !== "student") return <Navigate to="/home" replace />;
  return children;
};

const router = createBrowserRouter([
    {
      path: "/",
      element: <LandingPage />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/home",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          element: <Navigate to={"dashboard"} />,
        },
        {
          path: "dashboard",
          element: <Dashboard />,
        },
        {
          path: "history",
          element: <History />,
        },
        {
          path: "statistics",
          element: <Statistics />,
        },
        {
          path: "profile",
          element: <Profile />,
        },
                {
          path: "classes",
          element: <Classes />,
        },
        {
          path: "classes/:id", // ":" dan oldin "/" bo'lishi shart va bu ClassDetail uchun
          element: <ClassDetail />,
        },
        {
          path: "teachers",
          element: <AdminTeachers />,
        },
        {
          path: "rules",
          element: <AdminRules />,
        },
        {
          path: "appeals",
          element: <AdminAppeals />,
        },
      ],
    },
    {
      path: "/student",
      element: (
        <StudentRoute>
          <StudentLayout />
        </StudentRoute>
      ),
      children: [
        { index: true, element: <Navigate to="home" replace /> },
        { path: "home", element: <StudentHome /> },
        { path: "leaders", element: <StudentLeaders /> },
        { path: "rules", element: <StudentRules /> },
        { path: "complain", element: <StudentComplain /> },
        { path: "profile", element: <StudentProfile /> },
      ],
    },
    {
      path: "*",
      element: <Navigate to="/" replace />,
    },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
}

export default App;
