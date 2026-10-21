// From code/game/objects/structures/spirit_board.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12875, "/obj/structure/spirit_board", "/obj/structure", {
	virgin: 1,
	next_use: 0,
	planchette: "A",
	lastuser: null,
	anchored: 0,
	name: "spirit board",
	desc: "A wooden board with letters etched into it, used in seances.",
	icon: rt.rsc("icons/obj/objects.dmi"),
	icon_state: "spirit_board",
	density: 1,
});

// /obj/structure/spirit_board/proc/examine  (code/game/objects/structures/spirit_board.dm:14)
rt.def("/obj/structure/spirit_board/proc/examine", function examine(f: Frame) {
	rt.setSv(f, "desc", fmt("＀ The planchette is sitting at \"＀\".", [rt.initial(f, live(f.src), "desc"), rt.sv(f, "planchette")]));
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
});

// /obj/structure/spirit_board/proc/attack_hand  (code/game/objects/structures/spirit_board.dm:18)  may sleep
rt.def("/obj/structure/spirit_board/proc/attack_hand", function* attack_hand(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "spirit_board_pick_letter", live(f.args[0]));
	return f.dot;
}, true, { args: ["user"] });

// /obj/structure/spirit_board/proc/attack_ghost  (code/game/objects/structures/spirit_board.dm:24)  may sleep
rt.def("/obj/structure/spirit_board/proc/attack_ghost", function* attack_ghost(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "spirit_board_pick_letter", live(user));
	return f.dot;
}, true);

// /obj/structure/spirit_board/proc/spirit_board_pick_letter  (code/game/objects/structures/spirit_board.dm:28)  may sleep
rt.def("/obj/structure/spirit_board/proc/spirit_board_pick_letter", function* spirit_board_pick_letter(f: Frame, M: Value) {
	let msg: Value = null;
	f.vars = () => [M, msg];
	if (!truthy((yield* g.srcCall(f, "spirit_board_checks", live(M))))) {
		return 0;
	}
	if (truthy(rt.sv(f, "virgin"))) {
		rt.setSv(f, "virgin", 0);
		yield* g.call(f, P("/proc/notify_ghosts"), null, [null, fmt("Someone has begun playing with a ＀ in ＀!", [rt.fv(f, "name", live(f.src)), (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)]))]), "source", live(f.src)], rt.Args.Named);
	}
	rt.setSv(f, "planchette", (yield* g.op(f, "Prompt", [1], [null, null, "Seance!", "Choose the letter.", rt.list("A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z")])));
	if (((!truthy(rt.sv(f, "planchette")) || !truthy((yield* g.srcCall(f, "Adjacent", live(M))))) || rt.gt(rt.sv(f, "next_use"), rt.worldTime(f)))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/add_logs"), null, [live(M), live(f.src), "picked a letter on", fmt(" which was \"＀\".", [rt.sv(f, "planchette")])]);
	rt.setSv(f, "next_use", add(rt.worldTime(f), (yield* g.call(f, P("/proc/rand"), null, [30, 50]))));
	rt.setSv(f, "lastuser", rt.fv(f, "ckey", live(M)));
	yield* g.srcCall(f, "visible_message", (msg = fmt("<span class='notice'>The planchette slowly moves... and stops at the letter \"＀\".</span>", [rt.sv(f, "planchette")])), "", live(msg));
	return f.dot;
}, true);

// /obj/structure/spirit_board/proc/spirit_board_checks  (code/game/objects/structures/spirit_board.dm:48)
rt.def("/obj/structure/spirit_board/proc/spirit_board_checks", function spirit_board_checks(f: Frame, M: Value) {
	let bonus: Value = null, light_amount: Value = null, _T: Value = null, users_in_range: Value = null, L: Value = null;
	let $e: any;
	f.vars = () => [bonus, light_amount, _T, users_in_range, L, $e];
	bonus = 0;
	if (isEqual(rt.fv(f, "ckey", live(M)), rt.sv(f, "lastuser"))) {
		bonus = 10;
	}
	if (rt.gt(subtract(rt.sv(f, "next_use"), live(bonus)), rt.worldTime(f))) {
		return 0;
	}
	light_amount = 0;
	if (rt.gt((light_amount = rt.callName(f, (_T = rt.getStep(f, live(f.src), 0)), "get_lumcount", [])), 0.20000000298023224)) {
		rt.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='warning'>It's too bright here to use ＀!</span>", [rt.fv(f, "name", live(f.src))])]);
		return 0;
	}
	users_in_range = 0;
	L = null;
	rt.forList(f, 0, rt.call(f, P("/proc/orange"), null, [1, live(f.src)]), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		if ((truthy(rt.fv(f, "ckey", live(L))) && truthy(rt.fv(f, "client", live(L))))) {
			if (((rt.lt(subtract(rt.worldTime(f), rt.gv(f, "inactivity", rt.fv(f, "client", live(L)))), subtract(rt.worldTime(f), 300)) || !isEqual(rt.fv(f, "stat", live(L)), 0)) || truthy(rt.callName(f, live(L), "restrained", [])))) {
				rt.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='warning'>＀ doesn't seem to be paying attention...</span>", [live(L)])]);
			} else {
				users_in_range = rt.inc(live(users_in_range), 1);
			}
		}
	}
	rt.endFor(f, 0);
	if (rt.lt(live(users_in_range), 2)) {
		rt.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='warning'>There aren't enough people to use the ＀!</span>", [rt.fv(f, "name", live(f.src))])]);
		return 0;
	}
	return 1;
});
