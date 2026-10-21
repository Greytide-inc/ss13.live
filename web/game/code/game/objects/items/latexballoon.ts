// From code/game/objects/items/latexballoon.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9776, "/obj/item/latexballon", "/obj/item", {
	state: null,
	air_contents: null,
	item_state: "lgloves",
	w_class: 1,
	throw_speed: 1,
	throw_range: 7,
	name: "latex glove",
	desc: "Sterile and airtight.",
	icon_state: "latexballon",
	force: 0,
	throwforce: 0,
});

// /obj/item/latexballon/proc/blow  (code/game/objects/items/latexballoon.dm:15)  may sleep
rt.def("/obj/item/latexballon/proc/blow", function* blow(f: Frame, tank: Value, user: Value) {
	f.vars = () => [tank, user];
	if (isEqual(rt.sv(f, "icon_state"), "latexballon_bursted")) {
		return live(f.dot);
	}
	rt.setSv(f, "icon_state", "latexballon_blow");
	rt.setSv(f, "item_state", "latexballon");
	yield* g.callName(f, live(user), "update_inv_hands", []);
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You blow up ＀ with ＀.</span>", [live(f.src), live(tank)])]);
	rt.setSv(f, "air_contents", (yield* g.callName(f, live(tank), "remove_air_volume", [3])));
	return f.dot;
}, true);

// /obj/item/latexballon/proc/burst  (code/game/objects/items/latexballoon.dm:24)  may sleep
rt.def("/obj/item/latexballon/proc/burst", function* burst(f: Frame) {
	let user: Value = null;
	f.vars = () => [user];
	if ((!truthy(rt.sv(f, "air_contents")) || !isEqual(rt.sv(f, "icon_state"), "latexballon_blow"))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/weapons/gunshot.ogg"), 100, 1]);
	rt.setSv(f, "icon_state", "latexballon_bursted");
	rt.setSv(f, "item_state", "lgloves");
	if (truthy((rt.istype(rt.sv(f, "loc"), T("/mob/living")) ? 1 : 0))) {
		yield* g.callName(f, (user = rt.fv(f, "loc", live(f.src))), "update_inv_hands", []);
	}
	yield* g.callName(f, rt.sv(f, "loc"), "assume_air", [rt.sv(f, "air_contents")]);
	return f.dot;
}, true);

// /obj/item/latexballon/proc/ex_act  (code/game/objects/items/latexballoon.dm:35)  may sleep
rt.def("/obj/item/latexballon/proc/ex_act", function* ex_act(f: Frame, severity: Value, target: Value) {
	let $0: any;
	f.vars = () => [severity, target, $0];
	yield* g.srcCall(f, "burst");
	$0 = live(severity);
	if ($0 === 1) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	} else if ($0 === 2) {
		if (!truthy(rt.op(f, "Prob", [], [50]))) return f.dot;
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	}
	return f.dot;
}, true, { waitfor: false });

// /obj/item/latexballon/proc/bullet_act  (code/game/objects/items/latexballoon.dm:44)  may sleep
rt.def("/obj/item/latexballon/proc/bullet_act", function* bullet_act(f: Frame) {
	yield* g.srcCall(f, "burst");
	return f.dot;
}, true);

// /obj/item/latexballon/proc/temperature_expose  (code/game/objects/items/latexballoon.dm:47)  may sleep
rt.def("/obj/item/latexballon/proc/temperature_expose", function* temperature_expose(f: Frame, air: Value, temperature: Value, volume: Value) {
	f.vars = () => [air, temperature, volume];
	if (!rt.gt(live(temperature), 373.1499938964844)) return f.dot;
	yield* g.srcCall(f, "burst");
	return f.dot;
}, true);

// /obj/item/latexballon/proc/attackby  (code/game/objects/items/latexballoon.dm:51)  may sleep
rt.def("/obj/item/latexballon/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let _T: Value = null;
	f.vars = () => [W, user, params, _T];
	if (truthy((rt.istype(live(W), T("/obj/item/weapon/tank")) ? 1 : 0))) {
		yield* g.srcCall(f, "blow", (_T = live(W)), live(user));
		return live(f.dot);
	}
	if (!((truthy((yield* g.callName(f, live(W), "is_sharp", []))) || truthy((yield* g.callName(f, live(W), "is_hot", [])))) || truthy((yield* g.call(f, P("/proc/is_type_in_typecache"), null, [live(W), rt.gl("pointed_types")]))))) return f.dot;
	yield* g.srcCall(f, "burst");
	return f.dot;
}, true);
