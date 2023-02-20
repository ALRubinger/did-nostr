// @ts-ignore
import nostrTools from 'nostr-tools';
import { sha256 } from '@noble/hashes/sha256';

import { bytesToHex } from '@noble/hashes/utils';

const { nip19, getEventHash, signEvent } = nostrTools;
const EVENT_KIND = 9325;

export function pubKeyToDid(pubKey: string): string {
  const npub = nip19.npubEncode(pubKey);

  return `nostr:did:${npub}`;
}

export function createPublishEvent(pubKey: string, recoveryPubKey: string, privateKey: string): any {
  const hashedRecoveryKey = sha256(sha256(recoveryPubKey));
  const content = { r: bytesToHex(hashedRecoveryKey) };

  const event = {
    content    : JSON.stringify(content),
    created_at : Math.floor(Date.now() / 1_000),
    kind       : EVENT_KIND,
    pubkey     : pubKey,
    tags       : [
      ['d', pubKeyToDid(pubKey)],
      ['o', 'publish']
    ]
  };

  event['id'] = getEventHash(event);
  event['sig'] = signEvent(event, privateKey);

  return event;
}

export function createPatchEvent(did: string, pubKey: string, previousEvent: string, patches: any[], privateKey: string): any {
  const content = { patches };
  const event = {
    content    : JSON.stringify(content),
    created_at : Math.floor(Date.now() / 1_000),
    kind       : EVENT_KIND,
    pubkey     : pubKey,
    tags       : [
      ['d', pubKeyToDid(pubKey)],
      ['o', 'patch']
    ]
  };

  event['id'] = getEventHash(event);
  event['sig'] = signEvent(event, privateKey);

  return event;
}