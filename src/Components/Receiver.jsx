import { useCallback, useEffect, useRef } from "react";
import { Peer } from "peerjs";

function addVideo(video, stream, videoDiv) {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoDiv.append(video);
}

const Receiver = ({ uuid }) => {
  const videoRef = useRef(null);
  const videoDivRef = useRef(null);
  const videoStreamRef = useRef();

  const receiverVideoRef = useRef(null);
  const receiverVideoDivRef = useRef(null);
  const receiverVideoStreamRef = useRef();

  const peerRef = useRef(new Peer(uuid));
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

  const answerCall = useCallback(async () => {
    try {
      const getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;

      peerRef.current.on("call", function (call) {
        console.log("called");
        getUserMedia(
          { video: true, audio: true },
          function (stream) {
            call.answer(stream);
            receiverVideoStreamRef.current = stream;
            call.on("stream", function (remoteStream) {
              addVideo(
                receiverVideoRef.current,
                remoteStream,
                receiverVideoDivRef.current
              );
            });
            call.on("close", () => {
              receiverVideoDivRef.current = null;
              receiverVideoStreamRef.current = null;
            });
          },
          function (err) {
            receiverVideoDivRef.current = null;
            receiverVideoStreamRef.current = null;
            console.log("Failed to get local stream", err);
          }
        );
      });
    } catch (error) {}
  }, []);

  useEffect(() => {
    getMediaPermission();
    answerCall();
  }, [getMediaPermission, answerCall]);

  return (
    <>
      <div ref={videoDivRef}>
        <video ref={videoRef} />
      </div>

      <div ref={receiverVideoDivRef}>
        <video ref={receiverVideoRef} />
      </div>
    </>
  );
};
export default Receiver;
