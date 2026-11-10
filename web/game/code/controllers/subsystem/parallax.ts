// Based on /tg/station's code/controllers/subsystem/parallax.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(34, "/datum/controller/subsystem/parallax", "/datum/controller/subsystem", {
	currentrun: null,
	name: "Parallax",
	wait: 2,
	flags: 69,
	priority: 65,
	runlevels: 15,
});

// parallax.dm:1
rt.def("/datum/controller/subsystem/parallax/proc/New", function* New(f: Frame) {
	if (GLOB.SSparallax != this) {
		if (rt.istype(GLOB.SSparallax, T("/datum/controller/subsystem/parallax"))) {
			yield* this.Recover();
			yield* qdel(GLOB.SSparallax);
		}
		GLOB.SSparallax = this;
	}
	this.PreInit();
	return f.dot;
}, true);

// parallax.dm:10
rt.def("/datum/controller/subsystem/parallax/proc/fire", function fire(f: Frame, resumed: Value) {
	let C: Value = null, A: Value = null;
	let $0: any;
	resumed ??= 0;
	if (!resumed) {
		this.currentrun = GLOB.clients.Copy();
	}
	let currentrun: Value = this.currentrun;
	while (rt.length(currentrun)) {
		C = rt.index(currentrun, rt.len(f, currentrun));
		currentrun.len--;
		if (!C || !C.eye) {
			if (rt.tickUsage(f) > GLOB.current_ticklimit || this.state != 2) {
				$0 = this.pause();
			} else {
				$0 = 0;
			}
			if ($0) {
				return f.dot;
			}
			continue;
		}
		if (!(A = C.eye)) {
			return f.dot;
		}
		A;
		while (isloc(A.loc) && !isturf(A.loc)) {
			A = A.loc;
		}
		if (A != C.movingmob) {
			if (C.movingmob !== null) {
				C.movingmob.client_mobs_in_contents -= C.mob;
				if (C.movingmob.client_mobs_in_contents && !rt.len(f, C.movingmob.client_mobs_in_contents)) {
					C.movingmob.client_mobs_in_contents = null;
				}
			}
			if (!A.client_mobs_in_contents) {
				A.client_mobs_in_contents = list();
			}
			A.client_mobs_in_contents += C.mob;
			C.movingmob = A;
		}
		if (rt.tickUsage(f) > GLOB.current_ticklimit || this.state != 2) {
			$0 = this.pause();
		} else {
			$0 = 0;
		}
		if ($0) {
			return f.dot;
		}
	}
	currentrun = null;
	return f.dot;
});
