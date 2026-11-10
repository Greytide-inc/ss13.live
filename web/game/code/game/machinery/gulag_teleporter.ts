// Based on /tg/station's code/game/machinery/gulag_teleporter.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, add } = rt;


rt.type(10795, "/obj/machinery/gulag_teleporter", "/obj/machinery", {
	locked: 0,
	jumpsuit_type: rt.typePath("/obj/item/clothing/under/rank/prisoner"),
	shoes_type: rt.typePath("/obj/item/clothing/shoes/sneakers/orange"),
	linked_reclaimer: null,
	required_items: null,
	anchored: 1,
	name: "labor camp teleporter",
	desc: "A bluespace teleporter used for teleporting prisoners to the labor camp.",
	icon: rt.rsc("icons/obj/machines/implantchair.dmi"),
	icon_state: "implantchair",
	state_open: 0,
	density: 1,
	use_power: 1,
	idle_power_usage: 200,
	active_power_usage: 5000,
});

// gulag_teleporter.dm:27
rt.def("/obj/machinery/gulag_teleporter/proc/New", function* New(f: Frame) {
	let B: Value = null;
	yield* parent_proc();
	this.required_items = typecacheof(list(T("/obj/item/weapon/implant"), T("/obj/item/clothing/suit/space/eva/plasmaman"), T("/obj/item/clothing/under/plasmaman"), T("/obj/item/clothing/head/helmet/space/plasmaman"), T("/obj/item/weapon/tank/internals"), T("/obj/item/clothing/mask/breath"), T("/obj/item/clothing/mask/gas")));
	yield* (B = (yield* new_(T("/obj/item/weapon/circuitboard/machine/gulag_teleporter"), null))).apply_default_parts(this);
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/machinery/gulag_teleporter/proc/locate_reclaimer"))), 5);
	return f.dot;
}, true);

// gulag_teleporter.dm:42
rt.def("/obj/machinery/gulag_teleporter/proc/Destroy", function* Destroy(f: Frame) {
	if (this.linked_reclaimer) {
		this.linked_reclaimer.linked_teleporter = null;
	}
	return (yield* parent_proc());
}, true);

// gulag_teleporter.dm:46
rt.def("/obj/machinery/gulag_teleporter/proc/power_change", function power_change(f: Frame) {
	parent_proc();
	this.update_icon();
	return f.dot;
});

// gulag_teleporter.dm:52
rt.def("/obj/machinery/gulag_teleporter/proc/interact", function* interact(f: Frame, user: Value) {
	if (this.locked) {
		to_chat(user, `${this} is locked.`);
		return f.dot;
	}
	yield* this.toggle_open();
	return f.dot;
}, true);

// gulag_teleporter.dm:60
rt.def("/obj/machinery/gulag_teleporter/proc/attackby", function* attackby(f: Frame, I: Value, user: Value) {
	if (!this.occupant && this.default_deconstruction_screwdriver(user, `${this.icon_state}`, `${this.icon_state}`, I)) {
		yield* this.update_icon();
		return f.dot;
	}
	if (yield* this.default_deconstruction_crowbar(I)) {
		return f.dot;
	}
	if (yield* this.default_pry_open(I)) {
		return f.dot;
	}
	return (yield* parent_proc());
}, true);

// gulag_teleporter.dm:73
rt.def("/obj/machinery/gulag_teleporter/proc/update_icon", function update_icon(f: Frame) {
	let $0: any = rt.initial(f, this, "icon_state");
	this.icon_state = $0 + (this.state_open ? "_open" : "");
	if (rt.bitAnd(this.stat, 3)) {
		this.icon_state += "_unpowered";
		if (rt.bitAnd(this.stat, MAINT) || this.panel_open) {
			this.icon_state += "_maintenance";
		}
		return f.dot;
	}
	if (rt.bitAnd(this.stat, MAINT) || this.panel_open) {
		this.icon_state += "_maintenance";
		return f.dot;
	}
	if (!this.occupant) return f.dot;
	this.icon_state += "_occupied";
	return f.dot;
});

// gulag_teleporter.dm:92
rt.def("/obj/machinery/gulag_teleporter/proc/relaymove", function* relaymove(f: Frame, user: Value) {
	if (user.stat != 0) {
		return f.dot;
	}
	if (this.locked) {
		to_chat(user, `${this} is locked!`);
		return f.dot;
	}
	yield* this.open_machine();
	return f.dot;
}, true);

// gulag_teleporter.dm:101
rt.def("/obj/machinery/gulag_teleporter/proc/container_resist", function* container_resist(f: Frame, user: Value) {
	let breakout_time: Value = 600;
	if (!this.locked) {
		yield* this.open_machine();
		return f.dot;
	}
	user.changeNext_move(100);
	user.last_special = rt.worldTime(f) + 100;
	to_chat(user, `<span class='notice'>You lean on the back of ${this} and start pushing the door open... (this will take about a minute.)</span>`);
	user.visible_message(`<span class='italics'>You hear a metallic creaking from ${this}!</span>`);
	if (!(yield* do_after(user, breakout_time, { target: this }))) return f.dot;
	if (!user || user.stat != 0 || user.loc != this || this.state_open || !this.locked) {
		return f.dot;
	}
	this.locked = 0;
	this.visible_message(`<span class='warning'>${user} successfully broke out of ${this}!</span>`);
	to_chat(user, `<span class='notice'>You successfully break out of ${this}!</span>`);
	yield* this.open_machine();
	return f.dot;
}, true);

// gulag_teleporter.dm:120
rt.def("/obj/machinery/gulag_teleporter/proc/locate_reclaimer", function locate_reclaimer(f: Frame) {
	this.linked_reclaimer = rt.locateIn(f, T("/obj/machinery/gulag_item_reclaimer"), rt.world());
	if (!this.linked_reclaimer) return f.dot;
	this.linked_reclaimer.linked_teleporter = this;
	return f.dot;
});

// gulag_teleporter.dm:126
rt.def("/obj/machinery/gulag_teleporter/proc/toggle_open", function* toggle_open(f: Frame) {
	if (this.panel_open) {
		to_chat(f.usr, "<span class='notice'>Close the maintenance panel first.</span>");
		return f.dot;
	}
	if (this.state_open) {
		yield* this.close_machine();
		return f.dot;
	}
	if (this.locked) return f.dot;
	yield* this.open_machine();
	return f.dot;
}, true);

// gulag_teleporter.dm:138
rt.def("/obj/machinery/gulag_teleporter/proc/strip_occupant", function* strip_occupant(f: Frame) {
	let W: Value = null;
	if (this.linked_reclaimer) {
		rt.setAt(this.linked_reclaimer.stored_items, this.occupant, list());
	}
	let mob_occupant: Value = this.occupant;
	for (W of each(mob_occupant, T("/obj/item"))) {
		if (!is_type_in_typecache(W, this.required_items) && (yield* mob_occupant.temporarilyRemoveItemFromInventory(W))) {
			if (rt.istype(W, T("/obj/item/weapon/restraints/handcuffs"))) {
				yield* W.forceMove(rt.getStep(f, this, 0));
				continue;
			}
			if (this.linked_reclaimer) {
				rt.modAt(this.linked_reclaimer.stored_items, mob_occupant, W, add);
				this.linked_reclaimer.contents += W;
				yield* W.forceMove(this.linked_reclaimer);
			} else {
				yield* W.forceMove(this);
			}
		}
	}
	return f.dot;
}, true);

// gulag_teleporter.dm:153
rt.def("/obj/machinery/gulag_teleporter/proc/handle_prisoner", function* handle_prisoner(f: Frame, id: Value, R: Value) {
	let prisoner: Value = null;
	if (!rt.istype(this.occupant, T("/mob/living/carbon/human"))) {
		return f.dot;
	}
	yield* this.strip_occupant();
	if (!is_species((prisoner = this.occupant), T("/datum/species/plasmaman")) && this.jumpsuit_type) {
		yield* prisoner.equip_to_appropriate_slot((yield* new_(this.jumpsuit_type)));
	}
	if (this.shoes_type) {
		yield* prisoner.equip_to_appropriate_slot((yield* new_(this.shoes_type)));
	}
	if (id) {
		yield* prisoner.equip_to_appropriate_slot(id);
	}
	if (!R) return f.dot;
	rt.setAt(R.fields, "criminal", "Incarcerated");
	return f.dot;
}, true);

rt.type(6721, "/obj/item/weapon/circuitboard/machine/gulag_teleporter", "/obj/item/weapon/circuitboard/machine", {
	name: "labor camp teleporter (Machine Board)",
	build_path: rt.typePath("/obj/machinery/gulag_teleporter"),
	origin_tech: "programming=3;engineering=4;bluespace=4;materials=4",
	req_components: null,
	def_components: null,
});

// gulag_teleporter.dm:170
rt.def("/obj/item/weapon/circuitboard/machine/gulag_teleporter/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_components = rt.alist(f, [T("/obj/item/weapon/ore/bluespace_crystal"), 2, null, T("/obj/item/weapon/stock_parts/scanning_module"), null, T("/obj/item/weapon/stock_parts/manipulator")]);

	this.def_components = rt.alist(f, [T("/obj/item/weapon/ore/bluespace_crystal"), T("/obj/item/weapon/ore/bluespace_crystal/artificial")]);
	return f.dot;
});
