// Based on /tg/station's code/game/objects/items/weapons/implants/implant_chem.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(7401, "/obj/item/weapon/implant/chem", "/obj/item/weapon/implant", {
	container_type: 4096,
	name: "chem implant",
	desc: "Injects things.",
	icon_state: "reagents",
	origin_tech: "materials=3;biotech=4",
});

// implant_chem.dm:9
rt.def("/obj/item/weapon/implant/chem/proc/get_data", function get_data(f: Frame) {
	let dat: Value = null;
	return (dat = "<b>Implant Specifications:</b><BR>\n\t\t\t\t<b>Name:</b> Robust Corp MJ-420 Prisoner Management Implant<BR>\n\t\t\t\t<b>Life:</b> Deactivates upon death but remains within the body.<BR>\n\t\t\t\t<b>Important Notes: Due to the system functioning off of nutrients in the implanted subject's body, the subject<BR>\n\t\t\t\twill suffer from an increased appetite.</B><BR>\n\t\t\t\t<HR>\n\t\t\t\t<b>Implant Details:</b><BR>\n\t\t\t\t<b>Function:</b> Contains a small capsule that can contain various chemicals. Upon receiving a specially encoded signal<BR>\n\t\t\t\tthe implant releases the chemicals directly into the blood stream.<BR>\n\t\t\t\t<b>Special Features:</b>\n\t\t\t\t<i>Micro-Capsule</i>- Can be loaded with any sort of chemical agent via the common syringe and can hold 50 units.<BR>\n\t\t\t\tCan only be loaded while still in its original case.<BR>\n\t\t\t\t<b>Integrity:</b> Implant will last so long as the subject is alive.");
});

// implant_chem.dm:25
rt.def("/obj/item/weapon/implant/chem/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	yield* this.create_reagents(50);
	GLOB.tracked_chem_implants += this;
	return f.dot;
}, true);

// implant_chem.dm:30
rt.def("/obj/item/weapon/implant/chem/proc/Destroy", function* Destroy(f: Frame) {
	f.dot = (yield* parent_proc());
	GLOB.tracked_chem_implants -= this;
	return f.dot;
}, true);

// implant_chem.dm:34
rt.def("/obj/item/weapon/implant/chem/proc/trigger", function* trigger(f: Frame, emote: Value, source: Value) {
	if (emote != "deathgasp") return f.dot;
	yield* this.activate(this.reagents.total_volume);
	return f.dot;
}, true);

// implant_chem.dm:38
rt.def("/obj/item/weapon/implant/chem/proc/activate", function* activate(f: Frame, cause: Value) {
	let injectamount: Value = null;
	if (!cause || !this.imp_in) {
		return 0;
	}
	let R: Value = this.imp_in;
	if (cause == "action_button") {
		injectamount = this.reagents.total_volume;
	} else {
		injectamount = cause;
	}
	yield* this.reagents.trans_to(R, injectamount);
	to_chat(R, "<span class='italics'>You hear a faint beep.</span>");
	if (this.reagents.total_volume) return f.dot;
	to_chat(R, "<span class='italics'>You hear a faint click from your chest.</span>");
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(7419, "/obj/item/weapon/implantcase/chem", "/obj/item/weapon/implantcase", {
	name: "implant case - 'Remote Chemical'",
	desc: "A glass case containing a remote chemical implant.",
	imp_type: rt.typePath("/obj/item/weapon/implant/chem"),
});

// implant_chem.dm:59
rt.def("/obj/item/weapon/implantcase/chem/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	if (rt.istype(W, T("/obj/item/weapon/reagent_containers/syringe")) && this.imp) {
		yield* W.afterattack(this.imp, user, 1, params);
		return 1;
	} else {
		return (yield* parent_proc());
	}
}, true);
