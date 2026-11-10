// Based on /tg/station's code/datums/status_effects/gas.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(939, "/datum/status_effect/freon", "/datum/status_effect", {
	cube: null,
	id: "frozen",
	duration: 100,
	status_type: 1,
	alert_type: rt.typePath("/obj/screen/alert/status_effect/freon"),
});

// gas.dm:14
rt.def("/datum/status_effect/freon/proc/on_apply", function* on_apply(f: Frame) {
	if (!this.owner.stat) {
		to_chat(this.owner, "<span class='userdanger'>You become frozen in a cube!</span>");
	}
	this.cube = icon(rt.rsc("icons/effects/freeze.dmi"), "ice_cube");
	this.owner.add_overlay(this.cube);
	yield* this.owner.update_canmove();
	return (yield* parent_proc());
}, true);

// gas.dm:22
rt.def("/datum/status_effect/freon/proc/tick", function* tick(f: Frame) {
	yield* this.owner.update_canmove();
	if (!(this.owner && this.owner.bodytemperature >= 310.055)) return f.dot;
	yield* qdel(this);
	return f.dot;
}, true);

// gas.dm:27
rt.def("/datum/status_effect/freon/proc/on_remove", function* on_remove(f: Frame) {
	if (!this.owner.stat) {
		to_chat(this.owner, "The cube melts!");
	}
	this.owner.cut_overlay(this.cube);
	this.owner.bodytemperature += 100;
	yield* this.owner.update_canmove();
	return f.dot;
}, true);
