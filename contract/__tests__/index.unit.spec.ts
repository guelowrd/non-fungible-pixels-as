import { VMContext } from "near-sdk-as";
import { Token, TokenEdition } from "../assembly/model";
import { createToken, getAllCreators, getAllEditionIds, getAllOwners, getAllTokenIds, getCreatorTokenIds, getEditionTokenId, getOwnerEditionIds, getTokenCreator, getTokenData, getTokenHeight, getTokenMaxNumberOfEditions, getTokenMintPrice, getTokenName, getTokenNumberOfMintedEditions, getTokenWidth, getTotalNumberOfTokens, getTotalNumberOfTokensCreated, mintToken } from "../assembly/index";
import { toYocto } from "../utils";

const token_id = "64291eaa92ff7a285bf5db0664576a1d6d74d51a7e3f8f849718a46838cda7";
const token_name = "TestToken";
const wallet_id = "nfp-test.testnet";
const mint_price = 1.234;

describe("Check token creation", () => {
    VMContext.setSigner_account_id(wallet_id);
    let tokenData = "0,255,0,123,0,0,0,255,0";
    let token: Token = createToken(token_name, 2, mint_price, tokenData, 3, 3);
    expect(token.getTokenId()).toStrictEqual(token_id);
    expect(getTokenName(token_id)).toStrictEqual(token_name);
    expect(getTokenCreator(token_id)).toStrictEqual(wallet_id);
    expect(getTokenMintPrice(token_id)).toStrictEqual(mint_price);
    expect(getTokenMaxNumberOfEditions(token_id)).toStrictEqual(2);
    expect(getTokenWidth(token_id)).toStrictEqual(3);
    expect(getTokenHeight(token_id)).toStrictEqual(3);
    expect(getTokenNumberOfMintedEditions(token_id)).toStrictEqual(0);
    expect(getTokenData(token_id).length).toStrictEqual(tokenData.split(',').length);
    expect(getTokenData(token_id).join(',')).toStrictEqual(tokenData);
    expect(getTotalNumberOfTokens()).toStrictEqual(1);
    expect(getTotalNumberOfTokensCreated()).toStrictEqual(1);
    expect(getAllCreators().length).toStrictEqual(1);
    expect(getAllCreators()[0]).toStrictEqual(wallet_id);
    expect(getAllTokenIds().length).toStrictEqual(1);
    expect(getAllTokenIds()[0]).toStrictEqual(token_id);
    expect(getCreatorTokenIds(wallet_id).length).toStrictEqual(1);
    expect(getCreatorTokenIds(wallet_id)[0]).toStrictEqual(token_id);
});

describe("Check token minting", () => {
    VMContext.setSigner_account_id(wallet_id);
    VMContext.setAttached_deposit(toYocto(mint_price));
    let mint0: TokenEdition = mintToken(token_id);
    let mint0_id = "bd9db3aa79845e1ad9768e1fbdac986ffa3b4a5ae4b542477f7a9f392d8e94";
    expect(mint0.getEditionId()).toStrictEqual(mint0_id);
    expect(getEditionTokenId(mint0_id)).toStrictEqual(token_id);
    expect(getTokenNumberOfMintedEditions(token_id)).toStrictEqual(1);
    expect(getAllEditionIds().length).toStrictEqual(1);
    expect(getAllEditionIds()[0]).toStrictEqual(mint0_id);
    expect(getOwnerEditionIds(wallet_id).length).toStrictEqual(1);
    expect(getOwnerEditionIds(wallet_id)[0]).toStrictEqual(mint0_id);    
    VMContext.setAttached_deposit(toYocto(mint_price));
    let mint1: TokenEdition = mintToken(token_id);
    let mint1_id = "394d9717f461c56c318cb6b25577b29c399dfbbe46637dedaa76a5c19b885d52";
    expect(mint1.getEditionId()).toStrictEqual(mint1_id);
    expect(getEditionTokenId(mint1_id)).toStrictEqual(token_id);
    expect(getTokenNumberOfMintedEditions(token_id)).toStrictEqual(2);
    expect(getAllEditionIds().length).toStrictEqual(2);
    expect(getAllEditionIds()[1]).toStrictEqual(mint1_id);
    expect(getOwnerEditionIds(wallet_id).length).toStrictEqual(2);
    expect(getOwnerEditionIds(wallet_id)[1]).toStrictEqual(mint1_id);    
    expect(getAllOwners().length).toStrictEqual(1);
    expect(getAllOwners()[0]).toStrictEqual(wallet_id);        
});