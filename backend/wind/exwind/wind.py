import subprocess
from typing import Optional, Sequence
from screeninfo import Monitor, get_monitors
from wmctrl import Window, getoutput
from .apps import as_better_window

JSON_ATTRS = ("id", "desktop", "pid", "x", "y", "w", "h", "wm_class", "host", "wm_name", "is_minimized", "is_maximized")

CACHED_MONITORS: "dict[str,Monitor]" = {}
CACHED_WINDOWS: "dict[str, ExWindow]" = {}
WINDOW_MONITOR_MAPS: "dict[ExWindow,str]" = {}  # 记录窗口最后一次出现在哪个屏幕上


class ExWindow(Window):
    # 继承的属性
    id: str
    desktop: int
    pid: int
    x: int
    y: int
    w: int
    h: int
    wm_class: str
    host: str
    wm_name: str

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.data: dict[str, str] = {}
        self.is_minimized = False
        self.is_maximized = False
        self.monitor: Optional["Monitor"] = None

    def json(self):
        rd = {k: getattr(self, k) for k in JSON_ATTRS}
        rd["data"] = self.data
        return rd

    def ex_maximize(self):
        """将窗口最大化"""
        self.is_minimized = False
        self.is_maximized = True
        subprocess.call(["xdotool", "windowactivate", self.id])

    def ex_maximize_on_monitor(self, monitor: "Monitor"):
        self.ex_move_to_monitor(monitor)
        self.ex_maximize()

    def ex_minimize(self):
        """将窗口最小化"""
        self.is_minimized = True
        self.is_maximized = False
        subprocess.call(["xdotool", "windowminimize", self.id])

    def ex_move(self, x: int, y: int):
        """将窗口移动到指定位置"""
        self.unmaximize()
        return super().move(x, y)

    def ex_move_to_monitor(self, monitor: "Monitor"):
        self.monitor = monitor
        self.ex_move(monitor.x, monitor.y)

    @classmethod
    def get_all_windows(cls) -> Sequence["ExWindow"]:
        """枚举当前所有窗口"""
        out = getoutput("wmctrl -l -G -p -x")
        windows = []
        for line in out.splitlines():
            parts = line.split(None, 9)
            parts = list(map(str.strip, parts))
            parts[1:7] = list(map(int, parts[1:7]))
            if len(parts) == 9:  # title is missing
                parts.append("")
            elif len(parts) != 10:
                continue  # something was wrong
            if parts[0] not in CACHED_WINDOWS:
                win = cls(*parts)
                CACHED_WINDOWS[parts[0]] = win
            else:
                win = CACHED_WINDOWS[parts[0]]
            windows.append(win)
        return windows

    @staticmethod
    def get_windows(included_wm_classes: Sequence[str]) -> Sequence["ExWindow"]:
        """获取指定 wm_class 下的所有窗口"""
        windows = []
        included_wm_classes = included_wm_classes or []
        for win in ExWindow.get_all_windows():
            if win.desktop == -1:
                continue
            if win.wm_class not in included_wm_classes:
                continue
            windows.append(as_better_window(win))
        return sorted(windows, key=lambda d: d.wm_class)

    @staticmethod
    def get_monitors() -> Sequence[Monitor]:
        monitors = []
        for m in get_monitors():
            if m.name not in CACHED_MONITORS:
                curr = CACHED_MONITORS[m.name] = m
            else:
                curr = CACHED_MONITORS[m.name]
            monitors.append(curr)
        return monitors

    @staticmethod
    def get_monitor(name: str):
        if name in CACHED_MONITORS:
            return CACHED_MONITORS[name]
        for monitor in get_monitors():
            if monitor.name not in CACHED_MONITORS:
                CACHED_MONITORS[monitor.name] = monitor
                if monitor.name == name:
                    return monitor
        raise Exception(f"No such a monitor: {name}")
