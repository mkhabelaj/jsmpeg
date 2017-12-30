#!/bin/bash

PROJECT_NAME=$1
DESCRIPTOR=$2

if [  -z "$PROJECT_NAME" ]
    then
    echo "PROJECT_NAME is empty";
    exit 1;
fi

if [  -z "$DESCRIPTOR" ]
    then
    echo "DESCRIPTOR is empty";
    exit 1;
fi

echo "creating screen for project ${PROJECT_NAME}, descriptor ${DESCRIPTOR}"

screen -S $PROJECT_NAME -t $DESCRIPTOR