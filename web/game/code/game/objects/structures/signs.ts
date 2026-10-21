// From code/game/objects/structures/signs.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12570, "/obj/structure/sign", "/obj/structure", {
	buildable_sign: 1,
	anchored: 1,
	icon: rt.rsc("icons/obj/decals.dmi"),
	opacity: 0,
	density: 0,
	layer: 3.4,
	obj_integrity: 100,
	max_integrity: 100,
	armor: null,
});

// /obj/structure/sign/proc/<init>  (code/game/objects/structures/signs.dm:9)
rt.def("/obj/structure/sign/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 50, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 50, "acid", 50]));
	return f.dot;
});

// /obj/structure/sign/proc/play_attack_sound  (code/game/objects/structures/signs.dm:18)
rt.def("/obj/structure/sign/proc/play_attack_sound", function play_attack_sound(f: Frame, damage_amount: Value, damage_type: Value, damage_flag: Value) {
	let $0: any;
	f.vars = () => [damage_type, damage_flag, $0];
	if (live(damage_type) === null) {
		damage_type = "brute";
	}
	if (live(damage_flag) === null) {
		damage_flag = 0;
	}
	$0 = live(damage_type);
	if ($0 === "brute") {
		if (truthy(live(damage_amount))) {
			rt.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/weapons/slash.ogg"), 80, 1]);
		} else {
			rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/tap.ogg"), 50, 1]);
		}
	} else if ($0 === "fire") {
		rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/items/welder.ogg"), 80, 1]);
	}
	return f.dot;
});

// /obj/structure/sign/proc/attackby  (code/game/objects/structures/signs.dm:28)  may sleep
rt.def("/obj/structure/sign/proc/attackby", function* attackby(f: Frame) {
	let SB: Value = null, sign_types: Value = null, sign_type: Value = null, newsign: Value = null;
	let $0: any;
	f.vars = () => [SB, sign_types, sign_type, newsign, $0];
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0)) && truthy(rt.sv(f, "buildable_sign")))) {
		yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ starts removing ＀...</span>", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You start unfastening ＀.</span>", [live(f.src)])]);
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
		if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(30, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
			return live(f.dot);
		}
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/items/deconstruct.ogg"), 50, 1]);
		yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ unfastens ＀.</span>", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You unfasten ＀.</span>", [live(f.src)])]);
		rt.setFv(f, "icon_state", (SB = (yield* g.new_(f, T("/obj/item/sign_backing"), [rt.getStep(f, live(f.args[1]), 0)]))), rt.sv(f, "icon_state"));
		rt.setFv(f, "sign_path", live(SB), rt.sv(f, "type"));
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	} else {
		if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/pen")) ? 1 : 0)) && truthy(rt.sv(f, "buildable_sign")))) {
			sign_types = rt.list("Secure Area", "Biohazard", "High Voltage", "Radiation", "Hard Vacuum Ahead", "Disposal: Leads To Space", "Danger: Fire", "No Smoking", "Medbay", "Science", "Chemistry", "Hydroponics", "Xenobiology");
			sign_type = null;
			$0 = (yield* g.op(f, "Prompt", [1], [null, "Sign Customization", "Select a sign type.", live(f.args[1]), live(sign_types)]));
			if ($0 === "Blank") {
				sign_type = T("/obj/structure/sign/basic");
			} else if ($0 === "Secure Area") {
				sign_type = T("/obj/structure/sign/securearea");
			} else if ($0 === "Biohazard") {
				sign_type = T("/obj/structure/sign/biohazard");
			} else if ($0 === "High Voltage") {
				sign_type = T("/obj/structure/sign/electricshock");
			} else if ($0 === "Radiation") {
				sign_type = T("/obj/structure/sign/radiation");
			} else if ($0 === "Hard Vacuum Ahead") {
				sign_type = T("/obj/structure/sign/vacuum");
			} else if ($0 === "Disposal: Leads To Space") {
				sign_type = T("/obj/structure/sign/deathsposal");
			} else if ($0 === "Danger: Fire") {
				sign_type = T("/obj/structure/sign/fire");
			} else if ($0 === "No Smoking") {
				sign_type = T("/obj/structure/sign/nosmoking_1");
			} else if ($0 === "Medbay") {
				sign_type = T("/obj/structure/sign/bluecross_2");
			} else if ($0 === "Science") {
				sign_type = T("/obj/structure/sign/science");
			} else if ($0 === "Chemistry") {
				sign_type = T("/obj/structure/sign/chemistry");
			} else if ($0 === "Hydroponics") {
				sign_type = T("/obj/structure/sign/botany");
			} else if ($0 === "Xenobiology") {
				sign_type = T("/obj/structure/sign/xenobio");
			}
			if (!truthy((yield* g.srcCall(f, "Adjacent", live(f.args[1]))))) {
				return live(f.dot);
			}
			if (!truthy(live(sign_type))) {
				return live(f.dot);
			}
			rt.setFv(f, "pixel_x", (newsign = (yield* g.new_(f, live(sign_type), [rt.getStep(f, live(f.src), 0)]))), rt.sv(f, "pixel_x"));
			rt.setFv(f, "pixel_y", live(newsign), rt.sv(f, "pixel_y"));
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		} else {
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
	}
	return f.dot;
}, true, { args: ["O", "user", "params"] });

rt.type(9874, "/obj/item/sign_backing", "/obj/item", {
	sign_path: rt.typePath("/obj/structure/sign/basic"),
	w_class: 3,
	name: "sign backing",
	desc: "A sign with adhesive backing.",
	icon: rt.rsc("icons/obj/decals.dmi"),
	icon_state: "backing",
	resistance_flags: 4,
});

// /obj/item/sign_backing/proc/afterattack  (code/game/objects/structures/signs.dm:102)  may sleep
rt.def("/obj/item/sign_backing/proc/afterattack", function* afterattack(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	if ((truthy((yield* g.call(f, P("/proc/isturf"), null, [live(f.args[0])]))) && truthy(live(f.args[2])))) {
		_T = live(f.args[0]);
		yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ fastens ＀ to ＀.</span>", [live(f.args[1]), live(f.src), live(_T)]), fmt("<span class='notice'>You attach the sign to ＀.</span>", [live(_T)])]);
		yield* g.call(f, P("/proc/playsound"), null, [live(_T), rt.rsc("sound/items/deconstruct.ogg"), 50, 1]);
		yield* g.new_(f, rt.sv(f, "sign_path"), [live(_T)]);
		yield* g.callName(f, live(f.args[1]), "drop_item", []);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["target", "user", "proximity"] });
