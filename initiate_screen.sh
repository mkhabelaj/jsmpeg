#!/bin/bash
##################################Initiate Screen####################################
#name of the screen
PROJECT_NAME=$1
#name of the screen inside the project screen
DESCRIPTOR=$2
#Json config file with web socket information
ELEMENT=$3

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
#Check if project exists before initializing it again
#if ! screen -list | grep -q $PROJECT_NAME; then
screen -AdmS $PROJECT_NAME -t "${DESCRIPTOR} \n"
echo "done"
#else
#    echo "Screen already start, adding extra websocket......"
#fi
#create the screen can run start the web socket relay
screen -S $PROJECT_NAME -t $DESCRIPTOR -X stuff "node startWebSocket.js '${ELEMENT}' \n"

echo "done"


