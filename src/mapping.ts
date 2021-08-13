import { Transfer as TransferEvent } from "../generated/Token/Token";
import { Transfer } from "../generated/schema";
import { updateUserTokenDayData } from "./dayUpdates";
import { ADDRESS_ZERO, INITIAL_BALANCE } from "./helpers";
import { BigInt } from "@graphprotocol/graph-ts";

export function handleTransfer(event: TransferEvent): void {
  // ignore initial transfers for first adds
  if (
    event.params.to.toHexString() == ADDRESS_ZERO &&
    event.params.value.equals(BigInt.fromI32(INITIAL_BALANCE))
  ) {
    return;
  }

  let entity = new Transfer(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  );

  let from = event.params.from;
  let to = event.params.to;

  entity.from = from;
  entity.to = to;
  entity.value = event.params.value;
  entity.save();

  updateUserTokenDayData(from, event);
  updateUserTokenDayData(to, event);
}
