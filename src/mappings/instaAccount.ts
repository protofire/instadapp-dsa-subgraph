import {
  LogDisable,
  LogEnable,
  LogCast,
  LogSwitchShield,
  CastCall
} from "../../generated/templates/InstaAccount/InstaAccount";
import {
  getOrCreateSmartAccount,
  getOrCreateCast,
  getOrCreateCastEvent,
  getOrCreateDisableEvent,
  getOrCreateEnableEvent,
  getOrCreateSwitchShieldEvent
} from "../utils/helpers";
import { log, Bytes } from '@graphprotocol/graph-ts';

//- event: LogCast(indexed address,indexed address,uint256)
//   handler: handleLogCast

export function handleLogCast(event: LogCast): void {
  let account = getOrCreateSmartAccount(event.address.toHexString(), false);
  if (account == null) {
    log.error("LOGCAST - Indexed address for smart account is wrong? {}", [
      event.address.toHexString()
    ]);
  } else {
    let eventId = event.transaction.hash.toHexString().concat('-').concat(event.logIndex.toString());
    let castEvent = getOrCreateCastEvent(eventId)
    let cast = getOrCreateCast(eventId);

    castEvent.account = account.id;

    cast.account = account.id;
    cast.origin = event.params.origin.toHexString();
    cast.sender = event.params.sender.toHexString()
    cast.value = event.params.value;

    castEvent.save();
    cast.save();
  }
}

// - event: LogDisable(indexed address)
//   handler: handleLogDisableSmartAccountOwner

export function handleLogDisableSmartAccountOwner(event: LogDisable): void {
  let account = getOrCreateSmartAccount(event.address.toHexString(), false);
  if (account == null) {
    log.error("DISABLE - Indexed address for smart account is wrong? {}", [
      event.address.toHexString()
    ]);
  } else {
    let eventId = event.transaction.hash.toHexString().concat('-').concat(event.logIndex.toString());
    let disableEvent = getOrCreateDisableEvent(eventId)
    disableEvent.account = account.id;

    account.owner = event.params.user.toHexString();
    account.isEnabled = false;

    account.save()
    disableEvent.save();
  }
}

// - event: LogEnable(indexed address)
//   handler: handleLogEnableSmartAccountOwner

export function handleLogEnableSmartAccountOwner(event: LogEnable): void {
  let account = getOrCreateSmartAccount(event.address.toHexString(), false);
  if (account == null) {
    log.error("ENABLE - Indexed address for smart account is wrong? {}", [
      event.address.toHexString()
    ]);
  } else {
    let eventId = event.transaction.hash.toHexString().concat('-').concat(event.logIndex.toString());
    let enableEvent = getOrCreateEnableEvent(eventId)
    enableEvent.account = account.id;

    account.owner = event.params.user.toHexString();
    account.isEnabled = true;

    account.save()
    enableEvent.save();
  }
}

// - event: LogSwitchShield(bool)
//   handler: handleLogSwitchShield

export function handleLogSwitchShield(event: LogSwitchShield): void {
  let account = getOrCreateSmartAccount(event.address.toHexString(), false);
  if (account == null) {
    log.error("SWITCH SHIELD - Indexed address for smart account is wrong? {}", [
      event.address.toHexString()
    ]);
  } else {
    let eventId = event.transaction.hash.toHexString().concat('-').concat(event.logIndex.toString());
    let switchEvent = getOrCreateSwitchShieldEvent(eventId)
    switchEvent.account = account.id;
    switchEvent.save();
  }
}
