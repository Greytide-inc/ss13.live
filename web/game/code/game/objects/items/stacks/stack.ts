// Based on /tg/station's code/game/objects/items/stacks/stack.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g, add, fmt } = rt;


rt.type(8968, "/obj/item/stack", "/obj/item", {
	recipes: null,
	singular_name: null,
	amount: 1,
	max_amount: 50,
	is_cyborg: 0,
	source: null,
	cost: 1,
	merge_type: null,
	full_w_class: 3,
	novariants: 1,
	origin_tech: "materials=1",
	gender: "plural",
});

// stack.dm:25
rt.def("/obj/item/stack/proc/Initialize", function* Initialize(f: Frame) {
	let S: Value = null;
	if (f.args[1] === null) {
		f.args[1] = null;
	}
	if (f.args[2] === null) {
		f.args[2] = 1;
	}
	yield* parent_proc();
	if (f.args[1]) {
		this.amount = f.args[1];
	}
	if (!this.merge_type) {
		this.merge_type = this.type;
	}
	if (f.args[2]) {
		for (S of each(this.loc, T("/obj/item/stack"))) {
			if (S.merge_type == this.merge_type) {
				yield* this.merge(S);
			}
		}
	}
	this.update_weight();
	yield* this.update_icon();
	return f.dot;
}, true, { args: ["mapload", "new_amount", "merge"] });

// stack.dm:38
rt.def("/obj/item/stack/proc/update_weight", function update_weight(f: Frame) {
	if (this.amount <= this.max_amount * 0.33333334) {
		this.w_class = max(WEIGHT_CLASS_TINY, min(this.full_w_class - 2, this.full_w_class));
	} else if (this.amount <= this.max_amount * 0.6666667) {
		this.w_class = max(WEIGHT_CLASS_TINY, min(this.full_w_class - WEIGHT_CLASS_TINY, this.full_w_class));
	} else {
		this.w_class = this.full_w_class;
	}
	return f.dot;
});

// stack.dm:47
rt.def("/obj/item/stack/proc/update_icon", function update_icon(f: Frame) {
	if (this.novariants) {
		return parent_proc();
	}
	if (this.amount <= this.max_amount * 0.33333334) {
		this.icon_state = rt.initial(f, this, "icon_state");
	} else if (this.amount <= this.max_amount * 0.6666667) {
		this.icon_state = `${rt.initial(f, this, "icon_state")}_2`;
	} else {
		this.icon_state = `${rt.initial(f, this, "icon_state")}_3`;
	}
	parent_proc();
	return f.dot;
});

// stack.dm:58
rt.def("/obj/item/stack/proc/Destroy", function* Destroy(f: Frame) {
	if (f.usr && f.usr.machine == this) {
		yield* GLOB.SStgui.close_uis(this);
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// stack.dm:63
rt.def("/obj/item/stack/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (this.is_cyborg) {
		if (this.singular_name) {
			to_chat(user, fmt("There is enough energy for ＀ ＀５.", [this.get_amount(), this.singular_name]));
		} else {
			to_chat(user, `There is enough energy for ${this.get_amount()}.`);
		}
		return f.dot;
	}
	if (this.singular_name) {
		if (this.get_amount() > 1) {
			to_chat(user, fmt("There are ＀ ＀５ in the stack.", [this.get_amount(), this.singular_name]));
		} else {
			to_chat(user, `There is ${this.get_amount()} ${this.singular_name} in the stack.`);
		}
	} else if (this.get_amount() > 1) {
		to_chat(user, `There are ${this.get_amount()} in the stack.`);
	} else {
		to_chat(user, `There is ${this.get_amount()} in the stack.`);
	}
	return f.dot;
}, false);

// stack.dm:82
rt.def("/obj/item/stack/proc/get_amount", function get_amount(f: Frame) {
	if (this.is_cyborg) {
		f.dot = round(this.source.energy / this.cost);
	} else {
		f.dot = this.amount;
	}
	return f.dot;
});

// stack.dm:87
rt.def("/obj/item/stack/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	yield* this.interact(user);
	return f.dot;
}, true);

// stack.dm:90
// tg_js: opens the `stack` tgui window instead of a hand-built HTML page (the recipe list is built in ui_data).
rt.def("/obj/item/stack/proc/interact", function* interact(f: Frame, user: Value) {
	if (!this.recipes) {
		return f.dot;
	}
	if (!this || this.get_amount() <= 0) {
		yield* GLOB.SStgui.close_uis(this);
		return f.dot;
	}
	yield* user.set_machine(this);
	yield* this.ui_interact(user);
	return f.dot;
}, true);

// /obj/item/stack/proc/ui_interact  (tg_js, after modern tg's stack.dm)  may sleep
rt.def("/obj/item/stack/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	ui_key ??= "main";
	force_open ??= 0;
	state ??= GLOB.hands_state;
	if (ui = (yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open))) return f.dot;
	yield* (ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "stack", this.name, 420, 500, master_ui, state))).open();
	return f.dot;
}, true);

// /obj/item/stack/proc/ui_data  (tg_js)  may sleep
// amount, singular, recipes: one entry per recipe slot in order. A null slot (a divider in the old page) is {sep: 1};
// a recipe is {index, title, cost, can_build, multipliers: [{n, label}]} with the same multiplier rules as the old page (5, 10, 25, max).
rt.def("/obj/item/stack/proc/ui_data", function* ui_data(f: Frame, user: Value) {
	let E: Value = null, R: Value = null, mults: Value = null, M: Value = null;
	let data: Value = rt.list();
	let list: Value = rt.list();
	const amount = Number(this.get_amount());
	rt.setAt(data, "amount", amount);
	rt.setAt(data, "singular", this.singular_name ? `${this.singular_name}` : "sheet");
	const n = Number(rt.len(f, this.recipes));
	for (let i = 1; i <= n; i++) {
		E = rt.list();
		R = rt.index(this.recipes, i);
		if (R === null) {
			rt.setAt(E, "sep", 1);
			rt.modify(list, rt.list(E), add);
			continue;
		}
		const req = Number(R.req_amount), res = Number(R.res_amount), maxres = Number(R.max_res_amount);
		let max_multiplier = Math.floor(amount / req);
		rt.setAt(E, "index", i);
		rt.setAt(E, "title", res > 1 ? fmt("＀x ＀５", [res, R.title]) : `${R.title}`);
		rt.setAt(E, "cost", req);
		rt.setAt(E, "can_build", max_multiplier > 0 ? 1 : 0);
		mults = rt.list();
		if (maxres > 1 && max_multiplier > 1) {
			max_multiplier = Math.min(max_multiplier, Math.floor(maxres / res));
			const ms = [5, 10, 25];
			const shown = ms.filter((m) => max_multiplier >= m);
			if (!ms.includes(max_multiplier)) shown.push(max_multiplier);
			for (const m of shown) {
				M = rt.list();
				rt.setAt(M, "n", m);
				rt.setAt(M, "label", m * res);
				rt.modify(mults, rt.list(M), add);
			}
		}
		rt.setAt(E, "multipliers", mults);
		rt.modify(list, rt.list(E), add);
	}
	rt.setAt(data, "recipes", list);
	return data;
}, true);

// /obj/item/stack/proc/ui_act  (tg_js)  may sleep
// Building goes through the old Topic (restrained/stat/active-hand checks, building_checks, build time, one-per-turf, on-floor, the result).
rt.def("/obj/item/stack/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value, ui: Value, state: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (action === "make") {
		yield* this.Topic("", rt.alist(f, ["make", `${rt.at(params, "id")}`, "multiplier", `${rt.at(params, "multiplier")}`]));
	} else {
		return 0;
	}
	GLOB.SStgui.update_uis(this);
	return 1;
}, true, { args: ["action", "params", "ui", "state"] });

// stack.dm:133
rt.def("/obj/item/stack/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let R: Value = null, multiplier: Value = null, O: Value = null, W: Value = null, new_item: Value = null, I: Value = null;
	yield* parent_proc();
	if (f.usr.restrained() || f.usr.stat || f.usr.get_active_held_item() != this) {
		return f.dot;
	}
	if (rt.at(href_list, "make")) {
		if (this.get_amount() < 1) {
			yield* qdel(this);
		}
		// tg_js, 2017 tg's own hole: the slot and the multiplier came from the href unchecked (a slot of 0, past the end or a divider runtimed, 8.5 built slot 8,
		// a multiplier of 1.5 took 1.5 sheets, x5 on a one-off recipe wasted sheets, tiles x21 made a stack of 84). Whole numbers, a real recipe, and one that fits a stack.
		const mkN = text2num(rt.at(href_list, "make"));
		if (typeof mkN !== "number" || !Number.isInteger(mkN) || mkN < 1 || mkN > Number(rt.len(f, this.recipes))) {
			return f.dot;
		}
		R = rt.index(this.recipes, mkN);
		if (!rt.istype(R, T("/datum/stack_recipe"))) {
			return f.dot;
		}
		if (!(multiplier = text2num(rt.at(href_list, "multiplier"))) || multiplier <= 0) {
			return f.dot;
		}
		const mulN = multiplier, maxRes = Number(R.max_res_amount), resAmt = Number(R.res_amount);
		if (typeof mulN !== "number" || !Number.isInteger(mulN) || (maxRes > 1 ? resAmt * mulN > maxRes : mulN !== 1)) {
			return f.dot;
		}
		if (!this.building_checks(R, multiplier)) {
			return f.dot;
		}
		if (R.time) {
			f.usr.visible_message(`<span class='notice'>${f.usr} starts building ${R.title}.</span>`, `<span class='notice'>You start building ${R.title}...</span>`);
			if (!(yield* do_after(f.usr, R.time, { target: f.usr }))) {
				return f.dot;
			}
			if (!this.building_checks(R, multiplier)) {
				return f.dot;
			}
		}
		yield* (O = (yield* new_(R.result_type, f.usr.loc))).setDir(f.usr.dir);
		yield* this.use(R.req_amount * multiplier);
		if (rt.istype(O, T("/obj/structure/windoor_assembly"))) {
			(W = O).ini_dir = W.dir;
		} else if (rt.istype(O, T("/obj/structure/window"))) {
			(W = O).ini_dir = W.dir;
		}
		if (R.max_res_amount > 1) {
			(new_item = O).amount = R.res_amount * multiplier;
			yield* new_item.update_icon();
			if (new_item.amount <= 0) {
				return f.dot;
			}
		}
		if (rt.istype(O, T("/obj/item"))) {
			yield* f.usr.put_in_hands(O);
		}
		yield* O.add_fingerprint(f.usr);
		if (rt.istype(O, T("/obj/item/weapon/storage"))) {
			for (I of each(O, T("/obj/item"))) {
				yield* qdel(I);
			}
		}
	}
	if (!(this && f.usr.machine == this)) return f.dot;
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/atom/proc/interact"), f.usr)), 0);
	return f.dot;
}, true);

// stack.dm:188
rt.def("/obj/item/stack/proc/building_checks", function building_checks(f: Frame, R: Value, multiplier: Value) {
	if (this.get_amount() < R.req_amount * multiplier) {
		if (R.req_amount * multiplier > 1) {
			to_chat(f.usr, fmt("<span class='warning'>You haven't got enough ＀ to build ％！ ＀５!</span>", [this, R.req_amount * multiplier, R.title]));
		} else {
			to_chat(f.usr, fmt("<span class='warning'>You haven't got enough ＀ to build ％！!</span>", [this, R.title]));
		}
		return 0;
	}
	if (R.window_checks && !valid_window_location(f.usr.loc, f.usr.dir)) {
		to_chat(f.usr, `<span class='warning'>The ${R.title} won't fit here!</span>`);
		return 0;
	}
	if (R.one_per_turf && rt.locateIn(f, R.result_type, f.usr.loc)) {
		to_chat(f.usr, `<span class='warning'>There is another ${R.title} here!</span>`);
		return 0;
	}
	if (R.on_floor && !rt.istype(f.usr.loc, T("/turf/open/floor"))) {
		to_chat(f.usr, fmt("<span class='warning'>＄！ must be constructed on the floor!</span>", [R.title]));
		return 0;
	}
	return 1;
});

// stack.dm:206
rt.def("/obj/item/stack/proc/use", function* use(f: Frame, used: Value) {
	if (yield* this.zero_amount()) {
		return 0;
	}
	if (this.is_cyborg) {
		return (yield* this.source.use_charge(used * this.cost));
	}
	if (this.amount < used) {
		return 0;
	}
	this.amount -= used;
	yield* this.zero_amount();
	yield* this.update_icon();
	this.update_weight();
	return 1;
}, true);

// stack.dm:220
rt.def("/obj/item/stack/proc/zero_amount", function* zero_amount(f: Frame) {
	if (this.is_cyborg) {
		return (this.source.energy < this.cost ? 1 : 0);
	}
	if (this.amount < 1) {
		yield* qdel(this);
		return 1;
	}
	return 0;
}, true);

// stack.dm:228
rt.def("/obj/item/stack/proc/add", function _add(f: Frame, amount: Value) {
	if (this.is_cyborg) {
		this.source.add_charge(amount * this.cost);
	} else {
		rt.modField(f, this, "amount", amount, add);
	}
	this.update_icon();
	this.update_weight();
	return f.dot;
});

// stack.dm:235
rt.def("/obj/item/stack/proc/merge", function* merge(f: Frame, S: Value) {
	if (!S || S.gc_destroyed || !this || this.gc_destroyed || S == this) {
		return f.dot;
	}
	let transfer: Value = this.get_amount();
	if (S.is_cyborg) {
		transfer = min(transfer, round((S.source.max_energy - S.source.energy) / S.cost));
	} else {
		transfer = min(transfer, S.max_amount - S.amount);
	}
	if (this.pulledby) {
		yield* this.pulledby.start_pulling(S);
	}
	S.copy_evidences(this);
	yield* this.use(transfer);
	yield* g.callName(f, S, "add", [transfer]);
	return f.dot;
}, true);

// stack.dm:249
rt.def("/obj/item/stack/proc/Crossed", function* Crossed(f: Frame, o: Value) {
	if (rt.op(f, "IsType", [], [o, this.merge_type]) && !o.throwing) {
		yield* this.merge(o);
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// stack.dm:254
rt.def("/obj/item/stack/proc/hitby", function* hitby(f: Frame, AM: Value, skip: Value, hitpush: Value) {
	if (rt.op(f, "IsType", [], [AM, this.merge_type])) {
		yield* this.merge(AM);
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// stack.dm:259
rt.def("/obj/item/stack/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (user.get_inactive_held_item() == this) {
		if (yield* this.zero_amount()) {
			return f.dot;
		}
		yield* this.change_stack(user, 1);
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// stack.dm:267
rt.def("/obj/item/stack/proc/AltClick", function* AltClick(f: Frame, user: Value) {
	let min: Value = null, max: Value = null, stackmaterial: Value = null;
	if (!rt.istype(user, T("/mob/living")) || !user.canUseTopic(this)) {
		to_chat(user, "<span class='warning'>You can't do that right now!</span>");
		return f.dot;
	}
	if (!(get_dist(this, user) <= 1)) {
		return f.dot;
	}
	if (this.is_cyborg) {
		return f.dot;
	} else {
		if (yield* this.zero_amount()) {
			return f.dot;
		}
		min = 0;
		max = this.get_amount();
		if ((stackmaterial = round((yield* g.op(f, "Prompt", [32], [null, null, `How many sheets do you wish to take out of this stack? (Maximum  ${max})`, user, null])))) === null || stackmaterial <= min || stackmaterial >= this.get_amount()) {
			return f.dot;
		} else {
			yield* this.change_stack(user, stackmaterial);
			to_chat(user, `<span class='notice'>You take ${stackmaterial} sheets out of the stack</span>`);
		}
	}
	return f.dot;
}, true);

// stack.dm:288
rt.def("/obj/item/stack/proc/change_stack", function* change_stack(f: Frame, user: Value, amount: Value) {
	let F: Value = null;
	f.dot = (F = (yield* new_(this.type, user, amount, 0)));
	F.copy_evidences(this);
	yield* user.put_in_hands(F);
	yield* this.add_fingerprint(user);
	yield* F.add_fingerprint(user);
	yield* this.use(amount);
	return f.dot;
}, true);

// stack.dm:299
rt.def("/obj/item/stack/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let S: Value = null;
	if (rt.op(f, "IsType", [], [W, this.merge_type])) {
		yield* this.merge((S = W));
		to_chat(user, fmt("<span class='notice'>Your ＀ stack now contains ＀ ＀５.</span>", [S.name, S.get_amount(), S.singular_name]));
	} else {
		f.dot = (yield* parent_proc());
	}
	return f.dot;
}, true);

// stack.dm:307
rt.def("/obj/item/stack/proc/copy_evidences", function copy_evidences(f: Frame, from: Value) {
	this.blood_DNA = from.blood_DNA;
	this.fingerprints = from.fingerprints;
	this.fingerprintshidden = from.fingerprintshidden;
	this.fingerprintslast = from.fingerprintslast;
	return f.dot;
});

// stack.dm:314
rt.def("/obj/item/stack/proc/microwave_act", function microwave_act(f: Frame, M: Value) {
	if (!(M && M.dirty < 100)) return f.dot;
	M.dirty += this.amount;
	return f.dot;
});
