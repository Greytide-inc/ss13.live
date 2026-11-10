// Based on /tg/station's code/game/mecha/mech_fabricator.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, add, fmt } = rt;


rt.type(10873, "/obj/machinery/mecha_part_fabricator", "/obj/machinery", {
	time_coeff: 1,
	component_coeff: 1,
	materials: null,
	files: null,
	sync: 0,
	part_set: null,
	being_built: null,
	queue: null,
	processing_queue: 0,
	screen: "main",
	temp: null,
	part_sets: null,
	anchored: 1,
	use_power: 1,
	idle_power_usage: 20,
	active_power_usage: 5000,
	icon: rt.rsc("icons/obj/robotics.dmi"),
	icon_state: "fab-idle",
	name: "exosuit fabricator",
	desc: "Nothing is being built.",
	density: 1,
	req_access: null,
});

// mech_fabricator.dm:19
rt.def("/obj/machinery/mecha_part_fabricator/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.queue = list();
	this.part_sets = list("Cyborg", "Ripley", "Firefighter", "Odysseus", "Gygax", "Durand", "H.O.N.K", "Phazon", "Exosuit Equipment", "Cyborg Upgrade Modules", "Misc");

	this.req_access = list(29);
	return f.dot;
});

// mech_fabricator.dm:38
rt.def("/obj/machinery/mecha_part_fabricator/proc/New", function* New(f: Frame) {
	let B: Value = null;
	yield* parent_proc();
	this.files = (yield* new_(T("/datum/research"), this));
	this.materials = (yield* new_(T("/datum/material_container"), this, list("$metal", "$glass", "$silver", "$gold", "$diamond", "$plasma", "$uranium", "$bananium", "$titanium", "$bluespace")));
	yield* (B = (yield* new_(T("/obj/item/weapon/circuitboard/machine/mechfab"), null))).apply_default_parts(this);
	return f.dot;
}, true);

rt.type(6743, "/obj/item/weapon/circuitboard/machine/mechfab", "/obj/item/weapon/circuitboard/machine", {
	req_components: null,
	name: "Exosuit Fabricator (Machine Board)",
	build_path: rt.typePath("/obj/machinery/mecha_part_fabricator"),
	origin_tech: "programming=2;engineering=2",
});

// mech_fabricator.dm:48
rt.def("/obj/item/weapon/circuitboard/machine/mechfab/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_components = rt.alist(f, [T("/obj/item/weapon/stock_parts/matter_bin"), 2, T("/obj/item/weapon/stock_parts/manipulator"), 1, T("/obj/item/weapon/stock_parts/micro_laser"), 1, T("/obj/item/weapon/stock_parts/console_screen"), 1]);
	return f.dot;
});

// mech_fabricator.dm:58
rt.def("/obj/machinery/mecha_part_fabricator/proc/RefreshParts", function RefreshParts(f: Frame) {
	let M: Value = null, Ma: Value = null, Ml: Value = null;
	let _T: Value = 0;
	for (M of each(this.component_parts, T("/obj/item/weapon/stock_parts/matter_bin"))) {
		_T += M.rating;
	}
	this.materials.max_amount = 200000 + _T * 50000;
	_T = 1.15;
	for (Ma of each(this.component_parts, T("/obj/item/weapon/stock_parts/micro_laser"))) {
		_T -= Ma.rating * 0.15;
	}
	this.component_coeff = _T;
	_T = -1;
	for (Ml of each(this.component_parts, T("/obj/item/weapon/stock_parts/manipulator"))) {
		_T += Ml.rating;
	}
	this.time_coeff = round(rt.initial(f, this, "time_coeff") - rt.initial(f, this, "time_coeff") * _T / 5, 0.01);
	return f.dot;
});

// mech_fabricator.dm:76
rt.def("/obj/machinery/mecha_part_fabricator/proc/check_access", function check_access(f: Frame, I: Value) {
	let pda: Value = null, req: Value = null;
	if (rt.istype(I, T("/obj/item/device/pda"))) {
		I = (pda = I).id;
	}
	if (!rt.istype(I, T("/obj/item/weapon/card/id")) || !I.access) {
		return 0;
	}
	for (req of each(this.req_access)) {
		if (!rt.isIn(f, req, I.access)) {
			return 0;
		}
	}
	return 1;
});

// mech_fabricator.dm:91
rt.def("/obj/machinery/mecha_part_fabricator/proc/emag_act", function* emag_act(f: Frame) {
	if (this.emagged) {
		return f.dot;
	}
	this.emagged = 0.5;
	yield* this.say("DB error [Code 0x00F1]");
	yield* sleep(10);
	yield* this.say("Attempting auto-repair...");
	yield* sleep(15);
	yield* this.say("User DB corrupted [Code 0x00FA]. Truncating data structure...");
	yield* sleep(30);
	yield* this.say("User DB truncated. Please contact your Nanotrasen system operator for future assistance.");
	this.req_access = null;
	this.emagged = 1;
	return f.dot;
}, true);

// mech_fabricator.dm:121
rt.def("/obj/machinery/mecha_part_fabricator/proc/output_part_cost", function output_part_cost(f: Frame, D: Value) {
	let output: Value = null, c: Value = null;
	let $e: any;
	let i: Value = 0;
	for (c of each(D.materials)) {
		output += `${i ? " | " : null}${this.get_resource_cost_w_coeff(D, c)} ${this.material2name(c)}`;
		i++;
	}
	return output;
});

// mech_fabricator.dm:140
rt.def("/obj/machinery/mecha_part_fabricator/proc/get_resources_w_coeff", function get_resources_w_coeff(f: Frame, D: Value) {
	let R: Value = null;
	let resources: Value = list();
	for (R of each(D.materials)) {
		rt.setAt(resources, R, this.get_resource_cost_w_coeff(D, R));
	}
	return resources;
});

// mech_fabricator.dm:146
rt.def("/obj/machinery/mecha_part_fabricator/proc/check_resources", function check_resources(f: Frame, D: Value) {
	if (rt.len(f, D.reagents_list)) {
		return 0;
	}
	if (this.materials.has_materials(this.get_resources_w_coeff(D))) {
		return 1;
	}
	return 0;
});

// mech_fabricator.dm:153
rt.def("/obj/machinery/mecha_part_fabricator/proc/build_part", function* build_part(f: Frame, D: Value) {
	let I: Value = null;
	this.being_built = D;
	this.desc = fmt("It's building ＇！.", [rt.initial(f, D, "name")]);
	let res_coef: Value = this.get_resources_w_coeff(D);
	this.materials.use_amount(res_coef);
	this.add_overlay("fab-active");
	this.use_power = 2;
	yield* this.updateUsrDialog();
	yield* sleep(this.get_construction_time_w_coeff(D));
	this.use_power = 1;
	this.cut_overlay("fab-active");
	this.desc = rt.initial(f, this, "desc");
	let location: Value = rt.getStep(f, this, this.dir);
	(I = (yield* new_(D.build_path, location))).materials = res_coef;
	yield* this.say(fmt("＄！ is complete.", [I]));
	this.being_built = null;
	yield* this.updateUsrDialog();
	return 1;
}, true);

// mech_fabricator.dm:176
rt.def("/obj/machinery/mecha_part_fabricator/proc/update_queue_on_page", function update_queue_on_page(f: Frame) {
	GLOB.SStgui.update_uis(this);
	return f.dot;
});

// mech_fabricator.dm:180
rt.def("/obj/machinery/mecha_part_fabricator/proc/add_part_set_to_queue", function add_part_set_to_queue(f: Frame, set_name: Value) {
	let v: Value = null, D: Value = null;
	if (!rt.isIn(f, set_name, this.part_sets)) return f.dot;
	for (v of each(this.files.known_designs)) {
		if (rt.bitAnd((D = rt.index(this.files.known_designs, v)).build_type, MECHFAB)) {
			if (rt.isIn(f, set_name, D.category)) {
				this.add_to_queue(D);
			}
		}
	}
	return f.dot;
});

// mech_fabricator.dm:188
rt.def("/obj/machinery/mecha_part_fabricator/proc/add_to_queue", function add_to_queue(f: Frame, D: Value) {
	if (!rt.istype(this.queue, T("/list"))) {
		this.queue = list();
	}
	if (D && rt.len(f, this.queue) < 100) { // tg_js: queue capped (partset_to_queue in a loop grew it without end)
		rt.setAt(this.queue, ++this.queue.len, D);
	}
	return rt.len(f, this.queue);
});

// mech_fabricator.dm:195
rt.def("/obj/machinery/mecha_part_fabricator/proc/remove_from_queue", function remove_from_queue(f: Frame, index: Value) {
	if (!isnum(index) || !IsInteger(index) || !rt.istype(this.queue, T("/list")) || index < 1 || index > rt.len(f, this.queue)) {
		return 0;
	}
	this.queue.Cut(index, ++index);
	return 1;
});

// mech_fabricator.dm:201
rt.def("/obj/machinery/mecha_part_fabricator/proc/process_queue", function* process_queue(f: Frame) {
	let D: Value = null;
	if (!(D = rt.index(this.queue, 1))) {
		this.remove_from_queue(1);
		if (rt.len(f, this.queue)) {
			return (yield* this.process_queue());
		}
		return f.dot;
	}
	this.temp = null;
	while (D) {
		if (rt.bitAnd(this.stat, 3)) {
			return 0;
		}
		if (!this.check_resources(D)) {
			yield* this.say("Not enough resources. Queue processing stopped.");
			this.temp = fmt("<span class='alert'>Not enough resources to build next part.</span><br>\n\t\t\t\t\t\t<a href='?src=＃;process_queue=1'>Try again</a> | <a href='?src=＃;clear_temp=1'>Return</a><a>", [this, this]);
			return 0;
		}
		this.remove_from_queue(1);
		yield* this.build_part(D);
		D = listgetindex(this.queue, 1);
	}
	yield* this.say("Queue processing finished successfully.");
	return f.dot;
}, true);

// mech_fabricator.dm:243
rt.def("/obj/machinery/mecha_part_fabricator/proc/sync", function* sync(f: Frame) {
	let RDC: Value = null, v: Value = null, _T: Value = null, D: Value = null;
	this.temp = "Updating local R&D database...";
	yield* this.updateUsrDialog();
	yield* sleep(30);
	for (RDC of each(oview(7, this), T("/obj/machinery/computer/rdconsole"))) {
		if (!RDC.sync) {
			continue;
		}
		v = null;
		for (v of each(RDC.files.known_tech)) {
			_T = rt.index(RDC.files.known_tech, v);
			yield* this.files.AddTech2Known(_T);
		}
		v = null;
		for (v of each(RDC.files.known_designs)) {
			D = rt.index(RDC.files.known_designs, v);
			this.files.AddDesign2Known(D);
		}
		yield* this.files.RefreshResearch();
		this.temp = "Processed equipment designs.<br>";
		this.temp += fmt("<a href='?src=＃;clear_temp=1'>Return</a>", [this]);
		yield* this.updateUsrDialog();
		yield* this.say("Successfully synchronized with R&D server.");
		return f.dot;
	}
	this.temp = fmt("Unable to connect to local R&D Database.<br>Please check your connections and try again.<br><a href='?src=＃;clear_temp=1'>Return</a>", [this]);
	yield* this.updateUsrDialog();
	return f.dot;
}, true);

// mech_fabricator.dm:270
rt.def("/obj/machinery/mecha_part_fabricator/proc/get_resource_cost_w_coeff", function get_resource_cost_w_coeff(f: Frame, D: Value, resource: Value, roundto: Value) {
	roundto ??= 1;
	return round(rt.index(D.materials, resource) * this.component_coeff, roundto);
});

// mech_fabricator.dm:273
rt.def("/obj/machinery/mecha_part_fabricator/proc/get_construction_time_w_coeff", function get_construction_time_w_coeff(f: Frame, D: Value, roundto: Value) {
	roundto ??= 1;
	return round(rt.initial(f, D, "construction_time") * this.time_coeff, roundto);
});

// mech_fabricator.dm:276
rt.def("/obj/machinery/mecha_part_fabricator/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (yield* parent_proc()) return f.dot;
	return (yield* this.interact(user));
}, true);

// mech_fabricator.dm:281
// tg_js: opens the `mecha_fabricator` tgui window instead of the hand-built HTML page (the exit-obstructed check stays).
rt.def("/obj/machinery/mecha_part_fabricator/proc/interact", function* interact(f: Frame, user: Value) {
	let exit: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	yield* user.set_machine(this);
	if ((exit = rt.getStep(f, this, this.dir)).density) {
		yield* this.say("Error! Part outlet is obstructed.");
		return f.dot;
	}
	yield* this.ui_interact(user);
	return f.dot;
}, true);

// Added by tg_js.
rt.def("/obj/machinery/mecha_part_fabricator/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	ui_key ??= "main";
	force_open ??= 0;
	state ??= GLOB.default_state;
	if (ui = (yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open))) return f.dot;
	yield* (ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "mecha_fabricator", this.name, 900, 600, master_ui, state))).open();
	return f.dot;
}, true);

// /obj/machinery/mecha_part_fabricator/proc/ui_data  (tg_js)
// screen main|parts, part_sets, parts [{id,name,desc,cost,time,can_build}] of the chosen set, queue [{name,can_build}], materials [{id,name,amount}], being_built, processing_queue.
rt.def("/obj/machinery/mecha_part_fabricator/proc/ui_data", function* ui_data(f: Frame, user: Value) {
	let E: Value = null, v: Value = null, D: Value = null, ps: Value = null, mid: Value = null, M: Value = null;
	let $e: any;
	let data: Value = list();
	const screen = this.being_built ? "main" : String(this.screen ?? "main");
	rt.setAt(data, "screen", screen);
	rt.setAt(data, "part_set", this.part_set);
	rt.setAt(data, "processing_queue", this.processing_queue ? 1 : 0);
	rt.setAt(data, "being_built", this.being_built ? rt.initial(f, this.being_built.build_path, "name") : null);
	let sets: Value = list();
	for (ps of each(this.part_sets)) {
		rt.modify(sets, list(ps), add);
	}
	rt.setAt(data, "part_sets", sets);
	let mats: Value = list();
	for (mid of each(this.materials.materials)) {
		M = rt.index(this.materials.materials, mid);
		E = list();
		rt.setAt(E, "id", mid);
		rt.setAt(E, "name", M.name);
		rt.setAt(E, "amount", M.amount);
		rt.modify(mats, list(E), add);
	}
	rt.setAt(data, "materials", mats);
	let parts: Value = list();
	if (screen === "parts" && this.part_set) {
		for (v of each(this.files.known_designs)) {
			D = rt.index(this.files.known_designs, v);
			if (!rt.bitAnd(D.build_type, 16)) continue;
			if (!rt.isIn(f, this.part_set, D.category)) continue;
			E = list();
			rt.setAt(E, "id", D.id);
			rt.setAt(E, "name", rt.initial(f, D, "name"));
			rt.setAt(E, "desc", rt.initial(f, D.build_path, "desc"));
			rt.setAt(E, "cost", rt.callSrc(f, "output_part_cost", [D]));
			rt.setAt(E, "time", rt.callSrc(f, "get_construction_time_w_coeff", [D]) / 10);
			rt.setAt(E, "can_build", rt.callSrc(f, "check_resources", [D]) ? 1 : 0);
			rt.modify(parts, list(E), add);
		}
	}
	rt.setAt(data, "parts", parts);
	let queue: Value = list();
	let qi = 0;
	if (rt.istype(this.queue, T("/list"))) {
		D = null;
		for (D of each(this.queue, T("/datum/design"))) {
			E = list();
			rt.setAt(E, "index", ++qi);
			rt.setAt(E, "name", rt.initial(f, D.build_path, "name"));
			rt.setAt(E, "can_build", rt.callSrc(f, "check_resources", [D]) ? 1 : 0);
			rt.modify(queue, list(E), add);
		}
	}
	rt.setAt(data, "queue", queue);
	return data;
}, true);

// /obj/machinery/mecha_part_fabricator/proc/ui_act  (tg_js)  may sleep
// Every action is routed to the old Topic (its checks and logic), then the windows are refreshed.
rt.def("/obj/machinery/mecha_part_fabricator/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value, ui: Value, state: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	const p = (k: string) => `${rt.at(params, k)}`;
	let href: any[] | null = null;
	switch (action) {
		case "part_set": href = ["part_set", p("set")]; break;
		case "back": href = ["part_set", "clear", "screen", "main"]; break;
		case "build": href = ["part", p("id")]; break;
		case "add_to_queue": href = ["add_to_queue", p("id")]; break;
		case "partset_to_queue": href = ["partset_to_queue", p("set")]; break;
		case "remove_from_queue": href = ["remove_from_queue", p("index")]; break;
		case "queue_move": href = ["queue_move", p("dir"), "index", p("index")]; break;
		case "process_queue": href = ["process_queue", 1]; break;
		case "clear_queue": href = ["clear_queue", 1]; break;
		case "sync": href = ["sync", 1]; break;
		case "remove_mat": href = ["remove_mat", p("amount"), "material", p("material")]; break;
	}
	if (href === null) {
		return 0;
	}
	yield* this.Topic("", rt.alist(f, href));
	GLOB.SStgui.update_uis(this);
	return 1;
}, true, { args: ["action", "params", "ui", "state"] });

// mech_fabricator.dm:339
rt.def("/obj/machinery/mecha_part_fabricator/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let tpart_set: Value = null, _T: Value = null, v: Value = null, D: Value = null, index: Value = null, new_index: Value = null, part: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	let filter: Value = (yield* new_(T("/datum/topic_input"), href, href_list));
	if (rt.at(href_list, "part_set")) {
		if (tpart_set = filter.getStr("part_set")) {
			if (tpart_set == "clear") {
				this.part_set = null;
			} else if (rt.isIn(f, tpart_set, this.part_sets)) { // tg_js: only a set the machine has (any text was accepted)
				this.part_set = tpart_set;
				this.screen = "parts";
			}
		}
	}
	if (rt.at(href_list, "part")) {
		_T = filter.getStr("part");
		for (v of each(this.files.known_designs)) {
			if (rt.bitAnd((D = rt.index(this.files.known_designs, v)).build_type, 16)) {
				if (D.id == _T) {
					if (!this.processing_queue) {
						// tg_js: the page only offers Build when the materials are there and nothing is being built; an href didn't care (free parts, two builds at once)
						if (this.being_built || !rt.callSrc(f, "check_resources", [D])) {
							break;
						}
						yield* this.build_part(D);
					} else {
						this.add_to_queue(D);
					}
					break;
				}
			}
		}
	}
	if (rt.at(href_list, "add_to_queue")) {
		_T = filter.getStr("add_to_queue");
		v = null;
		for (v of each(this.files.known_designs)) {
			if (rt.bitAnd((D = rt.index(this.files.known_designs, v)).build_type, 16)) {
				if (D.id == _T) {
					this.add_to_queue(D);
					break;
				}
			}
		}
		return this.update_queue_on_page();
	}
	if (rt.at(href_list, "remove_from_queue")) {
		this.remove_from_queue(filter.getNum("remove_from_queue"));
		return this.update_queue_on_page();
	}
	if (rt.at(href_list, "partset_to_queue")) {
		this.add_part_set_to_queue((yield* g.callName(f, filter, "get", ["partset_to_queue"])));
		return this.update_queue_on_page();
	}
	if (rt.at(href_list, "process_queue")) {
		rt.spawnTail(f, 0, "/obj/machinery/mecha_part_fabricator/proc/Topic: spawn at game/mecha/mech_fabricator.dm:377", filter, tpart_set, _T, v, D, index, new_index, part);
	}
	if (rt.at(href_list, "clear_temp")) {
		this.temp = null;
	}
	if (rt.at(href_list, "screen")) {
		const sc = rt.at(href_list, "screen"); // tg_js: only the two screens the window knows
		if (sc === "main" || sc === "parts") this.screen = sc;
	}
	if (rt.at(href_list, "queue_move") && rt.at(href_list, "index")) {
		index = filter.getNum("index");
		new_index = index + filter.getNum("queue_move");
		if (isnum(index) && isnum(new_index) && IsInteger(index) && IsInteger(new_index)) {
			// tg_js: index itself must be in the queue too (Swap with 0 or 99 runtimed), and the queue must be a list
			if (rt.istype(this.queue, T("/list")) && IsInRange(index, 1, rt.len(f, this.queue)) && IsInRange(new_index, 1, rt.len(f, this.queue))) {
				this.queue.Swap(index, new_index);
			}
		}
		return this.update_queue_on_page();
	}
	if (rt.at(href_list, "clear_queue")) {
		this.queue = list();
		return this.update_queue_on_page();
	}
	if (rt.at(href_list, "sync")) {
		yield* this.sync();
	}
	if (rt.at(href_list, "part_desc")) {
		_T = filter.getStr("part_desc");
		v = null;
		for (v of each(this.files.known_designs)) {
			if (rt.bitAnd((D = rt.index(this.files.known_designs, v)).build_type, 16)) {
				if (D.id == _T) {
					this.temp = fmt("<h1>＀ description:</h1>\n\t\t\t\t\t\t\t\t＀<br>\n\t\t\t\t\t\t\t\t<a href='?src=＃;clear_temp=1'>Return</a>\n\t\t\t\t\t\t\t\t", [rt.initial(f, (part = D.build_path), "name"), rt.initial(f, part, "desc"), this]);
					break;
				}
			}
		}
	}
	if (rt.at(href_list, "remove_mat") && rt.at(href_list, "material")) {
		yield* this.materials.retrieve_sheets(text2num(rt.at(href_list, "remove_mat")), rt.at(href_list, "material"));
	}
	yield* this.updateUsrDialog();
	return f.dot;
}, true);

// a spawn(0) body of /obj/machinery/mecha_part_fabricator/proc/Topic, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/mecha_part_fabricator/proc/Topic: spawn at game/mecha/mech_fabricator.dm:377", function* (f: Frame, filter: Value, tpart_set: Value, _T: Value, v: Value, D: Value, index: Value, new_index: Value, part: Value) {
	if (this.processing_queue || this.being_built) {
		return 0;
	}
	this.processing_queue = 1;
	yield* this.process_queue();
	this.processing_queue = 0;
	return null;
});

// mech_fabricator.dm:419
rt.def("/obj/machinery/mecha_part_fabricator/proc/on_deconstruction", function* on_deconstruction(f: Frame) {
	yield* this.materials.retrieve_all();
	yield* parent_proc();
	return f.dot;
}, true);

// mech_fabricator.dm:423
rt.def("/obj/machinery/mecha_part_fabricator/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let material_amount: Value = null, inserted: Value = null, mat_overlay: Value = null;
	if (this.default_deconstruction_screwdriver(user, "fab-o", "fab-idle", W)) {
		return 1;
	}
	if (yield* this.exchange_parts(user, W)) {
		return 1;
	}
	if (yield* this.default_deconstruction_crowbar(W)) {
		return 1;
	}
	if (rt.istype(W, T("/obj/item/stack/sheet"))) {
		if (!this.is_insertion_ready(user)) {
			return 1;
		}
		material_amount = this.materials.get_item_material_amount(W);
		if (!(yield* this.try_insert(user, W, material_amount))) {
			return 1;
		}
		if (inserted = (yield* this.materials.insert_item(W))) {
			to_chat(user, fmt("<span class='notice'>You insert ＀ sheet５ into ＀.</span>", [inserted, this]));
			if (W && rt.len(f, W.materials)) {
				if (!(!W || W.gc_destroyed)) {
					yield* user.put_in_active_hand(W);
				}
				this.add_overlay((mat_overlay = `fab-load-${this.material2name(rt.index(W.materials, 1))}`));
				yield* sleep(10);
				if (!(!this || this.gc_destroyed)) {
					this.cut_overlay(mat_overlay);
				}
			}
		}
		yield* this.updateUsrDialog();
	} else if (rt.istype(W, T("/obj/item/weapon/ore/bluespace_crystal"))) {
		if (!this.is_insertion_ready(user)) {
			return 1;
		}
		material_amount = this.materials.get_item_material_amount(W);
		if (!(yield* this.try_insert(user, W, material_amount))) {
			return 1;
		}
		if (inserted = (yield* this.materials.insert_item(W))) {
			to_chat(user, `<span class='notice'>You add ${W} to the ${this}.</span>`);
			if (W && rt.len(f, W.materials)) {
				yield* qdel(W);
				this.add_overlay((mat_overlay = "fab-load-bluespace"));
				yield* sleep(10);
				if (!(!this || this.gc_destroyed)) {
					this.cut_overlay(mat_overlay);
				}
			}
		}
		yield* this.updateUsrDialog();
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// mech_fabricator.dm:483
rt.def("/obj/machinery/mecha_part_fabricator/proc/material2name", function material2name(f: Frame, ID: Value) {
	return copytext(ID, 2);
});

// mech_fabricator.dm:487
rt.def("/obj/machinery/mecha_part_fabricator/proc/is_insertion_ready", function is_insertion_ready(f: Frame, user: Value) {
	if (this.panel_open) {
		to_chat(user, `<span class='warning'>You can't load ${this} while it's opened!</span>`);
		return 0;
	}
	if (this.being_built) {
		to_chat(user, fmt("<span class='warning'>＄！ is currently processing! Please wait until completion.</span>", [this]));
		return 0;
	}
	return 1;
});

// mech_fabricator.dm:497
rt.def("/obj/machinery/mecha_part_fabricator/proc/try_insert", function* try_insert(f: Frame, user: Value, I: Value, material_amount: Value) {
	if (!material_amount) {
		to_chat(user, `<span class='warning'>This object does not contain sufficient amounts of materials to be accepted by ${this}.</span>`);
		return 0;
	}
	if (!this.materials.has_space(material_amount)) {
		to_chat(user, fmt("<span class='warning'>＄！ is full. Please remove some materials from ＀ in order to insert more.</span>", [this, this]));
		return 0;
	}
	if (!(yield* user.temporarilyRemoveItemFromInventory(I))) {
		to_chat(user, fmt("<span class='warning'>＄！ is stuck to you and cannot be placed into ＀.</span>", [I, this]));
		return 0;
	}
	return 1;
}, true);
