const $ = s => document.querySelector(s), cart = {};
let cat = "all", q = "";
const kes = n => "KES " + n.toLocaleString();
const total = () => PRODUCTS.reduce((t, p) => t + p.price * (cart[p.id] || 0), 0);
const LABEL = {kitchen: "Home & Kitchen", computer: "Computer", electronics: "Electronics", service: "IT Service"};

function drawGrid() {
  const list = PRODUCTS.filter(p => (cat === "all" || p.cat === cat) && (p.name + p.desc).toLowerCase().includes(q));
  $("#grid").innerHTML = list.length ? list.map(p =>
    `<article class="card"><div class="art" aria-hidden="true">${p.icon}</div>
    <div class="meta"><span class="sku">${p.sku}</span><span class="cat">${LABEL[p.cat]}</span></div>
    <h3>${p.name}</h3><p>${p.desc}</p>
    <div class="row"><strong class="price">${kes(p.price)}</strong><button data-add="${p.id}">Add</button></div></article>`).join("")
    : "<p class='none'>No items match your search. Try another word.</p>";
}
function drawCart() {
  const rows = PRODUCTS.filter(p => cart[p.id]);
  $("#count").textContent = rows.reduce((n, p) => n + cart[p.id], 0);
  $("#items").innerHTML = rows.length ? rows.map(p =>
    `<div class="line"><span>${p.name} × ${cart[p.id]}</span><span>${kes(p.price * cart[p.id])}
    <button class="x" data-rm="${p.id}" aria-label="Remove ${p.name}">✕</button></span></div>`).join("") : "<p>Your cart is empty. Add something from the grid.</p>";
  $("#total").textContent = kes(total());
  $("#checkout").disabled = !rows.length;
}
document.addEventListener("click", e => {
  const t = e.target;
  if (t.dataset.add) { cart[t.dataset.add] = (cart[t.dataset.add] || 0) + 1; drawCart(); $("#cart").hidden = false; }
  if (t.dataset.rm) { delete cart[t.dataset.rm]; drawCart(); }
  if (t.dataset.f) { cat = t.dataset.f; document.querySelectorAll("#tabs button").forEach(b => b.classList.toggle("on", b === t)); drawGrid(); }
});
$("#search").oninput = e => { q = e.target.value.toLowerCase().trim(); drawGrid(); };
$("#cartBtn").onclick = () => $("#cart").hidden = !$("#cart").hidden;
$("#close").onclick = () => $("#cart").hidden = true;
$("#checkout").onclick = () => { $("#term").textContent = "$ fill in the form, then run the payment"; $("#go").disabled = false; $("#pay").showModal(); };
$("#cancel").onclick = () => $("#pay").close();
$("#form").onsubmit = pay;

// Suggest the network from the number prefix (the customer can still change it).
const guess = v => /^(0|254)?(10\d|73\d|78\d|75[0-6])/.test(v.replace(/\D/g, "")) ? "airtel" : "mpesa";
$("#phone").oninput = e => { if (e.target.value.length >= 4) document.querySelector(`input[value=${guess(e.target.value)}]`).checked = true; };

const log = (t, c = "") => { const d = document.createElement("div"); d.textContent = t; d.className = c; $("#term").append(d); $("#term").scrollTop = 1e9; };
function norm(v) {
  v = v.replace(/[\s+-]/g, "");
  if (/^0[17]\d{8}$/.test(v)) v = "254" + v.slice(1);
  return /^254[17]\d{8}$/.test(v) ? v : null;
}
async function pay(e) {
  e.preventDefault();
  const phone = norm($("#phone").value), net = document.querySelector("input[name=net]:checked").value;
  $("#term").textContent = "";
  if (!phone) return log("[ERR] invalid number. Use 07XXXXXXXX or 01XXXXXXXX.", "err");
  const order = "IBG-" + Date.now().toString(36).slice(-6).toUpperCase(), amount = total();
  $("#go").disabled = true;
  log(`$ pay --order=${order} --network=${net} --amount=${amount}`);
  log("> sending prompt to 254*****" + phone.slice(-4) + " ...");
  try {
    const r = await fetch("/api/pay", {method: "POST", headers: {"Content-Type": "application/json"},
      body: JSON.stringify({phone, amount, network: net, order})});
    if ([404, 405].includes(r.status)) return demo(order);
    const d = await r.json();
    if (!r.ok) throw new Error(d.error || "request failed");
    log("> prompt sent. Approve it on your phone with your PIN ...");
    poll(net, d.id, order);
  } catch (err) { err instanceof TypeError ? demo(order) : fail(err.message); }
}
function poll(net, id, order, n = 0) {
  setTimeout(async () => {
    try {
      const d = await (await fetch(`/api/status?network=${net}&id=${encodeURIComponent(id)}`)).json();
      if (d.state === "pending") return n < 15 ? poll(net, id, order, n + 1) : fail("timed out waiting for payment");
      d.state === "paid" ? done(order) : fail(d.message || "payment was not completed");
    } catch { fail("could not check the payment status"); }
  }, 4000);
}
const demo = order => { log("[DEMO] no payment server connected, simulating ..."); setTimeout(() => done(order, true), 3000); };
function done(order, isDemo) {
  log(`[OK] payment confirmed${isDemo ? " (demo)" : ""}. Order ${order}. Thank you, ${$("#name").value}!`, "ok");
  Object.keys(cart).forEach(k => delete cart[k]); drawCart();
  setTimeout(() => { $("#pay").close(); $("#cart").hidden = true; }, 5000);
}
const fail = t => { log("[ERR] " + t, "err"); $("#go").disabled = false; };
drawGrid(); drawCart();
