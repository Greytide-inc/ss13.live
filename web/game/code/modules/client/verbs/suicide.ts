// Based on /tg/station's code/modules/client/verbs/suicide.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { g } = rt;


// suicide.dm:5
rt.def("/mob/living/carbon/human/verb/suicide", function* suicide(f: Frame) {
	let held_item: Value = null, damagetype: Value = null, damage_mod: Value = null, _T: Value = null, suicide_message: Value = null;
	let $e: any;
	if (!this.canSuicide()) {
		return f.dot;
	}
	let oldkey: Value = this.ckey;
	let confirm: Value = (yield* alert("Are you sure you want to commit suicide?", "Confirm Suicide", "Yes", "No"));
	if (this.ckey != oldkey) {
		return f.dot;
	}
	if (!this.canSuicide()) {
		return f.dot;
	}
	if (confirm != "Yes") return f.dot;
	this.suiciding = 1;
	let $0: any = key_name(this);
	log_game(`${$0} (job: ${this.job ? `${this.job}` : "None"}) committed suicide at ${get_area(this)}.`);
	if (held_item = this.get_active_held_item()) {
		if (damagetype = (yield* held_item.suicide_act(this))) {
			if (rt.bitAnd(damagetype, 16)) {
				yield* this.adjustStaminaLoss(200);
				this.suiciding = 0;
				return f.dot;
			}
			damage_mod = 0;
			for (_T of each(list(1, 2, 4, 8))) {
				damage_mod += rt.bitAnd(_T, damagetype) ? 1 : 0;
			}
			damage_mod = max(1, damage_mod);
			if (rt.bitAnd(damagetype, 1)) {
				yield* this.adjustBruteLoss(200 / damage_mod);
			}
			if (rt.bitAnd(damagetype, 2)) {
				yield* this.adjustFireLoss(200 / damage_mod);
			}
			if (rt.bitAnd(damagetype, 4)) {
				yield* this.adjustToxLoss(200 / damage_mod);
			}
			if (rt.bitAnd(damagetype, 8)) {
				yield* this.adjustOxyLoss(200 / damage_mod);
			}
			if (!rt.bitAnd(damagetype, 15)) {
				yield* this.adjustOxyLoss(max(200 - this.getToxLoss() - this.getFireLoss() - this.getBruteLoss() - this.getOxyLoss(), 0));
			}
			yield* this.death(0);
			return f.dot;
		}
	}
	this.visible_message(`<span class='danger'>${(suicide_message = pick(`${this} is attempting to bite ${this.p_their()} tongue off! It looks like ${this.p_theyre()} trying to commit suicide.`, `${this} is jamming ${this.p_their()} thumbs into ${this.p_their()} eye sockets! It looks like ${this.p_theyre()} trying to commit suicide.`, `${this} is twisting ${this.p_their()} own neck! It looks like ${this.p_theyre()} trying to commit suicide.`, `${this} is holding ${this.p_their()} breath! It looks like ${this.p_theyre()} trying to commit suicide.`))}</span>`, `<span class='userdanger'>${suicide_message}</span>`);
	yield* this.adjustOxyLoss(max(200 - this.getToxLoss() - this.getFireLoss() - this.getBruteLoss() - this.getOxyLoss(), 0));
	yield* this.death(0);
	return f.dot;
}, true, { hidden: true });

// suicide.dm:61
rt.def("/mob/living/brain/verb/suicide", function* suicide(f: Frame) {
	if (!this.canSuicide()) {
		return f.dot;
	}
	let confirm: Value = (yield* alert("Are you sure you want to commit suicide?", "Confirm Suicide", "Yes", "No"));
	if (!this.canSuicide()) {
		return f.dot;
	}
	if (confirm != "Yes") return f.dot;
	this.suiciding = 1;
	this.visible_message(`<span class='danger'>${this}'s brain is growing dull and lifeless. ${this.p_they(1)} look${this.p_s()} like ${this.p_theyve()} lost the will to live.</span>`, `<span class='userdanger'>${this}'s brain is growing dull and lifeless. ${this.p_they(1)} look${this.p_s()} like ${this.p_theyve()} lost the will to live.</span>`);
	yield* this.death(0);
	return f.dot;
}, true, { hidden: true });

// suicide.dm:74
rt.def("/mob/living/carbon/monkey/verb/suicide", function* suicide(f: Frame) {
	if (!this.canSuicide()) {
		return f.dot;
	}
	let confirm: Value = (yield* alert("Are you sure you want to commit suicide?", "Confirm Suicide", "Yes", "No"));
	if (!this.canSuicide()) {
		return f.dot;
	}
	if (confirm != "Yes") return f.dot;
	this.suiciding = 1;
	this.visible_message(`<span class='danger'>${this} is attempting to bite ${this.p_their()} tongue. It looks like ${this.p_theyre()} trying to commit suicide.</span>`, `<span class='userdanger'>${this} is attempting to bite ${this.p_their()} tongue. It looks like ${this.p_theyre()} trying to commit suicide.</span>`);
	yield* this.adjustOxyLoss(max(200 - this.getToxLoss() - this.getFireLoss() - this.getBruteLoss() - this.getOxyLoss(), 0));
	yield* this.death(0);
	return f.dot;
}, true, { hidden: true });

// suicide.dm:88
rt.def("/mob/living/silicon/ai/verb/suicide", function* suicide(f: Frame) {
	if (!this.canSuicide()) {
		return f.dot;
	}
	let confirm: Value = (yield* alert("Are you sure you want to commit suicide?", "Confirm Suicide", "Yes", "No"));
	if (!this.canSuicide()) {
		return f.dot;
	}
	if (confirm != "Yes") return f.dot;
	this.suiciding = 1;
	this.visible_message(`<span class='danger'>${this} is powering down. It looks like ${this.p_theyre()} trying to commit suicide.</span>`, `<span class='userdanger'>${this} is powering down. It looks like ${this.p_theyre()} trying to commit suicide.</span>`);
	yield* this.adjustOxyLoss(max(this.maxHealth * 2 - this.getToxLoss() - this.getFireLoss() - this.getBruteLoss() - this.getOxyLoss(), 0));
	yield* this.death(0);
	return f.dot;
}, true, { hidden: true });

// suicide.dm:103
rt.def("/mob/living/silicon/robot/verb/suicide", function* suicide(f: Frame) {
	if (!this.canSuicide()) {
		return f.dot;
	}
	let confirm: Value = (yield* alert("Are you sure you want to commit suicide?", "Confirm Suicide", "Yes", "No"));
	if (!this.canSuicide()) {
		return f.dot;
	}
	if (confirm != "Yes") return f.dot;
	this.suiciding = 1;
	this.visible_message(`<span class='danger'>${this} is powering down. It looks like ${this.p_theyre()} trying to commit suicide.</span>`, `<span class='userdanger'>${this} is powering down. It looks like ${this.p_theyre()} trying to commit suicide.</span>`);
	yield* this.adjustOxyLoss(max(this.maxHealth * 2 - this.getToxLoss() - this.getFireLoss() - this.getBruteLoss() - this.getOxyLoss(), 0));
	yield* this.death(0);
	return f.dot;
}, true, { hidden: true });

// suicide.dm:120
rt.def("/mob/living/silicon/pai/verb/suicide", function* suicide(f: Frame) {
	let answer: Value = null, _T: Value = null;
	if ((answer = (yield* g.op(f, "Prompt", [0], [null, "No", "Suicide", "REALLY kill yourself? This action can't be undone.", list("Yes", "No")]))) == "Yes") {
		(_T = rt.getStep(f, this.loc, 0)).visible_message(`<span class='notice'>${this} flashes a message across its screen, "Wiping core files. Please acquire a new personality to continue using pAI device functions."</span>`, null, `<span class='notice'>${this} bleeps electronically.</span>`);
		yield* this.death(0);
	} else {
		to_chat(this, "Aborting suicide attempt.");
	}
	return f.dot;
}, true, { verb: { name: "pAI Suicide", category: "pAI Commands", desc: "Kill yourself and become a ghost (You will receive a confirmation prompt)" } });

// suicide.dm:131
rt.def("/mob/living/carbon/alien/humanoid/verb/suicide", function* suicide(f: Frame) {
	if (!this.canSuicide()) {
		return f.dot;
	}
	let confirm: Value = (yield* alert("Are you sure you want to commit suicide?", "Confirm Suicide", "Yes", "No"));
	if (!this.canSuicide()) {
		return f.dot;
	}
	if (confirm != "Yes") return f.dot;
	this.suiciding = 1;
	this.visible_message(`<span class='danger'>${this} is thrashing wildly! It looks like ${this.p_theyre()} trying to commit suicide.</span>`, `<span class='userdanger'>${this} is thrashing wildly! It looks like ${this.p_theyre()} trying to commit suicide.</span>`, "<span class='italics'>You hear thrashing.</span>");
	yield* this.adjustOxyLoss(max(200 - this.getFireLoss() - this.getBruteLoss() - this.getOxyLoss(), 0));
	yield* this.death(0);
	return f.dot;
}, true, { hidden: true });

// suicide.dm:147
rt.def("/mob/living/simple_animal/verb/suicide", function* suicide(f: Frame) {
	if (!this.canSuicide()) {
		return f.dot;
	}
	let confirm: Value = (yield* alert("Are you sure you want to commit suicide?", "Confirm Suicide", "Yes", "No"));
	if (!this.canSuicide()) {
		return f.dot;
	}
	if (confirm != "Yes") return f.dot;
	this.suiciding = 1;
	this.visible_message(`<span class='danger'>${this} begins to fall down. It looks like ${this.p_theyve()} lost the will to live.</span>`, `<span class='userdanger'>${this} begins to fall down. It looks like ${this.p_theyve()} lost the will to live.</span>`);
	yield* this.death(0);
	return f.dot;
}, true, { hidden: true });

// suicide.dm:160
rt.def("/mob/living/proc/canSuicide", function canSuicide(f: Frame) {
	if (this.stat == 0) {
		return 1;
	} else if (this.stat == 2) {
		to_chat(this, "You're already dead!");
	} else if (this.stat == 1) {
		to_chat(this, "You need to be conscious to suicide!");
	}
	return f.dot;
});

// suicide.dm:169
rt.def("/mob/living/carbon/proc/canSuicide", function canSuicide(f: Frame) {
	if (!parent_proc()) {
		return f.dot;
	}
	if (!this.canmove || this.restrained()) {
		to_chat(this, "You can't commit suicide whilst restrained! ((You can type Ghost instead however.))");
		return f.dot;
	}
	return 1;
});
