// From code/game/objects/items/weapons/scrolls.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7342, "/obj/item/weapon/teleportation_scroll", "/obj/item/weapon", {
	uses: 4,
	throw_speed: 3,
	throw_range: 7,
	name: "scroll of teleportation",
	desc: "A scroll for moving around.",
	icon: rt.rsc("icons/obj/wizard.dmi"),
	icon_state: "scroll",
	w_class: 2,
	item_state: "paper",
	origin_tech: "bluespace=6",
	resistance_flags: 4,
});

// /obj/item/weapon/teleportation_scroll/proc/attack_self  (code/game/objects/items/weapons/scrolls.dm:22)  may sleep
rt.def("/obj/item/weapon/teleportation_scroll/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let dat: Value = null;
	f.vars = () => [user, dat];
	yield* g.callName(f, live(user), "set_machine", [live(f.src)]);
	dat = "<B>Teleportation Scroll:</B><BR>";
	dat = rt.modify(live(dat), fmt("Number of uses: ＀<BR>", [rt.fv(f, "uses", live(f.src))]), add);
	dat = rt.modify(live(dat), "<HR>", add);
	dat = rt.modify(live(dat), "<B>Four uses, use them wisely:</B><BR>", add);
	dat = rt.modify(live(dat), fmt("<A href='byond://?src=＃;spell_teleport=1'>Teleport</A><BR>", [live(f.src)]), add);
	dat = rt.modify(live(dat), "Kind regards,<br>Wizards Federation<br><br>P.S. Don't forget to bring your gear, you'll need it to cast most spells.<HR>", add);
	rt.op(f, "Browse", [], [live(user), live(dat), "window=scroll"], false);
	yield* g.call(f, P("/proc/onclose"), null, [live(user), "scroll"]);
	return live(f.dot);
}, true);

// /obj/item/weapon/teleportation_scroll/proc/Topic  (code/game/objects/items/weapons/scrolls.dm:34)  may sleep
rt.def("/obj/item/weapon/teleportation_scroll/proc/Topic", function* Topic(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (((truthy(rt.fv(f, "stat", live(f.usr))) || truthy((yield* g.callName(f, live(f.usr), "restrained", [])))) || !isEqual(rt.fv(f, "loc", live(f.src)), live(f.usr)))) {
		return live(f.dot);
	}
	if (!truthy((rt.istype(live(f.usr), T("/mob/living/carbon/human")) ? 1 : 0))) {
		return 1;
	}
	if (truthy((yield* g.callName(f, (H = live(f.usr)), "is_holding", [live(f.src)])))) {
		yield* g.callName(f, live(H), "set_machine", [live(f.src)]);
		if (truthy(rt.at(live(f.args[1]), "spell_teleport"))) {
			if (truthy(rt.sv(f, "uses"))) {
				yield* g.srcCall(f, "teleportscroll", live(H));
			}
		}
	}
	if (truthy(live(H))) {
		yield* g.srcCall(f, "attack_self", live(H));
	}
	return live(f.dot);
}, true, { args: ["href", "href_list"] });

// /obj/item/weapon/teleportation_scroll/proc/teleportscroll  (code/game/objects/items/weapons/scrolls.dm:53)  may sleep
rt.def("/obj/item/weapon/teleportation_scroll/proc/teleportscroll", function* teleportscroll(f: Frame, user: Value) {
	let A: Value = null, thearea: Value = null, smoke: Value = null, L: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [user, A, thearea, smoke, L, _T, $e];
	A = null;
	A = (yield* g.op(f, "Prompt", [1], [live(A), "BOOYEA", "Area to jump to", live(user), rt.gl("teleportlocs")]));
	if (((((((!truthy(live(f.src)) || (!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src))))) || !truthy(live(user))) || !truthy((yield* g.callName(f, live(user), "is_holding", [live(f.src)])))) || truthy((yield* g.callName(f, live(user), "incapacitated", [])))) || !truthy(live(A))) || !truthy(rt.sv(f, "uses")))) {
		return live(f.dot);
	}
	thearea = rt.index(rt.gl("teleportlocs"), live(A));
	yield* g.callName(f, (smoke = (yield* g.new_(f, T("/datum/effect_system/smoke_spread"), []))), "set_up", [2, rt.fv(f, "loc", live(user))]);
	yield* g.callName(f, live(smoke), "attach", [live(user)]);
	yield* g.callName(f, live(smoke), "start", []);
	L = rt.list();
	_T = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/get_area_turfs"), null, [rt.fv(f, "type", live(thearea))])), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		if (!truthy((yield* g.call(f, P("/proc/is_blocked_turf"), null, [live(_T)])))) {
			L = rt.modify(live(L), live(_T), add);
		}
	}
	rt.endFor(f, 0);
	if (!truthy(rt.len(f, live(L)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "The spell matrix was unable to locate a suitable teleport destination for an unknown reason. Sorry."]);
		return live(f.dot);
	}
	yield* g.callName(f, live(user), "forceMove", [rt.op(f, "PickUnweighted", [1], [live(L)])]);
	yield* g.callName(f, live(smoke), "start", []);
	rt.incSrcVar(f, "uses", -1, true);
	return f.dot;
}, true);
