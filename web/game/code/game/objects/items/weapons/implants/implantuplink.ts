// Based on /tg/station's code/game/objects/items/weapons/implants/implantuplink.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(7416, "/obj/item/weapon/implant/uplink", "/obj/item/weapon/implant", {
	starting_tc: 0,
	name: "uplink implant",
	desc: "Sneeki breeki.",
	icon: rt.rsc("icons/obj/radio.dmi"),
	icon_state: "radio",
	origin_tech: "materials=4;magnets=4;programming=4;biotech=4;syndicate=5;bluespace=5",
});

// implantuplink.dm:10
rt.def("/obj/item/weapon/implant/uplink/proc/New", function* New(f: Frame) {
	this.hidden_uplink = (yield* new_(T("/obj/item/device/uplink"), this));
	this.hidden_uplink.telecrystals = this.starting_tc;
	yield* parent_proc();
	return f.dot;
}, true);

// implantuplink.dm:15
rt.def("/obj/item/weapon/implant/uplink/proc/implant", function* implant(f: Frame) {
	let X: Value = null, imp_e: Value = null;
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	for (X of each(f.args[0].implants)) {
		if (rt.op(f, "IsType", [], [X, this.type])) {
			(imp_e = X).hidden_uplink.telecrystals += this.hidden_uplink.telecrystals;
			yield* qdel(this);
			return 1;
		}
	}
	if (yield* parent_proc()) {
		this.hidden_uplink.owner = `${f.args[1].key}`;
		return 1;
	}
	return 0;
}, true, { args: ["target", "user", "silent"] });

// implantuplink.dm:29
rt.def("/obj/item/weapon/implant/uplink/proc/activate", function* activate(f: Frame) {
	if (!this.hidden_uplink) return f.dot;
	yield* this.hidden_uplink.interact(f.usr);
	return f.dot;
}, true);
