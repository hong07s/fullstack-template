from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from myDb import dbfind, init_db
init_db()

app = FastAPI()

# 允许跨域
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class LoginBody(BaseModel):
    username: str
    password: str


@app.post("/login")
def login(body: LoginBody):

    user = dbfind(body.username)

    if user is None or body.password != user["password"]:
        return {
            "code": 400,
            "msg": "账号或密码错误"
        }

    return {
        "code": 200,
        "msg": "登录成功",
        "role": user["role"]
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
