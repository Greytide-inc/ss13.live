// From code/modules/detectivework/detective_work.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /atom/proc/add_fibers  (code/modules/detectivework/detective_work.dm:6)  may sleep
rt.def("/atom/proc/add_fibers", function* add_fibers(f: Frame, M: Value) {
	let G: Value = null, fibertext: Value = null, item_multiplier: Value = null;
	let $0: any;
	f.vars = () => [M, G, fibertext, item_multiplier, $0];
	if ((truthy(rt.fv(f, "gloves", live(M))) && truthy((rt.istype(rt.fv(f, "gloves", live(M)), T("/obj/item/clothing")) ? 1 : 0)))) {
		if (rt.gt(rt.gv(f, "transfer_blood", (G = rt.fv(f, "gloves", live(M)))), 1)) {
			if (truthy((yield* g.srcCall(f, "add_blood", rt.fv(f, "blood_DNA", live(G)))))) {
				rt.incField(f, live(G), "transfer_blood", -1, true);
			}
		}
	} else {
		if (rt.gt(rt.fv(f, "bloody_hands", live(M)), 1)) {
			if (truthy((yield* g.srcCall(f, "add_blood", rt.fv(f, "blood_DNA", live(M)))))) {
				rt.incField(f, live(M), "bloody_hands", -1, true);
			}
		}
	}
	if (!truthy(rt.sv(f, "suit_fibers"))) {
		rt.setSv(f, "suit_fibers", rt.list());
	}
	fibertext = null;
	if (truthy((rt.istype(live(f.src), T("/obj/item")) ? 1 : 0))) {
		$0 = 1.2000000476837158;
	} else {
		$0 = 1;
	}
	item_multiplier = $0;
	if (truthy(rt.fv(f, "wear_suit", live(M)))) {
		fibertext = fmt("Material from ＇！.", [rt.fv(f, "wear_suit", live(M))]);
		if ((truthy(rt.op(f, "Prob", [], [multiply(10, live(item_multiplier))])) && !truthy((rt.isIn(f, live(fibertext), rt.sv(f, "suit_fibers")) ? 1 : 0)))) {
			rt.modSrcVar(f, "suit_fibers", live(fibertext), add);
		}
		if (!truthy(rt.bitAnd(rt.gv(f, "body_parts_covered", rt.fv(f, "wear_suit", live(M))), 2))) {
			if (truthy(rt.fv(f, "w_uniform", live(M)))) {
				fibertext = fmt("Fibers from ＇！.", [rt.fv(f, "w_uniform", live(M))]);
				if ((truthy(rt.op(f, "Prob", [], [multiply(12, live(item_multiplier))])) && !truthy((rt.isIn(f, live(fibertext), rt.sv(f, "suit_fibers")) ? 1 : 0)))) {
					rt.modSrcVar(f, "suit_fibers", live(fibertext), add);
				}
			}
		}
		if (!truthy(rt.bitAnd(rt.gv(f, "body_parts_covered", rt.fv(f, "wear_suit", live(M))), 1536))) {
			if (truthy(rt.fv(f, "gloves", live(M)))) {
				fibertext = fmt("Material from a pair of ＀.", [rt.gv(f, "name", rt.fv(f, "gloves", live(M)))]);
				if ((truthy(rt.op(f, "Prob", [], [multiply(20, live(item_multiplier))])) && !truthy((rt.isIn(f, live(fibertext), rt.sv(f, "suit_fibers")) ? 1 : 0)))) {
					rt.modSrcVar(f, "suit_fibers", live(fibertext), add);
				}
			}
		}
	} else {
		if (truthy(rt.fv(f, "w_uniform", live(M)))) {
			fibertext = fmt("Fibers from ＇！.", [rt.fv(f, "w_uniform", live(M))]);
			if ((truthy(rt.op(f, "Prob", [], [multiply(15, live(item_multiplier))])) && !truthy((rt.isIn(f, live(fibertext), rt.sv(f, "suit_fibers")) ? 1 : 0)))) {
				rt.modSrcVar(f, "suit_fibers", live(fibertext), add);
			}
			if (truthy(rt.fv(f, "gloves", live(M)))) {
				fibertext = fmt("Material from a pair of ＀.", [rt.gv(f, "name", rt.fv(f, "gloves", live(M)))]);
				if ((truthy(rt.op(f, "Prob", [], [multiply(20, live(item_multiplier))])) && !truthy((rt.isIn(f, live(fibertext), rt.sv(f, "suit_fibers")) ? 1 : 0)))) {
					rt.modSrcVar(f, "suit_fibers", fmt("Material from a pair of ＀.", [rt.gv(f, "name", rt.fv(f, "gloves", live(M)))]), add);
				}
			}
		} else {
			if (!truthy(rt.fv(f, "gloves", live(M)))) return f.dot;
			fibertext = fmt("Material from a pair of ＀.", [rt.gv(f, "name", rt.fv(f, "gloves", live(M)))]);
			if (!(truthy(rt.op(f, "Prob", [], [multiply(20, live(item_multiplier))])) && !truthy((rt.isIn(f, live(fibertext), rt.sv(f, "suit_fibers")) ? 1 : 0)))) return f.dot;
			rt.modSrcVar(f, "suit_fibers", fmt("Material from a pair of ＀.", [rt.gv(f, "name", rt.fv(f, "gloves", live(M)))]), add);
		}
	}
	return f.dot;
}, true);

// /atom/proc/add_hiddenprint  (code/modules/detectivework/detective_work.dm:52)
rt.def("/atom/proc/add_hiddenprint", function add_hiddenprint(f: Frame, M: Value) {
	let hasgloves: Value = null, H: Value = null, current_time: Value = null, laststamppos: Value = null;
	f.vars = () => [hasgloves, H, current_time, laststamppos];
	if ((!truthy(live(M)) || !truthy(rt.fv(f, "key", live(M))))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "fingerprintshidden"))) {
		rt.setSv(f, "fingerprintshidden", rt.list());
	}
	hasgloves = "";
	if (truthy((rt.istype(live(M), T("/mob/living/carbon/human")) ? 1 : 0))) {
		if (truthy(rt.gv(f, "gloves", (H = live(M))))) {
			hasgloves = "(gloves)";
		}
	}
	current_time = rt.call(f, P("/proc/time_stamp"), null, []);
	if (!truthy(rt.index(rt.sv(f, "fingerprintshidden"), rt.fv(f, "key", live(M))))) {
		rt.setAt(rt.sv(f, "fingerprintshidden"), rt.fv(f, "key", live(M)), fmt("First: ＀[＀]＀. Ckey: ＀", [rt.fv(f, "real_name", live(M)), live(current_time), live(hasgloves), rt.fv(f, "ckey", live(M))]));
	} else {
		if (truthy((laststamppos = rt.call(f, P("/proc/findtext"), null, [rt.index(rt.sv(f, "fingerprintshidden"), rt.fv(f, "key", live(M))), " Last: "])))) {
			rt.setAt(rt.sv(f, "fingerprintshidden"), rt.fv(f, "key", live(M)), rt.call(f, P("/proc/copytext"), null, [rt.index(rt.sv(f, "fingerprintshidden"), rt.fv(f, "key", live(M))), 1, live(laststamppos)]));
		}
		rt.modAt(rt.sv(f, "fingerprintshidden"), rt.fv(f, "key", live(M)), fmt(" Last: ＀[＀]＀. Ckey: ＀", [rt.fv(f, "real_name", live(M)), live(current_time), live(hasgloves), rt.fv(f, "ckey", live(M))]), add);
	}
	rt.setSv(f, "fingerprintslast", rt.fv(f, "ckey", live(M)));
	return f.dot;
});

// /atom/proc/add_fingerprint  (code/modules/detectivework/detective_work.dm:78)  may sleep
rt.def("/atom/proc/add_fingerprint", function* add_fingerprint(f: Frame, M: Value, ignoregloves: Value) {
	let H: Value = null, G: Value = null, full_print: Value = null;
	f.vars = () => [M, ignoregloves, H, G, full_print];
	if (live(ignoregloves) === null) {
		ignoregloves = 0;
	}
	if ((!truthy(live(M)) || !truthy(rt.fv(f, "key", live(M))))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "add_hiddenprint", live(M));
	if (!truthy((rt.istype(live(M), T("/mob/living/carbon/human")) ? 1 : 0))) return f.dot;
	yield* g.srcCall(f, "add_fibers", (H = live(M)));
	if (truthy(rt.fv(f, "gloves", live(H)))) {
		if (truthy(rt.gv(f, "transfer_prints", (G = rt.fv(f, "gloves", live(H)))))) {
			ignoregloves = 1;
		}
		if (!truthy(live(ignoregloves))) {
			yield* g.callName(f, rt.fv(f, "gloves", live(H)), "add_fingerprint", [live(H), 1]);
			return live(f.dot);
		}
	}
	if (!truthy(rt.sv(f, "fingerprints"))) {
		rt.setSv(f, "fingerprints", rt.list());
	}
	full_print = (yield* g.call(f, P("/proc/md5"), null, [rt.gv(f, "uni_identity", rt.fv(f, "dna", live(H)))]));
	rt.setAt(rt.sv(f, "fingerprints"), live(full_print), live(full_print));
	return f.dot;
}, true);

// /atom/proc/transfer_fingerprints_to  (code/modules/detectivework/detective_work.dm:108)
rt.def("/atom/proc/transfer_fingerprints_to", function transfer_fingerprints_to(f: Frame, A: Value) {
	if (!truthy((rt.istype(rt.fv(f, "fingerprints", live(A)), T("/list")) ? 1 : 0))) {
		rt.setFv(f, "fingerprints", live(A), rt.list());
	}
	if (!truthy((rt.istype(rt.fv(f, "fingerprintshidden", live(A)), T("/list")) ? 1 : 0))) {
		rt.setFv(f, "fingerprintshidden", live(A), rt.list());
	}
	if (!truthy((rt.istype(rt.sv(f, "fingerprints"), T("/list")) ? 1 : 0))) {
		rt.setSv(f, "fingerprints", rt.list());
	}
	if (!truthy((rt.istype(rt.sv(f, "fingerprintshidden"), T("/list")) ? 1 : 0))) {
		rt.setSv(f, "fingerprintshidden", rt.list());
	}
	if (truthy(rt.sv(f, "fingerprints"))) {
		(rt.modField(f, live(A), "fingerprints", rt.callName(f, rt.sv(f, "fingerprints"), "Copy", []), rt.bitOr));
	}
	if (truthy(rt.sv(f, "fingerprintshidden"))) {
		(rt.modField(f, live(A), "fingerprintshidden", rt.callName(f, rt.sv(f, "fingerprintshidden"), "Copy", []), rt.bitOr));
	}
	rt.setFv(f, "fingerprintslast", live(A), rt.sv(f, "fingerprintslast"));
	return f.dot;
});
