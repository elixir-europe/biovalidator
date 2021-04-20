#!/bin/bash

server=false
while [ $# -gt 0 ]; do
  case "$1" in
    --server)
      server=true
      ;;
    --schema)
      schema="$2"
      shift
      ;;
    --json)
      json="$2"
      shift
      ;;
    *)
      printf "*********************************************************************************\n"
      printf "* Error, invalid arguments. Valid arguments are \n"
      printf "* --server to run in server mode\n"
      printf "* --schema /path/to/schema --json /path/to/json to validate json against schema \n"
      printf "*********************************************************************************\n"
      exit 1
  esac
  shift
done

if [ $server = true ]
then
  printf  "Running validator in server mode \n"
  node src/server.js
else
  printf "Running validator in onetime validation mode with params schema=%s json=%s \n" "$schema" "$json"
  node validator-cli.js --schema="$schema" --json="$json"
fi

