// Based on /tg/station's code/game/objects/items/robot/ai_upgrades.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(9357, "/obj/item/device/malf_upgrade", "/obj/item/device", {
	name: "combat software upgrade",
	desc: "A highly illegal, highly dangerous upgrade for artificial intelligence units, granting them a variety of powers as well as the ability to hack APCs.",
	icon: rt.rsc("icons/obj/module.dmi"),
	icon_state: "datadisk3",
});

// ai_upgrades.dm:13
rt.def("/obj/item/device/malf_upgrade/proc/afterattack", function* afterattack(f: Frame, AI: Value, user: Value) {
	if (!rt.istype(AI, T("/mob/living/silicon/ai"))) {
		return f.dot;
	}
	if (AI.malf_picker) {
		AI.malf_picker.processing_time += 50;
		to_chat(AI, `<span class='userdanger'>${user} has attempted to upgrade you with combat software that you already possess. You gain 50 points to spend on Malfunction Modules instead.</span>`);
	} else {
		to_chat(AI, `<span class='userdanger'>${user} has upgraded you with combat software!</span>`);
		yield* AI.add_malf_picker();
	}
	to_chat(user, `<span class='notice'>You upgrade ${AI}. ${this} is consumed in the process.</span>`);
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(9358, "/obj/item/device/surveillance_upgrade", "/obj/item/device", {
	name: "surveillance software upgrade",
	desc: "A software package that will allow an artificial intelligence to 'hear' from its cameras via lip reading.",
	icon: rt.rsc("icons/obj/module.dmi"),
	icon_state: "datadisk3",
});

// ai_upgrades.dm:33
rt.def("/obj/item/device/surveillance_upgrade/proc/afterattack", function* afterattack(f: Frame, AI: Value, user: Value) {
	if (!rt.istype(AI, T("/mob/living/silicon/ai"))) {
		return f.dot;
	}
	if (AI.eyeobj) {
		AI.eyeobj.relay_speech = 1;
		to_chat(AI, `<span class='userdanger'>${user} has upgraded you with surveillance software!</span>`);
		to_chat(AI, "Via a combination of hidden microphones and lip reading software, you are able to use your cameras to listen in on conversations.");
	}
	to_chat(user, `<span class='notice'>You upgrade ${AI}. ${this} is consumed in the process.</span>`);
	yield* qdel(this);
	return f.dot;
}, true);
