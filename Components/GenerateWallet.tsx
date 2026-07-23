"use client"
import nacl from "tweetnacl";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import { useState } from "react";
import bs58 from "bs58"
import {ethers} from "ethers"
import {toast} from "sonner"



type Wallet = {
    publicKey:string,
    privateKey:string,
    mnemonic:string,
    accountIndex:number,
    path:string //'60' or '501'

}
export default function GenerateWallet(){
const [pathType , setPathType] = useState('')
const[mnemonic,setMnemonic]= useState<string[]>([])
const[displaySecretPharse,setDisplaySecretPhrase]= useState<string[]>([])
const[wallet,setWallet] = useState<Wallet[]>([])
const pathTypeNames:{[key:string]:string}={
    '501':"solana",
    '60':"eth"
}




function generatewalletfromMnemonic(
    {path,mnemonic ,accountIndex}:Wallet
){
    try {
        const seed = mnemonicToSeedSync(mnemonic);
        path= `m/44'/${pathType}'/${accountIndex}'`;
        const derivedSeed = derivePath(path,seed.toString("hex")).key //gives buffer

        let publicKeyEnc:string
        let privateKeyEnc:string
    
        if(pathType==="501'"){
            //solana
           const {secretKey} = nacl.sign.keyPair.fromSeed(derivedSeed)// arrays of 32 and 64 bits for keys
    
            publicKeyEnc = Keypair.fromSecretKey(secretKey).publicKey.toBase58()
            privateKeyEnc = bs58.encode(secretKey)
    
    
        }
        else if(pathType==="60'"){
            //eth
            const privateKey = Buffer.from(derivedSeed).toString("hex")
             privateKeyEnc = privateKey

            const wallet  = new ethers.Wallet(privateKey)
             publicKeyEnc = wallet.address
            

        }
        else{toast.error("Unsupported path")
            return null
        }
        return{
            publicKey : publicKeyEnc,
            privateKey : privateKeyEnc,
            mnemonic,
            path
        }
    } catch (error) {
        toast.error("Failed to generate wallet")
        
    }
}



}
