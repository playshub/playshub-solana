import createEdgeClient from "@honeycomb-protocol/edge-client";

import path from "path";
import fs from "fs";
import * as web3 from "@solana/web3.js";
import { config } from "dotenv";

config();

const API_URL = "https://edge.test.honeycombprotocol.com/";

export const client = createEdgeClient(API_URL, true);

export const adminKeypair = web3.Keypair.fromSecretKey(
  Uint8Array.from(
    JSON.parse(
      fs.readFileSync(path.resolve(__dirname, "../keys", "admin.json"), "utf8")
    )
  )
);

export const userKeypair = web3.Keypair.fromSecretKey(
  Uint8Array.from(
    JSON.parse(
      fs.readFileSync(path.resolve(__dirname, "../keys", "user.json"), "utf8")
    )
  )
);

export const projectAddress = process.env.PROJECT_ADDRESS;

if (!projectAddress) {
  throw new Error(
    "Please provide a project address in the environment variable PROJECT_ADDRESS"
  );
}
