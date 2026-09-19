import { ethers } from "ethers";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
  try {
    const address = req.nextUrl.searchParams.get("address");
    if (!address) {
      return NextResponse.json({ error: "address required" }, { status: 400 });
    }
    const provider = new ethers.JsonRpcProvider(process.env.ETH_RPC_URL);
   
    const balance = await provider.getBalance(address);

    return NextResponse.json({ balance: ethers.formatEther(balance) });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "failed to fetch balance" },
      { status: 500 },
    );
  }
}
