import { useCallback, useEffect, useRef } from "react";
import { Peer } from "peerjs";

function addVideo(video, stream, videoDiv) {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoDiv.append(video);
}

const Group = () => {
  const videoRef = useRef(null);
  const videoDivRef = useRef(null);
  const videoStreamRef = useRef();
  const inputRef = useRef();

  const peerRef = useRef(new Peer());

  const getMediaPermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      videoStreamRef.current = stream;
      addVideo(videoRef.current, stream, videoDivRef.current);
    } catch (error) {}
  }, []);

  useEffect(() => {
    getMediaPermission();
  }, [getMediaPermission]);

  const addToCall = () => {
    const call = peerRef.current.call(
      inputRef.current.value,
      videoStreamRef.current
    );

    if (!call) {
      return;
    }
    inputRef.current.value = "";

    call.on("stream", function (remoteStream) {
      const el = document.createElement("video");
      addVideo(el, remoteStream, videoDivRef.current);
    });
  };

  return (
    <>
      <input type="text" ref={inputRef} />
      <button onClick={addToCall}>Add</button>

      <div ref={videoDivRef}>
        <video ref={videoRef} />
      </div>
    </>
  );
};
export default Group;
