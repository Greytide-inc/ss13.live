// Based on /tg/station's code/game/objects/items/weapons/implants/implant_storage.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(5515, "/obj/item/weapon/storage/internal/implant", "/obj/item/weapon/storage/internal", {
	name: "bluespace pocket",
	max_w_class: 3,
	max_combined_w_class: 6,
	silent: 1,
	cant_hold: null,
});

// implant_storage.dm:5
rt.def("/obj/item/weapon/storage/internal/implant/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.cant_hold = list(T("/obj/item/weapon/disk/nuclear"));
	return f.dot;
});

rt.type(7414, "/obj/item/weapon/implant/storage", "/obj/item/weapon/implant", {
	storage: null,
	name: "storage implant",
	desc: "Stores up to two big items in a bluespace pocket.",
	icon_state: "storage",
	origin_tech: "materials=2;magnets=4;bluespace=5;syndicate=4",
	item_color: "r",
});

// implant_storage.dm:18
rt.def("/obj/item/weapon/implant/storage/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.storage = (yield* new_(T("/obj/item/weapon/storage/internal/implant"), this));
	return f.dot;
}, true);

// implant_storage.dm:22
rt.def("/obj/item/weapon/implant/storage/proc/activate", function* activate(f: Frame) {
	yield* this.storage.MouseDrop(this.imp_in);
	return f.dot;
}, true);

// implant_storage.dm:25
rt.def("/obj/item/weapon/implant/storage/proc/removed", function* removed(f: Frame) {
	let I: Value = null;
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	if (!(yield* parent_proc())) return f.dot;
	if (!f.args[2]) {
		this.storage.close_all();
		for (I of each(this.storage, T("/obj/item"))) {
			yield* this.storage.remove_from_storage(I, rt.getStep(f, f.args[0], 0));
		}
	}
	return 1;
}, true, { args: ["source", "silent", "special"] });

// implant_storage.dm:33
rt.def("/obj/item/weapon/implant/storage/proc/implant", function* implant(f: Frame) {
	let X: Value = null, imp_e: Value = null;
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	for (X of each(f.args[0].implants)) {
		if (rt.op(f, "IsType", [], [X, this.type])) {
			(imp_e = X).storage.storage_slots += this.storage.storage_slots;
			imp_e.storage.max_combined_w_class += this.storage.max_combined_w_class;
			imp_e.storage.contents += this.storage.contents;
			this.storage.close_all();
			yield* this.storage.show_to(f.args[0]);
			yield* qdel(this);
			return 1;
		}
	}
	return (yield* parent_proc());
}, true, { args: ["target", "user", "silent"] });
