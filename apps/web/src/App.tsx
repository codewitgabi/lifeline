import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import LandingPage from "./pages/LandingPage";
import DonorDashboard from "./pages/DonorDashboard";
import RegisterDonor from "./pages/RegisterDonor";
import CreateRequest from "./pages/CreateRequest";
import RequestStatus from "./pages/RequestStatus";

const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  {
    element: <Layout />,
    children: [
      { path: "/dashboard", element: <DonorDashboard /> },
      { path: "/register", element: <RegisterDonor /> },
      { path: "/request/new", element: <CreateRequest /> },
      { path: "/request/:id", element: <RequestStatus /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
