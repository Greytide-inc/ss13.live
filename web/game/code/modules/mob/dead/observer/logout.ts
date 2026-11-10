// Based on /tg/station's code/modules/mob/dead/observer/logout.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



// logout.dm:3
rt.def("/mob/dead/observer/proc/Logout", function* Logout(f: Frame) {
	let target: Value = null;
	if (this.client) {
		// tg_js: leaving the ghost (re-entering a body, respawning) puts the zoom back to the normal view size.
		yield* this.client.zoom_view(0, 1);
		this.client.images -= GLOB.ghost_images_default + GLOB.ghost_images_simple;
	}
	if (this.observetarget) {
		if (ismob(this.observetarget)) {
			if ((target = this.observetarget).observers) {
				target.observers -= this;
				if (target.observers && !rt.len(f, target.observers)) {
					target.observers = null;
				}
			}
			this.observetarget = null;
		}
	}
	yield* parent_proc();
	rt.spawnTail(f, 0, "/mob/dead/observer/proc/Logout: spawn at modules/mob/dead/observer/logout.dm:13", target);
	return f.dot;
}, true);

// a spawn(0) body of /mob/dead/observer/proc/Logout, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/dead/observer/proc/Logout: spawn at modules/mob/dead/observer/logout.dm:13", function* (f: Frame, target: Value) {
	if (this && !this.key) {
		yield* qdel(this);
	}
	return null;
});
