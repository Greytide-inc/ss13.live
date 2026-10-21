// From code/game/objects/items/weapons/implants/implant_chem.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7401, "/obj/item/weapon/implant/chem", "/obj/item/weapon/implant", {
	container_type: 4096,
	name: "chem implant",
	desc: "Injects things.",
	icon_state: "reagents",
	origin_tech: "materials=3;biotech=4",
});

// /obj/item/weapon/implant/chem/proc/get_data  (code/game/objects/items/weapons/implants/implant_chem.dm:9)
rt.def("/obj/item/weapon/implant/chem/proc/get_data", function get_data(f: Frame) {
	let dat: Value = null;
	f.vars = () => [dat];
	return (dat = "<b>Implant Specifications:</b><BR>\n\t\t\t\t<b>Name:</b> Robust Corp MJ-420 Prisoner Management Implant<BR>\n\t\t\t\t<b>Life:</b> Deactivates upon death but remains within the body.<BR>\n\t\t\t\t<b>Important Notes: Due to the system functioning off of nutrients in the implanted subject's body, the subject<BR>\n\t\t\t\twill suffer from an increased appetite.</B><BR>\n\t\t\t\t<HR>\n\t\t\t\t<b>Implant Details:</b><BR>\n\t\t\t\t<b>Function:</b> Contains a small capsule that can contain various chemicals. Upon receiving a specially encoded signal<BR>\n\t\t\t\tthe implant releases the chemicals directly into the blood stream.<BR>\n\t\t\t\t<b>Special Features:</b>\n\t\t\t\t<i>Micro-Capsule</i>- Can be loaded with any sort of chemical agent via the common syringe and can hold 50 units.<BR>\n\t\t\t\tCan only be loaded while still in its original case.<BR>\n\t\t\t\t<b>Integrity:</b> Implant will last so long as the subject is alive.");
});

// /obj/item/weapon/implant/chem/proc/New  (code/game/objects/items/weapons/implants/implant_chem.dm:25)  may sleep
rt.def("/obj/item/weapon/implant/chem/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "create_reagents", 50);
	rt.modGl("tracked_chem_implants", live(f.src), add);
	return f.dot;
}, true);

// /obj/item/weapon/implant/chem/proc/Destroy  (code/game/objects/items/weapons/implants/implant_chem.dm:30)  may sleep
rt.def("/obj/item/weapon/implant/chem/proc/Destroy", function* Destroy(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	(rt.modGl("tracked_chem_implants", live(f.src), subtract));
	return f.dot;
}, true);

// /obj/item/weapon/implant/chem/proc/trigger  (code/game/objects/items/weapons/implants/implant_chem.dm:34)  may sleep
rt.def("/obj/item/weapon/implant/chem/proc/trigger", function* trigger(f: Frame, emote: Value, source: Value) {
	f.vars = () => [emote, source];
	if (!isEqual(live(emote), "deathgasp")) return f.dot;
	yield* g.srcCall(f, "activate", rt.fv(f, "total_volume", rt.sv(f, "reagents")));
	return f.dot;
}, true);

// /obj/item/weapon/implant/chem/proc/activate  (code/game/objects/items/weapons/implants/implant_chem.dm:38)  may sleep
rt.def("/obj/item/weapon/implant/chem/proc/activate", function* activate(f: Frame, cause: Value) {
	let R: Value = null, injectamount: Value = null;
	f.vars = () => [cause, R, injectamount];
	if ((!truthy(live(cause)) || !truthy(rt.sv(f, "imp_in")))) {
		return 0;
	}
	R = rt.sv(f, "imp_in");
	injectamount = null;
	if (isEqual(live(cause), "action_button")) {
		injectamount = rt.fv(f, "total_volume", rt.sv(f, "reagents"));
	} else {
		injectamount = live(cause);
	}
	yield* g.callName(f, rt.sv(f, "reagents"), "trans_to", [live(R), live(injectamount)]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(R), "<span class='italics'>You hear a faint beep.</span>"]);
	if (truthy(rt.fv(f, "total_volume", rt.sv(f, "reagents")))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [live(R), "<span class='italics'>You hear a faint click from your chest.</span>"]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(7419, "/obj/item/weapon/implantcase/chem", "/obj/item/weapon/implantcase", {
	name: "implant case - 'Remote Chemical'",
	desc: "A glass case containing a remote chemical implant.",
	imp_type: rt.typePath("/obj/item/weapon/implant/chem"),
});

// /obj/item/weapon/implantcase/chem/proc/attackby  (code/game/objects/items/weapons/implants/implant_chem.dm:59)  may sleep
rt.def("/obj/item/weapon/implantcase/chem/proc/attackby", function* attackby(f: Frame) {
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/reagent_containers/syringe")) ? 1 : 0)) && truthy(rt.sv(f, "imp")))) {
		yield* g.callName(f, live(f.args[0]), "afterattack", [rt.sv(f, "imp"), live(f.args[1]), 1, live(f.args[2])]);
		return 1;
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });
