// Based on /tg/station's code/modules/mob/dead/dead.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(5095, "/mob/dead", "/mob", {});

// dead.dm:3
rt.def("/mob/dead/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	if (this.initialized) return f.dot;
	rt.setAt(f.argsList, 1, 1);
	yield* GLOB.SSatoms.InitAtom(this, f.argsList);
	return f.dot;
}, true, { args: ["loc"] });

// dead.dm:7
rt.def("/mob/dead/proc/Initialize", function Initialize(f: Frame) {
	if (this.initialized) {
		stack_trace(`Warning: ${this}(${this.type}) initialized multiple times!`);
	}
	this.initialized = 1;
	this.tag = `mob_${rt.incGl("next_mob_id", 1, true)}`;
	GLOB.mob_list += this;
	this.prepare_huds();
	return 0;
});
