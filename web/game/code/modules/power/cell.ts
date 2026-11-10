// Based on /tg/station's code/modules/power/cell.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(5707, "/obj/item/weapon/stock_parts/cell", "/obj/item/weapon/stock_parts", {
	charge: 0,
	maxcharge: 1000,
	rigged: 0,
	chargerate: 100,
	self_recharge: 0,
	ratingdesc: 1,
	grown_battery: 0,
	throw_speed: 2,
	throw_range: 5,
	name: "power cell",
	desc: "A rechargable electrochemical power cell.",
	icon: rt.rsc("icons/obj/power.dmi"),
	icon_state: "cell",
	item_state: "cell",
	origin_tech: "powerstorage=1",
	force: 5,
	throwforce: 5,
	w_class: 2,
	materials: null,
});

// cell.dm:15
rt.def("/obj/item/weapon/stock_parts/cell/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 700, "$glass", 50]);
	return f.dot;
});

// cell.dm:26
rt.def("/obj/item/weapon/stock_parts/cell/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	if (!this.isprocessing) {
		this.isprocessing = 1;
		GLOB.SSobj.processing += this;
	}
	this.charge = this.maxcharge;
	if (this.ratingdesc) {
		this.desc += ` This one has a power rating of ${this.maxcharge}, and you should not swallow it.`;
	}
	yield* this.update_icon();
	return f.dot;
}, true);

// cell.dm:34
rt.def("/obj/item/weapon/stock_parts/cell/proc/Destroy", function* Destroy(f: Frame) {
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	return (yield* parent_proc());
}, true);

// cell.dm:38
rt.def("/obj/item/weapon/stock_parts/cell/proc/vv_edit_var", function* vv_edit_var(f: Frame, var_name: Value, var_value: Value) {
	if (var_name === "self_recharge") {
		if (var_value) {
			if (!this.isprocessing) {
				this.isprocessing = 1;
				GLOB.SSobj.processing += this;
			}
		} else {
			this.isprocessing = 0;
			GLOB.SSobj.processing -= this;
		}
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// cell.dm:48
rt.def("/obj/item/weapon/stock_parts/cell/proc/process", function* process(f: Frame) {
	if (this.self_recharge) {
		yield* this.give(this.chargerate * 0.25);
	} else {
		return 26;
	}
	return f.dot;
}, true, { waitfor: false });

// cell.dm:53
rt.def("/obj/item/weapon/stock_parts/cell/proc/update_icon", function update_icon(f: Frame) {
	this.cut_overlays();
	if (this.grown_battery) {
		this.add_overlay("grown_wires");
	}
	if (this.charge < 0.01) {
		return f.dot;
	} else if (this.charge / this.maxcharge >= 0.995) {
		this.add_overlay("cell-o2");
	} else {
		this.add_overlay("cell-o1");
	}
	return f.dot;
});

// cell.dm:64
rt.def("/obj/item/weapon/stock_parts/cell/proc/percent", function percent(f: Frame) {
	return 100 * this.charge / this.maxcharge;
});

// cell.dm:68
rt.def("/obj/item/weapon/stock_parts/cell/proc/use", function* use(f: Frame, amount: Value) {
	if (this.rigged && amount > 0) {
		yield* this.explode();
		return 0;
	}
	if (this.charge < amount) {
		return 0;
	}
	this.charge = this.charge - amount;
	return 1;
}, true);

// cell.dm:80
rt.def("/obj/item/weapon/stock_parts/cell/proc/give", function* give(f: Frame, amount: Value) {
	let power_used: Value = null;
	if (this.rigged && amount > 0) {
		yield* this.explode();
		return 0;
	}
	if (this.maxcharge < amount) {
		amount = this.maxcharge;
	}
	this.charge += (power_used = min(this.maxcharge - this.charge, amount));
	return power_used;
}, true);

// cell.dm:90
rt.def("/obj/item/weapon/stock_parts/cell/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (this.rigged) {
		to_chat(user, "<span class='danger'>This power cell seems to be faulty!</span>");
	} else {
		to_chat(user, `The charge meter reads ${round(this.percent())}%.`);
	}
	return f.dot;
}, false);

// cell.dm:97
rt.def("/obj/item/weapon/stock_parts/cell/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	user.visible_message(`<span class='suicide'>${user} is licking the electrodes of ${this}! It looks like ${user.p_theyre()} trying to commit suicide!</span>`);
	return 2;
});

// cell.dm:101
rt.def("/obj/item/weapon/stock_parts/cell/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	yield* parent_proc();
	if (!rt.istype(W, T("/obj/item/weapon/reagent_containers/syringe"))) return f.dot;
	let S: Value = W;
	to_chat(user, "<span class='notice'>You inject the solution into the power cell.</span>");
	if (S.reagents.has_reagent("plasma", 5)) {
		this.rigged = 1;
	}
	yield* S.reagents.clear_reagents();
	return f.dot;
}, true);

// cell.dm:111
rt.def("/obj/item/weapon/stock_parts/cell/proc/explode", function* explode(f: Frame) {
	let _T: Value = rt.getStep(f, this.loc, 0);
	if (this.charge == 0) {
		return f.dot;
	}
	let devastation_range: Value = -1;
	let heavy_impact_range: Value = round(rt.op(f, "Sqrt", [], [this.charge]) / 60);
	let light_impact_range: Value = round(rt.op(f, "Sqrt", [], [this.charge]) / 30);
	let flash_range: Value = light_impact_range;
	if (light_impact_range == 0) {
		this.rigged = 0;
		this.corrupt();
		return f.dot;
	}
	yield* explosion(_T, devastation_range, heavy_impact_range, light_impact_range, flash_range);
	yield* qdel(this);
	return f.dot;
}, true);

// cell.dm:133
rt.def("/obj/item/weapon/stock_parts/cell/proc/corrupt", function corrupt(f: Frame) {
	this.charge /= 2;
	this.maxcharge = max(this.maxcharge / 2, this.chargerate);
	if (!prob(10)) return f.dot;
	this.rigged = 1;
	return f.dot;
});

// cell.dm:139
rt.def("/obj/item/weapon/stock_parts/cell/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	this.charge -= 1000 / severity;
	if (this.charge < 0) {
		this.charge = 0;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// cell.dm:145
rt.def("/obj/item/weapon/stock_parts/cell/proc/ex_act", function ex_act(f: Frame, severity: Value, target: Value) {
	parent_proc();
	if (!this || this.gc_destroyed) return f.dot;
	if (severity === 2) {
		if (prob(50)) {
			this.corrupt();
		}
	} else if (severity === 3) {
		if (!prob(25)) return f.dot;
		this.corrupt();
	}
	return f.dot;
}, false, { waitfor: false });

// cell.dm:157
rt.def("/obj/item/weapon/stock_parts/cell/proc/blob_act", function blob_act(f: Frame, B: Value) {
	this.ex_act(1);
	return f.dot;
});

// cell.dm:160
rt.def("/obj/item/weapon/stock_parts/cell/proc/get_electrocute_damage", function get_electrocute_damage(f: Frame) {
	if (this.charge >= 1000) {
		return max(10, min(round(this.charge / 10000), 90)) + rand(-5, 5);
	}
	return 0;
});

rt.type(5713, "/obj/item/weapon/stock_parts/cell/crap", "/obj/item/weapon/stock_parts/cell", {
	maxcharge: 500,
	name: "１Nanotrasen brand rechargable AA battery",
	desc: "You can't top the plasma top.",
	materials: null,
	rating: 2,
});

// cell.dm:170
rt.def("/obj/item/weapon/stock_parts/cell/crap/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$glass", 40]);
	return f.dot;
});

rt.type(5714, "/obj/item/weapon/stock_parts/cell/crap/empty", "/obj/item/weapon/stock_parts/cell/crap", {});

// cell.dm:174
rt.def("/obj/item/weapon/stock_parts/cell/crap/empty/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.charge = 0;
	return f.dot;
}, true);

rt.type(5715, "/obj/item/weapon/stock_parts/cell/secborg", "/obj/item/weapon/stock_parts/cell", {
	maxcharge: 600,
	name: "security borg rechargable D battery",
	origin_tech: null,
	materials: null,
	rating: 2.5,
});

// cell.dm:181
rt.def("/obj/item/weapon/stock_parts/cell/secborg/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$glass", 40]);
	return f.dot;
});

rt.type(5716, "/obj/item/weapon/stock_parts/cell/secborg/empty", "/obj/item/weapon/stock_parts/cell/secborg", {});

// cell.dm:185
rt.def("/obj/item/weapon/stock_parts/cell/secborg/empty/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.charge = 0;
	return f.dot;
}, true);

rt.type(5720, "/obj/item/weapon/stock_parts/cell/high", "/obj/item/weapon/stock_parts/cell", {
	maxcharge: 10000,
	chargerate: 1500,
	name: "high-capacity power cell",
	origin_tech: "powerstorage=2",
	icon_state: "hcell",
	materials: null,
	rating: 3,
});

// cell.dm:207
rt.def("/obj/item/weapon/stock_parts/cell/high/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$glass", 60]);
	return f.dot;
});

rt.type(5722, "/obj/item/weapon/stock_parts/cell/high/empty", "/obj/item/weapon/stock_parts/cell/high", {});

// cell.dm:219
rt.def("/obj/item/weapon/stock_parts/cell/high/empty/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.charge = 0;
	return f.dot;
}, true);

rt.type(5724, "/obj/item/weapon/stock_parts/cell/super", "/obj/item/weapon/stock_parts/cell", {
	maxcharge: 20000,
	chargerate: 2000,
	name: "super-capacity power cell",
	origin_tech: "powerstorage=3;materials=3",
	icon_state: "scell",
	materials: null,
	rating: 4,
});

// cell.dm:227
rt.def("/obj/item/weapon/stock_parts/cell/super/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$glass", 300]);
	return f.dot;
});

rt.type(5725, "/obj/item/weapon/stock_parts/cell/super/empty", "/obj/item/weapon/stock_parts/cell/super", {});

// cell.dm:232
rt.def("/obj/item/weapon/stock_parts/cell/super/empty/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.charge = 0;
	return f.dot;
}, true);

rt.type(5726, "/obj/item/weapon/stock_parts/cell/hyper", "/obj/item/weapon/stock_parts/cell", {
	maxcharge: 30000,
	chargerate: 3000,
	name: "hyper-capacity power cell",
	origin_tech: "powerstorage=4;engineering=4;materials=4",
	icon_state: "hpcell",
	materials: null,
	rating: 5,
});

// cell.dm:240
rt.def("/obj/item/weapon/stock_parts/cell/hyper/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$glass", 400]);
	return f.dot;
});

rt.type(5727, "/obj/item/weapon/stock_parts/cell/hyper/empty", "/obj/item/weapon/stock_parts/cell/hyper", {});

// cell.dm:245
rt.def("/obj/item/weapon/stock_parts/cell/hyper/empty/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.charge = 0;
	return f.dot;
}, true);

rt.type(5728, "/obj/item/weapon/stock_parts/cell/bluespace", "/obj/item/weapon/stock_parts/cell", {
	maxcharge: 40000,
	chargerate: 4000,
	name: "bluespace power cell",
	desc: "A rechargable transdimensional power cell.",
	origin_tech: "powerstorage=5;bluespace=4;materials=4;engineering=4",
	icon_state: "bscell",
	materials: null,
	rating: 6,
});

// cell.dm:254
rt.def("/obj/item/weapon/stock_parts/cell/bluespace/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$glass", 600]);
	return f.dot;
});

rt.type(5729, "/obj/item/weapon/stock_parts/cell/bluespace/empty", "/obj/item/weapon/stock_parts/cell/bluespace", {});

// cell.dm:259
rt.def("/obj/item/weapon/stock_parts/cell/bluespace/empty/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.charge = 0;
	return f.dot;
}, true);

rt.type(5730, "/obj/item/weapon/stock_parts/cell/infinite", "/obj/item/weapon/stock_parts/cell", {
	maxcharge: 30000,
	chargerate: 30000,
	name: "infinite-capacity power cell!",
	icon_state: "icell",
	origin_tech: "powerstorage=7",
	materials: null,
	rating: 6,
});

// cell.dm:267
rt.def("/obj/item/weapon/stock_parts/cell/infinite/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$glass", 1000]);
	return f.dot;
});

rt.type(5732, "/obj/item/weapon/stock_parts/cell/potato", "/obj/item/weapon/stock_parts/cell", {
	charge: 100,
	maxcharge: 300,
	grown_battery: 1,
	name: "potato battery",
	desc: "A rechargable starch based power cell.",
	icon: rt.rsc("icons/obj/hydroponics/harvest.dmi"),
	icon_state: "potato",
	origin_tech: "powerstorage=1;biotech=1",
	materials: null,
	rating: 1,
});

// cell.dm:296
rt.def("/obj/item/weapon/stock_parts/cell/potato/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = list();
	return f.dot;
});

rt.type(5723, "/obj/item/weapon/stock_parts/cell/high/slime", "/obj/item/weapon/stock_parts/cell/high", {
	self_recharge: 1,
	name: "charged slime core",
	desc: "A yellow slime core infused with plasma, it crackles with power.",
	origin_tech: "powerstorage=5;biotech=4",
	icon: rt.rsc("icons/mob/slimes.dmi"),
	icon_state: "yellow slime extract",
	materials: null,
});

// cell.dm:306
rt.def("/obj/item/weapon/stock_parts/cell/high/slime/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = list();
	return f.dot;
});

rt.type(5734, "/obj/item/weapon/stock_parts/cell/emproof/empty", "/obj/item/weapon/stock_parts/cell/emproof", {});

// cell.dm:316
rt.def("/obj/item/weapon/stock_parts/cell/emproof/empty/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.charge = 0;
	return f.dot;
}, true);

rt.type(5735, "/obj/item/weapon/stock_parts/cell/beam_rifle", "/obj/item/weapon/stock_parts/cell", {
	maxcharge: 50000,
	chargerate: 5000,
	name: "beam rifle capacitor",
	desc: "A high powered capacitor that can provide huge amounts of energy in an instant",
	rating: 4,
});

// cell.dm:336
rt.def("/obj/item/weapon/stock_parts/cell/beam_rifle/proc/emp_act", function emp_act(f: Frame, severity: Value) {
	this.charge = max(0, min(this.charge - 10000 / severity, this.maxcharge));
	return f.dot;
});
