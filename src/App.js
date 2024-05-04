import { createBrowserRouter, RouterProvider } from "react-router-dom";
import VideoCallPage from "./pages/VideoCallPage";
import LandingPage from "./pages/LandingPage";
import VideoReceiver from "./pages/VideoReceiver";
import Group from "./Components/Group";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/call/:uuid",
    element: <VideoCallPage />,
  },
  {
    path: "/receiver/:uuid",
    element: <VideoReceiver />,
  },
  {
    path: "/group",
    element: <Group />,
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
