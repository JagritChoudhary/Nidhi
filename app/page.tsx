import GenerateWallet from "@/Components/GenerateWallet";
import Navbar from "@/Components/Navbar";

export default function Home() {
  return (
    <main className="max-w-7xl w-full mx-auto flex flex-col gap-4  min-h-[92vh]">
      <Navbar></Navbar>
      <GenerateWallet></GenerateWallet>
    </main>
  );
}