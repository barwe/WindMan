import time
import asyncio
from loguru import logger
from fastapi import WebSocket, WebSocketDisconnect
from .exwind.wind import ExWindow
from .exwind.apps import APPS


class EventHandler:
    def __init__(self, websocket: WebSocket) -> None:
        self.websocket = websocket

    async def send_json(self, event: str, data):
        sended = {"event": event, "data": data}
        await self.websocket.send_json(sended)

    async def run_loop(self):
        start = time.time()
        while True:
            end = time.time()
            if end - start > 3600:
                logger.info("服务端主动断开连接")
                self.websocket.close()
                break
            winds = ExWindow.get_windows(APPS.keys())
            wind_ds = [w.json() for w in winds]
            await self.websocket.send_json(wind_ds)
            await asyncio.sleep(2)


async def primary_websocket(websocket: WebSocket):
    await websocket.accept()
    event_handler = EventHandler(websocket)
    try:
        await event_handler.run_loop()
    except WebSocketDisconnect:
        print("客户端主动断开连接")
        websocket.close()
