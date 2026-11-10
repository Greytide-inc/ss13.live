// Based on /tg/station's code/game/gamemodes/clock_cult/clock_structures/interdiction_lens.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(12154, "/obj/structure/destructible/clockwork/powered/interdiction_lens", "/obj/structure/destructible/clockwork/powered", {
	recharging: 0,
	recharge_time: 1200,
	disabled: 0,
	interdiction_range: 14,
	clockwork_desc: "A powerful totem that constantly drains nearby electronics and funnels the power drained into nearby Sigils of Transmission or the area's APC.",
	construction_value: 20,
	active_icon: "interdiction_lens_active",
	inactive_icon: "interdiction_lens",
	unanchored_icon: "interdiction_lens_unwrenched",
	name: "interdiction lens",
	desc: "An ominous, double-pronged brass totem. There's a strange gemstone clasped between the pincers.",
	icon_state: "interdiction_lens",
	break_message: "<span class='warning'>The lens flares a blinding violet before the totem beneath it shatters!</span>",
	break_sound: rt.rsc("sound/effects/glassbr3.ogg"),
	debris: null,
}, { global: { rage_messages: 784 } });

// interdiction_lens.dm:13
rt.def("/obj/structure/destructible/clockwork/powered/interdiction_lens/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.debris = rt.alist(f, [T("/obj/item/clockwork/alloy_shards/small"), 2, T("/obj/item/clockwork/alloy_shards/large"), 2, T("/obj/item/clockwork/component/belligerent_eye/lens_gem"), 1]);
	return f.dot;
});

// interdiction_lens.dm:23
rt.def("/obj/structure/destructible/clockwork/powered/interdiction_lens/proc/Initialize", function Initialize(f: Frame) {
	f.dot = parent_proc();
	this.update_current_glow();
	return f.dot;
});

// interdiction_lens.dm:27
rt.def("/obj/structure/destructible/clockwork/powered/interdiction_lens/proc/examine", function examine(f: Frame, user: Value) {
	let $1: any, $2: any;
	parent_proc();
	let $0: any = user;
	if (this.recharging > rt.worldTime(f)) {
		$1 = "neovgre_small";
	} else {
		$1 = "brass";
	}
	if (this.recharging > rt.worldTime(f)) {
		$2 = "has been breached by writhing tendrils of blackness that cover the totem";
	} else {
		$2 = "vibrates in place and thrums with power";
	}
	to_chat($0, `<span class='${$1}'>Its gemstone ${$2}.</span>`);
	if (!(is_servant_of_ratvar(user) || rt.istype(user, T("/mob/dead/observer")))) return f.dot;
	to_chat(user, `<span class='neovgre_small'>If it fails to drain any electronics or has nothing to return power to, it will disable itself for <b>${round(this.recharge_time / 600, 1)}</b> minutes.</span>`);
	return f.dot;
}, false);

// interdiction_lens.dm:34
rt.def("/obj/structure/destructible/clockwork/powered/interdiction_lens/proc/update_anchored", function* update_anchored(f: Frame, user: Value, do_damage: Value) {
	yield* parent_proc();
	this.update_current_glow();
	return f.dot;
}, true);

// interdiction_lens.dm:38
rt.def("/obj/structure/destructible/clockwork/powered/interdiction_lens/proc/toggle", function toggle(f: Frame, fast_process: Value, user: Value) {
	f.dot = parent_proc();
	this.update_current_glow();
	return f.dot;
}, false);

// interdiction_lens.dm:44
rt.def("/obj/structure/destructible/clockwork/powered/interdiction_lens/proc/update_current_glow", function update_current_glow(f: Frame) {
	if (this.active) {
		if (this.disabled) {
			this.set_light(2, 1.6, "#151200");
		} else {
			this.set_light(2, 1.6, "#EE54EE");
		}
	} else if (this.anchored) {
		this.set_light(1.4, 0.8, "#F42B9D");
	} else {
		this.set_light(0);
	}
	return f.dot;
});

// interdiction_lens.dm:54
rt.def("/obj/structure/destructible/clockwork/powered/interdiction_lens/proc/attack_hand", function attack_hand(f: Frame, user: Value) {
	if (!user.canUseTopic(this, (!rt.istype(user, T("/mob/living/silicon")) ? 1 : 0), 1)) return f.dot;
	if (this.disabled) {
		to_chat(user, "<span class='warning'>As you place your hand on the gemstone, cold tendrils of black matter crawl up your arm. You quickly pull back.</span>");
		return 0;
	}
	this.toggle(0, user);
	return f.dot;
});

// interdiction_lens.dm:61
rt.def("/obj/structure/destructible/clockwork/powered/interdiction_lens/proc/forced_disable", function forced_disable(f: Frame, bad_effects: Value) {
	if (this.disabled || !this.anchored) {
		return 0;
	}
	if (!this.active) {
		this.toggle(0);
	}
	this.visible_message("<span class='warning'>The gemstone suddenly turns horribly dark, writhing tendrils covering it!</span>");
	this.recharging = rt.worldTime(f) + this.recharge_time;
	flick("interdiction_lens_discharged", this);
	this.icon_state = "interdiction_lens_inactive";
	this.disabled = 1;
	this.update_current_glow();
	return 1;
});

// interdiction_lens.dm:74
rt.def("/obj/structure/destructible/clockwork/powered/interdiction_lens/proc/process", function* process(f: Frame) {
	let successfulprocess: Value = null, power_drained: Value = null, atoms_to_test: Value = null, A: Value = null, _T: Value = null, M: Value = null, unconverted_ai: Value = null, efficiency: Value = null, rage_modifier: Value = null, i: Value = null, AI: Value = null, M_6: Value = null, A_7: Value = null, C: Value = null, O: Value = null;
	f.dot = (yield* parent_proc());
	if (this.recharging > rt.worldTime(f)) {
		return f.dot;
	}
	if (this.disabled) {
		this.visible_message("<span class='warning'>The writhing tendrils return to the gemstone, which begins to glow with power!</span>");
		flick("interdiction_lens_recharged", this);
		this.disabled = 0;
		yield* this.toggle(0);
	} else {
		if (!this.check_apc_and_sigils()) {
			yield* this.forced_disable();
			return f.dot;
		}
		successfulprocess = 0;
		power_drained = 0;
		atoms_to_test = list();
		for (A of each((yield* spiral_range_turfs(this.interdiction_range, this)))) {
			_T = A;
			M = null;
			for (M of each(_T)) {
				(atoms_to_test = rt.modify(atoms_to_test, M, rt.bitOr));
			}
			if (rt.tickUsage(f) > GLOB.current_ticklimit) {
				yield* stoplag();
			}
		}
		unconverted_ai = 0;
		efficiency = this.get_efficiency_mod();
		rage_modifier = this.get_efficiency_mod(1);
		for (i of each(GLOB.ai_list)) {
			if ((AI = i) && AI.stat != 2 && !is_servant_of_ratvar(AI)) {
				unconverted_ai = 1;
			}
		}
		for (M_6 of each(atoms_to_test)) {
			if (!(A_7 = M_6) || !A_7 || A_7.gc_destroyed || A_7 == this.target_apc) {
				continue;
			}
			power_drained += Floor((yield* A_7.power_drain(1)) * efficiency, MIN_CLOCKCULT_POWER);
			if (prob(1 * rage_modifier)) {
				to_chat(A_7, `<span class='neovgre'>"${text2ratvar(pick(GLOB.rage_messages))}"</span>`);
			}
			if (prob(100 * (efficiency * efficiency))) {
				if (rt.istype(A_7, T("/obj/machinery/camera")) && unconverted_ai) {
					if ((C = A_7).isEmpProof() || !C.status) {
						continue;
					}
					successfulprocess = 1;
					if (C.emped) {
						continue;
					}
					yield* C.emp_act(1);
				} else if (rt.istype(A_7, T("/obj/item/device/radio"))) {
					O = A_7;
					successfulprocess = 1;
					if (O.emped || !O.on) {
						continue;
					}
					yield* O.emp_act(1);
				} else if (rt.istype(A_7, T("/mob/living")) && !is_servant_of_ratvar(A_7) || rt.istype(A_7, T("/obj/structure/closet")) || rt.istype(A_7, T("/obj/item/weapon/storage"))) {
					O = null;
					for (O of each(A_7.GetAllContents(), T("/obj/item/device/radio"))) {
						successfulprocess = 1;
						if (O.emped || !O.on) {
							continue;
						}
						yield* O.emp_act(1);
					}
				}
			}
			if (rt.tickUsage(f) > GLOB.current_ticklimit) {
				yield* stoplag();
			}
		}
		if (power_drained && power_drained >= MIN_CLOCKCULT_POWER && (yield* this.return_power(power_drained))) {
			successfulprocess = 1;
			playsound(this, rt.rsc("sound/items/pshoom.ogg"), 50 * efficiency, 1, this.interdiction_range - 7, 1);
		}
		if (successfulprocess) return f.dot;
		yield* this.forced_disable();
	}
	return f.dot;
}, true, { waitfor: false });
