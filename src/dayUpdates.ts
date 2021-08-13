import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";
import { Token as TokenContract } from "../generated/Token/Token";
import { UserTokenDayData } from "../generated/schema";

export function updateUserTokenDayData(
  user: Address,
  event: ethereum.Event
): void {
  let timestamp = event.block.timestamp.toI32();
  let dayID = timestamp / 86400;
  let dayStartTimestamp = dayID * 86400;
  let tokenContract = TokenContract.bind(event.address);

  let userDayID = user
    .toHexString()
    .concat("-")
    .concat(BigInt.fromI32(dayID).toString());

  let userTokenDayData = UserTokenDayData.load(userDayID);

  if (userTokenDayData === null) {
    userTokenDayData = new UserTokenDayData(userDayID);
    userTokenDayData.date = dayStartTimestamp;
    userTokenDayData.user = user;
  }

  userTokenDayData.balance = tokenContract.balanceOf(user);

  userTokenDayData.save();
}
