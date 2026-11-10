// Based on /tg/station's code/modules/mining/machine_redemption.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, add, fmt } = rt;


rt.type(10931, "/obj/machinery/mineral/ore_redemption", "/obj/machinery/mineral", {
	inserted_id: null,
	points: 0,
	ore_pickup_rate: 15,
	sheet_per_ore: 1,
	point_upgrade: 1,
	ore_values: null,
	message_sent: 0,
	ore_buffer: null,
	materials: null,
	files: null,
	inserted_disk: null,
	req_access_reclaim: 54,
	anchored: 1,
	input_dir: 1,
	output_dir: 2,
	speed_process: 1,
	name: "ore redemption machine",
	desc: "A machine that accepts ore and instantly transforms it into workable material sheets. Points for ore are generated based on type and can be redeemed at a mining equipment vendor.",
	icon: rt.rsc("icons/obj/machines/mining_machines.dmi"),
	icon_state: "ore_redemption",
	density: 1,
	req_access: null,
});

// machine_redemption.dm:20
rt.def("/obj/machinery/mineral/ore_redemption/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.ore_values = rt.alist(f, ["$glass", 1, "$metal", 1, "$plasma", 15, "$silver", 16, "$gold", 18, "$titanium", 30, "$uranium", 30, "$diamond", 50, "$bluespace", 50, "$bananium", 60]);

	this.ore_buffer = list();

	this.req_access = list(64);
	return f.dot;
});

// machine_redemption.dm:29
rt.def("/obj/machinery/mineral/ore_redemption/proc/Initialize", function* Initialize(f: Frame) {
	let B: Value = null;
	f.dot = (yield* parent_proc());
	yield* (B = (yield* new_(T("/obj/item/weapon/circuitboard/machine/ore_redemption")))).apply_default_parts(this);
	this.materials = (yield* new_(T("/datum/material_container"), this, list("$metal", "$glass", "$silver", "$gold", "$diamond", "$plasma", "$uranium", "$bananium", "$titanium", "$bluespace"), 1e+31));
	this.files = (yield* new_(T("/datum/research/smelter"), this));
	return f.dot;
}, true);

// machine_redemption.dm:36
rt.def("/obj/machinery/mineral/ore_redemption/proc/Destroy", function* Destroy(f: Frame) {
	yield* qdel(this.materials);
	this.materials = null;
	yield* qdel(this.files);
	this.files = null;
	return (yield* parent_proc());
}, true);

rt.type(6760, "/obj/item/weapon/circuitboard/machine/ore_redemption", "/obj/item/weapon/circuitboard/machine", {
	name: "Ore Redemption (Machine Board)",
	build_path: rt.typePath("/obj/machinery/mineral/ore_redemption"),
	origin_tech: "programming=1;engineering=2",
	req_components: null,
});

// machine_redemption.dm:44
rt.def("/obj/item/weapon/circuitboard/machine/ore_redemption/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_components = rt.alist(f, [T("/obj/item/weapon/stock_parts/console_screen"), 1, T("/obj/item/weapon/stock_parts/matter_bin"), 1, T("/obj/item/weapon/stock_parts/micro_laser"), 1, T("/obj/item/weapon/stock_parts/manipulator"), 1, T("/obj/item/device/assembly/igniter"), 1]);
	return f.dot;
});

// machine_redemption.dm:55
rt.def("/obj/machinery/mineral/ore_redemption/proc/RefreshParts", function RefreshParts(f: Frame) {
	let B: Value = null, M: Value = null, L: Value = null;
	let ore_pickup_rate_temp: Value = 15;
	let point_upgrade_temp: Value = 1;
	let sheet_per_ore_temp: Value = 1;
	for (B of each(this.component_parts, T("/obj/item/weapon/stock_parts/matter_bin"))) {
		sheet_per_ore_temp = 0.65 + 0.35 * B.rating;
	}
	for (M of each(this.component_parts, T("/obj/item/weapon/stock_parts/manipulator"))) {
		ore_pickup_rate_temp = 15 * M.rating;
	}
	for (L of each(this.component_parts, T("/obj/item/weapon/stock_parts/micro_laser"))) {
		point_upgrade_temp = 0.65 + 0.35 * L.rating;
	}
	this.ore_pickup_rate = ore_pickup_rate_temp;
	this.point_upgrade = point_upgrade_temp;
	this.sheet_per_ore = sheet_per_ore_temp;
	return f.dot;
});

// machine_redemption.dm:67
rt.def("/obj/machinery/mineral/ore_redemption/proc/smelt_ore", function* smelt_ore(f: Frame, O: Value) {
	let material_amount: Value = null;
	this.ore_buffer -= O;
	if (O && O.refined_type) {
		this.points += O.points * this.point_upgrade;
	}
	if (!(material_amount = this.materials.get_item_material_amount(O))) {
		yield* qdel(O);
	} else if (!this.materials.has_space(material_amount * this.sheet_per_ore)) {
		yield* this.unload_mineral(O);
	} else {
		yield* this.materials.insert_item(O, this.sheet_per_ore);
		yield* qdel(O);
	}
	return f.dot;
}, true);

// machine_redemption.dm:85
rt.def("/obj/machinery/mineral/ore_redemption/proc/can_smelt_alloy", function can_smelt_alloy(f: Frame, D: Value) {
	let mat_id: Value = null, M: Value = null, redemption_mat: Value = null, smeltable_sheets: Value = null;
	if (rt.len(f, D.make_reagents)) {
		return 0;
	}
	let build_amount: Value = 0;
	for (mat_id of each(D.materials)) {
		M = rt.index(D.materials, mat_id);
		redemption_mat = rt.index(this.materials.materials, mat_id);
		if (!M || !redemption_mat) {
			return 0;
		}
		if (!(smeltable_sheets = Floor(redemption_mat.amount / M))) {
			return 0;
		}
		if (!build_amount) {
			build_amount = smeltable_sheets;
		}
		build_amount = min(build_amount, smeltable_sheets);
	}
	return build_amount;
});

// machine_redemption.dm:111
rt.def("/obj/machinery/mineral/ore_redemption/proc/process_ores", function* process_ores(f: Frame, ores_to_process: Value) {
	let ore: Value = null;
	let current_amount: Value = 0;
	for (ore of each(ores_to_process)) {
		if (current_amount >= this.ore_pickup_rate) {
			break;
		}
		yield* this.smelt_ore(ore);
	}
	return f.dot;
}, true);

// machine_redemption.dm:117
rt.def("/obj/machinery/mineral/ore_redemption/proc/send_console_message", function* send_console_message(f: Frame) {
	let mat_id: Value = null, M: Value = null, mineral_amount: Value = null, D: Value = null;
	if (this.z != ZLEVEL_STATION) {
		return f.dot;
	}
	this.message_sent = 1;
	let A: Value = get_area(this);
	let msg: Value = `Now available in ${A}:<br>`;
	let has_minerals: Value = 0;
	for (mat_id of each(this.materials.materials)) {
		M = rt.index(this.materials.materials, mat_id);
		if (mineral_amount = M.amount / MINERAL_MATERIAL_AMOUNT) {
			has_minerals = 1;
		}
		msg += `${capitalize(M.name)}: ${mineral_amount} sheets<br>`;
	}
	if (!has_minerals) {
		return f.dot;
	}
	for (D of each(GLOB.allConsoles, T("/obj/machinery/requests_console"))) {
		if (D.receive_ore_updates) {
			yield* D.createmessage("Ore Redemption Machine", "New minerals available!", msg, 1, 0);
		}
	}
	return f.dot;
}, true);

// machine_redemption.dm:140
rt.def("/obj/machinery/mineral/ore_redemption/proc/process", function* process(f: Frame) {
	let OB: Value = null, O: Value = null;
	if (this.panel_open || !this.powered()) {
		return f.dot;
	}
	let input: Value = rt.getStep(f, this, this.input_dir);
	if (OB = rt.locateIn(f, T("/obj/structure/ore_box"), input)) {
		input = OB;
	}
	for (O of each(input, T("/obj/item/weapon/ore"))) {
		if (!O || O.gc_destroyed) {
			continue;
		}
		(rt.modSrcVar(f, "ore_buffer", O, rt.bitOr));
		yield* O.forceMove(this);
		if (rt.tickUsage(f) > GLOB.current_ticklimit) {
			yield* stoplag();
		}
	}
	if (rt.length(this.ore_buffer)) {
		this.message_sent = 0;
		yield* this.process_ores(this.ore_buffer);
	} else {
		if (this.message_sent) return f.dot;
		yield* this.send_console_message();
	}
	return f.dot;
}, true, { waitfor: false });

// machine_redemption.dm:161
rt.def("/obj/machinery/mineral/ore_redemption/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let I: Value = null, S: Value = null, inserted: Value = null;
	if (yield* this.exchange_parts(user, W)) {
		return f.dot;
	}
	if (yield* this.default_pry_open(W)) {
		yield* this.materials.retrieve_all();
		return f.dot;
	}
	if (yield* this.default_unfasten_wrench(user, W)) {
		return f.dot;
	}
	if (this.default_deconstruction_screwdriver(user, "ore_redemption-open", "ore_redemption", W)) {
		yield* this.updateUsrDialog();
		return f.dot;
	}
	if (yield* this.default_deconstruction_crowbar(W)) {
		return f.dot;
	}
	if (!this.powered()) {
		return f.dot;
	}
	if (rt.istype(W, T("/obj/item/weapon/card/id"))) {
		if (rt.istype((I = user.get_active_held_item()), T("/obj/item/weapon/card/id")) && !rt.istype(this.inserted_id, T("/obj/item/weapon/card/id"))) {
			if (!(yield* user.drop_item())) {
				return f.dot;
			}
			yield* I.forceMove(this);
			this.inserted_id = I;
			yield* this.interact(user);
		}
		return f.dot;
	}
	if (rt.istype(W, T("/obj/item/device/multitool")) && this.panel_open) {
		this.input_dir = turn(this.input_dir, -90);
		this.output_dir = turn(this.output_dir, -90);
		to_chat(user, `<span class='notice'>You change ${this}'s I/O settings, setting the input to ${dir2text(this.input_dir)} and the output to ${dir2text(this.output_dir)}.</span>`);
		return f.dot;
	}
	if (rt.istype(W, T("/obj/item/weapon/disk/design_disk"))) {
		if (yield* user.transferItemToLoc(W, this)) {
			this.inserted_disk = W;
			return 1;
		}
	}
	if (rt.istype(W, T("/obj/item/stack/sheet"))) {
		S = W;
		inserted = (yield* this.materials.insert_stack(S, S.amount));
		to_chat(user, fmt("<span class='notice'>You add ＀ ＀ sheets to ％！.</span>", [inserted, S, this]));
		return f.dot;
	}
	return (yield* parent_proc());
}, true);

// machine_redemption.dm:206
rt.def("/obj/machinery/mineral/ore_redemption/proc/on_deconstruction", function* on_deconstruction(f: Frame) {
	yield* this.materials.retrieve_all();
	yield* parent_proc();
	return f.dot;
}, true);

// machine_redemption.dm:210
rt.def("/obj/machinery/mineral/ore_redemption/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	yield* this.interact(user);
	return f.dot;
}, true);

// machine_redemption.dm:215
rt.def("/obj/machinery/mineral/ore_redemption/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	ui_key ??= "main";
	force_open ??= 0;
	state ??= GLOB.default_state;
	if (ui = (yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open))) return f.dot;
	yield* (ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "ore_redemption_machine", "Ore Redemption Machine", 440, 550, master_ui, state))).open();
	return f.dot;
}, true);

// machine_redemption.dm:221
rt.def("/obj/machinery/mineral/ore_redemption/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let data: Value = null, mat_id: Value = null, M: Value = null, sheet_amount: Value = null, v: Value = null, D: Value = null, index: Value = null, thisdesign: Value = null;
	let $e: any;
	rt.setAt((data = list()), "unclaimedPoints", this.points);
	if (this.inserted_id) {
		rt.setAt(data, "hasID", 1);
		rt.setAt(data, "claimedPoints", this.inserted_id.mining_points);
	}
	rt.setAt(data, "materials", list());
	for (mat_id of each(this.materials.materials)) {
		M = rt.index(this.materials.materials, mat_id);
		sheet_amount = M.amount ? M.amount / MINERAL_MATERIAL_AMOUNT : "0";
		rt.modAt(data, "materials", list(rt.alist(f, ["name", M.name, "id", M.id, "amount", sheet_amount, "value", rt.index(this.ore_values, M.id) * this.point_upgrade])), add);
	}
	rt.setAt(data, "alloys", list());
	for (v of each(this.files.known_designs)) {
		D = rt.index(this.files.known_designs, v);
		rt.modAt(data, "alloys", list(rt.alist(f, ["name", D.name, "id", D.id, "amount", this.can_smelt_alloy(D)])), add);
	}
	rt.setAt(data, "diskDesigns", list());
	if (this.inserted_disk) {
		rt.setAt(data, "hasDisk", 1);
		if (rt.len(f, this.inserted_disk.blueprints)) {
			index = 1;
			for (thisdesign of each(this.inserted_disk.blueprints, T("/datum/design"))) {
				if (thisdesign) {
					rt.modAt(data, "diskDesigns", list(rt.alist(f, ["name", thisdesign.name, "index", index, "canupload", rt.bitAnd(thisdesign.build_type, SMELTER)])), add);
				}
				index++;
			}
		}
	}
	return data;
});

// machine_redemption.dm:249
rt.def("/obj/machinery/mineral/ore_redemption/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value) {
	let I: Value = null, out: Value = null, mat_id: Value = null, mat: Value = null, stored_amount: Value = null, desired: Value = null, sheets_to_remove: Value = null, disk: Value = null, n: Value = null, alloy_id: Value = null, alloy: Value = null, smelt_amount: Value = null, desired_3: Value = null, amount: Value = null, output: Value = null, produced_alloy: Value = null, output_3: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (action === "Eject") {
		if (!this.inserted_id) {
			return f.dot;
		}
		yield* f.usr.put_in_hands(this.inserted_id);
		this.inserted_id = null;
		return 1;
	} else if (action === "Insert") {
		if (rt.istype((I = f.usr.get_active_held_item()), T("/obj/item/weapon/card/id"))) {
			if (!(yield* f.usr.transferItemToLoc(I, this))) {
				return f.dot;
			}
			this.inserted_id = I;
		} else {
			to_chat(f.usr, "<span class='warning'>Not a valid ID!</span>");
		}
		return 1;
	} else if (action === "Claim") {
		if (this.inserted_id) {
			this.inserted_id.mining_points += this.points;
			this.points = 0;
		}
		return 1;
	} else if (action === "Release") {
		if (this.check_access(this.inserted_id) || (yield* this.allowed(f.usr))) {
			out = rt.getStep(f, this, this.output_dir);
			if (rt.at(params, "id") == "all") {
				yield* this.materials.retrieve_all(out);
			} else {
				mat_id = rt.at(params, "id");
				if (!rt.index(this.materials.materials, mat_id)) {
					return f.dot;
				}
				mat = rt.index(this.materials.materials, mat_id);
				if (!(stored_amount = mat.amount / MINERAL_MATERIAL_AMOUNT)) {
					return f.dot;
				}
				desired = 0;
				if (rt.at(params, "sheets")) {
					desired = text2num(rt.at(params, "sheets"));
				} else {
					desired = (yield* g.op(f, "Prompt", [33], [null, 1, "How many sheets would you like to smelt?", "How many sheets?", null]));
				}
				sheets_to_remove = round(min(desired, 50, stored_amount));
				yield* this.materials.retrieve_sheets(sheets_to_remove, mat_id, out);
			}
		} else {
			to_chat(f.usr, "<span class='warning'>Required access not found.</span>");
		}
		return 1;
	} else if (action === "diskInsert") {
		if (rt.istype((disk = f.usr.get_active_held_item()), T("/obj/item/weapon/disk/design_disk"))) {
			if (!(yield* f.usr.transferItemToLoc(disk, this))) {
				return f.dot;
			}
			this.inserted_disk = disk;
		} else {
			to_chat(f.usr, "<span class='warning'>Not a valid Design Disk!</span>");
		}
		return 1;
	} else if (action === "diskEject") {
		if (this.inserted_disk) {
			yield* f.usr.put_in_hands(this.inserted_disk);
			this.inserted_disk = null;
		}
		return 1;
	} else if (action === "diskUpload") {
		n = text2num(rt.at(params, "design"));
		if (this.inserted_disk && this.inserted_disk.blueprints && rt.index(this.inserted_disk.blueprints, n)) {
			this.files.AddDesign2Known(rt.index(this.inserted_disk.blueprints, n));
		}
		return 1;
	} else if (action === "Smelt") {
		alloy_id = rt.at(params, "id");
		alloy = this.files.FindDesignByID(alloy_id);
		if ((this.check_access(this.inserted_id) || (yield* this.allowed(f.usr))) && alloy) {
			smelt_amount = this.can_smelt_alloy(alloy);
			desired_3 = 0;
			if (rt.at(params, "sheets")) {
				desired_3 = text2num(rt.at(params, "sheets"));
			} else {
				desired_3 = (yield* g.op(f, "Prompt", [33], [null, 1, "How many sheets would you like to smelt?", "How many sheets?", null]));
			}
			amount = round(min(desired_3, 50, smelt_amount));
			this.materials.use_amount(alloy.materials, amount);
			if (rt.istype((output = (yield* new_(alloy.build_path, this))), T("/obj/item/stack/sheet"))) {
				(produced_alloy = output).amount = amount;
				yield* this.unload_mineral(produced_alloy);
			} else {
				yield* this.unload_mineral(output);
			}
		} else {
			to_chat(f.usr, "<span class='warning'>Required access not found.</span>");
		}
		return 1;
	} else if (action === "SmeltAll") {
		alloy_id = rt.at(params, "id");
		alloy = this.files.FindDesignByID(alloy_id);
		if ((this.check_access(this.inserted_id) || (yield* this.allowed(f.usr))) && alloy) {
			smelt_amount = this.can_smelt_alloy(alloy);
			while (smelt_amount > 0) {
				this.materials.use_amount(alloy.materials);
				smelt_amount--;
				yield* this.unload_mineral((output_3 = (yield* new_(alloy.build_path, this))));
				if (rt.tickUsage(f) > GLOB.current_ticklimit) {
					yield* stoplag();
				}
			}
		} else {
			to_chat(f.usr, "<span class='warning'>Required access not found.</span>");
		}
		return 1;
	}
	return f.dot;
}, true);

// machine_redemption.dm:357
rt.def("/obj/machinery/mineral/ore_redemption/proc/ex_act", function* ex_act(f: Frame, severity: Value, target: Value) {
	yield* do_sparks(5, 1, this);
	yield* parent_proc();
	return f.dot;
}, true, { waitfor: false });

// machine_redemption.dm:361
rt.def("/obj/machinery/mineral/ore_redemption/proc/power_change", function power_change(f: Frame) {
	parent_proc();
	this.update_icon();
	return f.dot;
});

// machine_redemption.dm:365
rt.def("/obj/machinery/mineral/ore_redemption/proc/update_icon", function update_icon(f: Frame) {
	if (this.powered()) {
		this.icon_state = rt.initial(f, this, "icon_state");
	} else {
		this.icon_state = `${rt.initial(f, this, "icon_state")}-off`;
	}
	return f.dot;
});
