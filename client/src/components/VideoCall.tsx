import { useState } from "react";
import { useLocalAudio, useLocalScreenShare, useLocalVideo, useRoom } from "@huddle01/react/hooks";
import {
  usePeerIds,
  useRemoteVideo,
  useRemoteAudio,
  useRemoteScreenShare,
} from "@huddle01/react/hooks";
import { Audio, Video } from "@huddle01/react/components";
import axios from "axios";

const RemotePeer = ({ peerId }: any) => {
  const { stream: videoStream } = useRemoteVideo({ peerId });
  const { stream: audioStream } = useRemoteAudio({ peerId });
  const { videoStream: screenVideoStream, audioStream: screenAudioStream } =
    useRemoteScreenShare({ peerId });

  return (
    <div>
      {videoStream && <Video stream={videoStream} />}
      {audioStream && <Audio stream={audioStream} />}
      {screenVideoStream && <Video stream={screenVideoStream} />}
      {screenAudioStream && <Audio stream={screenAudioStream} />}
    </div>
  );
};

const VideoCall = () => {
  const { joinRoom, leaveRoom } = useRoom({
    onJoin: () => {
      console.log("Joined the room");
    },
    onLeave: () => {
      console.log("Left the room");
    },
  });

  const [roomId, setRoomId] = useState("");
  const [accessToken, setAccessToken] = useState("");

  const {
    stream: videoStream,
    enableVideo,
    disableVideo,
    isVideoOn,
  } = useLocalVideo();
  const {
    stream: audioStream,
    enableAudio,
    disableAudio,
    isAudioOn,
  } = useLocalAudio();
  const { startScreenShare, stopScreenShare, shareStream } =
    useLocalScreenShare();

  const fetchRoomAndToken = async () => {
    try {
      const roomResponse = await axios.post(
        "http://localhost:3000/huddle01room/create-room",
        {
          title: "Test Room",
        }
      );
      const { roomId } = roomResponse.data.data;
      console.log(roomId);
      setRoomId(roomId);

      const tokenResponse = await axios.post(
        `http://localhost:3000/huddle01room/get-access-token`,
        {
          roomId: "eio-gsak-lmt",
        }
      );
      console.log(tokenResponse.data);
      setAccessToken(tokenResponse.data.token);
    } catch (error) {
      console.error("Error creating room or fetching token:", error);
    }
  };

  const handleJoinRoom = () => {
    if (!roomId || !accessToken) {
      alert("Please create the room first and fetch the access token");
      return;
    }

    joinRoom({
      roomId,
      token: accessToken,
    });
  };

  const { peerIds } = usePeerIds();
  console.log(peerIds)

  return (
    <div style={{ padding: "20px" }}>
      {/* Room Management */}
      <div>
        <button
          style={{
            marginBottom: "10px",
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            fontSize: "16px",
            cursor: "pointer",
            width: "200px",
          }}
          onClick={fetchRoomAndToken}
        >
          Create Room & Get Token
        </button>
      </div>
      <div>
        <button
          style={{
            marginBottom: "10px",
            padding: "10px 20px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            fontSize: "16px",
            cursor: "pointer",
            width: "200px",
          }}
          onClick={handleJoinRoom}
        >
          Join Room
        </button>
      </div>
      <div>
        <button
          style={{
            marginBottom: "10px",
            padding: "10px 20px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "5px",
            fontSize: "16px",
            cursor: "pointer",
            width: "200px",
          }}
          onClick={leaveRoom}
        >
          Leave Room
        </button>
      </div>

      {/* Local Media Controls */}
      <div>
        {/* Webcam */}
        <button
          style={{
            marginBottom: "10px",
            padding: "10px 20px",
            backgroundColor: isVideoOn ? "#ffc107" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            fontSize: "16px",
            cursor: "pointer",
            width: "200px",
          }}
          onClick={() => (isVideoOn ? disableVideo() : enableVideo())}
        >
          {isVideoOn ? "Stop Video" : "Start Video"}
        </button>

        {/* Mic */}
        <button
          style={{
            marginBottom: "10px",
            padding: "10px 20px",
            backgroundColor: isAudioOn ? "#28a745" : "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "5px",
            fontSize: "16px",
            cursor: "pointer",
            width: "200px",
          }}
          onClick={() => (isAudioOn ? disableAudio() : enableAudio())}
        >
          {isAudioOn ? "Mute Audio" : "Unmute Audio"}
        </button>

        {/* Screen Share */}
        <button
          style={{
            marginBottom: "10px",
            padding: "10px 20px",
            backgroundColor: shareStream ? "#dc3545" : "#ffc107",
            color: "white",
            border: "none",
            borderRadius: "5px",
            fontSize: "16px",
            cursor: "pointer",
            width: "200px",
          }}
          onClick={() => (shareStream ? stopScreenShare() : startScreenShare())}
        >
          {shareStream ? "Stop Screen Share" : "Start Screen Share"}
        </button>
      </div>

      {/* Video Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {/* Local Video */}
        {videoStream && (
          <div className='w-full'>
            <div className='p-2'>
              <Video
                stream={videoStream}
                className='w-full h-48 object-cover rounded-lg'
              />
              <p className='text-sm text-center mt-2'>You</p>
            </div>
          </div>
        )}

        {/* Remote Peers */}
        {peerIds.map((peerId) => (
          <RemotePeer key={peerId} peerId={peerId} />
        ))}
      </div>
    </div>
  );
};

export default VideoCall;
