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
import { InstaList } from "../../generated/InstaIndex/InstaList";
import { Address } from "@graphprotocol/graph-ts";
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
  let owner = getOrCreateUser(event.params.owner.toHexString());
  let sender = getOrCreateUser(event.params.sender.toHexString());
  let index = getOrCreateInstaIndex();
  let instaListContract = InstaList.bind(index.instaListAddress as Address);
  let dsaID = instaListContract.accountID(event.params.account);
  let smartAccount = getOrCreateSmartAccount(
    dsaID.toString(),
    true,
    event.params.account as Address
  );

  smartAccount.owner = owner.id;
  smartAccount.creator = sender.id;
  smartAccount.origin = event.params.origin;
  smartAccount.isEnabled = true;
  smartAccount.accountID = dsaID;
  smartAccount.address = event.params.account;

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

  accountModule.address = event.params._newAccount;
  accountModule.connectors = instaConnector.id;
  accountModule.check = event.params._check;

  accountModule.save();
}

// - event: LogNewCheck(indexed uint256,indexed address)
//   handler: handleLogNewCheck

export function handleLogNewCheck(event: LogNewCheck): void {
  let accountModule = getOrCreateAccountModule(
    event.params.accountVersion.toString()
  );

  accountModule.check = event.params.check;

  accountModule.save();
}

// - event: LogNewMaster(indexed address)
//   handler: handleLogNewMaster

export function handleLogNewMaster(event: LogNewMaster): void {
  let index = getOrCreateInstaIndex();

  index.master = event.params.master;

  index.save();
}

// - event: LogUpdateMaster(indexed address)
//   handler: handleLogUpdateMaster

export function handleLogUpdateMaster(event: LogUpdateMaster): void {
  let index = getOrCreateInstaIndex();

  index.master = event.params.master;

  index.save();
}

export function handleSetBasics(call: SetBasicsCall): void {
  let instaIndex = getOrCreateInstaIndex();
  let accountVersion = InstaIndex.bind(call.to).versionCount();
  let accountModule = getOrCreateAccountModule(accountVersion.toString());
  let instaConnector = getOrCreateInstaConnector(call.inputs._connectors);

  accountModule.address = call.inputs._account;
  accountModule.connectors = instaConnector.id;

  instaIndex.instaListAddress = call.inputs._list;

  instaIndex.save();
  accountModule.save();
}

export function handleBuild(call: BuildCall): void {
  let index = getOrCreateInstaIndex();
  let instaListContract = InstaList.bind(index.instaListAddress as Address);
  let dsaID = instaListContract.accountID(call.outputs._account);
  let smartAccount = getOrCreateSmartAccount(
    dsaID.toString(),
    true,
    call.outputs._account as Address
  );
  let owner = getOrCreateUser(call.inputs._owner.toHexString());

  smartAccount.owner = owner.id;
  smartAccount.origin = call.inputs._origin;
  smartAccount.accountModule = call.inputs.accountVersion.toString();

  smartAccount.save();
}
