// Based on /tg/station's code/game/gamemodes/clock_cult/clock_structures/ark_of_the_clockwork_justicar.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, subtract } = rt;


rt.type(12150, "/obj/structure/destructible/clockwork/massive/celestial_gateway", "/obj/structure/destructible/clockwork/massive", {
	progress_in_seconds: 0,
	purpose_fulfilled: 0,
	first_sound_played: 0,
	second_sound_played: 0,
	third_sound_played: 0,
	fourth_sound_played: 0,
	glow: null,
	countdown: null,
	required_components: null,
	clockwork_desc: "A portal to the Celestial Derelict. Massive and intimidating, it is the only thing that can both transport Ratvar and withstand the massive amount of energy he emits.",
	can_be_repaired: 0,
	immune_to_servant_attacks: 1,
	name: "ark of the Clockwork Justicar",
	desc: "A massive, thrumming rip in spacetime.",
	obj_integrity: 500,
	max_integrity: 500,
	mouse_opacity: 2,
	icon: rt.rsc("icons/effects/clockwork_effects.dmi"),
	icon_state: "nothing",
	density: 0,
	invisibility: 100,
	resistance_flags: 98,
});

// ark_of_the_clockwork_justicar.dm:24
rt.def("/obj/structure/destructible/clockwork/massive/celestial_gateway/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.required_components = rt.alist(f, ["belligerent_eye", 15, "vanguard_cogwheel", 15, "geis_capacitor", 15, "replicant_alloy", 15, "hierophant_ansible", 15]);
	return f.dot;
});

// ark_of_the_clockwork_justicar.dm:27
rt.def("/obj/structure/destructible/clockwork/massive/celestial_gateway/proc/Initialize", function Initialize(f: Frame) {
	f.dot = parent_proc();
	ImmediateInvokeAsync(this, P("/obj/structure/destructible/clockwork/massive/celestial_gateway/proc/spawn_animation"));
	return f.dot;
});

// ark_of_the_clockwork_justicar.dm:31
rt.def("/obj/structure/destructible/clockwork/massive/celestial_gateway/proc/spawn_animation", function* spawn_animation(f: Frame) {
	let _T: Value = null, OT: Value = null, L: Value = null, gate_area: Value = null;
	yield* new_(T("/obj/effect/clockwork/general_marker/inathneq"), (_T = rt.getStep(f, this, 0)));
	hierophant_message(`<span class='inathneq'>"${text2ratvar("Engine, come forth and show your servants your mercy")}!"</span>`);
	playsound(_T, rt.rsc("sound/magic/clockwork/invoke_general.ogg"), 30, 0);
	yield* sleep(10);
	yield* new_(T("/obj/effect/clockwork/general_marker/sevtug"), _T);
	hierophant_message(`<span class='sevtug'>"${text2ratvar("Engine, come forth and show this station your decorating skills")}!"</span>`);
	playsound(_T, rt.rsc("sound/magic/clockwork/invoke_general.ogg"), 45, 0);
	yield* sleep(10);
	yield* new_(T("/obj/effect/clockwork/general_marker/nezbere"), _T);
	hierophant_message(`<span class='nezbere'>"${text2ratvar("Engine, come forth and shine your light across this realm")}!!"</span>`);
	playsound(_T, rt.rsc("sound/magic/clockwork/invoke_general.ogg"), 60, 0);
	yield* sleep(10);
	yield* new_(T("/obj/effect/clockwork/general_marker/nzcrentr"), _T);
	hierophant_message(`<span class='nzcrentr'>"${text2ratvar("Engine, come forth")}."</span>`);
	playsound(_T, rt.rsc("sound/magic/clockwork/invoke_general.ogg"), 75, 0);
	yield* sleep(10);
	playsound(_T, rt.rsc("sound/magic/clockwork/invoke_general.ogg"), 100, 0);
	let open_turfs: Value = list();
	for (OT of each(orange(1, _T), T("/turf/open"))) {
		if (!is_blocked_turf(OT, 1)) {
			(open_turfs = rt.modify(open_turfs, OT, rt.bitOr));
		}
	}
	if (rt.len(f, open_turfs)) {
		for (L of each(_T, T("/mob/living"))) {
			yield* L.forceMove(pick(open_turfs));
		}
	}
	(rt.modSrcVar(f, "resistance_flags", 16777151, rt.bitAnd));
	this.density = 1;
	this.invisibility = 0;
	this.glow = (yield* new_(T("/obj/effect/clockwork/overlay/gateway_glow"), rt.getStep(f, this, 0)));
	this.countdown = (yield* new_(T("/obj/effect/countdown/clockworkgate"), this));
	yield* this.countdown.start();
	hierophant_message(`<span class='large_brass'><b>An Ark of the Clockwork Justicar has been created in ${(gate_area = get_area(this)).map_name}!</b></span>`, 0, this);
	yield* GLOB.SSshuttle.registerHostileEnvironment(this);
	if (this.isprocessing) return f.dot;
	this.isprocessing = 1;
	GLOB.SSprocessing.processing += this;
	return f.dot;
}, true);

// ark_of_the_clockwork_justicar.dm:68
rt.def("/obj/structure/destructible/clockwork/massive/celestial_gateway/proc/Destroy", function* Destroy(f: Frame) {
	let gate_area: Value = null;
	this.isprocessing = 0;
	GLOB.SSprocessing.processing -= this;
	if (!this.purpose_fulfilled) {
		hierophant_message(`<span class='large_brass'><b>An Ark of the Clockwork Justicar has fallen at ${(gate_area = get_area(this)).map_name}!</b></span>`);
		send_to_playing_players((yield* sound(null, 0, { channel: 1020 })));
	}
	let was_stranded: Value = (GLOB.SSshuttle.emergency.mode == "stranded" ? 1 : 0);
	yield* GLOB.SSshuttle.clearHostileEnvironment(this);
	if (!was_stranded && !this.purpose_fulfilled) {
		yield* priority_announce("Massive energy anomaly no longer on short-range scanners.", "Anomaly Alert");
	}
	if (this.glow) {
		yield* qdel(this.glow);
		this.glow = null;
	}
	if (this.countdown) {
		yield* qdel(this.countdown);
		this.countdown = null;
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// ark_of_the_clockwork_justicar.dm:86
rt.def("/obj/structure/destructible/clockwork/massive/celestial_gateway/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	disassembled ??= 1;
	if (!rt.bitAnd(this.flags, NODECONSTRUCT)) {
		if (!disassembled) {
			(rt.modSrcVar(f, "resistance_flags", INDESTRUCTIBLE, rt.bitOr));
			yield* this.countdown.stop();
			this.visible_message(`<span class='userdanger'>${this} begins to pulse uncontrollably... you might want to run!</span>`);
			send_to_playing_players((yield* sound(rt.rsc("sound/effects/clockcult_gateway_disrupted.ogg"), 0, { channel: 1020, volume: 50 })));
			yield* this.make_glow();
			this.glow.icon_state = "clockwork_gateway_disrupted";
			(rt.modSrcVar(f, "resistance_flags", INDESTRUCTIBLE, rt.bitOr));
			yield* sleep(27);
			yield* explosion(this, 1, 3, 8, 8);
		}
	}
	yield* qdel(this);
	return f.dot;
}, true);

// ark_of_the_clockwork_justicar.dm:100
rt.def("/obj/structure/destructible/clockwork/massive/celestial_gateway/proc/make_glow", function* make_glow(f: Frame) {
	if (this.glow) return f.dot;
	this.glow = (yield* new_(T("/obj/effect/clockwork/overlay/gateway_glow"), rt.getStep(f, this, 0)));
	this.glow.linked = this;
	return f.dot;
}, true);

// ark_of_the_clockwork_justicar.dm:105
rt.def("/obj/structure/destructible/clockwork/massive/celestial_gateway/proc/ex_act", function* ex_act(f: Frame, severity: Value) {
	let damage: Value = null;
	yield* this.take_damage((damage = max(this.obj_integrity * 0.7 / severity, 100)), "brute", "bomb", 0);
	return f.dot;
}, true, { waitfor: false });

// ark_of_the_clockwork_justicar.dm:109
rt.def("/obj/structure/destructible/clockwork/massive/celestial_gateway/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let C: Value = null, S: Value = null, used_components: Value = null, used_all: Value = null, i: Value = null, to_use: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	if (!is_servant_of_ratvar(user) || !this.still_needs_components()) {
		return (yield* parent_proc());
	}
	if (rt.istype(I, T("/obj/item/clockwork/component"))) {
		C = I;
		if (rt.index(this.required_components, C.component_id)) {
			rt.incAt(this.required_components, C.component_id, -1, true);
			to_chat(user, `<span class='notice'>You add ${C} to ${this}.</span>`);
			yield* user.drop_item();
			yield* qdel(C);
		} else {
			$0 = user;
			$1 = this;
			$2 = get_component_name(C.component_id);
			to_chat($0, `<span class='notice'>${$1} has enough ${$2}${C.component_id != "replicant_alloy" ? "s" : ""}.</span>`);
		}
		return 1;
	} else if (rt.istype(I, T("/obj/item/clockwork/slab"))) {
		S = I;
		used_components = 0;
		used_all = 1;
		for (i of each(S.stored_components)) {
			if (rt.index(this.required_components, i)) {
				to_use = min(rt.index(S.stored_components, i), rt.index(this.required_components, i));
				(rt.modAt(this.required_components, i, to_use, subtract));
				(rt.modAt(S.stored_components, i, to_use, subtract));
				if (to_use) {
					used_components = 1;
				}
				if (rt.index(S.stored_components, i)) {
					used_all = 0;
				}
			}
		}
		if (used_components) {
			yield* update_slab_info(S);
			$0 = user;
			$1 = user;
			if (used_all) {

				$2 = "";
			} else {
				$2 = " partially";
			}
			$1 = `<span class='notice'>${$1}${$2} empties ${S} into ${this}.</span>`;
			if (used_all) {
				$2 = "all";
			} else {
				$2 = "some";
			}
			$0.visible_message($1, `<span class='notice'>You offload ${$2} of your slab's components into ${this}.</span>`);
		}
		return 1;
	} else {
		return (yield* parent_proc());
	}
}, true);

// ark_of_the_clockwork_justicar.dm:143
rt.def("/obj/structure/destructible/clockwork/massive/celestial_gateway/proc/still_needs_components", function still_needs_components(f: Frame) {
	let i: Value = null;
	for (i of each(this.required_components)) {
		if (rt.index(this.required_components, i)) {
			return 1;
		}
	}
	return f.dot;
});

// ark_of_the_clockwork_justicar.dm:148
rt.def("/obj/structure/destructible/clockwork/massive/celestial_gateway/proc/get_arrival_text", function get_arrival_text(f: Frame, s_on_time: Value) {
	f.dot = "IMMINENT";
	if (!this.obj_integrity) {
		f.dot = "DETONATING";
	} else {
		if (!(GATEWAY_RATVAR_ARRIVAL - this.progress_in_seconds > 0)) return f.dot;
		f.dot = `${round(max((GATEWAY_RATVAR_ARRIVAL - this.progress_in_seconds) / GATEWAY_SUMMON_RATE, 0), 1)}${s_on_time ? "S" : ""}`;
	}
	return f.dot;
});

// ark_of_the_clockwork_justicar.dm:155
rt.def("/obj/structure/destructible/clockwork/massive/celestial_gateway/proc/examine", function examine(f: Frame, user: Value) {
	let i: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $e: any;
	this.icon_state = "spatial_gateway";
	parent_proc();
	this.icon_state = rt.initial(f, this, "icon_state");
	if (is_servant_of_ratvar(user) || rt.istype(user, T("/mob/dead/observer"))) {
		if (this.still_needs_components()) {
			to_chat(user, "<span class='big'><b>Components required until activation:</b></span>");
			for (i of each(this.required_components)) {
				if (rt.index(this.required_components, i)) {
					$0 = user;
					$1 = get_component_span(i);
					$2 = get_component_name(i);
					if (i != "replicant_alloy") {
						$3 = "s";
					} else {
						$3 = "";
					}
					to_chat($0, `<span class='${$1}'>${$2}${$3}:</span> <span class='${get_component_span(i)}_large'>${rt.index(this.required_components, i)}</span>`);
				}
			}
		} else {
			to_chat(user, `<span class='big'><b>Seconds until Ratvar's arrival:</b> ${this.get_arrival_text(1)}</span>`);
			if (rt.inRange(this.progress_in_seconds, -1e+31, GATEWAY_REEBE_FOUND)) {
				to_chat(user, "<span class='heavy_brass'>It's still opening.</span>");
			} else if (rt.inRange(this.progress_in_seconds, GATEWAY_REEBE_FOUND, GATEWAY_RATVAR_COMING)) {
				to_chat(user, "<span class='heavy_brass'>It's reached the Celestial Derelict and is drawing power from it.</span>");
			} else if (rt.inRange(this.progress_in_seconds, GATEWAY_RATVAR_COMING, 1e+31)) {
				to_chat(user, "<span class='heavy_brass'>Ratvar is coming through the gateway!</span>");
			}
		}
	} else if (rt.inRange(this.progress_in_seconds, -1e+31, GATEWAY_REEBE_FOUND)) {
		to_chat(user, "<span class='warning'>It's a swirling mass of blackness.</span>");
	} else if (rt.inRange(this.progress_in_seconds, GATEWAY_REEBE_FOUND, GATEWAY_RATVAR_COMING)) {
		to_chat(user, "<span class='warning'>It seems to be leading somewhere.</span>");
	} else if (rt.inRange(this.progress_in_seconds, GATEWAY_RATVAR_COMING, 1e+31)) {
		to_chat(user, "<span class='boldwarning'>Something is coming through!</span>");
	}
	return f.dot;
}, false);

// ark_of_the_clockwork_justicar.dm:184
rt.def("/obj/structure/destructible/clockwork/massive/celestial_gateway/proc/process", function* process(f: Frame) {
	let M: Value = null, t: Value = null, _T: Value = null, W: Value = null, dist: Value = null, used_components: Value = null, i: Value = null, to_use: Value = null, O: Value = null, gate_area: Value = null, startpoint: Value = null, x0: Value = null, y0: Value = null, I: Value = null, _T_5: Value = null, dist_6: Value = null;
	let $e: any;
	if (!this.first_sound_played || prob(7)) {
		for (M of each(GLOB.player_list)) {
			if (M && !rt.istype(M, T("/mob/dead/new_player"))) {
				to_chat(M, `<span class='warning'><b>You hear otherworldly sounds from the ${dir2text(rt.getDir(f, rt.getStep(f, M, 0), rt.getStep(f, this, 0)))}...</span>`);
			}
		}
	}
	if (!this.obj_integrity) {
		return 0;
	}
	let convert_dist: Value = 1 + round(Floor(this.progress_in_seconds, 15) * 0.067);
	for (t of each(block(rt.locate(max(this.loc.x - convert_dist, 1), max(this.loc.y - convert_dist, 1), this.loc.z), rt.locate(min(this.loc.x + convert_dist, rt.world().maxx), min(this.loc.y + convert_dist, rt.world().maxy), this.loc.z)))) {
		if (!(_T = t)) {
			continue;
		}
		if (get_dist(_T, this) < 2) {
			if (rt.istype(_T, T("/turf/closed/wall"))) {
				yield* (W = _T).dismantle_wall();
			} else if (t && (rt.istype(_T, T("/turf/closed")) || !is_blocked_turf(_T))) {
				yield* _T.ChangeTurf(T("/turf/open/floor/clockwork"));
			}
		}
		if ((dist = cheap_hypotenuse(_T.x, _T.y, this.x, this.y)) < convert_dist) {
			yield* _T.ratvar_act(0, 1, 3);
		}
	}
	if (this.still_needs_components()) {
		if (!this.first_sound_played) {
			yield* priority_announce("Massive energy anomaly detected on short-range scanners. Attempting to triangulate location...", "Anomaly Alert");
			send_to_playing_players((yield* sound(rt.rsc("sound/effects/clockcult_gateway_charging.ogg"), 1, { channel: 1020, volume: 10 })));
			this.first_sound_played = 1;
		}
		yield* this.make_glow();
		this.glow.icon_state = "clockwork_gateway_components";
		used_components = 0;
		for (i of each(this.required_components)) {
			if (rt.index(this.required_components, i)) {
				to_use = min(rt.index(GLOB.clockwork_component_cache, i), rt.index(this.required_components, i));
				(rt.modAt(this.required_components, i, to_use, subtract));
				(rt.modAt(GLOB.clockwork_component_cache, i, to_use, subtract));
				if (to_use) {
					used_components = 1;
				}
			}
		}
		if (used_components) {
			yield* update_slab_info();
		}
		if (this.still_needs_components()) {
			return f.dot;
		}
	}
	for (O of each(orange(1, this), T("/obj"))) {
		if (!O.pulledby && !rt.istype(O, T("/obj/effect")) && O.density) {
			if (!(yield* step_away(O, this, 2)) || get_dist(O, this) < 2) {
				yield* O.take_damage(50, "fire", "bomb");
			}
			yield* O.update_icon();
		}
	}
	const subject = (this.progress_in_seconds += GATEWAY_SUMMON_RATE);
	if (rt.inRange(subject, -1e+31, GATEWAY_REEBE_FOUND)) {
		if (!this.second_sound_played) {
			send_to_playing_players((yield* sound(rt.rsc("sound/effects/clockcult_gateway_charging.ogg"), 1, { channel: 1020, volume: 30 })));
			this.second_sound_played = 1;
		}
		yield* this.make_glow();
		this.glow.icon_state = "clockwork_gateway_charging";
	} else if (rt.inRange(subject, GATEWAY_REEBE_FOUND, GATEWAY_RATVAR_COMING)) {
		if (!this.third_sound_played) {
			yield* priority_announce(`Location of massive energy anomaly has been triangulated. Location: ${(gate_area = get_area(this)).map_name}.`, "Anomaly Alert");
			send_to_playing_players((yield* sound(rt.rsc("sound/effects/clockcult_gateway_active.ogg"), 1, { channel: 1020, volume: 35 })));
			this.third_sound_played = 1;
		}
		yield* this.make_glow();
		this.glow.icon_state = "clockwork_gateway_active";
	} else if (rt.inRange(subject, GATEWAY_RATVAR_COMING, GATEWAY_RATVAR_ARRIVAL)) {
		if (!this.fourth_sound_played) {
			send_to_playing_players((yield* sound(rt.rsc("sound/effects/clockcult_gateway_closing.ogg"), 1, { channel: 1020, volume: 40 })));
			this.fourth_sound_played = 1;
		}
		yield* this.make_glow();
		this.glow.icon_state = "clockwork_gateway_closing";
	} else if (rt.inRange(subject, GATEWAY_RATVAR_ARRIVAL, 1e+31)) {
		if (this.purpose_fulfilled) return f.dot;
		yield* this.countdown.stop();
		(rt.modSrcVar(f, "resistance_flags", INDESTRUCTIBLE, rt.bitOr));
		this.purpose_fulfilled = 1;
		yield* this.make_glow();
		rt.op(f, "Animate", [2, 8], [null, this.glow, "transform", matrix() * 1.5, "alpha", 255, "time", 125]);
		send_to_playing_players((yield* sound(rt.rsc("sound/effects/ratvar_rises.ogg"), 0, { channel: 1020 })));
		yield* sleep(125);
		yield* this.make_glow();
		rt.op(f, "Animate", [2, 8], [null, this.glow, "transform", matrix() * 3, "alpha", 0, "time", 5]);
		startpoint = rt.getStep(f, this, 0);
		yield* addtimer((yield* new_(T("/datum/callback"), "some_magic_bullshit", P("/proc/qdel"), this)), 3, 8);
		yield* sleep(3);
		GLOB.clockwork_gateway_activated = 1;
		yield* new_(T("/obj/structure/destructible/clockwork/massive/ratvar"), startpoint);
		send_to_playing_players(`<span class='inathneq_large'>"${text2ratvar("See Engine's mercy")}!"</span>\n<span class='sevtug_large'>"${text2ratvar("Observe Engine's design skills")}!"</span>\n<span class='nezbere_large'>"${text2ratvar("Behold Engine's light")}!!"</span>\n<span class='nzcrentr_large'>"${text2ratvar("Gaze upon Engine's power")}."</span>`);
		send_to_playing_players(rt.rsc("sound/magic/clockwork/invoke_general.ogg"));
		x0 = startpoint.x;
		y0 = startpoint.y;
		for (I of each((yield* spiral_range_turfs(255, startpoint)))) {
			if (!(_T_5 = I)) {
				continue;
			}
			if ((dist_6 = cheap_hypotenuse(_T_5.x, _T_5.y, x0, y0)) < 100) {
				dist_6 = 1;
			} else {
				dist_6 = 0;
			}
			yield* _T_5.ratvar_act(dist_6, 1);
			if (rt.tickUsage(f) > GLOB.current_ticklimit) {
				yield* stoplag();
			}
		}
	}
	return f.dot;
}, true, { waitfor: false });
