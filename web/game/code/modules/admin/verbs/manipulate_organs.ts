// Based on /tg/station's code/modules/admin/verbs/manipulate_organs.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


// manipulate_organs.dm:4
rt.def("/client/proc/manipulate_organs", function* manipulate_organs(f: Frame, C: Value) {
	let path: Value = null, dat: Value = null, organ: Value = null, X: Value = null, I: Value = null, O: Value = null, I_4: Value = null, _case: Value = null;
	let $e: any;
	let operation: Value = (yield* g.op(f, "Prompt", [0], [null, "cancel", "Organ Manipulation", "Select organ operation.", list("add organ", "add implant", "drop organ/implant", "remove organ/implant", "cancel")]));
	let organs: Value = list();
	if (operation === "add organ") {
		for (path of each(typesof(T("/obj/item/organ")) - T("/obj/item/organ"))) {
			dat = replacetext(`${path}`, "/obj/item/organ/", ":");
			rt.setAt(organs, dat, path);
		}
		organ = (yield* g.op(f, "Prompt", [0], [null, null, "Organ Manipulation", "Select organ type:", organs]));
		organ = rt.index(organs, organ);
		yield* (organ = (yield* new_(organ))).Insert(C);
	} else if (operation === "add implant") {
		path = null;
		for (path of each(typesof(T("/obj/item/weapon/implant")) - T("/obj/item/weapon/implant"))) {
			dat = replacetext(`${path}`, "/obj/item/weapon/implant/", ":");
			rt.setAt(organs, dat, path);
		}
		organ = (yield* g.op(f, "Prompt", [0], [null, null, "Organ Manipulation", "Select implant type:", organs]));
		organ = rt.index(organs, organ);
		yield* (organ = (yield* new_(organ))).implant(C);
	} else if (operation === "drop organ/implant" || operation === "remove organ/implant") {
		for (X of each(C.internal_organs)) {
			I = X;
			rt.setAt(organs, `${I.name} (${I.type})`, I);
		}
		X = null;
		for (X of each(C.implants)) {
			I = X;
			rt.setAt(organs, `${I.name} (${I.type})`, I);
		}
		organ = (yield* g.op(f, "Prompt", [0], [null, null, "Organ Manipulation", "Select organ/implant:", organs]));
		if (!(organ = rt.index(organs, organ))) {
			return f.dot;
		}
		if (rt.istype(organ, T("/obj/item/organ"))) {
			yield* (O = organ).Remove(C);
		} else {
			yield* (I_4 = organ).removed(C);
		}
		yield* organ.forceMove(rt.getStep(f, C, 0));
		if (operation == "remove organ/implant") {
			yield* qdel(organ);
		} else {
			if (!I_4) return f.dot;
			(_case = (yield* new_(T("/obj/item/weapon/implantcase"), rt.getStep(f, C, 0)))).imp = I_4;
			I_4.loc = _case;
			yield* _case.update_icon();
		}
	}
	return f.dot;
}, true, { verb: { name: "Manipulate Organs", category: "Debug" }, argTypes: [{ type: 8, path: "/mob/living/carbon", source: "world" }] });
