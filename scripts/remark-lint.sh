#!/bin/sh

if [ -f ./node_modules/.bin/remark ]; then
    echo "Linting MarkDown..."
    ./node_modules/.bin/remark -f .
    rc=$?; if [ $rc -ne 0 ]; then exit $rc; fi
fi

exit
