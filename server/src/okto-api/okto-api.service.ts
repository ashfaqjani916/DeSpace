import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

const aptosConfig = new AptosConfig({ network: Network.TESTNET });
const aptos = new Aptos(aptosConfig);

@Injectable()
export class OktoApiService {
  private readonly API_URL = 'https://sandbox-api.okto.tech/api/v2/';
  private readonly API_KEY = 'e987fc5b-e39b-4516-b9de-dc419f545684';
  private readonly CONTRACT_ADDRESS = "0x5b3eff8ec600a819a94ab5ae27c2d8cfd1dbc0f58aca6e31c9d5455d3ec6c090::meeting_room_game";
  private readonly DEPLOYED_WALLET_ADDRESS = "0x5b3eff8ec600a819a94ab5ae27c2d8cfd1dbc0f58aca6e31c9d5455d3ec6c090";
  async authenticate(idToken: string): Promise<any> {
    try {
      const api_endpoint = `${this.API_URL}/authenticate`;
      const response = await axios.post(
        api_endpoint,
        { id_token: idToken },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Api-Key': this.API_KEY,
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error('Error during authentication:', error.response?.data || error.message);
      throw new Error('Authentication failed');
    }
  }

  async createWallet(auth_token: string): Promise<any> {
    try {
      const api_endpoint = `https://sandbox-api.okto.tech/api/v1/wallet`;
      const response = await axios.post(
        api_endpoint, {},
        {
          headers: {
            Authorization: `Bearer ${auth_token}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error('Error during authentication:', error.response?.data || error.message);
      throw new Error('Authentication failed');
    }
  }

  async getWallet(auth_token: string): Promise<any> {
    try {
      const api_endpoint = `https://sandbox-api.okto.tech/api/v1/wallet`;
      const response = await axios.get(
        api_endpoint,
        {
          headers: {
            Authorization: `Bearer ${auth_token}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error('Error during authentication:', error.response?.data || error.message);
      throw new Error('Authentication failed');
    }
  }

  async getPersonList(authToken: string): Promise<any> {
    try {
      const APTOS_WALLET_ADDRESS = await this.getWalletAddress(authToken);
      console.log('Wallet Address:', APTOS_WALLET_ADDRESS);

      if (!APTOS_WALLET_ADDRESS) {
        throw new Error('Unable to retrieve wallet address');
      }

      const response = await axios.get(`https://api.testnet.aptoslabs.com/v1/accounts/0x5dd5066656f2cc4883668332844fb39a23c2ae8d37e18a6a2756e6cf792423ba/resource/${this.CONTRACT_ADDRESS}::PersonList`)

      console.log('Person List Resource:', response.data);
      return response.data;

    } catch (error) {
      console.error('Error fetching Person List:', error.message || error);
      throw new Error('Failed to retrieve Person List');
    }
  }


  async getWalletAddress(auth_token: string): Promise<string | null> {
    try {
      const walletData = await this.getWallet(auth_token);  // Assuming getWallet fetches wallet data
      const wallets = walletData?.data?.wallets;  // Safe check for wallets data

      if (!wallets || wallets.length === 0) {
        return null;  // Return null if no wallets found
      }

      // Loop through wallets and find the one with 'APTOS_TESTNET'
      for (const wallet of wallets) {
        if (wallet.network_name === 'APTOS_TESTNET') {
          return wallet.address;  // Return address if network matches
        }
      }

      return null;  // Return null if no matching network is found
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      throw new Error('Failed to retrieve wallet address');
    }
  }


  async createPersonList(auth_token: string): Promise<any> {
    // const APTOS_WALLET_ADDRESS = this.getWalletAddress(auth_token);
    const transactions = {
      "transactions": [
        {
          "function": `${this.CONTRACT_ADDRESS}::initialize_list`,
          "typeArguments": [],
          "functionArguments": []
        }
      ]
    }
    const txnResponse = await this.executeTransaction(auth_token, transactions);
    console.log(txnResponse);
    return txnResponse;
  }

  async createPerson(auth_token: string, person_name: string): Promise<any> {
    const transactions = {
      "transactions": [
        {
          "function": `${this.CONTRACT_ADDRESS}::create_person`,
          "typeArguments": [],
          "functionArguments": [person_name]
        }
      ]
    }
    const txnResponse = await this.executeTransaction(auth_token, transactions);
    console.log(txnResponse);
    return txnResponse;
  }

  async executeTransaction(authToken: string, transactionData: any): Promise<any> {
    try {
      const api_url = 'https://sandbox-api.okto.tech/api/v1/rawtransaction/execute'

      const response = await axios.post(
        api_url,
        {
          network_name: 'APTOS_TESTNET',
          transaction: transactionData,
        },
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error('Error during transaction execution:', error);
      throw new Error('Transaction execution failed');
    }
  }
}
