// From code/game/objects/items/weapons/implants/implant_misc.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7410, "/obj/item/weapon/implant/weapons_auth", "/obj/item/weapon/implant", {
	activated: 0,
	name: "firearms authentication implant",
	desc: "Lets you shoot your guns",
	icon_state: "auth",
	origin_tech: "magnets=2;programming=7;biotech=5;syndicate=5",
});

// /obj/item/weapon/implant/weapons_auth/proc/get_data  (code/game/objects/items/weapons/implants/implant_misc.dm:9)
rt.def("/obj/item/weapon/implant/weapons_auth/proc/get_data", function get_data(f: Frame) {
	let dat: Value = null;
	f.vars = () => [dat];
	return (dat = "<b>Implant Specifications:</b><BR>\n\t\t\t\t<b>Name:</b> Firearms Authentication Implant<BR>\n\t\t\t\t<b>Life:</b> 4 hours after death of host<BR>\n\t\t\t\t<b>Implant Details:</b> <BR>\n\t\t\t\t<b>Function:</b> Allows operation of implant-locked weaponry, preventing equipment from falling into enemy hands.");
});

rt.type(7411, "/obj/item/weapon/implant/adrenalin", "/obj/item/weapon/implant", {
	uses: 3,
	name: "adrenal implant",
	desc: "Removes all stuns.",
	icon_state: "adrenal",
	origin_tech: "materials=2;biotech=4;combat=3;syndicate=4",
});

// /obj/item/weapon/implant/adrenalin/proc/get_data  (code/game/objects/items/weapons/implants/implant_misc.dm:25)
rt.def("/obj/item/weapon/implant/adrenalin/proc/get_data", function get_data(f: Frame) {
	let dat: Value = null;
	f.vars = () => [dat];
	return (dat = "<b>Implant Specifications:</b><BR>\n\t\t\t\t<b>Name:</b> Cybersun Industries Adrenaline Implant<BR>\n\t\t\t\t<b>Life:</b> Five days.<BR>\n\t\t\t\t<b>Important Notes:</b> <font color='red'>Illegal</font><BR>\n\t\t\t\t<HR>\n\t\t\t\t<b>Implant Details:</b> Subjects injected with implant can activate an injection of medical cocktails.<BR>\n\t\t\t\t<b>Function:</b> Removes stuns, increases speed, and has a mild healing effect.<BR>\n\t\t\t\t<b>Integrity:</b> Implant can only be used three times before reserves are depleted.");
});

// /obj/item/weapon/implant/adrenalin/proc/activate  (code/game/objects/items/weapons/implants/implant_misc.dm:36)  may sleep
rt.def("/obj/item/weapon/implant/adrenalin/proc/activate", function* activate(f: Frame) {
	rt.incSrcVar(f, "uses", -1, true);
	yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "imp_in"), "<span class='notice'>You feel a sudden surge of energy!</span>"]);
	yield* g.callName(f, rt.sv(f, "imp_in"), "SetStun", [0]);
	yield* g.callName(f, rt.sv(f, "imp_in"), "SetKnockdown", [0]);
	yield* g.callName(f, rt.sv(f, "imp_in"), "SetUnconscious", [0]);
	yield* g.callName(f, rt.sv(f, "imp_in"), "adjustStaminaLoss", [-75]);
	rt.setFv(f, "lying", rt.sv(f, "imp_in"), 0);
	yield* g.callName(f, rt.sv(f, "imp_in"), "update_canmove", []);
	yield* g.callName(f, rt.fv(f, "reagents", rt.sv(f, "imp_in")), "add_reagent", ["synaptizine", 10]);
	yield* g.callName(f, rt.fv(f, "reagents", rt.sv(f, "imp_in")), "add_reagent", ["omnizine", 10]);
	yield* g.callName(f, rt.fv(f, "reagents", rt.sv(f, "imp_in")), "add_reagent", ["stimulants", 10]);
	if (truthy(rt.sv(f, "uses"))) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(7412, "/obj/item/weapon/implant/emp", "/obj/item/weapon/implant", {
	uses: 3,
	name: "emp implant",
	desc: "Triggers an EMP.",
	icon_state: "emp",
	origin_tech: "biotech=3;magnets=4;syndicate=1",
});

// /obj/item/weapon/implant/emp/proc/activate  (code/game/objects/items/weapons/implants/implant_misc.dm:60)  may sleep
rt.def("/obj/item/weapon/implant/emp/proc/activate", function* activate(f: Frame) {
	rt.incSrcVar(f, "uses", -1, true);
	yield* g.call(f, P("/proc/empulse"), null, [rt.sv(f, "imp_in"), 3, 5]);
	if (truthy(rt.sv(f, "uses"))) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(7413, "/obj/item/weapon/implant/health", "/obj/item/weapon/implant", {
	healthstring: "",
	activated: 0,
	name: "health implant",
});

// /obj/item/weapon/implant/health/proc/sensehealth  (code/game/objects/items/weapons/implants/implant_misc.dm:74)
rt.def("/obj/item/weapon/implant/health/proc/sensehealth", function sensehealth(f: Frame) {
	let L: Value = null;
	f.vars = () => [L];
	if (!truthy(rt.sv(f, "imp_in"))) {
		return "ERROR";
	}
	if (truthy((rt.istype(rt.sv(f, "imp_in"), T("/mob/living")) ? 1 : 0))) {
		rt.setSv(f, "healthstring", fmt("<small>Oxygen Deprivation Damage => ＀<br />Fire Damage => ＀<br />Toxin Damage => ＀<br />Brute Force Damage => ＀</small>", [rt.call(f, P("/proc/round"), null, [rt.callName(f, (L = rt.sv(f, "imp_in")), "getOxyLoss", [])]), rt.call(f, P("/proc/round"), null, [rt.callName(f, live(L), "getFireLoss", [])]), rt.call(f, P("/proc/round"), null, [rt.callName(f, live(L), "getToxLoss", [])]), rt.call(f, P("/proc/round"), null, [rt.callName(f, live(L), "getBruteLoss", [])])]));
	}
	if (!truthy(rt.sv(f, "healthstring"))) {
		rt.setSv(f, "healthstring", "ERROR");
	}
	return rt.sv(f, "healthstring");
});
