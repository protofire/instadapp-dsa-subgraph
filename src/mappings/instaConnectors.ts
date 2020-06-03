import {
  LogDisable,
  LogEnable,
  LogEnableStatic,
  LogAddController,
  LogRemoveController
} from "../../generated/templates/InstaConnectors/InstaConnectors";
import { LogEvent } from "../../generated/InstaEvents/InstaEvents";
import { log } from "@graphprotocol/graph-ts";
import { Connector as ConnectorContract } from "../../generated/templates/InstaConnectors/Connector";
import {
  getOrCreateConnector,
  getOrCreateChief,
  getOrCreateConnectorEvent,
  getOrCreateInstaIndex
} from "../utils/helpers";

// - event: LogDisable(indexed address)
//   handler: handleLogDisableConnector

export function handleLogDisableConnector(event: LogDisable): void {
  let contract = ConnectorContract.bind(event.params.connector);
  let connectorIDResult = contract.connectorID();
  let instaConnectorAddress = event.address.toHexString();
  let entityId = connectorIDResult.value1
    .toString()
    .concat("-")
    .concat(connectorIDResult.value0.toString());
  let connector = getOrCreateConnector(entityId);

  connector.isEnabled = false;
  connector.instaConnector = event.address.toHexString();
  connector.name = contract.name();
  connector.address = event.params.connector
  connector.connectorType = connectorIDResult.value0;
  connector.connectorID = connectorIDResult.value1;

  connector.save();
}

// - event: LogEnable(indexed address)
//   handler: handleLogEnableConnector

export function handleLogEnableConnector(event: LogEnable): void {
  let contract = ConnectorContract.bind(event.params.connector);
  let connectorIDResult = contract.connectorID();
  let instaConnectorAddress = event.address.toHexString();
  let entityId = connectorIDResult.value1
    .toString()
    .concat("-")
    .concat(connectorIDResult.value0.toString());
  let connector = getOrCreateConnector(entityId);

  connector.isEnabled = true;
  connector.isStatic = false;
  connector.instaConnector = event.address.toHexString();
  connector.name = contract.name();
  connector.address = event.params.connector;
  connector.connectorType = connectorIDResult.value0;
  connector.connectorID = connectorIDResult.value1;

  connector.save();
}

// - event: LogEnableStatic(indexed address)
//   handler: handleLogEnableStaticConnector

export function handleLogEnableStaticConnector(event: LogEnableStatic): void {
  let contract = ConnectorContract.bind(event.params.connector);
  let connectorIDResult = contract.connectorID();
  let instaConnectorAddress = event.address.toHexString();
  let entityId = connectorIDResult.value1
    .toString()
    .concat("-")
    .concat(connectorIDResult.value0.toString());
  let connector = getOrCreateConnector(entityId);

  connector.isEnabled = true;
  connector.isStatic = true;
  connector.instaConnector = instaConnectorAddress;
  connector.name = contract.name();
  connector.address = event.params.connector;
  connector.connectorType = connectorIDResult.value0;
  connector.connectorID = connectorIDResult.value1;

  connector.save();
}

// - event: LogAddController(indexed address)
//   handler: handleLogAddController

export function handleLogAddController(event: LogAddController): void {
  let chief = getOrCreateChief(event.params.addr.toHexString());

  chief.isActive = true;
  chief.instaConnector = event.address.toHexString();

  chief.save();
}

// - event: LogRemoveController(indexed address)
//   handler: handleLogRemoveController

export function handleLogRemoveController(event: LogRemoveController): void {
  let chief = getOrCreateChief(event.params.addr.toHexString());

  chief.isActive = false;
  chief.instaConnector = event.address.toHexString();

  chief.save();
}

// - event: LogEvent(uint64,indexed uint64,indexed uint64,indexed bytes32,bytes)
//   handler: handleLogEvent

export function handleLogEvent(event: LogEvent): void {
  let entityId = event.params.connectorID
    .toString()
    .concat("-")
    .concat(event.params.connectorType.toString());
  let connector = getOrCreateConnector(entityId, false);

  if (connector == null) {
    log.error("Connector '{}' doesn't exist.", [entityId]);
  } else {
    let eventId = event.transaction.hash
      .toHexString()
      .concat("-")
      .concat(event.logIndex.toString());
    let connectorEvent = getOrCreateConnectorEvent(eventId);
    connectorEvent.account = event.params.accountID.toString();
    connectorEvent.connector = connector.id;
    connectorEvent.eventCode = event.params.eventCode;
    connectorEvent.eventData = event.params.eventData;

    connectorEvent.save();
  }
}
