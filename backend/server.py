from fastapi.responses import FileResponse
from starlette.middleware.base import BaseHTTPMiddleware
from os.path import join, dirname, abspath, exists
from router import get_app

app = get_app()

# 除了 /api/ 和 /ws/ 开头的路径外，其余路径将直接请求静态资源
# fmt: off
ROOT_DIR = dirname(abspath(__file__))
EXCLUDED_PREFIX = ("/api/", "/ws/")
static_dir = join(ROOT_DIR, "..", "gui")
if not exists(static_dir): static_dir = join(ROOT_DIR, "gui")
class RedirectToIndexMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        url_path = request.url.path
        for prefix in EXCLUDED_PREFIX:
            if url_path.startswith(prefix):
                return await call_next(request)
        if url_path == "/": url_path = "/index.html"
        return FileResponse(static_dir + url_path)
app.add_middleware(RedirectToIndexMiddleware)
# fmt: on

# 直接运行此脚本启动的是开发服务器
if __name__ == "__main__":
    import uvicorn
    from argparse import ArgumentParser

    parser = ArgumentParser()
    parser.add_argument("-m", "--mode", choices=("dev", "prod"), default="prod")
    parser.add_argument("-p", "--port", type=int, default=23001)
    args = parser.parse_args()
    if args.mode == "prod":
        uvicorn.run(app, port=28473)
    else:
        uvicorn.run("server:app", reload=True, port=args.port)
