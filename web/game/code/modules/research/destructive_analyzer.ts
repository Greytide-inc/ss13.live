// Based on /tg/station's code/modules/research/destructive_analyzer.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(10971, "/obj/machinery/r_n_d/destructive_analyzer", "/obj/machinery/r_n_d", {
	decon_mod: 0,
	name: "destructive analyzer",
	desc: "Learn science by destroying things!",
	icon_state: "d_analyzer",
});

// destructive_analyzer.dm:17
rt.def("/obj/machinery/r_n_d/destructive_analyzer/proc/Initialize", function* Initialize(f: Frame) {
	let B: Value = null;
	f.dot = (yield* parent_proc());
	yield* (B = (yield* new_(T("/obj/item/weapon/circuitboard/machine/destructive_analyzer"), null))).apply_default_parts(this);
	return f.dot;
}, true);

rt.type(6780, "/obj/item/weapon/circuitboard/machine/destructive_analyzer", "/obj/item/weapon/circuitboard/machine", {
	req_components: null,
	name: "Destructive Analyzer (Machine Board)",
	build_path: rt.typePath("/obj/machinery/r_n_d/destructive_analyzer"),
	origin_tech: "magnets=2;engineering=2;programming=2",
});

// destructive_analyzer.dm:25
rt.def("/obj/item/weapon/circuitboard/machine/destructive_analyzer/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_components = rt.alist(f, [T("/obj/item/weapon/stock_parts/scanning_module"), 1, T("/obj/item/weapon/stock_parts/manipulator"), 1, T("/obj/item/weapon/stock_parts/micro_laser"), 1]);
	return f.dot;
});

// destructive_analyzer.dm:32
rt.def("/obj/machinery/r_n_d/destructive_analyzer/proc/RefreshParts", function RefreshParts(f: Frame) {
	let S: Value = null;
	let _T: Value = 0;
	for (S of each(this.component_parts, T("/obj/item/weapon/stock_parts"))) {
		_T += S.rating;
	}
	this.decon_mod = _T;
	return f.dot;
});

// destructive_analyzer.dm:38
rt.def("/obj/machinery/r_n_d/destructive_analyzer/proc/ConvertReqString2List", function ConvertReqString2List(f: Frame, source_list: Value) {
	let O: Value = null;
	let temp_list: Value = params2list(source_list);
	for (O of each(temp_list)) {
		rt.setAt(temp_list, O, text2num(rt.index(temp_list, O)));
	}
	return temp_list;
});

// destructive_analyzer.dm:44
rt.def("/obj/machinery/r_n_d/destructive_analyzer/proc/disconnect_console", function disconnect_console(f: Frame) {
	this.linked_console.linked_destroy = null;
	parent_proc();
	return f.dot;
});

// destructive_analyzer.dm:48
rt.def("/obj/machinery/r_n_d/destructive_analyzer/proc/Insert_Item", function* Insert_Item(f: Frame, O: Value, user: Value) {
	let temp_tech: Value = null;
	if (user.a_intent == "harm") return f.dot;
	f.dot = 1;
	if (!this.is_insertion_ready(user)) {
		return f.dot;
	}
	if (!O.origin_tech) {
		to_chat(user, "<span class='warning'>This doesn't seem to have a tech origin!</span>");
		return f.dot;
	}
	if (rt.len(f, (temp_tech = this.ConvertReqString2List(O.origin_tech))) == 0) {
		to_chat(user, "<span class='warning'>You cannot deconstruct this item!</span>");
		return f.dot;
	}
	if (!(yield* user.drop_item())) {
		to_chat(user, fmt("<span class='warning'>＄！ is stuck to your hand, you cannot put it in the ＀!</span>", [O, this.name]));
		return f.dot;
	}
	this.busy = 1;
	this.loaded_item = O;
	yield* O.forceMove(this);
	to_chat(user, `<span class='notice'>You add the ${O.name} to the ${this.name}!</span>`);
	flick("d_analyzer_la", this);
	rt.spawnTail(f, 10, "/obj/machinery/r_n_d/destructive_analyzer/proc/Insert_Item: spawn at modules/research/destructive_analyzer.dm:67", O, user, temp_tech);
	return f.dot;
}, true);

// a spawn(10) body of /obj/machinery/r_n_d/destructive_analyzer/proc/Insert_Item, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/r_n_d/destructive_analyzer/proc/Insert_Item: spawn at modules/research/destructive_analyzer.dm:67", function* (f: Frame, O: Value, user: Value, temp_tech: Value) {
	this.icon_state = "d_analyzer_l";
	this.busy = 0;
	return null;
});
