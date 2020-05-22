import {
  LogDisable,
  LogEnable,
  LogEnableStatic,
  LogAddController,
  LogRemoveController
} from "../../generated/templates/InstaConnectors/InstaConnectors";
import { Connector as ConnectorContract } from "../../generated/templates/InstaConnectors/Connector";
import { getOrCreateConnector, getOrCreateChief } from "../utils/helpers";

// - event: LogDisable(indexed address)
//   handler: handleLogDisableConnector

export function handleLogDisableConnector(event: LogDisable): void {
  let contract = ConnectorContract.bind(event.params.connector);
  let connectorIDResult = contract.connectorID();
  let instaConnectorAddress = event.address.toHexString();
  let entityId = instaConnectorAddress
    .concat("-")
    .concat(connectorIDResult.value1.toString());
  let connector = getOrCreateConnector(entityId);

  connector.isEnabled = false;
  connector.instaConnector = event.address.toHexString();
  connector.name = contract.name();
  connector.address = event.params.connector.toHexString();
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
  let entityId = instaConnectorAddress
    .concat("-")
    .concat(connectorIDResult.value1.toString());
  let connector = getOrCreateConnector(entityId);

  connector.isEnabled = true;
  connector.isStatic = false;
  connector.instaConnector = event.address.toHexString();
  connector.name = contract.name();
  connector.address = event.params.connector.toHexString();
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
  let entityId = instaConnectorAddress
    .concat("-")
    .concat(connectorIDResult.value1.toString());
  let connector = getOrCreateConnector(entityId);

  connector.isEnabled = true;
  connector.isStatic = true;
  connector.instaConnector = instaConnectorAddress;
  connector.name = contract.name();
  connector.address = event.params.connector.toHexString();
  connector.connectorType = connectorIDResult.value0;
  connector.connectorID = connectorIDResult.value1;

  connector.save();
}

// - event: LogAddController(indexed address)
//   handler: handleLogAddController

export function handleLogAddController(event: LogAddController): void {
  let chief = getOrCreateChief(event.params.addr.toHexString())

  chief.isActive = true;
  chief.instaConnector = event.address.toHexString();

  chief.save()
}

// - event: LogRemoveController(indexed address)
//   handler: handleLogRemoveController

export function handleLogRemoveController(event: LogRemoveController): void {
  let chief = getOrCreateChief(event.params.addr.toHexString())

  chief.isActive = false;
  chief.instaConnector = event.address.toHexString();

  chief.save()
}
