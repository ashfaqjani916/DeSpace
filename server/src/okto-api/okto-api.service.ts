import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { PersonService } from 'src/persons/persons.service';

const aptosConfig = new AptosConfig({ network: Network.TESTNET });
const aptos = new Aptos(aptosConfig);


interface GameHistory {
  result: string;
}

interface Person {
  person_id: number; // Corresponds to u64
  name: string;
  attendance_count: number; // Corresponds to u64
  meeting_ids: number[]; // Corresponds to vector<u64>
  game_history: GameHistory[]; // Corresponds to vector<GameHistory>
  address: string; // Corresponds to address
}



@Injectable()
export class OktoApiService {
  constructor(private readonly personService: PersonService) { }
  private readonly API_URL = 'https://sandbox-api.okto.tech/api/v2/';
  private readonly API_KEY = 'e987fc5b-e39b-4516-b9de-dc419f545684';
  private readonly CONTRACT_ADDRESS = "0x5b3eff8ec600a819a94ab5ae27c2d8cfd1dbc0f58aca6e31c9d5455d3ec6c090::meeting_room_game2";
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

      const response = await axios.get(`https://api.testnet.aptoslabs.com/v1/accounts/${APTOS_WALLET_ADDRESS}/resource/${this.CONTRACT_ADDRESS}::PersonList`)

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
    await this.executeTransaction(auth_token, transactions);
    const users = await this.personService.getPersonCount();
    const APTOS_WALLET_ADDRESS = await this.getWalletAddress(auth_token);
    const user = await this.personService.createPerson({ person_id: users + 1, address: APTOS_WALLET_ADDRESS });
    return user;
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

  async getPersonDetails(auth_token: string): Promise<any> {
    const person_list = await this.getPersonList(auth_token);
    const data = person_list.data;
    const numberOfPeople = data.person_counter;
    const personHandle = data.persons.handle;

    let persons = [];
    let counter = 1;
    while (counter <= numberOfPeople) {
      const tableItem = {
        key_type: "u64",
        value_type: `${this.CONTRACT_ADDRESS}::Person`,
        key: `${counter}`,
      };
      const person = await aptos.getTableItem<Person>({ handle: personHandle, data: tableItem });
      persons.push(person);
      counter++;
    }

    return persons;
  }

  async createMeeting(auth_token: string): Promise<any> {
    try {
      const persons = await this.getPersonDetails(auth_token);
      const APTOS_WALLET_ADDRESS = await this.getWalletAddress(auth_token);

      let creator_id;
      for (const person of persons) {
        if (person.address === APTOS_WALLET_ADDRESS.toString()) {
          creator_id = person.person_id;
          break;
        }
      }

      if (!creator_id) {
        throw new Error("Creator ID not found for the wallet address.");
      }

      const currentDate = new Date().toISOString();

      const transactions = {
        transactions: [
          {
            function: `${this.CONTRACT_ADDRESS}::create_meeting`,
            typeArguments: [],
            functionArguments: [creator_id, currentDate],
          },
        ],
      };

      const response = await this.executeTransaction(auth_token, transactions);
      return response;
    } catch (error) {
      console.error("Error creating meeting:", error);
      throw error;
    }
  }

  async joinMeeting(auth_token: string, meeting_id: string): Promise<any> {
    try {
      const persons = await this.getPersonDetails(auth_token);
      const APTOS_WALLET_ADDRESS = await this.getWalletAddress(auth_token);

      let creator_id;
      for (const person of persons) {
        if (person.address === APTOS_WALLET_ADDRESS.toString()) {
          creator_id = person.person_id;
          break;
        }
      }

      if (!creator_id) {
        throw new Error("Creator ID not found for the wallet address.");
      }

      const currentDate = new Date().toISOString();

      const transactions = {
        transactions: [
          {
            function: `${this.CONTRACT_ADDRESS}::join_meeting`,
            typeArguments: [],
            functionArguments: [creator_id, meeting_id],
          },
        ],
      };

      const response = await this.executeTransaction(auth_token, transactions);
      return response;
    } catch (error) {
      console.error("Error creating meeting:", error);
      throw error;
    }
  }

  async playSpinWheel(auth_token: string, booth_name: string, rank: number): Promise<any> {
    const persons = await this.getPersonDetails(auth_token);

    const APTOS_WALLET_ADDRESS = await this.getWalletAddress(auth_token);

    let person_id: string | undefined;
    for (const person of persons) {
      if (person.address === APTOS_WALLET_ADDRESS.toString()) {
        person_id = person.person_id;
        break;
      }
    }

    if (!person_id) {
      throw new Error("Creator ID not found for the wallet address.");
    }

    const currentDate = new Date().toISOString();
    const token_string = `${booth_name}-${rank}-${currentDate}`;

    const transactions = {
      transactions: [
        {
          function: `${this.CONTRACT_ADDRESS}::play_spin_wheel`,
          typeArguments: [],
          functionArguments: [person_id, token_string],
        },
      ],
    };

    const response = await this.executeTransaction(auth_token, transactions);

    return response;
  }


  async getAllPersons() {
    return await this.personService.getAllPersons();
  }

}
