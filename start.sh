#!/bin/bash

server=true
params=" "
while [ $# -gt 0 ]; do
  case "$1" in
    --schema)
      params="$params  --schema  $2"
      shift
      ;;
    --data)
      params="$params  --data  $2"
      shift
      ;;
    --ref)
      params="$params  --ref  $2"
      shift
      ;;
    --port)
      params="$params  --port  $2"
      shift
      ;;
    *)
      printf "*********************************************************************************\n"
      printf "* Error, invalid arguments. Valid arguments are \n"
      printf "* --schema /path/to/schema --data /path/to/data  \n"
      printf "* --ref /path/to/ref/dir --port server port  \n"
      printf "*********************************************************************************\n"
      exit 1
  esac
  shift
done

node src/biovalidator $params

