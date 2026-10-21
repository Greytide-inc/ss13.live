// From code/modules/clothing/glasses/hud.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(8244, "/obj/item/clothing/glasses/hud", "/obj/item/clothing/glasses", {
	hud_type: null,
	flags: null,
	name: "HUD",
	desc: "A heads-up display that provides important info in (almost) real time.",
	origin_tech: "magnets=3;biotech=2",
});

// /obj/item/clothing/glasses/hud/proc/equipped  (code/modules/clothing/glasses/hud.dm:9)  may sleep
rt.def("/obj/item/clothing/glasses/hud/proc/equipped", function* equipped(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!(truthy(rt.sv(f, "hud_type")) && isEqual(live(f.args[1]), 8))) return f.dot;
	yield* g.callName(f, (H = rt.index(rt.gl("huds"), rt.sv(f, "hud_type"))), "add_hud_to", [live(f.args[0])]);
	return f.dot;
}, true, { args: ["user", "slot"] });

// /obj/item/clothing/glasses/hud/proc/dropped  (code/modules/clothing/glasses/hud.dm:15)  may sleep
rt.def("/obj/item/clothing/glasses/hud/proc/dropped", function* dropped(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!((truthy(rt.sv(f, "hud_type")) && truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0))) && isEqual(rt.fv(f, "glasses", live(f.args[0])), live(f.src)))) return f.dot;
	yield* g.callName(f, (H = rt.index(rt.gl("huds"), rt.sv(f, "hud_type"))), "remove_hud_from", [live(f.args[0])]);
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/clothing/glasses/hud/proc/emp_act  (code/modules/clothing/glasses/hud.dm:21)
rt.def("/obj/item/clothing/glasses/hud/proc/emp_act", function emp_act(f: Frame, severity: Value) {
	if (!isEqual(rt.sv(f, "emagged"), 0)) return f.dot;
	rt.setSv(f, "emagged", 1);
	rt.setSv(f, "desc", fmt("＀ The display is flickering slightly.", [rt.sv(f, "desc")]));
	return f.dot;
});

// /obj/item/clothing/glasses/hud/proc/emag_act  (code/modules/clothing/glasses/hud.dm:26)
rt.def("/obj/item/clothing/glasses/hud/proc/emag_act", function emag_act(f: Frame, user: Value) {
	if (!isEqual(rt.sv(f, "emagged"), 0)) return f.dot;
	rt.setSv(f, "emagged", 1);
	rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>PZZTTPFFFT</span>"]);
	rt.setSv(f, "desc", fmt("＀ The display is flickering slightly.", [rt.sv(f, "desc")]));
	return f.dot;
});

rt.type(8251, "/obj/item/clothing/glasses/hud/security/chameleon", "/obj/item/clothing/glasses/hud/security", {
	chameleon_action: null,
	name: "chameleon security HUD",
	desc: "A stolen security HUD integrated with Syndicate chameleon technology. Provides flash protection.",
	flash_protect: 1,
});

// /obj/item/clothing/glasses/hud/security/chameleon/proc/New  (code/modules/clothing/glasses/hud.dm:95)  may sleep
rt.def("/obj/item/clothing/glasses/hud/security/chameleon/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "chameleon_action", (yield* g.new_(f, T("/datum/action/item_action/chameleon/change"), [live(f.src)])));
	rt.setFv(f, "chameleon_type", rt.sv(f, "chameleon_action"), T("/obj/item/clothing/glasses"));
	rt.setFv(f, "chameleon_name", rt.sv(f, "chameleon_action"), "Glasses");
	rt.setFv(f, "chameleon_blacklist", rt.sv(f, "chameleon_action"), (yield* g.call(f, P("/proc/typecacheof"), null, [null, T("/obj/item/clothing/glasses/changeling"), "only_root_path", 1], rt.Args.Named)));
	yield* g.callName(f, rt.sv(f, "chameleon_action"), "initialize_disguises", []);
	return f.dot;
}, true);

// /obj/item/clothing/glasses/hud/security/chameleon/proc/emp_act  (code/modules/clothing/glasses/hud.dm:103)  may sleep
rt.def("/obj/item/clothing/glasses/hud/security/chameleon/proc/emp_act", function* emp_act(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.callName(f, rt.sv(f, "chameleon_action"), "emp_randomise", []);
	return f.dot;
}, true, { args: ["severity"] });

rt.type(8254, "/obj/item/clothing/glasses/hud/security/sunglasses/gars", "/obj/item/clothing/glasses/hud/security/sunglasses", {
	throw_speed: 4,
	name: "１HUD gar glasses",
	desc: "GAR glasses with a HUD.",
	icon_state: "gars",
	item_state: "garb",
	force: 10,
	throwforce: 10,
	attack_verb: null,
	hitsound: rt.rsc("sound/weapons/bladeslice.ogg"),
	sharpness: 1,
});

// /obj/item/clothing/glasses/hud/security/sunglasses/gars/proc/<init>  (code/modules/clothing/glasses/hud.dm:139)
rt.def("/obj/item/clothing/glasses/hud/security/sunglasses/gars/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("sliced"));
	return f.dot;
});

rt.type(8257, "/obj/item/clothing/glasses/hud/toggle", "/obj/item/clothing/glasses/hud", {
	name: "Toggle HUD",
	desc: "A hud with multiple functions.",
	actions_types: null,
});

// /obj/item/clothing/glasses/hud/toggle/proc/<init>  (code/modules/clothing/glasses/hud.dm:154)
rt.def("/obj/item/clothing/glasses/hud/toggle/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "actions_types", rt.list(T("/datum/action/item_action/switch_hud")));
	return f.dot;
});

// /obj/item/clothing/glasses/hud/toggle/proc/attack_self  (code/modules/clothing/glasses/hud.dm:157)
rt.def("/obj/item/clothing/glasses/hud/toggle/proc/attack_self", function attack_self(f: Frame, user: Value) {
	let wearer: Value = null, H: Value = null;
	f.vars = () => [wearer, H];
	if (!truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (!isEqual(rt.gv(f, "glasses", (wearer = live(user))), live(f.src))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "hud_type"))) {
		rt.callName(f, (H = rt.index(rt.gl("huds"), rt.sv(f, "hud_type"))), "remove_hud_from", [live(user)]);
	}
	if (isEqual(rt.sv(f, "hud_type"), 4)) {
		rt.setSv(f, "hud_type", null);
	} else {
		if (isEqual(rt.sv(f, "hud_type"), 2)) {
			rt.setSv(f, "hud_type", 4);
		} else {
			rt.setSv(f, "hud_type", 2);
		}
	}
	if (!truthy(rt.sv(f, "hud_type"))) return f.dot;
	rt.callName(f, (H = rt.index(rt.gl("huds"), rt.sv(f, "hud_type"))), "add_hud_to", [live(user)]);
	return f.dot;
});

rt.type(8258, "/obj/item/clothing/glasses/hud/toggle/thermal", "/obj/item/clothing/glasses/hud/toggle", {
	hud_type: 2,
	vision_flags: 4,
	invis_view: 2,
	glass_colour_type: rt.typePath("/datum/client_colour/glass_colour/red"),
	name: "thermal HUD scanner",
	desc: "Thermal imaging HUD in the shape of glasses.",
	icon_state: "thermal",
});

// /obj/item/clothing/glasses/hud/toggle/thermal/proc/attack_self  (code/modules/clothing/glasses/hud.dm:188)  may sleep
rt.def("/obj/item/clothing/glasses/hud/toggle/thermal/proc/attack_self", function* attack_self(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	yield* g.callSuper(f, [], rt.Args.Same);
	$0 = rt.sv(f, "hud_type");
	if ($0 === 4) {
		rt.setSv(f, "icon_state", "meson");
		yield* g.srcCall(f, "change_glass_color", live(f.args[0]), T("/datum/client_colour/glass_colour/green"));
	} else if ($0 === 2) {
		rt.setSv(f, "icon_state", "thermal");
		yield* g.srcCall(f, "change_glass_color", live(f.args[0]), T("/datum/client_colour/glass_colour/red"));
	} else {
		rt.setSv(f, "icon_state", "purple");
		yield* g.srcCall(f, "change_glass_color", live(f.args[0]), T("/datum/client_colour/glass_colour/purple"));
	}
	yield* g.callName(f, live(f.args[0]), "update_inv_glasses", []);
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/clothing/glasses/hud/toggle/thermal/proc/emp_act  (code/modules/clothing/glasses/hud.dm:202)  may sleep
rt.def("/obj/item/clothing/glasses/hud/toggle/thermal/proc/emp_act", function* emp_act(f: Frame) {
	yield* g.srcCall(f, "thermal_overload");
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["severity"] });
