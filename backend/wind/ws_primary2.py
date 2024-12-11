from typing import Any
from pydantic import BaseModel
from fastapi import WebSocket, WebSocketDisconnect
from screeninfo import get_monitors
from .exwind.wind import ExWindow


class ReceviedData(BaseModel):
    event: str
    data: Any = None


class EventHandler:
    def __init__(self, websocket: WebSocket) -> None:
        self.websocket = websocket

    async def send_json(self, event: str, data):
        sended = {"event": event, "data": data}
        await self.websocket.send_json(sended)

    async def run_loop(self):
        while True:
            rawdata = await self.websocket.receive_json()
            received = ReceviedData(**rawdata)
            if hasattr(self, received.event):
                handle_func = getattr(self, received.event)
                result = handle_func(received.data)
                await self.send_json(received.event, result)

    def LIST_MONITORS(self, _):
        return [m.__dict__ for m in get_monitors()]

    def CHANGE_SELECTED_WM_CLASSES(self, data: dict):
        wm_classes = data["wm_classes"]
        winds = ExWindow.get_windows(wm_classes)
        wind_ds = [w.json() for w in winds]
        return wind_ds


async def primary_websocket(websocket: WebSocket):
    await websocket.accept()
    event_handler = EventHandler(websocket)
    try:
        await event_handler.run_loop()
    except WebSocketDisconnect:
        print("WebSocket connection closed.")
