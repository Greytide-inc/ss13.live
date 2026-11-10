// Based on /tg/station's code/modules/ninja/suit/suit_initialisation.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


// suit_initialisation.dm:3
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/toggle_on_off", function* toggle_on_off(f: Frame) {
	if (this.s_busy) {
		to_chat(this.loc, "<span class='userdanger'>ERROR</span>: You cannot use this function at this time.");
		return 0;
	}
	if (this.s_initialized) {
		yield* this.deinitialize();
	} else {
		yield* this.ninitialize();
	}
	f.dot = 1;
	return f.dot;
}, true);

// suit_initialisation.dm:12
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/ninitialize", function* ninitialize(f: Frame, delay: Value, U: Value) {
	delay ??= this.s_delay;
	U ??= this.loc;
	if (!U.mind) {
		return f.dot;
	}
	if (!is_ninja(U)) {
		to_chat(U, "You do not understand how this suit functions. Where the heck did it even come from?");
		return f.dot;
	}
	this.s_busy = 1;
	to_chat(U, "<span class='notice'>Now initializing...</span>");
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/clothing/suit/space/space_ninja/proc/ninitialize_two"), delay, U)), delay);
	return f.dot;
}, true);

// suit_initialisation.dm:22
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/ninitialize_two", function* ninitialize_two(f: Frame, delay: Value, U: Value) {
	if (!(yield* this.lock_suit(U))) {
		this.s_busy = 0;
		return f.dot;
	}
	to_chat(U, "<span class='notice'>Securing external locking mechanism...\nNeural-net established.</span>");
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/clothing/suit/space/space_ninja/proc/ninitialize_three"), delay, U)), delay);
	return f.dot;
}, true, { argTypes: [{  }, { type: 8, path: "/mob/living/carbon/human" }] });

// suit_initialisation.dm:29
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/ninitialize_three", function* ninitialize_three(f: Frame, delay: Value, U: Value) {
	to_chat(U, "<span class='notice'>Extending neural-net interface...\nNow monitoring brain wave pattern...</span>");
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/clothing/suit/space/space_ninja/proc/ninitialize_four"), delay, U)), delay);
	return f.dot;
}, true, { argTypes: [{  }, { type: 8, path: "/mob/living/carbon/human" }] });

// suit_initialisation.dm:33
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/ninitialize_four", function* ninitialize_four(f: Frame, delay: Value, U: Value) {
	if (U.stat == 2 || U.health <= 0) {
		to_chat(U, "<span class='danger'><B>FÄAL ï¿½Rrï¿½R</B>: 344--93#ï¿½&&21 BRï¿½ï¿½N |/|/aVï¿½ PATT$RN <B>RED</B>\nA-A-aBï¿½rTï¿½NG...</span>");
		this.unlock_suit();
		return f.dot;
	}
	this.lockIcons(U);
	yield* U.regenerate_icons();
	to_chat(U, "<span class='notice'>Linking neural-net interface...\nPattern</span> <B>GREEN</B><span class='notice'>, continuing operation.</span>");
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/clothing/suit/space/space_ninja/proc/ninitialize_five"), delay, U)), delay);
	return f.dot;
}, true, { argTypes: [{  }, { type: 8, path: "/mob/living/carbon/human" }] });

// suit_initialisation.dm:43
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/ninitialize_five", function* ninitialize_five(f: Frame, delay: Value, U: Value) {
	to_chat(U, "<span class='notice'>VOID-shift device status: <B>ONLINE</B>.\nCLOAK-tech device status: <B>ONLINE</B>.</span>");
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/clothing/suit/space/space_ninja/proc/ninitialize_six"), delay, U)), delay);
	return f.dot;
}, true, { argTypes: [{  }, { type: 8, path: "/mob/living/carbon/human" }] });

// suit_initialisation.dm:47
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/ninitialize_six", function* ninitialize_six(f: Frame, delay: Value, U: Value) {
	to_chat(U, `<span class='notice'>Primary system status: <B>ONLINE</B>.\nBackup system status: <B>ONLINE</B>.\nCurrent energy capacity: <B>${this.cell.charge}</B>.</span>`);
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/clothing/suit/space/space_ninja/proc/ninitialize_seven"), delay, U)), delay);
	return f.dot;
}, true, { argTypes: [{  }, { type: 8, path: "/mob/living/carbon/human" }] });

// suit_initialisation.dm:51
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/ninitialize_seven", function ninitialize_seven(f: Frame, delay: Value, U: Value) {
	to_chat(U, `<span class='notice'>All systems operational. Welcome to <B>SpiderOS</B>, ${U.real_name}.</span>`);
	this.grant_ninja_verbs();
	this.grant_equip_verbs();
	this.ntick();
	this.s_busy = 0;
	return f.dot;
}, false, { argTypes: [{  }, { type: 8, path: "/mob/living/carbon/human" }] });

// suit_initialisation.dm:60
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/deinitialize", function* deinitialize(f: Frame, delay: Value) {
	delay ??= this.s_delay;
	if (this.affecting != this.loc) return f.dot;
	let U: Value = this.affecting;
	if ((yield* alert("Are you certain you wish to remove the suit? This will take time and remove all abilities.", null, "Yes", "No")) == "No") {
		return f.dot;
	}
	this.s_busy = 1;
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/clothing/suit/space/space_ninja/proc/deinitialize_two"), delay, U)), delay);
	return f.dot;
}, true);

// suit_initialisation.dm:68
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/deinitialize_two", function* deinitialize_two(f: Frame, delay: Value, U: Value) {
	to_chat(U, "<span class='notice'>Now de-initializing...</span>");
	this.spideros = 0;
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/clothing/suit/space/space_ninja/proc/deinitialize_three"), delay, U)), delay);
	return f.dot;
}, true, { argTypes: [{  }, { type: 8, path: "/mob/living/carbon/human" }] });

// suit_initialisation.dm:73
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/deinitialize_three", function* deinitialize_three(f: Frame, delay: Value, U: Value) {
	to_chat(U, `<span class='notice'>Logging off, ${U.real_name}. Shutting down <B>SpiderOS</B>.</span>`);
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/clothing/suit/space/space_ninja/proc/deinitialize_four"), delay, U)), delay);
	return f.dot;
}, true, { argTypes: [{  }, { type: 8, path: "/mob/living/carbon/human" }] });

// suit_initialisation.dm:77
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/deinitialize_four", function* deinitialize_four(f: Frame, delay: Value, U: Value) {
	to_chat(U, "<span class='notice'>Primary system status: <B>OFFLINE</B>.\nBackup system status: <B>OFFLINE</B>.</span>");
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/clothing/suit/space/space_ninja/proc/deinitialize_five"), delay, U)), delay);
	return f.dot;
}, true, { argTypes: [{  }, { type: 8, path: "/mob/living/carbon/human" }] });

// suit_initialisation.dm:81
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/deinitialize_five", function* deinitialize_five(f: Frame, delay: Value, U: Value) {
	to_chat(U, "<span class='notice'>VOID-shift device status: <B>OFFLINE</B>.\nCLOAK-tech device status: <B>OFFLINE</B>.</span>");
	this.cancel_stealth();
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/clothing/suit/space/space_ninja/proc/deinitialize_six"), delay, U)), delay);
	return f.dot;
}, true, { argTypes: [{  }, { type: 8, path: "/mob/living/carbon/human" }] });

// suit_initialisation.dm:86
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/deinitialize_six", function* deinitialize_six(f: Frame, delay: Value, U: Value) {
	to_chat(U, "<span class='notice'>Disconnecting neural-net interface...</span><B>Success</B><span class='notice'>.</span>");
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/clothing/suit/space/space_ninja/proc/deinitialize_seven"), delay, U)), delay);
	return f.dot;
}, true, { argTypes: [{  }, { type: 8, path: "/mob/living/carbon/human" }] });

// suit_initialisation.dm:90
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/deinitialize_seven", function* deinitialize_seven(f: Frame, delay: Value, U: Value) {
	to_chat(U, "<span class='notice'>Disengaging neural-net interface...</span><B>Success</B><span class='notice'>.</span>");
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/clothing/suit/space/space_ninja/proc/deinitialize_eight"), delay, U)), delay);
	return f.dot;
}, true, { argTypes: [{  }, { type: 8, path: "/mob/living/carbon/human" }] });

// suit_initialisation.dm:94
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/deinitialize_eight", function* deinitialize_eight(f: Frame, delay: Value, U: Value) {
	to_chat(U, "<span class='notice'>Unsecuring external locking mechanism...\nNeural-net abolished.\nOperation status: <B>FINISHED</B>.</span>");
	this.remove_equip_verbs();
	yield* U.regenerate_icons();
	this.s_busy = 0;
	return f.dot;
}, true, { argTypes: [{  }, { type: 8, path: "/mob/living/carbon/human" }] });
