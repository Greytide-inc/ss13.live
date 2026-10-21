// From code/datums/hud.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalhuds  (code/datums/hud.dm:4)
rt.def("/datum/controller/global_vars/proc/InitGlobalhuds", function InitGlobalhuds(f: Frame) {
	rt.setGl("huds", rt.alist(f, [1, rt.new_(f, T("/datum/atom_hud/data/human/security/basic"), []), 2, rt.new_(f, T("/datum/atom_hud/data/human/security/advanced"), []), 3, rt.new_(f, T("/datum/atom_hud/data/human/medical/basic"), []), 4, rt.new_(f, T("/datum/atom_hud/data/human/medical/advanced"), []), 5, rt.new_(f, T("/datum/atom_hud/data/diagnostic"), []), 6, rt.new_(f, T("/datum/atom_hud/antag"), []), 7, rt.new_(f, T("/datum/atom_hud/antag"), []), 8, rt.new_(f, T("/datum/atom_hud/antag"), []), 9, rt.new_(f, T("/datum/atom_hud/antag"), []), 10, rt.new_(f, T("/datum/atom_hud/antag"), []), 11, rt.new_(f, T("/datum/atom_hud/antag/hidden"), []), 12, rt.new_(f, T("/datum/atom_hud/antag/hidden"), []), 13, rt.new_(f, T("/datum/atom_hud/antag/hidden"), []), 14, rt.new_(f, T("/datum/atom_hud/antag/hidden"), []), 15, rt.new_(f, T("/datum/atom_hud/antag"), []), 16, rt.new_(f, T("/datum/atom_hud/antag/hidden"), []), 17, rt.new_(f, T("/datum/atom_hud/antag/hidden"), []), 18, rt.new_(f, T("/datum/atom_hud/antag"), [])]));
	rt.modSrcVar(f, "gvars_datum_init_order", "huds", add);
	return f.dot;
});

rt.type(548, "/datum/atom_hud", "/datum", {
	hudatoms: null,
	hudusers: null,
	hud_icons: null,
});

// /datum/atom_hud/proc/<init>  (code/datums/hud.dm:26)
rt.def("/datum/atom_hud/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "hudatoms", rt.list());
	$0 = $0;
	rt.setSv(f, "hudusers", rt.list());
	$0 = $0;
	rt.setSv(f, "hud_icons", rt.list());
	return f.dot;
});

// /datum/atom_hud/proc/remove_hud_from  (code/datums/hud.dm:31)
rt.def("/datum/atom_hud/proc/remove_hud_from", function remove_hud_from(f: Frame, M: Value) {
	let A: Value = null;
	let $e: any;
	f.vars = () => [A, $e];
	if (!truthy(live(M))) {
		return live(f.dot);
	}
	if (truthy((rt.isIn(f, live(f.src), rt.fv(f, "permanent_huds", live(M))) ? 1 : 0))) {
		return live(f.dot);
	}
	A = null;
	rt.forList(f, 0, rt.sv(f, "hudatoms"), T("/atom"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		rt.callSrc(f, "remove_from_single_hud", [live(M), live(A)]);
	}
	rt.endFor(f, 0);
	(rt.modSrcVar(f, "hudusers", live(M), subtract));
	return f.dot;
});

// /datum/atom_hud/proc/remove_from_hud  (code/datums/hud.dm:40)
rt.def("/datum/atom_hud/proc/remove_from_hud", function remove_from_hud(f: Frame, A: Value) {
	let M: Value = null;
	let $e: any;
	f.vars = () => [M, $e];
	if (!truthy(live(A))) {
		return 0;
	}
	M = null;
	rt.forList(f, 0, rt.sv(f, "hudusers"), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		rt.callSrc(f, "remove_from_single_hud", [live(M), live(A)]);
	}
	rt.endFor(f, 0);
	(rt.modSrcVar(f, "hudatoms", live(A), subtract));
	return 1;
});

// /datum/atom_hud/proc/remove_from_single_hud  (code/datums/hud.dm:48)
rt.def("/datum/atom_hud/proc/remove_from_single_hud", function remove_from_single_hud(f: Frame, M: Value, A: Value) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	if (((!truthy(live(M)) || !truthy(rt.fv(f, "client", live(M)))) || !truthy(live(A)))) {
		return live(f.dot);
	}
	i = null;
	rt.forList(f, 0, rt.sv(f, "hud_icons"));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		(rt.modField(f, rt.fv(f, "client", live(M)), "images", rt.index(rt.fv(f, "hud_list", live(A)), live(i)), subtract));
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/atom_hud/proc/add_hud_to  (code/datums/hud.dm:54)
rt.def("/datum/atom_hud/proc/add_hud_to", function add_hud_to(f: Frame, M: Value) {
	let A: Value = null;
	let $e: any;
	f.vars = () => [A, $e];
	if (!truthy(live(M))) {
		return live(f.dot);
	}
	rt.setAt(rt.sv(f, "hudusers"), live(M), 1);
	A = null;
	rt.forList(f, 0, rt.sv(f, "hudatoms"), T("/atom"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		rt.callSrc(f, "add_to_single_hud", [live(M), live(A)]);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/atom_hud/proc/add_to_hud  (code/datums/hud.dm:61)
rt.def("/datum/atom_hud/proc/add_to_hud", function add_to_hud(f: Frame, A: Value) {
	let M: Value = null;
	let $e: any;
	f.vars = () => [M, $e];
	if (!truthy(live(A))) {
		return 0;
	}
	(rt.modSrcVar(f, "hudatoms", live(A), rt.bitOr));
	M = null;
	rt.forList(f, 0, rt.sv(f, "hudusers"), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		rt.callSrc(f, "add_to_single_hud", [live(M), live(A)]);
	}
	rt.endFor(f, 0);
	return 1;
});

// /datum/atom_hud/proc/add_to_single_hud  (code/datums/hud.dm:69)
rt.def("/datum/atom_hud/proc/add_to_single_hud", function add_to_single_hud(f: Frame, M: Value, A: Value) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	if (((!truthy(live(M)) || !truthy(rt.fv(f, "client", live(M)))) || !truthy(live(A)))) {
		return live(f.dot);
	}
	i = null;
	rt.forList(f, 0, rt.sv(f, "hud_icons"));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (truthy(rt.index(rt.fv(f, "hud_list", live(A)), live(i)))) {
			(rt.modField(f, rt.fv(f, "client", live(M)), "images", rt.index(rt.fv(f, "hud_list", live(A)), live(i)), rt.bitOr));
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /mob/proc/reload_huds  (code/datums/hud.dm:77)
rt.def("/mob/proc/reload_huds", function reload_huds(f: Frame) {
	let gang_huds: Value = null, G: Value = null, hud: Value = null;
	let $e: any;
	f.vars = () => [gang_huds, G, hud, $e];
	gang_huds = rt.list();
	if (truthy(rt.fv(f, "mode", rt.gl("SSticker")))) {
		G = null;
		rt.forList(f, 0, rt.gv(f, "gangs", rt.fv(f, "mode", rt.gl("SSticker"))), T("/datum/gang"));
		while (($e = rt.next(f, 0)) !== undefined) {
			G = $e;
			gang_huds = rt.modify(live(gang_huds), rt.fv(f, "ganghud", live(G)), add);
		}
		rt.endFor(f, 0);
	}
	hud = null;
	rt.forList(f, 0, rt.bitOr(rt.bitOr(rt.gl("huds"), live(gang_huds)), rt.gl("active_alternate_appearances")), T("/datum/atom_hud"));
	while (($e = rt.next(f, 0)) !== undefined) {
		hud = $e;
		if ((truthy(live(hud)) && truthy(rt.index(rt.fv(f, "hudusers", live(hud)), live(f.src))))) {
			rt.callName(f, live(hud), "add_hud_to", [live(f.src)]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});
