import { math, u128 } from "near-sdk-as";

export const ONE_MILLINEAR = u128.from("1000000000000000000000");
/**
 * == FUNCTIONS ================================================================
 */

/**
 * @function asNEAR
 * @param amount {u128} - Yocto Ⓝ token quantity as an unsigned 128-bit integer
 * @returns {string}    - Amount in NEAR, as a string
 *
 * @example
 *
 *    asNEAR(7000000000000000000000000)
 *    // => '7'
 */
 export function asNEAR(amount: u128): string {
  let u128amt = u128.div(amount, ONE_MILLINEAR).toString();
  return (parseFloat(u128amt)/1000).toString();
  }
  
  /**
   * @function toYocto
   * @param amount {number} - Amount to convert (amount*1000 must be an integer)
   * @returns {u128}        - Amount in yocto Ⓝ as an unsigned 128-bit integer
   *
   * @example
   *
   *    toYocto(7)
   *    // => 7000000000000000000000000
   */
  export function toYocto(amount: number): u128 {
    let amountx1000 = 1000*amount;
    return u128.mul(ONE_MILLINEAR, u128.from(amountx1000));
  }


  /**
   * @function stringsToSha256
   * @param values {Array<string>}  - List of infos as strings
   * @returns {string}              - SHA256 hash of the input as strings
   *
   * @example
   *
   *    stringsToSha256(["NFT", "0", "0"])
   *    // => a091bb74baa72ecd427e817493596d83411c83aeae53b6907e9f7a37fd3167
   */
  export function stringsToSha256(values: Array<string>): string {
    let value = values.join('|');
    let buffer = new ArrayBuffer(value.length * 2); // 2 bytes per char
    let view = Uint8Array.wrap(buffer);
    for (let i = 0, length = value.length; i < length; i++) {
      view[i] = value.charCodeAt(i);
    }
    let hashArray = math.sha256(view);
    let hashHex: string = '';
    for (let i = 0, length = hashArray.length; i < length; i++) {
      hashHex += hashArray[i].toString(16).slice(-2);
    }    
    return hashHex;
}