import { HONEYCOMB_ADMIN_PRIVATE_KEY } from "@/utils/constants";
import createEdgeClient from "@honeycomb-protocol/edge-client";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";

const API_URL = "https://edge.test.honeycombprotocol.com/";

export const honeycombClient = createEdgeClient(API_URL, true);

export const adminKeypair = Keypair.fromSecretKey(
  bs58.decode(HONEYCOMB_ADMIN_PRIVATE_KEY)
);
