#!/usr/bin/env bash

# ref: basic: https://www.tecmint.com/rsync-local-remote-file-synchronization-commands/
# ref: --exclude-from: https://askubuntu.com/questions/320458/how-to-exclude-multiple-directories-with-rsync

#set -x

#SRC_DIR=/home/locnv/Documents/projects/biomotion-gw/
SRC_DIR=../

REMOTE_HOST=18.222.53.144
REMOTE_USR=admin
DEST_DIR=/home/admin/Documents/projects/koa-app/


TARGET=${REMOTE_USR}@${REMOTE_HOST}:${DEST_DIR}

RSYNC=rsync
OPTION=-avz
SHOW_PROCESS=--progress

EXCLUDE="--exclude-from="${SRC_DIR}"rsync-exclude.txt"

AUTH=-e "ssh -i /Users/locnv/Documents/ec2-free-test/locnv-dev-micro-ec2-vp.pem"

${RSYNC} ${OPTION} ${EXCLUDE} ${SHOW_PROCESS} ${SRC_DIR} ${TARGET}

