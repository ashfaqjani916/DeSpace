import { Controller, Body, Post } from '@nestjs/common';
import { Huddle01roomService } from './huddle01room.service';
import { AccessToken, Role } from "@huddle01/server-sdk/auth";

@Controller("huddle01room")
export class Huddle01roomController {
  constructor(private readonly huddle01roomService: Huddle01roomService) { }

  @Post("/create-room")
  async createRoom(@Body("title") title: string): Promise<any> {
    if (!title) {
      return { message: "title is required" };
    }

    try {
      const response = await this.huddle01roomService.createRoom(title);
      return response;
    } catch (error) {
      return { error: error.message };
    }
  }

  @Post("/get-access-token")
  async getAccessToken(@Body("roomId") roomId: string): Promise<any> {
    if (!roomId) {
      return { message: "roomId is required" };
    }

    try {
      const token = await this.huddle01roomService.generateAccessToken(roomId);
      return { token };
    } catch (error) {
      return { error: error.message };
    }
  }
}
