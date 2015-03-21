#!/bin/bash

RUNTIME_DIR="$(dirname $(readlink -f $0))"
PROJECT_DIR="$(dirname $(readlink -f ${RUNTIME_DIR}/../../../..))"

NAME="JiiFramework.ru Node JS Application"
NODE_BIN_DIR=/usr/bin
NODE_PATH=/opt/nodejs/node_modules
APPLICATION_DIR=${PROJECT_DIR}/htdocs
APPLICATION_START=${APPLICATION_DIR}/index.js
PIDFILE=${PROJECT_DIR}/tmp/node.pid
LOGFILE=${PROJECT_DIR}/tmp/node.log

# Add node to the path for situations in which the environment is passed.
PATH=${NODE_BIN_DIR}:$PATH
export NODE_PATH=${NODE_PATH}

start() {
    echo "Starting $NAME"
    cd ${APPLICATION_DIR}
    forever --pidFile ${PIDFILE} -a -l ${LOGFILE} --minUptime 5000 --spinSleepTime 2000 start ${APPLICATION_START} &
    RETVAL=$?
}

stop() {
    if [ -f ${PIDFILE} ]; then
        echo "Shutting down $NAME"
        forever stop ${APPLICATION_START}

        # Get rid of the pidfile, since Forever won't do that.
        rm -f ${PIDFILE}
        RETVAL=$?
    else
        echo "$NAME is not running."
        RETVAL=0
    fi
}

restart() {
    echo "Restarting $NAME"
    stop
    start
}

status() {
    echo "Status for $NAME:"
    forever list
    RETVAL=$?
}

case "$1" in
    start)
        start
        ;;
    stop)
        stop
        ;;
    status)
        status
        ;;
    restart)
        restart
        ;;
    *)
        echo "Usage: {start|stop|status|restart}"
        exit 1
        ;;
esac
exit ${RETVAL}
