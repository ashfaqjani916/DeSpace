import { Controller, Post, Body } from "@nestjs/common";
import { OktoApiService } from "./okto-api.service";

@Controller("okto-sandbox")
export class OktoApiController {
	constructor(private readonly oktoApiService: OktoApiService) {}

	@Post("/authenticate")
	async authenticate(@Body("id_token") idToken: string): Promise<any> {
		if (!idToken) {
			return { message: "id_token is required" };
		}

		try {
			const response = await this.oktoApiService.authenticate(idToken);
			return response;
		} catch (error) {
			return { error: error.message };
		}
	}

	@Post("/create-wallet")
	async createWallet(@Body("auth_token") authToken: string): Promise<any> {
		if (!authToken) {
			return { error: "auth_token is required" };
		}

		try {
			const response = await this.oktoApiService.createWallet(authToken);
			return response;
		} catch (error) {
			return { error: error.message };
		}
	}

	@Post("/get-wallet")
	async getWallet(@Body("auth_token") authToken: string): Promise<any> {
		if (!authToken) {
			return { error: "auth_token is required" };
		}

		try {
			const response = await this.oktoApiService.createWallet(authToken);
			return response;
		} catch (error) {
			return { error: error.message };
		}
	}

	@Post("/create-personList")
	async createPersonList(@Body("auth_token") authToken: string): Promise<any> {
		if (!authToken) {
			return { error: "auth_token is required" };
		}

		try {
			const response = await this.oktoApiService.createPersonList(authToken);
			return response;
		} catch (error) {
			return { error: error.message };
		}
	}

	@Post("/get-persons")
	async getPersonList(@Body("auth_token") authToken: string): Promise<any> {
		if (!authToken) {
			return { error: "auth_token is required" };
		}

		try {
			const response = await this.oktoApiService.getPersonDetails(authToken);
			return response;
		} catch (error) {
			return { error: error.message };
		}
	}

	@Post("/create-person")
	async createPerson(
		@Body("auth_token") authToken: string,
		@Body("person_name") personName: string
	): Promise<any> {
		if (!authToken) {
			return { error: "auth_token is required" };
		}

		try {
			const response = await this.oktoApiService.createPerson(
				authToken,
				personName
			);
			return response;
		} catch (error) {
			return { error: error.message };
		}
	}

	@Post("/create-meeting")
	async createMeeting(@Body("auth_token") authToken: string): Promise<any> {
		if (!authToken) {
			return { error: "auth_token is required" };
		}

		try {
			const response = await this.oktoApiService.createMeeting(authToken);
			return response;
		} catch (error) {
			return { error: error.message };
		}
	}

	@Post("/join-meeting")
	async joinMeeting(@Body("auth_token") authToken: string): Promise<any> {
		if (!authToken) {
			return { error: "auth_token is required" };
		}

		try {
			const response = await this.oktoApiService.joinMeeting(authToken, 1);
			return response;
		} catch (error) {
			return { error: error.message };
		}
	}

	@Post("/spin-wheel")
	async spingWheel(
		@Body("auth_token") authToken: string,
		@Body("rank") rank: number
	): Promise<any> {
		if (!authToken) {
			return { error: "auth_token is required" };
		}

		try {
			const response = await this.oktoApiService.playSpinWheel(
				authToken,
				"oktos",
				rank
			);
			return response;
		} catch (error) {
			return { error: error.message };
		}
	}
}
