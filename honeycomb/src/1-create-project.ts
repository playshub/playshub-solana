import { sendTransactions } from "@honeycomb-protocol/edge-client/client/helpers";
import { adminKeypair, client } from "./constants";

async function createProject() {
  // Create a transaction
  const {
    createCreateProjectTransaction: { tx: txResponse, project },
  } = await client.createCreateProjectTransaction({
    name: "PlaysHub x Solana",
    authority: adminKeypair.publicKey.toString(),
    payer: adminKeypair.publicKey.toString(),
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
  console.log("Create project done!", project);
}

createProject();
