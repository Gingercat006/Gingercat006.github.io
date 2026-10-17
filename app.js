const state = {
  page: "overview",
  budget: {
    total: 2800,
    spent: 1846.5,
    categories: [
      { name: "Groceries", icon: "✳", className: "grocery", spent: 426.8, limit: 600 },
      { name: "Home & bills", icon: "⌂", className: "home", spent: 714.2, limit: 950 },
      { name: "Travel", icon: "↗", className: "travel", spent: 285.5, limit: 500 },
      { name: "Little joys", icon: "♡", className: "fun", spent: 420, limit: 750 }
    ]
  },
  savedDeals: new Set(),
  transactions: [
    { name: "Weekly shop · Green Basket", category: "Groceries", amount: 64.2, date: "Today" },
    { name: "Electricity · Bright Energy", category: "Home & bills", amount: 82.4, date: "Yesterday" },
    { name: "Train to Brighton", category: "Travel", amount: 31.5, date: "Oct 14" }
  ],
  ious: [
    { name: "Maya Chen", detail: "Dinner · Oct 12", amount: 28.5, direction: "in" },
    { name: "You owe Alex", detail: "Cab home · Oct 10", amount: 16, direction: "out" }
  ]
};

const deals = [
  { brand: "FreshMart", logo: "F", logoClass: "", title: "£5 off your next shop", detail: "Spend £40 or more · Ends Oct 31", value: "£5 back", type: "Groceries" },
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
    <div class="category-row">
      <span class="category-icon ${item.className}">${item.icon}</span>
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

function overviewPage() {
  const percentage = Math.round(state.budget.spent / state.budget.total * 100);
  return `${header("SATURDAY, OCTOBER 17", "A little more room to breathe.", "Here’s your money, all in one place.", "Add expense", "expense")}
    <div class="dashboard-grid">
      <article class="card balance-card">
        <div class="balance-top"><span class="eyebrow">OCTOBER SPENDING</span><select class="period-select" aria-label="Budget period"><option>This month⌄</option></select></div>
        <div class="balance-amount">${money(state.budget.spent)}</div><p class="balance-caption">of ${money(state.budget.total)} monthly budget</p>
        <div class="balance-progress"><div class="progress-meta"><span>Looking good so far</span><strong>${percentage}%</strong></div><div class="progress-track"><div class="progress-fill" style="width:${percentage}%"></div></div><div class="balance-foot"><span>${money(state.budget.total - state.budget.spent)} left to spend</span><strong>↗ On track</strong></div></div>
      </article>
      <article class="card stat-card">
        <div class="card-title-row"><div><div class="card-title">Spending over time</div><p class="card-subtitle">Your last 6 months</p></div><span class="month-change">↓ 8.4%</span></div>
        <div class="chart-total">${money(1846.5)}<span>this month</span></div>
        <div class="chart" aria-label="Spending chart for the last six months">${[62, 78, 57, 90, 70, 54].map((height, index) => `<div class="chart-column"><div class="chart-bar ${index === 5 ? "highlight" : ""}" style="height:${height}%"></div></div>`).join("")}</div>
        <div class="chart-labels"><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span></div>
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
  return `${header("YOUR MONEY, YOUR PACE", "Monthly budget", "A simple plan for where your money goes.", "Add expense", "expense")}
    <div class="view-grid"><div>
      <article class="card balance-card"><div class="balance-top"><span class="eyebrow">OCTOBER SPENDING</span><span class="eyebrow">MONTHLY PLAN</span></div><div class="balance-amount">${money(state.budget.spent)}</div><p class="balance-caption">of ${money(state.budget.total)} planned · ${money(state.budget.total - state.budget.spent)} left</p><div class="balance-progress"><div class="progress-track"><div class="progress-fill" style="width:${Math.min(100, state.budget.spent / state.budget.total * 100)}%"></div></div><div class="balance-foot"><span>${Math.round(state.budget.spent / state.budget.total * 100)}% of your monthly plan</span><strong>↗ On track</strong></div></div></article>
      <div class="section-heading"><h2>Categories</h2><button class="text-link" data-action="edit-budget">Edit monthly plan</button></div>
      <article class="card panel">${state.budget.categories.map(item => `<div class="budget-line"><strong>${item.icon} &nbsp;${escapeHTML(item.name)}</strong><small>${money(item.spent)} / ${money(item.limit)}</small><div class="category-bar"><span style="width:${Math.min(100, item.spent / item.limit * 100)}%"></span></div></div>`).join("")}</article>
    </div><div>
      <article class="card panel"><div class="panel-heading"><div><h2>Recent activity</h2><p>Your latest added expenses.</p></div></div>${state.transactions.map(tx => `<div class="iou-row"><span class="deal-logo">${tx.category === "Groceries" ? "✳" : tx.category === "Travel" ? "↗" : "⌂"}</span><span class="iou-copy"><strong>${escapeHTML(tx.name)}</strong><small>${escapeHTML(tx.category)} · ${escapeHTML(tx.date)}</small></span><span class="iou-amount">−${money(tx.amount)}</span></div>`).join("")}</article>
      <article class="card panel"><div class="panel-heading"><div><h2>A gentler nudge</h2><p>You're spending less than last month.</p></div><span class="deal-logo">✳</span></div><p>Your groceries are at ${money(state.budget.categories[0].spent)} this month, with plenty of room left in the plan. Nice one.</p></article>
    </div></div>`;
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
      <article class="card goal-card"><div class="goal-top"><div class="goal-title"><span class="deal-logo">✈</span><span><strong>Cosy cabin weekend</strong><small>Shared with Maya & Alex · Nov 22–24</small></span></div><span class="offer-tag">On track</span></div><div class="goal-amount">${money(420)} <small>of ${money(900)}</small></div><div class="goal-progress"><span style="width:47%"></span></div><div class="goal-foot"><span>47% saved</span><span>${money(480)} to go</span></div><div class="section-heading"><span class="card-title">Group contributions</span><button class="text-link" data-action="contribute">Add money</button></div><div class="member-list"><div class="member-row"><span class="avatar">JD</span><span class="member-name">Jamie Davis<small>Your contribution</small></span><strong>${money(180)}</strong></div><div class="member-row"><span class="avatar avatar-lilac">MC</span><span class="member-name">Maya Chen<small>Added Oct 13</small></span><strong>${money(140)}</strong></div><div class="member-row"><span class="avatar avatar-blue">AR</span><span class="member-name">Alex Rivera<small>Added Oct 15</small></span><strong>${money(100)}</strong></div></div></article>
      <article class="card panel"><div class="panel-heading"><div><h2>On your wish list</h2><p>Keep ideas here while you plan.</p></div><button class="button button-small" data-action="destination">＋ Add an idea</button></div><div class="empty-note">That spontaneous long weekend? Start a goal and make it happen, one small saving at a time.</div></article>
    </div><div><article class="card panel"><div class="panel-heading"><div><h2>Fare finder</h2><p>Sample deals for getting away.</p></div><span class="deal-logo blue">↗</span></div>${deals.filter(d => d.type !== "Groceries").map(d => `<div class="deal-item" style="margin:14px 0"><span class="deal-logo ${d.logoClass}">${d.logo}</span><span class="deal-copy"><strong>${d.title}</strong><small>${d.brand} · ${d.detail}</small></span></div>`).join("")}</article><p class="fine-print">Savings goals are planning tools only. No payments or bookings are made in this demo.</p></div></div>`;
}

function homePage() {
  return `${header("LIFE TOGETHER", "Willow House", "Shared bills, a little less shared-stress.", "Invite flatmate", "invite")}
    <div class="view-grid"><div>
      <article class="card panel"><div class="panel-heading"><div><h2>October shared bills</h2><p>Everyone can see what's due and what's covered.</p></div><span class="offer-tag">3 flatmates</span></div>
      <div class="home-main" style="margin-bottom:15px"><div class="home-members"><span class="avatar">JD</span><span class="avatar avatar-lilac">MC</span><span class="avatar avatar-blue">AR</span></div><span class="home-copy"><strong>Shared total this month</strong><small>Your share: ${money(72.67)}</small></span><span class="bill-total">${money(218)}<small>all bills</small></span></div>
      ${[["Electricity", "Bright Energy · Due Oct 21", 86, "Due soon"], ["Wi-Fi", "ConnectNow · Paid Oct 4", 42, "Paid"], ["Water", "City Water · Paid Oct 8", 90, "Paid"]].map(b => `<div class="bill-row"><strong>${b[0]}</strong><span class="bill-status">${b[3]}</span><small>${b[1]}</small><strong>${money(b[2])}</strong></div>`).join("")}
      <div class="section-heading"><span class="card-title">This month’s split</span><button class="text-link" data-action="add-bill">＋ Add a bill</button></div>
      ${[["Jamie Davis", 72.67, ""], ["Maya Chen", 72.67, "avatar-lilac"], ["Alex Rivera", 72.66, "avatar-blue"]].map(m => `<div class="member-row" style="padding:7px 0"><span class="avatar ${m[2]}">${m[0].split(" ").map(s=>s[0]).join("")}</span><span class="member-name">${m[0]}<small>Equal share</small></span><strong>${money(m[1])}</strong></div>`).join("")}</article>
    </div><div><article class="card panel"><div class="panel-heading"><div><h2>Housemates</h2><p>Everyone in the same place.</p></div><button class="button button-small" data-action="invite">＋ Invite</button></div><div class="member-list"><div class="member-row"><span class="avatar">JD</span><span class="member-name">Jamie Davis<small>You · Admin</small></span></div><div class="member-row"><span class="avatar avatar-lilac">MC</span><span class="member-name">Maya Chen<small>Joined Sep 2</small></span></div><div class="member-row"><span class="avatar avatar-blue">AR</span><span class="member-name">Alex Rivera<small>Joined Sep 4</small></span></div></div></article>
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
  budget: { label: "Budget", render: budgetPage },
  deals: { label: "Deals & rewards", render: dealsPage },
  trips: { label: "Trips & goals", render: tripsPage },
  home: { label: "Shared home", render: homePage },
  owed: { label: "Money owed", render: owedPage },
  assistant: { label: "Money sidekick", render: assistantPage }
};

function render() {
  const page = pages[state.page] || pages.overview;
  content.innerHTML = page.render();
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

document.querySelector("#mobile-menu").addEventListener("click", () => document.querySelector("#sidebar").classList.toggle("open"));
document.querySelector(".notification-button").addEventListener("click", () => toast("You're all caught up."));
document.querySelector(".profile-button").addEventListener("click", () => toast("Personal account settings are a preview."));

render();
