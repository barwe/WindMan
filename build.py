# --ui 仅打包前端代码
# --api 将打包好的前端代码和后端代码再次打包，生成窗口式exe
# --gui 将打包好的前端代码和后端代码再次打包，生成桌面式exe
from argparse import ArgumentParser
import os

parser = ArgumentParser()
parser.add_argument("--ui", action="store_true")
parser.add_argument("--api", action="store_true")
parser.add_argument("--gui", action="store_true")
parser.add_argument("-n", "--nuitka", action="store_true")
args = parser.parse_args()


def os_system(*cmds):
    os.system(" ".join(cmds))


if args.ui:
    os.system("cd frontend && pnpm install && pnpm build")

if args.api:
    os_system(
        "nuitka",
        # # 完全独立的可执行文件，不需要依赖外部 Python 环境
        "--standalone",
        # # 生成一个单一的可执行文件，而不是文件夹。这个选项会生成一个压缩的单文件可执行程序，在运行时再解压到临时目录
        "--onefile",
        "--remove-output",
        "--output-dir=dist",
        "--output-filename=WindManServer",
        "--windows-icon-from-ico=gui/favicon.ico",
        # 包含特定的数据文件 --include-data-file=FILE
        "--include-data-dir=gui=gui",
        # 包含特定的 Python 模块 --include-module=MODULE
        # 包含特定的 Python 包 --include-package=PACKAGE:
        "backend/server.py",
    )

if args.gui:
    if args.nuitka:
        os_system(
            "nuitka",
            "--standalone",
            "--onefile",
            "--output-dir=dist",
            # "--windows-disable-console",
            "--windows-icon-from-ico=gui/favicon.ico",
            "--include-data-dir=gui=gui",
            "--output-filename=WindManGUI",
            # "--enable-plugin=pyside6",
            # "--jobs=1",
            # "--include-package=fastapi,screeninfo,wmctrl,webview,requests",
            "--remove-output",
            "backend/desktop.py",
        )
    else:
        commands = os_system(
            "pyinstaller",
            "-Fn WindManGUI",
            '--add-data "gui:gui"',
            "--windowed",
            "--strip",
            "--clean",
            "--icon gui/favicon.ico",
            "--hidden-import=pkg_resources.py2_warn",
            "backend/desktop.py",
        )
