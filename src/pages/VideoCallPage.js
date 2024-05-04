import { useParams } from "react-router";
import VideoCall from "../Components/VideoCall";

const VideoCallPage = () => {
  const params = useParams();

  return (
    <div className="bg-white h-screen">
      <div className="h-full">
        <div className=" overflow-hidden bg-gray-900 px-6 pt-16 shadow-2xl  sm:px-16 md:pt-24 lg:flex flex-col lg:gap-x-20 lg:px-24 lg:pt-0 h-full">
          <VideoCall />
        </div>
      </div>
    </div>
  );
};
export default VideoCallPage;
