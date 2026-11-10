// Based on /tg/station's code/game/machinery/doors/airlock_types.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(10239, "/obj/machinery/door/airlock/uranium", "/obj/machinery/door/airlock", {
	mineral: "uranium",
	last_event: 0,
	name: "uranium airlock",
	icon: rt.rsc("icons/obj/doors/airlocks/station/uranium.dmi"),
	assemblytype: rt.typePath("/obj/structure/door_assembly/door_assembly_uranium"),
});

// airlock_types.dm:161
rt.def("/obj/machinery/door/airlock/uranium/proc/process", function* process(f: Frame) {
	if (rt.worldTime(f) > this.last_event + 20) {
		if (prob(50)) {
			yield* this.radiate();
		}
		this.last_event = rt.worldTime(f);
	}
	yield* parent_proc();
	return f.dot;
}, true, { waitfor: false });

// airlock_types.dm:168
rt.def("/obj/machinery/door/airlock/uranium/proc/radiate", function* radiate(f: Frame) {
	yield* radiation_pulse(rt.getStep(f, this, 0), 3, 3, 15, 0);
	return f.dot;
}, true);

rt.type(10213, "/obj/machinery/door/airlock/plasma", "/obj/machinery/door/airlock", {
	mineral: "plasma",
	name: "plasma airlock",
	desc: "No way this can end badly.",
	icon: rt.rsc("icons/obj/doors/airlocks/station/plasma.dmi"),
	assemblytype: rt.typePath("/obj/structure/door_assembly/door_assembly_plasma"),
});

// airlock_types.dm:179
rt.def("/obj/machinery/door/airlock/plasma/proc/temperature_expose", function* temperature_expose(f: Frame, air: Value, exposed_temperature: Value, exposed_volume: Value) {
	if (!(exposed_temperature > 300)) return f.dot;
	yield* this.PlasmaBurn(exposed_temperature);
	return f.dot;
}, true);

// airlock_types.dm:183
rt.def("/obj/machinery/door/airlock/plasma/proc/ignite", function* ignite(f: Frame, exposed_temperature: Value) {
	if (!(exposed_temperature > 300)) return f.dot;
	yield* this.PlasmaBurn(exposed_temperature);
	return f.dot;
}, true);

// airlock_types.dm:187
rt.def("/obj/machinery/door/airlock/plasma/proc/PlasmaBurn", function* PlasmaBurn(f: Frame, temperature: Value) {
	this.atmos_spawn_air("plasma=500;TEMP=1000");
	yield* new_(T("/obj/structure/door_assembly/door_assembly_0"), this.loc);
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(10255, "/obj/machinery/door/airlock/cult", "/obj/machinery/door/airlock", {
	friendly: 0,
	openingoverlaytype: rt.typePath("/obj/effect/temp_visual/cult/door"),
	overlays_file: rt.rsc("icons/obj/doors/airlocks/cult/runed/overlays.dmi"),
	hackProof: 1,
	aiControlDisabled: 1,
	name: "cult airlock",
	icon: rt.rsc("icons/obj/doors/airlocks/cult/runed/cult.dmi"),
	assemblytype: rt.typePath("/obj/structure/door_assembly/door_assembly_cult"),
});

// airlock_types.dm:376
rt.def("/obj/machinery/door/airlock/cult/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	yield* new_(this.openingoverlaytype, this.loc);
	return f.dot;
}, true);

// airlock_types.dm:380
rt.def("/obj/machinery/door/airlock/cult/proc/canAIControl", function canAIControl(f: Frame, user: Value) {
	return (iscultist(user) && (!this.isAllPowerCut() ? 1 : 0));
});

// airlock_types.dm:383
rt.def("/obj/machinery/door/airlock/cult/proc/allowed", function* allowed(f: Frame, L: Value) {
	let throwtarget: Value = null;
	if (!this.density) {
		return 1;
	}
	if (this.friendly || iscultist(L) || rt.istype(L, T("/mob/living/simple_animal/shade")) || rt.istype(L, T("/mob/living/simple_animal/hostile/construct"))) {
		yield* new_(this.openingoverlaytype, this.loc);
		return 1;
	} else {
		yield* new_(T("/obj/effect/temp_visual/cult/sac"), this.loc);
		throwtarget = get_edge_target_turf(this, rt.getDir(f, this, get_step_away(L, this)));
		rt.op(f, "Output", [], [L, pick(sound(rt.rsc("sound/hallucinations/turn_around1.ogg"), 0, 1, 50), sound(rt.rsc("sound/hallucinations/turn_around2.ogg"), 0, 1, 50))], false);
		yield* flash_color(L, { flash_color: "#960000", flash_time: 20 });
		yield* L.Knockdown(40);
		yield* L.throw_at(throwtarget, 5, 1, this);
		return 0;
	}
}, true);

rt.type(10211, "/obj/machinery/door/airlock/clockwork", "/obj/machinery/door/airlock", {
	construction_state: 1,
	name: "pinion airlock",
	desc: "A massive cogwheel set into two heavy slabs of brass.",
	icon: rt.rsc("icons/obj/doors/airlocks/clockwork/pinion_airlock.dmi"),
	overlays_file: rt.rsc("icons/obj/doors/airlocks/clockwork/overlays.dmi"),
	opacity: 1,
	hackProof: 1,
	aiControlDisabled: 1,
	use_power: 0,
	resistance_flags: 34,
	damage_deflection: 30,
	normal_integrity: 240,
});

// airlock_types.dm:445
rt.def("/obj/machinery/door/airlock/clockwork/proc/New", function* New(f: Frame) {
	let _T: Value = null;
	yield* parent_proc();
	yield* new_(T("/obj/effect/temp_visual/ratvar/door"), (_T = rt.getStep(f, this, 0)));
	yield* new_(T("/obj/effect/temp_visual/ratvar/beam/door"), _T);
	change_construction_value(5);
	return f.dot;
}, true);

// airlock_types.dm:452
rt.def("/obj/machinery/door/airlock/clockwork/proc/Destroy", function* Destroy(f: Frame) {
	change_construction_value(-5);
	return (yield* parent_proc());
}, true);

// airlock_types.dm:456
rt.def("/obj/machinery/door/airlock/clockwork/proc/examine", function* examine(f: Frame, user: Value) {
	yield* parent_proc();
	let gear_text: Value = "The cogwheel is flickering and twisting wildly. Report this to a coder.";
	if (this.construction_state === GEAR_SECURE) {
		gear_text = "<span class='brass'>The cogwheel is solidly <b>wrenched</b> to the brass around it.</span>";
	} else if (this.construction_state === GEAR_LOOSE) {
		gear_text = "<span class='alloy'>The cogwheel has been <i>loosened</i>, but remains <b>connected loosely</b> to the door!</span>";
	}
	to_chat(user, gear_text);
	return f.dot;
}, true);

// airlock_types.dm:466
rt.def("/obj/machinery/door/airlock/clockwork/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	if (!prob(80 / severity)) return f.dot;
	yield* this.open();
	return f.dot;
}, true);

// airlock_types.dm:470
rt.def("/obj/machinery/door/airlock/clockwork/proc/canAIControl", function canAIControl(f: Frame, user: Value) {
	return (is_servant_of_ratvar(user) && (!this.isAllPowerCut() ? 1 : 0));
});

// airlock_types.dm:476
rt.def("/obj/machinery/door/airlock/clockwork/proc/narsie_act", function* narsie_act(f: Frame) {
	yield* parent_proc();
	if (!this) return f.dot;
	let previouscolor: Value = this.color;
	this.color = "#960000";
	rt.op(f, "Animate", [2, 6], [null, this, "color", previouscolor, "time", 8]);
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/atom/proc/update_atom_colour"))), 8);
	return f.dot;
}, true);

// airlock_types.dm:484
rt.def("/obj/machinery/door/airlock/clockwork/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (yield* this.attempt_construction(I, user)) return f.dot;
	return (yield* parent_proc());
}, true);

// airlock_types.dm:488
rt.def("/obj/machinery/door/airlock/clockwork/proc/allowed", function allowed(f: Frame, M: Value) {
	if (is_servant_of_ratvar(M)) {
		return 1;
	}
	return 0;
});

// airlock_types.dm:499
rt.def("/obj/machinery/door/airlock/clockwork/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	let _T: Value = null;
	disassembled ??= 1;
	playsound(this, rt.rsc("sound/items/deconstruct.ogg"), 50, 1);
	if (!rt.bitAnd(this.flags, NODECONSTRUCT)) {
		_T = rt.getStep(f, this, 0);
		if (disassembled) {
			yield* new_(T("/obj/item/stack/tile/brass"), _T, 4);
		} else {
			yield* new_(T("/obj/item/clockwork/alloy_shards"), _T);
		}
		yield* new_(T("/obj/item/clockwork/alloy_shards/pinion_lock"), _T);
	}
	yield* qdel(this);
	return f.dot;
}, true);

// airlock_types.dm:510
rt.def("/obj/machinery/door/airlock/clockwork/proc/attempt_construction", function* attempt_construction(f: Frame, I: Value, user: Value) {
	if (!I || !user || !user.canUseTopic(this)) {
		return 0;
	} else if (rt.istype(I, T("/obj/item/weapon/wrench"))) {
		if (this.construction_state == GEAR_SECURE) {
			user.visible_message(`<span class='notice'>${user} begins loosening ${this}'s cogwheel...</span>`, `<span class='notice'>You begin loosening ${this}'s cogwheel...</span>`);
			playsound(this, I.usesound, 50, 1);
			if (!(yield* do_after(user, 75 * I.toolspeed, { target: this })) || this.construction_state != GEAR_SECURE) {
				return 1;
			}
			user.visible_message(`<span class='notice'>${user} loosens ${this}'s cogwheel!</span>`, `<span class='notice'>${this}'s cogwheel pops off and dangles loosely.</span>`);
			playsound(this, rt.rsc("sound/items/deconstruct.ogg"), 50, 1);
			this.construction_state = GEAR_LOOSE;
		} else if (this.construction_state == GEAR_LOOSE) {
			user.visible_message(`<span class='notice'>${user} begins tightening ${this}'s cogwheel...</span>`, `<span class='notice'>You begin tightening ${this}'s cogwheel into place...</span>`);
			playsound(this, I.usesound, 50, 1);
			if (!(yield* do_after(user, 75 * I.toolspeed, { target: this })) || this.construction_state != GEAR_LOOSE) {
				return 1;
			}
			user.visible_message(`<span class='notice'>${user} tightens ${this}'s cogwheel!</span>`, `<span class='notice'>You firmly tighten ${this}'s cogwheel into place.</span>`);
			playsound(this, rt.rsc("sound/items/deconstruct.ogg"), 50, 1);
			this.construction_state = GEAR_SECURE;
		}
		return 1;
	} else if (rt.istype(I, T("/obj/item/weapon/crowbar"))) {
		if (this.construction_state == GEAR_SECURE) {
			to_chat(user, `<span class='warning'>${this}'s cogwheel is too tightly secured! Your ${I.name} can't reach under it!</span>`);
			return 1;
		} else if (this.construction_state == GEAR_LOOSE) {
			user.visible_message(`<span class='notice'>${user} begins slowly lifting off ${this}'s cogwheel...</span>`, `<span class='notice'>You slowly begin lifting off ${this}'s cogwheel...</span>`);
			playsound(this, I.usesound, 50, 1);
			if (!(yield* do_after(user, 75 * I.toolspeed, { target: this })) || this.construction_state != GEAR_LOOSE) {
				return 1;
			}
			user.visible_message(`<span class='notice'>${user} lifts off ${this}'s cogwheel, causing it to fall apart!</span>`, `<span class='notice'>You lift off ${this}'s cogwheel, causing it to fall apart!</span>`);
			yield* this.deconstruct(1);
		}
		return 1;
	}
	return 0;
}, true);
