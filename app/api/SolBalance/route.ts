import { Connection, PublicKey } from "@solana/web3.js";
import { NextRequest, NextResponse } from "next/server";
type data = {
    balance:number
    statusCode:number
}

export async function GET(req:NextRequest){
    try {
        const address = req.nextUrl.searchParams.get("address");
        if(!address){
            return NextResponse.json({error:"address cant be found"},{status:400})
        }
        const connection = new Connection(process.env.SOL_RPC_URL!)
        const publicKey = new PublicKey(address!)
        const balance = await connection.getBalance(publicKey)
        const response : data ={balance :balance/1000000000,statusCode:200} 
        return NextResponse.json(response)

    } catch (error) {
        console.log(error);
        return NextResponse.json({error:"failed to fetch balance"},{status:500})
    }
}