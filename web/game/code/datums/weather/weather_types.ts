// From code/datums/weather/weather_types.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1052, "/datum/weather/floor_is_lava", "/datum/weather", {
	name: "the floor is lava",
	desc: "The ground turns into surprisingly cool lava, lightly damaging anything on the floor.",
	telegraph_message: "<span class='warning'>Waves of heat emanate from the ground...</span>",
	telegraph_duration: 150,
	weather_message: "<span class='userdanger'>The floor is lava! Get on top of something!</span>",
	weather_duration_lower: 300,
	weather_duration_upper: 600,
	weather_overlay: "lava",
	end_message: "<span class='danger'>The ground cools and returns to its usual form.</span>",
	end_duration: 0,
	target_z: 2,
	overlay_layer: 2.04,
	immunity_type: "lava",
	area_type: rt.typePath("/area"),
	protected_areas: null,
});

// /datum/weather/floor_is_lava/proc/<init>  (code/datums/weather/weather_types.dm:19)
rt.def("/datum/weather/floor_is_lava/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "protected_areas", rt.list(T("/area/space")));
	return f.dot;
});

// /datum/weather/floor_is_lava/proc/impact  (code/datums/weather/weather_types.dm:26)  may sleep
rt.def("/datum/weather/floor_is_lava/proc/impact", function* impact(f: Frame, L: Value) {
	let O: Value = null;
	let $e: any;
	f.vars = () => [L, O, $e];
	O = null;
	rt.forList(f, 0, rt.fv(f, "loc", live(L)), T("/obj/structure"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		if (truthy(rt.fv(f, "density", live(O)))) {
			return live(f.dot);
		}
	}
	rt.endFor(f, 0);
	if (truthy(rt.gv(f, "density", rt.fv(f, "loc", live(L))))) {
		return live(f.dot);
	}
	if (!truthy(rt.fv(f, "client", live(L)))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(L), "adjustFireLoss", [3]);
	return f.dot;
}, true);

rt.type(1053, "/datum/weather/advanced_darkness", "/datum/weather", {
	name: "advanced darkness",
	desc: "Everything in the area is effectively blinded, unable to see more than a foot or so around itself.",
	telegraph_message: "<span class='warning'>The lights begin to dim... is the power going out?</span>",
	telegraph_duration: 150,
	weather_message: "<span class='userdanger'>This isn't your average everday darkness... this is <i>advanced</i> darkness!</span>",
	weather_duration_lower: 300,
	weather_duration_upper: 300,
	end_message: "<span class='danger'>At last, the darkness recedes.</span>",
	end_duration: 0,
	target_z: 2,
	area_type: rt.typePath("/area"),
});

// /datum/weather/advanced_darkness/proc/update_areas  (code/datums/weather/weather_types.dm:54)
rt.def("/datum/weather/advanced_darkness/proc/update_areas", function update_areas(f: Frame) {
	let V: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [V, A, $e];
	V = null;
	rt.forList(f, 0, rt.sv(f, "impacted_areas"));
	while (($e = rt.next(f, 0)) !== undefined) {
		V = $e;
		A = live(V);
		if (isEqual(rt.sv(f, "stage"), 2)) {
			rt.setFv(f, "invisibility", live(A), 0);
			rt.callName(f, live(A), "set_opacity", [1]);
			rt.setFv(f, "layer", live(A), rt.sv(f, "overlay_layer"));
			rt.setFv(f, "icon", live(A), rt.rsc("icons/effects/weather_effects.dmi"));
			rt.setFv(f, "icon_state", live(A), "darkness");
		} else {
			rt.setFv(f, "invisibility", live(A), 100);
			rt.callName(f, live(A), "set_opacity", [0]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

rt.type(1054, "/datum/weather/ash_storm", "/datum/weather", {
	name: "ash storm",
	desc: "An intense atmospheric storm lifts ash off of the planet's surface and billows it down across the area, dealing intense fire damage to the unprotected.",
	telegraph_message: "<span class='boldwarning'>An eerie moan rises on the wind. Sheets of burning ash blacken the horizon. Seek shelter.</span>",
	telegraph_duration: 300,
	telegraph_sound: rt.rsc("sound/lavaland/ash_storm_windup.ogg"),
	telegraph_overlay: "light_ash",
	weather_message: "<span class='userdanger'><i>Smoldering clouds of scorching ash billow down around you! Get inside!</i></span>",
	weather_duration_lower: 600,
	weather_duration_upper: 1500,
	weather_sound: rt.rsc("sound/lavaland/ash_storm_start.ogg"),
	weather_overlay: "ash_storm",
	end_message: "<span class='boldannounce'>The shrieking wind whips away the last of the ash and falls to its usual murmur. It should be safe to go outside now.</span>",
	end_duration: 300,
	end_sound: rt.rsc("sound/lavaland/ash_storm_end.ogg"),
	end_overlay: "light_ash",
	target_z: 5,
	immunity_type: "ash",
	probability: 90,
	area_type: rt.typePath("/area/lavaland/surface/outdoors"),
});

// /datum/weather/ash_storm/proc/impact  (code/datums/weather/weather_types.dm:95)  may sleep
rt.def("/datum/weather/ash_storm/proc/impact", function* impact(f: Frame, L: Value) {
	let H: Value = null, thermal_protection: Value = null;
	f.vars = () => [L, H, thermal_protection];
	if (truthy((rt.istype(rt.fv(f, "loc", live(L)), T("/obj/mecha")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (truthy((rt.istype(live(L), T("/mob/living/carbon/human")) ? 1 : 0))) {
		H = live(L);
		if (rt.ge((thermal_protection = (yield* g.callName(f, live(H), "get_thermal_protection", []))), 35000)) {
			return live(f.dot);
		}
	}
	yield* g.callName(f, live(L), "adjustFireLoss", [4]);
	return f.dot;
}, true);

rt.type(1056, "/datum/weather/rad_storm", "/datum/weather", {
	name: "radiation storm",
	desc: "A cloud of intense radiation passes through the area dealing rad damage to those who are unprotected.",
	telegraph_duration: 400,
	telegraph_message: "<span class='danger'>The air begins to grow warm.</span>",
	weather_message: "<span class='userdanger'><i>You feel waves of heat wash over you! Find shelter!</i></span>",
	weather_overlay: "ash_storm",
	weather_duration_lower: 600,
	weather_duration_upper: 1500,
	weather_color: "green",
	weather_sound: rt.rsc("sound/misc/bloblarm.ogg"),
	end_duration: 100,
	end_message: "<span class='notice'>The air seems to be cooling off again.</span>",
	target_z: 2,
	immunity_type: "rad",
	area_type: rt.typePath("/area"),
	protected_areas: null,
});

// /datum/weather/rad_storm/proc/<init>  (code/datums/weather/weather_types.dm:136)
rt.def("/datum/weather/rad_storm/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "protected_areas", rt.list(T("/area/maintenance"), T("/area/ai_monitored/turret_protected/ai_upload"), T("/area/ai_monitored/turret_protected/ai_upload_foyer"), T("/area/ai_monitored/turret_protected/ai"), T("/area/storage/emergency/starboard"), T("/area/storage/emergency/port"), T("/area/shuttle")));
	return f.dot;
});

// /datum/weather/rad_storm/proc/telegraph  (code/datums/weather/weather_types.dm:143)  may sleep
rt.def("/datum/weather/rad_storm/proc/telegraph", function* telegraph(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "status_alarm", "alert");
	return f.dot;
}, true);

// /datum/weather/rad_storm/proc/impact  (code/datums/weather/weather_types.dm:148)  may sleep
rt.def("/datum/weather/rad_storm/proc/impact", function* impact(f: Frame, L: Value) {
	let resist: Value = null, H: Value = null;
	f.vars = () => [L, resist, H];
	resist = (yield* g.callName(f, live(L), "getarmor", [null, "rad"]));
	if (!truthy(rt.op(f, "Prob", [], [40]))) return f.dot;
	if (truthy((rt.istype(live(L), T("/mob/living/carbon/human")) ? 1 : 0))) {
		if ((truthy(rt.gv(f, "dna", (H = live(L)))) && truthy(rt.gv(f, "species", rt.fv(f, "dna", live(H)))))) {
			if (!truthy((rt.isIn(f, 9, rt.gv(f, "species_traits", rt.gv(f, "species", rt.fv(f, "dna", live(H))))) ? 1 : 0))) {
				if (truthy(rt.op(f, "Prob", [], [(yield* g.call(f, P("/proc/max"), null, [0, subtract(100, live(resist))]))]))) {
					yield* g.callName(f, live(H), "randmuti", []);
					if (truthy(rt.op(f, "Prob", [], [50]))) {
						if (truthy(rt.op(f, "Prob", [], [90]))) {
							yield* g.callName(f, live(H), "randmutb", []);
						} else {
							yield* g.callName(f, live(H), "randmutg", []);
						}
						yield* g.callName(f, live(H), "domutcheck", []);
					}
				}
			}
		}
	}
	yield* g.callName(f, live(L), "rad_act", [20, 1]);
	return f.dot;
}, true);

// /datum/weather/rad_storm/proc/end  (code/datums/weather/weather_types.dm:164)  may sleep
rt.def("/datum/weather/rad_storm/proc/end", function* end(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/priority_announce"), null, ["The radiation threat has passed. Please return to your workplaces.", "Anomaly Alert"]);
	yield* g.srcCall(f, "status_alarm");
	return f.dot;
}, true);

// /datum/weather/rad_storm/proc/status_alarm  (code/datums/weather/weather_types.dm:171)  may sleep
rt.def("/datum/weather/rad_storm/proc/status_alarm", function* status_alarm(f: Frame, command: Value) {
	let frequency: Value = null, status_signal: Value = null, virt: Value = null;
	f.vars = () => [command, frequency, status_signal, virt];
	if (!truthy((frequency = (yield* g.callName(f, rt.gl("SSradio"), "return_frequency", [1435]))))) {
		return live(f.dot);
	}
	status_signal = (yield* g.new_(f, T("/datum/signal"), []));
	virt = (yield* g.new_(f, T("/atom/movable/virtualspeaker"), [null]));
	rt.setFv(f, "source", live(status_signal), live(virt));
	rt.setFv(f, "transmission_method", live(status_signal), 1);
	rt.setAt(rt.fv(f, "data", live(status_signal)), "command", "shuttle");
	if (isEqual(live(command), "alert")) {
		rt.setAt(rt.fv(f, "data", live(status_signal)), "command", "alert");
		rt.setAt(rt.fv(f, "data", live(status_signal)), "picture_state", "radiation");
	}
	yield* g.callName(f, live(frequency), "post_signal", [live(f.src), live(status_signal)]);
	return f.dot;
}, true);

rt.type(1057, "/datum/weather/acid_rain", "/datum/weather", {
	name: "acid rain",
	desc: "Some stay dry and others feel the pain",
	telegraph_duration: 400,
	telegraph_message: "<span class='danger'>Stinging droplets start to fall upon you..</span>",
	telegraph_sound: rt.rsc("sound/ambience/acidrain_start.ogg"),
	weather_message: "<span class='userdanger'><i>Your skin melts underneath the rain!</i></span>",
	weather_overlay: "acid_rain",
	weather_duration_lower: 600,
	weather_duration_upper: 1500,
	weather_sound: rt.rsc("sound/ambience/acidrain_mid.ogg"),
	end_duration: 100,
	end_message: "<span class='notice'>The rain starts to dissipate.</span>",
	end_sound: rt.rsc("sound/ambience/acidrain_end.ogg"),
	target_z: 5,
	immunity_type: "acid",
	area_type: rt.typePath("/area/lavaland/surface/outdoors"),
});

// /datum/weather/acid_rain/proc/impact  (code/datums/weather/weather_types.dm:214)  may sleep
rt.def("/datum/weather/acid_rain/proc/impact", function* impact(f: Frame, L: Value) {
	let resist: Value = null;
	f.vars = () => [L, resist];
	resist = (yield* g.callName(f, live(L), "getarmor", [null, "acid"]));
	if (!truthy(rt.op(f, "Prob", [], [(yield* g.call(f, P("/proc/max"), null, [0, subtract(100, live(resist))]))]))) return f.dot;
	yield* g.callName(f, live(L), "acid_act", [20, 20]);
	return f.dot;
}, true);
