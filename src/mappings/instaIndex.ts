import { SmartAccount, User } from "../../generated/schema";
import {
  LogAccountCreated,
  LogNewAccount,
  LogNewCheck,
  LogNewMaster,
  LogUpdateMaster,
  SetBasicsCall,
  InstaIndex
} from "../../generated/InstaIndex/InstaIndex";
import {
  getOrCreateAccountModule,
  getOrCreateUser,
  getOrCreateSmartAccount,
  getOrCreateInstaIndex
} from '../utils/helpers'

// - event: LogAccountCreated(address,indexed address,indexed address,indexed address)
//   handler: handleLogAccountCreated
//  Creation of new smart account for user
//  event LogAccountCreated(address sender, address indexed owner, address indexed account, address indexed origin);

export function handleLogAccountCreated(event: LogAccountCreated): void {
  let smartAccount = getOrCreateSmartAccount(event.params.account.toHexString());
  let owner = getOrCreateUser(event.params.owner.toHexString())
  let sender = getOrCreateUser(event.params.sender.toHexString())

  smartAccount.owner = owner.id;
  smartAccount.creator = sender.id;
  smartAccount.origin = event.params.origin.toHexString();

  smartAccount.save();
}

// - event: LogNewAccount(indexed address,indexed address,indexed address)
//   handler: handleLogNewAccount
//  Creation of new "Account Module"
//  emit LogNewAccount(_newAccount, _connectors, _check);

export function handleLogNewAccount(event: LogNewAccount): void {
  // current account version has to be retrieved from the contract
  let accountVersion = InstaIndex.bind(event.address).versionCount();
  let accountModule = getOrCreateAccountModule(accountVersion.toString())

  accountModule.address = event.params._newAccount.toHexString();
  accountModule.connectors = event.params._connectors.toHexString();
  accountModule.check = event.params._check.toHexString();

  accountModule.save();
}

// - event: LogNewCheck(indexed uint256,indexed address)
//   handler: handleLogNewCheck

export function handleLogNewCheck(event: LogNewCheck): void {
  let accountModule = getOrCreateAccountModule(event.params.accountVersion.toString());

  accountModule.check = event.params.check.toHexString();

  accountModule.save();
}

// - event: LogNewMaster(indexed address)
//   handler: handleLogNewMaster

export function handleLogNewMaster(event: LogNewMaster): void {
  let index = getOrCreateInstaIndex();

  index.master = event.params.master.toHexString();

  index.save();
}

// - event: LogUpdateMaster(indexed address)
//   handler: handleLogUpdateMaster

export function handleLogUpdateMaster(event: LogUpdateMaster): void {
  let index = getOrCreateInstaIndex();

  index.master = event.params.master.toHexString();

  index.save();
}

// - event: LogUpdateMaster(indexed address)
//   handler: handleLogUpdateMaster

export function handleSetBasics(call: SetBasicsCall): void {
  let accountVersion = InstaIndex.bind(call.to).versionCount();
  let accountModule = getOrCreateAccountModule(accountVersion.toString())

  accountModule.address = call.inputs._account.toHexString();
  accountModule.connectors = call.inputs._connectors.toHexString();

  accountModule.save();
}
