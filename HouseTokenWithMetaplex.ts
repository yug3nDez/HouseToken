import {Connection, Keypair, Transaction, LAMPORTS_PER_SOL, sendAndConfirmTransaction} from '@solana/web3.js';
import {getOrCreateAssociatedTokenAccount, createTransferInstruction,} from '@solana/spl-token';
import {createSignerFromKeypair, signerIdentity, generateSigner, percentAmount} from "@metaplex-foundation/umi";
import {createUmi} from "@metaplex-foundation/umi-bundle-defaults";
import {createAndMint, mplTokenMetadata, TokenStandard} from "@metaplex-foundation/mpl-token-metadata";

import wallet from "./wallet.json"

const authority = Keypair.fromSecretKey(new Uint8Array(wallet));

const connection = new Connection("https://api.devnet.solana.com", "confirmed");

const umi = createUmi("https://api.devnet.solana.com", "confirmed");
umi.use(mplTokenMetadata())
const umiWalletAuth = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const umiWalletAuthSigner = createSignerFromKeypair(umi, umiWalletAuth);
umi.use(signerIdentity(umiWalletAuthSigner));
const mint = generateSigner(umi);
const mintAccount = Keypair.fromSecretKey(mint.secretKey);

(async () => {

    //Airdrop 1SOL to the new account
    // const airdropSignature = await connection.requestAirdrop(
    //     authority.publicKey,
    //     LAMPORTS_PER_SOL,
    // );
    //
    // console.log(`Airdrop completed: https://explorer.solana.com/tx/${airdropSignature}?cluster=devnet`);


    await createAndMint(umi, {
        mint,
        authority: umi.identity,
        name: "HouseToken",
        symbol: "HOUSE",
        uri: "https://arweave.net/Zg9euNUk_ySrspwyoKOK9oiF_dwUnysSfp4R6lVNcuI",
        sellerFeeBasisPoints: percentAmount(0),
        decimals: 9,
        amount: 10000 * Math.pow(10, 9),
        tokenOwner: umiWalletAuth.publicKey,
        tokenStandard: TokenStandard.Fungible,
    }).sendAndConfirm(umi)
        .then(() => {
            console.log("Successfully minted 10000 tokens (", mint.publicKey, ")");
        })
        .catch((err) => {
            console.error("Error minting tokens:", err);
        });

    console.log(`Mint Account ${mint.publicKey}`);


    const tokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        authority,
        mintAccount.publicKey,
        authority.publicKey
    )

    console.log(`New Token Account : ${tokenAccount.address.toBase58()}`);

    //New wallet
    const toWallet = Keypair.generate();
    // Create new token account for the toWallet
    const toTokenAccount = await getOrCreateAssociatedTokenAccount(connection, authority, mintAccount.publicKey, toWallet.publicKey);

    console.log(`New Token Account that will receive the token: ${toTokenAccount.address.toBase58()}`);

    const tx = new Transaction();
    tx.add(createTransferInstruction(
        tokenAccount.address,
        toTokenAccount.address,
        authority.publicKey,
        50 * 10e9
    ))

    const transferTx = await sendAndConfirmTransaction(connection, tx, [authority]);

    console.log(`New Token Transferred : https://explorer.solana.com/tx/${transferTx}?cluster=devnet`);

})();


