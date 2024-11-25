import os
import time
import webview
import threading
import urllib3

# Fix "KMS: DRM_IOCTL_MODE_CREATE_DUMB failed: Permission Denied" on deepin
os.environ.setdefault("WEBKIT_DISABLE_DMABUF_RENDERER", "1")

PROD_PORT = 28473


def api_thread():
    # fmt: off
    import uvicorn
    from server import app
    uvicorn.run(app, port=PROD_PORT)


def get_webv_url(port: int = None):
    # 未指定应用端口时，需要启动独立的 API 服务，并由 API 服务提供静态页面资源
    if port is None:
        thread = threading.Thread(target=api_thread)
        thread.daemon = True
        thread.start()

        server_url = f"http://127.0.0.1:{PROD_PORT}"
        time.sleep(0.5)
        while True:
            # try:
            #     if requests.get(server_url).status_code == 200:
            #         break
            # except requests.exceptions.ConnectionError:
            #     pass
            try:
                if urllib3.request("GET", server_url).status == 200:
                    break
            except urllib3.exceptions.MaxRetryError:
                pass

    else:
        server_url = f"http://127.0.0.1:{port}"

    return server_url


def start_webview(webv_url: str):
    w, h = (350, 800)
    webview.create_window(
        "windman",
        url=webv_url,
        width=w,
        height=h,
        min_size=(w, h),
        text_select=False,
        resizable=False,
    )
    webview.start(gui="gtk")


if __name__ == "__main__":
    from argparse import ArgumentParser

    parser = ArgumentParser()
    parser.add_argument("-p", "--port", type=int, help="指定此端口时桌面端将直接监听该端口的页面，不会在后台启动独立的服务程序")
    args = parser.parse_args()

    url = get_webv_url(args.port)
    start_webview(url)
