const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Kolo", function () {

  let Kolo;
  let kolo;
  let owner;
  let addr1;
  let addr2;
  let addrs;
  let amount;
  beforeEach(async function () {
    // Deploy a new Box contract for each test
    Kolo = await hre.ethers.getContractFactory("KoloContract");
    kolo = await Kolo.deploy();
    await kolo.deployed();

    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

  });

  it("KoloId should be have increased when kolo is created", async function () {  
    const oldKoloId = await kolo.koloId()
    const create = await kolo.connect(owner).createKolo(642173184000);
    let createtxn = await create.wait()
    console.log(createtxn)
    const newKoloId = await kolo.koloId()
    expect(newKoloId.toNumber()).to.equal(oldKoloId.add(1).toNumber());
  });


  it("Kolo balance should increase when deposit is made", async function () {
    const create = await kolo.connect(owner).createKolo(642173184000)
    await create.wait()

    const deposit = await kolo.connect(addr1).depositToKolo(1, {value:ethers.utils.parseEther("0.01")})
    await deposit.wait()

    const Kolo= await kolo.viewKolo(1);

    expect(Kolo.koloAmount).to.equal(ethers.utils.parseEther("0.01"))
  })

  it("Cannot deposit in a Kolo that does not exist", async function () {
    const create = await kolo.connect(owner).createKolo(642173184000)
    await create.wait()


    await expect(kolo.connect(addr1).depositToKolo(2, {value:ethers.utils.parseEther("0.01")})
    ).to.be.revertedWith("koloId must exist")
  })

  it("Only owner can withdraw from the kolo", async function () {
    const create = await kolo.connect(owner).createKolo(1642404390)
    await create.wait()
  
    await expect(kolo.connect(addr1).withdraw(1)).to.be.revertedWith("only owner of kolo can call this function")
  })

  it("cannot deposit when withdrawal has been made", async function () {
    const create = await kolo.connect(owner).createKolo(1642405164) 
    console.log("get the current unixtimestamp for testing")
    await create.wait()

    const deposit = await kolo.connect(addr1).depositToKolo(1,{value:ethers.utils.parseEther("0.01")})
    deposit.wait()
    const withdraw = await kolo.connect(owner).withdraw(1)
    withdraw.wait()
    await expect(kolo.connect(addr1).depositToKolo(1, {value:ethers.utils.parseEther("0.01")})).to.be.revertedWith("cannot deposit to a closed kolo")
  })
});
