// Based on /tg/station's code/modules/ninja/suit/n_suit_verbs/ninja_stealth.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



// ninja_stealth.dm:11
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/toggle_stealth", function toggle_stealth(f: Frame) {
	let U: Value = null;
	if (!(U = this.affecting)) {
		return f.dot;
	}
	if (this.s_active) {
		this.cancel_stealth();
	} else {
		if (this.cell.charge <= 0) {
			to_chat(U, "<span class='warning'>You don't have enough power to enable Stealth!</span>");
			return f.dot;
		}
		this.s_active = (!this.s_active ? 1 : 0);
		rt.op(f, "Animate", [2, 6], [null, U, "alpha", 50, "time", 15]);
		U.visible_message(`<span class='warning'>${U.name} vanishes into thin air!</span>`, "<span class='notice'>You are now mostly invisible to normal detection.</span>");
	}
	return f.dot;
});

// ninja_stealth.dm:27
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/cancel_stealth", function cancel_stealth(f: Frame) {
	let U: Value = null;
	if (!(U = this.affecting)) {
		return 0;
	}
	if (this.s_active) {
		this.s_active = (!this.s_active ? 1 : 0);
		rt.op(f, "Animate", [2, 6], [null, U, "alpha", 255, "time", 15]);
		U.visible_message(`<span class='warning'>${U.name} appears from thin air!</span>`, "<span class='notice'>You are now visible.</span>");
		return 1;
	}
	return 0;
});

// ninja_stealth.dm:40
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/stealth", function stealth(f: Frame) {
	if (!this.s_busy) {
		this.toggle_stealth();
	} else {
		to_chat(this.affecting, "<span class='danger'>Stealth does not appear to work!</span>");
	}
	return f.dot;
});
