// From code/game/objects/items/robot/ai_upgrades.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9357, "/obj/item/device/malf_upgrade", "/obj/item/device", {
	name: "combat software upgrade",
	desc: "A highly illegal, highly dangerous upgrade for artificial intelligence units, granting them a variety of powers as well as the ability to hack APCs.",
	icon: rt.rsc("icons/obj/module.dmi"),
	icon_state: "datadisk3",
});

// /obj/item/device/malf_upgrade/proc/afterattack  (code/game/objects/items/robot/ai_upgrades.dm:13)  may sleep
rt.def("/obj/item/device/malf_upgrade/proc/afterattack", function* afterattack(f: Frame, AI: Value, user: Value) {
	f.vars = () => [AI, user];
	if (!truthy((rt.istype(live(AI), T("/mob/living/silicon/ai")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (truthy(rt.fv(f, "malf_picker", live(AI)))) {
		rt.modField(f, rt.fv(f, "malf_picker", live(AI)), "processing_time", 50, add);
		yield* g.call(f, P("/proc/to_chat"), null, [live(AI), fmt("<span class='userdanger'>＀ has attempted to upgrade you with combat software that you already possess. You gain 50 points to spend on Malfunction Modules instead.</span>", [live(user)])]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(AI), fmt("<span class='userdanger'>＀ has upgraded you with combat software!</span>", [live(user)])]);
		yield* g.callName(f, live(AI), "add_malf_picker", []);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You upgrade ＀. ＀ is consumed in the process.</span>", [live(AI), live(f.src)])]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(9358, "/obj/item/device/surveillance_upgrade", "/obj/item/device", {
	name: "surveillance software upgrade",
	desc: "A software package that will allow an artificial intelligence to 'hear' from its cameras via lip reading.",
	icon: rt.rsc("icons/obj/module.dmi"),
	icon_state: "datadisk3",
});

// /obj/item/device/surveillance_upgrade/proc/afterattack  (code/game/objects/items/robot/ai_upgrades.dm:33)  may sleep
rt.def("/obj/item/device/surveillance_upgrade/proc/afterattack", function* afterattack(f: Frame, AI: Value, user: Value) {
	f.vars = () => [AI, user];
	if (!truthy((rt.istype(live(AI), T("/mob/living/silicon/ai")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (truthy(rt.fv(f, "eyeobj", live(AI)))) {
		rt.setFv(f, "relay_speech", rt.fv(f, "eyeobj", live(AI)), 1);
		yield* g.call(f, P("/proc/to_chat"), null, [live(AI), fmt("<span class='userdanger'>＀ has upgraded you with surveillance software!</span>", [live(user)])]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(AI), "Via a combination of hidden microphones and lip reading software, you are able to use your cameras to listen in on conversations."]);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You upgrade ＀. ＀ is consumed in the process.</span>", [live(AI), live(f.src)])]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);
