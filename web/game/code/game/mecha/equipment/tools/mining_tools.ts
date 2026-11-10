// Based on /tg/station's code/game/mecha/equipment/tools/mining_tools.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(9611, "/obj/item/mecha_parts/mecha_equipment/drill", "/obj/item/mecha_parts/mecha_equipment", {
	equip_cooldown: 30,
	energy_drain: 10,
	name: "exosuit drill",
	desc: "Equipment for engineering and combat exosuits. This is the drill that'll pierce the heavens!",
	icon_state: "mecha_drill",
	force: 15,
});

// mining_tools.dm:14
rt.def("/obj/item/mecha_parts/mecha_equipment/drill/proc/action", function* action(f: Frame, target: Value) {
	let target_obj: Value = null, _T: Value = null;
	if (!this.action_checks(target)) {
		return f.dot;
	}
	if (rt.istype(target, T("/turf/open/space"))) {
		return f.dot;
	}
	if (rt.istype(target, T("/obj"))) {
		if (rt.bitAnd((target_obj = target).resistance_flags, UNACIDABLE)) {
			return f.dot;
		}
	}
	target.visible_message(`<span class='warning'>${this.chassis} starts to drill ${target}.</span>`, `<span class='userdanger'>${this.chassis} starts to drill ${target}...</span>`, "<span class='italics'>You hear drilling.</span>");
	if (!(yield* this.do_after_cooldown(target))) return f.dot;
	if (isturf(target)) {
		yield* (_T = target).drill_act(this);
	} else {
		this.log_message(`Drilled through ${target}`);
		if (rt.istype(target, T("/mob/living"))) {
			if (rt.istype(this, T("/obj/item/mecha_parts/mecha_equipment/drill/diamonddrill"))) {
				yield* this.drill_mob(target, this.chassis.occupant, 120);
			} else {
				yield* this.drill_mob(target, this.chassis.occupant);
			}
		} else {
			yield* target.ex_act(2);
		}
	}
	return f.dot;
}, true);

// mining_tools.dm:44
rt.def("/turf/closed/wall/r_wall/proc/drill_act", function* drill_act(f: Frame, drill: Value) {
	if (rt.istype(drill, T("/obj/item/mecha_parts/mecha_equipment/drill/diamonddrill"))) {
		if (yield* drill.do_after_cooldown(this)) {
			drill.log_message(`Drilled through ${this}`);
			yield* this.ex_act(3);
		}
	} else {
		drill.occupant_message(`<span class='danger'>${this} is too durable to drill through.</span>`);
	}
	return f.dot;
}, true);

// mining_tools.dm:52
rt.def("/turf/closed/mineral/proc/drill_act", function* drill_act(f: Frame, drill: Value) {
	let M: Value = null;
	for (M of each(range(drill.chassis, 1), T("/turf/closed/mineral"))) {
		if (rt.bitAnd(rt.getDir(f, drill.chassis, M), drill.chassis.dir)) {
			yield* M.gets_drilled();
		}
	}
	drill.log_message(`Drilled through ${this}`);
	yield* drill.move_ores();
	return f.dot;
}, true);

// mining_tools.dm:59
rt.def("/turf/open/floor/plating/asteroid/proc/drill_act", function* drill_act(f: Frame, drill: Value) {
	let M: Value = null;
	for (M of each(range(1, drill.chassis), T("/turf/open/floor/plating/asteroid"))) {
		if (rt.bitAnd(rt.getDir(f, drill.chassis, M), drill.chassis.dir)) {
			yield* M.gets_dug();
		}
	}
	drill.log_message(`Drilled through ${this}`);
	yield* drill.move_ores();
	return f.dot;
}, true);

// mining_tools.dm:67
rt.def("/obj/item/mecha_parts/mecha_equipment/drill/proc/move_ores", function* move_ores(f: Frame) {
	let R: Value = null;
	if (!rt.locateIn(f, T("/obj/item/mecha_parts/mecha_equipment/hydraulic_clamp"), (this.chassis.equipment && (rt.istype(this.chassis, T("/obj/mecha/working/ripley")) ? 1 : 0)))) return f.dot;
	yield* (R = this.chassis).collect_ore();
	return f.dot;
}, true);

// mining_tools.dm:72
rt.def("/obj/item/mecha_parts/mecha_equipment/drill/proc/can_attach", function can_attach(f: Frame, M: Value) {
	if (parent_proc()) {
		if (rt.istype(M, T("/obj/mecha/working")) || rt.istype(M, T("/obj/mecha/combat"))) {
			return 1;
		}
	}
	return 0;
}, false);

// mining_tools.dm:78
rt.def("/obj/item/mecha_parts/mecha_equipment/drill/proc/drill_mob", function* drill_mob(f: Frame, target: Value, user: Value, drill_damage: Value) {
	drill_damage ??= 80;
	target.visible_message(`<span class='danger'>${this.chassis} drills ${target} with ${this}.</span>`, `<span class='userdanger'>${this.chassis} drills ${target} with ${this}.</span>`);
	add_logs(user, target, "attacked", `${this.name}`, `(INTENT: ${uppertext(user.a_intent)}) (DAMTYPE: ${uppertext(this.damtype)})`);
	if (target.stat == 2) {
		if (target.butcher_results) {
			yield* target.harvest(this.chassis);
		} else {
			yield* target.gib();
		}
	} else {
		yield* target.take_bodypart_damage(drill_damage);
	}
	if (!target) return f.dot;
	yield* target.Unconscious(200);
	yield* target.updatehealth();
	return f.dot;
}, true);

rt.type(9613, "/obj/item/mecha_parts/mecha_equipment/mining_scanner", "/obj/item/mecha_parts/mecha_equipment", {
	scanning_time: 0,
	selectable: 0,
	equip_cooldown: 30,
	name: "exosuit mining scanner",
	desc: "Equipment for engineering and combat exosuits. It will automatically check surrounding rock for useful minerals.",
	icon_state: "mecha_analyzer",
});

// mining_tools.dm:112
rt.def("/obj/item/mecha_parts/mecha_equipment/mining_scanner/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	if (this.isprocessing) return f.dot;
	this.isprocessing = 1;
	GLOB.SSobj.processing += this;
	return f.dot;
}, true);

// mining_tools.dm:116
rt.def("/obj/item/mecha_parts/mecha_equipment/mining_scanner/proc/process", function* process(f: Frame) {
	let mecha: Value = null;
	if (!this.loc) {
		this.isprocessing = 0;
		GLOB.SSobj.processing -= this;
		yield* qdel(this);
	}
	if (!(rt.istype(this.loc, T("/obj/mecha/working")) && this.scanning_time <= rt.worldTime(f))) return f.dot;
	if (!(mecha = this.loc).occupant) {
		return f.dot;
	}
	this.scanning_time = rt.worldTime(f) + this.equip_cooldown;
	yield* mineral_scan_pulse(rt.getStep(f, this, 0));
	return f.dot;
}, true, { waitfor: false });
