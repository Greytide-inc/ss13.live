// topic-cases - the table behind tools/topic-check.mjs: one entry per tgui window, one row per href.
// To add a window: add a SCENARIOS entry, run it with
//   node tools/topic-check.mjs --dist build/NAME-dist --only YOURWINDOW
//
// A row is [name, who, href, expect, ok?]
//   who     "A" = Alpha, the player who stands beside the machine with its window open (the legitimate player)
//           "M" = Mallory, a normal (non-admin) player who is far away
//   href    what is sent as {type:"topic", href}. Placeholders: {ui} the ref of Alpha's tgui datum, {machine} the machine's ref,
//           {mob} Alpha's mob ref, {ref:VAR:N} the ref of the Nth object listed in the watched var VAR (see "watch").
//           An array = several hrefs sent one after the other, then the state is read.
//   expect  "changes"   the watched state must be different afterwards (a positive control: proves the href is well formed)
//           "unchanged" the watched state must be exactly the same afterwards (the href was refused)
//           "sane"      anything may change, but ok(after, before, h) must be true (a bad value that the machine may use, clamped)
//   ok      optional extra check run after "changes" and "sane"; gets parsed states (s.v = vars, s.floor = text) and the helpers h
// Every row is also checked for: no runtime in the server log while it ran, and the window's own sane(after, before) if it has one.
// "watch" is the list of vars of the --tgui atom that the game logs when they change ([vm-boot] tgui-watch: ...), plus the items on
// the floor around it (floor: ...); that line is how the check reads the object without trusting a page.

const mats = (s, id) => { const m = new RegExp("\\" + id + "=[^(]*\\(amount=(-?[\\d.e+]+)\\)").exec(s.v.materials ?? ""); return m ? Number(m[1]) : NaN; };
const floorN = (s, re) => (s.floor.split(", ").filter((x) => re.test(x)).reduce((n, x) => n + Number(/ x(\d+)$/.exec(x)?.[1] ?? 0), 0));
const amountOf = (s, re) => { const m = s.floor.split(", ").filter((x) => re.test(x)); return m.map((x) => Number(/\(amount=(-?[\d.e+]+)\)/.exec(x)?.[1] ?? 1)); };
const recAmount = (s, v, n) => { const m = [...(s.v[v] ?? "").matchAll(/@\[0x[0-9a-f]+\]\(amount=(-?[\d.e+]+)\)/g)][n]; return m ? Number(m[1]) : NaN; };
// total sheets of one kind lying on the floor (stack amount x number of stacks)
const sheets = (s, re = /sheet\/metal/) => s.floor.split(", ").filter((x) => re.test(x)).reduce((n, x) => n + Number(/\(amount=(-?[\d.e+]+)\)/.exec(x)?.[1] ?? 1) * Number(/ x(\d+)$/.exec(x)?.[1] ?? 1), 0);
export const helpers = { mats, floorN, amountOf, recAmount, sheets };

const BUCKET = /glass\/bucket x/, METAL = /sheet\/metal/;
const amountsOk = (s) => amountOf(s, /^\/obj\/item\/stack/).every((a) => Number.isInteger(a) && a >= 1 && a <= 50);

// ---- autolathe: ui_act make/category/menu/search/eject; its old Topic (src=machine) is still there
const mk = (id, mult) => `?src={ui}&action=make&id=${id}&multiplier=${encodeURIComponent(mult)}`;
const ej = (mat, amt) => `?src={ui}&action=eject&material=${encodeURIComponent(mat)}&amount=${encodeURIComponent(amt)}`;
const autolathe = [
	// positive controls: the legitimate player's hrefs work (otherwise a "refused" below could just be a wrong href)
	["control: Alpha opens the Tools category", "A", "?src={ui}&action=category&category=Tools", "changes", (a) => a.v.selected_category === "Tools" && a.v.screen === "2"],
	["control: Alpha's old-style href to the machine itself (category)", "A", "?src={machine}&category=Misc&menu=2", "changes", (a) => a.v.selected_category === "Misc"],
	["control: Alpha searches for 'Screw'", "A", "?src={ui}&action=search&to_search=Screw", "changes", (a) => /screwdriver/.test(a.v.matching_designs)],
	["control: Alpha builds a bucket (200 metal, one bucket on the floor)", "A", mk("bucket", 1), "changes", (a, b, h) => h.mats(a, "$metal") === h.mats(b, "$metal") - 200 && h.floorN(a, BUCKET) === h.floorN(b, BUCKET) + 1],
	["control: Alpha builds 5 metal sheets (10000 metal, a stack of 5)", "A", mk("metal", 5), "changes", (a, b, h) => h.mats(a, "$metal") === h.mats(b, "$metal") - 10000 && h.sheets(a) === h.sheets(b) + 5],
	["control: Alpha takes out 1 metal sheet (2000 metal)", "A", ej("$metal", 1), "changes", (a, b, h) => h.mats(a, "$metal") === h.mats(b, "$metal") - 2000 && h.sheets(a) === h.sheets(b) + 1],

	// (a) Mallory sends the legitimate player's exact hrefs: the tgui datum belongs to Alpha (user != usr)
	["Mallory: Alpha's category href", "M", "?src={ui}&action=category&category=Tools", "unchanged"],
	["Mallory: Alpha's build href", "M", mk("bucket", 1), "unchanged"],
	["Mallory: Alpha's eject href", "M", ej("$metal", 1), "unchanged"],
	["Mallory: Alpha's search href", "M", "?src={ui}&action=search&to_search=Screw", "unchanged"],
	["Mallory: Alpha's menu href", "M", "?src={ui}&action=menu&menu=3", "unchanged"],
	// (b) the same actions with src= naming the machine (its own Topic: machinery Topic checks canUseTopic)
	["Mallory: old-style build to the machine", "M", "?src={machine}&make=bucket&multiplier=1", "unchanged"],
	["Mallory: old-style build x10 to the machine", "M", "?src={machine}&make=metal&multiplier=10", "unchanged"],
	["Mallory: old-style category/menu/search to the machine", "M", ["?src={machine}&category=Tools&menu=2", "?src={machine}&search=1&to_search=a&menu=3"], "unchanged"],
	["Mallory: ui_act called straight on the machine", "M", ["?src={machine}&action=make&id=bucket&multiplier=1", "?src={machine}&action=eject&material=%24metal&amount=1"], "unchanged"],

];
const autolatheValues = [
	// (d) bad values from the legitimate player, build: the machine builds whole numbers 1..10 (stacks: 1..50), or refuses
	...["-5", "0", "0.5", "abc", "", "1e9", "1000", "11", "-0", "NaN", "Infinity", "-Infinity", "1e-9"].map((m) => [`Alpha: bucket x '${m}' is refused`, "A", mk("bucket", m), "unchanged"]),
	["Alpha: bucket x 2.5 builds at most 2, charged for what it built", "A", mk("bucket", "2.5"), "sane", (a, b, h) => h.floorN(a, BUCKET) - h.floorN(b, BUCKET) <= 2 && h.mats(b, "$metal") - h.mats(a, "$metal") === 200 * (h.floorN(a, BUCKET) - h.floorN(b, BUCKET))],
	...["-5", "0", "0.5", "abc", "", "1e9", "1000", "51", "Infinity", "-1e9"].map((m) => [`Alpha: metal sheets x '${m}' is refused`, "A", mk("metal", m), "unchanged"]),
	["Alpha: 50 metal sheets is the most a stack takes", "A", mk("metal", 50), "sane", (a, b, h) => h.amountOf(a, METAL).every((x) => x <= 50) && h.mats(a, "$metal") === h.mats(b, "$metal") - 100000],
	// designs the machine doesn't know
	...[["nonexistent"], [""], ["rcd"], ["[0x3000001]"], ["A".repeat(3000)], ["../../x"]].map(([id]) => [`Alpha: build design '${id.slice(0, 20)}' is refused`, "A", mk(id, 1), "unchanged"]),
	["Alpha: build with no id and no multiplier", "A", "?src={ui}&action=make", "unchanged"],
	// the window's other values
	...["Nope", "<img src=x onerror=alert(1)>", "A".repeat(3000), "", "tools"].map((c) => [`Alpha: category '${c.slice(0, 24)}' is refused`, "A", `?src={ui}&action=category&category=${encodeURIComponent(c)}`, "unchanged"]),
	...["99", "-1", "abc", "0.5", "0", ""].map((m) => [`Alpha: menu '${m}' is refused`, "A", `?src={ui}&action=menu&menu=${encodeURIComponent(m)}`, "unchanged"]),
	// eject: whole sheets 1..50 of a material the machine holds
	...["-5", "0", "0.5", "abc", "", "1e9", "51", "120", "Infinity", "-1e9"].map((n) => [`Alpha: eject '${n}' sheets is refused`, "A", ej("$metal", n), "unchanged"]),
	...["$nothing", "metal", "", "[0x3000001]", "$metal$glass"].map((m) => [`Alpha: eject material '${m}' is refused`, "A", ej(m, 1), "unchanged"]),
	["Alpha: eject with no params", "A", "?src={ui}&action=eject", "unchanged"],
	["Alpha: unknown actions and the bare action", "A", ["?src={ui}&action=", "?src={ui}&action=nope", "?src={ui}&action=tgui:nope", "?src={ui}"], "unchanged"],
	["Alpha: a ref that is not the machine's (his own mob) as the tgui datum", "A", "?src={mob}&action=make&id=bucket&multiplier=1", "unchanged"],
];
autolathe.push(
	// the legitimate player walks away: the window is still open but out of range
	["WALK: Alpha walks away", "A", "walk-away", "unchanged"],
	["Alpha, now out of range: build", "A", mk("bucket", 1), "unchanged"],
	["Alpha, now out of range: eject", "A", ej("$metal", 1), "unchanged"],
	["Alpha, now out of range: category", "A", "?src={ui}&action=category&category=Tools", "unchanged"],
	["Alpha, now out of range: old-style href to the machine", "A", "?src={machine}&make=bucket&multiplier=1", "unchanged"],
);
autolatheValues.unshift(autolathe[3], autolathe[4], autolathe[5]); // the same controls (build, build a stack, eject): a refusal below only counts if these work in this run too
const autolatheSane = (a, b) => ["$metal", "$glass"].every((id) => !(mats(a, id) < 0) && !(mats(a, id) > mats(b, id))) && amountsOk(a);

// ---- vending machine: ui_act vend / remove_coin / dispense; the old Topic is still there
const vd = (id) => `?src={ui}&action=vend&id=${id}`; // the placeholders {ref:..} are filled in later, so no encoding here
const vending = [
	["control: Alpha vends product 0 (stock -1, one item on the floor)", "A", vd("{ref:product_records:0}"), "changes", (a, b, h) => h.recAmount(a, "product_records", 0) === h.recAmount(b, "product_records", 0) - 1 && a.floor !== "-"],
	["control: Alpha's old-style href to the machine vends product 1", "A", "?src={machine}&vend={ref:product_records:1}", "changes", (a, b, h) => h.recAmount(a, "product_records", 1) === h.recAmount(b, "product_records", 1) - 1],
	["Mallory: Alpha's vend href", "M", vd("{ref:product_records:0}"), "unchanged"],
	["Mallory: old-style vend to the machine", "M", "?src={machine}&vend={ref:product_records:0}", "unchanged"],
	["Mallory: remove_coin / dispense to the machine", "M", ["?src={machine}&remove_coin=1", "?src={machine}&dispense=x", "?src={machine}&action=vend&id={ref:product_records:0}"], "unchanged"],
	["Mallory: Alpha's remove_coin href", "M", "?src={ui}&action=remove_coin", "unchanged"],
	["Alpha: a premium (coin) product with no coin in the machine is refused", "A", vd("{ref:coin_records:0}"), "unchanged"],
	["Alpha: a hidden product without extended_inventory is refused", "A", vd("{ref:hidden_records:0}"), "unchanged"],
	["Alpha: old-style href for a hidden product is refused too", "A", "?src={machine}&vend={ref:hidden_records:0}", "unchanged"],
	...[["his own mob", "{mob}"], ["the machine itself", "{machine}"], ["the tgui datum", "{ui}"], ["abc", "abc"], ["empty", ""], ["[0x1]", "[0x1]"], ["a ref and junk", "{ref:product_records:0}x"], ["a long text", "A".repeat(3000)], ["a number", "7"]].map(([n, id]) => [`Alpha: vend id = ${n} is refused`, "A", vd(id), "unchanged"]),
	["Alpha: vend with no id", "A", "?src={ui}&action=vend", "unchanged"],
	["Alpha: remove_coin with no money inside", "A", "?src={ui}&action=remove_coin", "unchanged"],
	["Alpha: dispense on a machine with no food compartment", "A", ["?src={ui}&action=dispense&key=x", "?src={ui}&action=dispense", "?src={ui}&action=dispense&key=" + encodeURIComponent("A".repeat(3000))], "unchanged"],
	["Alpha: unknown actions", "A", ["?src={ui}&action=nope", "?src={ui}&action=", "?src={ui}"], "unchanged"],
	["Alpha: vend 40 times: stock stops at 0, never negative", "A", Array(40).fill(vd("{ref:product_records:2}")), "sane", (a, b, h) => h.recAmount(a, "product_records", 2) >= 0],
	["WALK: Alpha walks away", "A", "walk-away", "unchanged"],
	["Alpha, now out of range: vend", "A", vd("{ref:product_records:0}"), "unchanged"],
	["Alpha, now out of range: old-style href to the machine", "A", "?src={machine}&vend={ref:product_records:0}", "unchanged"],
];
const vendingSane = (a, b) => [0, 1, 2, 3].every((n) => !(h2(a, n) < 0));
const h2 = (s, n) => recAmount(s, "product_records", n);

// ---- smartfridge (chemistry/preloaded: 12 epinephrine pills, 5 charcoal pills,) and the drying rack
const EPI = /pill\/epinephrine/;
const EPI_NAME = "epinephrine pill (15u)";
const sv = (name, amount) => `?src={ui}&action=vend&name=${encodeURIComponent(name)}&amount=${encodeURIComponent(amount)}`;
const svOld = (name, amount) => `?src={machine}&vend=${encodeURIComponent(name)}&amount=${encodeURIComponent(amount)}`;
const epi = (s) => floorN(s, EPI);
const smartfridge = [
	["control: Alpha vends 1 epinephrine pill", "A", sv(EPI_NAME, 1), "changes", (a, b) => epi(a) === epi(b) + 1],
	["control: Alpha's old-style href to the machine vends 2", "A", svOld(EPI_NAME, 2), "changes", (a, b) => epi(a) === epi(b) + 2],
	["Mallory: Alpha's vend href", "M", sv(EPI_NAME, 1), "unchanged"],
	["Mallory: Alpha's vend-all href", "M", sv(EPI_NAME, 12), "unchanged"],
	["Mallory: old-style vend to the machine", "M", svOld(EPI_NAME, 1), "unchanged"],
	["Mallory: ui_act's vend called straight on the machine", "M", `?src={machine}&action=vend&name=${encodeURIComponent(EPI_NAME)}&amount=1`, "unchanged"],
	// amounts: whole numbers 1.. only
	...["-5", "0", "0.5", "1.5", "abc", "", "NaN", "Infinity", "-Infinity", "1e-9", "-0"].map((n) => [`Alpha: vend amount '${n}' is refused`, "A", sv(EPI_NAME, n), "unchanged"]),
	...["-5", "0", "abc", "NaN"].map((n) => [`Alpha: old-style vend amount '${n}' is refused`, "A", svOld(EPI_NAME, n), "unchanged"]),
	["Alpha: vend with no amount / no name", "A", ["?src={ui}&action=vend&name=" + encodeURIComponent(EPI_NAME), "?src={ui}&action=vend&amount=1", "?src={ui}&action=vend", "?src={machine}&vend=" + encodeURIComponent(EPI_NAME)], "unchanged"],
	// names the fridge doesn't hold (and its own parts)
	...[["nonexistent"], [""], ["epinephrine pill"], ["{machine}"], ["{mob}"], ["A".repeat(3000)], ["Smartfridge (Machine Board)"], ["matter bin"]].map(([n]) => [`Alpha: vend name '${n.slice(0, 20)}' is refused`, "A", sv(n, 1), "unchanged"]),
	["Alpha: vend 1000 (more than it holds): only the stock comes out", "A", sv(EPI_NAME, 1000), "sane", (a) => epi(a) <= 12],
	["Alpha: nothing left: vending again changes nothing", "A", [sv(EPI_NAME, 1), svOld(EPI_NAME, 99)], "unchanged"],
	["Alpha: unknown actions", "A", ["?src={ui}&action=nope", "?src={ui}&action=", "?src={ui}", "?src={ui}&action=dry"], "unchanged"],
	["WALK: Alpha walks away", "A", "walk-away", "unchanged"],
	["Alpha, now out of range: vend", "A", sv("charcoal pill (50u)", 1), "unchanged"],
	["Alpha, now out of range: old-style vend", "A", svOld("charcoal pill (50u)", 1), "unchanged"],
];
const smartfridgeSane = (a, b) => epi(a) <= 12;
const dry = "?src={ui}&action=dry";
const rack = [
	["control: Alpha switches the rack on", "A", dry, "changes", (a) => a.v.drying === "1"],
	["control: Alpha's old-style href switches it off", "A", "?src={machine}&dry=1", "changes", (a) => a.v.drying === "0"],
	["Mallory: Alpha's dry href", "M", dry, "unchanged"],
	["Mallory: old-style dry to the machine", "M", "?src={machine}&dry=1", "unchanged"],
	["Mallory: ui_act's dry called straight on the machine", "M", "?src={machine}&action=dry", "unchanged"],
	["Alpha: unknown actions and a vend on an empty rack", "A", ["?src={ui}&action=nope", "?src={ui}&action=", "?src={ui}", "?src={ui}&action=vend&name=x&amount=1", "?src={machine}&vend=x&amount=1", "?src={machine}&dry=", "?src={machine}&other=1"], "unchanged"],
	["Alpha: junk dry values still only toggle (twice = back where it was)", "A", ["?src={ui}&action=dry&dry=5&x=%00", "?src={ui}&action=dry&dry=-1"], "unchanged"],
	["WALK: Alpha walks away", "A", "walk-away", "unchanged"],
	["Alpha, now out of range: dry", "A", dry, "unchanged"],
	["Alpha, now out of range: old-style dry", "A", "?src={machine}&dry=1", "unchanged"],
];

// ---- exosuit fabricator (30000 metal, no glass): ui_act part_set/back/build/add_to_queue/partset_to_queue/remove_from_queue/queue_move/process_queue/clear_queue/sync/remove_mat; the old Topic is still there
const qn = (s) => ((s.v.queue ?? "").match(/\/datum\/design/g)?.length ?? 0) + Number(/,\+(\d+) more\]/.exec(s.v.queue ?? "")?.[1] ?? 0); // the watch line lists the first 90 and says how many more
const fa = (action, q = "") => `?src={ui}&action=${action}${q}`;
const old = (q) => `?src={machine}&${q}`;
const bd = (id) => fa("build", `&id=${encodeURIComponent(id)}`);
const aq = (id) => fa("add_to_queue", `&id=${encodeURIComponent(id)}`);
const qm = (dir, index) => fa("queue_move", `&dir=${encodeURIComponent(dir)}&index=${encodeURIComponent(index)}`);
const rq = (index) => fa("remove_from_queue", `&index=${encodeURIComponent(index)}`);
const rm = (amount, material = "$metal") => fa("remove_mat", `&amount=${encodeURIComponent(amount)}&material=${encodeURIComponent(material)}`);
const FABW = "screen,part_set,queue,being_built,processing_queue,materials,temp";
const fabricator = [
	// positive controls
	["control: Alpha opens the Ripley set", "A", fa("part_set", "&set=Ripley"), "changes", (a) => a.v.part_set === "Ripley" && a.v.screen === "parts"],
	["control: Alpha's old-style href (Firefighter set)", "A", old("part_set=Firefighter"), "changes", (a) => a.v.part_set === "Firefighter"],
	["control: Alpha goes back", "A", fa("back"), "changes", (a) => a.v.screen === "main"],
	["control: Alpha queues a chassis", "A", aq("ripley_chassis"), "changes", (a) => qn(a) === 1],
	["control: Alpha's old-style href queues another", "A", old("add_to_queue=ripley_chassis"), "changes", (a) => qn(a) === 2],
	["control: Alpha clears the queue", "A", fa("clear_queue"), "changes", (a) => qn(a) === 0],
	["control: Alpha takes out 1 metal sheet (2000 metal)", "A", rm(1), "changes", (a, b, h) => h.mats(a, "$metal") === h.mats(b, "$metal") - 2000 && h.sheets(a) === h.sheets(b) + 1],
	["control: Alpha builds a chassis (20000 metal, a chassis on the floor)", "A", bd("ripley_chassis"), "changes", (a, b, h) => h.mats(a, "$metal") === h.mats(b, "$metal") - 20000 && /chassis\/ripley/.test(a.floor) && !/chassis\/ripley/.test(b.floor)],

	// (a) Mallory (far away): Alpha's hrefs on the tgui route, and the machine's own Topic
	["Mallory: Alpha's part_set href", "M", fa("part_set", "&set=Ripley"), "unchanged"],
	["Mallory: Alpha's build href", "M", bd("ripley_chassis"), "unchanged"],
	["Mallory: Alpha's add_to_queue / partset_to_queue hrefs", "M", [aq("ripley_chassis"), fa("partset_to_queue", "&set=Ripley")], "unchanged"],
	["Mallory: Alpha's process_queue / clear_queue / sync hrefs", "M", [fa("process_queue"), fa("clear_queue"), fa("sync")], "unchanged"],
	["Mallory: Alpha's remove_mat href", "M", rm(1), "unchanged"],
	["Mallory: Alpha's queue hrefs (remove, move)", "M", [rq(1), qm(1, 1)], "unchanged"],
	["Mallory: old-style part, part_set, screen, add_to_queue to the machine", "M", [old("part=ripley_chassis"), old("part_set=Ripley"), old("screen=parts"), old("add_to_queue=ripley_chassis")], "unchanged"],
	["Mallory: old-style queue, sync, clear to the machine", "M", [old("partset_to_queue=Ripley"), old("process_queue=1"), old("clear_queue=1"), old("sync=1"), old("remove_from_queue=1"), old("queue_move=1&index=1")], "unchanged"],
	["Mallory: old-style remove_mat to the machine", "M", [old("remove_mat=1&material=%24metal"), old("remove_mat=50&material=%24metal")], "unchanged"],
	["Mallory: ui_act called straight on the machine", "M", [old("action=build&id=ripley_chassis"), old("action=remove_mat&amount=1&material=%24metal"), old("action=add_to_queue&id=ripley_chassis")], "unchanged"],
	["Alpha: unknown actions", "A", [fa("nope"), "?src={ui}&action=", "?src={ui}", fa("process_queue_x")], "unchanged"],
	["WALK: Alpha walks away", "A", "walk-away", "unchanged"],
	["Alpha, now out of range: build", "A", bd("ripley_chassis"), "unchanged"],
	["Alpha, now out of range: remove_mat", "A", rm(1), "unchanged"],
	["Alpha, now out of range: add_to_queue + part_set", "A", [aq("ripley_chassis"), fa("part_set", "&set=Ripley")], "unchanged"],
	["Alpha, now out of range: old-style build", "A", old("part=ripley_chassis"), "unchanged"],
];
const fabricatorValues = [
	["control: Alpha queues 3 chassis and 1 torso", "A", [aq("ripley_chassis"), aq("ripley_chassis"), aq("ripley_chassis"), aq("ripley_torso")], "changes", (a) => qn(a) === 4],
	["control: Alpha moves the torso up one", "A", qm(-1, 4), "changes"],
	["control: Alpha removes queue entry 4", "A", rq(4), "changes", (a) => qn(a) === 3],
	// queue_move / remove_from_queue values
	...[["1", "0"], ["-1", "4"], ["-1", "0"], ["-1", "1"], ["1", "3"], ["1", "99"], ["-1", "99"], ["99", "1"], ["-99", "3"], ["1", "1.5"], ["1.5", "2"], ["x", "2"], ["1", "x"], ["", ""], ["1", "-1"], ["1e9", "1"]].map(([d, i]) => [`Alpha: queue_move dir '${d}' index '${i}' is refused`, "A", qm(d, i), "unchanged"]),
	...["0", "-1", "4", "99", "1.5", "abc", "", "NaN", "1e9"].map((i) => [`Alpha: remove_from_queue '${i}' is refused`, "A", rq(i), "unchanged"]),
	// part_set / screen / partset_to_queue values
	...["Nope", "", "clear2", "A".repeat(3000), "<b>x</b>"].map((n) => [`Alpha: part_set '${n.slice(0, 20)}' is refused`, "A", fa("part_set", `&set=${encodeURIComponent(n)}`), "unchanged"]),
	...["Nope", "", "A".repeat(3000), "ripley", "Ripley2"].map((n) => [`Alpha: partset_to_queue '${n.slice(0, 20)}' is refused`, "A", fa("partset_to_queue", `&set=${encodeURIComponent(n)}`), "unchanged"]),
	["Alpha: old-style screen values are refused", "A", [old("screen=nope"), old("screen="), old("screen=%3Cb%3E")], "unchanged"],
	// builds: designs, ids, materials
	...["nonexistent", "", "rcd", "[0x3000001]", "A".repeat(3000), "../../x", "RIPLEY_CHASSIS"].map((id) => [`Alpha: build design '${id.slice(0, 20)}' is refused`, "A", bd(id), "unchanged"]),
	["Alpha: build with no id", "A", fa("build"), "unchanged"],
	["Alpha: a torso (needs glass, there is none) is not built for free", "A", [bd("ripley_torso"), old("part=ripley_torso")], "unchanged"],
	["Alpha: a torso is not queued-and-built for free either (process_queue stops, no glass)", "A", [fa("clear_queue"), aq("ripley_torso"), fa("process_queue")], "sane", (a, b, h) => !/part\/ripley_torso/.test(a.floor) && h.mats(a, "$metal") === h.mats(b, "$metal")],
	["Alpha: dismisses the red message (it has line breaks, which would hide the floor from this test)", "A", old("clear_temp=1"), "changes", (a) => !/Not enough/.test(a.v.temp ?? "")],
	["Alpha: clears the queue", "A", fa("clear_queue"), "changes", (a) => qn(a) === 0],
	["Alpha: partset_to_queue 20 times (7 parts each): the queue stops at 100", "A", Array(20).fill(fa("partset_to_queue", "&set=Cyborg")), "sane", (a) => qn(a) === 100], // 20, not more: the game ignores a player's hrefs past 100 in one game minute (MINUTE_TOPIC_LIMIT), which would stop the burst before the cap does and swallow the rows after it
	["Alpha: clears the queue again", "A", fa("clear_queue"), "changes", (a) => qn(a) === 0],
	["Alpha: two builds at once charge one chassis only", "A", [bd("ripley_chassis"), bd("ripley_chassis")], "changes", (a, b, h) => h.mats(b, "$metal") - h.mats(a, "$metal") === 20000],
	// remove_mat values: whole sheets, charged for what came out
	...["-5", "0", "0.5", "abc", "", "NaN", "-Infinity", "-1e9"].map((n) => [`Alpha: remove_mat '${n}' is refused`, "A", rm(n), "unchanged"]),
	...["$nothing", "metal", "", "[0x3000001]", "$metal$glass", "$glass"].map((m) => [`Alpha: remove_mat material '${m}' is refused`, "A", rm(1, m), "unchanged"]),
	["Alpha: remove_mat with no params", "A", fa("remove_mat"), "unchanged"],
	["Alpha: remove_mat 1.5 gives one sheet, charged for one", "A", rm("1.5"), "changes", (a, b, h) => h.sheets(a) === h.sheets(b) + 1 && h.mats(b, "$metal") - h.mats(a, "$metal") === 2000],
	["Alpha: remove_mat 1e9 gives what is left, never a negative store", "A", rm("1e9"), "changes", (a, b, h) => h.mats(a, "$metal") >= 0 && h.sheets(a) - h.sheets(b) === (h.mats(b, "$metal") - h.mats(a, "$metal")) / 2000],
	["Alpha: remove_mat Infinity gives nothing more", "A", rm("Infinity"), "unchanged"],
];
const fabRetrieve = [
	["control: Alpha takes out 1 metal sheet", "A", rm(1), "changes", (a, b, h) => h.mats(a, "$metal") === h.mats(b, "$metal") - 2000 && h.sheets(a) === h.sheets(b) + 1],
	["Alpha: 120 sheets are all charged for (240000), 120 sheets lie on the floor", "A", rm(120), "changes", (a, b, h) => h.mats(a, "$metal") === h.mats(b, "$metal") - 240000 && h.sheets(a) === h.sheets(b) + 120],
	["Alpha: 51 sheets (50 + 1) charge 102000", "A", rm(51), "changes", (a, b, h) => h.mats(a, "$metal") === h.mats(b, "$metal") - 102000 && h.sheets(a) === h.sheets(b) + 51],
	["Alpha: 50 sheets charge 100000", "A", rm(50), "changes", (a, b, h) => h.mats(a, "$metal") === h.mats(b, "$metal") - 100000 && h.sheets(a) === h.sheets(b) + 50],
	["Alpha: asking for more than is left gives what is left (never a negative store)", "A", rm(500), "changes", (a, b, h) => h.mats(a, "$metal") >= 0 && h.sheets(a) - h.sheets(b) === (h.mats(b, "$metal") - h.mats(a, "$metal")) / 2000],
];
const fabSane = (a) => !(mats(a, "$metal") < 0) && amountsOk(a);


// ps-stacks: a stack of 50 metal sheets in Alpha's hand (the window is the stack's own). Recipe slots (1-based): 6 bed, 7 a divider (null), 8 rack parts (1 sheet, an item),
// 9 closet (2 sheets, 15 s build), 13 floor tile (1 sheet -> 4 tiles, stack of 20 at most), 14 metal rod (1 -> 2, 60). Held items are listed with the floor.
const mkS = (id, m) => `?src={ui}&action=make&id=${id}&multiplier=${m}`, mkO = (id, m) => `?src={machine}&make=${id}&multiplier=${m}`;
const METALS = /sheet\/metal/, TILES = /tile\/plasteel/, RACKS = /rack_parts/;
const stackSane = (a) => { const all = a.floor.split(", ").filter((x) => /\(amount=/.test(x)); return all.every((x) => { const n = Number(/\(amount=(-?[\d.e+]+)\)/.exec(x)[1]); return Number.isInteger(n) && n >= 0 && n <= (/tile/.test(x) ? 20 : 50); }); };
const stack = [
	["control: Alpha builds rack parts with the window's href", "A", mkS(8, 1), "changes", (a, b, h) => h.sheets(a) === h.sheets(b) - 1 && h.floorN(a, RACKS) === h.floorN(b, RACKS) + 1],
	["control: Alpha's old-style href builds rack parts", "A", mkO(8, 1), "changes", (a, b, h) => h.sheets(a) === h.sheets(b) - 1 && h.floorN(a, RACKS) === h.floorN(b, RACKS) + 1],
	["control: Alpha builds floor tiles x2 (8 tiles for 2 sheets)", "A", mkS(13, 2), "changes", (a, b, h) => h.sheets(a) === h.sheets(b) - 2 && h.sheets(a, TILES) === h.sheets(b, TILES) + 8],
	["control: Alpha's old-style href builds floor tiles x3", "A", mkO(13, 3), "changes", (a, b, h) => h.sheets(a) === h.sheets(b) - 3 && h.sheets(a, TILES) >= h.sheets(b, TILES) + 12],
	["Mallory: Alpha's make href", "M", mkS(8, 1), "unchanged"],
	["Mallory: old-style make", "M", mkO(8, 1), "unchanged"],
	["Mallory: ui_act's make called straight on the stack", "M", "?src={machine}&action=make&id=8&multiplier=1", "unchanged"],
	["Alpha: make with an unknown slot (0, negative, past the end, divider, text)", "A", [0, -1, -8, 99, 1000000, 7, 10, 12, "", "abc", "null", "%00", "1e9", "NaN"].map((i) => mkS(i, 1)), "unchanged"],
	["Alpha: the same slots, old-style", "A", [0, -1, 99, 7, "", "abc", "1e9"].map((i) => mkO(i, 1)), "unchanged"],
	["Alpha: a list-ish or fractional slot", "A", ["?src={ui}&action=make&id[]=8&multiplier=1", "?src={ui}&action=make&multiplier=1", "?src={ui}&action=make", "?src={machine}&make=8.5&multiplier=1", mkS("8.5", 1), mkS("-0.5", 1)], "unchanged"],
	["Alpha: bad multipliers (0, negative, text, empty, NaN, huge)", "A", [0, -1, -5, "abc", "", "NaN", "inf", "1e9", 1000000, 99999999999].map((m) => mkS(8, m)), "unchanged"],
	["Alpha: bad multipliers, old-style", "A", [0, -1, "abc", "", "1e9"].map((m) => mkO(8, m)), "unchanged"],
	["Alpha: a fractional multiplier takes no half sheet", "A", [mkS(8, 1.5), mkS(13, 0.5), mkO(8, 2.5)], "sane", (a) => stackSane(a)],
	["Alpha: more than the stack holds (floor tiles x60 needs 60 of 49 or so)", "A", [mkS(13, 60), mkS(8, 60), mkO(13, 60)], "unchanged"],
	["Alpha: floor tiles x21 would be a stack of 84 (a tile stack holds 20)", "A", [mkS(13, 21), mkO(13, 21)], "sane", (a) => stackSane(a)],
	["Alpha: a multiplier on a recipe that makes one thing (rack parts x5)", "A", [mkS(8, 5), mkO(8, 5)], "sane", (a, b, h) => stackSane(a) && h.sheets(a) >= h.sheets(b) - 1],
	["Alpha: unknown actions", "A", ["?src={ui}&action=nope", "?src={ui}&action=", "?src={ui}", "?src={machine}&other=1", "?src={machine}&multiplier=1"], "unchanged"],
	["Alpha: 20 rack-part builds in a burst", "A", Array(20).fill(mkS(8, 1)), "sane", (a) => stackSane(a)],
	["Alpha: 20 floor-tile builds of 5 in a burst use the stack up and never go below 0", "A", Array(20).fill(mkS(13, 5)), "sane", (a, b, h) => stackSane(a) && h.sheets(a) >= 0],
	["Alpha: the last sheets go, then the used-up stack's hrefs do nothing", "A", [mkS(13, 1), mkS(13, 1), mkS(13, 1), mkS(13, 1), mkS(13, 1), mkS(8, 1), mkO(8, 1), mkS(13, 1)], "sane", (a, b, h) => stackSane(a) && h.sheets(a) === 0 && h.floorN(a, RACKS) <= h.floorN(b, RACKS) + 1],
];

// ps-tagger: a destination tagger in Alpha's hand (watch currTag; TAGGERLOCATIONS has 23 places, 0 = none). Hrefs: Alpha's window sends action=set_tag&index=N.
const tgS = (n) => `?src={ui}&action=set_tag&index=${n}`, tgO = (n) => `?src={machine}&nextTag=${n}`;
const tagOk = (a) => { const t = a.v.currTag; return t === undefined || t === "0" || (/^\d+$/.test(t) && Number(t) >= 1 && Number(t) <= 23); };
const tagger = [
	["control: Alpha picks place 5 with the window's href", "A", tgS(5), "changes", (a) => a.v.currTag === "5"],
	["control: Alpha's old-style href picks place 9", "A", tgO(9), "changes", (a) => a.v.currTag === "9"],
	["Mallory: Alpha's set_tag href", "M", tgS(3), "unchanged"],
	["Mallory: old-style nextTag", "M", tgO(3), "unchanged"],
	["Mallory: ui_act's set_tag called straight on the tagger", "M", "?src={machine}&action=set_tag&index=3", "unchanged"],
	["Alpha: places outside the list (0, negative, 24, past the end, huge)", "A", [0, -1, -5, 24, 25, 99, 1000000, "1e9", 99999999999].map(tgS), "sane", (a) => tagOk(a)],
	["Alpha: the same, old-style", "A", [0, -1, 24, 99, "1e9"].map(tgO), "sane", (a) => tagOk(a)],
	["Alpha: fractional, text, empty, NaN", "A", [2.5, 0.5, 22.9, "abc", "", "NaN", "inf", "null", "%00", "1e1"].map(tgS), "sane", (a) => tagOk(a)],
	["Alpha: the same, old-style", "A", [2.5, 23.5, "abc", "", "NaN"].map(tgO), "sane", (a) => tagOk(a)],
	["Alpha: list-ish or missing index", "A", ["?src={ui}&action=set_tag&index[]=4", "?src={ui}&action=set_tag", "?src={machine}&nextTag[]=4", "?src={machine}&nextTag="], "sane", (a) => tagOk(a)],
	["Alpha: unknown actions", "A", ["?src={ui}&action=nope&index=4", "?src={ui}&action=&index=4", "?src={ui}"], "unchanged"],
	["Alpha: 20 picks in a burst", "A", Array.from({ length: 20 }, (_, i) => tgS(1 + (i * 7) % 23)), "sane", (a) => tagOk(a)],
];

// ps-tagger: a signaler in Alpha's hand (watch frequency, code, sent; "sent" = a test-aid count of lastsignalers entries, one per signal sent).
// Window hrefs: action=freq&adjust=N, action=code&adjust=N, action=send. Old-style: ?src=item&freq=N / code=N / send=1.
const sgF = (n) => `?src={ui}&action=freq&adjust=${n}`, sgC = (n) => `?src={ui}&action=code&adjust=${n}`, sgSend = "?src={ui}&action=send";
const sgFo = (n) => `?src={machine}&freq=${n}`, sgCo = (n) => `?src={machine}&code=${n}`;
const sigOk = (a) => { const f = Number(a.v.frequency), c = Number(a.v.code); return Number.isInteger(f) && f >= 1200 && f <= 1600 && Number.isInteger(c) && c >= 1 && c <= 100; };
const sent = (s) => Number(s.v.sent);
const signaler = [
	["control: Alpha's frequency button (+2)", "A", sgF(2), "changes", (a, b) => Number(a.v.frequency) === Number(b.v.frequency) + 2],
	["control: Alpha's old-style frequency href (+2)", "A", sgFo(2), "changes", (a, b) => Number(a.v.frequency) === Number(b.v.frequency) + 2],
	["control: Alpha's code button (+5)", "A", sgC(5), "changes", (a, b) => Number(a.v.code) === Number(b.v.code) + 5],
	["control: Alpha's old-style code href (+5)", "A", sgCo(5), "changes", (a, b) => Number(a.v.code) === Number(b.v.code) + 5],
	["control: Alpha's send button sends a signal", "A", sgSend, "changes", (a, b) => sent(a) === sent(b) + 1],
	["Mallory: Alpha's freq, code and send hrefs", "M", [sgF(2), sgC(5), sgSend], "unchanged"],
	["Mallory: old-style freq, code and send", "M", [sgFo(2), sgCo(5), "?src={machine}&send=1"], "unchanged"],
	["Mallory: ui_act's actions called straight on the signaler", "M", ["?src={machine}&action=freq&adjust=2", "?src={machine}&action=code&adjust=5", "?src={machine}&action=send"], "unchanged"],
	["control: Alpha's old-style send sends a signal (after Mallory's rows: the send button's signal throttles sends for 1 s, dc7c4b40)", "A", "?src={machine}&send=1", "changes", (a, b) => sent(a) === sent(b) + 1],
	["Mallory: the uiclose command on Alpha's window (refs count up, so she can guess it)", "M", "winset?command=uiclose%20{ui}", "unchanged"],
	["Alpha's window is still open after Mallory's hrefs (its code button still works)", "A", sgC(1), "changes", (a, b) => Number(a.v.code) === Number(b.v.code) + 1],
	["Alpha: fractional frequency adjusts stay whole", "A", [0.5, 1.5, 2.25].map(sgF), "sane", sigOk],
	["Alpha: fractional frequency adjusts, old-style", "A", [0.5, 1.5, 2.25].map(sgFo), "sane", sigOk],
	["Alpha: frequency adjust, negative/huge/text/NaN", "A", [-1000, 1e9, -99999999999, "abc", "", "NaN", "inf", "null"].map(sgF), "sane", sigOk],
	["Alpha: frequency, the same old-style", "A", [-0.3, 1e9, "abc", "", "NaN"].map(sgFo), "sane", sigOk],
	["Alpha: fractional code adjusts stay whole", "A", [0.5, 1.5, 2.25].map(sgC), "sane", sigOk],
	["Alpha: fractional code adjusts, old-style", "A", [0.5, 1.5, 2.25].map(sgCo), "sane", sigOk],
	["Alpha: code adjust, negative/huge/text/NaN", "A", [-1000, 1e9, -99999999999, "abc", "", "NaN", "inf", "null"].map(sgC), "sane", sigOk],
	["Alpha: code, the same old-style", "A", [-0.3, 1e9, "abc", "", "NaN"].map(sgCo), "sane", sigOk],
	["Alpha: list-ish or missing adjust", "A", ["?src={ui}&action=freq", "?src={ui}&action=code", "?src={ui}&action=freq&adjust[]=4", "?src={ui}&action=code&adjust[]=4", "?src={machine}&freq[]=4", "?src={machine}&code[]=4"], "sane", sigOk],
	["Alpha: unknown actions", "A", ["?src={ui}&action=nope", "?src={ui}&action=&adjust=3", "?src={ui}"], "unchanged"],
	["Alpha: the frequency pushed past the top (3 x +100) stays inside 1200..1600", "A", Array(3).fill(sgF(100)), "sane", sigOk],
	["Alpha: ... and past the bottom (3 x -100)", "A", Array(3).fill(sgF(-100)), "sane", sigOk],
	["Alpha: code limits 1..100 hold at the top and the bottom", "A", Array(3).fill(sgC(100)), "sane", (a) => sigOk(a) && a.v.code === "100"],
	["Alpha: ... and at the bottom", "A", Array(3).fill(sgC(-100)), "sane", (a) => sigOk(a) && a.v.code === "1"],
	["Alpha: 20 sends in a burst", "A", Array(20).fill(sgSend), "sane", (a, b) => sigOk(a) && sent(a) >= sent(b) + 1 && sent(a) <= sent(b) + 20],
];

// ps-pda: the player's own PDA (watch mode,fon,silent,toff,scanmode,id,inserted_item,cartridge,ttone,tnote,note). Three href forms:
// Alpha's window "?src={ui}&action=choice&choice=X", old-style "?src={machine}&choice=X", and ui_act called straight on the item.
// --again --fresh does not remake the own PDA, so every changing row is followed by one that puts it back.
const pdC = (c, extra = "") => `?src={ui}&action=choice&choice=${c}${extra}`, pdO = (c, extra = "") => `?src={machine}&choice=${c}${extra}`, pdD = (c) => `?src={machine}&action=choice&choice=${c}`;
const pdaMode = (a) => { const m = a.v.mode; return m !== undefined && /^\d+$/.test(m); };
const pda = [
	["control: Alpha's flashlight button turns it on", "A", pdC("Light"), "changes", (a) => a.v.fon === "1"],
	["control: ... and off again", "A", pdC("Light"), "changes", (a) => a.v.fon === "0"],
	["control: Alpha's old-style Light href", "A", pdO("Light"), "changes", (a) => a.v.fon === "1"],
	["control: ... and off again (old-style)", "A", pdO("Light"), "changes", (a) => a.v.fon === "0"],
	["control: Toggle Ringer with the window href", "A", pdC("Toggle Ringer"), "changes"],
	["control: ... back", "A", pdO("Toggle Ringer"), "changes"],
	["control: Toggle Messenger with the window href", "A", pdC("Toggle Messenger"), "changes"],
	["control: ... back", "A", pdO("Toggle Messenger"), "changes"],
	["control: the Notekeeper page (mode 1)", "A", pdC("1"), "changes", (a) => a.v.mode === "1"],
	["control: ... and back to the menu (mode 0)", "A", pdO("0"), "changes", (a) => a.v.mode === "0"],
	["Mallory: Alpha's Light, Ringer, Messenger and mode hrefs", "M", [pdC("Light"), pdC("Toggle Ringer"), pdC("Toggle Messenger"), pdC("1")], "unchanged"],
	["Mallory: the same, old-style", "M", [pdO("Light"), pdO("Toggle Ringer"), pdO("Toggle Messenger"), pdO("2")], "unchanged"],
	["Mallory: action=choice and remove_pen called straight on the item", "M", [pdD("Light"), pdD("Toggle Ringer"), pdD("Toggle Messenger"), pdD("3"), "?src={machine}&action=remove_pen"], "unchanged"],
	["Mallory: Alpha's remove_pen href", "M", "?src={ui}&action=remove_pen", "unchanged"],
	["Mallory: Authenticate, UpdateInfo, Eject, Clear, Ringtone, Edit, pai", "M", ["Authenticate", "UpdateInfo", "Eject", "Clear", "Ringtone", "Edit", "pai&option=1", "pai&option=2", "Detonate"].flatMap((c) => [pdC(c), pdO(c)]), "unchanged"],
	["Mallory: the cartridge's own action straight at the PDA", "M", ["?src={ui}&action=cart&choice=Signal+Frequency&sfreq=5", "?src={ui}&action=cart&choice=Send+Signal", "?src={machine}&action=cart&choice=Supply+Orders", "?src={machine}&choice=cart&cartopt=1"], "unchanged"],
	["Alpha's window still works after Mallory's hrefs", "A", pdC("Light"), "changes", (a) => a.v.fon === "1"],
	["control: ... light off", "A", pdC("Light"), "changes", (a) => a.v.fon === "0"],
	["Alpha: Eject/Authenticate/UpdateInfo/pai with nothing to act on", "A", ["Eject", "pai", "pai&option=1", "pai&option=2", "Authenticate", "UpdateInfo", "Detonate", "Clear"].map((c) => pdC(c)), "sane", (a) => pdaMode(a)],
	["Alpha: 20 light toggles in a burst (even, ends where it started)", "A", Array(20).fill(pdC("Light")), "sane", (a) => a.v.fon === "0"],
];
// ps-pda: bad values. The mode is a page number; "choice" that is not a known name goes through text2num into mode.
const pdaValues = [
	["control: mode 1 with a number", "A", pdC("1"), "changes", (a) => a.v.mode === "1"],
	...["-1", "1.5", "0.5", "1e9", "99999999999", "1000", "abc", "", "NaN", "inf", "null", "%00", "1e1"].flatMap((c) => [
		[`Alpha: mode "${c}" (window href) leaves a whole page number`, "A", pdC(c), "sane", (a) => pdaMode(a) && Number(a.v.mode) <= 999],
		[`Alpha: mode "${c}" (old-style) leaves a whole page number`, "A", pdO(c), "sane", (a) => pdaMode(a) && Number(a.v.mode) <= 999],
	]),
	["Alpha: pages that need a cartridge the PDA does not have (41-47, 433, 441, 451, 49, 53, 99)", "A", ["41", "42", "43", "44", "45", "46", "47", "48", "49", "431", "433", "441", "451", "53", "99", "5", "6", "7", "8", "9"].map((c) => pdC(c)), "sane", (a) => pdaMode(a)],
	["control: back to the menu", "A", pdC("0"), "changes", (a) => a.v.mode === "0"],
	["Alpha: Return from every mode", "A", ["1", "Return", "21", "Return", "Return", "99", "Return", "-3", "Return", "1e9", "Return", "0"].map((c) => pdC(c)), "sane", (a) => pdaMode(a)],
	["Alpha: Message to things that are not PDAs (self, her mob, nothing, junk)", "A", [pdC("Message", "&target={machine}"), pdC("Message", "&target={mob}"), pdC("Message"), pdC("Message", "&target=abc"), pdC("Message", "&target[]=1"), pdC("Message", "&target=%5Bnot_a_ref%5D")], "sane", (a) => pdaMode(a)],
	["Alpha: the cartridge action with no cartridge, junk params", "A", ["?src={ui}&action=cart", "?src={ui}&action=cart&choice=Power+Select&target=999", "?src={ui}&action=cart&op=control&bot={mob}", "?src={ui}&action=cart&op=summon", "?src={ui}&action=cart&mule=go"], "sane", (a) => pdaMode(a)],
	["Alpha: unknown actions, close, missing choice", "A", ["?src={ui}&action=nope", "?src={ui}&action=choice", "?src={ui}&action=choice&choice[]=1", "?src={machine}&close=1&choice=Light", "?src={ui}"], "sane", (a) => pdaMode(a) && a.v.fon === "0"],
	["Alpha: 20 modes in a burst", "A", Array.from({ length: 20 }, (_, i) => pdC(String((i * 37) % 60))), "sane", (a) => pdaMode(a)],
	["control: back to the menu at the end", "A", pdC("0"), "changes", (a) => a.v.mode === "0"],
];

// ps-pda: a captain's PDA (all-access cartridge) spawned into Alpha's hand, for the cartridge's own Topic. Watch: the PDA's vars only (the cartridge's state is not logged: these rows read "no runtime" and the page mode).
const pdK = (q) => `?src={ui}&action=cart&${q}`, pdKo = (q) => `?src={machine}&choice=cart&${q}`;
const pdaCart = [
	["control: Alpha's cartridge button opens Supply Orders (mode 47)", "A", pdK("choice=Supply+Orders"), "changes", (a) => a.v.mode === "47"],
	["control: ... Newscaster Access (mode 53)", "A", pdK("choice=Newscaster+Access"), "changes", (a) => a.v.mode === "53"],
	["control: ... back to the menu", "A", pdC("0"), "changes", (a) => a.v.mode === "0"],
	["Mallory: the cartridge buttons through Alpha's window href and straight at the item", "M", [pdK("choice=Supply+Orders"), pdK("choice=Newscaster+Access"), "?src={machine}&action=cart&choice=Supply+Orders", pdC("cart"), pdO("cart"), pdO("Eject")], "unchanged"],
	["Alpha: Power Select with bad targets (0, -1, 99, 1.5, text, empty)", "A", ["0", "-1", "99", "1.5", "abc", "", "1e9"].map((t) => pdK(`choice=Power+Select&target=${t}`)), "sane", (a) => pdaMode(a)],
	["Alpha: bot control with things that are not bots (her mob, the PDA, junk), then a command", "A", [pdK("op=control&bot={mob}"), pdK("op=summon"), pdK("op=stop"), pdK("op=control&bot={machine}"), pdK("op=summon"), pdK("op=go"), pdK("op=control&bot=abc"), pdK("op=summon"), pdK("mule=go"), pdK("op=botlist")], "sane", (a) => pdaMode(a)],
	["Alpha: signal frequency and code with bad values", "A", ["1e9", "-1e9", "0.5", "abc", "", "NaN"].flatMap((v) => [pdK(`choice=Signal+Frequency&sfreq=${v}`), pdK(`choice=Signal+Code&scode=${v}`)]), "sane", (a) => pdaMode(a)],
	["Alpha: status display with odd commands", "A", [pdK("choice=Status&statdisp=message"), pdK("choice=Status&statdisp=alert&alert=redalert"), pdK("choice=Status&statdisp=%5Bjunk%5D"), pdK("choice=Status&statdisp="), pdK("choice=Status")], "sane", (a) => pdaMode(a)],
	["Alpha: records with bad targets", "A", ["Medical+Records", "Security+Records"].flatMap((c) => ["abc", "", "0", "{mob}"].map((t) => pdK(`choice=${c}&target=${t}`))), "sane", (a) => pdaMode(a)],
	["Alpha: pages 40-60 and 99, 431-451 render with the cartridge", "A", [...Array(21).keys()].map((k) => k + 40).concat([99, 431, 433, 441, 451]).map((m) => pdC(String(m))), "sane", (a) => pdaMode(a)],
	["control: back to the menu", "A", pdC("0"), "changes", (a) => a.v.mode === "0"],
	["Alpha: 20 cartridge hrefs in a burst", "A", Array.from({ length: 20 }, (_, i) => pdK(i % 2 ? "choice=Supply+Orders" : "choice=Newscaster+Access")), "sane", (a) => pdaMode(a)],
	["control: back to the menu", "A", pdC("0"), "changes", (a) => a.v.mode === "0"],
	["control: Alpha ejects the cartridge", "A", pdC("Eject"), "changes", (a) => a.v.cartridge === "" || a.v.cartridge === "null"],
	["Alpha: cartridge hrefs with no cartridge in it", "A", [pdK("choice=Supply+Orders"), pdK("op=summon"), pdC("cart"), pdC("Eject")], "sane", (a) => pdaMode(a)],
];


// ---- communications console: Alpha is an Assistant (no bridge access), so the console is logged in by the scenario's `set` (authenticated=N)
const CW = "authenticated,state,aistate,currmsg,aicurrmsg,tmp_alertlevel,stat_msg1,stat_msg2,emagged,messagetitle,g:security_level,g:emergency_access,shuttle";
const cu = (act, extra = "") => `?src={ui}&action=${act}${extra}`; // Alpha's window
const co = (op, extra = "") => `?src={machine}&operation=${op}${extra}`; // an old-style href at the console
const CALL = "&call=Emergency+evacuation+is+needed";
const shuttleMode = (s) => (s.v.shuttle ?? "").split("/")[0];
const shuttleCalled = (s) => /^["']?call/i.test(shuttleMode(s));
// every operation a non-logged-in player must not get through (both href forms)
const OPS = ["callshuttle2" + CALL, "cancelshuttle2", "announce", "swipeidseclevel", "enableemergency", "buyshuttle&shuttle_id=emergency_box",
	"setstat&statdisp=message", "setstat&statdisp=alert&alert=redalert", "setmsg1", "setmsg2", "MessageCentcomm", "MessageSyndicate", "nukerequest", "RestoreBackup"];
const NAV = ["changeseclevel", "securitylevel&newalertlevel=1", "delmessage2", "viewmessage&message-num=3", "emergencyaccess"]; // only move the page (state / tmp_alertlevel)
const bothForms = (list) => list.flatMap((o) => { const [op, ...r] = o.split("&"); const x = r.length ? "&" + r.join("&") : ""; return [cu(op, x), co(op, x)]; });
const AIOPS = ["ai-callshuttle2" + CALL, "ai-enableemergency", "ai-securitylevel&newalertlevel=1", "ai-announce", "ai-delmessage2", "ai-changeseclevel", "ai-emergencyaccess"];
const commsOut = [ // not logged in
	["control: Alpha's window opens the purchase menu", "A", cu("purchase_menu"), "changes", (a) => a.v.state === "11"],
	["control: Alpha's old-style href goes back to the main menu", "A", co("main"), "changes", (a) => a.v.state === "1"],
	["control: Alpha's old-style status menu", "A", co("status"), "changes", (a) => a.v.state === "7"],
	["control: Alpha's window goes back to the main menu", "A", cu("main"), "changes", (a) => a.v.state === "1"],
	["Alpha, not logged in: call the shuttle (window and old-style)", "A", bothForms(["callshuttle2" + CALL]), "unchanged"],
	["Alpha, not logged in: announce, cancel, emergency access, buy, status, messages to Centcom (window and old-style)", "A", bothForms(OPS.slice(1)), "unchanged"],
	["Alpha, not logged in: page-moving operations (state only)", "A", bothForms(NAV), "sane", (a) => a.v["g:security_level"] === "0" && a.v.shuttle.startsWith("idle")],
	["Alpha, not logged in: the ai- operations sent by a human (window and old-style)", "A", bothForms(AIOPS), "unchanged"],
	["Alpha, not logged in: bad values", "A", ["?src={machine}&operation=viewmessage&message-num=5", "?src={machine}&operation=delmessage2", "?src={machine}&operation=securitylevel&newalertlevel=3", "?src={machine}&operation=nope", "?src={machine}"], "sane"],
];
const commsOne = [ // logged in as level 1 (not captain), the shuttle is idle. There is no "Alpha cancels the call" control: on a green station tg refuses a recall once the first moments of the call have passed (canRecall: timeLeft < emergencyCallTime), so a cancel row can only prove "no runtime" here
	["setup: a call left over from the last try is cancelled", "A", co("cancelshuttle2"), "sane"],
	["Alpha, level 1: the captain-only operations are refused (window and old-style)", "A", bothForms(["announce", "buyshuttle&shuttle_id=emergency_box", "MessageCentcomm", "nukerequest", "MessageSyndicate"]), "unchanged"],
	["Alpha, level 1: ai- operations sent by a human", "A", bothForms(AIOPS), "unchanged"],
	["control: Alpha, level 1, calls the shuttle (old-style)", "A", co("callshuttle2", CALL), "changes", (a) => shuttleCalled(a)],
	["control: Alpha logs out (old-style)", "A", co("logout"), "changes", (a) => a.v.authenticated === "0"],
	["Alpha, logged out, shuttle called: cancel (window and old-style)", "A", [cu("cancelshuttle2"), co("cancelshuttle2")], "unchanged"],
];
const commsAuth = [ // logged in as captain (authenticated=2); Mallory is far away
	["setup: a call left over from the last try is cancelled", "A", co("cancelshuttle2"), "sane"],
	["Mallory: call, announce, emergency access, security level, status (Alpha's window)", "M", bothForms(OPS).filter((h) => h.includes("{ui}")), "unchanged"],
	["Mallory: the same old-style to the console", "M", bothForms(OPS).filter((h) => h.includes("{machine}&operation")), "unchanged"],
	["Mallory: action= straight at the console", "M", ["?src={machine}&action=callshuttle2" + CALL, "?src={machine}&action=enableemergency", "?src={machine}&action=logout"], "unchanged"],
	["Mallory: ai- operations", "M", bothForms(AIOPS), "unchanged"],
	["Alpha, captain: the ai- operations sent by a human (window and old-style)", "A", bothForms(AIOPS), "unchanged"],
	["control: Alpha's window sets the new alert level to 1 (not confirmed yet)", "A", cu("securitylevel", "&newalertlevel=1"), "changes", (a) => a.v.tmp_alertlevel === "1" && a.v.state === "9"],
	["control: Alpha's old-style href sets it to 0", "A", co("securitylevel", "&newalertlevel=0"), "changes", (a) => a.v.tmp_alertlevel === "0"],
	["Alpha: swipeidseclevel without a captain ID in hand changes no level", "A", [co("swipeidseclevel"), cu("swipeidseclevel")], "unchanged"],
	["Alpha: weird alert levels leave the level alone", "A", ["3", "2", "-1", "1.5", "abc", "99", "1e30", "", "%00"].map((v) => co("securitylevel", "&newalertlevel=" + v)), "sane", (a) => a.v["g:security_level"] === "0"],
	["Alpha: message-num (empty message list) never becomes the current message", "A", [co("messagelist"), co("viewmessage", "&message-num=5"), co("delmessage2")], "sane", (a) => a.v.currmsg === "0"],
	["Alpha: message-num 0, -1, 1.5, text, huge", "A", ["0", "-1", "1.5", "abc", "1e30", "999999"].flatMap((v) => [co("messagelist"), co("viewmessage", "&message-num=" + v), co("delmessage2")]), "sane", (a) => a.v.currmsg === "0"],
	["Alpha: the same through the window", "A", ["0", "-1", "1.5", "abc", "99"].flatMap((v) => [cu("messagelist"), cu("viewmessage", "&message-num=" + v), cu("delmessage2")]), "sane", (a) => a.v.currmsg === "0"],
	["Alpha: setstat with odd statdisp and alert values", "A", ["blank", "shuttle", "message", "nope", "alert&alert=%3Cb%3Ex%3C/b%3E", "alert&alert=redalert", "alert", ""].map((v) => cu("setstat", "&statdisp=" + v)), "sane"],
	["Alpha: buying a shuttle that is not on offer, with odd ids", "A", ["nope", "", "5", "-1", "emergency_nope", "%00", "emergency_box&x=1&shuttle_id=nope"].map((v) => co("buyshuttle", "&shuttle_id=" + v)), "unchanged"],
	["Alpha: 20 shuttle calls in a burst make at most one call", "A", Array(20).fill(cu("callshuttle2", CALL)), "changes", (a) => shuttleCalled(a)],
	["Alpha: 20 announces in a burst", "A", Array(20).fill(cu("announce")), "unchanged"],
];

// ---- strip menu (modules/mob/strip.ts): a monkey (notransform: it doesn't wander off) holding a crowbar in hand 1; ui_act action
// strip passes key/val/hand on to the mob's old Topic (item=SLOT;hand_index=N, internal=SLOT), which also has mach_close/refresh.
// Its machine is set to a table so mach_close (unset_machine) shows.
const st = (key, val, hand = "") => `?src={ui}&action=strip&key=${key}&val=${encodeURIComponent(val)}&hand=${encodeURIComponent(hand)}`;
const crowbarHeld = (s) => /crowbar/.test(s.v.held_items ?? "");
const strip = [
	["control: the test aid hands the monkey its crowbar (a do-nothing href while waiting)", "A", "?src={machine}&nothing=1", "changes", (a) => crowbarHeld(a)],
	["Mallory: mach_close on the monkey (unsets its machine, closes its windows)", "M", "?src={machine}&mach_close=strip", "unchanged"],
	["Alpha: mach_close on someone else's mob", "A", "?src={machine}&mach_close=strip", "unchanged"],
	["Alpha: mach_close through the window", "A", st("mach_close", "strip"), "unchanged"],
	["Mallory: take the crowbar (old-style href, and the window's action on the mob)", "M", ["?src={machine}&item=4&hand_index=1", "?src={machine}&action=strip&key=item&val=4&hand=1"], "unchanged"],
	["Alpha: refresh beside the monkey (its machine is a table, not a mob)", "A", "?src={machine}&refresh=1", "unchanged"],
	["Mallory: the internals valve", "M", "?src={machine}&internal=4", "unchanged"],
	["Alpha: hand index fraction/negative/huge/text/NaN", "A", ["0.5", "-1", "1e9", "abc", "", "NaN", "3"].map((h) => st("item", 4, h)), "sane", (a) => crowbarHeld(a) && /^\[[^,]*,[^,]*\]$/.test(a.v.held_items)],
	["Alpha: slot fraction/negative/huge/text", "A", ["0.5", "-1", "1e9", "abc", "4.5"].map((v) => st("item", v)), "sane", (a) => crowbarHeld(a)],
	["control: Alpha takes the crowbar through the window", "A", st("item", 4, 1), "changes", (a) => !crowbarHeld(a) && /crowbar/.test(a.floor)],
];

// ps-client: two players in tg's lobby; the watch is Alpha's own new_player (the round is held in pregame).
const lb = (q) => `?src={mob}&${q}`, pf = (q) => `?_src_=prefs&${q}`;
const readyOk = (a) => a.v.ready === "0" || a.v.ready === "1", inLobby = (a) => /new_player/.test(a.v.type ?? "");
const lobby = [
	["control: Alpha clicks Ready", "A", lb("ready=1"), "changes", (a) => a.v.ready === "1"],
	["control: Alpha clicks Not Ready", "A", lb("ready=0"), "changes", (a) => a.v.ready === "0"],
	["Mallory: Alpha's Ready link", "M", lb("ready=1"), "unchanged"],
	["Alpha: ready fraction/negative/huge/text/NaN/3", "A", ["0.5", "-1", "1e9", "abc", "NaN", "3"].map((v) => lb(`ready=${v}`)), "sane", readyOk],
	["control: Alpha ticks Be Traitor", "A", pf("preference=be_special&be_special_type=traitor"), "changes", (a, b) => /traitor/.test(a.v["client.prefs.be_special"]) !== /traitor/.test(b.v["client.prefs.be_special"])],
	["Alpha: Be Special with a made-up role, twice (the list only takes tg's roles)", "A", [pf("preference=be_special&be_special_type=junk1"), lb("preference=be_special&be_special_type=junk2")], "sane", (a) => !/junk/.test(a.v["client.prefs.be_special"])],
	["control: Alpha opens the Game Preferences tab", "A", pf("preference=tab&tab=1"), "changes", (a) => a.v["client.prefs.current_tab"] === "1"],
	["Alpha: tab fraction/negative/huge/text", "A", ["0.5", "-1", "1e9", "abc", "2"].map((v) => pf(`preference=tab&tab=${v}`)), "sane", (a) => ["0", "1"].includes(a.v["client.prefs.current_tab"])],
	["Alpha: a poll vote with huge option ids (1e17 + 1 is 1e17: the vote loop never ended)", "A", [lb("votepollid=1&votetype=NUMVAL&minid=1e17&maxid=1e17"), lb("votepollid=1&votetype=MULTICHOICE&minoptionid=1e17&maxoptionid=1e17")], "unchanged"],
	["control: the server still answers after the poll votes (Ready again)", "A", lb("ready=1"), "changes", (a) => a.v.ready === "1"],
	["Mallory: a job link on Alpha's lobby mob", "M", lb("SelectedJob=Assistant"), "unchanged"],
	["Alpha: a job link before the round starts (spawned you on the station in pregame)", "A", lb("SelectedJob=Assistant"), "sane", inLobby],
];

export const SCENARIOS = {
	lobby: { clicks: false, atom: "@mob", watch: "type,ready,client.prefs.be_special,client.prefs.current_tab", idle: () => true, cases: lobby },
	strip: { clicks: false, atom: "/mob/living/carbon/monkey", set: "notransform=1,machine=@first:/obj/structure/table", watch: "held_items,internal,machine", idle: (s) => crowbarHeld(s) || /crowbar/.test(s.floor) || s.v.held_items === "[,]", cases: strip },
	"pda-cart": { clicks: false, atom: "/obj/item/device/pda/captain", watch: "mode,fon,id,inserted_item,cartridge", idle: () => true, cases: pdaCart },
	comms: { clicks: false, atom: "/obj/machinery/computer/communications", set: "authenticated=0", watch: CW, idle: () => true, cases: commsOut },
	"comms-one": { clicks: false, atom: "/obj/machinery/computer/communications", set: "authenticated=1", watch: CW, idle: () => true, cases: commsOne },
	"comms-auth": { clicks: false, atom: "/obj/machinery/computer/communications", set: "authenticated=2", watch: CW, idle: () => true, cases: commsAuth },
	pda: { clicks: false, atom: "/obj/item/device/pda", watch: "mode,fon,silent,toff,scanmode,id,inserted_item,cartridge,ttone", idle: () => true, cases: pda },
	"pda-values": { clicks: false, atom: "/obj/item/device/pda", watch: "mode,fon,silent,toff,scanmode,id,inserted_item,cartridge,ttone", idle: () => true, cases: pdaValues },
	tagger: { clicks: false, atom: "/obj/item/device/destTagger", watch: "currTag", idle: () => true, cases: tagger },
	signaler: { clicks: false, atom: "/obj/item/device/assembly/signaler", watch: "frequency,code,sent", idle: () => true, cases: signaler },
	stack: { clicks: false, atom: "/obj/item/stack/sheet/metal:50", watch: "amount", idle: () => true, sane: stackSane, cases: stack },
	smartfridge: { atom: "/obj/machinery/smartfridge/chemistry/preloaded", watch: "stat,panel_open", idle: () => true, sane: smartfridgeSane, cases: smartfridge },
	"drying-rack": { atom: "/obj/machinery/smartfridge/drying_rack", watch: "drying,stat,panel_open", idle: () => true, cases: rack },
	fabricator: { atom: "/obj/machinery/mecha_part_fabricator:30000", watch: FABW, idle: (s) => s.v.being_built === "null" || s.v.being_built === "0" || !s.v.being_built, sane: fabSane, cases: fabricator },
	"fabricator-values": { clicks: false, atom: "/obj/machinery/mecha_part_fabricator:300000", watch: FABW, idle: (s) => !s.v.being_built || s.v.being_built === "null", sane: fabSane, cases: fabricatorValues },
	"fabricator-retrieve": { clicks: false, atom: "/obj/machinery/mecha_part_fabricator:600000", watch: FABW, idle: () => true, sane: fabSane, cases: fabRetrieve },
	autolathe: {
		atom: "/obj/machinery/autolathe:300000", watch: "busy,screen,selected_category,materials,matching_designs,disabled,hacked",
		idle: (s) => s.v.busy === "0", sane: autolatheSane, cases: autolathe,
	},
	"autolathe-values": { clicks: false, // bad numbers, designs, categories, materials from the legitimate player (a second server start: each run stays under 4 minutes)
		atom: "/obj/machinery/autolathe:300000", watch: "busy,screen,selected_category,materials,matching_designs,disabled,hacked",
		idle: (s) => s.v.busy === "0", sane: autolatheSane, cases: autolatheValues,
	},
	"autolathe-disabled": { clicks: false, // the wire pulse that disables the machine: the page greys the Build buttons; the href must be refused too
		atom: "/obj/machinery/autolathe:300000", set: "disabled=1", watch: "busy,screen,selected_category,materials,disabled",
		idle: (s) => s.v.busy === "0", sane: autolatheSane,
		cases: [
			["control: Alpha opens a category on a disabled machine", "A", "?src={ui}&action=category&category=Tools", "changes", (a) => a.v.selected_category === "Tools"],
			["Alpha: build on a disabled machine is refused", "A", mk("bucket", 1), "unchanged"],
			["Alpha: old-style build on a disabled machine is refused", "A", "?src={machine}&make=bucket&multiplier=1", "unchanged"],
		],
	},
	vending: {
		atom: "/obj/machinery/vending/cola", watch: "product_records,hidden_records,coin_records,coin,bill,vend_ready,extended_inventory",
		idle: () => true, sane: vendingSane, cases: vending,
	},
	"vending-extended": { clicks: false, // a hacked machine: hidden products can be vended, once each unit of stock is gone it is sold out
		atom: "/obj/machinery/vending/cola", set: "extended_inventory=1", watch: "product_records,hidden_records,coin_records,coin,bill,vend_ready,extended_inventory",
		idle: () => true, sane: (a) => [0, 1, 2].every((n) => !(recAmount(a, "hidden_records", n) < 0)),
		cases: [
			["control: Alpha vends a hidden product on a hacked machine", "A", vd("{ref:hidden_records:0}"), "changes", (a, b, h) => h.recAmount(a, "hidden_records", 0) === h.recAmount(b, "hidden_records", 0) - 1],
			["Alpha: vend the hidden product 30 times: stock stops at 0, never negative", "A", Array(30).fill(vd("{ref:hidden_records:0}")), "sane", (a, b, h) => h.recAmount(a, "hidden_records", 0) === 0],
			["Alpha: a premium product still needs money", "A", vd("{ref:coin_records:0}"), "unchanged"],
		],
	},
};
