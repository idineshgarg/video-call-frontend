import { createBrowserRouter, RouterProvider } from "react-router-dom";
import VideoCallPage from "./pages/VideoCallPage";
import LandingPage from "./pages/LandingPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/call",
    element: <VideoCallPage />,
  },
]);

function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
