// From code/modules/paperwork/pen.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(6643, "/obj/item/weapon/pen", "/obj/item/weapon", {
	colour: "black",
	traitor_unlock_degrees: 0,
	degrees: 0,
	font: "Verdana",
	throw_speed: 3,
	throw_range: 7,
	pressure_resistance: 2,
	desc: "It's a normal black ink pen.",
	name: "pen",
	icon: rt.rsc("icons/obj/bureaucracy.dmi"),
	icon_state: "pen",
	item_state: "pen",
	slot_flags: 528,
	throwforce: 0,
	w_class: 1,
	materials: null,
});

// /obj/item/weapon/pen/proc/<init>  (code/modules/paperwork/pen.dm:24)
rt.def("/obj/item/weapon/pen/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 10]));
	return f.dot;
});

// /obj/item/weapon/pen/proc/suicide_act  (code/modules/paperwork/pen.dm:32)
rt.def("/obj/item/weapon/pen/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ is scribbling numbers all over ＀self with ＀! It looks like ＀ trying to commit sudoku...</span>", [live(user), rt.callName(f, live(user), "p_them", []), live(f.src), rt.callName(f, live(user), "p_theyre", [])])]);
	return 1;
});

rt.type(6648, "/obj/item/weapon/pen/fourcolor", "/obj/item/weapon/pen", {
	colour: "black",
	desc: "It's a fancy four-color ink pen, set to black.",
	name: "four-color pen",
});

// /obj/item/weapon/pen/fourcolor/proc/attack_self  (code/modules/paperwork/pen.dm:56)
rt.def("/obj/item/weapon/pen/fourcolor/proc/attack_self", function attack_self(f: Frame, user: Value) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.sv(f, "colour");
	if ($0 === "black") {
		rt.setSv(f, "colour", "red");
	} else if ($0 === "red") {
		rt.setSv(f, "colour", "green");
	} else if ($0 === "green") {
		rt.setSv(f, "colour", "blue");
	} else {
		rt.setSv(f, "colour", "black");
	}
	rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>＄！ will now write in ＀.</span>", [live(f.src), rt.sv(f, "colour")])]);
	rt.setSv(f, "desc", fmt("It's a fancy four-color ink pen, set to ＀.", [rt.sv(f, "colour")]));
	return f.dot;
});

rt.type(6650, "/obj/item/weapon/pen/fountain/captain", "/obj/item/weapon/pen/fountain", {
	throw_speed: 4,
	colour: "crimson",
	name: "captain's fountain pen",
	desc: "It's an expensive Oak fountain pen. The nib is quite sharp.",
	icon_state: "pen-fountain-o",
	force: 5,
	throwforce: 5,
	materials: null,
	sharpness: 1,
	resistance_flags: 2,
	unique_reskin: null,
});

// /obj/item/weapon/pen/fountain/captain/proc/<init>  (code/modules/paperwork/pen.dm:82)
rt.def("/obj/item/weapon/pen/fountain/captain/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$gold", 750]));
	rt.setSv(f, "unique_reskin", rt.alist(f, ["Oak", "pen-fountain-o", "Gold", "pen-fountain-g", "Rosewood", "pen-fountain-r", "Black and Silver", "pen-fountain-b", "Command Blue", "pen-fountain-cb"]));
	return f.dot;
});

// /obj/item/weapon/pen/fountain/captain/proc/reskin_obj  (code/modules/paperwork/pen.dm:93)  may sleep
rt.def("/obj/item/weapon/pen/fountain/captain/proc/reskin_obj", function* reskin_obj(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "current_skin"))) return f.dot;
	rt.setSv(f, "desc", fmt("It's an expensive ＀ fountain pen. The nib is quite sharp.", [rt.sv(f, "current_skin")]));
	return f.dot;
}, true, { args: ["M"] });

// /obj/item/weapon/pen/proc/attack_self  (code/modules/paperwork/pen.dm:98)  may sleep
rt.def("/obj/item/weapon/pen/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let deg: Value = null;
	f.vars = () => [user, deg];
	if (!(truthy((deg = (yield* g.op(f, "Prompt", [33], [null, "Rotate Pen Head", "What angle would you like to rotate the pen head to? (1-360)", live(user), null])))) && (rt.gt(live(deg), 0) && rt.le(live(deg), 360)))) return f.dot;
	rt.setSv(f, "degrees", live(deg));
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You rotate the top of the pen to ＀ degrees.</span>", [rt.sv(f, "degrees")])]);
	if (!(truthy(rt.sv(f, "hidden_uplink")) && isEqual(rt.sv(f, "degrees"), rt.sv(f, "traitor_unlock_degrees")))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>Your pen makes a clicking noise, before quickly rotating back to 0 degrees!</span>"]);
	rt.setSv(f, "degrees", 0);
	yield* g.callName(f, rt.sv(f, "hidden_uplink"), "interact", [live(user)]);
	return f.dot;
}, true);

// /obj/item/weapon/pen/proc/attackby  (code/modules/paperwork/pen.dm:110)  may sleep
rt.def("/obj/item/weapon/pen/proc/attackby", function* attackby(f: Frame) {
	if (truthy(rt.sv(f, "hidden_uplink"))) {
		return (yield* g.callName(f, rt.sv(f, "hidden_uplink"), "attackby", [live(f.args[0]), live(f.args[1]), live(f.args[2])]));
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["I", "user", "params"] });

// /obj/item/weapon/pen/proc/attack  (code/modules/paperwork/pen.dm:116)  may sleep
rt.def("/obj/item/weapon/pen/proc/attack", function* attack(f: Frame) {
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "force"))) {
		if (truthy((yield* g.callName(f, live(f.args[0]), "can_inject", [live(f.args[1]), 1])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>You stab ＀ with the pen.</span>", [live(f.args[0])])]);
			if (!truthy(live(f.args[2]))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='danger'>You feel a tiny prick!</span>"]);
			}
			f.dot = 1;
		}
		yield* g.call(f, P("/proc/add_logs"), null, [live(f.args[1]), live(f.args[0]), "stabbed", live(f.src)]);
	} else {
		f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["M", "user", "stealth"] });

// /obj/item/weapon/pen/proc/afterattack  (code/modules/paperwork/pen.dm:133)  may sleep
rt.def("/obj/item/weapon/pen/proc/afterattack", function* afterattack(f: Frame, O: Value, user: Value, proximity: Value) {
	let penchoice: Value = null, input: Value = null, oldname: Value = null;
	f.vars = () => [O, user, proximity, penchoice, input, oldname];
	if ((truthy((rt.istype(live(O), T("/obj")) ? 1 : 0)) && truthy(live(proximity)))) {
		if (truthy(rt.fv(f, "unique_rename", live(O)))) {
			penchoice = (yield* g.op(f, "Prompt", [1], [null, "Rename or change description?", "What would you like to edit?", live(user), rt.list("Rename", "Change description")]));
			if ((!(!truthy(live(O)) || truthy(rt.fv(f, "gc_destroyed", live(O)))) && truthy((yield* g.callName(f, live(user), "canUseTopic", [null, live(O), "be_close", 1], rt.Args.Named))))) {
				if (isEqual(live(penchoice), "Rename")) {
					input = (yield* g.call(f, P("/proc/stripped_input"), null, [live(user), fmt("What do you want to name ％！?", [rt.fv(f, "name", live(O))]), null, "", 42]));
					oldname = rt.fv(f, "name", live(O));
					if ((!(!truthy(live(O)) || truthy(rt.fv(f, "gc_destroyed", live(O)))) && truthy((yield* g.callName(f, live(user), "canUseTopic", [null, live(O), "be_close", 1], rt.Args.Named))))) {
						if (isEqual(live(oldname), live(input))) {
							yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("You changed ％！ to... well... ％！.", [rt.fv(f, "name", live(O)), rt.fv(f, "name", live(O))])]);
							return live(f.dot);
						} else {
							rt.setFv(f, "name", live(O), live(input));
							yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("＄！ has been successfully been renamed to ％！.", [live(oldname), live(input)])]);
							return live(f.dot);
						}
					} else {
						yield* g.call(f, P("/proc/to_chat"), null, [live(user), "You are too far away!"]);
					}
				}
				if (isEqual(live(penchoice), "Change description")) {
					input = (yield* g.call(f, P("/proc/stripped_input"), null, [live(user), fmt("Describe ％！ here", [rt.fv(f, "name", live(O))]), null, "", 100]));
					if ((!(!truthy(live(O)) || truthy(rt.fv(f, "gc_destroyed", live(O)))) && truthy((yield* g.callName(f, live(user), "canUseTopic", [null, live(O), "be_close", 1], rt.Args.Named))))) {
						rt.setFv(f, "desc", live(O), live(input));
						yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("You have successfully changed ％！'s description.", [rt.fv(f, "name", live(O))])]);
						return live(f.dot);
					} else {
						yield* g.call(f, P("/proc/to_chat"), null, [live(user), "You are too far away!"]);
					}
				}
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), "You are too far away!"]);
				return live(f.dot);
			}
		}
	} else {
		return live(f.dot);
	}
	return f.dot;
}, true);

rt.type(6651, "/obj/item/weapon/pen/sleepy", "/obj/item/weapon/pen", {
	container_type: 4096,
	origin_tech: "engineering=4;syndicate=2",
});

// /obj/item/weapon/pen/sleepy/proc/attack  (code/modules/paperwork/pen.dm:175)  may sleep
rt.def("/obj/item/weapon/pen/sleepy/proc/attack", function* attack(f: Frame) {
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	if (!truthy(rt.fv(f, "total_volume", rt.sv(f, "reagents")))) return f.dot;
	if (!truthy(rt.fv(f, "reagents", live(f.args[0])))) return f.dot;
	yield* g.callName(f, rt.sv(f, "reagents"), "trans_to", [live(f.args[0]), rt.fv(f, "total_volume", rt.sv(f, "reagents"))]);
	return f.dot;
}, true, { args: ["M", "user"] });

// /obj/item/weapon/pen/sleepy/proc/New  (code/modules/paperwork/pen.dm:185)  may sleep
rt.def("/obj/item/weapon/pen/sleepy/proc/New", function* New(f: Frame) {
	yield* g.srcCall(f, "create_reagents", 45);
	yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", ["chloralhydrate2", 20]);
	yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", ["mutetoxin", 15]);
	yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", ["tirizene", 10]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

rt.type(6652, "/obj/item/weapon/pen/edagger", "/obj/item/weapon/pen", {
	on: 0,
	origin_tech: "combat=3;syndicate=1",
	attack_verb: null,
});

// /obj/item/weapon/pen/edagger/proc/attack_self  (code/modules/paperwork/pen.dm:202)
rt.def("/obj/item/weapon/pen/edagger/proc/attack_self", function attack_self(f: Frame, user: Value) {
	if (truthy(rt.sv(f, "on"))) {
		rt.setSv(f, "on", 0);
		rt.setSv(f, "force", rt.initial(f, live(f.src), "force"));
		rt.setSv(f, "w_class", rt.initial(f, live(f.src), "w_class"));
		rt.setSv(f, "name", rt.initial(f, live(f.src), "name"));
		rt.setSv(f, "hitsound", rt.initial(f, live(f.src), "hitsound"));
		rt.setSv(f, "embed_chance", rt.initial(f, live(f.src), "embed_chance"));
		rt.setSv(f, "throwforce", rt.initial(f, live(f.src), "throwforce"));
		rt.call(f, P("/proc/playsound"), null, [live(user), rt.rsc("sound/weapons/saberoff.ogg"), 5, 1]);
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ can now be concealed.</span>", [live(f.src)])]);
	} else {
		rt.setSv(f, "on", 1);
		rt.setSv(f, "force", 18);
		rt.setSv(f, "w_class", 3);
		rt.setSv(f, "name", "energy dagger");
		rt.setSv(f, "hitsound", rt.rsc("sound/weapons/blade1.ogg"));
		rt.setSv(f, "embed_chance", 100);
		rt.setSv(f, "throwforce", 35);
		rt.call(f, P("/proc/playsound"), null, [live(user), rt.rsc("sound/weapons/saberon.ogg"), 5, 1]);
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ is now active.</span>", [live(f.src)])]);
	}
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/item/weapon/pen/edagger/proc/update_icon  (code/modules/paperwork/pen.dm:224)
rt.def("/obj/item/weapon/pen/edagger/proc/update_icon", function update_icon(f: Frame) {
	if (truthy(rt.sv(f, "on"))) {
		rt.setSv(f, "icon_state", "edagger");
		rt.setSv(f, "item_state", "edagger");
	} else {
		rt.setSv(f, "icon_state", rt.initial(f, live(f.src), "icon_state"));
		rt.setSv(f, "item_state", rt.initial(f, live(f.src), "item_state"));
	}
	return f.dot;
});
