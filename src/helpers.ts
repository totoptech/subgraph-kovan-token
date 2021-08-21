import { Address, BigInt } from "@graphprotocol/graph-ts";
import { User, UserTransaction } from "../generated/schema";

export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
export const INITIAL_BALANCE = 300000000;
export let TOKEN_ADDRESS = "0x973C43a98a5F400a708301fd78D49951B5c4187F";

export let ZERO_BI = BigInt.fromI32(0);

export function createUserTransaction(
  user: Address,
  from: Address,
  amount: BigInt,
  timestamp: BigInt
): void {
  let entity = new UserTransaction(
    user.toHexString() + "-" + timestamp.toString()
  );

  entity.user = user;
  entity.from = from;
  entity.amount = amount;
  entity.timestamp = timestamp;
  entity.save();
}
