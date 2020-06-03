import {
  User,
  SmartAccount,
  AccountModule,
  InstaIndex
} from "../../../generated/schema";
import { InstaAccount as AccountTemplate } from "../../../generated/templates";
import { Address } from "@graphprotocol/graph-ts";

export function getOrCreateUser(
  id: String,
  createIfNotFound: boolean = true,
  save: boolean = true
): User {
  let user = User.load(id);

  if (user == null && createIfNotFound) {
    user = new User(id);

    if (save) {
      user.save();
    }
  }

  return user as User;
}

export function getOrCreateSmartAccount(
  id: String,
  createIfNotFound: boolean = true,
  address: Address | null = null
): SmartAccount {
  let smartAccount = SmartAccount.load(id);

  if (smartAccount == null && createIfNotFound) {
    smartAccount = new SmartAccount(id);

    smartAccount.shield = false;
    if(address != null) {
      AccountTemplate.create(address as Address)
    }
  }

  return smartAccount as SmartAccount;
}

export function getOrCreateAccountModule(
  id: String,
  createIfNotFound: boolean = true
): AccountModule {
  let accountModule = AccountModule.load(id);

  if (accountModule == null && createIfNotFound) {
    accountModule = new AccountModule(id);

    let instaIndex = getOrCreateInstaIndex();
    accountModule.instaIndex = instaIndex.id;
  }

  return accountModule as AccountModule;
}

export function getOrCreateInstaIndex(): InstaIndex {
  let index = InstaIndex.load("0x2971adfa57b20e5a416ae5a708a8655a9c74f723");

  if (index == null) {
    index = new InstaIndex("0x2971adfa57b20e5a416ae5a708a8655a9c74f723");
    index.save();
  }

  return index as InstaIndex;
}
