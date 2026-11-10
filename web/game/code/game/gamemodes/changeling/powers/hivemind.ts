// Based on /tg/station's code/game/gamemodes/changeling/powers/hivemind.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


rt.type(11232, "/obj/effect/proc_holder/changeling/hivemind_comms", "/obj/effect/proc_holder/changeling", {
	helptext: "We will be able to talk with other changelings with :g. Exchanged DNA do not count towards absorb objectives.",
	dna_cost: 0,
	chemical_cost: -1,
	name: "Hivemind Communication",
	desc: "We tune our senses to the airwaves to allow us to discreetly communicate and exchange DNA with other changelings.",
});

// hivemind.dm:10
rt.def("/obj/effect/proc_holder/changeling/hivemind_comms/proc/on_purchase", function* on_purchase(f: Frame, user: Value, is_respec: Value) {
	let changeling: Value = null;
	yield* parent_proc();
	(changeling = user.mind.changeling).changeling_speak = 1;
	to_chat(user, "<i><font color=#800080>Use say \":g message\" to communicate with the other changelings.</font></i>");
	let S1: Value = (yield* new_(T("/obj/effect/proc_holder/changeling/hivemind_upload")));
	if (!changeling.has_sting(S1)) {
		changeling.purchasedpowers += S1;
	}
	let S2: Value = (yield* new_(T("/obj/effect/proc_holder/changeling/hivemind_download")));
	if (changeling.has_sting(S2)) return f.dot;
	changeling.purchasedpowers += S2;
	return f.dot;
}, true);

// hivemind.dm:22
rt.def("/datum/controller/global_vars/proc/InitGlobalhivemind_bank", function InitGlobalhivemind_bank(f: Frame) {
	GLOB.hivemind_bank = list();
	this.gvars_datum_init_order += "hivemind_bank";
	return f.dot;
});

rt.type(11233, "/obj/effect/proc_holder/changeling/hivemind_upload", "/obj/effect/proc_holder/changeling", {
	chemical_cost: 10,
	dna_cost: -1,
	name: "Hive Channel DNA",
	desc: "Allows us to channel DNA in the airwaves to allow other changelings to absorb it.",
});

// hivemind.dm:31
rt.def("/obj/effect/proc_holder/changeling/hivemind_upload/proc/sting_action", function* sting_action(f: Frame, user: Value) {
	let prof: Value = null, chosen_name: Value = null, chosen_dna: Value = null;
	let changeling: Value = user.mind.changeling;
	let names: Value = list();
	for (prof of each(changeling.stored_profiles, T("/datum/changelingprofile"))) {
		if (!rt.isIn(f, prof, GLOB.hivemind_bank)) {
			names += prof.name;
		}
	}
	if (rt.len(f, names) <= 0) {
		to_chat(user, "<span class='notice'>The airwaves already have all of our DNA.</span>");
		return f.dot;
	}
	if (!(chosen_name = (yield* g.op(f, "Prompt", [1], [null, null, "Channel DNA", "Select a DNA to channel: ", names])))) {
		return f.dot;
	}
	if (!(chosen_dna = changeling.get_dna(chosen_name))) {
		return f.dot;
	}
	let uploaded_dna: Value = (yield* new_(chosen_dna.type));
	yield* chosen_dna.copy_profile(uploaded_dna);
	GLOB.hivemind_bank += uploaded_dna;
	to_chat(user, `<span class='notice'>We channel the DNA of ${chosen_name} to the air.</span>`);
	return 1;
}, true);

rt.type(11234, "/obj/effect/proc_holder/changeling/hivemind_download", "/obj/effect/proc_holder/changeling", {
	chemical_cost: 10,
	dna_cost: -1,
	name: "Hive Absorb DNA",
	desc: "Allows us to absorb DNA that has been channeled to the airwaves. Does not count towards absorb objectives.",
});

// hivemind.dm:62
rt.def("/obj/effect/proc_holder/changeling/hivemind_download/proc/can_sting", function can_sting(f: Frame, user: Value) {
	let first_prof: Value = null;
	if (!parent_proc()) {
		return f.dot;
	}
	let changeling: Value = user.mind.changeling;
	if ((first_prof = rt.index(changeling.stored_profiles, 1)).name == user.real_name) {
		to_chat(user, "<span class='warning'>We have reached our capacity to store genetic information! We must transform before absorbing more.</span>");
		return f.dot;
	}
	return 1;
}, false);

// hivemind.dm:72
rt.def("/obj/effect/proc_holder/changeling/hivemind_download/proc/sting_action", function* sting_action(f: Frame, user: Value) {
	let prof: Value = null, S: Value = null, chosen_prof: Value = null;
	let changeling: Value = user.mind.changeling;
	let names: Value = list();
	for (prof of each(GLOB.hivemind_bank, T("/datum/changelingprofile"))) {
		if (!rt.isIn(f, prof, changeling.stored_profiles)) {
			rt.setAt(names, prof.name, prof);
		}
	}
	if (rt.len(f, names) <= 0) {
		to_chat(user, "<span class='notice'>There's no new DNA to absorb from the air.</span>");
		return f.dot;
	}
	if (!(S = (yield* g.op(f, "Prompt", [1], [null, null, "Absorb DNA", "Select a DNA absorb from the air: ", names])))) {
		return f.dot;
	}
	if (!(chosen_prof = rt.index(names, S))) {
		return f.dot;
	}
	let downloaded_prof: Value = (yield* new_(chosen_prof.type));
	yield* chosen_prof.copy_profile(downloaded_prof);
	changeling.add_profile(downloaded_prof);
	to_chat(user, `<span class='notice'>We absorb the DNA of ${S} from the air.</span>`);
	return 1;
}, true);
