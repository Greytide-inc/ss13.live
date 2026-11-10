// Based on /tg/station's code/game/gamemodes/clock_cult/clock_structure.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(12148, "/obj/structure/destructible/clockwork", "/obj/structure/destructible", {
	clockwork_desc: null,
	unanchored_icon: null,
	can_be_repaired: 1,
	construction_value: 0,
	immune_to_servant_attacks: 0,
	anchored: 1,
	name: "meme structure",
	desc: "Some frog or something, the fuck?",
	icon: rt.rsc("icons/obj/clockwork_objects.dmi"),
	icon_state: "rare_pepe",
	density: 1,
	resistance_flags: 34,
	break_message: "<span class='warning'>The frog isn't a meme after all!</span>",
	break_sound: rt.rsc("sound/magic/clockwork/anima_fragment_death.ogg"),
	debris: null,
});

// clock_structure.dm:15
rt.def("/obj/structure/destructible/clockwork/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.debris = rt.alist(f, [T("/obj/item/clockwork/alloy_shards/large"), 1, T("/obj/item/clockwork/alloy_shards/medium"), 2, T("/obj/item/clockwork/alloy_shards/small"), 3]);
	return f.dot;
});

// clock_structure.dm:22
rt.def("/obj/structure/destructible/clockwork/proc/Initialize", function Initialize(f: Frame) {
	f.dot = parent_proc();
	change_construction_value(this.construction_value);
	GLOB.all_clockwork_objects += this;
	return f.dot;
});

// clock_structure.dm:27
rt.def("/obj/structure/destructible/clockwork/proc/Destroy", function* Destroy(f: Frame) {
	change_construction_value(-this.construction_value);
	GLOB.all_clockwork_objects -= this;
	return (yield* parent_proc());
}, true);

// clock_structure.dm:32
rt.def("/obj/structure/destructible/clockwork/proc/ratvar_act", function ratvar_act(f: Frame) {
	if (!(GLOB.ratvar_awakens || GLOB.clockwork_gateway_activated)) return f.dot;
	this.obj_integrity = this.max_integrity;
	return f.dot;
});

// clock_structure.dm:36
rt.def("/obj/structure/destructible/clockwork/proc/narsie_act", function* narsie_act(f: Frame) {
	if (!((yield* this.take_damage(rand(25, 50), "brute")) && this)) return f.dot;
	let previouscolor: Value = this.color;
	this.color = "#960000";
	rt.op(f, "Animate", [2, 6], [null, this, "color", previouscolor, "time", 8]);
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/atom/proc/update_atom_colour"))), 8);
	return f.dot;
}, true);

// clock_structure.dm:43
rt.def("/obj/structure/destructible/clockwork/proc/examine", function examine(f: Frame, user: Value) {
	let can_see_clockwork: Value = null;
	let $2: any;
	if ((can_see_clockwork = (is_servant_of_ratvar(user) || (rt.istype(user, T("/mob/dead/observer")) ? 1 : 0))) && this.clockwork_desc) {
		this.desc = this.clockwork_desc;
	}
	parent_proc();
	this.desc = rt.initial(f, this, "desc");
	if (!this.unanchored_icon) return f.dot;
	let $0: any = user;
	let $1: any = this;
	if (this.anchored) {

		$2 = "";
	} else {
		$2 = "not ";
	}
	to_chat($0, `<span class='notice'>${$1} is ${$2}secured to the floor.</span>`);
	return f.dot;
}, false);

// clock_structure.dm:52
rt.def("/obj/structure/destructible/clockwork/proc/examine_status", function examine_status(f: Frame, user: Value) {
	let t_It: Value = null, t_is: Value = null, heavily_damaged: Value = null, healthpercent: Value = null;
	let $0: any;
	if (is_servant_of_ratvar(user) || rt.istype(user, T("/mob/dead/observer"))) {
		t_It = this.p_they(1);
		t_is = this.p_are();
		heavily_damaged = 0;
		if ((healthpercent = this.obj_integrity / this.max_integrity * 100) < 50) {
			heavily_damaged = 1;
		}
		if (heavily_damaged) {
			$0 = "alloy";
		} else {
			$0 = "brass";
		}
		return `<span class='${$0}'>${t_It} ${t_is} at <b>${this.obj_integrity}/${this.max_integrity}</b> integrity${heavily_damaged ? "!" : "."}</span>`;
	}
	return parent_proc();
}, false);

// clock_structure.dm:63
rt.def("/obj/structure/destructible/clockwork/proc/attack_hulk", function* attack_hulk(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (is_servant_of_ratvar(f.args[0]) && this.immune_to_servant_attacks) {
		return 0;
	}
	return (yield* parent_proc());
}, true, { args: ["user", "does_attack_animation"] });

// clock_structure.dm:71
rt.def("/obj/structure/destructible/clockwork/proc/attack_generic", function* attack_generic(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (f.args[2] === null) {
		f.args[2] = "brute";
	}
	if (f.args[3] === null) {
		f.args[3] = 0;
	}
	if (f.args[4] === null) {
		f.args[4] = 1;
	}
	if (is_servant_of_ratvar(f.args[0]) && this.immune_to_servant_attacks) {
		return 0;
	}
	return (yield* parent_proc());
}, true, { args: ["user", "damage_amount", "damage_type", "damage_flag", "sound_effect"] });

// clock_structure.dm:76
rt.def("/obj/structure/destructible/clockwork/proc/mech_melee_attack", function* mech_melee_attack(f: Frame, M: Value) {
	if (M.occupant && is_servant_of_ratvar(M.occupant) && this.immune_to_servant_attacks) {
		return 0;
	}
	return (yield* parent_proc());
}, true);

// clock_structure.dm:85
rt.def("/obj/structure/destructible/clockwork/proc/get_efficiency_mod", function get_efficiency_mod(f: Frame, increasing: Value) {
	if (GLOB.ratvar_awakens) {
		if (increasing) {
			return 0.5;
		}
		return 2;
	}
	f.dot = max(rt.op(f, "Sqrt", [], [this.obj_integrity / max(this.max_integrity, 1)]), 0.5);
	if (increasing) {
		f.dot *= min(this.max_integrity / max(this.obj_integrity, 1), 4);
	}
	f.dot = round(f.dot, 0.01);
	return f.dot;
});

// clock_structure.dm:91
rt.def("/obj/structure/destructible/clockwork/proc/can_be_unfasten_wrench", function can_be_unfasten_wrench(f: Frame, user: Value, silent: Value) {
	if (this.anchored && this.obj_integrity <= round(this.max_integrity * 0.25, 1)) {
		if (!silent) {
			to_chat(user, `<span class='warning'>${this} is too damaged to unsecure!</span>`);
		}
		return FAILED_UNFASTEN;
	}
	return parent_proc();
}, false);

// clock_structure.dm:98
rt.def("/obj/structure/destructible/clockwork/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	if (!is_servant_of_ratvar(user)) return f.dot;
	yield* this.attack_hand(user);
	return f.dot;
}, true);

// clock_structure.dm:102
rt.def("/obj/structure/destructible/clockwork/proc/attack_animal", function* attack_animal(f: Frame, M: Value) {
	if (is_servant_of_ratvar(M)) {
		yield* this.attack_hand(M);
		return 0;
	} else {
		return (yield* parent_proc());
	}
}, true);

// clock_structure.dm:109
rt.def("/obj/structure/destructible/clockwork/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (is_servant_of_ratvar(user) && rt.istype(I, T("/obj/item/weapon/wrench")) && this.unanchored_icon) {
		if ((yield* this.default_unfasten_wrench(user, I, 50)) == SUCCESSFUL_UNFASTEN) {
			yield* this.update_anchored(user, 1);
		}
		return 1;
	}
	return (yield* parent_proc());
}, true);

// clock_structure.dm:116
rt.def("/obj/structure/destructible/clockwork/proc/attacked_by", function* attacked_by(f: Frame, I: Value, user: Value) {
	if (is_servant_of_ratvar(user) && this.immune_to_servant_attacks) {
		return 0;
	}
	return (yield* parent_proc());
}, true);

// clock_structure.dm:122
rt.def("/obj/structure/destructible/clockwork/proc/update_anchored", function* update_anchored(f: Frame, user: Value, do_damage: Value) {
	if (this.anchored) {
		this.icon_state = rt.initial(f, this, "icon_state");
	} else {
		this.icon_state = this.unanchored_icon;
		if (do_damage) {
			playsound(this, this.break_sound, 10 * this.get_efficiency_mod(1), 1);
			yield* this.take_damage(round(this.max_integrity * 0.25, 1), "brute");
		}
		to_chat(user, `<span class='warning'>As you unsecure ${this} from the floor, you see cracks appear in its surface!</span>`);
	}
	return f.dot;
}, true);

// clock_structure.dm:131
rt.def("/obj/structure/destructible/clockwork/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	if (!(this.anchored && this.unanchored_icon)) return f.dot;
	this.anchored = 0;
	yield* this.update_anchored(null, (this.obj_integrity > this.max_integrity * 0.25 ? 1 : 0));
	yield* new_(T("/obj/effect/temp_visual/emp"), this.loc);
	return f.dot;
}, true);

rt.type(12149, "/obj/structure/destructible/clockwork/massive", "/obj/structure/destructible/clockwork", {
	name: "massive construct",
	desc: "A very large construction.",
	layer: 11,
	density: 0,
	resistance_flags: 35,
});

// clock_structure.dm:146
rt.def("/obj/structure/destructible/clockwork/massive/proc/Initialize", function Initialize(f: Frame) {
	f.dot = parent_proc();
	GLOB.poi_list += this;
	return f.dot;
});

// clock_structure.dm:150
rt.def("/obj/structure/destructible/clockwork/massive/proc/Destroy", function* Destroy(f: Frame) {
	GLOB.poi_list -= this;
	return (yield* parent_proc());
}, true);

rt.type(12152, "/obj/structure/destructible/clockwork/powered", "/obj/structure/destructible/clockwork", {
	target_apc: null,
	active: 0,
	needs_power: 1,
	active_icon: null,
	inactive_icon: null,
});

// clock_structure.dm:166
rt.def("/obj/structure/destructible/clockwork/powered/proc/examine", function examine(f: Frame, user: Value) {
	let $1: any, $2: any, $4: any, $5: any;
	parent_proc();
	if (!(is_servant_of_ratvar(user) || rt.istype(user, T("/mob/dead/observer")))) return f.dot;
	let powered: Value = this.total_accessable_power();
	let sigil_number: Value = rt.length(this.check_apc_and_sigils());
	let $0: any = user;
	if (powered) {
		$1 = "brass";
	} else {
		$1 = "alloy";
	}
	if (powered == 1e+31) {
		$2 = "INFINITY";
	} else {
		$2 = `${powered}`;
	}
	let $3: any = sigil_number;
	if (sigil_number == 1) {
		$4 = "";
	} else {
		$4 = "s";
	}
	if (sigil_number == 1) {
		$5 = "is";
	} else {
		$5 = "are";
	}
	to_chat($0, `<span class='${$1}'>It has access to <b>${$2}W</b> of power, and <b>${$3}</b> Sigil${$4} of Transmission ${$5} in range.</span>`);
	return f.dot;
}, false);

// clock_structure.dm:174
rt.def("/obj/structure/destructible/clockwork/powered/proc/Destroy", function* Destroy(f: Frame) {
	GLOB.SSfastprocess.processing -= this;
	GLOB.SSobj.processing -= this;
	return (yield* parent_proc());
}, true);

// clock_structure.dm:179
rt.def("/obj/structure/destructible/clockwork/powered/proc/process", function process(f: Frame) {
	let powered: Value = null;
	return (powered = this.total_accessable_power()) == PROCESS_KILL ? 25 : powered;
}, false, { waitfor: false });

// clock_structure.dm:184
rt.def("/obj/structure/destructible/clockwork/powered/proc/can_be_unfasten_wrench", function can_be_unfasten_wrench(f: Frame, user: Value, silent: Value) {
	if (this.active) {
		if (!silent) {
			to_chat(user, `<span class='warning'>${this} needs to be disabled before it can be unsecured!</span>`);
		}
		return FAILED_UNFASTEN;
	}
	return parent_proc();
}, false);

// clock_structure.dm:191
rt.def("/obj/structure/destructible/clockwork/powered/proc/toggle", function toggle(f: Frame, fast_process: Value, user: Value) {
	let $0: any;
	if (user) {
		if (!is_servant_of_ratvar(user)) {
			return 0;
		}
		if (!this.anchored && !this.active) {
			to_chat(user, `<span class='warning'>${this} needs to be secured to the floor before it can be activated!</span>`);
			return 0;
		}
		$0 = user;
		$0 = `<span class='notice'>${$0} ${this.active ? "dis" : "en"}ables ${this}.</span>`;
		this.visible_message($0, `<span class='brass'>You ${this.active ? "dis" : "en"}able ${this}.</span>`);
	}
	this.active = (!this.active ? 1 : 0);
	if (this.active) {
		this.icon_state = this.active_icon;
		if (fast_process) {
			if (!this.isprocessing) {
				this.isprocessing = 1;
				GLOB.SSfastprocess.processing += this;
			}
		} else if (!this.isprocessing) {
			this.isprocessing = 1;
			GLOB.SSobj.processing += this;
		}
	} else {
		this.icon_state = this.inactive_icon;
		if (fast_process) {
			this.isprocessing = 0;
			GLOB.SSfastprocess.processing -= this;
		} else {
			this.isprocessing = 0;
			GLOB.SSobj.processing -= this;
		}
	}
	return 1;
});

// clock_structure.dm:214
rt.def("/obj/structure/destructible/clockwork/powered/proc/forced_disable", function forced_disable(f: Frame, bad_effects: Value) {
	if (!this.active) return f.dot;
	this.toggle();
	return f.dot;
});

// clock_structure.dm:217
rt.def("/obj/structure/destructible/clockwork/powered/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	if (!(yield* this.forced_disable(1))) return f.dot;
	yield* new_(T("/obj/effect/temp_visual/emp"), this.loc);
	return f.dot;
}, true);

// clock_structure.dm:221
rt.def("/obj/structure/destructible/clockwork/powered/proc/total_accessable_power", function total_accessable_power(f: Frame) {
	if (!this.needs_power || GLOB.ratvar_awakens) {
		return 1e+31;
	}
	let power: Value = 0;
	power += this.accessable_apc_power();
	return (power += this.accessable_sigil_power());
});

// clock_structure.dm:231
rt.def("/obj/structure/destructible/clockwork/powered/proc/accessable_apc_power", function accessable_apc_power(f: Frame) {
	let targetAPCA: Value = null, APC: Value = null, APCA: Value = null, apccharge: Value = null;
	let power: Value = 0;
	let A: Value = get_area(this);
	for (APC of each(GLOB.apcs_list, T("/obj/machinery/power/apc"))) {
		if ((APCA = get_area(APC)) == A) {
			this.target_apc = APC;
		}
	}
	if (this.target_apc) {
		if ((targetAPCA = get_area(this.target_apc)) != A) {
			this.target_apc = null;
		} else if (this.target_apc.cell) {
			if ((apccharge = this.target_apc.cell.charge) >= MIN_CLOCKCULT_POWER) {
				power += apccharge;
			}
		}
	}
	return power;
});

// clock_structure.dm:249
rt.def("/obj/structure/destructible/clockwork/powered/proc/accessable_sigil_power", function accessable_sigil_power(f: Frame) {
	let _T: Value = null;
	let power: Value = 0;
	for (_T of each(range(SIGIL_ACCESS_RANGE, this), T("/obj/effect/clockwork/sigil/transmission"))) {
		power += _T.power_charge;
	}
	return power;
});

// clock_structure.dm:255
rt.def("/obj/structure/destructible/clockwork/powered/proc/try_use_power", function* try_use_power(f: Frame, amount: Value) {
	let power: Value = null;
	if (!this.needs_power || GLOB.ratvar_awakens) {
		return 1;
	}
	if (amount <= 0) {
		return 0;
	}
	if (!(power = this.total_accessable_power()) || power < amount) {
		return 0;
	}
	return (yield* this.use_power(amount));
}, true);

// clock_structure.dm:265
rt.def("/obj/structure/destructible/clockwork/powered/proc/use_power", function* use_power(f: Frame, amount: Value) {
	let _T: Value = null, S: Value = null, _T_3: Value = null;
	let sigilpower: Value = this.accessable_sigil_power();
	let sigils_in_range: Value = list();
	for (_T of each(range(SIGIL_ACCESS_RANGE, this), T("/obj/effect/clockwork/sigil/transmission"))) {
		sigils_in_range += _T;
	}
	while (sigilpower && amount >= MIN_CLOCKCULT_POWER) {
		S = null;
		for (S of each(sigils_in_range)) {
			_T_3 = S;
			if (amount >= MIN_CLOCKCULT_POWER && _T_3.modify_charge(MIN_CLOCKCULT_POWER)) {
				sigilpower -= MIN_CLOCKCULT_POWER;
				amount -= MIN_CLOCKCULT_POWER;
			}
		}
	}
	let apcpower: Value = this.accessable_apc_power();
	while (apcpower >= MIN_CLOCKCULT_POWER && amount >= MIN_CLOCKCULT_POWER) {
		if (yield* this.target_apc.cell.use(MIN_CLOCKCULT_POWER)) {
			apcpower -= MIN_CLOCKCULT_POWER;
			amount -= MIN_CLOCKCULT_POWER;
			this.target_apc.charging = 1;
			this.target_apc.chargemode = 1;
			yield* this.target_apc.update();
			yield* this.target_apc.update_icon();
			yield* this.target_apc.updateUsrDialog();
		} else {
			apcpower = 0;
		}
	}
	if (amount) {
		return 0;
	} else {
		return 1;
	}
}, true);

// clock_structure.dm:293
rt.def("/obj/structure/destructible/clockwork/powered/proc/return_power", function* return_power(f: Frame, amount: Value) {
	let sigils_in_range: Value = null, S: Value = null, _T: Value = null;
	if (amount <= 0) {
		return 0;
	}
	if (!rt.istype((sigils_in_range = this.check_apc_and_sigils()), T("/list"))) {
		return 0;
	}
	if (rt.len(f, sigils_in_range)) {
		while (amount >= MIN_CLOCKCULT_POWER) {
			S = null;
			for (S of each(sigils_in_range)) {
				_T = S;
				if (amount >= MIN_CLOCKCULT_POWER && _T.modify_charge(-25)) {
					amount -= MIN_CLOCKCULT_POWER;
				}
			}
		}
	}
	if (this.target_apc && this.target_apc.cell && (yield* this.target_apc.cell.give(amount))) {
		this.target_apc.charging = 1;
		this.target_apc.chargemode = 1;
		yield* this.target_apc.update();
		yield* this.target_apc.update_icon();
		yield* this.target_apc.updateUsrDialog();
	}
	return 1;
}, true);

// clock_structure.dm:313
rt.def("/obj/structure/destructible/clockwork/powered/proc/check_apc_and_sigils", function check_apc_and_sigils(f: Frame) {
	let _T: Value = null, L: Value = null;
	f.dot = list();
	for (_T of each(range(SIGIL_ACCESS_RANGE, this), T("/obj/effect/clockwork/sigil/transmission"))) {
		f.dot += _T;
	}
	if (!(!rt.len(f, (L = f.dot)) && (!this.target_apc || !this.target_apc.cell))) return f.dot;
	return 0;
});
