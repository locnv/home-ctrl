#!/usr/bin/env bash

# ref: basic: https://www.tecmint.com/rsync-local-remote-file-synchronization-commands/
# ref: --exclude-from: https://askubuntu.com/questions/320458/how-to-exclude-multiple-directories-with-rsync

#set -x

#SRC_DIR=/home/locnv/Documents/projects/biomotion-gw/
SRC_DIR=../HomeElecCtrl/

REMOTE_HOST=192.168.2.5
REMOTE_USR=pi
DEST_DIR=/home/pi/projects/HomeElecCtrl/


TARGET=${REMOTE_USR}@${REMOTE_HOST}:${DEST_DIR}

RSYNC=rsync
OPTION=-avz
SHOW_PROCESS=--progress

EXCLUDE="--exclude-from="${SRC_DIR}"rsync-exclude.txt"

${RSYNC} ${OPTION} ${EXCLUDE} ${SHOW_PROCESS} ${SRC_DIR} ${TARGET}

