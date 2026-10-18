const state = {
  page: "overview",
  budgetView: "list",
  overviewMonth: "2026-10",
  budget: {
    total: 2800,
    spent: 0,
    history: [
      { key: "2026-01", label: "January", spent: 1668 },
      { key: "2026-02", label: "February", spent: 1912 },
      { key: "2026-03", label: "March", spent: 1580 },
      { key: "2026-04", label: "April", spent: 1155 },
      { key: "2026-05", label: "May", spent: 1520 },
      { key: "2026-06", label: "June", spent: 1892 },
      { key: "2026-07", label: "July", spent: 1661 },
      { key: "2026-08", label: "August", spent: 1617 },
      { key: "2026-09", label: "September", spent: 1789 }
    ],
    forecast: [
      { key: "2026-11", label: "November" },
      { key: "2026-12", label: "December" }
    ],
    categories: [
      { name: "Groceries", icon: "✳", className: "grocery", spent: 0, limit: 600 },
      { name: "Rent", icon: "⌂", className: "rent", spent: 0, limit: 550 },
      { name: "Bills", icon: "▤", className: "bills", spent: 0, limit: 400 },
      { name: "Travel", icon: "↗", className: "travel", spent: 0, limit: 500 },
      { name: "Leisure", icon: "♡", className: "leisure", spent: 0, limit: 750 }
    ],
    income: [
      { id: "salary", name: "Salary", amount: 0 },
      { id: "freelance", name: "Freelance income", amount: 0 },
      { id: "transfers", name: "Incoming transfers", amount: 0 }
    ],
    balance: 1240,
    goal: 300
  },
  savedDeals: new Set(),
  // October's ledger. Category and income totals are worked out from it below.
  transactions: [
    { day: 1, name: "Monthly salary · Northwind Ltd", category: "salary", amount: 2350 },
    { day: 1, name: "Monthly rent · Willow House Lettings", category: "rent", amount: 520 },
    { day: 1, name: "Monthly travel pass · Metro Transit", category: "travel", amount: 152 },
    { day: 2, name: "Council tax · City Council", category: "bills", amount: 52 },
    { day: 2, name: "Gym membership · FitWorks", category: "leisure", amount: 45 },
    { day: 3, name: "Weekly shop · FreshMart", category: "grocery", amount: 72.45 },
    { day: 3, name: "Streaming subscriptions", category: "leisure", amount: 17.98 },
    { day: 4, name: "Broadband share · ConnectNow", category: "bills", amount: 14 },
    { day: 5, name: "Train to Leeds · RailHop", category: "travel", amount: 48.7 },
    { day: 6, name: "Fruit and vegetables · Market Lane", category: "grocery", amount: 18.3 },
    { day: 7, name: "Weekly shop · FreshMart", category: "grocery", amount: 96.4 },
    { day: 7, name: "Refund · FlyLite", category: "transfers", amount: 100 },
    { day: 8, name: "Water share · City Water", category: "bills", amount: 27.8 },
    { day: 9, name: "Mobile phone · Telco One", category: "bills", amount: 18 },
    { day: 9, name: "Design project · Harbour Studio", category: "freelance", amount: 200 },
    { day: 10, name: "Weekly shop · FreshMart", category: "grocery", amount: 81.2 },
    { day: 10, name: "Dinner · The Olive Tree", category: "leisure", amount: 57 },
    { day: 11, name: "Taxi · City Cabs", category: "travel", amount: 23.3 },
    { day: 11, name: "Cinema · Picturehouse", category: "leisure", amount: 24.5 },
    { day: 11, name: "Transfer from Mersey McFadden", category: "transfers", amount: 45 },
    { day: 12, name: "Lunches and coffee", category: "leisure", amount: 44 },
    { day: 13, name: "Fruit and vegetables · Market Lane", category: "grocery", amount: 22.6 },
    { day: 13, name: "Concert tickets · TicketHub", category: "leisure", amount: 120 },
    { day: 14, name: "Train to Brighton · RailHop", category: "travel", amount: 31.5 },
    { day: 15, name: "Weekly shop · Green Basket", category: "grocery", amount: 71.65 },
    { day: 15, name: "Books · Northern Books", category: "leisure", amount: 35.52 },
    { day: 15, name: "Logo revisions · Harbour Studio", category: "freelance", amount: 120 },
    { day: 16, name: "Electricity · Bright Energy", category: "bills", amount: 82.4 },
    { day: 16, name: "Bike hire · CityCycle", category: "travel", amount: 30 },
    { day: 16, name: "Clothing · High Street", category: "leisure", amount: 76 },
    { day: 17, name: "Weekly shop · Green Basket", category: "grocery", amount: 64.2 }
  ],
  ious: [
    { name: "Mersey McFadden", detail: "Dinner · October 12", amount: 28.5, direction: "in" },
    { name: "Lucy Shen", detail: "Taxi · October 10", amount: 16, direction: "out" }
  ]
};

const round2 = value => Math.round(value * 100) / 100;
const ledgerTotal = key => round2(state.transactions.filter(tx => tx.category === key).reduce((sum, tx) => sum + tx.amount, 0));
state.budget.categories.forEach(item => { item.spent = ledgerTotal(item.className); });
state.budget.income.forEach(item => { item.amount = ledgerTotal(item.id); });
state.budget.spent = round2(state.budget.categories.reduce((sum, item) => sum + item.spent, 0));

const deals = [
  { brand: "FreshMart", logo: "F", logoClass: "", title: "£5 off your next shop", detail: "Spend £40 or more · Ends October 31", value: "£5 back", type: "Groceries" },
  { brand: "Market Lane", logo: "M", logoClass: "rose", title: "Double loyalty points", detail: "On fruit and vegetables this week", value: "2× points", type: "Groceries" },
  { brand: "RailHop", logo: "R", logoClass: "blue", title: "20% off advance fares", detail: "Selected off-peak journeys", value: "20% off", type: "Train" },
  { brand: "FlyLite", logo: "✈", logoClass: "yellow", title: "£18 off your next flight", detail: "For trips booked in October", value: "£18 off", type: "Flights" }
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
      <span class="category-limit">${money(item.limit)}${compact ? "" : " budget"}</span>
    </div>`).join("")}</div>`;
}

function dealsMarkup() {
  return deals.map((deal, index) => `
    <article class="offer-card">
      <div class="offer-top"><span class="deal-logo ${deal.logoClass}">${deal.logo}</span><span class="offer-tag">${deal.type}</span></div>
      <h3>${deal.title}</h3><p>${deal.detail}</p>
      <div class="offer-footer"><small>${deal.brand} · ${deal.value}</small><button class="button button-small ${state.savedDeals.has(index) ? "button-lime" : ""}" data-action="save-deal" data-index="${index}">${state.savedDeals.has(index) ? "Saved" : "Save offer"}</button></div>
    </article>`).join("");
}

// Closed months are recorded figures, October is live, and November and December are forecast from the last three closed months.
function budgetMonths() {
  const recent = state.budget.history.slice(-3);
  const projected = round2(recent.reduce((sum, item) => sum + item.spent, 0) / recent.length);
  return [
    ...state.budget.history,
    { key: "2026-10", label: "October", spent: state.budget.spent, current: true },
    ...state.budget.forecast.map(item => ({ ...item, spent: projected, forecast: true }))
  ];
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
  const progressNote = month.forecast ? "Forecast" : month.current ? (left < 0 ? "Over budget" : "Within budget") : "Month closed";
  const leftNote = left < 0 ? `${money(-left)} over budget` : `${money(left)} ${month.forecast ? "projected under budget" : month.current ? "remaining" : "under budget"}`;
  const status = left < 0 ? "Over budget" : month.forecast ? "Projected" : month.current ? "On track" : "Under budget";
  const badge = month.forecast
    ? `<span class="month-change forecast" title="Average of July, August and September">Forecast</span>`
    : change === null ? "" : `<span class="month-change${change > 0 ? " up" : ""}" title="Compared with ${previous.label}">${change > 0 ? "↑" : "↓"} ${Math.abs(change).toFixed(1)}% vs ${previous.label.slice(0, 3)}</span>`;
  const tightest = [...state.budget.categories].sort((a, b) => b.spent / b.limit - a.spent / a.limit)[0];
  return `${header("SATURDAY 17 OCTOBER 2026", "Every bill, one account.", "Your accounts, budget and commitments in one view.", "Add expense", "expense")}
    <div class="dashboard-grid">
      <article class="card balance-card">
        <div class="balance-top"><span class="eyebrow">${month.label.toUpperCase()} ${month.forecast ? "FORECAST" : "SPENDING"}</span><div class="balance-actions"><select class="period-select" id="overview-month" aria-label="Budget month">${[...months].reverse().map(item => `<option value="${item.key}"${item.key === month.key ? " selected" : ""}>${item.label}${item.forecast ? " (forecast)" : ""}</option>`).join("")}</select><button type="button" class="text-link balance-edit" data-action="edit-monthly-budget" aria-label="Edit monthly budget">Edit</button></div></div>
        <div class="balance-amount">${money(month.spent)}</div><p class="balance-caption">${month.forecast ? "Projected" : "Spent"} against a ${money(state.budget.total)} monthly budget</p>
        <div class="balance-progress"><div class="progress-meta"><span>${progressNote}</span><strong>${percentage}%</strong></div><div class="progress-track"><div class="progress-fill" style="width:${Math.min(100, percentage)}%"></div></div><div class="balance-foot"><span>${leftNote}</span><strong>${status}</strong></div></div>
      </article>
      <article class="card stat-card">
        <div class="card-title-row"><div><div class="card-title">Monthly spending</div><p class="card-subtitle">January to December 2026 · November and December are forecasts</p></div>${badge}</div>
        <div class="chart-total">${money(month.spent)}<span>${month.forecast ? "forecast for" : "in"} ${month.label}</span></div>
        <div class="chart" aria-label="Monthly spending, January to December 2026">${months.map(item => `<div class="chart-column"><div class="chart-bar${item.key === month.key ? " highlight" : ""}${item.forecast ? " forecast" : ""}" style="height:${Math.round(item.spent / peak * 90)}%" title="${item.label}: ${money(item.spent)}${item.forecast ? " (forecast)" : ""}"></div></div>`).join("")}</div>
        <div class="chart-labels">${months.map(item => `<span title="${item.label}">${item.label.slice(0, 3)}</span>`).join("")}</div>
      </article>
      <section>
        <div class="section-heading"><h2>Budget by category</h2><button class="text-link" data-page="budget">View budget ↗</button></div>
        <article class="card category-card">${categoriesMarkup(true)}<p class="category-note">${tightest.name} has used ${Math.round(tightest.spent / tightest.limit * 100)}% of its budget.</p></article>
      </section>
      <section>
        <div class="section-heading"><h2>Available offers</h2><button class="text-link" data-page="deals">All offers ↗</button></div>
        <article class="card deal-card">
          <div class="deal-list">${deals.slice(0, 3).map(deal => `<div class="deal-item"><span class="deal-logo ${deal.logoClass}">${deal.logo}</span><span class="deal-copy"><strong>${deal.title}</strong><small>${deal.brand} · ${deal.detail.split(" · ")[0]}</small></span><span class="deal-value">${deal.value}</span></div>`).join("")}</div>
        </article>
      </section>
      <section>
        <div class="section-heading"><h2>Savings goals</h2><button class="text-link" data-page="trips">All goals ↗</button></div>
        <article class="card trip-card"><span class="trip-date"><strong>22</strong><small>NOV</small></span><span class="trip-copy"><strong>Cabin weekend</strong><small>${money(420)} saved of ${money(900)}</small></span><span class="trip-progress"><span style="width:47%;display:block"></span></span></article>
      </section>
      <section>
        <div class="section-heading"><h2>Shared household</h2><button class="text-link" data-page="home">View household ↗</button></div>
        <article class="card home-card"><div class="home-main"><div class="home-members"><span class="avatar">CL</span><span class="avatar avatar-lilac">MC</span><span class="avatar avatar-blue">LS</span></div><span class="home-copy"><strong>Willow House</strong><small>3 members · All bills up to date</small></span><span class="bill-total">${money(218)}<small>due this week</small></span></div></article>
      </section>
    </div>`;
}

function budgetPage() {
  const flow = state.budgetView === "flow";
  return `${header("BUDGET · OCTOBER 2026", "Monthly budget", "Planned and actual spending for October.", "Add expense", "expense")}
    <div class="view-toolbar"><div class="view-switch" role="group" aria-label="Budget view"><button type="button" data-action="budget-view" data-view="list" aria-pressed="${!flow}">Categories</button><button type="button" data-action="budget-view" data-view="flow" aria-pressed="${flow}">Flowchart</button></div>${flow ? `<span class="view-hint">Hover to magnify · click streams to select one or more</span>` : ""}</div>
    ${flow ? flowMarkup() : budgetListMarkup()}`;
}

function budgetListMarkup() {
  const { spent, total } = state.budget;
  const tightest = [...state.budget.categories].sort((a, b) => b.spent / b.limit - a.spent / a.limit)[0];
  const recent = [...state.transactions].sort((a, b) => b.day - a.day).slice(0, 5);
  return `<div class="view-grid"><div>
      <article class="card balance-card"><div class="balance-top"><span class="eyebrow">OCTOBER SPENDING</span><span class="eyebrow">MONTHLY BUDGET</span></div><div class="balance-amount">${money(spent)}</div><p class="balance-caption">of ${money(total)} budgeted · ${money(Math.max(0, total - spent))} remaining</p><div class="balance-progress"><div class="progress-track"><div class="progress-fill" style="width:${Math.min(100, spent / total * 100)}%"></div></div><div class="balance-foot"><span>${Math.round(spent / total * 100)}% of monthly budget</span><strong>${spent > total ? "Over budget" : "On track"}</strong></div></div></article>
      <div class="section-heading"><h2>Categories</h2><button class="text-link" data-action="edit-budget">Edit budget</button></div>
      <article class="card panel">${state.budget.categories.map(item => `<div class="budget-line ${item.className}"><strong><span class="budget-icon">${item.icon}</span>${escapeHTML(item.name)}</strong><small>${money(item.spent)} / ${money(item.limit)}</small><div class="category-bar"><span style="width:${Math.min(100, item.spent / item.limit * 100)}%"></span></div></div>`).join("")}</article>
    </div><div>
      <article class="card panel"><div class="panel-heading"><div><h2>Recent transactions</h2><p>The five most recent entries.</p></div></div>${recent.map(tx => {
        const branch = branchInfo(tx.category);
        const category = state.budget.categories.find(item => item.className === tx.category);
        return `<div class="iou-row ${tx.category}"><span class="deal-logo tx-logo">${category ? category.icon : "£"}</span><span class="iou-copy"><strong>${escapeHTML(tx.name)}</strong><small>${escapeHTML(branch.name)} · October ${tx.day}</small></span><span class="iou-amount${branch.kind === "in" ? " positive" : ""}">${branch.kind === "in" ? "+" : "−"}${money(tx.amount)}</span></div>`;
      }).join("")}</article>
      <article class="card panel"><div class="panel-heading"><div><h2>Spending insight</h2><p>Category closest to its limit.</p></div><span class="deal-logo">✳</span></div><p>${tightest.name} has used ${Math.round(tightest.spent / tightest.limit * 100)}% of its ${money(tightest.limit)} budget, with ${money(Math.max(0, tightest.limit - tightest.spent))} remaining for October.</p></article>
    </div></div>`;
}

// Money flow: income and the opening balance on the left, available funds in the middle, expenditure on the right.
const flowView = { shown: null, selected: new Set(), raf: 0, observer: null, pointer: null, anchors: [], nodeW: 13 };
// The lens scales up the blocks and labels near the cursor; at the radius edge the scale is back to 1.
const lens = { radius: 150, maxScale: 1.35 };
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const wholePounds = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", minimumFractionDigits: 0, maximumFractionDigits: 0 });
const pounds = value => wholePounds.format(value);
const ribbon = (x0, a0, b0, x1, a1, b1) => {
  const xm = x0 + (x1 - x0) * .5;
  return `M${x0},${a0}C${xm},${a0} ${xm},${a1} ${x1},${a1}L${x1},${b1}C${xm},${b1} ${xm},${b0} ${x0},${b0}Z`;
};

// Every stream in the money flow by id: its name, its colour, and whether it adds money ("in") or takes it away ("out").
function branchInfo(id) {
  const category = state.budget.categories.find(item => item.className === id);
  if (category) return { name: category.name, color: `var(--c-${id})`, kind: "out" };
  const income = state.budget.income.find(item => item.id === id);
  if (income) return { name: income.name, color: "var(--c-income)", kind: "in" };
  return {
    balance: { name: "Opening balance", color: "var(--c-balance)", kind: "in" },
    remain: { name: "Remaining balance", color: "var(--c-balance)", kind: "calc" },
    jar: { name: "Savings jar", color: "var(--c-jar)", kind: "out" }
  }[id];
}

function flowData() {
  const data = { balance: state.budget.balance, goal: state.budget.goal };
  state.budget.income.forEach(item => { data[item.id] = item.amount; });
  state.budget.categories.forEach(item => { data[item.className] = item.spent; });
  return data;
}

function flowTotals(d) {
  const income = state.budget.income.reduce((sum, item) => sum + d[item.id], 0);
  const spent = state.budget.categories.reduce((sum, item) => sum + d[item.className], 0);
  const available = income + d.balance;
  const net = income - spent;
  const goal = Math.max(0, d.goal);
  const met = goal > 0 && net >= goal;
  const saved = met ? goal : 0;
  return { income, spent, available, net, goal, met, saved, remaining: Math.max(0, available - spent - saved), over: Math.max(0, spent - available) };
}

function setFlowValue(key, value) {
  const income = state.budget.income.find(item => item.id === key);
  const category = state.budget.categories.find(item => item.className === key);
  if (income) income.amount = value;
  else if (category) {
    category.spent = value;
    state.budget.spent = round2(state.budget.categories.reduce((sum, item) => sum + item.spent, 0));
  } else if (key === "balance" || key === "goal") state.budget[key] = value;
}

function flowMarkup() {
  const swatch = color => `<i class="flow-swatch" style="background:${color}"></i>`;
  const row = (key, label, value, color) => `<div class="flow-row">${swatch(color)}<label for="flow-${key}">${escapeHTML(label)}</label><span class="flow-money"><span>£</span><input id="flow-${key}" data-flow-key="${key}" type="number" inputmode="decimal" min="0" step="any" value="${+value.toFixed(2)}"></span></div>`;
  const groups = [
    ["Income", state.budget.income.map(item => row(item.id, item.name, item.amount, "var(--c-income)"))],
    ["Expenditure", state.budget.categories.map(item => row(item.className, item.name, item.spent, `var(--c-${item.className})`))],
    ["Balance and target", [row("balance", "Opening balance", state.budget.balance, "var(--c-balance)"), row("goal", "Monthly savings target", state.budget.goal, "var(--c-jar)")]]
  ];
  return `<div class="flow-view">
    <article class="card flow-card">
      <div class="flow-summary" aria-live="polite"><div class="flow-stat"><span>Income</span><b id="flow-in"></b></div><div class="flow-stat"><span>Expenditure</span><b id="flow-out"></b></div><div class="flow-stat"><span>Net income</span><b id="flow-net"></b></div><div class="flow-chip" id="flow-chip"><i></i><span></span></div></div>
      <div class="flow-cols" aria-hidden="true"><span>Income</span><span>October</span><span>Expenditure</span></div>
      <div class="flow" id="flow"></div>
      <div class="flow-legend"><span>${swatch("var(--c-income)")}Income</span><span>${swatch("var(--c-balance)")}Opening and remaining balance</span><span>${swatch("var(--c-jar)")}Savings jar, target met</span><span>${swatch("repeating-linear-gradient(135deg,var(--ghost-bg) 0 2px,var(--ghost) 2px 4px)")}Savings jar, pending until income covers it</span></div>
    </article>
    <article class="card panel flow-history" aria-live="polite">
      <div class="panel-heading"><div><h2>Transaction history</h2><p id="history-note"></p></div><button class="button button-small" data-action="flow-clear" id="history-clear" hidden>Clear selection</button></div>
      <div class="history-chips" id="history-chips"></div>
      <div class="history-scroll"><table class="history-table"><thead><tr><th scope="col">Date</th><th scope="col">Description</th><th scope="col" class="col-cat">Category</th><th scope="col" class="num">Amount</th></tr></thead><tbody id="history-body"></tbody><tfoot id="history-foot"></tfoot></table></div>
    </article>
    <article class="card panel flow-editor"><div class="panel-heading"><div><h2>Adjust figures</h2><p>The Savings jar is filled once October's net income reaches the savings target. Until then it is shown in grey.</p></div></div><div class="flow-groups">${groups.map(([title, rows]) => `<div class="flow-group"><h3>${title}</h3>${rows.join("")}</div>`).join("")}</div></article>
  </div>`;
}

function drawFlow(d) {
  const flow = document.querySelector("#flow");
  if (!flow) return false;
  const W = Math.max(300, flow.clientWidth);
  const narrow = W < 560;
  const labelW = Math.round(Math.min(178, Math.max(88, W * .2)));
  const nodeW = narrow ? 9 : 13, centerW = narrow ? 12 : 18;
  const xL = labelW, xC = Math.round(W / 2 - centerW / 2), xR = W - labelW - nodeW;
  const { income: incSum, spent: expSum, available: T, net, goal, met, saved, remaining, over } = flowTotals(d);
  const C = Math.max(T, expSum + saved + remaining);

  const k = (narrow ? 300 : 400) / Math.max(1, C + (met ? 0 : goal));
  // Slots are tall enough for a three-line label, so labels never touch at rest.
  const minSlot = narrow ? 62 : 66, gap = narrow ? 8 : 10, top = 66;

  const left = state.budget.income.filter(item => d[item.id] > .5).sort((a, b) => d[b.id] - d[a.id])
    .map(item => ({ id: item.id, v: d[item.id], label: item.name, color: "var(--c-income)" }));
  if (d.balance > .5) left.push({ id: "balance", v: d.balance, label: "Opening balance", color: "var(--c-balance)" });

  const right = state.budget.categories.filter(item => d[item.className] > .5).sort((a, b) => d[b.className] - d[a.className]).map(item => {
    const v = d[item.className];
    return { id: item.className, v, label: item.name, color: `var(--c-${item.className})`, sub: item.limit > 0 ? `${Math.round(v / item.limit * 100)}% of budget` : "", warn: v > item.limit };
  });
  if (remaining > .5) right.push({ id: "remain", v: remaining, label: "Remaining balance", color: "var(--c-balance)" });
  if (goal > .5) right.push({ id: "jar", v: goal, label: "Savings jar", ghost: !met, color: met ? "var(--c-jar)" : "url(#flow-hatch)", sub: met ? "Target met" : `${pounds(goal - Math.max(0, net))} short` });

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

  // Ghost: the part of the target that October's income does not cover yet.
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
  labels += `<div class="lab c" style="left:${xC + centerW / 2}px;top:${cy - 8}px"><span class="n">Available funds</span><span class="a">${pounds(T)}</span></div>`;

  flowView.nodeW = nodeW;
  flowView.narrow = narrow;
  flowView.anchors = [
    ...left.map(n => ({ id: n.id, x0: 0, x1: xL + nodeW, y0: n.cy - n.slot / 2, y1: n.cy + n.slot / 2 })),
    ...right.map(n => ({ id: n.id, x0: xR, x1: W, y0: n.cy - n.slot / 2, y1: n.cy + n.slot / 2 }))
  ];

  flow.style.height = `${H}px`;
  flow.innerHTML = `<svg viewBox="0 0 ${W} ${H}" height="${H}" role="img" aria-label="Flowchart: ${pounds(incSum)} income and ${pounds(d.balance)} opening balance, ${pounds(expSum)} expenditure, savings target ${met ? "met" : "not yet met"}."><defs><pattern id="flow-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="7" height="7" style="fill:var(--ghost-bg)"/><rect width="2.5" height="7" style="fill:var(--ghost)"/></pattern></defs><g>${ribs}</g><g>${nodes}</g></svg>${labels}`;
  // Freshly drawn nodes take their focus and lens state without animating in.
  flow.classList.add("drawing");
  if (applyFlowFocus()) renderHistory();
  applyLens();
  void flow.offsetHeight;
  flow.classList.remove("drawing");

  document.querySelector("#flow-in").textContent = money(incSum);
  document.querySelector("#flow-out").textContent = money(expSum);
  document.querySelector("#flow-net").textContent = `${net < 0 ? "−" : ""}${money(Math.abs(net))}`;
  const chip = document.querySelector("#flow-chip");
  const [kind, icon, text] = over > .5 ? ["warn", "!", `Expenditure exceeds available funds by ${pounds(over)}`]
    : goal <= .5 ? ["hold", "–", "No savings target set"]
    : met ? ["ok", "✓", `${pounds(goal)} set aside in the Savings jar`]
    : ["hold", "…", `${pounds(goal - Math.max(0, net))} short of the ${pounds(goal)} savings target`];
  chip.className = `flow-chip ${kind}`;
  chip.querySelector("i").textContent = icon;
  chip.querySelector("span").textContent = text;
  return true;
}

// Selected streams stay lit: their ribbons, blocks and labels. Everything else fades back.
// Returns true when a selected stream has disappeared from the chart and was dropped from the selection.
function applyFlowFocus() {
  const flow = document.querySelector("#flow");
  if (!flow) return false;
  const selected = flowView.selected;
  const before = selected.size;
  selected.forEach(id => { if (!flow.querySelector(`[data-id="${id}"]`)) selected.delete(id); });
  flow.classList.toggle("focusing", selected.size > 0);
  flow.querySelectorAll("[data-id]").forEach(node => node.classList.toggle("on", selected.has(node.dataset.id)));
  flow.querySelectorAll("button.lab").forEach(button => button.setAttribute("aria-pressed", String(selected.has(button.dataset.id))));
  return selected.size !== before;
}

function selectionChanged() {
  applyFlowFocus();
  renderHistory();
}

// Rows for the transaction history: the ledger, plus the opening balance, the Savings jar transfer,
// the calculated remaining balance when it is selected, and any figure changed in "Adjust figures".
function historyRows() {
  const ids = flowView.selected.size ? flowView.selected : null;
  const wanted = id => !ids || ids.has(id);
  const totals = flowTotals(flowData());
  const rows = state.transactions.filter(tx => wanted(tx.category)).map(tx => ({ day: tx.day, name: tx.name, id: tx.category, value: branchInfo(tx.category).kind === "in" ? tx.amount : -tx.amount }));
  const figures = [...state.budget.categories.map(item => [item.className, item.spent, -1]), ...state.budget.income.map(item => [item.id, item.amount, 1])];
  figures.forEach(([id, figure, sign]) => {
    const difference = round2(figure - ledgerTotal(id));
    if (wanted(id) && Math.abs(difference) >= .01) rows.push({ day: null, name: "Manual adjustment", id, value: sign * difference, note: true });
  });
  if (wanted("balance") && state.budget.balance > 0) rows.push({ day: 1, name: "Opening balance brought forward", id: "balance", value: state.budget.balance, note: true });
  if (wanted("jar") && totals.goal > 0) {
    rows.push(totals.met
      ? { day: 31, name: "Transfer to Savings jar (scheduled)", id: "jar", value: -totals.goal, note: true }
      : { day: 31, name: `Transfer to Savings jar on hold · ${money(totals.goal - Math.max(0, totals.net))} short of the target`, id: "jar", value: null, note: true });
  }
  if (ids?.has("remain")) rows.push({ day: 31, name: "Remaining balance at month end (calculated)", id: "remain", value: totals.remaining, note: true, calculated: true });
  return rows.sort((a, b) => (b.day ?? 32) - (a.day ?? 32));
}

function renderHistory() {
  const body = document.querySelector("#history-body");
  if (!body) return;
  const selected = [...flowView.selected];
  const rows = historyRows();
  const counted = rows.filter(row => row.value !== null && !row.calculated);
  const incoming = counted.filter(row => row.value > 0).reduce((sum, row) => sum + row.value, 0);
  const outgoing = counted.filter(row => row.value < 0).reduce((sum, row) => sum - row.value, 0);
  const transactions = rows.filter(row => !row.note).length;
  document.querySelector("#history-note").textContent = selected.length
    ? `${transactions} transaction${transactions === 1 ? "" : "s"} in ${selected.length} selected stream${selected.length === 1 ? "" : "s"}.`
    : `All ${transactions} October transactions. Select one or more streams in the chart to filter.`;
  document.querySelector("#history-clear").hidden = !selected.length;
  document.querySelector("#history-chips").innerHTML = selected.map(id => {
    const branch = branchInfo(id);
    return `<button type="button" class="history-chip" data-action="flow-deselect" data-id="${id}" aria-label="Remove ${escapeHTML(branch.name)} from the selection"><i class="flow-swatch" style="background:${branch.color}"></i>${escapeHTML(branch.name)}<b aria-hidden="true">×</b></button>`;
  }).join("");
  body.innerHTML = rows.length ? rows.map(row => {
    const branch = branchInfo(row.id);
    const amount = row.value === null ? "On hold" : `${row.value > 0 ? "+" : row.value < 0 ? "−" : ""}${money(Math.abs(row.value))}`;
    return `<tr${row.note ? ` class="is-note"` : ""}><td>${row.day ? `October ${row.day}` : "Adjusted"}</td><td><i class="history-dot" style="background:${branch.color}"></i>${escapeHTML(row.name)}</td><td class="col-cat"><span class="history-cat"><i class="flow-swatch" style="background:${branch.color}"></i>${escapeHTML(branch.name)}</span></td><td class="num${row.value > 0 && !row.calculated ? " positive" : ""}">${amount}</td></tr>`;
  }).join("") : `<tr><td colspan="4" class="history-empty">No transactions for this selection.</td></tr>`;
  document.querySelector("#history-foot").innerHTML = `<tr><td colspan="2">Credits ${money(incoming)} · Debits ${money(outgoing)}</td><td class="col-cat"></td><td class="num">${incoming - outgoing < 0 ? "−" : "+"}${money(Math.abs(incoming - outgoing))}</td></tr>`;
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
    const id = event.target.closest("[data-id]")?.dataset.id;
    if (!id) return;
    if (flowView.selected.has(id)) flowView.selected.delete(id);
    else flowView.selected.add(id);
    selectionChanged();
  });
  flow.addEventListener("keydown", event => {
    if (event.key !== "Escape" || !flowView.selected.size) return;
    flowView.selected.clear();
    selectionChanged();
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
  renderHistory();
  let width = flow.clientWidth;
  flowView.observer = new ResizeObserver(() => {
    if (flow.clientWidth === width) return;
    width = flow.clientWidth;
    drawFlow(flowView.shown);
  });
  flowView.observer.observe(flow);
}

function dealsPage() {
  return `${header("OFFERS", "Offers & cashback", "Current discounts and cashback from partner retailers.", "Find offers", "search-deals")}
    <div class="view-grid"><div><div class="section-heading" style="margin-top:0"><h2>Recommended offers</h2><span class="eyebrow">4 NEW THIS WEEK</span></div><div class="deal-grid">${dealsMarkup()}</div></div>
    <div><article class="card panel"><div class="panel-heading"><div><h2>Cashback balance</h2><p>Cashback earned to date.</p></div><span class="deal-logo">£</span></div><div class="chart-total">${money(23.4)}<span>available</span></div><p>Cashback is added when a saved offer is used.</p><button class="button button-lime button-small" data-action="cashback">View cashback</button></article>
    <article class="card panel"><div class="panel-heading"><div><h2>Travel offers</h2><p>Discounted rail and air fares.</p></div></div>${deals.filter(d => d.type !== "Groceries").map(d => `<div class="deal-item" style="margin:14px 0"><span class="deal-logo ${d.logoClass}">${d.logo}</span><span class="deal-copy"><strong>${d.title}</strong><small>${d.brand} · ${d.detail}</small></span><span class="deal-value">${d.value}</span></div>`).join("")}</article>
    <p class="fine-print">Offers shown are sample content for this prototype. Availability, eligibility and terms are not verified.</p></div></div>`;
}

function tripsPage() {
  return `${header("SAVINGS", "Travel & savings goals", "Shared and personal savings goals, with current travel offers.", "New savings goal", "goal")}
    <div class="view-grid"><div><div class="section-heading" style="margin-top:0"><h2>Shared savings goal</h2><button class="text-link" data-action="invite">Invite member ↗</button></div>
      <article class="card goal-card"><div class="goal-top"><div class="goal-title"><span class="deal-logo">✈</span><span><strong>Cabin weekend</strong><small>Shared with Mersey McFadden and Lucy Shen · November 22–24</small></span></div><span class="offer-tag">On track</span></div><div class="goal-amount">${money(420)} <small>of ${money(900)}</small></div><div class="goal-progress"><span style="width:47%"></span></div><div class="goal-foot"><span>47% saved</span><span>${money(480)} remaining</span></div><div class="section-heading"><span class="card-title">Contributions</span><button class="text-link" data-action="contribute">Add contribution</button></div><div class="member-list"><div class="member-row"><span class="avatar">CL</span><span class="member-name">Caroline Leathem<small>Your contribution</small></span><strong>${money(180)}</strong></div><div class="member-row"><span class="avatar avatar-lilac">MC</span><span class="member-name">Mersey McFadden<small>Added October 13</small></span><strong>${money(140)}</strong></div><div class="member-row"><span class="avatar avatar-blue">LS</span><span class="member-name">Lucy Shen<small>Added October 15</small></span><strong>${money(100)}</strong></div></div></article>
      <article class="card panel"><div class="panel-heading"><div><h2>Planned goals</h2><p>Goals you have not started saving for.</p></div><button class="button button-small" data-action="destination">＋ Add goal</button></div><div class="empty-note">No planned goals. Add a goal to start tracking it.</div></article>
    </div><div><article class="card panel"><div class="panel-heading"><div><h2>Travel offers</h2><p>Discounted fares for upcoming trips.</p></div><span class="deal-logo blue">↗</span></div>${deals.filter(d => d.type !== "Groceries").map(d => `<div class="deal-item" style="margin:14px 0"><span class="deal-logo ${d.logoClass}">${d.logo}</span><span class="deal-copy"><strong>${d.title}</strong><small>${d.brand} · ${d.detail}</small></span></div>`).join("")}</article><p class="fine-print">Savings goals are planning tools only. No payments or bookings are made in this demo.</p></div></div>`;
}

function homePage() {
  return `${header("SHARED HOUSEHOLD", "Willow House", "Shared bills and each member's share.", "Invite member", "invite")}
    <div class="view-grid"><div>
      <article class="card panel"><div class="panel-heading"><div><h2>October shared bills</h2><p>Due dates and payment status for October.</p></div><span class="offer-tag">3 members</span></div>
      <div class="home-main" style="margin-bottom:15px"><div class="home-members"><span class="avatar">CL</span><span class="avatar avatar-lilac">MC</span><span class="avatar avatar-blue">LS</span></div><span class="home-copy"><strong>Shared total for October</strong><small>Your share: ${money(72.67)}</small></span><span class="bill-total">${money(218)}<small>all bills</small></span></div>
      ${[["Electricity", "Bright Energy · Due October 21", 86, "Due soon"], ["Broadband", "ConnectNow · Paid October 4", 42, "Paid"], ["Water", "City Water · Paid October 8", 90, "Paid"]].map(b => `<div class="bill-row"><strong>${b[0]}</strong><span class="bill-status">${b[3]}</span><small>${b[1]}</small><strong>${money(b[2])}</strong></div>`).join("")}
      <div class="section-heading"><span class="card-title">October split</span><button class="text-link" data-action="add-bill">＋ Add a bill</button></div>
      ${[["Caroline Leathem", 72.67, ""], ["Mersey McFadden", 72.67, "avatar-lilac"], ["Lucy Shen", 72.66, "avatar-blue"]].map(m => `<div class="member-row" style="padding:7px 0"><span class="avatar ${m[2]}">${m[0].split(" ").map(s => s[0]).join("")}</span><span class="member-name">${m[0]}<small>Equal share</small></span><strong>${money(m[1])}</strong></div>`).join("")}</article>
    </div><div>    <article class="card panel"><div class="panel-heading"><div><h2>Members</h2><p>People sharing this household.</p></div><button class="button button-small" data-action="invite">＋ Invite</button></div><div class="member-list"><div class="member-row"><span class="avatar">CL</span><span class="member-name">Caroline Leathem<small>You · Admin</small></span></div><div class="member-row"><span class="avatar avatar-lilac">MC</span><span class="member-name">Mersey McFadden<small>Joined September 2</small></span></div><div class="member-row"><span class="avatar avatar-blue">LS</span><span class="member-name">Lucy Shen<small>Joined September 4</small></span></div></div></article>
      <article class="card panel"><div class="panel-heading"><div><h2>About shared bills</h2><p>How the split is calculated.</p></div><span class="deal-logo">✳</span></div><p>Bills are split equally between members. Add bills as they arrive so each share stays current. This demo does not connect to providers or move money.</p></article>
    </div></div>`;
}

function owedPage() {
  const incoming = state.ious.filter(item => item.direction === "in").reduce((sum, item) => sum + item.amount, 0);
  const outgoing = state.ious.filter(item => item.direction === "out").reduce((sum, item) => sum + item.amount, 0);
  return `${header("DEBTS", "Debts", "Money owed to you and by you.", "Record a debt", "iou")}
    <div class="view-grid"><div>
      <article class="card panel"><div class="panel-heading"><div><h2>Outstanding debts</h2><p>Amounts owed between you and others.</p></div><span class="offer-tag">Private</span></div>
      <div class="owed-highlight"><div class="owed-line"><span>Owed to you</span><strong class="positive">${money(incoming)}</strong></div><div class="owed-line"><span>You owe</span><strong class="negative">${money(outgoing)}</strong></div></div>
      <div class="section-heading"><h2>Recent records</h2></div>
      ${state.ious.map(item => `<div class="iou-row"><span class="avatar ${item.direction === "in" ? "avatar-lilac" : "avatar-peach"}">${item.name.split(" ").map(s => s[0]).join("")}</span><span class="iou-copy"><strong>${escapeHTML(item.name)}</strong><small>${escapeHTML(item.detail)}</small></span><span class="iou-amount ${item.direction === "in" ? "positive" : "negative"}">${item.direction === "in" ? "+" : "−"}${money(item.amount)}<small>${item.direction === "in" ? "owed to you" : "you owe"}</small></span></div>`).join("")}
      </article></div><div>
      <article class="card panel"><div class="panel-heading"><div><h2>About these records</h2><p>Records are for reference only.</p></div><span class="deal-logo">↔</span></div><p>No payment requests are sent, and there are no bank connections in this prototype.</p><button class="button button-small" data-action="iou">＋ Record a debt</button></article>
    </div></div>`;
}

function assistantPage() {
  return `${header("ASSISTANT", "Financial assistant", "Automated help with financial admin, always subject to your approval.", null, null)}
    <div class="assistant-hero"><div><div class="eyebrow">DEMO MODE · NO ACCOUNTS CONNECTED</div><h2>Automated financial admin</h2><p>A preview of tasks an assistant could perform. This prototype shows sample output only; it does not access accounts, submit forms or change documents.</p></div><span class="button button-lime">✳ Demo mode</span></div>
    <div class="agent-grid">
      <article class="card agent-card"><div class="agent-head"><span class="deal-logo">◷</span><span><strong>Bill monitoring</strong><small>Recurring bills and due dates</small></span></div><p>Detects changes in recurring bills and sends a reminder before each due date.</p><span class="demo-pill">SAMPLE TASKS ONLY</span><div style="margin-top:13px"><button class="button button-small" data-action="agent-bills">View sample</button></div></article>
      <article class="card agent-card"><div class="agent-head"><span class="deal-logo rose">▤</span><span><strong>Form preparation</strong><small>Drafts for your review</small></span></div><p>Collects the details a form needs and prepares a draft for you to review before use.</p><span class="demo-pill">REQUIRES YOUR APPROVAL</span><div style="margin-top:13px"><button class="button button-small" data-action="agent-forms">View sample</button></div></article>
      <article class="card agent-card"><div class="agent-head"><span class="deal-logo blue">⌕</span><span><strong>Document search</strong><small>Bills and receipts</small></span></div><p>Sorts bills and receipts into a searchable list by date and supplier.</p><span class="demo-pill">NO FILES ACCESSED</span><div style="margin-top:13px"><button class="button button-small" data-action="agent-docs">View sample</button></div></article>
      <article class="card agent-card"><div class="agent-head"><span class="deal-logo yellow">✧</span><span><strong>Spending review</strong><small>Monthly analysis</small></span></div><p>Summarises monthly spending and identifies categories close to their budget.</p><span class="demo-pill">SAMPLE INSIGHTS</span><div style="margin-top:13px"><button class="button button-small" data-action="agent-insights">View sample</button></div></article>
    </div>
    <p class="fine-print">AI features are illustrative only. No AI service or external integration is connected. In a real product, sensitive actions should require clear permission and your review.</p>`;
}

const pages = {
  overview: { label: "Overview", render: overviewPage },
  budget: { label: "Budget", render: budgetPage, mount: mountBudget },
  deals: { label: "Offers & cashback", render: dealsPage },
  trips: { label: "Travel & savings", render: tripsPage },
  home: { label: "Shared household", render: homePage },
  owed: { label: "Debts", render: owedPage },
  assistant: { label: "Financial assistant", render: assistantPage }
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
    copy: "Record a purchase against the October budget.",
    fields: `<label class="field">Description<input name="name" required maxlength="60" placeholder="e.g. Weekly shop"></label><label class="field">Amount (£)<input name="amount" required type="number" min="0.01" step="0.01" placeholder="0.00"></label><label class="field">Category<select name="category">${state.budget.categories.map(item => `<option value="${item.className}">${escapeHTML(item.name)}</option>`).join("")}</select></label>`,
    onSubmit: data => {
      const amount = Number(data.get("amount"));
      const name = String(data.get("name")).trim();
      const target = state.budget.categories.find(item => item.className === data.get("category"));
      if (!name || !target || !Number.isFinite(amount) || amount <= 0) { toast("Enter a description and a valid amount."); return false; }
      target.spent = round2(target.spent + amount);
      state.budget.spent = round2(state.budget.spent + amount);
      state.transactions.push({ day: 17, name, category: target.className, amount });
      render();
      toast(`${money(amount)} added to ${target.name}.`);
    }
  });
}

function monthlyBudgetModal() {
  showModal({
    title: "Edit monthly budget",
    copy: "Set the total spending limit shown across your monthly overview.",
    fields: `<label class="field">Monthly budget (£)<input name="total" required type="number" min="0.01" step="0.01" value="${state.budget.total.toFixed(2)}"></label>`,
    onSubmit: data => {
      const total = round2(Number(data.get("total")));
      if (!Number.isFinite(total) || total <= 0) { toast("Enter a monthly budget greater than £0."); return false; }
      state.budget.total = total;
      render();
      toast("Monthly budget updated.");
    }
  });
}

function iouModal() {
  showModal({
    title: "Record a debt",
    copy: "Record money owed to you or by you.",
    fields: `<label class="field">Person<input name="person" required maxlength="50" placeholder="Name"></label><label class="field">Description<input name="detail" required maxlength="70" placeholder="e.g. Dinner"></label><label class="field">Amount (£)<input name="amount" required type="number" min="0.01" step="0.01" placeholder="0.00"></label><label class="field">Direction<select name="direction"><option value="in">They owe me</option><option value="out">I owe them</option></select></label>`,
    onSubmit: data => {
      const amount = Number(data.get("amount"));
      const person = String(data.get("person")).trim();
      const detail = String(data.get("detail")).trim();
      if (!person || !detail || !Number.isFinite(amount) || amount <= 0) { toast("Enter a name, a description and a valid amount."); return false; }
      state.ious.unshift({ name: data.get("direction") === "in" ? person : `You owe ${person}`, detail, amount, direction: data.get("direction") });
      render();
      toast("Debt recorded.");
    }
  });
}

function handleAction(action, element) {
  if (action === "expense") return expenseModal();
  if (action === "edit-monthly-budget") return monthlyBudgetModal();
  if (action === "iou") return iouModal();
  if (action === "budget-view") {
    state.budgetView = element.dataset.view;
    return render();
  }
  if (action === "flow-clear") {
    flowView.selected.clear();
    return selectionChanged();
  }
  if (action === "flow-deselect") {
    flowView.selected.delete(element.dataset.id);
    return selectionChanged();
  }
  if (action === "save-deal") {
    const index = Number(element.dataset.index);
    state.savedDeals.has(index) ? state.savedDeals.delete(index) : state.savedDeals.add(index);
    render();
    return toast(state.savedDeals.has(index) ? "Offer saved." : "Offer removed.");
  }
  const messages = {
    "search-deals": "Offer search is not connected in this demo.",
    cashback: "Cashback balance: £23.40.",
    "edit-budget": "Budget editing is not available in this demo.",
    invite: "Invitations are not sent in this demo.",
    "add-bill": "Bill providers are not connected in this demo.",
    goal: "Savings goals are for planning only. Contributions are not processed in this demo.",
    contribute: "Contributions are not processed in this demo.",
    destination: "Planned goals are not saved in this demo.",
    "agent-bills": "Sample: the electricity bill is due in 4 days.",
    "agent-forms": "Sample: a draft would be prepared for your review. Nothing is submitted.",
    "agent-docs": "Sample: 3 bills could be grouped by month. No files were accessed.",
    "agent-insights": `Sample: ${Math.round(state.budget.spent / state.budget.total * 100)}% of the monthly budget is used, with 14 days remaining in October.`
  };
  toast(messages[action] || "This action is not connected in this demo.");
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
  renderHistory();
});

document.querySelector("#mobile-menu").addEventListener("click", () => document.querySelector("#sidebar").classList.toggle("open"));
document.querySelector(".notification-button").addEventListener("click", () => toast("No new notifications."));
document.querySelector(".profile-button").addEventListener("click", () => toast("Account settings are not available in this demo."));

render();
