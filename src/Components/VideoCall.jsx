import { useCallback, useEffect, useRef, useState } from "react";
import { Peer } from "peerjs";
import { connect } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

function addVideo(video, stream, videoDiv) {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoDiv.append(video);
}

const socket = connect("http://localhost:4000/");
const peerConnections = {};
const roomID = "roomId";
const VideoCall = ({ uuid }) => {
  const videoRef = useRef(null);
  const videoDivRef = useRef(null);
  const videoStreamRef = useRef();

  const receiverVideoRef = useRef(null);
  const receiverVideoDivRef = useRef(null);
  const receiverVideoStreamRef = useRef();
  const [otherUser, setOtherUser] = useState("");

  const peerRef = useRef(new Peer(uuidv4(), { debug: 1 }));

  const initializeSocket = () => {
    socket.on("userJoined", (id) => {
      console.log("new user joined");
      const call = peerRef.current.call(id, videoStreamRef.current);
      const vid = videoRef.current;
      call.on("error", (err) => {
        console.log(err);
        alert(err);
      });
      call.on("stream", (userStream) => {
        addVideo(vid, userStream);
      });
      call.on("close", () => {
        vid.remove();
        console.log("user disconect");
      });
      peerConnections[id] = call;
    });
    socket.on("userDisconnect", (id) => {
      if (peerConnections[id]) {
        peerConnections[id].close();
      }
    });
  };
  const getMediaPermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      videoStreamRef.current = stream;
      addVideo(videoRef.current, stream, videoDivRef.current);

      peerRef.current.on("open", (id) => {
        const myId = id;
        socket.emit("newUser", id, roomID);
      });

      peerRef.current.on("error", (err) => {
        alert(err);
      });
    } catch (error) {}
  }, []);

  useEffect(() => {
    getMediaPermission();
    initializeSocket();
  }, [getMediaPermission]);

  const makeACall = (otherUser) => {
    const call = peerRef.current.call(otherUser, videoStreamRef.current);

    console.log(peerRef.current, call);
    if (!call) {
      return;
    }
    call.on("stream", function (remoteStream) {
      receiverVideoStreamRef.current = remoteStream;
      addVideo(
        receiverVideoRef.current,
        remoteStream,
        receiverVideoDivRef.current
      );
    });
  };

  return (
    <>
      <button
        onClick={() => {
          makeACall("b91f5dd2-94ad-47fc-b0eb-d0dd856931f4");
        }}
        className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        Make call
      </button>

      <div ref={videoDivRef}>
        <video ref={videoRef} />
      </div>

      <div ref={receiverVideoDivRef}>
        <video ref={receiverVideoRef} />
      </div>
    </>
  );
};
export default VideoCall;
