import {
  LogDisable,
  LogEnable,
  LogEnableStatic
} from "../../generated/templates/InstaConnectors/InstaConnectors";
import { getOrCreateConnector } from "../utils/helpers";

// - event: LogDisable(indexed address)
//   handler: handleLogDisableConnector

export function handleLogDisableConnector(event: LogDisable): void {
  let connector = getOrCreateConnector(event.params.connector.toHexString())

  connector.isEnabled = false;
  connector.instaConnector = event.address.toHexString();

  connector.save();
}

// - event: LogEnable(indexed address)
//   handler: handleLogEnableConnector

export function handleLogEnableConnector(event: LogEnable): void {
  let connector = getOrCreateConnector(event.params.connector.toHexString())

  connector.isEnabled = true;
  connector.isStatic = false;
  connector.instaConnector = event.address.toHexString();

  connector.save();
}

// - event: LogEnableStatic(indexed address)
//   handler: handleLogEnableStaticConnector

export function handleLogEnableStaticConnector(event: LogEnableStatic): void {
  let connector = getOrCreateConnector(event.params.connector.toHexString())

  connector.isEnabled = true;
  connector.isStatic = true;
  connector.instaConnector = event.address.toHexString();

  connector.save();
}
