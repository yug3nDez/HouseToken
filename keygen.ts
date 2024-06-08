import {Keypair} from "@solana/web3.js"

//Generate a new keypair
const keypair = Keypair.generate();

console.log("PubKey ",keypair.publicKey);
console.log("PriKey ",keypair.secretKey);



