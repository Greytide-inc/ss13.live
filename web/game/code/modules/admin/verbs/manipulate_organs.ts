// From code/modules/admin/verbs/manipulate_organs.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /client/proc/manipulate_organs  (code/modules/admin/verbs/manipulate_organs.dm:4)  may sleep
rt.def("/client/proc/manipulate_organs", function* manipulate_organs(f: Frame, C: Value) {
	let operation: Value = null, organs: Value = null, path: Value = null, dat: Value = null, organ: Value = null, X: Value = null, I: Value = null, O: Value = null, I_4: Value = null, _case: Value = null;
	let $0: any, $e: any;
	f.vars = () => [C, operation, organs, path, dat, organ, X, I, O, I_4, _case, $0, $e];
	operation = (yield* g.op(f, "Prompt", [0], [null, "cancel", "Organ Manipulation", "Select organ operation.", rt.list("add organ", "add implant", "drop organ/implant", "remove organ/implant", "cancel")]));
	organs = rt.list();
	$0 = live(operation);
	if ($0 === "add organ") {
		path = null;
		rt.forList(f, 0, subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/obj/item/organ")])), T("/obj/item/organ")));
		while (($e = rt.next(f, 0)) !== undefined) {
			path = $e;
			dat = (yield* g.call(f, P("/proc/replacetext"), null, [fmt("＀", [live(path)]), "/obj/item/organ/", ":"]));
			rt.setAt(live(organs), live(dat), live(path));
		}
		rt.endFor(f, 0);
		organ = (yield* g.op(f, "Prompt", [0], [null, null, "Organ Manipulation", "Select organ type:", live(organs)]));
		organ = rt.index(live(organs), live(organ));
		yield* g.callName(f, (organ = (yield* g.new_(f, live(organ), []))), "Insert", [live(C)]);
	} else if ($0 === "add implant") {
		path = null;
		rt.forList(f, 0, subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/obj/item/weapon/implant")])), T("/obj/item/weapon/implant")));
		while (($e = rt.next(f, 0)) !== undefined) {
			path = $e;
			dat = (yield* g.call(f, P("/proc/replacetext"), null, [fmt("＀", [live(path)]), "/obj/item/weapon/implant/", ":"]));
			rt.setAt(live(organs), live(dat), live(path));
		}
		rt.endFor(f, 0);
		organ = (yield* g.op(f, "Prompt", [0], [null, null, "Organ Manipulation", "Select implant type:", live(organs)]));
		organ = rt.index(live(organs), live(organ));
		yield* g.callName(f, (organ = (yield* g.new_(f, live(organ), []))), "implant", [live(C)]);
	} else if ($0 === "drop organ/implant" || $0 === "remove organ/implant") {
		X = null;
		rt.forList(f, 0, rt.fv(f, "internal_organs", live(C)));
		while (($e = rt.next(f, 0)) !== undefined) {
			X = $e;
			I = live(X);
			rt.setAt(live(organs), fmt("＀ (＀)", [rt.fv(f, "name", live(I)), rt.fv(f, "type", live(I))]), live(I));
		}
		rt.endFor(f, 0);
		X = null;
		rt.forList(f, 0, rt.fv(f, "implants", live(C)));
		while (($e = rt.next(f, 0)) !== undefined) {
			X = $e;
			I = live(X);
			rt.setAt(live(organs), fmt("＀ (＀)", [rt.fv(f, "name", live(I)), rt.fv(f, "type", live(I))]), live(I));
		}
		rt.endFor(f, 0);
		organ = (yield* g.op(f, "Prompt", [0], [null, null, "Organ Manipulation", "Select organ/implant:", live(organs)]));
		if (!truthy((organ = rt.index(live(organs), live(organ))))) {
			return live(f.dot);
		}
		O = null;
		I_4 = null;
		if (truthy((rt.istype(live(organ), T("/obj/item/organ")) ? 1 : 0))) {
			yield* g.callName(f, (O = live(organ)), "Remove", [live(C)]);
		} else {
			yield* g.callName(f, (I_4 = live(organ)), "removed", [live(C)]);
		}
		yield* g.callName(f, live(organ), "forceMove", [rt.getStep(f, live(C), 0)]);
		if (isEqual(live(operation), "remove organ/implant")) {
			yield* g.call(f, P("/proc/qdel"), null, [live(organ)]);
		} else {
			if (!truthy(live(I_4))) return f.dot;
			rt.setFv(f, "imp", (_case = (yield* g.new_(f, T("/obj/item/weapon/implantcase"), [rt.getStep(f, live(C), 0)]))), live(I_4));
			rt.setFv(f, "loc", live(I_4), live(_case));
			yield* g.callName(f, live(_case), "update_icon", []);
		}
	}
	return f.dot;
}, true, { verb: { name: "Manipulate Organs", category: "Debug" }, argTypes: [{ type: 8, path: "/mob/living/carbon", source: "world" }] });
