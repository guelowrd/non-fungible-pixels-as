import { Context, ContractPromiseBatch, PersistentUnorderedMap, PersistentVector, u128 } from "near-sdk-as"
import { stringsToSha256, asNEAR } from "../utils";

///////////////////////
// Types and storage //
///////////////////////

// This is a key in storage used to track all tokens / tokens editions (to navigate through them)
const ALL_TOKENS_BY_ID = 'a'
const ALL_TOKEN_IDS = 'i'
const ALL_EDITIONS_BY_TOKEN = 'b'
const ALL_TOKEN_IDS_BY_CREATOR = 'c'
const ALL_EDITIONS_BY_ID = 'e'
const ALL_EDITION_IDS = 'j'
const ALL_EDITION_IDS_BY_OWNER = 'o'
const ALL_CREATORS = 'f'
const ALL_OWNERS = 'p'

// This is a key in storage used to track tokens 
export const allTokensById = new PersistentUnorderedMap<string, Token>(ALL_TOKENS_BY_ID);
export const allTokenIds = new PersistentVector<string>(ALL_TOKEN_IDS);
export const allEditionsByToken = new PersistentUnorderedMap<string, Array<TokenEdition>>(ALL_EDITIONS_BY_TOKEN);
export const allEditionsById = new PersistentUnorderedMap<string, TokenEdition>(ALL_EDITIONS_BY_ID);
export const allTokenIdsByCreator = new PersistentUnorderedMap<string, Array<string>>(ALL_TOKEN_IDS_BY_CREATOR);
export const allEditionIds = new PersistentVector<string>(ALL_EDITION_IDS);
export const allEditionIdsByOwner = new PersistentUnorderedMap<string, Array<string>>(ALL_EDITION_IDS_BY_OWNER);
export const allCreators = new PersistentVector<string>(ALL_CREATORS);
export const allOwners = new PersistentVector<string>(ALL_OWNERS);

@nearBindgen
export class Token {
  constructor(
    private token_id: string,
    private howManieth: u64,
    private name: string, 
    private nbEditions: u16,
    private creator: string,
    private mintPrice: u128,
    private tokenData: PersistentVector<u8>,
    private width: u8,
    private height: u8
  ) {}

  mint(): TokenEdition {
    assert(Context.accountBalance >= this.mintPrice, `Account balance must be higher than mint price ${asNEAR(this.mintPrice)}Ⓝ!`);
    assert(Context.attachedDeposit >= this.mintPrice, `Attached deposit must be higher than mint price ${asNEAR(this.mintPrice)}Ⓝ!`);
    assert(this.getNbMints() < this.nbEditions, `Token cannot be minted anymore, max number of ${this.nbEditions.toString()} editions have already been minted!`)
    const to_creator = ContractPromiseBatch.create(this.creator);
    to_creator.transfer(this.mintPrice);
    let prevEditions = allEditionsByToken.get(this.token_id)!;
    let edition_id = stringsToSha256([this.name, this.howManieth.toString(), prevEditions.length.toString()]);
    let owner = Context.sender;
    let edition = new TokenEdition(this.token_id, edition_id, owner);
    prevEditions.push(edition);
    allEditionsByToken.set(this.token_id, prevEditions);
    allEditionsById.set(edition_id, edition);
    allEditionIds.push(edition_id);
    let prevOwnersEditions = allEditionIdsByOwner.get(owner);
    if (prevOwnersEditions == null) {
      allEditionIdsByOwner.set(owner, [edition_id]);
      allOwners.push(owner);
    } else {
      prevOwnersEditions.push(edition_id);
      allEditionIdsByOwner.set(owner, prevOwnersEditions);
    }    
    return edition;
  }

  getTokenId(): string {
    return this.token_id;
  }

  getName(): string {
    return this.name;
  }

  getHowManieth(): u64 {
    return this.howManieth;
  }

  getNbEditions(): u16 {
    return this.nbEditions;
  }

  getNbMints(): u16 {
    return u16(allEditionsByToken.get(this.token_id)!.length);
  }

  getCreator(): string {
    return this.creator;
  }

  getMintPrice(): number {
    return parseFloat(asNEAR(this.mintPrice));
  }

  getTokenData(): Array<u8> {
    let tokenData = new Array<u8>();
    for (let p: u16 = 0; p < this.width*this.height; ++p) {
      tokenData.push(this.tokenData[p]);
    }
    return tokenData;
  } 

  getWidth(): u8 {
    return this.width;
  }

  getHeight(): u8 {
    return this.height;
  }
}

@nearBindgen
export class TokenEdition {
  constructor(
    private token_id: string,
    private tokenedition_id: string,
    private owner_id: string
  ) {}

  getTokenId(): string {
    return this.token_id;
  }

  getEditionId(): string {
    return this.tokenedition_id;
  }

  getOwner(): string {
    return this.owner_id;
  }  
}