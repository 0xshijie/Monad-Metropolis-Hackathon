import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying Metropolis with account:", deployer.address);
  console.log("Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "MON");

  const Metropolis = await ethers.getContractFactory("Metropolis");
  const metropolis = await Metropolis.deploy({ gasLimit: 10_000_000, gasPrice: 110_000_000_000 });
  await metropolis.waitForDeployment();

  const address = await metropolis.getAddress();
  console.log("Metropolis deployed to:", address);

  // Optional demo seed for the live frontend demo experience.
  const seed = [
    { name: "Monad", uri: "ipfs://seed/monad" },
    { name: "Gmonad", uri: "ipfs://seed/gmonad" },
    { name: "Choyen", uri: "ipfs://seed/choyen" },
    { name: "NADS", uri: "ipfs://seed/nads" },
    { name: "Metropolis", uri: "ipfs://seed/metropolis" },
  ];

  for (const s of seed) {
    try {
      const tx = await metropolis.createSignal(s.name, s.uri, { gasLimit: 500_000, gasPrice: 110_000_000_000 });
      await tx.wait();
      console.log("Seeded signal:", s.name);
    } catch (e) {
      console.warn("Seed skipped:", s.name, (e as Error).message);
    }
  }

  console.log("\nAdd to frontend/src/lib/deployments.ts:");
  console.log(`export const METROPOLIS_ADDRESS = "${address}";`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
