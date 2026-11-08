const form = document.getElementById('loginForm');
const btn = form.querySelector('button');
const msg = document.getElementById('msg');

form.addEventListener('click', async function (e) {
    e.preventDefault();   // 阻止表单默认跳转，否则页面会刷新

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    msg.textContent = '';
    msg.className = 'msg';

    if (!username || !password) {
        msg.textContent = '请输入账号和密码';
        msg.className = 'msg error';
        return;
    }

    btn.disabled = true;
    btn.textContent = '登录中…';

    try {
        const res = await fetch('http://127.0.0.1:8000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username, password: password })
        });

        const data = await res.json();

        if (data.code === 200) {
            msg.textContent = '登录成功，正在跳转…';
            msg.className = 'msg success';
            window.location.href = data.url;
        } else {
            msg.textContent = data.msg;
            msg.className = 'msg error';
        }
    } catch (err) {
        msg.textContent = '无法连接服务器，请确认后端已启动';
        msg.className = 'msg error';
        console.error(err);
    } finally {
        btn.disabled = false;
        btn.textContent = '登 录';
    }
});