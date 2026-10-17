const state = {
  page: "overview",
  budgetView: "list",
  overviewMonth: "2026-10",
  budget: {
    total: 2800,
    spent: 1846.5,
    history: [
      { key: "2026-01", label: "January", spent: 1238 },
      { key: "2026-02", label: "February", spent: 1312 },
      { key: "2026-03", label: "March", spent: 1380 },
      { key: "2026-04", label: "April", spent: 1455 },
      { key: "2026-05", label: "May", spent: 1520 },
      { key: "2026-06", label: "June", spent: 1592 },
      { key: "2026-07", label: "July", spent: 1661 },
      { key: "2026-08", label: "August", spent: 1717 },
      { key: "2026-09", label: "September", spent: 1789 }
    ],
    categories: [
      { name: "Groceries", icon: "✳", className: "grocery", spent: 426.8, limit: 600 },
      { name: "Home & bills", icon: "⌂", className: "home", spent: 714.2, limit: 950 },
      { name: "Travel", icon: "↗", className: "travel", spent: 285.5, limit: 500 },
      { name: "Little joys", icon: "♡", className: "fun", spent: 420, limit: 750 }
    ],
    income: [
      { id: "salary", name: "Salary", amount: 2350 },
      { id: "side", name: "Side hustle", amount: 320 },
      { id: "transfers", name: "Transfers in", amount: 145 }
    ],
    balance: 1240,
    goal: 300
  },
  savedDeals: new Set(),
  transactions: [
    { name: "Weekly shop · Green Basket", category: "Groceries", amount: 64.2, date: "Today" },
    { name: "Electricity · Bright Energy", category: "Home & bills", amount: 82.4, date: "Yesterday" },
    { name: "Train to Brighton", category: "Travel", amount: 31.5, date: "October 14" }
  ],
  ious: [
    { name: "Maya Chen", detail: "Dinner · October 12", amount: 28.5, direction: "in" },
    { name: "You owe Alex", detail: "Cab home · October 10", amount: 16, direction: "out" }
  ]
};

const deals = [
  { brand: "FreshMart", logo: "F", logoClass: "", title: "£5 off your next shop", detail: "Spend £40 or more · Ends October 31", value: "£5 back", type: "Groceries" },
  { brand: "Market Lane", logo: "M", logoClass: "rose", title: "Double loyalty points", detail: "On fruit & veg this week", value: "2× points", type: "Groceries" },
  { brand: "RailHop", logo: "R", logoClass: "blue", title: "Save 20% on advance fares", detail: "Selected off-peak journeys", value: "20% off", type: "Train" },
  { brand: "FlyLite", logo: "✈", logoClass: "yellow", title: "£18 off your next flight", detail: "For trips booked this month", value: "£18 off", type: "Flights" }
];

const money = value => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(value);
const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
const content = document.querySelector("#page-content");
const modal = document.querySelector("#app-modal");

function header(eyebrow, title, note, actionLabel, actionType) {
  return `<div class="page-heading"><div><div class="eyebrow">${eyebrow}</div><h1>${title}</h1>${note ? `<p class="heading-note">${note}</p>` : ""}</div>${actionLabel ? `<button class="button button-primary" data-action="${actionType}">＋ ${actionLabel}</button>` : ""}</div>`;
}

function categoriesMarkup(compact = false) {
  return `<div class="category-list">${state.budget.categories.map(item => `
    <div class="category-row ${item.className}">
      <span class="category-icon">${item.icon}</span>
      <div class="category-info"><div class="category-name-row"><span class="category-name">${escapeHTML(item.name)}</span><span class="category-spend">${money(item.spent)}</span></div><div class="category-bar"><span style="width:${Math.min(100, item.spent / item.limit * 100)}%"></span></div></div>
      <span class="category-limit">${money(item.limit)}${compact ? "" : " limit"}</span>
    </div>`).join("")}</div>`;
}

function dealsMarkup() {
  return deals.map((deal, index) => `
    <article class="offer-card">
      <div class="offer-top"><span class="deal-logo ${deal.logoClass}">${deal.logo}</span><span class="offer-tag">${deal.type}</span></div>
      <h3>${deal.title}</h3><p>${deal.detail}</p>
      <div class="offer-footer"><small>${deal.brand} · ${deal.value}</small><button class="button button-small ${state.savedDeals.has(index) ? "button-lime" : ""}" data-action="save-deal" data-index="${index}">${state.savedDeals.has(index) ? "Saved ✓" : "Save deal"}</button></div>
    </article>`).join("");
}

// Past months are fixed sample data; the current month is whatever has been spent so far.
function budgetMonths() {
  return [...state.budget.history, { key: "2026-10", label: "October", spent: state.budget.spent, current: true }];
}

function overviewPage() {
  const months = budgetMonths();
  const index = Math.max(0, months.findIndex(item => item.key === state.overviewMonth));
  const month = months[index];
  const previous = months[index - 1];
  const percentage = Math.round(month.spent / state.budget.total * 100);
  const left = state.budget.total - month.spent;
  const change = previous ? (month.spent - previous.spent) / previous.spent * 100 : null;
  const peak = Math.max(1, ...months.map(item => item.spent));
  const progressNote = month.current ? (left < 0 ? "Over your plan" : "Looking good so far") : "Month closed";
  const leftNote = left < 0 ? `${money(-left)} over budget` : `${money(left)} ${month.current ? "left to spend" : "under budget"}`;
  const status = left < 0 ? "↘ Over budget" : month.current ? "↗ On track" : "✓ Under budget";
  return `${header("SATURDAY, OCTOBER 17", "Every bill, one account.", "Here’s your money, all in one place.", "Add expense", "expense")}
    <div class="dashboard-grid">
      <article class="card balance-card">
        <div class="balance-top"><span class="eyebrow">${month.label.toUpperCase()} SPENDING</span><select class="period-select" id="overview-month" aria-label="Budget month">${[...months].reverse().map(item => `<option value="${item.key}"${item.key === month.key ? " selected" : ""}>${item.current ? "This month" : item.label}</option>`).join("")}</select></div>
        <div class="balance-amount">${money(month.spent)}</div><p class="balance-caption">of ${money(state.budget.total)} monthly budget</p>
        <div class="balance-progress"><div class="progress-meta"><span>${progressNote}</span><strong>${percentage}%</strong></div><div class="progress-track"><div class="progress-fill" style="width:${Math.min(100, percentage)}%"></div></div><div class="balance-foot"><span>${leftNote}</span><strong>${status}</strong></div></div>
      </article>
      <article class="card stat-card">
        <div class="card-title-row"><div><div class="card-title">Spending over time</div><p class="card-subtitle">Your last ${months.length} months</p></div>${change === null ? "" : `<span class="month-change${change > 0 ? " up" : ""}" title="Compared with ${previous.label}">${change > 0 ? "↑" : "↓"} ${Math.abs(change).toFixed(1)}%</span>`}</div>
        <div class="chart-total">${money(month.spent)}<span>${month.current ? "this month" : `in ${month.label}`}</span></div>
        <div class="chart" aria-label="Spending chart for the last ${months.length} months">${months.map(item => `<div class="chart-column"><div class="chart-bar ${item.key === month.key ? "highlight" : ""}" style="height:${Math.round(item.spent / peak * 90)}%"></div></div>`).join("")}</div>
        <div class="chart-labels">${months.map(item => `<span title="${item.label}">${item.label.slice(0, 3)}</span>`).join("")}</div>
      </article>
      <section>
        <div class="section-heading"><h2>Your budget, at a glance</h2><button class="text-link" data-page="budget">All categories ↗</button></div>
        <article class="card category-card">${categoriesMarkup(true)}</article>
      </section>
      <section>
        <div class="section-heading"><h2>Good things you could save on</h2><button class="text-link" data-page="deals">See all deals ↗</button></div>
        <article class="card deal-card">
          <div class="deal-list">${deals.slice(0, 3).map(deal => `<div class="deal-item"><span class="deal-logo ${deal.logoClass}">${deal.logo}</span><span class="deal-copy"><strong>${deal.title}</strong><small>${deal.brand} · ${deal.detail.split(" · ")[0]}</small></span><span class="deal-value">${deal.value}</span></div>`).join("")}</div>
        </article>
      </section>
      <section>
        <div class="section-heading"><h2>Something to look forward to</h2><button class="text-link" data-page="trips">Your goals ↗</button></div>
        <article class="card trip-card"><span class="trip-date"><strong>22</strong><small>NOV</small></span><span class="trip-copy"><strong>Cosy cabin weekend</strong><small>Saved ${money(420)} of ${money(900)}</small></span><span class="trip-progress"><span style="width:47%;display:block"></span></span></article>
      </section>
      <section>
        <div class="section-heading"><h2>Shared home</h2><button class="text-link" data-page="home">Open home ↗</button></div>
        <article class="card home-card"><div class="home-main"><div class="home-members"><span class="avatar">JD</span><span class="avatar avatar-lilac">MC</span><span class="avatar avatar-blue">AR</span></div><span class="home-copy"><strong>Willow House</strong><small>3 people · Bills are looking good</small></span><span class="bill-total">${money(218)}<small>due this week</small></span></div></article>
      </section>
    </div>`;
}

function budgetPage() {
  const flow = state.budgetView === "flow";
  return `${header("YOUR MONEY, YOUR PACE", "Monthly budget", "A simple plan for where your money goes.", "Add expense", "expense")}
    <div class="view-toolbar"><div class="view-switch" role="group" aria-label="Budget view"><button type="button" data-action="budget-view" data-view="list" aria-pressed="${!flow}">Categories</button><button type="button" data-action="budget-view" data-view="flow" aria-pressed="${flow}">Money flow</button></div>${flow ? `<span class="view-hint">Move your cursor over the flow · click a stream to follow it</span>` : ""}</div>
    ${flow ? flowMarkup() : budgetListMarkup()}`;
}

function budgetListMarkup() {
  return `<div class="view-grid"><div>
      <article class="card balance-card"><div class="balance-top"><span class="eyebrow">OCTOBER SPENDING</span><span class="eyebrow">MONTHLY PLAN</span></div><div class="balance-amount">${money(state.budget.spent)}</div><p class="balance-caption">of ${money(state.budget.total)} planned · ${money(state.budget.total - state.budget.spent)} left</p><div class="balance-progress"><div class="progress-track"><div class="progress-fill" style="width:${Math.min(100, state.budget.spent / state.budget.total * 100)}%"></div></div><div class="balance-foot"><span>${Math.round(state.budget.spent / state.budget.total * 100)}% of your monthly plan</span><strong>↗ On track</strong></div></div></article>
      <div class="section-heading"><h2>Categories</h2><button class="text-link" data-action="edit-budget">Edit monthly plan</button></div>
      <article class="card panel">${state.budget.categories.map(item => `<div class="budget-line ${item.className}"><strong><span class="budget-icon">${item.icon}</span>${escapeHTML(item.name)}</strong><small>${money(item.spent)} / ${money(item.limit)}</small><div class="category-bar"><span style="width:${Math.min(100, item.spent / item.limit * 100)}%"></span></div></div>`).join("")}</article>
    </div><div>
      <article class="card panel"><div class="panel-heading"><div><h2>Recent activity</h2><p>Your latest added expenses.</p></div></div>${state.transactions.map(tx => `<div class="iou-row"><span class="deal-logo">${tx.category === "Groceries" ? "✳" : tx.category === "Travel" ? "↗" : "⌂"}</span><span class="iou-copy"><strong>${escapeHTML(tx.name)}</strong><small>${escapeHTML(tx.category)} · ${escapeHTML(tx.date)}</small></span><span class="iou-amount">−${money(tx.amount)}</span></div>`).join("")}</article>
      <article class="card panel"><div class="panel-heading"><div><h2>A gentler nudge</h2><p>You're spending less than last month.</p></div><span class="deal-logo">✳</span></div><p>Your groceries are at ${money(state.budget.categories[0].spent)} this month, with plenty of room left in the plan. Nice one.</p></article>
    </div></div>`;
}

// Money flow: income and savings on the left, this month in the middle, spending on the right.
const flowView = { shown: null, selected: null, raf: 0, observer: null, pointer: null, anchors: [], nodeW: 13 };
// The lens scales up the blocks and labels near the cursor; at the radius edge the scale is back to 1.
const lens = { radius: 150, maxScale: 1.5 };
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const wholePounds = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", minimumFractionDigits: 0, maximumFractionDigits: 0 });
const pounds = value => wholePounds.format(value);
const ribbon = (x0, a0, b0, x1, a1, b1) => {
  const xm = x0 + (x1 - x0) * .5;
  return `M${x0},${a0}C${xm},${a0} ${xm},${a1} ${x1},${a1}L${x1},${b1}C${xm},${b1} ${xm},${b0} ${x0},${b0}Z`;
};

function flowData() {
  const data = { balance: state.budget.balance, goal: state.budget.goal };
  state.budget.income.forEach(item => { data[item.id] = item.amount; });
  state.budget.categories.forEach(item => { data[item.className] = item.spent; });
  return data;
}

function setFlowValue(key, value) {
  const income = state.budget.income.find(item => item.id === key);
  const category = state.budget.categories.find(item => item.className === key);
  if (income) income.amount = value;
  else if (category) {
    category.spent = value;
    state.budget.spent = state.budget.categories.reduce((sum, item) => sum + item.spent, 0);
  } else if (key === "balance" || key === "goal") state.budget[key] = value;
}

function flowMarkup() {
  const swatch = color => `<i class="flow-swatch" style="background:${color}"></i>`;
  const row = (key, label, value, color) => `<div class="flow-row">${swatch(color)}<label for="flow-${key}">${escapeHTML(label)}</label><span class="flow-money"><span>£</span><input id="flow-${key}" data-flow-key="${key}" type="number" inputmode="decimal" min="0" step="any" value="${+value.toFixed(2)}"></span></div>`;
  const groups = [
    ["Money in", state.budget.income.map(item => row(item.id, item.name, item.amount, "var(--c-income)"))],
    ["Money out", state.budget.categories.map(item => row(item.className, item.name, item.spent, `var(--c-${item.className})`))],
    ["Account and goal", [row("balance", "Already in your account", state.budget.balance, "var(--c-balance)"), row("goal", "Monthly savings goal", state.budget.goal, "var(--c-jar)")]]
  ];
  return `<div class="flow-view">
    <article class="card flow-card">
      <div class="flow-summary" aria-live="polite"><div class="flow-stat"><span>Money in</span><b id="flow-in"></b></div><div class="flow-stat"><span>Spent</span><b id="flow-out"></b></div><div class="flow-stat"><span>Left after spending</span><b id="flow-net"></b></div><div class="flow-chip" id="flow-chip"><i></i><span></span></div></div>
      <div class="flow-cols" aria-hidden="true"><span>Money in</span><span>This month</span><span>Money out</span></div>
      <div class="flow" id="flow"></div>
      <div class="flow-legend"><span>${swatch("var(--c-income)")}Income</span><span>${swatch("var(--c-balance)")}Already in your account</span><span>${swatch("var(--c-jar)")}Savings jar, goal met</span><span>${swatch("repeating-linear-gradient(135deg,var(--ghost-bg) 0 2px,var(--ghost) 2px 4px)")}Savings jar, waiting until income covers it</span></div>
    </article>
    <article class="card panel flow-editor"><div class="panel-heading"><div><h2>Change the numbers</h2><p>The savings jar fills in with colour once this month's income minus spending reaches your goal. Until then it stays grey.</p></div></div><div class="flow-groups">${groups.map(([title, rows]) => `<div class="flow-group"><h3>${title}</h3>${rows.join("")}</div>`).join("")}</div></article>
  </div>`;
}

function drawFlow(d) {
  const flow = document.querySelector("#flow");
  if (!flow) return false;
  const W = Math.max(300, flow.clientWidth);
  const narrow = W < 560;
  const labelW = Math.round(Math.min(170, Math.max(84, W * .2)));
  const nodeW = narrow ? 9 : 13, centerW = narrow ? 12 : 18;
  const xL = labelW, xC = Math.round(W / 2 - centerW / 2), xR = W - labelW - nodeW;

  const incSum = state.budget.income.reduce((sum, item) => sum + d[item.id], 0);
  const expSum = state.budget.categories.reduce((sum, item) => sum + d[item.className], 0);
  const T = incSum + d.balance;
  const net = incSum - expSum;
  const goal = Math.max(0, d.goal);
  const met = goal > 0 && net >= goal;
  const saved = met ? goal : 0;
  const remaining = Math.max(0, T - expSum - saved);
  const over = Math.max(0, expSum - T);
  const C = Math.max(T, expSum + saved + remaining);

  const k = (narrow ? 300 : 380) / Math.max(1, C + (met ? 0 : goal));
  const minSlot = narrow ? 40 : 44, gap = narrow ? 8 : 10, top = 58;

  const left = state.budget.income.filter(item => d[item.id] > .5).sort((a, b) => d[b.id] - d[a.id])
    .map(item => ({ id: item.id, v: d[item.id], label: item.name, color: "var(--c-income)" }));
  if (d.balance > .5) left.push({ id: "balance", v: d.balance, label: narrow ? "In your account" : "Already in your account", color: "var(--c-balance)" });

  const right = state.budget.categories.filter(item => d[item.className] > .5).sort((a, b) => d[b.className] - d[a.className]).map(item => {
    const v = d[item.className];
    return { id: item.className, v, label: item.name, color: `var(--c-${item.className})`, sub: item.limit > 0 ? `${Math.round(v / item.limit * 100)}% of plan` : "", warn: v > item.limit };
  });
  if (remaining > .5) right.push({ id: "remain", v: remaining, label: narrow ? "Stays in account" : "Stays in your account", color: "var(--c-balance)" });
  if (goal > .5) right.push({ id: "jar", v: goal, label: "Savings jar", ghost: !met, color: met ? "var(--c-jar)" : "url(#flow-hatch)", sub: met ? "Goal met" : `${pounds(goal - Math.max(0, net))} short` });

  const place = list => {
    list.forEach(n => { n.h = Math.max(n.v * k, 3); n.slot = Math.max(n.h, minSlot); });
    return list.reduce((sum, n) => sum + n.slot, 0) + gap * Math.max(0, list.length - 1);
  };
  const hL = place(left), hR = place(right);
  const ghostH = met ? 0 : goal * k;
  const centerH = C * k + ghostH;
  const inner = Math.max(hL, hR, centerH);
  const H = Math.ceil(top + inner + 12);
  const stack = (list, h) => {
    let y = top + (inner - h) / 2;
    list.forEach(n => { n.y = y + (n.slot - n.h) / 2; n.cy = y + n.slot / 2; y += n.slot + gap; });
  };
  stack(left, hL);
  stack(right, hR);
  const cy = top + (inner - centerH) / 2;

  let ribs = "", nodes = "", labels = "";
  // Ribbons are a translucent band of each colour; every stream carries its id so it can be followed on its own.
  let offset = cy;
  left.forEach(n => {
    const h = n.v * k;
    ribs += `<path class="rib" data-id="${n.id}" d="${ribbon(xL + nodeW, n.y, n.y + n.h, xC, offset, offset + h)}" style="fill:${n.color}"/>`;
    offset += h;
  });
  offset = cy;
  right.forEach(n => {
    if (n.ghost) return;
    const h = n.v * k;
    ribs += `<path class="rib" data-id="${n.id}" d="${ribbon(xC + centerW, offset, offset + h, xR, n.y, n.y + n.h)}" style="fill:${n.color}"/>`;
    offset += h;
  });

  // Ghost: the part of the goal this month's income does not cover yet.
  const jar = right.find(n => n.id === "jar");
  if (jar && jar.ghost) {
    const gy = cy + C * k;
    ribs += `<path class="rib" data-id="jar" d="${ribbon(xC + centerW, gy, gy + ghostH, xR, jar.y, jar.y + jar.h)}" style="fill:var(--ghost)"/>`;
    nodes += `<rect class="node" data-id="jar" x="${xC}" y="${gy}" width="${centerW}" height="${ghostH}" style="fill:url(#flow-hatch)"/>`;
  }

  // Solid blocks: square where a ribbon meets them, rounded only on the outer edge.
  const block = (n, x, side) => {
    const r = Math.min(5, n.h / 2, nodeW / 2), y = n.y, h = n.h, w = nodeW;
    const path = side === "l"
      ? `M${x + w},${y}H${x + r}Q${x},${y} ${x},${y + r}V${y + h - r}Q${x},${y + h} ${x + r},${y + h}H${x + w}Z`
      : `M${x},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h - r}Q${x + w},${y + h} ${x + w - r},${y + h}H${x}Z`;
    return `<path class="node ${side}" data-id="${n.id}" d="${path}" style="fill:${n.color}"/>`;
  };
  left.forEach(n => { nodes += block(n, xL, "l"); });
  right.forEach(n => { nodes += block(n, xR, "r"); });
  nodes += `<rect x="${xC}" y="${cy}" width="${centerW}" height="${C * k}" style="fill:var(--c-income)"/>`;
  if (over > .5) nodes += `<rect x="${xC}" y="${cy + T * k}" width="${centerW}" height="${over * k}" style="fill:var(--c-over)"/>`;

  const label = (n, side) => `<button type="button" class="lab ${side}${n.ghost ? " ghost" : ""}" data-id="${n.id}" aria-pressed="false" style="${side === "l" ? `right:${W - xL + 2}px` : `left:${xR + nodeW + 2}px`};max-width:${labelW - 2}px;top:${n.cy}px"><span class="n" title="${escapeHTML(n.label)}">${escapeHTML(n.label)}</span><span class="a">${pounds(n.v)}</span>${n.sub ? `<span class="s${n.warn ? " warn" : ""}">${n.sub}</span>` : ""}</button>`;
  left.forEach(n => { labels += label(n, "l"); });
  right.forEach(n => { labels += label(n, "r"); });
  labels += `<div class="lab c" style="left:${xC + centerW / 2}px;top:${cy - 8}px"><span class="n">Available</span><span class="a">${pounds(T)}</span></div>`;

  flowView.nodeW = nodeW;
  flowView.narrow = narrow;
  flowView.anchors = [
    ...left.map(n => ({ id: n.id, x0: 0, x1: xL + nodeW, y0: n.cy - n.slot / 2, y1: n.cy + n.slot / 2 })),
    ...right.map(n => ({ id: n.id, x0: xR, x1: W, y0: n.cy - n.slot / 2, y1: n.cy + n.slot / 2 }))
  ];

  flow.style.height = `${H}px`;
  flow.innerHTML = `<svg viewBox="0 0 ${W} ${H}" height="${H}" role="img" aria-label="Money flow: ${pounds(incSum)} income and ${pounds(d.balance)} already in your account, ${pounds(expSum)} spent, savings goal ${met ? "met" : "not yet met"}."><defs><pattern id="flow-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="7" height="7" style="fill:var(--ghost-bg)"/><rect width="2.5" height="7" style="fill:var(--ghost)"/></pattern></defs><g>${ribs}</g><g>${nodes}</g></svg>${labels}`;
  // Freshly drawn nodes take their focus and lens state without animating in.
  flow.classList.add("drawing");
  applyFlowFocus();
  applyLens();
  void flow.offsetHeight;
  flow.classList.remove("drawing");

  document.querySelector("#flow-in").textContent = money(incSum);
  document.querySelector("#flow-out").textContent = money(expSum);
  document.querySelector("#flow-net").textContent = `${net < 0 ? "−" : ""}${money(Math.abs(net))}`;
  const chip = document.querySelector("#flow-chip");
  const [kind, icon, text] = over > .5 ? ["warn", "!", `Spending is ${pounds(over)} more than you have`]
    : goal <= .5 ? ["hold", "–", "No savings goal set"]
    : met ? ["ok", "✓", `${pounds(goal)} set aside in your Savings jar`]
    : ["hold", "…", `${pounds(goal - Math.max(0, net))} short of your ${pounds(goal)} goal`];
  chip.className = `flow-chip ${kind}`;
  chip.querySelector("i").textContent = icon;
  chip.querySelector("span").textContent = text;
  return true;
}

// Only the selected stream stays lit: its ribbon, its block and its label. Everything else fades back.
function applyFlowFocus() {
  const flow = document.querySelector("#flow");
  if (!flow) return;
  if (flowView.selected && !flow.querySelector(`[data-id="${flowView.selected}"]`)) flowView.selected = null;
  const selected = flowView.selected;
  flow.classList.toggle("focusing", Boolean(selected));
  flow.querySelectorAll("[data-id]").forEach(node => node.classList.toggle("on", node.dataset.id === selected));
  flow.querySelectorAll("button.lab").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.id === selected)));
}

// Proximity is the distance from the cursor to each stream's block-and-label area, eased from 1 to 0 across the lens radius.
// Blocks only grow outward from where their ribbon meets them; labels grow away from the chart and slide out with the block.
function applyLens() {
  const flow = document.querySelector("#flow");
  if (!flow) return;
  const point = flowView.pointer;
  const scales = {};
  if (point) flowView.anchors.forEach(area => {
    const dx = Math.max(area.x0 - point.x, 0, point.x - area.x1);
    const dy = Math.max(area.y0 - point.y, 0, point.y - area.y1);
    const t = Math.max(0, 1 - Math.hypot(dx, dy) / lens.radius);
    scales[area.id] = 1 + (lens.maxScale - 1) * t * t;
  });
  flow.classList.toggle("resting", !point);
  flow.querySelectorAll(".node.l, .node.r").forEach(node => { node.style.scale = `${scales[node.dataset.id] || 1} 1`; });
  ["l", "r"].forEach(side => {
    const labels = [...flow.querySelectorAll(`button.lab.${side}`)]
      .map(node => ({ node, y: parseFloat(node.style.top), h: node.offsetHeight, s: scales[node.dataset.id] || 1 }))
      .sort((a, b) => a.y - b.y);
    // Neighbours make room for the biggest label, like icons in a dock, so magnified text never overlaps.
    const pivot = labels.reduce((best, label, i) => label.s > labels[best].s ? i : best, 0);
    const room = (a, b) => (a.h * a.s + b.h * b.s) / 2 + Math.min(b.y - a.y - (a.h + b.h) / 2, 2);
    labels.forEach(label => { label.at = label.y; });
    for (let i = pivot + 1; i < labels.length; i++) labels[i].at = Math.max(labels[i].y, labels[i - 1].at + room(labels[i - 1], labels[i]));
    for (let i = pivot - 1; i >= 0; i--) labels[i].at = Math.min(labels[i].y, labels[i + 1].at - room(labels[i], labels[i + 1]));
    labels.forEach(({ node, s, y, at }) => {
      node.style.scale = s;
      node.style.translate = `${(s - 1) * flowView.nodeW * (side === "l" ? -1 : 1)}px calc(${at - y}px - 50%)`;
      node.style.zIndex = Math.round(s * 100);
    });
  });
}

function animateFlow(next) {
  cancelAnimationFrame(flowView.raf);
  const from = flowView.shown;
  if (!from || reduceMotion) {
    flowView.shown = { ...next };
    drawFlow(flowView.shown);
    return;
  }
  const start = performance.now();
  const step = now => {
    const t = Math.min(1, (now - start) / 520), eased = 1 - Math.pow(1 - t, 3);
    flowView.shown = Object.fromEntries(Object.keys(next).map(key => [key, (from[key] ?? 0) + (next[key] - (from[key] ?? 0)) * eased]));
    if (drawFlow(flowView.shown) && t < 1) flowView.raf = requestAnimationFrame(step);
  };
  step(start);
}

function mountBudget() {
  const flow = document.querySelector("#flow");
  if (!flow) return;
  flow.addEventListener("click", event => {
    const id = event.target.closest("[data-id]")?.dataset.id || null;
    flowView.selected = id === flowView.selected ? null : id;
    applyFlowFocus();
  });
  flow.addEventListener("keydown", event => {
    if (event.key !== "Escape" || !flowView.selected) return;
    flowView.selected = null;
    applyFlowFocus();
  });
  flowView.pointer = null;
  flow.addEventListener("pointermove", event => {
    // Touch has no hover, and narrow charts have no room for magnified labels.
    if (event.pointerType === "touch" || flowView.narrow) return;
    const box = flow.getBoundingClientRect();
    flowView.pointer = { x: event.clientX - box.left, y: event.clientY - box.top };
    applyLens();
  });
  flow.addEventListener("pointerleave", () => {
    flowView.pointer = null;
    applyLens();
  });
  animateFlow(flowData());
  let width = flow.clientWidth;
  flowView.observer = new ResizeObserver(() => {
    if (flow.clientWidth === width) return;
    width = flow.clientWidth;
    drawFlow(flowView.shown);
  });
  flowView.observer.observe(flow);
}

function dealsPage() {
  return `${header("SMALL WINS ADD UP", "Deals & rewards", "A few useful ways to keep more in your pocket.", "Find deals", "search-deals")}
    <div class="view-grid"><div><div class="section-heading" style="margin-top:0"><h2>Picked for your everyday</h2><span class="eyebrow">4 NEW THIS WEEK</span></div><div class="deal-grid">${dealsMarkup()}</div></div>
    <div><article class="card panel"><div class="panel-heading"><div><h2>Your cashback pot</h2><p>Rewards you’ve collected so far.</p></div><span class="deal-logo">£</span></div><div class="chart-total">${money(23.4)}<span>ready to use</span></div><p>Keep saving eligible offers to grow your rewards pot.</p><button class="button button-lime button-small" data-action="cashback">View rewards</button></article>
    <article class="card panel"><div class="panel-heading"><div><h2>Travel without the full fare</h2><p>Fare offers for your next journey.</p></div></div>${deals.filter(d => d.type !== "Groceries").map(d => `<div class="deal-item" style="margin:13px 0"><span class="deal-logo ${d.logoClass}">${d.logo}</span><span class="deal-copy"><strong>${d.title}</strong><small>${d.brand} · ${d.detail}</small></span><span class="deal-value">${d.value}</span></div>`).join("")}</article>
    <p class="fine-print">Offers shown are sample content for this prototype. Availability, eligibility and terms are not verified.</p></div></div>`;
}

function tripsPage() {
  return `${header("SAVE FOR THE GOOD STUFF", "Trips & little goals", "Plan a holiday together or set aside a bit each month.", "New savings goal", "goal")}
    <div class="view-grid"><div><div class="section-heading" style="margin-top:0"><h2>Holiday savings</h2><button class="text-link" data-action="invite">Invite someone ↗</button></div>
      <article class="card goal-card"><div class="goal-top"><div class="goal-title"><span class="deal-logo">✈</span><span><strong>Cosy cabin weekend</strong><small>Shared with Maya & Alex · November 22–24</small></span></div><span class="offer-tag">On track</span></div><div class="goal-amount">${money(420)} <small>of ${money(900)}</small></div><div class="goal-progress"><span style="width:47%"></span></div><div class="goal-foot"><span>47% saved</span><span>${money(480)} to go</span></div><div class="section-heading"><span class="card-title">Group contributions</span><button class="text-link" data-action="contribute">Add money</button></div><div class="member-list"><div class="member-row"><span class="avatar">JD</span><span class="member-name">Jamie Davis<small>Your contribution</small></span><strong>${money(180)}</strong></div><div class="member-row"><span class="avatar avatar-lilac">MC</span><span class="member-name">Maya Chen<small>Added October 13</small></span><strong>${money(140)}</strong></div><div class="member-row"><span class="avatar avatar-blue">AR</span><span class="member-name">Alex Rivera<small>Added October 15</small></span><strong>${money(100)}</strong></div></div></article>
      <article class="card panel"><div class="panel-heading"><div><h2>On your wish list</h2><p>Keep ideas here while you plan.</p></div><button class="button button-small" data-action="destination">＋ Add an idea</button></div><div class="empty-note">That spontaneous long weekend? Start a goal and make it happen, one small saving at a time.</div></article>
    </div><div><article class="card panel"><div class="panel-heading"><div><h2>Fare finder</h2><p>Sample deals for getting away.</p></div><span class="deal-logo blue">↗</span></div>${deals.filter(d => d.type !== "Groceries").map(d => `<div class="deal-item" style="margin:14px 0"><span class="deal-logo ${d.logoClass}">${d.logo}</span><span class="deal-copy"><strong>${d.title}</strong><small>${d.brand} · ${d.detail}</small></span></div>`).join("")}</article><p class="fine-print">Savings goals are planning tools only. No payments or bookings are made in this demo.</p></div></div>`;
}

function homePage() {
  return `${header("LIFE TOGETHER", "Willow House", "Shared bills, a little less shared-stress.", "Invite flatmate", "invite")}
    <div class="view-grid"><div>
      <article class="card panel"><div class="panel-heading"><div><h2>October shared bills</h2><p>Everyone can see what's due and what's covered.</p></div><span class="offer-tag">3 flatmates</span></div>
      <div class="home-main" style="margin-bottom:15px"><div class="home-members"><span class="avatar">JD</span><span class="avatar avatar-lilac">MC</span><span class="avatar avatar-blue">AR</span></div><span class="home-copy"><strong>Shared total this month</strong><small>Your share: ${money(72.67)}</small></span><span class="bill-total">${money(218)}<small>all bills</small></span></div>
      ${[["Electricity", "Bright Energy · Due October 21", 86, "Due soon"], ["Wi-Fi", "ConnectNow · Paid October 4", 42, "Paid"], ["Water", "City Water · Paid October 8", 90, "Paid"]].map(b => `<div class="bill-row"><strong>${b[0]}</strong><span class="bill-status">${b[3]}</span><small>${b[1]}</small><strong>${money(b[2])}</strong></div>`).join("")}
      <div class="section-heading"><span class="card-title">This month’s split</span><button class="text-link" data-action="add-bill">＋ Add a bill</button></div>
      ${[["Jamie Davis", 72.67, ""], ["Maya Chen", 72.67, "avatar-lilac"], ["Alex Rivera", 72.66, "avatar-blue"]].map(m => `<div class="member-row" style="padding:7px 0"><span class="avatar ${m[2]}">${m[0].split(" ").map(s=>s[0]).join("")}</span><span class="member-name">${m[0]}<small>Equal share</small></span><strong>${money(m[1])}</strong></div>`).join("")}</article>
    </div><div>    <article class="card panel"><div class="panel-heading"><div><h2>Housemates</h2><p>Everyone in the same place.</p></div><button class="button button-small" data-action="invite">＋ Invite</button></div><div class="member-list"><div class="member-row"><span class="avatar">JD</span><span class="member-name">Jamie Davis<small>You · Admin</small></span></div><div class="member-row"><span class="avatar avatar-lilac">MC</span><span class="member-name">Maya Chen<small>Joined September 2</small></span></div><div class="member-row"><span class="avatar avatar-blue">AR</span><span class="member-name">Alex Rivera<small>Joined September 4</small></span></div></div></article>
      <article class="card panel"><div class="panel-heading"><div><h2>Room to improve</h2><p>Shared bills can be easier to manage.</p></div><span class="deal-logo">✳</span></div><p>Add bills as they arrive and keep your flatmates in the loop. This demo doesn't connect to providers or move money.</p></article>
    </div></div>`;
}

function owedPage() {
  const incoming = state.ious.filter(item => item.direction === "in").reduce((sum, item) => sum + item.amount, 0);
  const outgoing = state.ious.filter(item => item.direction === "out").reduce((sum, item) => sum + item.amount, 0);
  return `${header("KEEP IT EASY", "Money owed", "A friendly way to remember the little things.", "Add an IOU", "iou")}
    <div class="view-grid"><div>
      <article class="card panel"><div class="panel-heading"><div><h2>Your IOUs</h2><p>Keep track of who covered what.</p></div><span class="offer-tag">Just between you</span></div>
      <div class="owed-highlight"><div class="owed-line"><span>Coming back to you</span><strong class="positive">${money(incoming)}</strong></div><div class="owed-line"><span>You’ll pay back</span><strong class="negative">${money(outgoing)}</strong></div></div>
      <div class="section-heading"><h2>Recent IOUs</h2></div>
      ${state.ious.map(item => `<div class="iou-row"><span class="avatar ${item.direction === "in" ? "avatar-lilac" : "avatar-peach"}">${item.name.split(" ").map(s => s[0]).join("")}</span><span class="iou-copy"><strong>${escapeHTML(item.name)}</strong><small>${escapeHTML(item.detail)}</small></span><span class="iou-amount ${item.direction === "in" ? "positive" : "negative"}">${item.direction === "in" ? "+" : "−"}${money(item.amount)}<small>${item.direction === "in" ? "owes you" : "you owe"}</small></span></div>`).join("")}
      </article></div><div>
      <article class="card panel"><div class="panel-heading"><div><h2>Keep it friendly</h2><p>Money between people can stay simple.</p></div><span class="deal-logo">↔</span></div><p>These notes are just reminders for you. No payment requests are sent, and there are no bank connections in this prototype.</p><button class="button button-small" data-action="iou">＋ Add a note</button></article>
    </div></div>`;
}

function assistantPage() {
  return `${header("A HAND WHEN YOU NEED IT", "Your money sidekick", "A little help with the life admin. Always on your terms.", null, null)}
    <div class="assistant-hero"><div><div class="eyebrow">DEMO MODE · NO ACCOUNTS CONNECTED</div><h2>Less chasing. More headspace.</h2><p>Explore what a helpful money assistant could do. This prototype only shows sample tasks — it won't access accounts, submit forms, or change documents.</p></div><span class="button button-lime">✳ Demo assistant</span></div>
    <div class="agent-grid">
      <article class="card agent-card"><div class="agent-head"><span class="deal-logo">◷</span><span><strong>Bill-watching buddy</strong><small>Recurring bills & due dates</small></span></div><p>Spot a bill that changed, see what's coming up, and get a nudge before it's due.</p><span class="demo-pill">SAMPLE TASKS ONLY</span><div style="margin-top:13px"><button class="button button-small" data-action="agent-bills">See a sample</button></div></article>
      <article class="card agent-card"><div class="agent-head"><span class="deal-logo rose">▤</span><span><strong>Form-filling helper</strong><small>Guided, never submitted</small></span></div><p>Organise details for a form and prepare a draft for you to review before anything is used.</p><span class="demo-pill">YOU STAY IN CONTROL</span><div style="margin-top:13px"><button class="button button-small" data-action="agent-forms">See a sample</button></div></article>
      <article class="card agent-card"><div class="agent-head"><span class="deal-logo blue">⌕</span><span><strong>Document finder</strong><small>Make paperwork easier to find</small></span></div><p>Imagine sorting bills and receipts into a tidy list with clear dates and names.</p><span class="demo-pill">NO FILES ACCESSED</span><div style="margin-top:13px"><button class="button button-small" data-action="agent-docs">See a sample</button></div></article>
      <article class="card agent-card"><div class="agent-head"><span class="deal-logo yellow">✧</span><span><strong>Spending check-in</strong><small>Helpful patterns, no judgement</small></span></div><p>Get a plain-language summary of your spending and gentle ideas to help you reach a goal.</p><span class="demo-pill">SAMPLE INSIGHTS</span><div style="margin-top:13px"><button class="button button-small" data-action="agent-insights">See a sample</button></div></article>
    </div>
    <p class="fine-print">AI features are illustrative only. No AI service or external integration is connected. In a real product, sensitive actions should require clear permission and your review.</p>`;
}

const pages = {
  overview: { label: "Overview", render: overviewPage },
  budget: { label: "Budget", render: budgetPage, mount: mountBudget },
  deals: { label: "Deals & rewards", render: dealsPage },
  trips: { label: "Trips & goals", render: tripsPage },
  home: { label: "Shared home", render: homePage },
  owed: { label: "Money owed", render: owedPage },
  assistant: { label: "Money sidekick", render: assistantPage }
};

function render() {
  const page = pages[state.page] || pages.overview;
  flowView.observer?.disconnect();
  content.innerHTML = page.render();
  page.mount?.();
  document.querySelector("#page-crumb").textContent = page.label;
  document.querySelectorAll(".nav-link").forEach(button => button.classList.toggle("active", button.dataset.page === state.page));
  document.querySelector("#sidebar").classList.remove("open");
}

function toast(message) {
  const node = document.createElement("div");
  node.className = "toast";
  node.textContent = message;
  document.querySelector("#toast-region").append(node);
  window.setTimeout(() => node.remove(), 3200);
}

function showModal({ eyebrow = "QUICK ACTION", title, copy, fields, submit = "Save", onSubmit }) {
  document.querySelector("#modal-eyebrow").textContent = eyebrow;
  document.querySelector("#modal-title").textContent = title;
  document.querySelector("#modal-copy").textContent = copy;
  document.querySelector("#modal-submit").textContent = submit;
  document.querySelector("#modal-fields").innerHTML = fields;
  modal.showModal();
  document.querySelector("#modal-form").onsubmit = event => {
    if (event.submitter?.value === "cancel") return;
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    if (onSubmit(formData) !== false) modal.close();
  };
  document.querySelector("#modal-fields input")?.focus();
}

function expenseModal() {
  showModal({
    title: "Add an expense",
    copy: "Add a purchase to your October budget.",
    fields: `<label class="field">What was it for?<input name="name" required maxlength="60" placeholder="e.g. Weekly food shop"></label><label class="field">Amount (£)<input name="amount" required type="number" min="0.01" step="0.01" placeholder="0.00"></label><label class="field">Category<select name="category">${state.budget.categories.map(item => `<option>${escapeHTML(item.name)}</option>`).join("")}</select></label>`,
    onSubmit: data => {
      const amount = Number(data.get("amount"));
      const name = String(data.get("name")).trim();
      const category = String(data.get("category"));
      if (!name || !Number.isFinite(amount) || amount <= 0) { toast("Enter a valid expense and amount."); return false; }
      state.budget.spent += amount;
      const target = state.budget.categories.find(item => item.name === category);
      if (target) target.spent += amount;
      state.transactions.unshift({ name, category, amount, date: "Just now" });
      render();
      toast(`${money(amount)} added to ${category.toLowerCase()}.`);
    }
  });
}

function iouModal() {
  showModal({
    title: "Add an IOU",
    copy: "A simple reminder for who covered what.",
    fields: `<label class="field">Person<input name="person" required maxlength="50" placeholder="Name"></label><label class="field">What was it for?<input name="detail" required maxlength="70" placeholder="e.g. Dinner"></label><label class="field">Amount (£)<input name="amount" required type="number" min="0.01" step="0.01" placeholder="0.00"></label><label class="field">Who owes?<select name="direction"><option value="in">They owe me</option><option value="out">I owe them</option></select></label>`,
    onSubmit: data => {
      const amount = Number(data.get("amount"));
      const person = String(data.get("person")).trim();
      const detail = String(data.get("detail")).trim();
      if (!person || !detail || !Number.isFinite(amount) || amount <= 0) { toast("Add a name, note and valid amount."); return false; }
      state.ious.unshift({ name: data.get("direction") === "in" ? person : `You owe ${person}`, detail, amount, direction: data.get("direction") });
      render();
      toast("Your IOU note has been added.");
    }
  });
}

function handleAction(action, element) {
  if (action === "expense") return expenseModal();
  if (action === "iou") return iouModal();
  if (action === "budget-view") {
    state.budgetView = element.dataset.view;
    return render();
  }
  if (action === "save-deal") {
    const index = Number(element.dataset.index);
    state.savedDeals.has(index) ? state.savedDeals.delete(index) : state.savedDeals.add(index);
    render();
    return toast(state.savedDeals.has(index) ? "Deal saved to your list." : "Deal removed from your list.");
  }
  const messages = {
    "search-deals": "Deal search is a demo — no live offers are connected yet.",
    cashback: "Your sample cashback balance is £23.40.",
    "edit-budget": "Budget editing will be available in a future version.",
    invite: "Invites are a preview — no messages have been sent.",
    "add-bill": "Bill added actions are a preview — no provider is connected.",
    goal: "Your savings goal is ready to plan. Contributions are not processed in this demo.",
    contribute: "Contributions are a preview — no money has moved.",
    destination: "Trip ideas are a preview. No booking service is connected.",
    "agent-bills": "Sample: Your electricity bill is due in 4 days. (Example only)",
    "agent-forms": "Sample: A guided draft would be prepared here for you to review. Nothing is submitted.",
    "agent-docs": "Sample: 3 bills could be grouped by month. No files were accessed.",
    "agent-insights": "Sample: You have used 71% of your monthly budget, with 14 days to go."
  };
  toast(messages[action] || "This demo action is not connected yet.");
}

document.addEventListener("click", event => {
  const pageButton = event.target.closest("[data-page]");
  if (pageButton) {
    state.page = pageButton.dataset.page;
    render();
    return;
  }
  const actionButton = event.target.closest("[data-action]");
  if (actionButton) handleAction(actionButton.dataset.action, actionButton);
});

content.addEventListener("change", event => {
  if (event.target.id !== "overview-month") return;
  state.overviewMonth = event.target.value;
  render();
  document.querySelector("#overview-month")?.focus();
});

content.addEventListener("input", event => {
  const input = event.target.closest("[data-flow-key]");
  if (!input) return;
  const value = Number(input.value);
  setFlowValue(input.dataset.flowKey, Number.isFinite(value) && value > 0 ? value : 0);
  animateFlow(flowData());
});

document.querySelector("#mobile-menu").addEventListener("click", () => document.querySelector("#sidebar").classList.toggle("open"));
document.querySelector(".notification-button").addEventListener("click", () => toast("You're all caught up."));
document.querySelector(".profile-button").addEventListener("click", () => toast("Personal account settings are a preview."));

render();
