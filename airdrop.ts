import {Keypair, Connection, LAMPORTS_PER_SOL} from "@solana/web3.js";

import wallet from "./wallet.json"

const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

const connection = new Connection("https://api.devnet.solana.com", "finalized");

async function airdrop() {
    const hashTx = await connection.requestAirdrop(keypair.publicKey, LAMPORTS_PER_SOL);
    console.log(`Airdrop completed https://explorer.solana.com/tx/${hashTx}?cluster=devnet`, hashTx);
}

airdrop();



