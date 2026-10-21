// From code/modules/ninja/suit/suit_initialisation.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /obj/item/clothing/suit/space/space_ninja/proc/toggle_on_off  (code/modules/ninja/suit/suit_initialisation.dm:3)  may sleep
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/toggle_on_off", function* toggle_on_off(f: Frame) {
	if (truthy(rt.sv(f, "s_busy"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "loc"), "<span class='userdanger'>ERROR</span>: You cannot use this function at this time."]);
		return 0;
	}
	if (truthy(rt.sv(f, "s_initialized"))) {
		yield* g.srcCall(f, "deinitialize");
	} else {
		yield* g.srcCall(f, "ninitialize");
	}
	f.dot = 1;
	return f.dot;
}, true);

// /obj/item/clothing/suit/space/space_ninja/proc/ninitialize  (code/modules/ninja/suit/suit_initialisation.dm:12)  may sleep
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/ninitialize", function* ninitialize(f: Frame, delay: Value, U: Value) {
	f.vars = () => [delay, U];
	if (live(delay) === null) {
		delay = rt.sv(f, "s_delay");
	}
	if (live(U) === null) {
		U = rt.sv(f, "loc");
	}
	if (!truthy(rt.fv(f, "mind", live(U)))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.call(f, P("/proc/is_ninja"), null, [live(U)])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(U), "You do not understand how this suit functions. Where the heck did it even come from?"]);
		return live(f.dot);
	}
	rt.setSv(f, "s_busy", 1);
	yield* g.call(f, P("/proc/to_chat"), null, [live(U), "<span class='notice'>Now initializing...</span>"]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/clothing/suit/space/space_ninja/proc/ninitialize_two"), live(delay), live(U)])), live(delay)]);
	return f.dot;
}, true);

// /obj/item/clothing/suit/space/space_ninja/proc/ninitialize_two  (code/modules/ninja/suit/suit_initialisation.dm:22)  may sleep
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/ninitialize_two", function* ninitialize_two(f: Frame, delay: Value, U: Value) {
	f.vars = () => [delay, U];
	if (!truthy((yield* g.srcCall(f, "lock_suit", live(U))))) {
		rt.setSv(f, "s_busy", 0);
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(U), "<span class='notice'>Securing external locking mechanism...\nNeural-net established.</span>"]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/clothing/suit/space/space_ninja/proc/ninitialize_three"), live(delay), live(U)])), live(delay)]);
	return f.dot;
}, true, { argTypes: [{  }, { type: 8, path: "/mob/living/carbon/human" }] });

// /obj/item/clothing/suit/space/space_ninja/proc/ninitialize_three  (code/modules/ninja/suit/suit_initialisation.dm:29)  may sleep
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/ninitialize_three", function* ninitialize_three(f: Frame, delay: Value, U: Value) {
	f.vars = () => [delay, U];
	yield* g.call(f, P("/proc/to_chat"), null, [live(U), "<span class='notice'>Extending neural-net interface...\nNow monitoring brain wave pattern...</span>"]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/clothing/suit/space/space_ninja/proc/ninitialize_four"), live(delay), live(U)])), live(delay)]);
	return f.dot;
}, true, { argTypes: [{  }, { type: 8, path: "/mob/living/carbon/human" }] });

// /obj/item/clothing/suit/space/space_ninja/proc/ninitialize_four  (code/modules/ninja/suit/suit_initialisation.dm:33)  may sleep
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/ninitialize_four", function* ninitialize_four(f: Frame, delay: Value, U: Value) {
	f.vars = () => [delay, U];
	if ((isEqual(rt.fv(f, "stat", live(U)), 2) || rt.le(rt.fv(f, "health", live(U)), 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(U), "<span class='danger'><B>FÄAL ï¿½Rrï¿½R</B>: 344--93#ï¿½&&21 BRï¿½ï¿½N |/|/aVï¿½ PATT$RN <B>RED</B>\nA-A-aBï¿½rTï¿½NG...</span>"]);
		yield* g.srcCall(f, "unlock_suit");
		return live(f.dot);
	}
	yield* g.srcCall(f, "lockIcons", live(U));
	yield* g.callName(f, live(U), "regenerate_icons", []);
	yield* g.call(f, P("/proc/to_chat"), null, [live(U), "<span class='notice'>Linking neural-net interface...\nPattern</span> <B>GREEN</B><span class='notice'>, continuing operation.</span>"]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/clothing/suit/space/space_ninja/proc/ninitialize_five"), live(delay), live(U)])), live(delay)]);
	return f.dot;
}, true, { argTypes: [{  }, { type: 8, path: "/mob/living/carbon/human" }] });

// /obj/item/clothing/suit/space/space_ninja/proc/ninitialize_five  (code/modules/ninja/suit/suit_initialisation.dm:43)  may sleep
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/ninitialize_five", function* ninitialize_five(f: Frame, delay: Value, U: Value) {
	f.vars = () => [delay, U];
	yield* g.call(f, P("/proc/to_chat"), null, [live(U), "<span class='notice'>VOID-shift device status: <B>ONLINE</B>.\nCLOAK-tech device status: <B>ONLINE</B>.</span>"]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/clothing/suit/space/space_ninja/proc/ninitialize_six"), live(delay), live(U)])), live(delay)]);
	return f.dot;
}, true, { argTypes: [{  }, { type: 8, path: "/mob/living/carbon/human" }] });

// /obj/item/clothing/suit/space/space_ninja/proc/ninitialize_six  (code/modules/ninja/suit/suit_initialisation.dm:47)  may sleep
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/ninitialize_six", function* ninitialize_six(f: Frame, delay: Value, U: Value) {
	f.vars = () => [delay, U];
	yield* g.call(f, P("/proc/to_chat"), null, [live(U), fmt("<span class='notice'>Primary system status: <B>ONLINE</B>.\nBackup system status: <B>ONLINE</B>.\nCurrent energy capacity: <B>＀</B>.</span>", [rt.fv(f, "charge", rt.sv(f, "cell"))])]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/clothing/suit/space/space_ninja/proc/ninitialize_seven"), live(delay), live(U)])), live(delay)]);
	return f.dot;
}, true, { argTypes: [{  }, { type: 8, path: "/mob/living/carbon/human" }] });

// /obj/item/clothing/suit/space/space_ninja/proc/ninitialize_seven  (code/modules/ninja/suit/suit_initialisation.dm:51)
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/ninitialize_seven", function ninitialize_seven(f: Frame, delay: Value, U: Value) {
	rt.call(f, P("/proc/to_chat"), null, [live(U), fmt("<span class='notice'>All systems operational. Welcome to <B>SpiderOS</B>, ＀.</span>", [rt.fv(f, "real_name", live(U))])]);
	rt.callSrc(f, "grant_ninja_verbs", []);
	rt.callSrc(f, "grant_equip_verbs", []);
	rt.callSrc(f, "ntick", []);
	rt.setSv(f, "s_busy", 0);
	return f.dot;
}, false, { argTypes: [{  }, { type: 8, path: "/mob/living/carbon/human" }] });

// /obj/item/clothing/suit/space/space_ninja/proc/deinitialize  (code/modules/ninja/suit/suit_initialisation.dm:60)  may sleep
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/deinitialize", function* deinitialize(f: Frame, delay: Value) {
	let U: Value = null;
	f.vars = () => [delay, U];
	if (live(delay) === null) {
		delay = rt.sv(f, "s_delay");
	}
	if (!isEqual(rt.sv(f, "affecting"), rt.sv(f, "loc"))) return f.dot;
	U = rt.sv(f, "affecting");
	if (isEqual((yield* g.call(f, P("/proc/alert"), null, ["Are you certain you wish to remove the suit? This will take time and remove all abilities.", null, "Yes", "No"])), "No")) {
		return live(f.dot);
	}
	rt.setSv(f, "s_busy", 1);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/clothing/suit/space/space_ninja/proc/deinitialize_two"), live(delay), live(U)])), live(delay)]);
	return f.dot;
}, true);

// /obj/item/clothing/suit/space/space_ninja/proc/deinitialize_two  (code/modules/ninja/suit/suit_initialisation.dm:68)  may sleep
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/deinitialize_two", function* deinitialize_two(f: Frame, delay: Value, U: Value) {
	f.vars = () => [delay, U];
	yield* g.call(f, P("/proc/to_chat"), null, [live(U), "<span class='notice'>Now de-initializing...</span>"]);
	rt.setSv(f, "spideros", 0);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/clothing/suit/space/space_ninja/proc/deinitialize_three"), live(delay), live(U)])), live(delay)]);
	return f.dot;
}, true, { argTypes: [{  }, { type: 8, path: "/mob/living/carbon/human" }] });

// /obj/item/clothing/suit/space/space_ninja/proc/deinitialize_three  (code/modules/ninja/suit/suit_initialisation.dm:73)  may sleep
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/deinitialize_three", function* deinitialize_three(f: Frame, delay: Value, U: Value) {
	f.vars = () => [delay, U];
	yield* g.call(f, P("/proc/to_chat"), null, [live(U), fmt("<span class='notice'>Logging off, ＀. Shutting down <B>SpiderOS</B>.</span>", [rt.fv(f, "real_name", live(U))])]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/clothing/suit/space/space_ninja/proc/deinitialize_four"), live(delay), live(U)])), live(delay)]);
	return f.dot;
}, true, { argTypes: [{  }, { type: 8, path: "/mob/living/carbon/human" }] });

// /obj/item/clothing/suit/space/space_ninja/proc/deinitialize_four  (code/modules/ninja/suit/suit_initialisation.dm:77)  may sleep
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/deinitialize_four", function* deinitialize_four(f: Frame, delay: Value, U: Value) {
	f.vars = () => [delay, U];
	yield* g.call(f, P("/proc/to_chat"), null, [live(U), "<span class='notice'>Primary system status: <B>OFFLINE</B>.\nBackup system status: <B>OFFLINE</B>.</span>"]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/clothing/suit/space/space_ninja/proc/deinitialize_five"), live(delay), live(U)])), live(delay)]);
	return f.dot;
}, true, { argTypes: [{  }, { type: 8, path: "/mob/living/carbon/human" }] });

// /obj/item/clothing/suit/space/space_ninja/proc/deinitialize_five  (code/modules/ninja/suit/suit_initialisation.dm:81)  may sleep
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/deinitialize_five", function* deinitialize_five(f: Frame, delay: Value, U: Value) {
	f.vars = () => [delay, U];
	yield* g.call(f, P("/proc/to_chat"), null, [live(U), "<span class='notice'>VOID-shift device status: <B>OFFLINE</B>.\nCLOAK-tech device status: <B>OFFLINE</B>.</span>"]);
	yield* g.srcCall(f, "cancel_stealth");
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/clothing/suit/space/space_ninja/proc/deinitialize_six"), live(delay), live(U)])), live(delay)]);
	return f.dot;
}, true, { argTypes: [{  }, { type: 8, path: "/mob/living/carbon/human" }] });

// /obj/item/clothing/suit/space/space_ninja/proc/deinitialize_six  (code/modules/ninja/suit/suit_initialisation.dm:86)  may sleep
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/deinitialize_six", function* deinitialize_six(f: Frame, delay: Value, U: Value) {
	f.vars = () => [delay, U];
	yield* g.call(f, P("/proc/to_chat"), null, [live(U), "<span class='notice'>Disconnecting neural-net interface...</span><B>Success</B><span class='notice'>.</span>"]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/clothing/suit/space/space_ninja/proc/deinitialize_seven"), live(delay), live(U)])), live(delay)]);
	return f.dot;
}, true, { argTypes: [{  }, { type: 8, path: "/mob/living/carbon/human" }] });

// /obj/item/clothing/suit/space/space_ninja/proc/deinitialize_seven  (code/modules/ninja/suit/suit_initialisation.dm:90)  may sleep
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/deinitialize_seven", function* deinitialize_seven(f: Frame, delay: Value, U: Value) {
	f.vars = () => [delay, U];
	yield* g.call(f, P("/proc/to_chat"), null, [live(U), "<span class='notice'>Disengaging neural-net interface...</span><B>Success</B><span class='notice'>.</span>"]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/clothing/suit/space/space_ninja/proc/deinitialize_eight"), live(delay), live(U)])), live(delay)]);
	return f.dot;
}, true, { argTypes: [{  }, { type: 8, path: "/mob/living/carbon/human" }] });

// /obj/item/clothing/suit/space/space_ninja/proc/deinitialize_eight  (code/modules/ninja/suit/suit_initialisation.dm:94)  may sleep
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/deinitialize_eight", function* deinitialize_eight(f: Frame, delay: Value, U: Value) {
	f.vars = () => [delay, U];
	yield* g.call(f, P("/proc/to_chat"), null, [live(U), "<span class='notice'>Unsecuring external locking mechanism...\nNeural-net abolished.\nOperation status: <B>FINISHED</B>.</span>"]);
	yield* g.srcCall(f, "remove_equip_verbs");
	yield* g.callName(f, live(U), "regenerate_icons", []);
	rt.setSv(f, "s_busy", 0);
	return f.dot;
}, true, { argTypes: [{  }, { type: 8, path: "/mob/living/carbon/human" }] });
