## InstaDapp DeFi Smart Accounts

DeFi Smart Accounts (DSA) aim to make the DeFi ecosystem much more accessible to end users, by simplifying processes and unifying multiple DeFi platforms with a single account.

The goal of this subgraph is to make developers get an easier access to the DSA data, such as Smart Accounts, Account Modules, Connectors and more.

Below is a general description of the entities we store. We tried to make it as similar to the underlying structures of the DSA contracts, but also making it easier for GraphQL queries to link entities together so that some query optimizations could be done.

#### SmartAccount

The SmartAccount entity holds the owner and creator address for that SmartAccount, as well as the AccountModule used as a template for the account (which also holds the connectors that the account has, since it was cloned from that module), the shield status, whether the current owner is enabled for authentication or not, and all the Casts executed for that Account, as well as the events that occur withing that Account scope (modifications to the shield status, disabling and enabling of the owner, and casts).

```graphql
type SmartAccount @entity {
  id: ID!

  "Latest enabled owner"
  owner: User

  "Sender of the creation transaction"
  creator: User

  origin: String!

  "Account module from which this account was created. It holds the connectors linked to this account."
  accountModule: AccountModule

  shield: Boolean

  "Whether the owner is currently enabled to use this account or not"
  isEnabled: Boolean!

  "Casts made by this smart account"
  casts: [Cast!]! @derivedFrom(field: "account")

  "Events that ocurred within this account scope"
  events: [SmartAccountEvent!]! @derivedFrom(field: "account")
}
```

#### InstaIndex

The InstaIndex is the main contract of the DSA ecosystem. It allows us to track AccountModule creation, SmartAccount creation, as well as changes to the master of said contract. We currently track an InstaIndex entity since we wanted to keep track of the current master for the contract, as well as the AccountModules currently listed on the index.

```graphql
type InstaIndex @entity {
  id: ID!

  "Address of the current master"
  master: String

  accountModules: [AccountModule!]! @derivedFrom(field: "instaIndex")
}
```

#### AccountModule

The AccountModule is basically a template used to clone SmartAccounts from. It has links to an InstaConnectors contract, which holds the connectors list for said account, as well as some other underlying data such as the check.

```graphql
type AccountModule @entity {
  "ID is the account module version"
  id: ID!

  "Base address of the module"
  address: String!

  "InstaConnectors contract linked to this module. It holds a list of linked connectors as well as chief/admin information for that contract."
  connectors: InstaConnector!

  check: String

  instaIndex: InstaIndex!

  "List of all the accounts that used this module."
  accountsCloned: [SmartAccount!]! @derivedFrom(field: "accountModule")
}
```

#### InstaConnector

InstaConnector entity tracks the InstaConnectors contract (name change was required, since a single entity should not be plural). We decided to keep this entity instead of just using a list of connectors on the AccountModule entity, so that we could still keep track of the chief/admin of the InstaConnectors contract.

```graphql
type InstaConnector @entity {
  "Address of the InstaConnector contract. This contract has a list of connectors tracked."
  id: ID!

  chiefs: [Chief!]! @derivedFrom(field: "instaConnector")

  connectors: [Connector!]! @derivedFrom(field: "instaConnector")
}
```

#### Connector

Connectors are the part of the DSA ecosystem that allows SmartAccounts to interact with external DeFi platforms in a seamless manner. They are contracts specific for each platform but they all have some basic interface in common. We currently track as much generic data as possible, but some Connectors might have relevant information specific for that contract in Ethereum events.

```graphql

type Connector @entity {
  "Connector ID includes the ID of the InstaConnector it belongs to and the internal ID of the connector"
  id: ID!

  "Whether this connector is a Static Connector or not."
  isStatic: Boolean!

  "Whether this Connector is enabled or not."
  isEnabled: Boolean!

  "InstaConnectors contract where this Connector is linked"
  instaConnector: InstaConnector!

  "Connector name"
  name: String!

  "Connector ID within the InstaConnectors contract"
  connectorID: BigInt!

  "Connector type."
  connectorType: BigInt!

  "Address for said connector"
  address: String!
}
```

#### User

The user entity is just an ethereum address that created or owns one or multiple SmartAccounts.

```graphql
type User @entity {
  id: ID!

  "List of all the smart accounts currently owned by this user"
  smartAccountsOwned: [SmartAccount!]! @derivedFrom(field:"owner")

  "List of all the smart accounts created by this user"
  smartAccountsCreated: [SmartAccount!]! @derivedFrom(field:"creator")
}
```
