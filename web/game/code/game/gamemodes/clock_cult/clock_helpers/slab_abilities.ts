// Based on /tg/station's code/game/gamemodes/clock_cult/clock_helpers/slab_abilities.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(11262, "/obj/effect/proc_holder/slab", "/obj/effect/proc_holder", {
	slab: null,
	successful: 0,
	finished: 0,
	in_progress: 0,
});

// slab_abilities.dm:10
rt.def("/obj/effect/proc_holder/slab/proc/Destroy", function* Destroy(f: Frame) {
	this.slab = null;
	return (yield* parent_proc());
}, true);

// slab_abilities.dm:13
rt.def("/obj/effect/proc_holder/slab/proc/remove_ranged_ability", function* remove_ranged_ability(f: Frame, msg: Value) {
	yield* parent_proc();
	this.finished = 1;
	yield* addtimer((yield* new_(T("/datum/callback"), "some_magic_bullshit", P("/proc/qdel"), this)), 6, 8);
	return f.dot;
}, true);

// slab_abilities.dm:18
rt.def("/obj/effect/proc_holder/slab/proc/InterceptClickOn", function* InterceptClickOn(f: Frame, caller: Value, params: Value, target: Value) {
	if ((yield* parent_proc()) || this.in_progress) {
		return 1;
	}
	if (!(this.ranged_ability_user.incapacitated() || !this.slab || !rt.isIn(f, this.slab, this.ranged_ability_user.held_items) || target == this.slab)) return f.dot;
	yield* this.remove_ranged_ability();
	return 1;
}, true);

rt.type(11263, "/obj/effect/proc_holder/slab/geis", "/obj/effect/proc_holder/slab", {
	ranged_mousepointer: rt.rsc("icons/effects/geis_target.dmi"),
});

// slab_abilities.dm:29
rt.def("/obj/effect/proc_holder/slab/geis/proc/InterceptClickOn", function* InterceptClickOn(f: Frame, caller: Value, params: Value, target: Value) {
	let _T: Value = null, target_is_binding: Value = null, GB: Value = null, m: Value = null, L: Value = null, GB_3: Value = null, conversion: Value = null;
	if (yield* parent_proc()) {
		return 1;
	}
	if (!isturf((_T = this.ranged_ability_user.loc))) {
		return 1;
	}
	if (((target_is_binding = (rt.istype(target, T("/obj/structure/destructible/clockwork/geis_binding")) ? 1 : 0)) || rt.istype(target, T("/mob/living"))) && this.ranged_ability_user.Adjacent(target)) {
		if (target_is_binding) {
			yield* (GB = target).repair_and_interrupt();
			for (m of each(GB.buckled_mobs)) {
				if (m) {
					add_logs(this.ranged_ability_user, m, "rebound with Geis");
				}
			}
			this.successful = 1;
		} else {
			if ((L = target).null_rod_check()) {
				to_chat(this.ranged_ability_user, "<span class='sevtug'>\"A void weapon? Really, you expect me to be able to do anything?\"</span>");
				return 1;
			}
			if (is_servant_of_ratvar(L)) {
				if (L != this.ranged_ability_user) {
					to_chat(this.ranged_ability_user, `<span class='sevtug'>"${L.p_they(1)} already serve${L.p_s()} Ratvar. ${text2ratvar(`Perhaps ${this.ranged_ability_user.p_theyre()} into bondage?`)}"</span>`);
				}
				return 1;
			}
			if (L.stat == 2) {
				to_chat(this.ranged_ability_user, `<span class='sevtug'>"${L.p_theyre(1)} dead, idiot."</span>`);
				return 1;
			}
			if (rt.istype(L.buckled, T("/obj/structure/destructible/clockwork/geis_binding"))) {
				yield* (GB_3 = L.buckled).repair_and_interrupt();
				add_logs(this.ranged_ability_user, L, "rebound with Geis");
				this.successful = 1;
			} else {
				this.in_progress = 1;
				yield* clockwork_say(this.ranged_ability_user, text2ratvar("Be bound, heathen!"));
				this.remove_mousepointer(this.ranged_ability_user.client);
				add_logs(this.ranged_ability_user, L, "bound with Geis");
				if (this.slab.speed_multiplier >= 0.5) {
					this.ranged_ability_user.notransform = 1;
					yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/effect/proc_holder/slab/geis/proc/reset_user_notransform"), this.ranged_ability_user)), 5);
				}
				this.slab.busy = null;
				(conversion = (yield* new_(T("/datum/clockwork_scripture/geis")))).slab = this.slab;
				conversion.invoker = this.ranged_ability_user;
				conversion.target = target;
				yield* conversion.run_scripture();
				this.successful = 1;
			}
		}
		yield* this.remove_ranged_ability();
	}
	return 1;
}, true);

// slab_abilities.dm:86
rt.def("/obj/effect/proc_holder/slab/geis/proc/reset_user_notransform", function reset_user_notransform(f: Frame, user: Value) {
	if (!user) return f.dot;
	user.notransform = 0;
	return f.dot;
}, false, { argTypes: [{ type: 8, path: "/mob/living" }] });

rt.type(11264, "/obj/effect/proc_holder/slab/compromise", "/obj/effect/proc_holder/slab", {
	ranged_mousepointer: rt.rsc("icons/effects/compromise_target.dmi"),
});

// slab_abilities.dm:93
rt.def("/obj/effect/proc_holder/slab/compromise/proc/InterceptClickOn", function* InterceptClickOn(f: Frame, caller: Value, params: Value, target: Value) {
	let _T: Value = null, L: Value = null, brutedamage: Value = null, burndamage: Value = null, oxydamage: Value = null, totaldamage: Value = null, targetturf: Value = null, has_holy_water: Value = null, healseverity: Value = null, i: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	if (yield* parent_proc()) {
		return 1;
	}
	if (!isturf((_T = this.ranged_ability_user.loc))) {
		return 1;
	}
	if (rt.istype(target, T("/mob/living")) && rt.isIn(f, target, view(7, rt.getStep(f, this.ranged_ability_user, 0)))) {
		if (!is_servant_of_ratvar((L = target))) {
			to_chat(this.ranged_ability_user, `<span class='inathneq'>"${L} does not yet serve Ratvar."</span>`);
			return 1;
		}
		if (L.stat == 2) {
			to_chat(this.ranged_ability_user, `<span class='inathneq'>"${L.p_they(1)} ${L.p_are()} dead. ${text2ratvar("Oh, child. To have your life cut short...")}"</span>`);
			return 1;
		}
		brutedamage = L.getBruteLoss();
		burndamage = L.getFireLoss();
		oxydamage = L.getOxyLoss();
		if (!(totaldamage = brutedamage + burndamage + oxydamage) && (!L.reagents || !L.reagents.has_reagent("holywater"))) {
			to_chat(this.ranged_ability_user, `<span class='inathneq'>"${L} is unhurt and untainted."</span>`);
			return 1;
		}
		this.successful = 1;
		$0 = this.ranged_ability_user;
		if (L == this.ranged_ability_user) {
			$1 = "yourself";
		} else {
			$1 = `${L}`;
		}
		to_chat($0, `<span class='brass'>You bathe ${$1} in Inath-neq's power!</span>`);
		targetturf = rt.getStep(f, L, 0);
		has_holy_water = (L.reagents && L.reagents.has_reagent("holywater"));
		healseverity = max(round(totaldamage * 0.05, 1), 1);
		rt.forRange(f, 0, 1, healseverity, 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			yield* new_(T("/obj/effect/temp_visual/heal"), targetturf, "#1E8CE1");
		}
		rt.endFor(f, 0);
		if (totaldamage) {
			yield* L.adjustBruteLoss(-brutedamage);
			yield* L.adjustFireLoss(-burndamage);
			yield* L.adjustOxyLoss(-oxydamage);
			yield* L.adjustToxLoss(totaldamage * 0.5, 1, 1);
			$0 = this.ranged_ability_user;
			if (has_holy_water) {
				$1 = "Heal tainted";
			} else {
				$1 = "Mend wounded";
			}
			yield* clockwork_say($0, text2ratvar(`${$1} flesh!`));
			add_logs(this.ranged_ability_user, L, "healed with Sentinel's Compromise");
			$0 = L;
			$1 = L;
			if (has_holy_water) {

				$2 = `causing ${L.p_them()} to briefly glow as it mends`;
			} else {
				$2 = " mending";
			}
			$1 = `<span class='warning'>A blue light washes over ${$1}, ${$2} ${L.p_their()} bruises and burns!</span>`;
			if (has_holy_water) {
				$2 = " and purging the darkness within you";
			} else {
				$2 = "";
			}
			$0.visible_message($1, `<span class='heavy_brass'>You feel Inath-neq's power healing your wounds${$2}, but a deep nausea overcomes you!</span>`);
		} else {
			yield* clockwork_say(this.ranged_ability_user, text2ratvar("Purge foul darkness!"));
			add_logs(this.ranged_ability_user, L, "purged of holy water with Sentinel's Compromise");
			L.visible_message(`<span class='warning'>A blue light washes over ${L}, causing ${L.p_them()} to briefly glow!</span>`, "<span class='heavy_brass'>You feel Inath-neq's power purging the darkness within you!</span>");
		}
		playsound(targetturf, rt.rsc("sound/magic/staff_healing.ogg"), 50, 1);
		if (has_holy_water) {
			yield* L.reagents.remove_reagent("holywater", 1000);
		}
		yield* this.remove_ranged_ability();
	}
	return 1;
}, true);

rt.type(11265, "/obj/effect/proc_holder/slab/volt", "/obj/effect/proc_holder/slab", {
	ranged_mousepointer: rt.rsc("icons/effects/volt_target.dmi"),
});

// slab_abilities.dm:153
rt.def("/obj/effect/proc_holder/slab/volt/proc/InterceptClickOn", function* InterceptClickOn(f: Frame, caller: Value, params: Value, target: Value) {
	let _T: Value = null;
	if (target == this.slab || (yield* parent_proc())) {
		return 1;
	}
	if (!isturf((_T = this.ranged_ability_user.loc))) {
		return 1;
	}
	if (rt.isIn(f, target, view(7, rt.getStep(f, this.ranged_ability_user, 0)))) {
		this.successful = 1;
		this.ranged_ability_user.visible_message(`<span class='warning'>${this.ranged_ability_user} fires a ray of energy at ${target}!</span>`, `<span class='nzcrentr'>You fire a volt ray at ${target}.</span>`);
		playsound(this.ranged_ability_user, rt.rsc("sound/effects/light_flicker.ogg"), 50, 1);
		yield* new_(T("/obj/effect/temp_visual/ratvar/volt_hit"), (_T = rt.getStep(f, target, 0)), this.ranged_ability_user);
		add_logs(this.ranged_ability_user, _T, "fired a volt ray");
		yield* this.remove_ranged_ability();
	}
	return 1;
}, true);

rt.type(11266, "/obj/effect/proc_holder/slab/vanguard", "/obj/effect/proc_holder/slab", {
	ranged_mousepointer: rt.rsc("icons/effects/vanguard_target.dmi"),
});

// slab_abilities.dm:176
rt.def("/obj/effect/proc_holder/slab/vanguard/proc/InterceptClickOn", function* InterceptClickOn(f: Frame, caller: Value, params: Value, target: Value) {
	let _T: Value = null, L: Value = null, LT: Value = null;
	if (yield* parent_proc()) {
		return 1;
	}
	if (!isturf((_T = this.ranged_ability_user.loc))) {
		return 1;
	}
	if (rt.istype(target, T("/mob/living")) && rt.isIn(f, target, view(7, rt.getStep(f, this.ranged_ability_user, 0)))) {
		if (!is_servant_of_ratvar((L = target))) {
			to_chat(this.ranged_ability_user, `<span class='inathneq'>"${L} does not yet serve Ratvar."</span>`);
			return 1;
		}
		if (L.stat == 2) {
			to_chat(this.ranged_ability_user, `<span class='inathneq'>"${L.p_they(1)} ${L.p_are()} dead. ${text2ratvar("Oh, child. To have your life cut short...")}"</span>`);
			return 1;
		}
		if (rt.istype(L.stun_absorption, T("/list")) && rt.index(L.stun_absorption, "vanguard") && rt.index(rt.index(L.stun_absorption, "vanguard"), "end_time") > rt.worldTime(f)) {
			to_chat(this.ranged_ability_user, `<span class='inathneq'>"${L.p_they(1)} ${L.p_are()} already shielded by a Vanguard."</span>`);
			return 1;
		}
		this.successful = 1;
		if (L == this.ranged_ability_user) {
			for (LT of each(spiral_range(7, _T), T("/mob/living"))) {
				if (LT.stat == 2 || !is_servant_of_ratvar(LT) || LT == this.ranged_ability_user || !rt.isIn(f, LT, view(7, rt.getStep(f, this.ranged_ability_user, 0))) || rt.istype(LT.stun_absorption, T("/list")) && rt.index(LT.stun_absorption, "vanguard") && rt.index(rt.index(LT.stun_absorption, "vanguard"), "end_time") > rt.worldTime(f)) {
					continue;
				}
				L = LT;
				break;
			}
		}
		yield* L.apply_status_effect(T("/datum/status_effect/vanguard_shield"));
		yield* this.ranged_ability_user.apply_status_effect(T("/datum/status_effect/vanguard_shield"));
		yield* clockwork_say(this.ranged_ability_user, text2ratvar("Shield us from darkness!"));
		yield* this.remove_ranged_ability();
	}
	return 1;
}, true);

rt.type(11267, "/obj/effect/proc_holder/slab/judicial", "/obj/effect/proc_holder/slab", {
	ranged_mousepointer: rt.rsc("icons/effects/visor_reticule.dmi"),
});

// slab_abilities.dm:219
rt.def("/obj/effect/proc_holder/slab/judicial/proc/InterceptClickOn", function* InterceptClickOn(f: Frame, caller: Value, params: Value, target: Value) {
	let _T: Value = null, targetturf: Value = null;
	if (yield* parent_proc()) {
		return 1;
	}
	if (!isturf((_T = this.ranged_ability_user.loc))) {
		return 1;
	}
	if (rt.isIn(f, target, view(7, rt.getStep(f, this.ranged_ability_user, 0)))) {
		this.successful = 1;
		yield* clockwork_say(this.ranged_ability_user, text2ratvar("Kneel, heathens!"));
		this.ranged_ability_user.visible_message(`<span class='warning'>${this.ranged_ability_user}'s eyes fire a stream of energy at ${target}, creating a strange mark!</span>`, `<span class='heavy_brass'>You direct the judicial force to ${target}.</span>`);
		yield* new_(T("/obj/effect/clockwork/judicial_marker"), (targetturf = rt.getStep(f, target, 0)), this.ranged_ability_user);
		add_logs(this.ranged_ability_user, targetturf, "created a judicial marker");
		yield* this.remove_ranged_ability();
	}
	return 1;
}, true);
