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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { Button } from "./ui/button";
import {
  Video as VideoIcon,
  VideoOff,
  Mic,
  MicOff,
  Share2,
  StopCircle,
  LogIn,
  LogOut,
  PlusCircle
} from "lucide-react";

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
  const token = localStorage.getItem("okto_auth_token");
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
					auth_token : token
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

  const handleJoinRoom = async () => {
     const roomResponse = await axios.post(
				"http://localhost:3000/okto-sandbox/join-room",
				{
					auth_token: token,
				}
			);
      
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
    <TooltipProvider>
      <div className="p-5 space-y-4">



        <div className="fixed bottom-2 right-2 w-full max-w-xs">
          <div className="p-2 m-3 bg-gray-800 rounded-lg shadow-lg">
            {videoStream && (<>
              <Video
                stream={videoStream}
                className="w-full h-48 object-cover rounded-lg"
              />
              <p className="text-sm text-center mt-2 text-white">You</p>
            </>)}

          </div>
          <div className="flex gap-4 justify-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={fetchRoomAndToken}
                >
                  <PlusCircle className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Create Room & Get Token</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleJoinRoom}
                >
                  <LogIn className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Join Room</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={leaveRoom}
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Leave Room</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isVideoOn ? "destructive" : "default"}
                  size="icon"
                  onClick={() => (isVideoOn ? disableVideo() : enableVideo())}
                >
                  {isVideoOn ? (
                    <VideoOff className="h-5 w-5" />
                  ) : (
                    <VideoIcon className="h-5 w-5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isVideoOn ? "Stop Video" : "Start Video"}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isAudioOn ? "destructive" : "default"}
                  size="icon"
                  onClick={() => (isAudioOn ? disableAudio() : enableAudio())}
                >
                  {isAudioOn ? (
                    <MicOff className="h-5 w-5" />
                  ) : (
                    <Mic className="h-5 w-5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isAudioOn ? "Mute Audio" : "Unmute Audio"}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={shareStream ? "destructive" : "default"}
                  size="icon"
                  onClick={() => (shareStream ? stopScreenShare() : startScreenShare())}
                >
                  {shareStream ? (
                    <StopCircle className="h-5 w-5" />
                  ) : (
                    <Share2 className="h-5 w-5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {shareStream ? "Stop Screen Share" : "Start Screen Share"}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>


        {/* Video Grid */}
        <div className='flex items-center flex-col gap-2'>
          {peerIds.map((peerId) => (
            <RemotePeer className="h-48 w-64" key={peerId} peerId={peerId} />
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default VideoCall;
