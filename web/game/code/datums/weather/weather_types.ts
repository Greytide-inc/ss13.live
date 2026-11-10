// Based on /tg/station's code/datums/weather/weather_types.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


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

// weather_types.dm:19
rt.def("/datum/weather/floor_is_lava/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.protected_areas = list(T("/area/space"));
	return f.dot;
});

// weather_types.dm:26
rt.def("/datum/weather/floor_is_lava/proc/impact", function* impact(f: Frame, L: Value) {
	let O: Value = null;
	for (O of each(L.loc, T("/obj/structure"))) {
		if (O.density) {
			return f.dot;
		}
	}
	if (L.loc.density) {
		return f.dot;
	}
	if (!L.client) {
		return f.dot;
	}
	yield* L.adjustFireLoss(3);
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

// weather_types.dm:54
rt.def("/datum/weather/advanced_darkness/proc/update_areas", function update_areas(f: Frame) {
	let V: Value = null, A: Value = null;
	for (V of each(this.impacted_areas)) {
		A = V;
		if (this.stage == MAIN_STAGE) {
			A.invisibility = 0;
			A.set_opacity(1);
			A.layer = this.overlay_layer;
			A.icon = rt.rsc("icons/effects/weather_effects.dmi");
			A.icon_state = "darkness";
		} else {
			A.invisibility = INVISIBILITY_MAXIMUM;
			A.set_opacity(0);
		}
	}
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

// weather_types.dm:95
rt.def("/datum/weather/ash_storm/proc/impact", function* impact(f: Frame, L: Value) {
	let H: Value = null, thermal_protection: Value = null;
	if (rt.istype(L.loc, T("/obj/mecha"))) {
		return f.dot;
	}
	if (rt.istype(L, T("/mob/living/carbon/human"))) {
		H = L;
		if ((thermal_protection = H.get_thermal_protection()) >= FIRE_IMMUNITY_SUIT_MAX_TEMP_PROTECT) {
			return f.dot;
		}
	}
	yield* L.adjustFireLoss(4);
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

// weather_types.dm:136
rt.def("/datum/weather/rad_storm/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.protected_areas = list(T("/area/maintenance"), T("/area/ai_monitored/turret_protected/ai_upload"), T("/area/ai_monitored/turret_protected/ai_upload_foyer"), T("/area/ai_monitored/turret_protected/ai"), T("/area/storage/emergency/starboard"), T("/area/storage/emergency/port"), T("/area/shuttle"));
	return f.dot;
});

// weather_types.dm:143
rt.def("/datum/weather/rad_storm/proc/telegraph", function* telegraph(f: Frame) {
	yield* parent_proc();
	yield* this.status_alarm("alert");
	return f.dot;
}, true);

// weather_types.dm:148
rt.def("/datum/weather/rad_storm/proc/impact", function* impact(f: Frame, L: Value) {
	let H: Value = null;
	let resist: Value = L.getarmor(null, "rad");
	if (!prob(40)) return f.dot;
	if (rt.istype(L, T("/mob/living/carbon/human"))) {
		if ((H = L).dna && H.dna.species) {
			if (!rt.isIn(f, RADIMMUNE, H.dna.species.species_traits)) {
				if (prob(max(0, 100 - resist))) {
					yield* H.randmuti();
					if (prob(50)) {
						if (prob(90)) {
							yield* H.randmutb();
						} else {
							yield* H.randmutg();
						}
						yield* H.domutcheck();
					}
				}
			}
		}
	}
	yield* L.rad_act(20, 1);
	return f.dot;
}, true);

// weather_types.dm:164
rt.def("/datum/weather/rad_storm/proc/end", function* end(f: Frame) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	yield* priority_announce("The radiation threat has passed. Please return to your workplaces.", "Anomaly Alert");
	yield* this.status_alarm();
	return f.dot;
}, true);

// weather_types.dm:171
rt.def("/datum/weather/rad_storm/proc/status_alarm", function* status_alarm(f: Frame, command: Value) {
	let frequency: Value = null;
	if (!(frequency = GLOB.SSradio.return_frequency(1435))) {
		return f.dot;
	}
	let status_signal: Value = (yield* new_(T("/datum/signal")));
	let virt: Value = (yield* new_(T("/atom/movable/virtualspeaker"), null));
	status_signal.source = virt;
	status_signal.transmission_method = 1;
	rt.setAt(status_signal.data, "command", "shuttle");
	if (command == "alert") {
		rt.setAt(status_signal.data, "command", "alert");
		rt.setAt(status_signal.data, "picture_state", "radiation");
	}
	yield* frequency.post_signal(this, status_signal);
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

// weather_types.dm:214
rt.def("/datum/weather/acid_rain/proc/impact", function* impact(f: Frame, L: Value) {
	let resist: Value = L.getarmor(null, "acid");
	if (!prob(max(0, 100 - resist))) return f.dot;
	yield* L.acid_act(20, 20);
	return f.dot;
}, true);
