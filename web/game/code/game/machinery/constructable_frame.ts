// Based on /tg/station's code/game/machinery/constructable_frame.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g, subtract, fmt } = rt;


rt.type(12541, "/obj/structure/frame", "/obj/structure", {
	circuit: null,
	state: 1,
	name: "frame",
	icon: rt.rsc("icons/obj/stock_parts.dmi"),
	icon_state: "box_0",
	density: 1,
	obj_integrity: 250,
	max_integrity: 250,
});

// constructable_frame.dm:12
rt.def("/obj/structure/frame/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (!this.circuit) return f.dot;
	to_chat(user, fmt("It has ＇！ installed.", [this.circuit]));
	return f.dot;
}, false);

// constructable_frame.dm:18
rt.def("/obj/structure/frame/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	disassembled ??= 1;
	if (!rt.bitAnd(this.flags, NODECONSTRUCT)) {
		yield* new_(T("/obj/item/stack/sheet/metal"), this.loc, 5);
		if (this.circuit) {
			yield* this.circuit.forceMove(this.loc);
			this.circuit = null;
		}
	}
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(12542, "/obj/structure/frame/machine", "/obj/structure/frame", {
	components: null,
	req_components: null,
	req_component_names: null,
	name: "machine frame",
});

// constructable_frame.dm:33
rt.def("/obj/structure/frame/machine/proc/examine", function examine(f: Frame, user: Value) {
	let i: Value = null, tname: Value = null, amt: Value = null, use_and: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	parent_proc();
	if (!(this.state == 3 && this.req_components && this.req_component_names)) return f.dot;
	let hasContent: Value = 0;
	let requires: Value = "It requires";
	rt.forRange(f, 0, 1, rt.len(f, this.req_components), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		tname = rt.index(this.req_components, i);
		if ((amt = rt.index(this.req_components, tname)) == 0) {
			continue;
		}
		use_and = (i == rt.len(f, this.req_components) ? 1 : 0);
		if (hasContent) {
			if (use_and) {
				$0 = ", and";
			} else {
				$0 = ",";
			}
		} else {
			$0 = "";
		}
		$1 = amt;
		if (amt == 1) {
			$2 = rt.index(this.req_component_names, tname);
		} else {
			$2 = fmt("＀５", [rt.index(this.req_component_names, tname)]);
		}
		requires += `${$0} ${$1} ${$2}`;
		hasContent = 1;
	}
	rt.endFor(f, 0);
	if (hasContent) {
		to_chat(user, requires + ".");
	} else {
		to_chat(user, "It does not require any more components.");
	}
	return f.dot;
}, false);

// constructable_frame.dm:53
rt.def("/obj/structure/frame/machine/proc/update_namelist", function update_namelist(f: Frame) {
	let tname: Value = null, S: Value = null, singular_name: Value = null, O: Value = null;
	if (!this.req_components) {
		return f.dot;
	}
	this.req_component_names = new_(T("/list"));
	for (tname of each(this.req_components)) {
		if (ispath(tname, T("/obj/item/stack"))) {
			S = tname;
			if (singular_name = rt.initial(f, S, "singular_name")) {
				rt.setAt(this.req_component_names, tname, singular_name);
			} else {
				rt.setAt(this.req_component_names, tname, rt.initial(f, S, "name"));
			}
		} else {
			O = tname;
			rt.setAt(this.req_component_names, tname, rt.initial(f, O, "name"));
		}
	}
	return f.dot;
});

// constructable_frame.dm:71
rt.def("/obj/structure/frame/machine/proc/get_req_components_amt", function get_req_components_amt(f: Frame) {
	let path: Value = null;
	let amt: Value = 0;
	for (path of each(this.req_components)) {
		amt += rt.index(this.req_components, path);
	}
	return amt;
});

// constructable_frame.dm:76
rt.def("/obj/structure/frame/machine/proc/attackby", function* attackby(f: Frame) {
	let C: Value = null, M: Value = null, B: Value = null, A: Value = null, component_check: Value = null, R: Value = null, new_machine: Value = null, O: Value = null, replacer: Value = null, added_components: Value = null, part_list: Value = null, co: Value = null, path: Value = null, part: Value = null, part_3: Value = null, I: Value = null, S: Value = null, used_amt: Value = null, NS: Value = null;
	let $e: any;
	if (this.state === 1) {
		if (rt.istype(f.args[0], T("/obj/item/weapon/circuitboard/machine"))) {
			to_chat(f.args[1], "<span class='warning'>The frame needs wiring first!</span>");
			return f.dot;
		} else if (rt.istype(f.args[0], T("/obj/item/weapon/circuitboard"))) {
			to_chat(f.args[1], "<span class='warning'>This frame does not accept circuit boards of this type!</span>");
			return f.dot;
		}
		if (rt.istype(f.args[0], T("/obj/item/stack/cable_coil"))) {
			if ((C = f.args[0]).get_amount() >= 5) {
				playsound(this.loc, rt.rsc("sound/items/deconstruct.ogg"), 50, 1);
				to_chat(f.args[1], "<span class='notice'>You start to add cables to the frame...</span>");
				if (yield* do_after(f.args[1], 20 * f.args[0].toolspeed, { target: this })) {
					if (C.get_amount() >= 5 && this.state == 1) {
						yield* C.use(5);
						to_chat(f.args[1], "<span class='notice'>You add cables to the frame.</span>");
						this.state = 2;
						this.icon_state = "box_1";
					}
				}
			} else {
				to_chat(f.args[1], "<span class='warning'>You need five length of cable to wire the frame!</span>");
			}
			return f.dot;
		}
		if (rt.istype(f.args[0], T("/obj/item/weapon/screwdriver")) && !this.anchored) {
			playsound(this.loc, f.args[0].usesound, 50, 1);
			f.args[1].visible_message(`<span class='warning'>${f.args[1]} disassembles the frame.</span>`, "<span class='notice'>You start to disassemble the frame...</span>", "You hear banging and clanking.");
			if (yield* do_after(f.args[1], 40 * f.args[0].toolspeed, { target: this })) {
				if (this.state == 1) {
					to_chat(f.args[1], "<span class='notice'>You disassemble the frame.</span>");
					yield* (M = (yield* new_(T("/obj/item/stack/sheet/metal"), this.loc, 5))).add_fingerprint(f.args[1]);
					yield* qdel(this);
				}
			}
			return f.dot;
		}
		if (rt.istype(f.args[0], T("/obj/item/weapon/wrench"))) {
			to_chat(f.args[1], `<span class='notice'>You start ${this.anchored ? "un" : ""}securing ${this.name}...</span>`);
			playsound(this.loc, f.args[0].usesound, 75, 1);
			if (yield* do_after(f.args[1], 40 * f.args[0].toolspeed, { target: this })) {
				if (this.state == 1) {
					to_chat(f.args[1], `<span class='notice'>You ${this.anchored ? "un" : ""}secure ${this.name}.</span>`);
					this.anchored = (!this.anchored ? 1 : 0);
				}
			}
			return f.dot;
		}
	} else if (this.state === 2) {
		if (rt.istype(f.args[0], T("/obj/item/weapon/wrench"))) {
			to_chat(f.args[1], `<span class='notice'>You start ${this.anchored ? "un" : ""}securing ${this.name}...</span>`);
			playsound(this.loc, f.args[0].usesound, 75, 1);
			if (yield* do_after(f.args[1], 40 * f.args[0].toolspeed, { target: this })) {
				to_chat(f.args[1], `<span class='notice'>You ${this.anchored ? "un" : ""}secure ${this.name}.</span>`);
				this.anchored = (!this.anchored ? 1 : 0);
			}
			return f.dot;
		}
		if (rt.istype(f.args[0], T("/obj/item/weapon/circuitboard/machine"))) {
			if (!this.anchored) {
				to_chat(f.args[1], "<span class='warning'>The frame needs to be secured first!</span>");
				return f.dot;
			}
			B = f.args[0];
			if (!(yield* f.args[1].drop_item())) {
				return f.dot;
			}
			playsound(this.loc, rt.rsc("sound/items/deconstruct.ogg"), 50, 1);
			to_chat(f.args[1], "<span class='notice'>You add the circuit board to the frame.</span>");
			this.circuit = B;
			B.loc = this;
			this.icon_state = "box_2";
			this.state = 3;
			this.components = list();
			this.req_components = (yield* B.req_components.Copy());
			this.update_namelist();
			return f.dot;
		} else if (rt.istype(f.args[0], T("/obj/item/weapon/circuitboard"))) {
			to_chat(f.args[1], "<span class='warning'>This frame does not accept circuit boards of this type!</span>");
			return f.dot;
		}
		if (rt.istype(f.args[0], T("/obj/item/weapon/wirecutters"))) {
			playsound(this.loc, f.args[0].usesound, 50, 1);
			to_chat(f.args[1], "<span class='notice'>You remove the cables.</span>");
			this.state = 1;
			this.icon_state = "box_0";
			(A = (yield* new_(T("/obj/item/stack/cable_coil"), this.loc))).amount = 5;
			return f.dot;
		}
	} else if (this.state === 3) {
		if (rt.istype(f.args[0], T("/obj/item/weapon/crowbar"))) {
			playsound(this.loc, f.args[0].usesound, 50, 1);
			this.state = 2;
			this.circuit.loc = this.loc;
			yield* this.components.Remove(this.circuit);
			this.circuit = null;
			if (rt.len(f, this.components) == 0) {
				to_chat(f.args[1], "<span class='notice'>You remove the circuit board.</span>");
			} else {
				to_chat(f.args[1], "<span class='notice'>You remove the circuit board and other components.</span>");
				A = null;
				for (A of each(this.components, T("/atom/movable"))) {
					A.loc = this.loc;
				}
			}
			this.desc = rt.initial(f, this, "desc");
			this.req_components = null;
			this.components = null;
			this.icon_state = "box_1";
			return f.dot;
		}
		if (rt.istype(f.args[0], T("/obj/item/weapon/screwdriver"))) {
			component_check = 1;
			for (R of each(this.req_components)) {
				if (rt.index(this.req_components, R) > 0) {
					component_check = 0;
					break;
				}
			}
			if (component_check) {
				playsound(this.loc, f.args[0].usesound, 50, 1);
				yield* (new_machine = (yield* new_(this.circuit.build_path, this.loc, 1))).on_construction();
				for (O of each(new_machine.component_parts, T("/obj"))) {
					yield* qdel(O);
				}
				new_machine.component_parts = list();
				O = null;
				for (O of each(this, T("/obj"))) {
					O.loc = null;
					new_machine.component_parts += O;
				}
				this.circuit.loc = null;
				yield* new_machine.RefreshParts();
				yield* qdel(this);
			}
			return f.dot;
		}
		if (rt.istype(f.args[0], T("/obj/item/weapon/storage/part_replacer")) && rt.len(f, f.args[0].contents) && this.get_req_components_amt()) {
			replacer = f.args[0];
			added_components = list();
			part_list = list();
			for (co of each(replacer, T("/obj/item/weapon/stock_parts"))) {
				part_list += co;
			}
			part_list = (yield* sortTim(part_list, P("/proc/cmp_rped_sort")));
			for (path of each(this.req_components)) {
				while (rt.index(this.req_components, path) > 0 && rt.locateIn(f, path, part_list)) {
					part = rt.locateIn(f, path, part_list);
					rt.setAt(added_components, part, path);
					yield* replacer.remove_from_storage(part, this);
					rt.incAt(this.req_components, path, -1, true);
					part_list -= part;
				}
			}
			for (part_3 of each(added_components, T("/obj/item/weapon/stock_parts"))) {
				this.components += part_3;
				to_chat(f.args[1], `<span class='notice'>${part_3.name} applied.</span>`);
			}
			if (rt.len(f, added_components)) {
				replacer.play_rped_sound();
			}
			return f.dot;
		}
		if (rt.istype(f.args[0], T("/obj/item")) && this.get_req_components_amt()) {
			for (I of each(this.req_components)) {
				if (rt.op(f, "IsType", [], [f.args[0], I]) && rt.index(this.req_components, I) > 0) {
					if (rt.istype(f.args[0], T("/obj/item/stack"))) {
						S = f.args[0];
						if ((used_amt = min(round(S.get_amount()), rt.index(this.req_components, I))) && (yield* S.use(used_amt))) {
							if (!(NS = rt.locateIn(f, S.merge_type, this.components))) {
								this.components += (NS = (yield* new_(S.merge_type, this, used_amt)));
							} else {
								yield* g.callName(f, NS, "add", [used_amt]);
							}
							(rt.modAt(this.req_components, I, used_amt, subtract));
							to_chat(f.args[1], `<span class='notice'>You add ${f.args[0]} to ${this}.</span>`);
						}
						return f.dot;
					}
					if (!(yield* f.args[1].drop_item())) {
						break;
					}
					to_chat(f.args[1], `<span class='notice'>You add ${f.args[0]} to ${this}.</span>`);
					yield* f.args[0].forceMove(this);
					this.components += f.args[0];
					rt.incAt(this.req_components, I, -1, true);
					return 1;
				}
			}
			to_chat(f.args[1], "<span class='warning'>You cannot add that to the machine!</span>");
			return 0;
		}
	}
	if (f.args[1].a_intent != "harm") return f.dot;
	return (yield* parent_proc());
}, true, { args: ["P", "user", "params"] });

// constructable_frame.dm:257
rt.def("/obj/structure/frame/machine/proc/deconstruct", function* deconstruct(f: Frame) {
	let X: Value = null, I: Value = null;
	if (f.args[0] === null) {
		f.args[0] = 1;
	}
	if (!rt.bitAnd(this.flags, NODECONSTRUCT)) {
		if (this.state >= 2) {
			yield* new_(T("/obj/item/stack/cable_coil"), this.loc, 5);
		}
		for (X of each(this.components)) {
			yield* (I = X).forceMove(this.loc);
		}
	}
	yield* parent_proc();
	return f.dot;
}, true, { args: ["disassembled"] });

rt.type(6713, "/obj/item/weapon/circuitboard/machine", "/obj/item/weapon/circuitboard", {
	req_components: null,
	def_components: null,
});

// constructable_frame.dm:281
rt.def("/obj/item/weapon/circuitboard/machine/proc/apply_default_parts", function* apply_default_parts(f: Frame, M: Value) {
	let comp_path: Value = null, comp_amt: Value = null, i: Value = null;
	let $e: any;
	if (!this.req_components) {
		return f.dot;
	}
	M.component_parts = list(this);
	this.loc = null;
	for (comp_path of each(this.req_components)) {
		if (!(comp_amt = rt.index(this.req_components, comp_path))) {
			continue;
		}
		if (this.def_components && rt.index(this.def_components, comp_path)) {
			comp_path = rt.index(this.def_components, comp_path);
		}
		if (ispath(comp_path, T("/obj/item/stack"))) {
			M.component_parts += (yield* new_(comp_path, null, comp_amt));
		} else {
			i = null;
			rt.forRange(f, 1, 1, comp_amt, 1);
			while (($e = rt.next(f, 1)) !== undefined) {
				i = $e;
				M.component_parts += (yield* new_(comp_path, null));
			}
			rt.endFor(f, 1);
		}
	}
	yield* M.RefreshParts();
	return f.dot;
}, true);
