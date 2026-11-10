// Based on /tg/station's code/modules/projectiles/guns/energy/pulse.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(5174, "/obj/item/weapon/gun/energy/pulse", "/obj/item/weapon/gun/energy", {
	modifystate: 1,
	flags: 64,
	name: "pulse rifle",
	desc: "A heavy-duty, multifaceted energy rifle with three modes. Preferred by front-line combat personnel.",
	icon_state: "pulse",
	item_state: null,
	w_class: 4,
	force: 10,
	slot_flags: 1024,
	ammo_type: null,
	cell_type: "/obj/item/weapon/stock_parts/cell/pulse",
});

// pulse.dm:11
rt.def("/obj/item/weapon/gun/energy/pulse/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.ammo_type = list(T("/obj/item/ammo_casing/energy/laser/pulse"), T("/obj/item/ammo_casing/energy/electrode"), T("/obj/item/ammo_casing/energy/laser"));
	return f.dot;
});

rt.type(5175, "/obj/item/weapon/gun/energy/pulse/prize", "/obj/item/weapon/gun/energy/pulse", {
	pin: rt.typePath("/obj/item/device/firing_pin"),
});

// pulse.dm:21
rt.def("/obj/item/weapon/gun/energy/pulse/prize/proc/Initialize", function* Initialize(f: Frame) {
	let msg: Value = null;
	let $0: any;
	f.dot = (yield* parent_proc());
	GLOB.poi_list += this;
	if (this) {
		$0 = `${`(${this.x},${this.y},${this.z})`} ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${this.x};Y=${this.y};Z=${this.z}'>JMP</a>)`}`;
	} else {
		$0 = "nonexistent location";
	}
	message_admins((msg = `A pulse rifle prize has been created at ${`${$0}`}`));
	log_game(msg);
	yield* notify_ghosts("Someone won a pulse rifle as a prize!", { source: this, action: "orbit" });
	return f.dot;
}, true);

// pulse.dm:31
rt.def("/obj/item/weapon/gun/energy/pulse/prize/proc/Destroy", function* Destroy(f: Frame) {
	GLOB.poi_list -= this;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

rt.type(5182, "/obj/item/weapon/gun/energy/pulse/destroyer", "/obj/item/weapon/gun/energy/pulse", {
	name: "pulse destroyer",
	desc: "A heavy-duty energy rifle built for pure destruction.",
	cell_type: "/obj/item/weapon/stock_parts/cell/infinite",
	ammo_type: null,
});

// pulse.dm:68
rt.def("/obj/item/weapon/gun/energy/pulse/destroyer/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.ammo_type = list(T("/obj/item/ammo_casing/energy/laser/pulse"));
	return f.dot;
});

// pulse.dm:71
rt.def("/obj/item/weapon/gun/energy/pulse/destroyer/proc/attack_self", function attack_self(f: Frame, user: Value) {
	to_chat(user, `<span class='danger'>${this.name} has three settings, and they are all DESTROY.</span>`);
	return f.dot;
});
