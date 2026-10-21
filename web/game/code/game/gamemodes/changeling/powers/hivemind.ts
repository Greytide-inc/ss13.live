// From code/game/gamemodes/changeling/powers/hivemind.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11232, "/obj/effect/proc_holder/changeling/hivemind_comms", "/obj/effect/proc_holder/changeling", {
	helptext: "We will be able to talk with other changelings with :g. Exchanged DNA do not count towards absorb objectives.",
	dna_cost: 0,
	chemical_cost: -1,
	name: "Hivemind Communication",
	desc: "We tune our senses to the airwaves to allow us to discreetly communicate and exchange DNA with other changelings.",
});

// /obj/effect/proc_holder/changeling/hivemind_comms/proc/on_purchase  (code/game/gamemodes/changeling/powers/hivemind.dm:10)  may sleep
rt.def("/obj/effect/proc_holder/changeling/hivemind_comms/proc/on_purchase", function* on_purchase(f: Frame) {
	let changeling: Value = null, S1: Value = null, S2: Value = null;
	f.vars = () => [changeling, S1, S2];
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setFv(f, "changeling_speak", (changeling = rt.gv(f, "changeling", rt.fv(f, "mind", live(f.args[0])))), 1);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<i><font color=#800080>Use say \":g message\" to communicate with the other changelings.</font></i>"]);
	S1 = (yield* g.new_(f, T("/obj/effect/proc_holder/changeling/hivemind_upload"), []));
	if (!truthy((yield* g.callName(f, live(changeling), "has_sting", [live(S1)])))) {
		rt.modField(f, live(changeling), "purchasedpowers", live(S1), add);
	}
	S2 = (yield* g.new_(f, T("/obj/effect/proc_holder/changeling/hivemind_download"), []));
	if (truthy((yield* g.callName(f, live(changeling), "has_sting", [live(S2)])))) return f.dot;
	rt.modField(f, live(changeling), "purchasedpowers", live(S2), add);
	return f.dot;
}, true, { args: ["user", "is_respec"] });

// /datum/controller/global_vars/proc/InitGlobalhivemind_bank  (code/game/gamemodes/changeling/powers/hivemind.dm:22)
rt.def("/datum/controller/global_vars/proc/InitGlobalhivemind_bank", function InitGlobalhivemind_bank(f: Frame) {
	rt.setGl("hivemind_bank", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "hivemind_bank", add);
	return f.dot;
});

rt.type(11233, "/obj/effect/proc_holder/changeling/hivemind_upload", "/obj/effect/proc_holder/changeling", {
	chemical_cost: 10,
	dna_cost: -1,
	name: "Hive Channel DNA",
	desc: "Allows us to channel DNA in the airwaves to allow other changelings to absorb it.",
});

// /obj/effect/proc_holder/changeling/hivemind_upload/proc/sting_action  (code/game/gamemodes/changeling/powers/hivemind.dm:31)  may sleep
rt.def("/obj/effect/proc_holder/changeling/hivemind_upload/proc/sting_action", function* sting_action(f: Frame, user: Value) {
	let changeling: Value = null, names: Value = null, prof: Value = null, chosen_name: Value = null, chosen_dna: Value = null, uploaded_dna: Value = null;
	let $e: any;
	f.vars = () => [user, changeling, names, prof, chosen_name, chosen_dna, uploaded_dna, $e];
	changeling = rt.gv(f, "changeling", rt.fv(f, "mind", live(user)));
	names = rt.list();
	prof = null;
	rt.forList(f, 0, rt.fv(f, "stored_profiles", live(changeling)), T("/datum/changelingprofile"));
	while (($e = rt.next(f, 0)) !== undefined) {
		prof = $e;
		if (!truthy((rt.isIn(f, live(prof), rt.gl("hivemind_bank")) ? 1 : 0))) {
			names = rt.modify(live(names), rt.fv(f, "name", live(prof)), add);
		}
	}
	rt.endFor(f, 0);
	if (rt.le(rt.len(f, live(names)), 0)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>The airwaves already have all of our DNA.</span>"]);
		return live(f.dot);
	}
	if (!truthy((chosen_name = (yield* g.op(f, "Prompt", [1], [null, null, "Channel DNA", "Select a DNA to channel: ", live(names)]))))) {
		return live(f.dot);
	}
	if (!truthy((chosen_dna = (yield* g.callName(f, live(changeling), "get_dna", [live(chosen_name)]))))) {
		return live(f.dot);
	}
	uploaded_dna = (yield* g.new_(f, rt.fv(f, "type", live(chosen_dna)), []));
	yield* g.callName(f, live(chosen_dna), "copy_profile", [live(uploaded_dna)]);
	rt.modGl("hivemind_bank", live(uploaded_dna), add);
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>We channel the DNA of ＀ to the air.</span>", [live(chosen_name)])]);
	return 1;
}, true);

rt.type(11234, "/obj/effect/proc_holder/changeling/hivemind_download", "/obj/effect/proc_holder/changeling", {
	chemical_cost: 10,
	dna_cost: -1,
	name: "Hive Absorb DNA",
	desc: "Allows us to absorb DNA that has been channeled to the airwaves. Does not count towards absorb objectives.",
});

// /obj/effect/proc_holder/changeling/hivemind_download/proc/can_sting  (code/game/gamemodes/changeling/powers/hivemind.dm:62)
rt.def("/obj/effect/proc_holder/changeling/hivemind_download/proc/can_sting", function can_sting(f: Frame) {
	let changeling: Value = null, first_prof: Value = null;
	f.vars = () => [changeling, first_prof];
	if (!truthy(rt.callSuper(f, [], rt.Args.Same))) {
		return live(f.dot);
	}
	changeling = rt.gv(f, "changeling", rt.fv(f, "mind", live(f.args[0])));
	if (isEqual(rt.gv(f, "name", (first_prof = rt.index(rt.fv(f, "stored_profiles", live(changeling)), 1))), rt.fv(f, "real_name", live(f.args[0])))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>We have reached our capacity to store genetic information! We must transform before absorbing more.</span>"]);
		return live(f.dot);
	}
	return 1;
}, false, { args: ["user"] });

// /obj/effect/proc_holder/changeling/hivemind_download/proc/sting_action  (code/game/gamemodes/changeling/powers/hivemind.dm:72)  may sleep
rt.def("/obj/effect/proc_holder/changeling/hivemind_download/proc/sting_action", function* sting_action(f: Frame, user: Value) {
	let changeling: Value = null, names: Value = null, prof: Value = null, S: Value = null, chosen_prof: Value = null, downloaded_prof: Value = null;
	let $e: any;
	f.vars = () => [user, changeling, names, prof, S, chosen_prof, downloaded_prof, $e];
	changeling = rt.gv(f, "changeling", rt.fv(f, "mind", live(user)));
	names = rt.list();
	prof = null;
	rt.forList(f, 0, rt.gl("hivemind_bank"), T("/datum/changelingprofile"));
	while (($e = rt.next(f, 0)) !== undefined) {
		prof = $e;
		if (!truthy((rt.isIn(f, live(prof), rt.fv(f, "stored_profiles", live(changeling))) ? 1 : 0))) {
			rt.setAt(live(names), rt.fv(f, "name", live(prof)), live(prof));
		}
	}
	rt.endFor(f, 0);
	if (rt.le(rt.len(f, live(names)), 0)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>There's no new DNA to absorb from the air.</span>"]);
		return live(f.dot);
	}
	if (!truthy((S = (yield* g.op(f, "Prompt", [1], [null, null, "Absorb DNA", "Select a DNA absorb from the air: ", live(names)]))))) {
		return live(f.dot);
	}
	if (!truthy((chosen_prof = rt.index(live(names), live(S))))) {
		return live(f.dot);
	}
	downloaded_prof = (yield* g.new_(f, rt.fv(f, "type", live(chosen_prof)), []));
	yield* g.callName(f, live(chosen_prof), "copy_profile", [live(downloaded_prof)]);
	yield* g.callName(f, live(changeling), "add_profile", [live(downloaded_prof)]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>We absorb the DNA of ＀ from the air.</span>", [live(S)])]);
	return 1;
}, true);
