from zex import xlist
from fastapi import APIRouter
from pydantic import BaseModel
from screeninfo import get_monitors
from fastcore import GoodResponse, BadResponse
from wind.exwind.wind import ExWindow
from wind.exwind.apps import APPS

router = APIRouter(prefix="/api")
wind_router = router


@router.get("/monitors/")
def list_monitors():
    data = [m.__dict__ for m in ExWindow.get_monitors()]
    return GoodResponse(data)


@router.get("/apps/")
def list_apps():
    data = [{"label": "所有", "value": "__all__"}]
    for k, d in APPS.items():
        data.append({"label": d["t"], "value": k})
    return GoodResponse(data)


@router.get("/windows/")
def list_windows():
    windows = ExWindow.get_windows(APPS.keys())
    data = [w.json() for w in windows]
    return GoodResponse(data)


class ActivateData(BaseModel):
    winId: str
    monitorName: str


@router.post("/windows/activate/")
def activate_window(data: ActivateData):
    winds = ExWindow.get_windows(APPS.keys())
    wind = xlist.get(winds, lambda d: d.id == data.winId)
    if wind is None:
        return BadResponse("No such a window")

    monitor = ExWindow.get_monitor(data.monitorName)

    # 何时执行最大化？
    # 1. 首次点击窗口时（此时 wind.monitor is None）
    # 2. 屏幕发生变化时（此时 wind.monitor.name != monitor.name）
    # 3. 已经最小化时（此时 wind.is_minimized is True）
    if wind.monitor is None or wind.monitor.name != monitor.name or wind.is_minimized:
        wind.ex_maximize_on_monitor(monitor)
    else:
        wind.ex_minimize()

    return GoodResponse(wind.json())
