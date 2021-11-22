import env from '../../env'
import {sign, verify} from 'jsonwebtoken'

const HEADER = "eyJhbGciOiJIUzI1NiJ9";

export function generateToken(id: string, passwordVersion: number) {
  const token = sign(`${id}-${passwordVersion}`, env.JWT_SECRET);
  // remove header to make the token shorter.
  const shortToken = token.split(".").splice(1).join(".");
  return shortToken;
}


export function decodeToken(token: string) {
  const fullToken = `${HEADER}.${token}`;
  let decodedData: string | null = null;
  try {
    decodedData = verify(fullToken, env.JWT_SECRET) as string;
  } catch (err) {}
  if (!decodedData) return false;
  // split id and passwordVersion
  const split = decodedData.split("-");
  const id = split[0];
  const passwordVersion = parseInt(split[1]);
  return {id, passwordVersion}
}