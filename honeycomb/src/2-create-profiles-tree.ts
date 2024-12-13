import { adminKeypair, client } from "./constants";
import { config } from "dotenv";
import { sendTransactions } from "@honeycomb-protocol/edge-client/client/helpers";

config();

const projectAddress = process.env.PROJECT_ADDRESS;

if (!projectAddress) {
  throw new Error(
    "Please provide a project address in the environment variable PROJECT_ADDRESS"
  );
}

async function createProfilesTree() {
  const {
    createCreateProfilesTreeTransaction: { tx: txResponse, treeAddress }, // This is the transaction response, you'll need to sign and send this transaction
  } = await client.createCreateProfilesTreeTransaction({
    payer: adminKeypair.publicKey.toString(),
    project: projectAddress,
    treeConfig: {
      // Provide either the basic or advanced configuration, we recommend using the basic configuration if you don't know the exact values of maxDepth, maxBufferSize, and canopyDepth (the basic configuration will automatically configure these values for you)
      basic: {
        numAssets: 100000, // The desired number of profiles this tree will be able to store
      },
      // Uncomment the following config if you want to configure your own profile tree (also comment out the above config)
      // advanced: {
      //   maxDepth: 20,
      //   maxBufferSize: 64,
      //   canopyDepth: 14,
      // }
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
  console.log("Create profiles tree done!", treeAddress);
}

createProfilesTree();
