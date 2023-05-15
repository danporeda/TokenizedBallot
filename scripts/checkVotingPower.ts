//  TODO: check voting power with args address and blockNumber
import { ethers } from "hardhat";

import { Ballot__factory } from "../typechain-types";
import * as dotenv from "dotenv";
import { BigNumber } from "ethers";
dotenv.config();
// run file from terminal with argument address of voter: yarn ts-node --files ./scripts/vote.ts <vote>

//edit voteValue to change vote amount
const BALLOT_ADDRESS = "0xBC717924Dca94A672af0f8D65b956cB2830cC9d1";
const voteAmount = 1;

const main = async () => {
  const vote = process.argv[2];
  const provider = new ethers.providers.AlchemyProvider(
    "maticmum",
    process.env.ALCHEMY_API_KEY
  );

  const pkey = process.env.PRIVATE_KEY;
  const wallet = new ethers.Wallet(`${pkey}`);
  const signer = wallet.connect(provider);

  const ballotFactory = new Ballot__factory(signer);
  const ballotContract = ballotFactory.attach(BALLOT_ADDRESS);
  console.log(
    `Contract factory created, attached to ballot at address ${ballotContract.address}`
  );

  const checkVotingPower = ethers.utils.formatUnits(
    await ballotContract.votingPower(signer.address)
  );
  console.log(`Your Voting Power is ${checkVotingPower}`);

  const winningProposal = ethers.utils.parseBytes32String(
    await ballotContract.winnerName()
  );
  console.log(`Winning Proposal is : ${winningProposal}`);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
