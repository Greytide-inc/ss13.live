// Based on /tg/station's code/game/gamemodes/changeling/powers/fleshmend.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { P } = rt;


rt.type(11230, "/obj/effect/proc_holder/changeling/fleshmend", "/obj/effect/proc_holder/changeling", {
	recent_uses: 1,
	healing_ticks: 10,
	total_healing: 100,
	helptext: "Heals a moderate amount of damage over a short period of time. Can be used while unconscious. Does not regrow limbs or restore lost blood.",
	chemical_cost: 20,
	dna_cost: 2,
	req_stat: 1,
	name: "Fleshmend",
	desc: "Our flesh rapidly regenerates, healing our burns, bruises and shortness of breath. Effectiveness decreases with quick, repeated use.",
});

// fleshmend.dm:15
rt.def("/obj/effect/proc_holder/changeling/fleshmend/proc/Initialize", function Initialize(f: Frame) {
	f.dot = parent_proc();
	if (this.isprocessing) return f.dot;
	this.isprocessing = 1;
	GLOB.SSobj.processing += this;
	return f.dot;
});

// fleshmend.dm:19
rt.def("/obj/effect/proc_holder/changeling/fleshmend/proc/Destroy", function* Destroy(f: Frame) {
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	return (yield* parent_proc());
}, true);

// fleshmend.dm:23
rt.def("/obj/effect/proc_holder/changeling/fleshmend/proc/process", function process(f: Frame) {
	if (!(this.recent_uses > 1)) return f.dot;
	this.recent_uses = max(1, this.recent_uses - 1 / this.healing_ticks);
	return f.dot;
}, false, { waitfor: false });

// fleshmend.dm:29
rt.def("/obj/effect/proc_holder/changeling/fleshmend/proc/sting_action", function sting_action(f: Frame, user: Value) {
	to_chat(user, "<span class='notice'>We begin to heal rapidly.</span>");
	if (this.recent_uses > 1) {
		to_chat(user, "<span class='warning'>Our healing's effectiveness is reduced by quick repeated use!</span>");
	}
	this.recent_uses++;
	ImmediateInvokeAsync(this, P("/obj/effect/proc_holder/changeling/fleshmend/proc/fleshmend"), user);
	return 1;
});

// fleshmend.dm:43
rt.def("/obj/effect/proc_holder/changeling/fleshmend/proc/fleshmend", function* fleshmend(f: Frame, user: Value) {
	let i: Value = null, healpertick: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, this.healing_ticks, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (user) {
			healpertick = -(this.total_healing / this.healing_ticks);
			yield* user.adjustBruteLoss(healpertick / this.recent_uses, 0);
			yield* user.adjustOxyLoss(healpertick / this.recent_uses, 0);
			yield* user.adjustFireLoss(healpertick / this.recent_uses, 0);
			yield* user.updatehealth();
		} else {
			break;
		}
		yield* sleep(10);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob/living" }] });
