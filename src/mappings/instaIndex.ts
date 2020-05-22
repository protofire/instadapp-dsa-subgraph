import {
  LogAccountCreated,
  LogNewAccount,
  LogNewCheck,
  LogNewMaster,
  LogUpdateMaster,
  SetBasicsCall,
  BuildCall,
  InstaIndex
} from "../../generated/InstaIndex/InstaIndex";
import {
  getOrCreateAccountModule,
  getOrCreateUser,
  getOrCreateSmartAccount,
  getOrCreateInstaConnector,
  getOrCreateInstaIndex
} from "../utils/helpers";
// - event: LogAccountCreated(address,indexed address,indexed address,indexed address)
//   handler: handleLogAccountCreated
//  Creation of new smart account for user
//  event LogAccountCreated(address sender, address indexed owner, address indexed account, address indexed origin);

export function handleLogAccountCreated(event: LogAccountCreated): void {
  let smartAccount = getOrCreateSmartAccount(
    event.params.account.toHexString()
  );
  let owner = getOrCreateUser(event.params.owner.toHexString());
  let sender = getOrCreateUser(event.params.sender.toHexString());

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
  let accountModule = getOrCreateAccountModule(accountVersion.toString());
  let instaConnector = getOrCreateInstaConnector(event.params._connectors);

  accountModule.address = event.params._newAccount.toHexString();
  accountModule.connectors = instaConnector.id;
  accountModule.check = event.params._check.toHexString();

  accountModule.save();
}

// - event: LogNewCheck(indexed uint256,indexed address)
//   handler: handleLogNewCheck

export function handleLogNewCheck(event: LogNewCheck): void {
  let accountModule = getOrCreateAccountModule(
    event.params.accountVersion.toString()
  );

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

export function handleSetBasics(call: SetBasicsCall): void {
  let accountVersion = InstaIndex.bind(call.to).versionCount();
  let accountModule = getOrCreateAccountModule(accountVersion.toString());
  let instaConnector = getOrCreateInstaConnector(call.inputs._connectors);

  accountModule.address = call.inputs._account.toHexString();
  accountModule.connectors = instaConnector.id;

  accountModule.save();
}

export function handleBuild(call: BuildCall): void {
  let smartAccount = getOrCreateSmartAccount(
    call.outputs._account.toHexString()
  );
  let owner = getOrCreateUser(call.inputs._owner.toHexString());

  smartAccount.owner = owner.id;
  smartAccount.origin = call.inputs._origin.toHexString();
  smartAccount.accountModule = call.inputs.accountVersion.toString();

  smartAccount.save();
}
