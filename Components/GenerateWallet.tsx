"use client"
import nacl from "tweetnacl";
import { generateMnemonic, mnemonicToSeedSync, validateMnemonic } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import { useState } from "react";
import bs58 from "bs58"
import {ethers} from "ethers"
import {toast} from "sonner"
import { Eye, EyeOff } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { HDKey } from '@scure/bip32';
import {easeInOut, motion} from 'motion/react'



type Wallet = {
    publicKey:string,
    privateKey:string,
    mnemonic:string,
    path:string //'60' or '501'

}
export default function GenerateWallet(){
const [pathType , setPathType] = useState<"60"|"501"|"0">("0")
const [mnemonicWords,setMnemonicWords] = useState<string[]>(Array(12).fill(""))
const[InputMnemonic,setInputMnemonic]= useState<string>("")
const[VisiblePrivateKey,setVisiblePrivateKey] = useState<boolean[]>([false]) 
const[wallets,setWallets] = useState<Wallet[]>([])

const pathTypeNames:{[key:string]:string}={
    '501':"solana",
    '60':"eth"
}
const pathname = pathTypeNames[pathType]


const generatewalletfromMnemonic = (
    pathType :string,
    mnemonic :string,
    accountIndex:number
):Wallet | null =>{
    try {
        const seed = mnemonicToSeedSync(mnemonic);
        let path :string ;
        let derivedSeed : Uint8Array<ArrayBufferLike> | null //gives buffer

        let publicKeyEnc:string
        let privateKeyEnc:string
    
        if(pathType==="501"){
            //solana
            path = `m/44'/${pathType}'/${accountIndex}'/0'`
            derivedSeed = derivePath(path,seed.toString("hex")).key
           const {secretKey} = nacl.sign.keyPair.fromSeed(derivedSeed)// arrays of 32 and 64 bits for keys
    
            publicKeyEnc = Keypair.fromSecretKey(secretKey).publicKey.toBase58()
            privateKeyEnc = bs58.encode(secretKey)
    
    
        }
        //we have to write separately for eth as lib are different 
        else if(pathType==="60"){
            //eth
            path = `m/44'/${pathType}'/0'/0/${accountIndex}`

          const hd = HDKey.fromMasterSeed(seed);

        const child = hd.derive(path);

       derivedSeed = child.privateKey

            if(derivedSeed===null){
                throw new Error("failed to derive Private key")
            }


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
      console.log(error);
      
        toast.error("Failed to generate wallet")
        return null
    }
}

const handleGenerateWallet = ()=>{
    let mnemonic = InputMnemonic.trim()
    if(mnemonic){
        if(!validateMnemonic(mnemonic)){
            toast.error("Invalid secret Phrase")
            return
        }    
    
    }else{
         //when no phrase given
            mnemonic = generateMnemonic()
        }
    
const words = mnemonic.split("")
setMnemonicWords(words)

const wallet = generatewalletfromMnemonic(
    pathType,
    mnemonic,
    wallets.length
    
)
if(wallet){
    const updatedWallets = [...wallets,wallet]
    setWallets(updatedWallets)
    localStorage.setItem("wallets",JSON.stringify(updatedWallets))
    localStorage.setItem("mnemonics",JSON.stringify(words))
    localStorage.setItem("path",JSON.stringify(pathType))
    setVisiblePrivateKey([...VisiblePrivateKey,false])
    toast.success("Wallet successfully generated")
}


}
const handleAddWallet=()=>{
if(!wallets){
    toast.error("Please generate wallets first")
}
const wallet = generatewalletfromMnemonic(
    pathType,
    mnemonicWords.join(''),
    wallets.length
)
if(wallet){
    const updatedWallets = [...wallets,wallet]
    setWallets(updatedWallets)
    localStorage.setItem("wallets",JSON.stringify(updatedWallets))
    localStorage.setItem("path",JSON.stringify(pathType))
    setVisiblePrivateKey([...VisiblePrivateKey,false])
    toast.success("Wallet successfully generated")
}
}
const handleDelete=(deleteIndex:number)=>{
    const updatedWallets = wallets.filter((_,index)=>index!==deleteIndex)
    setWallets(updatedWallets)
    setVisiblePrivateKey(VisiblePrivateKey.filter((_,index)=>index!==deleteIndex))
    localStorage.setItem("wallets",JSON.stringify(updatedWallets))
    toast.success("wallet deleted successfully")
}

const toggleVisibility=(Walletindex:number)=>{
setVisiblePrivateKey(VisiblePrivateKey.map((visible,index)=>index === Walletindex ? !visible : visible))
}
const clearWallets=()=>{
    localStorage.removeItem("wallets")
    localStorage.removeItem("mnemonic")
    localStorage.removeItem("path")
    setWallets([])
    setMnemonicWords([])
    setVisiblePrivateKey([])
}
const CopytoClipboard=(content:string)=>{
    navigator.clipboard.writeText(content)
    toast.success("message copied successfully")
}
return(
<div className="flex flex-col gap-4 w-full mx-auto items-center justify-center p-10">
{wallets.length===0 && pathType === "0" &&(
    
       <div>
    <div className="flex flex-col gap-4">
        <h1 className="tracking-tighter text-4xl font-black md:5-xl">Welcome to nidhi</h1>
            <p className="text-2xl font-light">A web wallet that support Sol & Eth</p>
            <p className ="text-xl">Pick one  </p>
    </div>

      

<div className="flex gap-2 pt-3 ">
        <Button size={"lg"}
        className= "cursor-pointer"
        onClick={()=>{setPathType("501"); toast.success("wallet selected successfully")}
        } >Solana</Button>

          <Button size={"lg"}
           className= "cursor-pointer"
        onClick={()=>{setPathType("60"); toast.success("wallet selected successfully")}
        } >Eth</Button></div> 

       
        </div>)}

{wallets.length ==0 && pathType!=="0" &&(
    
       <motion.div 
       initial={{opacity:0,y:-20}}
       animate={{opacity:1,y:0}}
       transition={{ease:easeInOut,duration:0.3}}
       className="flex flex-col w-full gap-2 p-6">
        <h1 className="text-6xl pb-4 font-bold tracking-tighter">Secret Recovery Phrase</h1>
        <div className="flex gap-2">
        
         <Input placeholder="Enter recovery phrase or click on generate wallet"
        value={InputMnemonic}
        onChange={(e)=>setInputMnemonic(e.target.value)}
        type="password"
        className="py-4 h-full"
       >
        </Input>
        <Button onClick={()=>{handleGenerateWallet()}}
            className="cursor-pointer p-4 h-full">{InputMnemonic ==="" ?"Generate wallet" :"Add wallet"}
        </Button></div>
       </motion.div>
        
    
)}

{ mnemonicWords && wallets.length > 0 && (
   
    <motion.div
    initial={{opacity:0,y:-20}}
    animate={{opacity:1,y:0}}
    transition={{duration:0.6,ease:easeInOut}}
    className="flex flex-col gap-3 justify-center  w-full">
        {pathname} wallet
        <div>{wallets.map((wallet:Wallet,index:number)=>
        <motion.div 
        key={index}  
        initial={{opacity:0,y:-20}}
        animate={{opacity:1,y:0}}
        transition={{ease:easeInOut,duration:0.4}}
            className="flex flex-col gap-2 w-full"
        
        >
            <h1>Public key</h1>
            <p>{wallet.publicKey}</p>
           <div className="flex flex-col w-full"> <h1>Private Key</h1>
           <div className="flex w-full"> <p>{VisiblePrivateKey[index]? wallet.privateKey : ".".repeat(wallet.mnemonic.length)}</p>
           <Button variant="ghost"
           onClick={()=>toggleVisibility(index)}>
            {VisiblePrivateKey[index]?<Eye></Eye> : <EyeOff></EyeOff>}</Button></div></div>
            <Button variant="ghost"
            className="p-4" 
            onClick={()=>handleAddWallet()}>Add wallet</Button>
        </motion.div>)}</div>





    </motion.div>
   
  
   )
}

</div>






)}