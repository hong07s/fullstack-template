from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import sqlite3

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# connection = sqlite3.connect("database.db")
# cursor = connection.cursor()

class LoginBody(BaseModel):
    username: str
    password: str

@app.post("/login")
def login(body: LoginBody):
    test_user = "admin"
    test_pwd = "123456"

    if body.username == test_user and body.password == test_pwd:
        return {
            "code": 200,
            "msg": "登录成功",
            "url": "member.html"  # 登录成功后跳转到前端同目录的 member.html
        }
    else:
        return {
            "code": 400,
            "msg": "账号或密码错误"
        }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
