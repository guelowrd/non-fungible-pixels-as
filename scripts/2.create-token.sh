#!/usr/bin/env bash

# exit on first error after this point to avoid redeploying with successful build
set -e

echo
echo ---------------------------------------------------------
echo "Step 0: Check for environment variable with contract name"
echo ---------------------------------------------------------
echo

[ -z "$CONTRACT" ] && echo "Missing \$CONTRACT environment variable" && exit 1
[ -z "$BENEFICIARY" ] && echo "Missing \$BENEFICIARY environment variable" && exit 1

# [ -z "$1" ] && echo "Add your token's name!" && exit 1
# [ -z "$2" ] && echo "Add your token's max number of editions!" && exit 1
# [ -z "$3" ] && echo "Add your token's mint price!" && exit 1
# [ -z "$4" ] && echo "Add your token's data (pixels value between 0 and 255, comma separated)!" && exit 1
# [ -z "$5" ] && echo "Add your token's width (nb pixels)!" && exit 1
# [ -z "$6" ] && echo "Add your token's height (nb pixels)!" && exit 1

echo
echo "We are about to create a new token! Be ready..."
echo

near call $CONTRACT createToken --accountId $BENEFICIARY '{"name": "TestToken", "nbEditions": 2, "mintPrice": 2.345, "dataAsString": "0,0,0,255", "width": 2, "height": 2}'
# near view $CONTRACT getTokenCreator '{"name": "TestNFP001" }'

exit 0