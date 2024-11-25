from fastapi.responses import JSONResponse


class JResponse(JSONResponse):
    """
    提供 code 值, 响应体数据结构总是 `{ ok: bool; code: int; message?: str; data?: any; }`
    - 0 表示正常响应: 通过 data 或者 content 设置数据, 通过 message 设置消息
    - >0 表示异常响应(此时响应状态码仍是2xx): 通过 message 或者 content 设置消息, 通过 data 设置数据
    """

    def __init__(self, content=None, code=0, message=None, data=None, **kwargs) -> None:
        ok = code == 0
        if ok:
            msg = message
            dat = content if data == None else data
        else:
            msg = str(content) if message == None else message
            dat = data
        rd = {"ok": ok, "code": code, "message": msg, "data": dat}
        super().__init__(rd, **kwargs)


class GoodResponse(JResponse):
    """响应体数据结构固定为 `{ ok=true; code=0; data?: any; message?: str; }`"""

    def __init__(self, content=None, message=None, data=None, **kwargs) -> None:
        super().__init__(content=content, message=message, data=data, code=0, **kwargs)


class BadResponse(JResponse):
    """响应体数据结构固定为 `{ ok=false; code=1; message?: str; data?: any; }`"""

    def __init__(self, content=None, message=None, data=None, code=1, **kwargs) -> None:
        super().__init__(content=content, message=message, data=data, code=code, **kwargs)


def make_response_data(content=None, code=0, message=None, data=None):
    ok = code == 0
    if ok:
        msg = message
        dat = content if data == None else data
    else:
        msg = content if message == None else message
        dat = data
    return {"ok": ok, "code": code, "message": msg, "data": dat}
