import {
  LogDisable,
  LogEnable,
  LogCast,
  LogSwitchShield,
  CastCall
} from "../../generated/templates/InstaAccount/InstaAccount";
import { InstaList } from "../../generated/InstaIndex/InstaList";
import {
  getOrCreateSmartAccount,
  getOrCreateCast,
  getOrCreateCastEvent,
  getOrCreateDisableEvent,
  getOrCreateEnableEvent,
  getOrCreateSwitchShieldEvent,
  getOrCreateUser,
  getOrCreateInstaIndex
} from "../utils/helpers";
import { log, Bytes, Address } from "@graphprotocol/graph-ts";

//- event: LogCast(indexed address,indexed address,uint256)
//   handler: handleLogCast

export function handleLogCast(event: LogCast): void {
  let instaIndex = getOrCreateInstaIndex();
  let instaListContract = InstaList.bind(instaIndex.instaListAddress as Address);
  let accountID = instaListContract.accountID(event.address);
  let account = getOrCreateSmartAccount(accountID.toString(), false);
  if (account == null) {
    log.error("LOGCAST - Indexed address for smart account is wrong? {}", [
      accountID.toString()
    ]);
  } else {
    let eventId = event.transaction.hash
      .toHexString()
      .concat("-")
      .concat(event.logIndex.toString());
    let castEvent = getOrCreateCastEvent(eventId);
    let cast = getOrCreateCast(eventId);

    castEvent.account = account.id;
    castEvent.origin = event.params.origin;
    castEvent.sender = event.params.sender;
    castEvent.value = event.params.value;

    cast.account = account.id;
    cast.origin = event.params.origin;
    cast.sender = event.params.sender;
    cast.value = event.params.value;

    castEvent.save();
    cast.save();
  }
}

// - event: LogDisable(indexed address)
//   handler: handleLogDisableSmartAccountOwner

export function handleLogDisableSmartAccountOwner(event: LogDisable): void {
  let instaIndex = getOrCreateInstaIndex();
  let instaListContract = InstaList.bind(instaIndex.instaListAddress as Address);
  let accountID = instaListContract.accountID(event.address);
  let account = getOrCreateSmartAccount(accountID.toString(), false);
  if (account == null) {
    log.error("DISABLE - Indexed address for smart account is wrong? {}", [
      accountID.toString()
    ]);
  } else {
    let eventId = event.transaction.hash
      .toHexString()
      .concat("-")
      .concat(event.logIndex.toString());
    let user = getOrCreateUser(event.params.user.toHexString());
    let disableEvent = getOrCreateDisableEvent(eventId);
    disableEvent.account = account.id;
    disableEvent.user = user.id;

    account.owner = user.id;
    account.isEnabled = false;

    account.save();
    disableEvent.save();
  }
}

// - event: LogEnable(indexed address)
//   handler: handleLogEnableSmartAccountOwner

export function handleLogEnableSmartAccountOwner(event: LogEnable): void {
  let instaIndex = getOrCreateInstaIndex();
  let instaListContract = InstaList.bind(instaIndex.instaListAddress as Address);
  let accountID = instaListContract.accountID(event.address);
  let account = getOrCreateSmartAccount(accountID.toString(), false);
  if (account == null) {
    log.error("ENABLE - Indexed address for smart account is wrong? {}", [
      accountID.toString()
    ]);
  } else {
    let eventId = event.transaction.hash
      .toHexString()
      .concat("-")
      .concat(event.logIndex.toString());
    let user = getOrCreateUser(event.params.user.toHexString());
    let enableEvent = getOrCreateEnableEvent(eventId);
    enableEvent.account = account.id;
    enableEvent.user = user.id;

    account.owner = user.id;
    account.isEnabled = true;

    account.save();
    enableEvent.save();
  }
}

// - event: LogSwitchShield(bool)
//   handler: handleLogSwitchShield

export function handleLogSwitchShield(event: LogSwitchShield): void {
  let instaIndex = getOrCreateInstaIndex();
  let instaListContract = InstaList.bind(instaIndex.instaListAddress as Address);
  let accountID = instaListContract.accountID(event.address);
  let account = getOrCreateSmartAccount(accountID.toString(), false);
  if (account == null) {
    log.error(
      "SWITCH SHIELD - Indexed address for smart account is wrong? {}",
      [accountID.toString()]
    );
  } else {
    let eventId = event.transaction.hash
      .toHexString()
      .concat("-")
      .concat(event.logIndex.toString());
    let switchEvent = getOrCreateSwitchShieldEvent(eventId);

    switchEvent.account = account.id;
    switchEvent.shield = event.params._shield;

    account.shield = event.params._shield;

    switchEvent.save();
    account.save();
  }
}
