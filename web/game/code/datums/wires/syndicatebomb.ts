// Based on /tg/station's code/datums/wires/syndicatebomb.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(1076, "/datum/wires/syndicatebomb", "/datum/wires", {
	holder_type: rt.typePath("/obj/machinery/syndicatebomb"),
	randomize: 1,
});

// syndicatebomb.dm:10
rt.def("/datum/wires/syndicatebomb/proc/New", function New(f: Frame, holder: Value) {
	this.wires = list("Boom", "Unbolt", "Activate", "Delay", "Proceed");
	parent_proc();
	return f.dot;
}, false);

// syndicatebomb.dm:13
rt.def("/datum/wires/syndicatebomb/proc/interactable", function interactable(f: Frame, user: Value) {
	let _P: Value = null;
	if (!(_P = this.holder).open_panel) return f.dot;
	return 1;
});

// syndicatebomb.dm:18
rt.def("/datum/wires/syndicatebomb/proc/on_pulse", function on_pulse(f: Frame, wire: Value) {
	let seconds: Value = null;
	let B: Value = this.holder;
	if (wire === "Boom") {
		if (B.active) {
			this.holder.visible_message(`<span class='danger'>${bicon(B)} An alarm sounds! It's go-</span>`);
			B.explode_now = 1;
			this.tell_admins(B);
		}
	} else if (wire === "Unbolt") {
		this.holder.visible_message(`<span class='notice'>${bicon(B)} The bolts spin in place for a moment.</span>`);
	} else if (wire === "Delay") {
		if (B.delayedbig) {
			this.holder.visible_message(`<span class='notice'>${bicon(B)} The bomb has already been delayed.</span>`);
		} else {
			this.holder.visible_message(`<span class='notice'>${bicon(B)} The bomb chirps.</span>`);
			playsound(B, rt.rsc("sound/machines/chime.ogg"), 30, 1);
			B.detonation_timer += 300;
			B.delayedbig = 1;
		}
	} else if (wire === "Proceed") {
		this.holder.visible_message(`<span class='danger'>${bicon(B)} The bomb buzzes ominously!</span>`);
		playsound(B, rt.rsc("sound/machines/buzz-sigh.ogg"), 30, 1);
		if ((seconds = B.seconds_remaining()) >= 61) {
			B.detonation_timer = rt.worldTime(f) + 600;
		} else if (seconds >= 21) {
			B.detonation_timer -= 100;
		} else if (seconds >= 11) {
			B.detonation_timer = rt.worldTime(f) + 100;
		}
	} else if (wire === "Activate") {
		if (!B.active && !B.defused) {
			this.holder.visible_message(`<span class='danger'>${bicon(B)} You hear the bomb start ticking!</span>`);
			B.activate();
			B.update_icon();
		} else if (B.delayedlittle) {
			this.holder.visible_message(`<span class='notice'>${bicon(B)} Nothing happens.</span>`);
		} else {
			this.holder.visible_message(`<span class='notice'>${bicon(B)} The bomb seems to hesitate for a moment.</span>`);
			B.detonation_timer += 100;
			B.delayedlittle = 1;
		}
	}
	return f.dot;
});

// syndicatebomb.dm:58
rt.def("/datum/wires/syndicatebomb/proc/on_cut", function on_cut(f: Frame, wire: Value, mend: Value) {
	let B: Value = this.holder;
	if (wire === "Boom") {
		if (mend) {
			B.defused = 0;
		} else if (B.active) {
			this.holder.visible_message(`<span class='danger'>${bicon(B)} An alarm sounds! It's go-</span>`);
			B.explode_now = 1;
			this.tell_admins(B);
		} else {
			B.defused = 1;
		}
	} else if (wire === "Unbolt") {
		if (!mend && B.anchored) {
			this.holder.visible_message(`<span class='notice'>${bicon(B)} The bolts lift out of the ground!</span>`);
			playsound(B, rt.rsc("sound/effects/stealthoff.ogg"), 30, 1);
			B.anchored = 0;
		}
	} else if (wire === "Proceed") {
		if (!mend && B.active) {
			this.holder.visible_message(`<span class='danger'>${bicon(B)} An alarm sounds! It's go-</span>`);
			B.explode_now = 1;
			this.tell_admins(B);
		}
	} else if (wire === "Activate") {
		if (!(!mend && B.active)) return f.dot;
		this.holder.visible_message(`<span class='notice'>${bicon(B)} The timer stops! The bomb has been defused!</span>`);
		B.active = 0;
		B.defused = 1;
		B.update_icon();
	}
	return f.dot;
});

// syndicatebomb.dm:88
rt.def("/datum/wires/syndicatebomb/proc/tell_admins", function tell_admins(f: Frame, B: Value) {
	let $1: any;
	if (rt.istype(B, T("/obj/machinery/syndicatebomb/training"))) {
		return f.dot;
	}
	let _T: Value = rt.getStep(f, B, 0);
	log_game(fmt("＆！ was detonated via boom wire at ＀.", [B, `(${_T.x},${_T.y},${_T.z})`]));
	let $0: any = B.name;
	if (_T) {
		$1 = `${`(${_T.x},${_T.y},${_T.z})`} ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${_T.x};Y=${_T.y};Z=${_T.z}'>JMP</a>)`}`;
	} else {
		$1 = "nonexistent location";
	}
	message_admins(`A ${$0} was detonated via boom wire at ${`${$1}`}.`);
	return f.dot;
});
