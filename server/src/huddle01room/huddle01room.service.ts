import { Injectable } from "@nestjs/common";
import axios from "axios";
import { AccessToken, Role } from "@huddle01/server-sdk/auth";
import { OktoApiService } from "src/okto-api/okto-api.service";

@Injectable()
export class Huddle01roomService {
  constructor(private readonly oktoService: OktoApiService) { }
  private readonly API_URL = "https://api.huddle01.com/api/v1/create-room";
  private readonly API_KEY = "ak_8XPQWt1zvMQSTiP8";

  async createRoom(room_name: string, auth_token: string): Promise<any> {
    try {
      const response = await axios.post(
        this.API_URL,
        { title: room_name },
        {
          headers: {
            "Content-Type": "application/json",
            "X-Api-Key": this.API_KEY,
          },
        }
      );
      await this.oktoService.createMeeting(auth_token);
      return response.data;
    } catch (error) {
      console.error(
        "Error during room creation:",
        error.response?.data || error.message
      );
      throw new Error("Room creation failed");
    }
  }

  async generateAccessToken(roomId: string): Promise<string> {
    if (!roomId) {
      throw new Error("Room ID is required to generate access token");
    }

    try {
      const accessToken = new AccessToken({
        apiKey: this.API_KEY,
        roomId,
        role: Role.HOST,
        permissions: {
          admin: true,
          canConsume: true,
          canProduce: true,
          canProduceSources: {
            cam: true,
            mic: true,
            screen: true,
          },
          canRecvData: true,
          canSendData: true,
          canUpdateMetadata: true,
        },
      });

      return await accessToken.toJwt();
    } catch (error) {
      console.error("Error generating access token:", error.message);
      throw new Error("Access token generation failed");
    }
  }
}
