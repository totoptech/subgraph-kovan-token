import { Transfer as TransferEvent } from "../generated/Token/Token";
import { updateUserTokenDayData } from "./dayUpdates";
import {
  createUserTransaction,
  INITIAL_BALANCE,
  TOKEN_ADDRESS,
  ZERO_BI,
} from "./helpers";
import { TokenFactory, User } from "../generated/schema";

export function handleTransfer(event: TransferEvent): void {
  let tokenFactory = TokenFactory.load(TOKEN_ADDRESS);
  if (tokenFactory === null) {
    tokenFactory = new TokenFactory(TOKEN_ADDRESS);
    tokenFactory.totalHoldersCount = 0;
    tokenFactory.save();
  }

  let from = event.params.from;
  let to = event.params.to;
  let timestamp = event.block.timestamp;
  let amount = event.params.value;

  let toUser = User.load(to.toHexString());

  if (toUser === null) {
    toUser = new User(to.toHexString());
    toUser.balance = ZERO_BI;
    tokenFactory.totalHoldersCount++;
  }

  toUser.balance = toUser.balance.plus(amount);
  toUser.save();

  let fromUser = User.load(from.toHexString());

  if (fromUser === null) {
    // We can assume that it is the first transfering from the ZERO address.
    fromUser = new User(from.toHexString());
    fromUser.balance = INITIAL_BALANCE;
  }

  fromUser.balance = fromUser.balance.minus(amount);

  fromUser.save();

  if (fromUser.balance.equals(ZERO_BI)) {
    tokenFactory.totalHoldersCount--;
  }

  tokenFactory.save();

  createUserTransaction(to, from, amount, timestamp);
  createUserTransaction(from, to, ZERO_BI.minus(amount), timestamp);

  updateUserTokenDayData(from, event);
  updateUserTokenDayData(to, event);
}
