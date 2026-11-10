// Based on /tg/station's code/modules/awaymissions/signpost.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(12930, "/obj/structure/signpost", "/obj/structure", {
	question: "Travel back?",
	zlevels: null,
	anchored: 1,
	icon: rt.rsc("icons/obj/stationobjs.dmi"),
	icon_state: "signpost",
	density: 1,
});

// signpost.dm:8
rt.def("/obj/structure/signpost/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.zlevels = list(2);
	return f.dot;
});

// signpost.dm:11
rt.def("/obj/structure/signpost/proc/New", function* New(f: Frame) {
	f.dot = (yield* parent_proc());
	this.set_light(2);
	return f.dot;
}, true);

// signpost.dm:15
rt.def("/obj/structure/signpost/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	return (yield* this.attack_hand(user));
}, true);

// signpost.dm:18
rt.def("/obj/structure/signpost/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let _T: Value = null, A: Value = null;
	const subject = (yield* alert(this.question, this.name, "Yes", "No"));
	if (subject === "Yes") {
		if (_T = (yield* find_safe_turf({ zlevels: this.zlevels }))) {
			A = get_area(_T);
			yield* user.forceMove(_T);
			to_chat(user, `<span class='notice'>You blink and find yourself in ${A.name}.</span>`);
		} else {
			to_chat(user, "Nothing happens. You feel that this is a bad sign.");
		}
	} else if (subject === "No") {
		return f.dot;
	}
	return f.dot;
}, true);

rt.type(12932, "/obj/structure/signpost/exit", "/obj/structure/signpost", {
	question: "Leave? You might never come back.",
	name: "exit",
	desc: "Make sure to bring all your belongings with you when you exit the area.",
});

// signpost.dm:42
rt.def("/obj/structure/signpost/exit/proc/New", function* New(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.dot = (yield* parent_proc());
	this.zlevels = list();
	rt.forRange(f, 0, 1, rt.world().maxz, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		this.zlevels += i;
	}
	rt.endFor(f, 0);
	this.zlevels -= 1;
	return f.dot;
}, true);
