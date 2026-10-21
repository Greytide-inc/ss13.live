// From code/game/gamemodes/changeling/powers/transform.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(8205, "/obj/item/clothing/glasses/changeling", "/obj/item/clothing/glasses", {
	flags: 2,
	name: "flesh",
});

// /obj/item/clothing/glasses/changeling/proc/attack_hand  (code/game/gamemodes/changeling/powers/transform.dm:14)  may sleep
rt.def("/obj/item/clothing/glasses/changeling/proc/attack_hand", function* attack_hand(f: Frame) {
	if (((isEqual(rt.sv(f, "loc"), live(f.args[0])) && truthy(rt.fv(f, "mind", live(f.args[0])))) && truthy(rt.gv(f, "changeling", rt.fv(f, "mind", live(f.args[0])))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>You reabsorb ＀ into your body.</span>", [live(f.src)])]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });

rt.type(8260, "/obj/item/clothing/under/changeling", "/obj/item/clothing/under", {
	flags: 2,
	name: "flesh",
});

// /obj/item/clothing/under/changeling/proc/attack_hand  (code/game/gamemodes/changeling/powers/transform.dm:25)  may sleep
rt.def("/obj/item/clothing/under/changeling/proc/attack_hand", function* attack_hand(f: Frame) {
	if (((isEqual(rt.sv(f, "loc"), live(f.args[0])) && truthy(rt.fv(f, "mind", live(f.args[0])))) && truthy(rt.gv(f, "changeling", rt.fv(f, "mind", live(f.args[0])))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>You reabsorb ＀ into your body.</span>", [live(f.src)])]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });

rt.type(7804, "/obj/item/clothing/suit/changeling", "/obj/item/clothing/suit", {
	flags: 2,
	name: "flesh",
	allowed: null,
});

// /obj/item/clothing/suit/changeling/proc/<init>  (code/game/gamemodes/changeling/powers/transform.dm:34)
rt.def("/obj/item/clothing/suit/changeling/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "allowed", rt.list(T("/obj/item/changeling")));
	return f.dot;
});

// /obj/item/clothing/suit/changeling/proc/attack_hand  (code/game/gamemodes/changeling/powers/transform.dm:37)  may sleep
rt.def("/obj/item/clothing/suit/changeling/proc/attack_hand", function* attack_hand(f: Frame) {
	if (((isEqual(rt.sv(f, "loc"), live(f.args[0])) && truthy(rt.fv(f, "mind", live(f.args[0])))) && truthy(rt.gv(f, "changeling", rt.fv(f, "mind", live(f.args[0])))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>You reabsorb ＀ into your body.</span>", [live(f.src)])]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });

rt.type(8024, "/obj/item/clothing/head/changeling", "/obj/item/clothing/head", {
	flags: 2,
	name: "flesh",
});

// /obj/item/clothing/head/changeling/proc/attack_hand  (code/game/gamemodes/changeling/powers/transform.dm:48)  may sleep
rt.def("/obj/item/clothing/head/changeling/proc/attack_hand", function* attack_hand(f: Frame) {
	if (((isEqual(rt.sv(f, "loc"), live(f.args[0])) && truthy(rt.fv(f, "mind", live(f.args[0])))) && truthy(rt.gv(f, "changeling", rt.fv(f, "mind", live(f.args[0])))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>You reabsorb ＀ into your body.</span>", [live(f.src)])]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });

rt.type(8457, "/obj/item/clothing/shoes/changeling", "/obj/item/clothing/shoes", {
	flags: 2,
	name: "flesh",
});

// /obj/item/clothing/shoes/changeling/proc/attack_hand  (code/game/gamemodes/changeling/powers/transform.dm:59)  may sleep
rt.def("/obj/item/clothing/shoes/changeling/proc/attack_hand", function* attack_hand(f: Frame) {
	if (((isEqual(rt.sv(f, "loc"), live(f.args[0])) && truthy(rt.fv(f, "mind", live(f.args[0])))) && truthy(rt.gv(f, "changeling", rt.fv(f, "mind", live(f.args[0])))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>You reabsorb ＀ into your body.</span>", [live(f.src)])]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });

rt.type(7660, "/obj/item/clothing/gloves/changeling", "/obj/item/clothing/gloves", {
	flags: 2,
	name: "flesh",
});

// /obj/item/clothing/gloves/changeling/proc/attack_hand  (code/game/gamemodes/changeling/powers/transform.dm:70)  may sleep
rt.def("/obj/item/clothing/gloves/changeling/proc/attack_hand", function* attack_hand(f: Frame) {
	if (((isEqual(rt.sv(f, "loc"), live(f.args[0])) && truthy(rt.fv(f, "mind", live(f.args[0])))) && truthy(rt.gv(f, "changeling", rt.fv(f, "mind", live(f.args[0])))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>You reabsorb ＀ into your body.</span>", [live(f.src)])]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });

rt.type(8516, "/obj/item/clothing/mask/changeling", "/obj/item/clothing/mask", {
	flags: 2,
	name: "flesh",
});

// /obj/item/clothing/mask/changeling/proc/attack_hand  (code/game/gamemodes/changeling/powers/transform.dm:81)  may sleep
rt.def("/obj/item/clothing/mask/changeling/proc/attack_hand", function* attack_hand(f: Frame) {
	if (((isEqual(rt.sv(f, "loc"), live(f.args[0])) && truthy(rt.fv(f, "mind", live(f.args[0])))) && truthy(rt.gv(f, "changeling", rt.fv(f, "mind", live(f.args[0])))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>You reabsorb ＀ into your body.</span>", [live(f.src)])]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });

rt.type(8926, "/obj/item/changeling", "/obj/item", {
	flags: 2,
	name: "flesh",
	slot_flags: 16777215,
	allowed: null,
});

// /obj/item/changeling/proc/<init>  (code/game/gamemodes/changeling/powers/transform.dm:91)
rt.def("/obj/item/changeling/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "allowed", rt.list(T("/obj/item/changeling")));
	return f.dot;
});

// /obj/item/changeling/proc/attack_hand  (code/game/gamemodes/changeling/powers/transform.dm:94)  may sleep
rt.def("/obj/item/changeling/proc/attack_hand", function* attack_hand(f: Frame) {
	if (((isEqual(rt.sv(f, "loc"), live(f.args[0])) && truthy(rt.fv(f, "mind", live(f.args[0])))) && truthy(rt.gv(f, "changeling", rt.fv(f, "mind", live(f.args[0])))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>You reabsorb ＀ into your body.</span>", [live(f.src)])]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });

rt.type(11261, "/obj/effect/proc_holder/changeling/transform", "/obj/effect/proc_holder/changeling", {
	chemical_cost: 5,
	dna_cost: 0,
	req_dna: 1,
	req_human: 1,
	name: "Transform",
	desc: "We take on the appearance and voice of one we have absorbed.",
});

// /obj/effect/proc_holder/changeling/transform/proc/sting_action  (code/game/gamemodes/changeling/powers/transform.dm:102)  may sleep
rt.def("/obj/effect/proc_holder/changeling/transform/proc/sting_action", function* sting_action(f: Frame, user: Value) {
	let changeling: Value = null, chosen_prof: Value = null;
	f.vars = () => [user, changeling, chosen_prof];
	changeling = rt.gv(f, "changeling", rt.fv(f, "mind", live(user)));
	if (!truthy((chosen_prof = (yield* g.callName(f, live(changeling), "select_dna", ["Select the target DNA: ", "Target DNA", live(user)]))))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/changeling_transform"), null, [live(user), live(chosen_prof)]);
	return 1;
}, true);

// /datum/changeling/proc/select_dna  (code/game/gamemodes/changeling/powers/transform.dm:112)  may sleep
rt.def("/datum/changeling/proc/select_dna", function* select_dna(f: Frame, prompt: Value, title: Value, user: Value) {
	let names: Value = null, prof: Value = null, chosen_name: Value = null, slot: Value = null, prof_2: Value = null;
	let $e: any;
	f.vars = () => [prompt, title, user, names, prof, chosen_name, slot, prof_2, $e];
	names = rt.list("Drop Flesh Disguise");
	prof = null;
	rt.forList(f, 0, rt.sv(f, "stored_profiles"), T("/datum/changelingprofile"));
	while (($e = rt.next(f, 0)) !== undefined) {
		prof = $e;
		names = rt.modify(live(names), fmt("＀", [rt.fv(f, "name", live(prof))]), add);
	}
	rt.endFor(f, 0);
	if (!truthy((chosen_name = (yield* g.op(f, "Prompt", [1], [null, null, live(title), live(prompt), live(names)]))))) {
		return live(f.dot);
	}
	if (isEqual(live(chosen_name), "Drop Flesh Disguise")) {
		slot = null;
		rt.forList(f, 0, rt.gl("slots"));
		while (($e = rt.next(f, 0)) !== undefined) {
			slot = $e;
			if (truthy(rt.op(f, "IsType", [], [rt.index(rt.fv(f, "vars", live(user)), live(slot)), rt.index(rt.gl("slot2type"), live(slot))]))) {
				yield* g.call(f, P("/proc/qdel"), null, [rt.index(rt.fv(f, "vars", live(user)), live(slot))]);
			}
		}
		rt.endFor(f, 0);
	}
	return (prof_2 = (yield* g.srcCall(f, "get_dna", live(chosen_name))));
}, true);
