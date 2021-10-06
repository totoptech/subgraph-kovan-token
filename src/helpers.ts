import { Address, BigInt } from "@graphprotocol/graph-ts";
import { User, UserTransaction } from "../generated/schema";

export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
export const TOKEN_ADDRESS = "0xc813EA5e3b48BEbeedb796ab42A30C5599b01740";

export let INITIAL_BALANCE = BigInt.fromI32(300000000);
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
