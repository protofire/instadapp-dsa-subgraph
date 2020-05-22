import { InstaConnectors as ConnectorsTemplate } from "../../../generated/templates";
import { InstaConnector, Connector, Chief } from "../../../generated/schema";
import { Address } from "@graphprotocol/graph-ts";

export function getOrCreateInstaConnector(
  addressId: Address
): InstaConnector {
  let connectors = InstaConnector.load(addressId.toHexString());

  if (connectors == null) {
    connectors = new InstaConnector(addressId.toHexString());

    connectors.save();

    ConnectorsTemplate.create(addressId);
  }

  return connectors as InstaConnector;
}

export function getOrCreateConnector(
  id: String,
  createIfNotFound: boolean = true
): Connector {
  let connector = Connector.load(id);

  if (connector == null && createIfNotFound) {
    connector = new Connector(id);
  }

  return connector as Connector;
}

export function getOrCreateChief(
  id: String,
  createIfNotFound: boolean = true
): Chief {
  let chief = Chief.load(id);

  if (chief == null && createIfNotFound) {
    chief = new Chief(id);
  }

  return chief as Chief;
}
