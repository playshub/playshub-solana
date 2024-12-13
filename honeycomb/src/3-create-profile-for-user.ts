import { sendTransactions } from "@honeycomb-protocol/edge-client/client/helpers";
import { adminKeypair, client, userKeypair } from "./constants";
import { config } from "dotenv";

config();

async function createProfileForUser() {
  const projectAddress = process.env.PROJECT_ADDRESS;

  if (!projectAddress) {
    throw new Error(
      "Please provide a project address in the environment variable PROJECT_ADDRESS"
    );
  }

  const {
    createNewUserWithProfileTransaction: txResponse, // This is the transaction response, you'll need to sign and send this transaction
  } = await client.createNewUserWithProfileTransaction({
    wallet: userKeypair.publicKey.toString(),
    payer: adminKeypair.publicKey.toString(),
    project: projectAddress,
    profileIdentity: userKeypair.publicKey.toString(),
    userInfo: {
      name: "John Doe",
      bio: "This user is created for testing purposes",
      pfp: "https://lh3.googleusercontent.com/-Jsm7S8BHy4nOzrw2f5AryUgp9Fym2buUOkkxgNplGCddTkiKBXPLRytTMXBXwGcHuRr06EvJStmkHj-9JeTfmHsnT0prHg5Mhg",
    },
  });

  // Send the transaction
  const response = await sendTransactions(
    client, // The client instance you created earlier in the setup
    {
      transactions: [txResponse.transaction], // If the transaction response contains only one transaction; in case of multiple transactions pass txResponse.transactions without the array brackets
      blockhash: txResponse.blockhash,
      lastValidBlockHeight: txResponse.lastValidBlockHeight,
    },
    [adminKeypair]
  );

  console.log(JSON.stringify(response, null, 2));
  console.log("Create profile for user done!");
}

createProfileForUser();
