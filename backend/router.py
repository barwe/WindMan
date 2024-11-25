from fastapi import FastAPI
from wind.views import wind_router
from wind.ws_primary import primary_websocket


def get_app():
    app = FastAPI()
    app.include_router(wind_router)
    app.add_websocket_route("/ws/", primary_websocket)
    return app
