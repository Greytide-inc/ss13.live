// From code/modules/mob/living/ventcrawling.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalventcrawl_machinery  (code/modules/mob/living/ventcrawling.dm:2)
rt.def("/datum/controller/global_vars/proc/InitGlobalventcrawl_machinery", function InitGlobalventcrawl_machinery(f: Frame) {
	rt.setGl("ventcrawl_machinery", rt.call(f, P("/proc/typecacheof"), null, [rt.list(T("/obj/machinery/atmospherics/components/unary/vent_pump"), T("/obj/machinery/atmospherics/components/unary/vent_scrubber"))]));
	rt.modSrcVar(f, "gvars_datum_init_order", "ventcrawl_machinery", add);
	return f.dot;
});

// /mob/living/proc/handle_ventcrawl  (code/modules/mob/living/ventcrawling.dm:9)  may sleep
rt.def("/mob/living/proc/handle_ventcrawl", function* handle_ventcrawl(f: Frame, A: Value) {
	let vent_found: Value = null, machine: Value = null, vent_found_parent: Value = null, failed: Value = null, items_list: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [A, vent_found, machine, vent_found_parent, failed, items_list, I, $e];
	if ((!truthy(rt.sv(f, "ventcrawler")) || !truthy((yield* g.srcCall(f, "Adjacent", live(A)))))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "stat"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "You must be conscious to do this!"]);
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "lying"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "You can't vent crawl while you're stunned!"]);
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "restrained")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "You can't vent crawl while you're restrained!"]);
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "has_buckled_mobs")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "You can't vent crawl with other creatures on you!"]);
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "buckled"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "You can't vent crawl while buckled!"]);
		return live(f.dot);
	}
	vent_found = null;
	if (truthy(live(A))) {
		if ((!truthy((rt.istype((vent_found = live(A)), T("/obj/machinery/atmospherics/components/unary")) ? 1 : 0)) || !truthy((yield* g.callName(f, live(vent_found), "can_crawl_through", []))))) {
			vent_found = null;
		}
	}
	if (!truthy(live(vent_found))) {
		machine = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [1, live(f.src)])), T("/obj/machinery/atmospherics"));
		while (($e = rt.next(f, 0)) !== undefined) {
			machine = $e;
			if (truthy((yield* g.call(f, P("/proc/is_type_in_typecache"), null, [live(machine), rt.gl("ventcrawl_machinery")])))) {
				vent_found = live(machine);
			}
			if (!truthy((yield* g.callName(f, live(vent_found), "can_crawl_through", [])))) {
				vent_found = null;
			}
			if (truthy(live(vent_found))) {
				break;
			}
		}
		rt.endFor(f, 0);
	}
	if (truthy(live(vent_found))) {
		if ((truthy((vent_found_parent = rt.index(rt.fv(f, "parents", live(vent_found)), 1))) && (truthy(rt.getLen(f, rt.fv(f, "members", live(vent_found_parent)))) || truthy(rt.fv(f, "other_atmosmch", live(vent_found_parent)))))) {
			yield* g.srcCall(f, "visible_message", fmt("<span class='notice'>＀ begins climbing into the ventilation system...</span>", [live(f.src)]), "<span class='notice'>You begin climbing into the ventilation system...</span>");
			if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.src), null, 25, "target", live(vent_found)], rt.Args.Named)))) {
				return live(f.dot);
			}
			if (!truthy(rt.sv(f, "client"))) {
				return live(f.dot);
			}
			if ((truthy((rt.istype(live(f.src), T("/mob/living/carbon")) ? 1 : 0)) && rt.lt(rt.sv(f, "ventcrawler"), 2))) {
				failed = 0;
				if (truthy(rt.getLen(f, (items_list = (yield* g.srcCall(f, "get_equipped_items")))))) {
					failed = 1;
				}
				I = null;
				rt.forList(f, 0, rt.sv(f, "held_items"), T("/obj/item"));
				if (($e = rt.next(f, 0)) !== undefined) {
					I = $e;
					failed = 1;
				}
				rt.endFor(f, 0);
				if (truthy(live(failed))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>You can't crawl around in the ventilation ducts with items!</span>"]);
					return live(f.dot);
				}
			}
			yield* g.srcCall(f, "visible_message", fmt("<span class='notice'>＀ scrambles into the ventilation ducts!</span>", [live(f.src)]), "<span class='notice'>You climb into the ventilation ducts.</span>");
			yield* g.srcCall(f, "forceMove", live(vent_found));
		}
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>This ventilation duct is not connected to anything!</span>"]);
	}
	return f.dot;
}, true);

// /mob/living/simple_animal/slime/proc/handle_ventcrawl  (code/modules/mob/living/ventcrawling.dm:77)  may sleep
rt.def("/mob/living/simple_animal/slime/proc/handle_ventcrawl", function* handle_ventcrawl(f: Frame) {
	if (truthy(rt.sv(f, "buckled"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<i>I can't vent crawl while feeding...</i>"]);
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["A"] });

// /mob/living/proc/add_ventcrawl  (code/modules/mob/living/ventcrawling.dm:83)
rt.def("/mob/living/proc/add_ventcrawl", function add_ventcrawl(f: Frame, starting_machine: Value) {
	let totalMembers: Value = null, _P: Value = null, X: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [totalMembers, _P, X, A, $e];
	if ((!truthy((rt.istype(live(starting_machine), T("/obj/machinery/atmospherics")) ? 1 : 0)) || !truthy(rt.callName(f, live(starting_machine), "can_see_pipes", [])))) {
		return live(f.dot);
	}
	totalMembers = rt.list();
	_P = null;
	rt.forList(f, 0, rt.callName(f, live(starting_machine), "returnPipenets", []), T("/datum/pipeline"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_P = $e;
		totalMembers = rt.modify(live(totalMembers), rt.fv(f, "members", live(_P)), add);
		totalMembers = rt.modify(live(totalMembers), rt.fv(f, "other_atmosmch", live(_P)), add);
	}
	rt.endFor(f, 0);
	if (!truthy(rt.len(f, live(totalMembers)))) {
		return live(f.dot);
	}
	X = null;
	rt.forList(f, 0, live(totalMembers));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		if (!truthy(rt.gv(f, "pipe_vision_img", (A = live(X))))) {
			rt.setFv(f, "pipe_vision_img", live(A), rt.call(f, P("/proc/image"), null, [null, live(A), null, rt.fv(f, "loc", live(A)), "layer", 20, "dir", rt.fv(f, "dir", live(A))], rt.Args.Named));
			rt.setFv(f, "plane", rt.fv(f, "pipe_vision_img", live(A)), 20);
		}
		rt.modSrcVar(f, "pipes_shown", rt.fv(f, "pipe_vision_img", live(A)), add);
		if (truthy(rt.sv(f, "client"))) {
			rt.modField(f, rt.sv(f, "client"), "images", rt.fv(f, "pipe_vision_img", live(A)), add);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /mob/living/proc/remove_ventcrawl  (code/modules/mob/living/ventcrawling.dm:106)
rt.def("/mob/living/proc/remove_ventcrawl", function remove_ventcrawl(f: Frame) {
	let current_image: Value = null;
	let $e: any;
	f.vars = () => [current_image, $e];
	if (truthy(rt.sv(f, "client"))) {
		current_image = null;
		rt.forList(f, 0, rt.sv(f, "pipes_shown"), T("/image"));
		while (($e = rt.next(f, 0)) !== undefined) {
			current_image = $e;
			(rt.modField(f, rt.sv(f, "client"), "images", live(current_image), subtract));
		}
		rt.endFor(f, 0);
	}
	rt.setFv(f, "len", rt.sv(f, "pipes_shown"), 0);
	return f.dot;
});

// /mob/living/proc/update_pipe_vision  (code/modules/mob/living/ventcrawling.dm:118)
rt.def("/mob/living/proc/update_pipe_vision", function update_pipe_vision(f: Frame, new_loc: Value) {
	f.vars = () => [new_loc];
	if (live(new_loc) === null) {
		new_loc = null;
	}
	f.dot = rt.sv(f, "loc");
	if (truthy(live(new_loc))) {
		f.dot = live(new_loc);
	}
	rt.callSrc(f, "remove_ventcrawl", []);
	rt.callSrc(f, "add_ventcrawl", [live(f.dot)]);
	return f.dot;
});
