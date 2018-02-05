#!/bin/bash

# verifica usuario
if [[ $EUID -ne 0 ]]; then
	echo "This script must be run as root" 
	exit 0
else
	LOCK=/tmp/daemon.lock
	LOG=/tmp/daemon.log
	YES=/tmp/on

	control_c () {
		echo "\nDeamon finished" >> $LOG
		rm $YES 2>/dev/null
		rm $LOCK 2>/dev/null
		exit 0
	}

	trap control_c INT HUP TERM

	if [ ! -f $LOCK ]
	then
		echo "################################################" >> $LOG
		echo "`date`: Daemon running... " >> $LOG
		touch $LOCK

		while true
		do
			sleep 5
			if [ -f $YES ]
			then
				echo "`date`: File $YES was found!" >> $LOG
				rm $YES 2>/dev/null
				rm $LOCK 2>/dev/null
				echo "`date`: Deamon finished." >> $LOG
				break
			else
				echo "`date`: File $YES wasn't found!" >> $LOG
				echo "`date`: Generate file..." >> $LOG
				touch $YES
			fi
		done
	else
		echo "Deamon is already running..."
		exit 0
	fi
fi