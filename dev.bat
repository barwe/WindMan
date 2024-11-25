@echo off
if "%1" == "api" (
    cd backend && python server.py && cd ..
) else if "%1" == "ui" (
    cd frontend && pnpm dev && cd ..
) else if "%1" == "gui" (
    python backend/desktop.py -p 8077
)