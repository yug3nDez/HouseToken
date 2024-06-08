import {Keypair, Connection, LAMPORTS_PER_SOL, PublicKey} from "@solana/web3.js";
import {createMint, mintTo, getOrCreateAssociatedTokenAccount} from "@solana/spl-token";
import wallet from "./wallet.json"

const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));
const connection = new Connection("https://api.devnet.solana.com", "confirmed");

//const mint = new PublicKey("8CP6RXyS7wnBELi24tjHsnuYhYQxbJxc4RgsVmMsttbJ");


async function spl_init(): Promise<PublicKey> {
    const mint = await createMint(
        connection,
        keypair,
        keypair.publicKey,
        keypair.publicKey,
        9,
    );
    console.log("Mint address: ", mint.toBase58());
    return mint;
}

async function createTokenAccount(mint: PublicKey) {
    const tokenAccount = await getOrCreateAssociatedTokenAccount(connection,
        keypair,
        mint,
        keypair.publicKey);

    console.log("Token account address: ", tokenAccount.address.toBase58());



    const minted = await mintTo(connection, keypair, mint, tokenAccount.address, keypair.publicKey, 100*Math.pow(10, 9));
    console.log("Minted: ", minted);
}

spl_init()
    .then((mintPubKey) => createTokenAccount(mintPubKey));



