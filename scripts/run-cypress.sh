#!/bin/sh

yarn dev & npx wait-on http://localhost:3000 & npx cypress run --record --key $CYPRESS_RECORD_KEY --env infura_id=$NEXT_JS_INFURA_ID