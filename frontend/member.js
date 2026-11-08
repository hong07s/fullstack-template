/* =========================================================
   member.js —— 项目成员首页
   目前使用「演示数据」，页面刷新后修改会丢失。
   接入后端后：把 state 的赋值改成 fetch 请求的返回结果，
   把 handleAction 里的提示改成真正的接口调用。
   ========================================================= */

// ---------- 1. 演示数据（金额单位：分） ----------

const state = {
    project: {
        name: '科研经费A',
        total: 100000,      // 1000.00 元
        available: 14000,   //  140.00 元
        frozen: 75000,      //  750.00 元
        used: 11000         //  110.00 元
    },
    applications: [
        { id: 12, purpose: '采购传感器', amount: 60000, approved: null,  actual: null,  status: 'PENDING_L1', createdAt: '2026-11-04' },
        { id: 11, purpose: '打印耗材',   amount: 12000, approved: 12000, actual: 11000, status: 'SETTLED',    createdAt: '2026-10-28' },
        { id: 10, purpose: '学术会议差旅', amount: 80000, approved: null, actual: null,  status: 'REJECTED',   createdAt: '2026-10-21' },
        { id: 9,  purpose: '实验材料',   amount: 20000, approved: null,  actual: null,  status: 'DRAFT',      createdAt: '2026-11-03' },
        { id: 8,  purpose: '设备维修',   amount: 15000, approved: 15000, actual: null,  status: 'APPROVED',   createdAt: '2026-10-30' }
    ]
};

// ---------- 2. 状态与元素 ----------

const STATUS = {
    DRAFT:      { text: '草稿',   className: 'badge-draft' },
    PENDING_L1: { text: '待审批', className: 'badge-pending' },
    APPROVED:   { text: '已批准', className: 'badge-approved' },
    REJECTED:   { text: '已拒绝', className: 'badge-rejected' },
    CANCELED:   { text: '已取消', className: 'badge-canceled' },
    SETTLED:    { text: '已结算', className: 'badge-settled' }
};

const projectName   = document.getElementById('projectName');
const userName      = document.getElementById('userName');
const userAvatar    = document.getElementById('userAvatar');
const logoutBtn     = document.getElementById('logoutBtn');

const totalBudget     = document.getElementById('totalBudget');
const availableBudget = document.getElementById('availableBudget');
const frozenBudget    = document.getElementById('frozenBudget');
const usedBudget      = document.getElementById('usedBudget');
const barAvailable    = document.getElementById('barAvailable');
const barFrozen       = document.getElementById('barFrozen');
const barUsed         = document.getElementById('barUsed');

const appTableBody = document.getElementById('appTableBody');
const emptyState   = document.getElementById('emptyState');
const newAppBtn    = document.getElementById('newAppBtn');

const appModal    = document.getElementById('appModal');
const modalTitle  = document.getElementById('modalTitle');
const appForm     = document.getElementById('appForm');
const purposeInput = document.getElementById('purposeInput');
const amountInput  = document.getElementById('amountInput');
const formError    = document.getElementById('formError');
const cancelBtn    = document.getElementById('cancelBtn');
const saveBtn      = document.getElementById('saveBtn');

const toastEl = document.getElementById('toast');

let editingId = null;   // null 表示新建，数字表示正在编辑的申请 id

// ---------- 3. 工具函数 ----------

/** 分 → 元，带千分位，例如 100000 → "1,000.00" */
function formatMoney(cents) {
    return (cents / 100).toLocaleString('zh-CN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

/** 元字符串 → 分，避免浮点误差，例如 "600.5" → 60050 */
function yuanToCents(value) {
    const [integer, decimal = ''] = value.split('.');
    return Number(integer) * 100 + Number((decimal + '00').slice(0, 2));
}

/** 防止用户输入的内容被当成 HTML 执行 */
function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (ch) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[ch];
    });
}

function showFormError(message) {
    formError.textContent = message;
}

let toastTimer = null;

function toast(message) {
    toastEl.textContent = message;
    toastEl.classList.add('show');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
        toastEl.classList.remove('show');
    }, 2800);
}

// ---------- 4. 渲染 ----------

function renderBudget() {
    const p = state.project;

    totalBudget.textContent = formatMoney(p.total);
    availableBudget.textContent = formatMoney(p.available);
    frozenBudget.textContent = formatMoney(p.frozen);
    usedBudget.textContent = formatMoney(p.used);

    const total = p.total || 1;
    barAvailable.style.width = (p.available / total * 100) + '%';
    barFrozen.style.width = (p.frozen / total * 100) + '%';
    barUsed.style.width = (p.used / total * 100) + '%';
}

/** 批准金额：只有已批准 / 已结算才显示金额 */
function formatApproved(app) {
    if ((app.status === 'APPROVED' || app.status === 'SETTLED') && app.approved !== null) {
        return formatMoney(app.approved);
    }
    return '<span class="muted">—</span>';
}

/**
 * 实际花费：
 * - 已结算：显示金额（0 元也显示 0.00）
 * - 待审批 / 已批准：显示「尚未结算」
 * - 草稿、已拒绝、已取消：显示「—」
 */
function formatActual(app) {
    if (app.status === 'SETTLED') {
        return app.actual === null ? '0.00' : formatMoney(app.actual);
    }
    if (app.status === 'PENDING_L1' || app.status === 'APPROVED') {
        return '<span class="muted">尚未结算</span>';
    }
    return '<span class="muted">—</span>';
}

/** 不同状态显示不同操作按钮 */
function renderActions(app) {
    if (app.status === 'DRAFT') {
        return (
            '<button class="link-btn" data-action="edit" data-id="' + app.id + '">编辑</button>' +
            '<button class="link-btn" data-action="submit" data-id="' + app.id + '">提交</button>'
        );
    }
    if (app.status === 'PENDING_L1' || app.status === 'APPROVED') {
        return '<button class="link-btn danger" data-action="cancel" data-id="' + app.id + '">取消</button>';
    }
    return '<button class="link-btn" data-action="view" data-id="' + app.id + '">查看</button>';
}

function renderTable() {
    const list = state.applications;

    if (list.length === 0) {
        appTableBody.innerHTML = '';
        emptyState.hidden = false;
        return;
    }

    emptyState.hidden = true;

    appTableBody.innerHTML = list.map(function (app) {
        const status = STATUS[app.status] || { text: app.status, className: '' };

        return (
            '<tr>' +
                '<td>' + app.id + '</td>' +
                '<td class="purpose">' + escapeHtml(app.purpose) + '</td>' +
                '<td class="num">' + formatMoney(app.amount) + '</td>' +
                '<td class="num">' + formatApproved(app) + '</td>' +
                '<td class="num">' + formatActual(app) + '</td>' +
                '<td><span class="badge ' + status.className + '">' + status.text + '</span></td>' +
                '<td>' + renderActions(app) + '</td>' +
            '</tr>'
        );
    }).join('');
}

function renderAll() {
    renderBudget();
    renderTable();
}

// ---------- 5. 弹窗 ----------

function openModal(app) {
    editingId = app ? app.id : null;

    modalTitle.textContent = app ? '编辑申请' : '新建申请';
    saveBtn.textContent = app ? '保存修改' : '保存草稿';
    purposeInput.value = app ? app.purpose : '';
    amountInput.value = app ? (app.amount / 100).toFixed(2) : '';
    formError.textContent = '';

    appModal.hidden = false;
    purposeInput.focus();
}

function closeModal() {
    appModal.hidden = true;
    editingId = null;
    appForm.reset();
    formError.textContent = '';
}

// ---------- 6. 操作 ----------

function handleAction(action, id) {
    const app = state.applications.find(function (item) {
        return item.id === id;
    });
    if (!app) return;

    if (action === 'edit') {
        openModal(app);
        return;
    }

    // 目前没有后端接口，先提示应该调用什么。
    // 真正实现时，这里改成 fetch(...)，成功后重新加载数据。
    const api = {
        submit: 'POST /applications/' + id + '/submit',
        cancel: 'POST /applications/' + id + '/cancel',
        view:   'GET /applications/' + id
    }[action];

    toast('演示：这里应调用 ' + api + '，由后端校验权限与经费');
}

// ---------- 7. 事件绑定 ----------

newAppBtn.addEventListener('click', function () {
    openModal(null);
});

cancelBtn.addEventListener('click', closeModal);

// 点击遮罩关闭弹窗
appModal.addEventListener('click', function (e) {
    if (e.target === appModal) {
        closeModal();
    }
});

// 按 Esc 关闭弹窗
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !appModal.hidden) {
        closeModal();
    }
});

// 保存草稿 / 保存修改
appForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const purpose = purposeInput.value.trim();
    const amountText = amountInput.value.trim();

    if (!purpose) {
        showFormError('请填写用途');
        return;
    }

    if (!/^\d+(\.\d{1,2})?$/.test(amountText)) {
        showFormError('金额格式不对：只能是数字，最多两位小数');
        return;
    }

    const amount = yuanToCents(amountText);

    if (amount <= 0) {
        showFormError('金额必须大于 0');
        return;
    }

    if (editingId !== null) {
        const app = state.applications.find(function (item) {
            return item.id === editingId;
        });
        app.purpose = purpose;
        app.amount = amount;
        toast('已保存修改（演示数据，刷新后丢失）');
    } else {
        const nextId = state.applications.reduce(function (max, item) {
            return Math.max(max, item.id);
        }, 0) + 1;

        state.applications.unshift({
            id: nextId,
            purpose: purpose,
            amount: amount,
            approved: null,
            actual: null,
            status: 'DRAFT',
            createdAt: new Date().toISOString().slice(0, 10)
        });

        toast('已保存草稿（演示数据，刷新后丢失）');
    }

    closeModal();
    renderTable();
});

// 表格里的操作按钮（事件委托）
appTableBody.addEventListener('click', function (e) {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;

    handleAction(btn.dataset.action, Number(btn.dataset.id));
});

// 退出登录
logoutBtn.addEventListener('click', function () {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    localStorage.removeItem('role');
    window.location.href = 'sign.html';
});

// ---------- 8. 初始化 ----------

(function init() {
    const name = localStorage.getItem('name') || '小林';

    userName.textContent = name;
    userAvatar.textContent = name.slice(0, 1);
    projectName.textContent = state.project.name;
    document.title = state.project.name + ' - 项目成员';

    renderAll();
})();
