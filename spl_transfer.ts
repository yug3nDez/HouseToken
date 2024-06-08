import {Keypair, Connection, PublicKey} from "@solana/web3.js";
import {transfer, getOrCreateAssociatedTokenAccount} from "@solana/spl-token";
import wallet from "./wallet.json"

const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));
const connection = new Connection("https://api.devnet.solana.com", "confirmed");
const mint = new PublicKey("MINT ACCOUNT PUBKEY");
const from = new PublicKey("FROM WALLET PUBKEY");

const to = Keypair.generate();
console.log("New Wallet To Transfer Token", to.publicKey.toBase58());

async function transferToken() {
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
        connection, keypair, mint, to.publicKey,);
    const amount = 10 * Math.pow(10, 9);
    const hashTx = await transfer(connection,
        keypair,
        from,
        tokenAccount.address,
        keypair,
        amount);
    console.log(`Transfer txHash : https://explorer.solana.com/tx/${hashTx}?cluster=devnet`, hashTx);
}

transferToken();


