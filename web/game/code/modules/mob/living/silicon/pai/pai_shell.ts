// Based on /tg/station's code/modules/mob/living/silicon/pai/pai_shell.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g } = rt;


// pai_shell.dm:3
rt.def("/mob/living/silicon/pai/proc/fold_out", function* fold_out(f: Frame, force: Value) {
	let _P: Value = null, L: Value = null;
	force ??= 0;
	if (this.emitterhealth < 0) {
		to_chat(this, "<span class='warning'>Your holochassis emitters are still too unstable! Please wait for automatic repair.</span>");
		return 0;
	}
	if (!this.canholo && !force) {
		to_chat(this, "<span class='warning'>Your master or another force has disabled your holochassis emitters!</span>");
		return 0;
	}
	if (this.holoform) {
		f.dot = (yield* this.fold_in(force));
		return f.dot;
	}
	if (this.emittersemicd) {
		to_chat(this, "<span class='warning'>Error: Holochassis emitters recycling. Please try again later.</span>");
		return 0;
	}
	this.emittersemicd = 1;
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/mob/living/silicon/pai/proc/emittercool"))), this.emittercd);
	this.canmove = 1;
	this.density = 1;
	if (rt.istype(this.card.loc, T("/obj/item/device/pda"))) {
		(_P = this.card.loc).pai = null;
		_P.visible_message(`<span class='notice'>${this} ejects itself from ${_P}!</span>`);
	}
	if (rt.istype(this.card.loc, T("/mob/living"))) {
		if (!(yield* (L = this.card.loc).temporarilyRemoveItemFromInventory(this.card))) {
			to_chat(this, "<span class='warning'>Error: Unable to expand to mobile form. Chassis is restrained by some device or person.</span>");
			return 0;
		}
	}
	yield* this.forceMove(rt.getStep(f, this.card, 0));
	yield* this.card.forceMove(this);
	if (this.client) {
		this.client.perspective = 1;
		this.client.eye = this;
	}
	this.set_light(0);
	this.icon_state = `${this.chassis}`;
	this.visible_message(`<span class='boldnotice'>${this} folds out its holochassis emitter and forms a holoshell around itself!</span>`);
	this.holoform = 1;
	return f.dot;
}, true);

// pai_shell.dm:47
rt.def("/mob/living/silicon/pai/proc/fold_in", function* fold_in(f: Frame, force: Value) {
	force ??= 0;
	this.emittersemicd = 1;
	if (!force) {
		yield* addtimer((yield* new_(T("/datum/callback"), this, P("/mob/living/silicon/pai/proc/emittercool"))), this.emittercd);
	} else {
		yield* addtimer((yield* new_(T("/datum/callback"), this, P("/mob/living/silicon/pai/proc/emittercool"))), this.emitteroverloadcd);
	}
	this.icon_state = `${this.chassis}`;
	if (!this.holoform) {
		f.dot = (yield* this.fold_out(force));
		return f.dot;
	}
	this.visible_message(`<span class='notice'>${this} deactivates its holochassis emitter and folds back into a compact card!</span>`);
	yield* this.stop_pulling();
	if (this.client) {
		this.client.perspective = 1;
		this.client.eye = this.card;
	}
	let _T: Value = rt.getStep(f, this, 0);
	yield* this.card.forceMove(_T);
	yield* this.forceMove(this.card);
	this.canmove = 0;
	this.density = 0;
	this.set_light(0);
	this.holoform = 0;
	if (!this.resting) return f.dot;
	yield* this.lay_down();
	return f.dot;
}, true);

// pai_shell.dm:71
rt.def("/mob/living/silicon/pai/proc/choose_chassis", function* choose_chassis(f: Frame) {
	let choice: Value = null;
	if (!(choice = (yield* g.op(f, "Prompt", [1], [null, null, "What would you like to use for your holochassis composite?", this, this.possible_chassis])))) {
		return 0;
	}
	this.chassis = choice;
	this.icon_state = `${this.chassis}`;
	if (this.resting) {
		this.icon_state = `${this.chassis}_rest`;
	}
	to_chat(this, `<span class='boldnotice'>You switch your holochassis projection composite to ${this.chassis}</span>`);
	return f.dot;
}, true);

// pai_shell.dm:81
rt.def("/mob/living/silicon/pai/proc/lay_down", function* lay_down(f: Frame) {
	yield* parent_proc();
	this.update_resting_icon(this.resting);
	return f.dot;
}, true);

// pai_shell.dm:86
rt.def("/mob/living/silicon/pai/proc/update_resting_icon", function update_resting_icon(f: Frame, rest: Value) {
	let $1: any;
	if (rest) {
		this.icon_state = `${this.chassis}_rest`;
	} else {
		this.icon_state = `${this.chassis}`;
	}
	if (this.loc == this.card) return f.dot;
	let $0: any = this;
	if (rest) {
		$1 = "lays down for a moment...";
	} else {
		$1 = "perks up from the ground";
	}
	this.visible_message(`<span class='notice'>${$0} ${$1}</span>`);
	return f.dot;
});

// pai_shell.dm:96
rt.def("/mob/living/silicon/pai/proc/toggle_integrated_light", function toggle_integrated_light(f: Frame) {
	if (!this.luminosity) {
		this.set_light(this.brightness_power);
		to_chat(this, "<span class='notice'>You enable your integrated light.</span>");
	} else {
		this.set_light(0);
		to_chat(this, "<span class='notice'>You disable your integrated light.</span>");
	}
	return f.dot;
});

// pai_shell.dm:104
rt.def("/mob/living/silicon/pai/proc/movement_delay", function movement_delay(f: Frame) {
	f.dot = parent_proc();
	f.dot += 1;
	return f.dot;
});
