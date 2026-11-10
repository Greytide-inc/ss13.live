// Based on /tg/station's code/game/objects/items/weapons/implants/implant_misc.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(7410, "/obj/item/weapon/implant/weapons_auth", "/obj/item/weapon/implant", {
	activated: 0,
	name: "firearms authentication implant",
	desc: "Lets you shoot your guns",
	icon_state: "auth",
	origin_tech: "magnets=2;programming=7;biotech=5;syndicate=5",
});

// implant_misc.dm:9
rt.def("/obj/item/weapon/implant/weapons_auth/proc/get_data", function get_data(f: Frame) {
	let dat: Value = null;
	return (dat = "<b>Implant Specifications:</b><BR>\n\t\t\t\t<b>Name:</b> Firearms Authentication Implant<BR>\n\t\t\t\t<b>Life:</b> 4 hours after death of host<BR>\n\t\t\t\t<b>Implant Details:</b> <BR>\n\t\t\t\t<b>Function:</b> Allows operation of implant-locked weaponry, preventing equipment from falling into enemy hands.");
});

rt.type(7411, "/obj/item/weapon/implant/adrenalin", "/obj/item/weapon/implant", {
	uses: 3,
	name: "adrenal implant",
	desc: "Removes all stuns.",
	icon_state: "adrenal",
	origin_tech: "materials=2;biotech=4;combat=3;syndicate=4",
});

// implant_misc.dm:25
rt.def("/obj/item/weapon/implant/adrenalin/proc/get_data", function get_data(f: Frame) {
	let dat: Value = null;
	return (dat = "<b>Implant Specifications:</b><BR>\n\t\t\t\t<b>Name:</b> Cybersun Industries Adrenaline Implant<BR>\n\t\t\t\t<b>Life:</b> Five days.<BR>\n\t\t\t\t<b>Important Notes:</b> <font color='red'>Illegal</font><BR>\n\t\t\t\t<HR>\n\t\t\t\t<b>Implant Details:</b> Subjects injected with implant can activate an injection of medical cocktails.<BR>\n\t\t\t\t<b>Function:</b> Removes stuns, increases speed, and has a mild healing effect.<BR>\n\t\t\t\t<b>Integrity:</b> Implant can only be used three times before reserves are depleted.");
});

// implant_misc.dm:36
rt.def("/obj/item/weapon/implant/adrenalin/proc/activate", function* activate(f: Frame) {
	this.uses--;
	to_chat(this.imp_in, "<span class='notice'>You feel a sudden surge of energy!</span>");
	yield* this.imp_in.SetStun(0);
	yield* this.imp_in.SetKnockdown(0);
	yield* this.imp_in.SetUnconscious(0);
	yield* this.imp_in.adjustStaminaLoss(-75);
	this.imp_in.lying = 0;
	yield* this.imp_in.update_canmove();
	yield* this.imp_in.reagents.add_reagent("synaptizine", 10);
	yield* this.imp_in.reagents.add_reagent("omnizine", 10);
	yield* this.imp_in.reagents.add_reagent("stimulants", 10);
	if (this.uses) return f.dot;
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(7412, "/obj/item/weapon/implant/emp", "/obj/item/weapon/implant", {
	uses: 3,
	name: "emp implant",
	desc: "Triggers an EMP.",
	icon_state: "emp",
	origin_tech: "biotech=3;magnets=4;syndicate=1",
});

// implant_misc.dm:60
rt.def("/obj/item/weapon/implant/emp/proc/activate", function* activate(f: Frame) {
	this.uses--;
	yield* empulse(this.imp_in, 3, 5);
	if (this.uses) return f.dot;
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(7413, "/obj/item/weapon/implant/health", "/obj/item/weapon/implant", {
	healthstring: "",
	activated: 0,
	name: "health implant",
});

// implant_misc.dm:74
rt.def("/obj/item/weapon/implant/health/proc/sensehealth", function sensehealth(f: Frame) {
	let L: Value = null;
	if (!this.imp_in) {
		return "ERROR";
	}
	if (rt.istype(this.imp_in, T("/mob/living"))) {
		this.healthstring = `<small>Oxygen Deprivation Damage => ${round((L = this.imp_in).getOxyLoss())}<br />Fire Damage => ${round(L.getFireLoss())}<br />Toxin Damage => ${round(L.getToxLoss())}<br />Brute Force Damage => ${round(L.getBruteLoss())}</small>`;
	}
	if (!this.healthstring) {
		this.healthstring = "ERROR";
	}
	return this.healthstring;
});
