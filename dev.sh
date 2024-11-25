#!/bin/sh
if [ "$1" = "api" ]; then
    cd backend && python server.py -m dev -p 23001 && cd ..
elif [ "$1" = "ui" ]; then
    cd frontend && pnpm dev && cd ..
elif [ "$1" = "gui" ]; then
    python backend/desktop.py -p 28001
fi
