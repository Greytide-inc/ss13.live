// Based on /tg/station's code/modules/holodeck/computer_funcs.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, fmt } = rt;


// computer_funcs.dm:2
rt.def("/obj/machinery/computer/holodeck/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let A: Value = null, popup: Value = null;
	yield* user.set_machine(this);
	let dat: Value = "<h3>Current Loaded Programs</h3>";
	dat += fmt("<a href='?src=＃;loadarea=＀'>Power Off</a><br>", [this, this.offline_program.type]);
	for (A of each(this.program_cache, T("/area"))) {
		dat += fmt("<a href='?src=＃;loadarea=＀'>＀</a><br>", [this, A.type, A.name]);
	}
	if (this.emagged && rt.len(f, this.emag_programs)) {
		dat += "<span class='warning'>SUPERVISOR ACCESS - SAFETY PROTOCOLS DISABLED - CAUTION: EMITTER ANOMALY</span><br>";
		A = null;
		for (A of each(this.emag_programs, T("/area"))) {
			dat += fmt("<a href='?src=＃;loadarea=＀'>＀</a><br>", [this, A.type, A.name]);
		}
	}
	(popup = (yield* new_(T("/datum/browser"), user, "computer", this.name, 400, 500))).set_content(dat);
	popup.set_title_image(user.browse_rsc_icon(this.icon, this.icon_state));
	yield* popup.open();
	return f.dot;
}, true);

// computer_funcs.dm:20
rt.def("/obj/machinery/computer/holodeck/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	let A: Value = null, popup: Value = null;
	let dat: Value = "<h3>Current Loaded Programs</h3>";
	dat += fmt("<a href='?src=＃;loadarea=＀'>Power Off</a><br>", [this, this.offline_program.type]);
	for (A of each(this.program_cache, T("/area"))) {
		dat += fmt("<a href='?src=＃;loadarea=＀'>＀</a><br>", [this, A.type, A.name]);
	}
	if (rt.len(f, this.emag_programs)) {
		dat += "<br>";
		if (this.emagged) {
			dat += fmt("Safety protocol: <span class='bad'>Offline</span> <a href='?＃;safety=1'>Engage</a><br>", [this]);
			A = null;
			for (A of each(this.emag_programs, T("/area"))) {
				dat += fmt("<a href='?src=＃;loadarea=＀'>＀</a><br>", [this, A.type, A.name]);
			}
		} else {
			dat += fmt("Safety protocol: <span class='good'>Online</span> <a href='?＃;safety=0'>Disengage</a><br>", [this]);
		}
	}
	(popup = (yield* new_(T("/datum/browser"), user, "computer", this.name, 400, 500))).set_content(dat);
	popup.set_title_image(user.browse_rsc_icon(this.icon, this.icon_state));
	yield* popup.open();
	return f.dot;
}, true);

// computer_funcs.dm:43
rt.def("/obj/machinery/computer/holodeck/proc/load_program", function* load_program(f: Frame, A: Value, force: Value, delay: Value) {
	let HE: Value = null, item: Value = null, M: Value = null, S: Value = null, added: Value = null, HE_1: Value = null, x: Value = null, M_1: Value = null, S_1: Value = null;
	let $e: any;
	force ??= 0;
	delay ??= 0;
	if (this.stat) {
		A = this.offline_program;
		force = 1;
		delay = 0;
	}
	if (this.program == A) {
		return f.dot;
	}
	let $0: any = rt.worldTime(f);
	let $1: any = this.last_change + 25;
	if ($0 < $1 + (this.damaged ? 500 : 0) && !force) {
		if (delay) {
			yield* sleep(25);
		} else {
			if (rt.worldTime(f) < this.last_change + 15) {
				return f.dot;
			}
			if (get_dist(f.usr, this) <= 3) {
				to_chat(f.usr, "<span class='warning'>ERROR. Recalibrating projection apparatus.</span>");
				return f.dot;
			}
		}
	}
	this.last_change = rt.worldTime(f);
	this.active = (A != this.offline_program ? 1 : 0);
	this.use_power = this.active ? 2 : 1;
	for (HE of each(this.effects, T("/obj/effect/holodeck_effect"))) {
		yield* HE.deactivate(this);
	}
	for (item of each(this.spawned)) {
		yield* this.derez(item, { forced: force });
	}
	this.program = A;
	this.spawned = (yield* A.copy_contents_to(this.linked, 1, { nerf_weapons: (!this.emagged ? 1 : 0) }));
	for (M of each(this.spawned, T("/obj/machinery"))) {
		(rt.modField(f, M, "flags", 128, rt.bitOr));
	}
	for (S of each(this.spawned, T("/obj/structure"))) {
		(rt.modField(f, S, "flags", 128, rt.bitOr));
	}
	this.effects = list();
	rt.spawnTail(f, 30, "/obj/machinery/computer/holodeck/proc/load_program: spawn at modules/holodeck/computer_funcs.dm:79", A, force, delay, HE, item, M, S, added, HE_1, x, M_1, S_1);
	return f.dot;
}, true);

// a spawn(30) body of /obj/machinery/computer/holodeck/proc/load_program, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/computer/holodeck/proc/load_program: spawn at modules/holodeck/computer_funcs.dm:79", function* (f: Frame, A: Value, force: Value, delay: Value, HE: Value, item: Value, M: Value, S: Value, added: Value, HE_1: Value, x: Value, M_1: Value, S_1: Value) {
	added = list();
	HE_1 = null;
	for (HE_1 of each(this.spawned, T("/obj/effect/holodeck_effect"))) {
		this.effects += HE_1;
		this.spawned -= HE_1;
		if (rt.istype((x = (yield* HE_1.activate(this))), T("/atom")) || rt.istype(x, T("/list"))) {
			this.spawned += x;
			added += x;
		}
	}
	M_1 = null;
	for (M_1 of each(added, T("/obj/machinery"))) {
		(rt.modField(f, M_1, "flags", 128, rt.bitOr));
	}
	S_1 = null;
	for (S_1 of each(added, T("/obj/structure"))) {
		(rt.modField(f, S_1, "flags", 128, rt.bitOr));
	}
	return null;
});

// computer_funcs.dm:95
rt.def("/obj/machinery/computer/holodeck/proc/derez", function* derez(f: Frame, obj: Value, silent: Value, forced: Value) {
	let _T: Value = null, AM: Value = null;
	silent ??= 1;
	forced ??= 0;
	if (obj && this.emagged && !this.stat && !forced) {
		if ((ismob(obj) || ismob(obj.loc)) && prob(50)) {
			rt.spawnTail(f, 50, "/obj/machinery/computer/holodeck/proc/derez: spawn at modules/holodeck/computer_funcs.dm:97", obj, silent, forced, _T, AM);
			return f.dot;
		}
	}
	yield* this.spawned.Remove(obj);
	if (!obj) {
		return f.dot;
	}
	_T = rt.getStep(f, obj, 0);
	for (AM of each(obj.contents, T("/atom/movable"))) {
		AM.loc = _T;
		if (ismob(AM)) {
			silent = 0;
		}
	}
	if (!silent) {
		this.visible_message(`The ${obj.name} fades away!`);
	}
	yield* qdel(obj);
	return f.dot;
}, true);

// a spawn(50) body of /obj/machinery/computer/holodeck/proc/derez, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/computer/holodeck/proc/derez: spawn at modules/holodeck/computer_funcs.dm:97", function* (f: Frame, obj: Value, silent: Value, forced: Value, _T: Value, AM: Value) {
	yield* g.callSelf(f, [obj, silent]);
	return null;
});
