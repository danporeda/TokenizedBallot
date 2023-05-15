//  edit buyValue to change amount to be bought

import { ethers } from "hardhat";
import { MyERC20Token__factory, TokenSale__factory } from "../typechain-types";
import * as dotenv from "dotenv";
import { BigNumber } from "ethers";
dotenv.config();

const TOKEN_SALE_ADDRESS = "0x4d6670D962A5228442588f0c35CAC89EB9248f64";
const TOKEN_ADDRESS = "0xd84744BC999c909828122779b4961FDc34f4E0d6";
const main = async () => {
  const provider = new ethers.providers.AlchemyProvider(
    "maticmum",
    process.env.ALCHEMY_API_KEY
  );
  const buyValue = ethers.utils.parseEther("0.01");
  const pkey = process.env.PRIVATE_KEY;
  const wallet = new ethers.Wallet(`${pkey}`);
  const signer = wallet.connect(provider);

  const tokenSaleFactory = new TokenSale__factory(signer);
  const tokenSaleContract = tokenSaleFactory.attach(TOKEN_SALE_ADDRESS);
  console.log(
    `Contract factory created, attached to tokenSale at address ${tokenSaleContract.address}`
  );

  const tokenFactory = new MyERC20Token__factory(signer);
  const tokenContract = tokenFactory.attach(TOKEN_ADDRESS);
  console.log(
    `Contract factory created, attached to ERC20Token at address ${tokenContract.address}`
  );

  //buying tokens
  const buyTokensTx = await tokenSaleContract.buyTokens({ value: buyValue });
  await buyTokensTx.wait();
  const tokenBalance = await tokenContract.balanceOf(signer.address);
  console.log(
    `Address ${signer.address} now has ${tokenBalance.div(
      BigNumber.from("0xDE0B6B3A7640000")
    )} Tokens `
  );
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
