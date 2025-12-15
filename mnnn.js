javascript:(function () {
  const BALANCE_SELECTOR =
    '.balance, .real-balance, #real-balance, [data-role="balance"], [data-role="real-balance"]';

  const LEADERBOARD_ROW_SELECTOR =
    '.leaderboard .you, .leaderboard .row.me, #leaderboard-me';

  const CURRENCY_DECIMALS = 2;
  const POLL_MS = 1500;

  let START_BALANCE = null;
  let lastBalance = null;
  let intervalId = null;

  function qFirst(selector, root = document) {
    return selector
      .split(',')
      .map(s => s.trim())
      .map(s => {
        try { return root.querySelector(s); } catch { return null; }
      })
      .find(Boolean) || null;
  }

  function parseMoney(text) {
    if (text == null) return NaN;
    return parseFloat(String(text).replace(/[^\d.-]/g, ''));
  }

  function formatMoney(num) {
    if (isNaN(num)) return '—';
    return num.toLocaleString(undefined, {
      minimumFractionDigits: CURRENCY_DECIMALS,
      maximumFractionDigits: CURRENCY_DECIMALS
    });
  }

  function updateUI(el, balance, profit) {
    let badge = el?.querySelector('.balance-live-badge');

    if (!badge && el) {
      badge = document.createElement('span');
      badge.className = 'balance-live-badge';
      Object.assign(badge.style, {
        padding: '4px 8px',
        marginLeft: '8px',
        borderRadius: '8px',
        fontSize: '13px',
        boxShadow: '0 1px 3px rgba(0,0,0,.15)',
        display: 'inline-block'
      });
      el.appendChild(badge);
    }

    const sign = profit > 0 ? '+' : profit < 0 ? '−' : '';
    const text = Real: ${formatMoney(balance)} (${sign}${formatMoney(Math.abs(profit))});

    if (badge) badge.textContent = text;

    const style =
      profit > 0
        ? ['#2ecc71', '#eafaf0', '#117a3a']
        : profit < 0
        ? ['#e74c3c', '#fff5f5', '#a40f17']
        : ['#ccc', '#fff', '#111'];

    if (badge) {
      badge.style.border = 1px solid ${style[0]};
      badge.style.background = style[1];
      badge.style.color = style[2];
    }
  }

  function floatingBadge(balance, profit) {
    let box = document.getElementById('quotex-real-live-badge');
    if (!box) {
      box = document.createElement('div');
      box.id = 'quotex-real-live-badge';
      Object.assign(box.style, {
        position: 'fixed',
        right: '12px',
        bottom: '12px',
        zIndex: 999999,
        padding: '8px 12px',
        borderRadius: '10px',
        background: '#fff',
        fontSize: '14px',
        boxShadow: '0 4px 12px rgba(0,0,0,.25)'
      });
      document.body.appendChild(box);
    }

    box.textContent =
      REAL BALANCE: ${formatMoney(balance)} | P/L ${profit >= 0 ? '+' : ''}${formatMoney(profit)};

    box.style.border =
      profit > 0 ? '2px solid #2ecc71' :
      profit < 0 ? '2px solid #e74c3c' :
      '1px solid #ccc';
  }

  function start() {
    if (intervalId) return;

    intervalId = setInterval(() => {
      const balEl = qFirst(BALANCE_SELECTOR);
      if (!balEl) return;

      const current = parseMoney(balEl.textContent);
      if (isNaN(current)) return;

      if (START_BALANCE === null) {
        START_BALANCE = current;
        console.log('🔒 REAL START BALANCE LOCKED:', START_BALANCE);
      }

      if (lastBalance === null) lastBalance = current;

      const profit = +(current - START_BALANCE).toFixed(CURRENCY_DECIMALS);
      const lbEl = qFirst(LEADERBOARD_ROW_SELECTOR);

      if (lbEl) updateUI(lbEl, current, profit);
      else floatingBadge(current, profit);

      lastBalance = current;
    }, POLL_MS);
  }

  start();

  window.quitQuotexRealLive = function () {
    clearInterval(intervalId);
    intervalId = null;
    document.getElementById('quotex-real-live-badge')?.remove();
    document.querySelectorAll('.balance-live-badge').forEach(e => e.remove());
    console.log('🛑 Real balance live monitor stopped.');
  };

  console.log('✅ Real balance live monitor started.');
})();