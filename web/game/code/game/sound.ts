// Based on /tg/station's code/game/sound.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// sound.dm:3
rt.def("/proc/playsound", function playsound(f: Frame, source: Value, soundin: Value, vol: Value, vary: Value, extrarange: Value, falloff: Value, surround: Value, frequency: Value, channel: Value, pressure_affected: Value) {
	let _P: Value = null, M: Value = null, _T: Value = null;
	surround ??= 1;
	channel ??= 0;
	pressure_affected ??= 1;
	soundin = get_sfx(soundin);
	if (isarea(source)) {
		rt.throw_(f, new_(T("/exception"), "playsound(): source is an area", "code/game/sound.dm", 6));
		return f.dot;
	}
	if (frequency === null) {
		frequency = get_rand_frequency();
	}
	let turf_source: Value = rt.getStep(f, source, 0);
	channel = (channel || open_sound_channel());
	for (_P of each(GLOB.player_list)) {
		if (!(M = _P) || !M.client) {
			continue;
		}
		if (get_dist(M, turf_source) <= rt.world().view + extrarange) {
			if ((_T = rt.getStep(f, M, 0)) && _T.z == turf_source.z) {
				M.playsound_local(turf_source, soundin, vol, vary, frequency, falloff, surround, channel, pressure_affected);
			}
		}
	}
	return f.dot;
}, false, { argTypes: [{ path: "/atom" }, {  }, { type: 32 }, {  }, { type: 32 }, {  }, {  }, {  }, {  }, {  }] });

// sound.dm:27
rt.def("/mob/proc/playsound_local", function playsound_local(f: Frame, turf_source: Value, soundin: Value, vol: Value, vary: Value, frequency: Value, falloff: Value, surround: Value, channel: Value, pressure_affected: Value) {
	let S: Value = null, _T: Value = null, pressure_factor: Value = null, hearer_env: Value = null, source_env: Value = null, pressure: Value = null, distance: Value = null, dx: Value = null, dz: Value = null;
	surround ??= 1;
	channel ??= 0;
	pressure_affected ??= 1;
	if (!this.client || !this.can_hear()) {
		return f.dot;
	}
	soundin = get_sfx(soundin);
	(S = sound(soundin)).wait = 0;
	S.channel = (channel || open_sound_channel());
	S.volume = vol;
	if (vary) {
		if (frequency) {
			S.frequency = frequency;
		} else {
			S.frequency = get_rand_frequency();
		}
	}
	if (isturf(turf_source)) {
		_T = rt.getStep(f, this, 0);
		if (pressure_affected) {
			pressure_factor = 1;
			hearer_env = _T.return_air();
			source_env = turf_source.return_air();
			if (hearer_env && source_env) {
				if ((pressure = min(hearer_env.return_pressure(), source_env.return_pressure())) < 101.325) {
					pressure_factor = max((pressure - 10) / 91.325, 0);
				}
			} else {
				pressure_factor = 0;
			}
			if ((distance = get_dist(_T, turf_source)) <= 1) {
				pressure_factor = max(pressure_factor, 0.15);
			}
			S.volume *= pressure_factor;
			if (S.volume <= 0) {
				return f.dot;
			}
		}
		if (surround) {
			dx = turf_source.x - _T.x;
			S.x = round(max(-7, min(SURROUND_CAP, dx)), 1);
			dz = turf_source.y - _T.y;
			S.z = round(max(-7, min(SURROUND_CAP, dz)), 1);
		}
		S.y = 1;
		S.falloff = (falloff || FALLOFF_SOUNDS);
	}
	rt.op(f, "Output", [], [this, S], false);
	return f.dot;
}, false, { argTypes: [{ path: "/turf" }, {  }, { type: 32 }, {  }, {  }, {  }, {  }, {  }, {  }] });

// sound.dm:84
rt.def("/proc/sound_to_playing_players", function sound_to_playing_players(f: Frame, sound: Value, volume: Value, vary: Value) {
	let M: Value = null, MO: Value = null;
	volume ??= 100;
	sound = get_sfx(sound);
	for (M of each(GLOB.player_list)) {
		if (ismob(M) && !rt.istype(M, T("/mob/dead/new_player"))) {
			(MO = M).playsound_local(rt.getStep(f, MO, 0), sound, volume, vary, { pressure_affected: 0 });
		}
	}
	return f.dot;
});

// sound.dm:92
rt.def("/proc/open_sound_channel", function open_sound_channel(f: Frame) {
	f.dot = rt.incGl("next_channel", 1, false);
	if (!(GLOB.next_channel > 1018)) return f.dot;
	GLOB.next_channel = 1;
	return f.dot;
});

// sound.dm:97
rt.def("/mob/proc/stop_sound_channel", function stop_sound_channel(f: Frame, chan: Value) {
	rt.op(f, "Output", [], [this, sound(null, { repeat: 0, wait: 0, channel: chan })], false);
	return f.dot;
});

// sound.dm:100
rt.def("/client/proc/playtitlemusic", function* playtitlemusic(f: Frame) {
	while (!GLOB.SSticker.login_music) {
		yield* stoplag();
	}
	if (!(this.prefs && rt.bitAnd(this.prefs.toggles, 8))) return f.dot;
	rt.op(f, "Output", [], [this, (yield* sound(GLOB.SSticker.login_music, { repeat: 0, wait: 0, volume: 85, channel: 1024 }))], false);
	return f.dot;
}, true);

// sound.dm:106
rt.def("/proc/get_rand_frequency", function get_rand_frequency(f: Frame) {
	return rand(32000, 55000);
});

// sound.dm:109
rt.def("/proc/get_sfx", function get_sfx(f: Frame, soundin: Value) {
	if (istext(soundin)) {
		if (soundin === "shatter") {
			soundin = pick(rt.rsc("sound/effects/glassbr1.ogg"), rt.rsc("sound/effects/glassbr2.ogg"), rt.rsc("sound/effects/glassbr3.ogg"));
		} else if (soundin === "explosion") {
			soundin = pick(rt.rsc("sound/effects/explosion1.ogg"), rt.rsc("sound/effects/explosion2.ogg"));
		} else if (soundin === "sparks") {
			soundin = pick(rt.rsc("sound/effects/sparks1.ogg"), rt.rsc("sound/effects/sparks2.ogg"), rt.rsc("sound/effects/sparks3.ogg"), rt.rsc("sound/effects/sparks4.ogg"));
		} else if (soundin === "rustle") {
			soundin = pick(rt.rsc("sound/effects/rustle1.ogg"), rt.rsc("sound/effects/rustle2.ogg"), rt.rsc("sound/effects/rustle3.ogg"), rt.rsc("sound/effects/rustle4.ogg"), rt.rsc("sound/effects/rustle5.ogg"));
		} else if (soundin === "bodyfall") {
			soundin = pick(rt.rsc("sound/effects/bodyfall1.ogg"), rt.rsc("sound/effects/bodyfall2.ogg"), rt.rsc("sound/effects/bodyfall3.ogg"), rt.rsc("sound/effects/bodyfall4.ogg"));
		} else if (soundin === "punch") {
			soundin = pick(rt.rsc("sound/weapons/punch1.ogg"), rt.rsc("sound/weapons/punch2.ogg"), rt.rsc("sound/weapons/punch3.ogg"), rt.rsc("sound/weapons/punch4.ogg"));
		} else if (soundin === "clownstep") {
			soundin = pick(rt.rsc("sound/effects/clownstep1.ogg"), rt.rsc("sound/effects/clownstep2.ogg"));
		} else if (soundin === "suitstep") {
			soundin = pick(rt.rsc("sound/effects/suitstep1.ogg"), rt.rsc("sound/effects/suitstep2.ogg"));
		} else if (soundin === "swing_hit") {
			soundin = pick(rt.rsc("sound/weapons/genhit1.ogg"), rt.rsc("sound/weapons/genhit2.ogg"), rt.rsc("sound/weapons/genhit3.ogg"));
		} else if (soundin === "hiss") {
			soundin = pick(rt.rsc("sound/voice/hiss1.ogg"), rt.rsc("sound/voice/hiss2.ogg"), rt.rsc("sound/voice/hiss3.ogg"), rt.rsc("sound/voice/hiss4.ogg"));
		} else if (soundin === "pageturn") {
			soundin = pick(rt.rsc("sound/effects/pageturn1.ogg"), rt.rsc("sound/effects/pageturn2.ogg"), rt.rsc("sound/effects/pageturn3.ogg"));
		} else if (soundin === "gunshot") {
			soundin = pick(rt.rsc("sound/weapons/gunshot.ogg"), rt.rsc("sound/weapons/gunshot2.ogg"), rt.rsc("sound/weapons/gunshot3.ogg"), rt.rsc("sound/weapons/gunshot4.ogg"));
		} else if (soundin === "ricochet") {
			soundin = pick(rt.rsc("sound/weapons/effects/ric1.ogg"), rt.rsc("sound/weapons/effects/ric2.ogg"), rt.rsc("sound/weapons/effects/ric3.ogg"), rt.rsc("sound/weapons/effects/ric4.ogg"), rt.rsc("sound/weapons/effects/ric5.ogg"));
		} else if (soundin === "terminal_type") {
			soundin = pick(rt.rsc("sound/machines/terminal_button01.ogg"), rt.rsc("sound/machines/terminal_button02.ogg"), rt.rsc("sound/machines/terminal_button03.ogg"), rt.rsc("sound/machines/terminal_button04.ogg"), rt.rsc("sound/machines/terminal_button05.ogg"), rt.rsc("sound/machines/terminal_button06.ogg"), rt.rsc("sound/machines/terminal_button07.ogg"), rt.rsc("sound/machines/terminal_button08.ogg"));
		} else if (soundin === "desceration") {
			soundin = pick(rt.rsc("sound/misc/desceration-01.ogg"), rt.rsc("sound/misc/desceration-02.ogg"), rt.rsc("sound/misc/desceration-03.ogg"));
		} else if (soundin === "im_here") {
			soundin = pick(rt.rsc("sound/hallucinations/im_here1.ogg"), rt.rsc("sound/hallucinations/im_here2.ogg"));
		} else if (soundin === "can_open") {
			soundin = pick(rt.rsc("sound/effects/can_open1.ogg"), rt.rsc("sound/effects/can_open2.ogg"), rt.rsc("sound/effects/can_open3.ogg"));
		}
	}
	return soundin;
});

// sound.dm:150
rt.def("/proc/playsound_global", function playsound_global(f: Frame, file: Value, repeat: Value, wait: Value, channel: Value, volume: Value) {
	let V: Value = null;
	repeat ??= 0;
	for (V of each(GLOB.clients)) {
		rt.op(f, "Output", [], [V, sound(file, repeat, wait, channel, volume)], false);
	}
	return f.dot;
});
