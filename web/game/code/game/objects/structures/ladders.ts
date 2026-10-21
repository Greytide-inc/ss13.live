// From code/game/objects/structures/ladders.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12791, "/obj/structure/ladder", "/obj/structure", {
	id: null,
	height: 0,
	down: null,
	up: null,
	name: "ladder",
	desc: "A sturdy metal ladder.",
	icon: rt.rsc("icons/obj/structures.dmi"),
	icon_state: "ladder11",
});

// /obj/structure/ladder/proc/Initialize  (code/game/objects/structures/ladders.dm:17)
rt.def("/obj/structure/ladder/proc/Initialize", function Initialize(f: Frame) {
	rt.modGl("ladders", live(f.src), add);
	rt.callSuper(f, [], rt.Args.Same);
	return 1;
}, false, { args: ["mapload"] });

// /obj/structure/ladder/proc/Destroy  (code/game/objects/structures/ladders.dm:22)  may sleep
rt.def("/obj/structure/ladder/proc/Destroy", function* Destroy(f: Frame) {
	(rt.modGl("ladders", live(f.src), subtract));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /obj/structure/ladder/proc/LateInitialize  (code/game/objects/structures/ladders.dm:26)
rt.def("/obj/structure/ladder/proc/LateInitialize", function LateInitialize(f: Frame) {
	let L: Value = null;
	let $e: any;
	f.vars = () => [L, $e];
	L = null;
	rt.forList(f, 0, rt.gl("ladders"), T("/obj/structure/ladder"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		if (isEqual(rt.fv(f, "id", live(L)), rt.sv(f, "id"))) {
			if (isEqual(rt.fv(f, "height", live(L)), subtract(rt.sv(f, "height"), 1))) {
				rt.setSv(f, "down", live(L));
				continue;
			}
			if (isEqual(rt.fv(f, "height", live(L)), add(rt.sv(f, "height"), 1))) {
				rt.setSv(f, "up", live(L));
				continue;
			}
		}
		if ((truthy(rt.sv(f, "up")) && truthy(rt.sv(f, "down")))) {
			break;
		}
	}
	rt.endFor(f, 0);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/structure/ladder/proc/update_icon  (code/game/objects/structures/ladders.dm:41)
rt.def("/obj/structure/ladder/proc/update_icon", function update_icon(f: Frame) {
	if ((truthy(rt.sv(f, "up")) && truthy(rt.sv(f, "down")))) {
		rt.setSv(f, "icon_state", "ladder11");
	} else {
		if (truthy(rt.sv(f, "up"))) {
			rt.setSv(f, "icon_state", "ladder10");
		} else {
			if (truthy(rt.sv(f, "down"))) {
				rt.setSv(f, "icon_state", "ladder01");
			} else {
				rt.setSv(f, "icon_state", "ladder00");
			}
		}
	}
	return f.dot;
});

// /obj/structure/ladder/proc/go_up  (code/game/objects/structures/ladders.dm:54)  may sleep
rt.def("/obj/structure/ladder/proc/go_up", function* go_up(f: Frame, user: Value, is_ghost: Value) {
	f.vars = () => [user, is_ghost];
	if (!truthy(live(is_ghost))) {
		yield* g.srcCall(f, "show_fluff_message", 1, live(user));
		yield* g.callName(f, rt.sv(f, "up"), "add_fingerprint", [live(user)]);
	}
	rt.setFv(f, "loc", live(user), rt.getStep(f, rt.sv(f, "up"), 0));
	return f.dot;
}, true);

// /obj/structure/ladder/proc/go_down  (code/game/objects/structures/ladders.dm:60)  may sleep
rt.def("/obj/structure/ladder/proc/go_down", function* go_down(f: Frame, user: Value, is_ghost: Value) {
	f.vars = () => [user, is_ghost];
	if (!truthy(live(is_ghost))) {
		yield* g.srcCall(f, "show_fluff_message", 0, live(user));
		yield* g.callName(f, rt.sv(f, "down"), "add_fingerprint", [live(user)]);
	}
	rt.setFv(f, "loc", live(user), rt.getStep(f, rt.sv(f, "down"), 0));
	return f.dot;
}, true);

// /obj/structure/ladder/proc/use  (code/game/objects/structures/ladders.dm:66)  may sleep
rt.def("/obj/structure/ladder/proc/use", function* use(f: Frame, user: Value, is_ghost: Value) {
	let $0: any;
	f.vars = () => [user, is_ghost, $0];
	if (live(is_ghost) === null) {
		is_ghost = 0;
	}
	if ((truthy(rt.sv(f, "up")) && truthy(rt.sv(f, "down")))) {
		$0 = (yield* g.call(f, P("/proc/alert"), null, ["Go up or down the ladder?", "Ladder", "Up", "Down", "Cancel"]));
		if ($0 === "Up") {
			yield* g.srcCall(f, "go_up", live(user), live(is_ghost));
		} else if ($0 === "Down") {
			yield* g.srcCall(f, "go_down", live(user), live(is_ghost));
		} else if ($0 === "Cancel") {
			return live(f.dot);
		}
	} else {
		if (truthy(rt.sv(f, "up"))) {
			yield* g.srcCall(f, "go_up", live(user), live(is_ghost));
		} else {
			if (truthy(rt.sv(f, "down"))) {
				yield* g.srcCall(f, "go_down", live(user), live(is_ghost));
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ doesn't seem to lead anywhere!</span>", [live(f.src)])]);
			}
		}
	}
	if (truthy(live(is_ghost))) return f.dot;
	yield* g.srcCall(f, "add_fingerprint", live(user));
	return f.dot;
}, true);

// /obj/structure/ladder/proc/attack_hand  (code/game/objects/structures/ladders.dm:85)  may sleep
rt.def("/obj/structure/ladder/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!truthy((yield* g.srcCall(f, "can_use", live(user))))) return f.dot;
	yield* g.srcCall(f, "use", live(user));
	return f.dot;
}, true);

// /obj/structure/ladder/proc/attack_paw  (code/game/objects/structures/ladders.dm:89)  may sleep
rt.def("/obj/structure/ladder/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	f.vars = () => [user];
	return (yield* g.srcCall(f, "attack_hand", live(user)));
}, true);

// /obj/structure/ladder/proc/attackby  (code/game/objects/structures/ladders.dm:92)  may sleep
rt.def("/obj/structure/ladder/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	f.vars = () => [W, user, params];
	return (yield* g.srcCall(f, "attack_hand", live(user)));
}, true);

// /obj/structure/ladder/proc/attack_ghost  (code/game/objects/structures/ladders.dm:95)  may sleep
rt.def("/obj/structure/ladder/proc/attack_ghost", function* attack_ghost(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "use", live(user), 1);
	return f.dot;
}, true);

// /obj/structure/ladder/proc/show_fluff_message  (code/game/objects/structures/ladders.dm:99)
rt.def("/obj/structure/ladder/proc/show_fluff_message", function show_fluff_message(f: Frame, up: Value, user: Value) {
	if (truthy(live(up))) {
		rt.callName(f, live(user), "visible_message", [fmt("＀ climbs up ％！.", [live(user), live(f.src)]), fmt("<span class='notice'>You climb up ％！.</span>", [live(f.src)])]);
	} else {
		rt.callName(f, live(user), "visible_message", [fmt("＀ climbs down ％！.", [live(user), live(f.src)]), fmt("<span class='notice'>You climb down ％！.</span>", [live(f.src)])]);
	}
	return f.dot;
});

rt.type(12792, "/obj/structure/ladder/unbreakable", "/obj/structure/ladder", {
	name: "sturdy ladder",
	desc: "An extremely sturdy metal ladder.",
});

// /obj/structure/ladder/unbreakable/proc/Destroy  (code/game/objects/structures/ladders.dm:108)  may sleep
rt.def("/obj/structure/ladder/unbreakable/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(live(f.args[0]))) {
		f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	} else {
		return 1;
	}
	return f.dot;
}, true, { args: ["force"] });
