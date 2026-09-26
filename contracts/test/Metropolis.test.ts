import { expect } from "chai";
import { ethers } from "hardhat";

describe("Metropolis", function () {
  async function deploy() {
    const [owner, alice, bob] = await ethers.getSigners();
    const Metropolis = await ethers.getContractFactory("Metropolis");
    const metropolis = await Metropolis.deploy();
    await metropolis.waitForDeployment();
    return { metropolis, owner, alice, bob };
  }

  it("creates a signal and boosts it", async function () {
    const { metropolis, alice } = await deploy();
    await (await metropolis.createSignal("Monad", "ipfs://meta")).wait();

    await expect(metropolis.connect(alice).boost(1, { value: ethers.parseEther("1") }))
      .to.emit(metropolis, "Boosted");

    const summary = await metropolis.signal(1);
    expect(summary[4]).to.be.gt(0); // pool
    expect(await metropolis.getShares(1, alice.address)).to.be.gt(0);
  });

  it("pays creator fees", async function () {
    const { metropolis, alice, bob } = await deploy();
    await (await metropolis.connect(alice).createSignal("Culture", "ipfs://meta")).wait();

    const before = await ethers.provider.getBalance(alice.address);
    await (await metropolis.connect(bob).boost(1, { value: ethers.parseEther("1") })).wait();
    await (await metropolis.connect(alice).claimCreatorFees(1)).wait();
    const after = await ethers.provider.getBalance(alice.address);
    expect(after).to.be.gt(before);
  });

  it("tips a creator and updates stats", async function () {
    const { metropolis, alice, bob } = await deploy();
    await (await metropolis.connect(alice).createSignal("Creator", "ipfs://meta")).wait();

    await expect(metropolis.connect(bob).tip(1, { value: ethers.parseEther("1") }))
      .to.emit(metropolis, "Tipped");

    expect(await metropolis.totalTips()).to.be.gt(0);
    const detail = await metropolis.signal(1);
    expect(detail[7]).to.be.gt(0);
  });

  it("decays momentum over time", async function () {
    const { metropolis, alice } = await deploy();
    await (await metropolis.createSignal("Trend", "ipfs://meta")).wait();
    await (await metropolis.connect(alice).boost(1, { value: ethers.parseEther("1") })).wait();

    const before = await metropolis.previewMomentum(1);
    await ethers.provider.send("evm_increaseTime", [3600]);
    await ethers.provider.send("evm_mine", []);
    const after = await metropolis.previewMomentum(1);
    expect(after).to.be.lt(before);
  });

  it("allows proportional exit", async function () {
    const { metropolis, alice, bob } = await deploy();
    await (await metropolis.createSignal("Meme", "ipfs://meta")).wait();
    await (await metropolis.connect(alice).boost(1, { value: ethers.parseEther("2") })).wait();
    await (await metropolis.connect(bob).boost(1, { value: ethers.parseEther("2") })).wait();

    const shares = await metropolis.getShares(1, alice.address);
    await expect(metropolis.connect(alice).unboost(1, shares)).to.emit(metropolis, "Unboosted");
  });
});

