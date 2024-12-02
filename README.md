### **Steps to Run Locally**

1. **Clone the Repository:**
   - Clone the repository to your local system.

2. **Setup the Client:**
   ```bash
   cd client
   npm install
   npm run dev
   ```
   This will run the client on `http://localhost:5713`.

3. **Setup the Server:**
   ```bash
   cd server
   npm install
   npm run start:dev
   ```
   This will start the server on `http://localhost:3000`, with WebSockets running on port `3002`.

4. **Blockchain Transactions:**
   You can view the transactions on the testnet at this [Aptos Explorer link](https://explorer.aptoslabs.com/account/0x5b3eff8ec600a819a94ab5ae27c2d8cfd1dbc0f58aca6e31c9d5455d3ec6c090?network=testnet).

---

### **Project Idea:**
- **Decentralized Virtual Workspace:** Users can meet, interact with peers, and play games in a decentralized space.
- **Avatars:** Users can upload image URLs to choose and customize their avatars.
- **Everything is Decentralized:** The entire system is decentralized, including user interactions and possibly transactions.

--
### Steps to Integrate Okto:
- Navigate to the Okto API Service:

- Go to the file server/src/okto-api/oktoApiService.ts in your project directory.
Find the APP_ID for Okto SDK:

- In this file, look for the APP_ID associated with your Okto SDK dashboard. This ID is essential for interacting with Okto's services.
