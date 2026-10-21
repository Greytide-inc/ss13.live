// From code/modules/mob/living/brain/posibrain.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalposibrain_notify_cooldown  (code/modules/mob/living/brain/posibrain.dm:1)
rt.def("/datum/controller/global_vars/proc/InitGlobalposibrain_notify_cooldown", function InitGlobalposibrain_notify_cooldown(f: Frame) {
	rt.setGl("posibrain_notify_cooldown", null);
	rt.modSrcVar(f, "gvars_datum_init_order", "posibrain_notify_cooldown", add);
	return f.dot;
});

rt.type(9116, "/obj/item/device/mmi/posibrain", "/obj/item/device/mmi", {
	next_ask: null,
	askDelay: 600,
	searching: 0,
	autoping: 1,
	begin_activation_message: "<span class='notice'>You carefully locate the manual activation switch and start the positronic brain's boot process.</span>",
	success_message: "<span class='notice'>The positronic brain pings, and its lights start flashing. Success!</span>",
	fail_message: "<span class='notice'>The positronic brain buzzes quietly, and the golden lights fade away. Perhaps you could try again?</span>",
	new_role: "Positronic Brain",
	welcome_message: "<span class='warning'>ALL PAST LIVES ARE FORGOTTEN.</span>\n<b>You are a positronic brain, brought into existence aboard Space Station 13.\nAs a synthetic intelligence, you answer to all crewmembers and the AI.\nRemember, the purpose of your existence is to serve the crew and the station. Above all else, do no harm.</b>",
	new_mob_message: "<span class='notice'>The positronic brain chimes quietly.</span>",
	dead_message: "<span class='deadsay'>It appears to be completely inactive. The reset light is blinking.</span>",
	possible_names: null,
	picked_name: null,
	name: "positronic brain",
	desc: "A cube of shining metal, four inches to a side and covered in shallow grooves.",
	icon: rt.rsc("icons/obj/assemblies.dmi"),
	icon_state: "posibrain",
	w_class: 3,
	origin_tech: "biotech=3;programming=3;plasmatech=2",
	brainmob: null,
	req_access: null,
	mecha: null,
	braintype: "Android",
});

// /obj/item/device/mmi/posibrain/proc/<init>  (code/modules/mob/living/brain/posibrain.dm:14)
rt.def("/obj/item/device/mmi/posibrain/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(29));
	return f.dot;
});

// /obj/item/device/mmi/posibrain/proc/Topic  (code/modules/mob/living/brain/posibrain.dm:32)  may sleep
rt.def("/obj/item/device/mmi/posibrain/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let ghost: Value = null;
	f.vars = () => [href, href_list, ghost];
	if (!truthy(rt.at(live(href_list), "activate"))) return f.dot;
	if (!truthy((rt.istype((ghost = live(f.usr)), T("/mob/dead/observer")) ? 1 : 0))) return f.dot;
	yield* g.srcCall(f, "activate", live(ghost));
	return f.dot;
}, true);

// /obj/item/device/mmi/posibrain/proc/ping_ghosts  (code/modules/mob/living/brain/posibrain.dm:38)  may sleep
rt.def("/obj/item/device/mmi/posibrain/proc/ping_ghosts", function* ping_ghosts(f: Frame, msg: Value, newlymade: Value) {
	let $0: any, $1: any, $2: any, $3: any;
	f.vars = () => [msg, newlymade, $0, $1, $2, $3];
	if (!(truthy(live(newlymade)) || rt.le(rt.gl("posibrain_notify_cooldown"), rt.worldTime(f)))) return f.dot;
	$0 = null;
	$1 = fmt("＀ ＀ in ＀!", [rt.sv(f, "name"), live(msg), (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)]))]);
	$2 = "ghost_sound";
	if (!truthy(live(newlymade))) {
		$3 = rt.rsc("sound/effects/ghost2.ogg");
	} else {
		$3 = null;
	}
	yield* g.call(f, P("/proc/notify_ghosts"), null, [$0, $1, $2, $3, "enter_link", fmt("<a href=?src=＃;activate=1>(Click to enter)</a>", [live(f.src)]), "source", live(f.src), "action", "attack", "flashwindow", 0], rt.Args.Named);
	if (truthy(live(newlymade))) return f.dot;
	rt.setGl("posibrain_notify_cooldown", add(rt.worldTime(f), rt.sv(f, "askDelay")));
	return f.dot;
}, true);

// /obj/item/device/mmi/posibrain/proc/attack_self  (code/modules/mob/living/brain/posibrain.dm:44)  may sleep
rt.def("/obj/item/device/mmi/posibrain/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	if ((!truthy(rt.sv(f, "brainmob")) || truthy(rt.fv(f, "key", rt.sv(f, "brainmob"))))) {
		return live(f.dot);
	}
	if (rt.gt(rt.sv(f, "next_ask"), rt.worldTime(f))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), rt.sv(f, "begin_activation_message")]);
	yield* g.srcCall(f, "ping_ghosts", "requested", 0);
	rt.setSv(f, "next_ask", add(rt.worldTime(f), rt.sv(f, "askDelay")));
	rt.setSv(f, "searching", 1);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/device/mmi/posibrain/proc/check_success")])), rt.sv(f, "askDelay")]);
	return f.dot;
}, true);

// /obj/item/device/mmi/posibrain/proc/check_success  (code/modules/mob/living/brain/posibrain.dm:57)
rt.def("/obj/item/device/mmi/posibrain/proc/check_success", function check_success(f: Frame) {
	rt.setSv(f, "searching", 0);
	rt.callSrc(f, "update_icon", []);
	if ((!truthy(rt.sv(f, "brainmob")) || truthy(rt.fv(f, "gc_destroyed", rt.sv(f, "brainmob"))))) {
		return live(f.dot);
	}
	if (truthy(rt.fv(f, "client", rt.sv(f, "brainmob")))) {
		rt.callSrc(f, "visible_message", [rt.sv(f, "success_message")]);
	} else {
		rt.callSrc(f, "visible_message", [rt.sv(f, "fail_message")]);
	}
	return f.dot;
});

// /obj/item/device/mmi/posibrain/proc/attack_ghost  (code/modules/mob/living/brain/posibrain.dm:66)  may sleep
rt.def("/obj/item/device/mmi/posibrain/proc/attack_ghost", function* attack_ghost(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "activate", live(user));
	return f.dot;
}, true);

// /obj/item/device/mmi/posibrain/proc/is_occupied  (code/modules/mob/living/brain/posibrain.dm:69)
rt.def("/obj/item/device/mmi/posibrain/proc/is_occupied", function is_occupied(f: Frame) {
	let R: Value = null;
	f.vars = () => [R];
	if (truthy(rt.fv(f, "key", rt.sv(f, "brainmob")))) {
		return 1;
	}
	if (truthy((rt.istype(rt.sv(f, "loc"), T("/mob/living/silicon/robot")) ? 1 : 0))) {
		if (isEqual(rt.gv(f, "mmi", (R = rt.sv(f, "loc"))), live(f.src))) {
			return 1;
		}
	}
	return 0;
});

// /obj/item/device/mmi/posibrain/proc/activate  (code/modules/mob/living/brain/posibrain.dm:79)  may sleep
rt.def("/obj/item/device/mmi/posibrain/proc/activate", function* activate(f: Frame, user: Value) {
	let posi_ask: Value = null;
	f.vars = () => [user, posi_ask];
	if ((!truthy(rt.sv(f, "brainmob")) || truthy(rt.fv(f, "gc_destroyed", rt.sv(f, "brainmob"))))) {
		return live(f.dot);
	}
	if ((truthy((yield* g.srcCall(f, "is_occupied"))) || truthy((yield* g.call(f, P("/proc/jobban_isbanned"), null, [live(user), "posibrain"]))))) {
		return live(f.dot);
	}
	if ((isEqual((posi_ask = (yield* g.call(f, P("/proc/alert"), null, [fmt("Become a ＀? (Warning, You can no longer be cloned, and all past lives will be forgotten!)", [rt.sv(f, "name")]), "Are you positive?", "Yes", "No"]))), "No") || (!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src)))))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "transfer_personality", live(user));
	return f.dot;
}, true);

// /obj/item/device/mmi/posibrain/proc/transfer_identity  (code/modules/mob/living/brain/posibrain.dm:90)  may sleep
rt.def("/obj/item/device/mmi/posibrain/proc/transfer_identity", function* transfer_identity(f: Frame, C: Value) {
	f.vars = () => [C];
	rt.setSv(f, "name", fmt("＀ (＀)", [rt.initial(f, live(f.src), "name"), live(C)]));
	rt.setFv(f, "name", rt.sv(f, "brainmob"), rt.fv(f, "real_name", live(C)));
	rt.setFv(f, "real_name", rt.sv(f, "brainmob"), rt.fv(f, "real_name", live(C)));
	if (truthy((yield* g.callName(f, live(C), "has_dna", [])))) {
		if (!truthy(rt.fv(f, "stored_dna", rt.sv(f, "brainmob")))) {
			rt.setFv(f, "stored_dna", rt.sv(f, "brainmob"), (yield* g.new_(f, T("/datum/dna/stored"), [rt.sv(f, "brainmob")])));
		}
		yield* g.callName(f, rt.fv(f, "dna", live(C)), "copy_dna", [rt.fv(f, "stored_dna", rt.sv(f, "brainmob"))]);
	}
	rt.setFv(f, "timeofhostdeath", rt.sv(f, "brainmob"), rt.fv(f, "timeofdeath", live(C)));
	rt.setFv(f, "stat", rt.sv(f, "brainmob"), 0);
	if (truthy(rt.fv(f, "mind", rt.sv(f, "brainmob")))) {
		rt.setFv(f, "assigned_role", rt.fv(f, "mind", rt.sv(f, "brainmob")), rt.sv(f, "new_role"));
	}
	if (truthy(rt.fv(f, "mind", live(C)))) {
		yield* g.callName(f, rt.fv(f, "mind", live(C)), "transfer_to", [rt.sv(f, "brainmob")]);
	}
	yield* g.callName(f, rt.fv(f, "mind", rt.sv(f, "brainmob")), "remove_all_antag", []);
	yield* g.callName(f, rt.fv(f, "mind", rt.sv(f, "brainmob")), "wipe_memory", []);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/item/device/mmi/posibrain/proc/transfer_personality  (code/modules/mob/living/brain/posibrain.dm:109)  may sleep
rt.def("/obj/item/device/mmi/posibrain/proc/transfer_personality", function* transfer_personality(f: Frame, candidate: Value) {
	f.vars = () => [candidate];
	if ((!truthy(rt.sv(f, "brainmob")) || truthy(rt.fv(f, "gc_destroyed", rt.sv(f, "brainmob"))))) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "is_occupied")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(candidate), "This brain has already been taken! Please try your possession again later!"]);
		return 0;
	}
	if ((truthy(rt.fv(f, "mind", live(candidate))) && !truthy((rt.istype(live(candidate), T("/mob/dead/observer")) ? 1 : 0)))) {
		yield* g.callName(f, rt.fv(f, "mind", live(candidate)), "transfer_to", [rt.sv(f, "brainmob")]);
	} else {
		rt.setFv(f, "ckey", rt.sv(f, "brainmob"), rt.fv(f, "ckey", live(candidate)));
	}
	rt.setSv(f, "name", fmt("＀ (＀)", [rt.initial(f, live(f.src), "name"), rt.fv(f, "name", rt.sv(f, "brainmob"))]));
	yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "brainmob"), rt.sv(f, "welcome_message")]);
	rt.setFv(f, "assigned_role", rt.fv(f, "mind", rt.sv(f, "brainmob")), rt.sv(f, "new_role"));
	rt.setFv(f, "stat", rt.sv(f, "brainmob"), 0);
	(rt.modGl("dead_mob_list", rt.sv(f, "brainmob"), subtract));
	rt.modGl("living_mob_list", rt.sv(f, "brainmob"), add);
	yield* g.srcCall(f, "visible_message", rt.sv(f, "new_mob_message"));
	yield* g.srcCall(f, "update_icon");
	return 1;
}, true);

// /obj/item/device/mmi/posibrain/proc/examine  (code/modules/mob/living/brain/posibrain.dm:131)
rt.def("/obj/item/device/mmi/posibrain/proc/examine", function examine(f: Frame) {
	let msg: Value = null;
	let $0: any;
	f.vars = () => [msg, $0];
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	msg = null;
	if ((truthy(rt.sv(f, "brainmob")) && truthy(rt.fv(f, "key", rt.sv(f, "brainmob"))))) {
		$0 = rt.fv(f, "stat", rt.sv(f, "brainmob"));
		if ($0 === 0) {
			if (!truthy(rt.fv(f, "client", rt.sv(f, "brainmob")))) {
				msg = "It appears to be in stand-by mode.";
			}
		} else if ($0 === 2) {
			msg = "<span class='deadsay'>It appears to be completely inactive.</span>";
		}
	} else {
		msg = fmt("＀", [rt.sv(f, "dead_message")]);
	}
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), live(msg)]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/device/mmi/posibrain/proc/Initialize  (code/modules/mob/living/brain/posibrain.dm:146)  may sleep
rt.def("/obj/item/device/mmi/posibrain/proc/Initialize", function* Initialize(f: Frame) {
	let new_name: Value = null;
	f.vars = () => [new_name];
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "brainmob", (yield* g.new_(f, T("/mob/living/brain"), [live(f.src)])));
	new_name = null;
	if (!truthy(rt.length(rt.sv(f, "possible_names")))) {
		new_name = rt.op(f, "PickUnweighted", [1], [rt.gl("posibrain_names")]);
	} else {
		new_name = rt.op(f, "PickUnweighted", [1], [rt.sv(f, "possible_names")]);
	}
	rt.setFv(f, "name", rt.sv(f, "brainmob"), fmt("＀-＀", [live(new_name), (yield* g.call(f, P("/proc/rand"), null, [100, 999]))]));
	rt.setFv(f, "real_name", rt.sv(f, "brainmob"), rt.fv(f, "name", rt.sv(f, "brainmob")));
	rt.setFv(f, "loc", rt.sv(f, "brainmob"), live(f.src));
	rt.setFv(f, "container", rt.sv(f, "brainmob"), live(f.src));
	if (!truthy(rt.sv(f, "autoping"))) return f.dot;
	yield* g.srcCall(f, "ping_ghosts", "created", 1);
	return f.dot;
}, true);

// /obj/item/device/mmi/posibrain/proc/update_icon  (code/modules/mob/living/brain/posibrain.dm:166)
rt.def("/obj/item/device/mmi/posibrain/proc/update_icon", function update_icon(f: Frame) {
	if (truthy(rt.sv(f, "searching"))) {
		rt.setSv(f, "icon_state", fmt("＀-searching", [rt.initial(f, live(f.src), "icon_state")]));
		return live(f.dot);
	}
	if ((truthy(rt.sv(f, "brainmob")) && truthy(rt.fv(f, "key", rt.sv(f, "brainmob"))))) {
		rt.setSv(f, "icon_state", fmt("＀-occupied", [rt.initial(f, live(f.src), "icon_state")]));
	} else {
		rt.setSv(f, "icon_state", rt.initial(f, live(f.src), "icon_state"));
	}
	return f.dot;
});
