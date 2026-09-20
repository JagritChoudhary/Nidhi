import { Connection, PublicKey } from "@solana/web3.js";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req:NextRequest){
    try {
        const address = req.nextUrl.searchParams.get("address");
        if(!address){
            return NextResponse.json({error:"address cant be found"},{status:400})
        }
        const connection = new Connection(process.env.SOL_RPC_URL!)
        const publicKey = new PublicKey(address!)
        const balance = await connection.getBalance(publicKey)
        return NextResponse.json({balance:balance},{status:200})

    } catch (error) {
        console.log(error);
        return NextResponse.json({error:"failed to fetch balance"},{status:500})
    }
}