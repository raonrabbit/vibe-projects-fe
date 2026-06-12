import { webcrypto } from "crypto";
import { v4 as uuidv4 } from "uuid";

const subtle = webcrypto.subtle;

let keyPair: CryptoKeyPair | null = null;
const sessionUuid = uuidv4();

export async function getKeyPair(): Promise<CryptoKeyPair> {
  if (!keyPair) {
    keyPair = await subtle.generateKey(
      { name: "ECDSA", namedCurve: "P-256" },
      true,
      ["sign", "verify"],
    );
  }
  return keyPair;
}

function base64url(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof ArrayBuffer ? new Uint8Array(buf) : buf;
  return Buffer.from(bytes)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

export async function generateDPoP(
  url: string,
  method: string,
): Promise<string> {
  const kp = await getKeyPair();
  const publicJwk = (await subtle.exportKey("jwk", kp.publicKey)) as JsonWebKey;

  const header = {
    typ: "dpop+jwt",
    alg: "ES256",
    jwk: {
      crv: publicJwk.crv,
      kty: publicJwk.kty,
      x: publicJwk.x,
      y: publicJwk.y,
    },
  };

  const payload = {
    iat: Math.floor(Date.now() / 1000),
    jti: uuidv4(),
    htu: url,
    htm: method.toUpperCase(),
    uuid: sessionUuid,
  };

  const headerB64 = base64url(new TextEncoder().encode(JSON.stringify(header)));
  const payloadB64 = base64url(
    new TextEncoder().encode(JSON.stringify(payload)),
  );
  const signingInput = `${headerB64}.${payloadB64}`;

  const signature = await subtle.sign(
    { name: "ECDSA", hash: { name: "SHA-256" } },
    kp.privateKey,
    new TextEncoder().encode(signingInput),
  );

  return `${signingInput}.${base64url(signature)}`;
}

export { sessionUuid, uuidv4 };
