import { useCallback, useEffect, useRef, useState } from "react";
import { Peer } from "peerjs";

function addVideo(video, stream, videoDiv) {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoDiv.append(video);
}

const VideoCall = () => {
  const videoRef = useRef(null);
  const videoDivRef = useRef(null);
  const videoStreamRef = useRef();

  const receiverVideoRef = useRef(null);
  const receiverVideoDivRef = useRef(null);
  const receiverVideoStreamRef = useRef();

  const peerRef = useRef(new Peer());
  const inputRef = useRef();
  const [peerId, setPeerId] = useState("");

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
      });

      peerRef.current.on("error", (err) => {
        alert(err);
      });
    } catch (error) {}
  }, []);

  const answerCall = useCallback(async () => {
    try {
      const getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;

      peerRef.current.on("call", function (call) {
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
              receiverVideoRef.current.srcObject = undefined;
              receiverVideoStreamRef.current = null;
            });
          },
          function (err) {
            receiverVideoRef.current.srcObject = undefined;
            receiverVideoStreamRef.current = null;
          }
        );
      });
    } catch (error) {}
  }, []);

  useEffect(() => {
    getMediaPermission();
  }, [getMediaPermission]);

  useEffect(() => {
    answerCall();
  }, [answerCall]);

  useEffect(() => {
    peerRef.current.on("open", function (id) {
      setPeerId(id);
    });
  }, []);

  const makeACall = () => {
    const otherUser = inputRef.current.value;
    const call = peerRef.current.call(otherUser, videoStreamRef.current);

    inputRef.current = "";
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

    call.on("close", function () {
      receiverVideoRef.current.srcObject = undefined;
      receiverVideoStreamRef.current = null;
    });
    call.on("error", function () {
      receiverVideoRef.current.srcObject = undefined;
      receiverVideoStreamRef.current = null;
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(peerId);
  };

  return (
    <>
      <div className="flex flex-row py-10">
        <input
          type="text"
          ref={inputRef}
          id="uuid"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none mr-4"
          placeholder="Enter UUID"
          required
        />
        <button
          onClick={makeACall}
          className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Make call
        </button>
      </div>

      <p
        className="text-lg text-white cursor-pointer"
        onClick={copyToClipboard}
      >
        Your uuid: {peerId}
      </p>

      <div className="flex flex-row my-10">
        <div ref={videoDivRef} className="w-6/12  h-6/12">
          <video ref={videoRef} className="w-full h-full" />
        </div>

        <div ref={receiverVideoDivRef} className="w-6/12 h-6/12">
          <video ref={receiverVideoRef} className="w-full h-full" />
        </div>
      </div>
    </>
  );
};
export default VideoCall;
