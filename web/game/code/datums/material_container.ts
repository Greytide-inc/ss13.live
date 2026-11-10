// Based on /tg/station's code/datums/material_container.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(574, "/datum/material_container", "/datum", {
	total_amount: 0,
	max_amount: null,
	sheet_type: null,
	owner: null,
	materials: null,
});

// material_container.dm:17
rt.def("/datum/material_container/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = list();
	return f.dot;
});

// material_container.dm:22
rt.def("/datum/material_container/proc/New", function* New(f: Frame, O: Value, mat_list: Value, max_amt: Value) {
	let mat_type: Value = null, MT: Value = null, id: Value = null, mat_path: Value = null;
	max_amt ??= 0;
	this.owner = O;
	this.max_amount = max(0, max_amt);
	let possible_mats: Value = list();
	for (mat_type of each(typesof(T("/datum/material")) - T("/datum/material"))) {
		MT = mat_type;
		rt.setAt(possible_mats, rt.initial(f, MT, "id"), mat_type);
	}
	for (id of each(mat_list)) {
		if (rt.index(possible_mats, id)) {
			mat_path = rt.index(possible_mats, id);
			rt.setAt(this.materials, id, (yield* new_(mat_path)));
		}
	}
	return f.dot;
}, true);

// material_container.dm:36
rt.def("/datum/material_container/proc/Destroy", function* Destroy(f: Frame) {
	this.owner = null;
	return (yield* parent_proc());
}, true);

// material_container.dm:40
rt.def("/datum/material_container/proc/insert_amount", function insert_amount(f: Frame, amt: Value, id: Value) {
	let total_amount_saved: Value = null, M: Value = null, i: Value = null, M_2: Value = null;
	if (amt > 0 && this.has_space(amt)) {
		total_amount_saved = this.total_amount;
		if (id) {
			if (M = rt.index(this.materials, id)) {
				M.amount += amt;
				this.total_amount += amt;
			}
		} else {
			for (i of each(this.materials)) {
				(M_2 = rt.index(this.materials, i)).amount += amt;
				this.total_amount += amt;
			}
		}
		return this.total_amount - total_amount_saved;
	}
	return 0;
});

// material_container.dm:56
rt.def("/datum/material_container/proc/insert_stack", function* insert_stack(f: Frame, S: Value, amt: Value) {
	let material_amt: Value = null;
	amt ??= 0;
	if (amt <= 0) {
		return 0;
	}
	if (amt > S.amount) {
		amt = S.amount;
	}
	if (!(material_amt = this.get_item_material_amount(S))) {
		return 0;
	}
	if (!(amt = min(amt, round((this.max_amount - this.total_amount) / material_amt)))) {
		return 0;
	}
	this.insert_materials(S, amt);
	yield* S.use(amt);
	return amt;
}, true);

// material_container.dm:74
rt.def("/datum/material_container/proc/insert_item", function* insert_item(f: Frame, I: Value, multiplier: Value) {
	let S: Value = null, material_amount: Value = null;
	multiplier ??= 1;
	if (!I) {
		return 0;
	}
	if (rt.istype(I, T("/obj/item/stack"))) {
		S = I;
		return (yield* this.insert_stack(I, S.amount));
	}
	if (!(material_amount = this.get_item_material_amount(I)) || !this.has_space(material_amount)) {
		return 0;
	}
	this.insert_materials(I, multiplier);
	return material_amount;
}, true);

// material_container.dm:89
rt.def("/datum/material_container/proc/insert_materials", function insert_materials(f: Frame, I: Value, multiplier: Value) {
	let M: Value = null, MAT: Value = null;
	multiplier ??= 1;
	for (MAT of each(this.materials)) {
		(M = rt.index(this.materials, MAT)).amount += rt.index(I.materials, MAT) * multiplier;
		this.total_amount += rt.index(I.materials, MAT) * multiplier;
	}
	return f.dot;
});

// material_container.dm:97
rt.def("/datum/material_container/proc/use_amount", function use_amount(f: Frame, mats: Value, multiplier: Value) {
	let M: Value = null, MAT: Value = null, MAT_2: Value = null;
	multiplier ??= 1;
	if (!mats || !rt.len(f, mats)) {
		return 0;
	}
	for (MAT of each(this.materials)) {
		if ((M = rt.index(this.materials, MAT)).amount < rt.index(mats, MAT) * multiplier) {
			return 0;
		}
	}
	let total_amount_save: Value = this.total_amount;
	for (MAT_2 of each(this.materials)) {
		(M = rt.index(this.materials, MAT_2)).amount -= rt.index(mats, MAT_2) * multiplier;
		this.total_amount -= rt.index(mats, MAT_2) * multiplier;
	}
	return total_amount_save - this.total_amount;
});

// material_container.dm:116
rt.def("/datum/material_container/proc/use_amount_type", function use_amount_type(f: Frame, amt: Value, id: Value) {
	let M: Value = null;
	if (M = rt.index(this.materials, id)) {
		if (M.amount >= amt) {
			M.amount -= amt;
			this.total_amount -= amt;
			return amt;
		}
	}
	return 0;
});

// material_container.dm:140
rt.def("/datum/material_container/proc/retrieve", function* retrieve(f: Frame, sheet_amt: Value, M: Value, target: Value) {
	let count: Value = null, s: Value = null;
	if (!M.sheet_type) {
		return 0;
	}
	if (typeof sheet_amt === "number") sheet_amt = Math.floor(sheet_amt); // tg_js: whole sheets only (1.5 made a stack of 1.5); NaN and Infinity fall out below
	if (typeof sheet_amt === "number" && !Number.isFinite(sheet_amt) && sheet_amt > 0) sheet_amt = 1e9; // clamped to the stock just below
	if (sheet_amt > 0) {
		if (M.amount < sheet_amt * 2000) {
			sheet_amt = round(M.amount / 2000);
		}
		count = 0;
		while (sheet_amt > 50) {
			yield* new_(M.sheet_type, rt.getStep(f, this.owner, 0), 50);
			count += 50;
			this.use_amount_type(50 * 2000, M.id); // tg_js: charge the 50 handed out (it charged the whole remaining amount)
			sheet_amt -= 50;
		}
		if (round(sheet_amt * 2000 / 2000)) {
			s = (yield* new_(M.sheet_type, rt.getStep(f, this.owner, 0), sheet_amt));
			if (target) {
				yield* s.forceMove(target);
			}
			count += sheet_amt;
			this.use_amount_type(sheet_amt * 2000, M.id);
		}
		return count;
	}
	return 0;
}, true);

// material_container.dm:161
rt.def("/datum/material_container/proc/retrieve_sheets", function* retrieve_sheets(f: Frame, sheet_amt: Value, id: Value, target: Value) {
	if (rt.index(this.materials, id)) {
		return (yield* this.retrieve(sheet_amt, rt.index(this.materials, id), target));
	}
	return 0;
}, true);

// material_container.dm:171
rt.def("/datum/material_container/proc/retrieve_all", function* retrieve_all(f: Frame, target: Value) {
	let M: Value = null, MAT: Value = null;
	let result: Value = 0;
	for (MAT of each(this.materials)) {
		result += (yield* this.retrieve_sheets(this.amount2sheet((M = rt.index(this.materials, MAT)).amount), MAT, target));
	}
	return result;
}, true);

// material_container.dm:177
rt.def("/datum/material_container/proc/has_space", function has_space(f: Frame, amt: Value) {
	amt ??= 0;
	return (this.total_amount + amt <= this.max_amount ? 1 : 0);
});

// material_container.dm:180
rt.def("/datum/material_container/proc/has_materials", function has_materials(f: Frame, mats: Value, multiplier: Value) {
	let M: Value = null, MAT: Value = null;
	multiplier ??= 1;
	if (!mats || !rt.len(f, mats)) {
		return 0;
	}
	for (MAT of each(mats)) {
		if ((M = rt.index(this.materials, MAT)).amount < rt.index(mats, MAT) * multiplier) {
			return 0;
		}
	}
	return 1;
});

// material_container.dm:191
rt.def("/datum/material_container/proc/amount2sheet", function amount2sheet(f: Frame, amt: Value) {
	if (amt >= MINERAL_MATERIAL_AMOUNT) {
		return round(amt / MINERAL_MATERIAL_AMOUNT);
	}
	return 0;
});

// material_container.dm:201
rt.def("/datum/material_container/proc/amount", function amount(f: Frame, id: Value) {
	let M: Value = null;
	return (M = rt.index(this.materials, id)) ? M.amount : 0;
});

// material_container.dm:207
rt.def("/datum/material_container/proc/get_item_material_amount", function get_item_material_amount(f: Frame, I: Value) {
	let MAT: Value = null;
	if (!rt.istype(I, T("/obj/item"))) {
		return 0;
	}
	let material_amount: Value = 0;
	for (MAT of each(this.materials)) {
		material_amount += rt.index(I.materials, MAT);
	}
	return material_amount;
});
