import {
  CastEvent,
  SwitchShieldEvent,
  DisableEvent,
  EnableEvent,
  Cast
} from "../../../generated/schema";

export function getOrCreateCast(
  id: String,
  createIfNotFound: boolean = true
): Cast {
  let cast = Cast.load(id);

  if (cast == null && createIfNotFound) {
    cast = new Cast(id);
  }

  return cast as Cast;
}

export function getOrCreateCastEvent(
  id: String,
  createIfNotFound: boolean = true
): CastEvent {
  let event = CastEvent.load(id);

  if (event == null && createIfNotFound) {
    event = new CastEvent(id);
  }

  return event as CastEvent;
}

export function getOrCreateSwitchShieldEvent(
  id: String,
  createIfNotFound: boolean = true
): SwitchShieldEvent {
  let event = SwitchShieldEvent.load(id);

  if (event == null && createIfNotFound) {
    event = new SwitchShieldEvent(id);
  }

  return event as SwitchShieldEvent;
}

export function getOrCreateDisableEvent(
  id: String,
  createIfNotFound: boolean = true
): DisableEvent {
  let event = DisableEvent.load(id);

  if (event == null && createIfNotFound) {
    event = new DisableEvent(id);
  }

  return event as DisableEvent;
}

export function getOrCreateEnableEvent(
  id: String,
  createIfNotFound: boolean = true
): EnableEvent {
  let event = EnableEvent.load(id);

  if (event == null && createIfNotFound) {
    event = new EnableEvent(id);
  }

  return event as EnableEvent;
}
