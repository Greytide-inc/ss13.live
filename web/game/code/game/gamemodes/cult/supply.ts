// From code/game/gamemodes/cult/supply.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(6564, "/obj/item/weapon/paper/talisman/supply", "/obj/item/weapon/paper/talisman", {
	possible_summons: null,
	cultist_name: "Supply Talisman",
	cultist_desc: "A multi-use talisman that can create various objects. Intended to increase the cult's strength early on.",
	invocation: null,
	uses: 3,
});

// /obj/item/weapon/paper/talisman/supply/proc/<init>  (code/game/gamemodes/cult/supply.dm:7)
rt.def("/obj/item/weapon/paper/talisman/supply/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "possible_summons", rt.list(T("/datum/cult_supply/tome"), T("/datum/cult_supply/metal"), T("/datum/cult_supply/talisman/teleport"), T("/datum/cult_supply/talisman/emp"), T("/datum/cult_supply/talisman/stun"), T("/datum/cult_supply/talisman/veil"), T("/datum/cult_supply/soulstone"), T("/datum/cult_supply/construct_shell")));
	return f.dot;
});

// /obj/item/weapon/paper/talisman/supply/proc/invoke  (code/game/gamemodes/cult/supply.dm:19)  may sleep
rt.def("/obj/item/weapon/paper/talisman/supply/proc/invoke", function* invoke(f: Frame, user: Value, successfuluse: Value) {
	let dat: Value = null, s: Value = null, S: Value = null, popup: Value = null;
	let $e: any;
	f.vars = () => [user, successfuluse, dat, s, S, popup, $e];
	if (live(successfuluse) === null) {
		successfuluse = 1;
	}
	dat = rt.list();
	dat = rt.modify(live(dat), fmt("<B>There are ＀ bloody runes on the parchment.</B><BR>", [rt.sv(f, "uses")]), add);
	dat = rt.modify(live(dat), "Please choose the chant to be imbued into the fabric of reality.<BR>", add);
	dat = rt.modify(live(dat), "<HR>", add);
	s = null;
	rt.forList(f, 0, rt.sv(f, "possible_summons"));
	while (($e = rt.next(f, 0)) !== undefined) {
		s = $e;
		S = live(s);
		dat = rt.modify(live(dat), fmt("<a href='?src=＃;id=＀'>＀</a> - ＀<br>", [live(f.src), rt.initial(f, live(S), "id"), rt.initial(f, live(S), "invocation"), rt.initial(f, live(S), "desc")]), add);
	}
	rt.endFor(f, 0);
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(user), "talisman", "", 400, 400]))), "set_content", [(yield* g.callName(f, live(dat), "Join", [""]))]);
	yield* g.callName(f, live(popup), "open", []);
	return 0;
}, true);

// /obj/item/weapon/paper/talisman/supply/proc/Topic  (code/game/gamemodes/cult/supply.dm:32)  may sleep
rt.def("/obj/item/weapon/paper/talisman/supply/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let id: Value = null, match: Value = null, s: Value = null, S: Value = null, _T: Value = null, summon_type: Value = null, AM: Value = null;
	let $e: any;
	f.vars = () => [href, href_list, id, match, s, S, _T, summon_type, AM, $e];
	rt.op(f, "OutputReference", [rt.R.field("log")], [rt.world(), fmt("＀, ＀, ＀", [live(f.usr), live(href), live(href_list)])], false);
	if ((((!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src)))) || truthy((yield* g.callName(f, live(f.usr), "incapacitated", [])))) || !rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(f.usr)])), 1))) {
		return live(f.dot);
	}
	id = rt.at(live(href_list), "id");
	match = null;
	s = null;
	rt.forList(f, 0, rt.sv(f, "possible_summons"));
	while (($e = rt.next(f, 0)) !== undefined) {
		s = $e;
		if (isEqual(rt.initial(f, (S = live(s)), "id"), live(id))) {
			match = live(S);
			break;
		}
	}
	rt.endFor(f, 0);
	if (!truthy(live(match))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='userdanger'>The fabric of reality quivers in agony.</span>"]);
		return live(f.dot);
	}
	_T = rt.getStep(f, live(f.src), 0);
	summon_type = rt.initial(f, live(match), "summon_type");
	if (truthy((rt.istype((AM = (yield* g.new_(f, live(summon_type), [live(_T)]))), T("/obj/item")) ? 1 : 0))) {
		yield* g.callName(f, live(f.usr), "put_in_hands", [live(AM)]);
	}
	rt.incSrcVar(f, "uses", -1, true);
	if (!rt.le(rt.sv(f, "uses"), 0)) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='warning'>＀ crumbles to dust.</span>", [live(f.src)])]);
	yield* g.srcCall(f, "burn");
	return f.dot;
}, true);

rt.type(6565, "/obj/item/weapon/paper/talisman/supply/weak", "/obj/item/weapon/paper/talisman/supply", {
	cultist_name: "Lesser Supply Talisman",
	uses: 2,
});

// /obj/item/weapon/paper/talisman/supply/weak/proc/Initialize  (code/game/gamemodes/cult/supply.dm:67)  may sleep
rt.def("/obj/item/weapon/paper/talisman/supply/weak/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	(rt.modSrcVar(f, "possible_summons", T("/datum/cult_supply/metal"), subtract));
	return f.dot;
}, true, { args: ["mapload"] });
