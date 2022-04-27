import { Context, logging, PersistentVector, storage } from "near-sdk-as";
import { stringsToSha256, toYocto } from "../utils";
import { allCreators, allEditionIds, allEditionIdsByOwner, allEditionsById, allEditionsByToken, allOwners, allTokenIds, allTokenIdsByCreator, allTokensById, Token, TokenEdition } from "./model";

// This is a key in storage used to track the current number of tokens (to set IDs)
export const TOTAL_SUPPLY = 's'
// This is a key in storage used to track tokens data / tokens editions (to navigate through them)
const TOKEN_DATA = 'd'

////////////////////
// CHANGE METHODS //
////////////////////

/*
 * Creates a new token.
 */
export function createToken(name: string, nbEditions: u16, mintPrice: number, dataAsString: string, width: u8, height: u8): Token {
  let dataStrAsArr: string[] = dataAsString.split(',');
  let dataAsArray: Array<u8> = new Array<u8>();
  for (let i:i32 = 0; i < dataAsArray.length; ++i) {
    let d: u8 = parseInt(dataStrAsArr[i]) as u8;
    dataAsArray.push(d);
  }
  let arr = dataAsString.split(',');
  for (let i:i32 = 0; i < arr.length; i++) {
    dataAsArray.push(parseInt(arr[i]) as u8);
  }
  return init(name, nbEditions, mintPrice, dataAsArray, width, height);
}

/*
 * Mints a new edition of an existing token.
 */
 export function mintToken(token_id: string): TokenEdition {
  let token = getToken(token_id);
  assert(token != null, `Could not find token with id ${token_id}!`);  
  return token!.mint();
}

//////////////////
// VIEW METHODS //
//////////////////

/*
 * Returns the token with a given id (returns null if no such id).
 */
export function getToken(token_id: string): Token | null {
  return allTokensById.get(token_id);
}

/*
 * Returns all the ids of all the tokens.
 */
export function getAllTokenIds(): Array<string> {
  let ret = new Array<string>();
  for (let i=0, length=allTokenIds.length; i<length; ++i) {
    ret.push(allTokenIds[i])
  }
  return ret;
}

/*
* Returns the current id counter (which SHOULD BE the number of all tokens ever created, assuming no deletion).
*/
export function getTotalNumberOfTokensCreated(): u64 {
  return storage.getPrimitive<u64>(TOTAL_SUPPLY, 0);
}

/*
* Returns the current id counter (which IS EXACTLY the number of tokens created and stored).
*/
export function getTotalNumberOfTokens(): u64 {
  return allTokensById.length;
}

/*
 * Returns the data (as an array) of a given token.
 */
 export function getTokenData(token_id: string): Array<u8> {
  let token = getToken(token_id);
  assert(token != null, `Could not find token with id ${token_id}!`);
  return token!.getTokenData();
}

/*
 * Returns the width (number of pixels) of a given token.
 */
export function getTokenWidth(token_id: string): u8 {
  let token = getToken(token_id);
  assert(token != null, `Could not find token with id ${token_id}!`);
  return token!.getWidth();
}

/*
 * Returns the height (number of pixels of a given token.
 */
export function getTokenHeight(token_id: string): u8 {
  let token = getToken(token_id);
  assert(token != null, `Could not find token with id ${token_id}!`);
  return token!.getHeight();
}  

/*
 * Returns the name of a given token.
 */
 export function getTokenName(token_id: string): string {
  let token = getToken(token_id);
  assert(token != null, `Could not find token with id ${token_id}!`);
  return token!.getName();
}

/*
 * Returns the mint price of a given token.
 */
export function getTokenMintPrice(token_id: string): number {
  let token = getToken(token_id);
  assert(token != null, `Could not find token with id ${token_id}!`);
  return token!.getMintPrice();
}

/*
 * Returns the creator wallet of a given token.
 */
export function getTokenCreator(token_id: string): string {
  let token = getToken(token_id);
  assert(token != null, `Could not find token with id ${token_id}!`);
  return token!.getCreator();
}

/*
 * Returns the maximum number of mintable editions of a given token.
 */
export function getTokenMaxNumberOfEditions(token_id: string): u64 {
  let token = getToken(token_id);
  assert(token != null, `Could not find token with id ${token_id}!`);
  return token!.getNbEditions();
}

/*
 * Returns the number of already minted editions of a given token.
 */
 export function getTokenNumberOfMintedEditions(token_id: string): u64 {
  let token = getToken(token_id);
  assert(token != null, `Could not find token with id ${token_id}!`);
  return token!.getNbMints();
}

/*
 * Returns the edition with the given id (returns null if no such id).
 */
export function getEdition(edition_id: string): TokenEdition | null {
  return allEditionsById.get(edition_id);
}

/*
 * Returns all the ids of all the minted token editions.
 */
export function getAllEditionIds(): Array<string> {
  let ret = new Array<string>();
  for (let i=0, length=allEditionIds.length; i<length; ++i) {
    ret.push(allEditionIds[i])
  }
  return ret;
}

/*
 * Returns the token id of a given minted edition.
 */
export function getEditionTokenId(edition_id: string): string {
  let edition = getEdition(edition_id);
  assert(edition != null, `Could not find mint with id ${edition_id}!`);
  return edition!.getTokenId();
}

/*
 * Returns the ids of the tokens created by a given creator.
 */
export function getCreatorTokenIds(creator: string): Array<string> {
  let tokenIds = allTokenIdsByCreator.get(creator);
  assert(tokenIds != null && tokenIds.length > 0, `Could not find any tokens for creator ${creator}!`);
  return tokenIds!;
}

/*
 * Returns the ids of the minted editions owned by a given owner.
 */
export function getOwnerEditionIds(owner: string): Array<string> {
  let editionIds = allEditionIdsByOwner.get(owner);
  assert(editionIds != null && editionIds.length > 0, `Could not find any minted editions for owner ${owner}!`);
  return editionIds!;
}

/*
 * Returns all the creators of tokens.
 */
export function getAllCreators(): Array<string> {
  let ret = new Array<string>();
  for (let i=0, length=allCreators.length; i<length; ++i) {
    ret.push(allCreators[i])
  }
  return ret;
}

/*
 * Returns all the owners of minted editions.
 */
export function getAllOwners(): Array<string> {
  let ret = new Array<string>();
  for (let i=0, length=allOwners.length; i<length; ++i) {
    ret.push(allOwners[i])
  }
  return ret;
}

export function whatsyoursha(input: string): string {
  return stringsToSha256([input]);
}

//////////////////////
// INTERNAL METHODS //
//////////////////////

function init(name: string, nbEditions: u16, mintPrice: number, dataAsArray: Array<u8>, width: u8, height: u8): Token {
  logging.log(`Starting creating token ${name}...`);
  verifyData(dataAsArray, width, height);
  verifyMintPrice(mintPrice);
  let token_id = verifyNameAndGetTokenId(name);
  let id = getHowmaniethAndIncrementCounter();
  let tokenData = makeTokenDataAsPersistentVector(dataAsArray, width, height, id);
  let initToken = new Token(token_id, id, name, nbEditions, Context.sender, toYocto(mintPrice), tokenData, width, height);
  addTokenToAllMaps(token_id, initToken);
  return initToken;
}

function makeTokenDataAsPersistentVector(dataAsArray: Array<u8>, width: u8, height: u8, id: u64): PersistentVector<u8> {
  let data_id = [TOKEN_DATA, id.toString()].join('|');
  let tokenData = new PersistentVector<u8>(data_id);
  for (let p: u16 = 0; p < width*height; ++p) {
      tokenData.push(dataAsArray[p]);
  }
  return tokenData;
}

function verifyData(dataAsArray: Array<u8>, width: u8, height: u8): void {
  assert(dataAsArray.length == width*height, "Token data doesn't contain width*height elements!");
}

function verifyMintPrice(mintPrice: number): void {
  assert(floor(mintPrice*1000) == mintPrice*1000, "Mint price * 1000 must be an integer");
}

function verifyNameAndGetTokenId(name: string): string {
  assert(!name.includes('|'), "Token name cannot contain '|', the pipe character is forbidden!");
  let id = storage.getPrimitive<u64>(TOTAL_SUPPLY, 0);
  let idStr = id.toString();
  let token_id = stringsToSha256([name, idStr]);
  assert(allTokensById.get(token_id) == null, "Token name already exists!");
  return token_id;
}

function getHowmaniethAndIncrementCounter(): u64 {
  let id = storage.getPrimitive<u64>(TOTAL_SUPPLY, 0);
  storage.set<u64>(TOTAL_SUPPLY, id + 1);
  return id;
}

function addTokenToAllMaps(token_id: string, token: Token): void {
  let creator = token.getCreator();
  allTokensById.set(token_id, token);
  allTokenIds.push(token_id);
  let prevTokens = allTokenIdsByCreator.get(creator);
  if (prevTokens == null) {
    allTokenIdsByCreator.set(creator, [token_id]);
    allCreators.push(creator);
  } else {
    prevTokens.push(token_id);
    allTokenIdsByCreator.set(creator, prevTokens);
  }
  allEditionsByToken.set(token_id, new Array<TokenEdition>());
}