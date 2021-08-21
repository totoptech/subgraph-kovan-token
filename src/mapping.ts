import { Transfer as TransferEvent } from "../generated/Token/Token";
import { updateUserTokenDayData } from "./dayUpdates";
import {
  ADDRESS_ZERO,
  createUserTransaction,
  INITIAL_BALANCE,
  TOKEN_ADDRESS,
  ZERO_BI,
} from "./helpers";
import { Token as TokenContract } from "../generated/Token/Token";

import { BigInt } from "@graphprotocol/graph-ts";
import { TokenFactory, User } from "../generated/schema";

export function handleTransfer(event: TransferEvent): void {
  // ignore initial transfers for first adds
  if (
    event.params.to.toHexString() == ADDRESS_ZERO &&
    event.params.value.equals(BigInt.fromI32(INITIAL_BALANCE))
  ) {
    let tokenFactory = new TokenFactory(TOKEN_ADDRESS);
    tokenFactory.totalCount = 0;
    tokenFactory.save();
    return;
  }

  let tokenFactory = TokenFactory.load(TOKEN_ADDRESS);
  let tokenContract = TokenContract.bind(event.address);

  let from = event.params.from;
  let to = event.params.to;
  let timestamp = event.block.timestamp;
  let amount = event.params.value;

  let fromBalance = tokenContract.balanceOf(event.params.from);

  let toUser = User.load(to.toHexString());

  if (toUser === null) {
    toUser = new User(to.toHexString());
    tokenFactory.totalCount++;
  }

  if (fromBalance.equals(ZERO_BI)) {
    tokenFactory.totalCount--;
  }

  tokenFactory.save();

  createUserTransaction(to, from, amount, timestamp);
  createUserTransaction(from, to, ZERO_BI.minus(amount), timestamp);

  updateUserTokenDayData(from, event);
  updateUserTokenDayData(to, event);
}
