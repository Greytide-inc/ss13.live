// From code/game/sound.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /proc/playsound  (code/game/sound.dm:3)
rt.def("/proc/playsound", function playsound(f: Frame, source: Value, soundin: Value, vol: Value, vary: Value, extrarange: Value, falloff: Value, surround: Value, frequency: Value, channel: Value, pressure_affected: Value) {
	let turf_source: Value = null, _P: Value = null, M: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [soundin, surround, frequency, channel, pressure_affected, turf_source, _P, M, _T, $e];
	if (live(surround) === null) {
		surround = 1;
	}
	if (live(frequency) === null) {
		frequency = null;
	}
	if (live(channel) === null) {
		channel = 0;
	}
	if (live(pressure_affected) === null) {
		pressure_affected = 1;
	}
	soundin = rt.call(f, P("/proc/get_sfx"), null, [live(soundin)]);
	if (truthy(rt.call(f, P("/proc/isarea"), null, [live(source)]))) {
		rt.throw_(f, rt.new_(f, T("/exception"), ["playsound(): source is an area", "code/game/sound.dm", 6]));
		return live(f.dot);
	}
	if (live(frequency) === null) {
		frequency = rt.call(f, P("/proc/get_rand_frequency"), null, []);
	}
	turf_source = rt.getStep(f, live(source), 0);
	channel = (live(channel) || rt.call(f, P("/proc/open_sound_channel"), null, []));
	_P = null;
	rt.forList(f, 0, rt.gl("player_list"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_P = $e;
		if ((!truthy((M = live(_P))) || !truthy(rt.fv(f, "client", live(M))))) {
			continue;
		}
		if (rt.le(rt.call(f, P("/proc/get_dist"), null, [live(M), live(turf_source)]), add(rt.fv(f, "view", rt.world()), live(extrarange)))) {
			if ((truthy((_T = rt.getStep(f, live(M), 0))) && isEqual(rt.fv(f, "z", live(_T)), rt.fv(f, "z", live(turf_source))))) {
				rt.callName(f, live(M), "playsound_local", [live(turf_source), live(soundin), live(vol), live(vary), live(frequency), live(falloff), live(surround), live(channel), live(pressure_affected)]);
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, false, { argTypes: [{ path: "/atom" }, {  }, { type: 32 }, {  }, { type: 32 }, {  }, {  }, {  }, {  }, {  }] });

// /mob/proc/playsound_local  (code/game/sound.dm:27)
rt.def("/mob/proc/playsound_local", function playsound_local(f: Frame, turf_source: Value, soundin: Value, vol: Value, vary: Value, frequency: Value, falloff: Value, surround: Value, channel: Value, pressure_affected: Value) {
	let S: Value = null, _T: Value = null, pressure_factor: Value = null, hearer_env: Value = null, source_env: Value = null, pressure: Value = null, distance: Value = null, dx: Value = null, dz: Value = null;
	f.vars = () => [soundin, surround, channel, pressure_affected, S, _T, pressure_factor, hearer_env, source_env, pressure, distance, dx, dz];
	if (live(surround) === null) {
		surround = 1;
	}
	if (live(channel) === null) {
		channel = 0;
	}
	if (live(pressure_affected) === null) {
		pressure_affected = 1;
	}
	if ((!truthy(rt.sv(f, "client")) || !truthy(rt.callSrc(f, "can_hear", [])))) {
		return live(f.dot);
	}
	soundin = rt.call(f, P("/proc/get_sfx"), null, [live(soundin)]);
	rt.setFv(f, "wait", (S = rt.call(f, P("/proc/sound"), null, [live(soundin)])), 0);
	rt.setFv(f, "channel", live(S), (live(channel) || rt.call(f, P("/proc/open_sound_channel"), null, [])));
	rt.setFv(f, "volume", live(S), live(vol));
	if (truthy(live(vary))) {
		if (truthy(live(frequency))) {
			rt.setFv(f, "frequency", live(S), live(frequency));
		} else {
			rt.setFv(f, "frequency", live(S), rt.call(f, P("/proc/get_rand_frequency"), null, []));
		}
	}
	if (truthy(rt.call(f, P("/proc/isturf"), null, [live(turf_source)]))) {
		_T = rt.getStep(f, live(f.src), 0);
		if (truthy(live(pressure_affected))) {
			pressure_factor = 1;
			hearer_env = rt.callName(f, live(_T), "return_air", []);
			source_env = rt.callName(f, live(turf_source), "return_air", []);
			if ((truthy(live(hearer_env)) && truthy(live(source_env)))) {
				if (rt.lt((pressure = rt.call(f, P("/proc/min"), null, [rt.callName(f, live(hearer_env), "return_pressure", []), rt.callName(f, live(source_env), "return_pressure", [])])), 101.32499694824219)) {
					pressure_factor = rt.call(f, P("/proc/max"), null, [divide(subtract(live(pressure), 10), 91.32499694824219), 0]);
				}
			} else {
				pressure_factor = 0;
			}
			if (rt.le((distance = rt.call(f, P("/proc/get_dist"), null, [live(_T), live(turf_source)])), 1)) {
				pressure_factor = rt.call(f, P("/proc/max"), null, [live(pressure_factor), 0.15000000596046448]);
			}
			(rt.modField(f, live(S), "volume", live(pressure_factor), multiply));
			if (rt.le(rt.fv(f, "volume", live(S)), 0)) {
				return live(f.dot);
			}
		}
		if (truthy(live(surround))) {
			dx = subtract(rt.fv(f, "x", live(turf_source)), rt.fv(f, "x", live(_T)));
			rt.setFv(f, "x", live(S), rt.call(f, P("/proc/round"), null, [rt.call(f, P("/proc/max"), null, [-7, rt.call(f, P("/proc/min"), null, [7, live(dx)])]), 1]));
			dz = subtract(rt.fv(f, "y", live(turf_source)), rt.fv(f, "y", live(_T)));
			rt.setFv(f, "z", live(S), rt.call(f, P("/proc/round"), null, [rt.call(f, P("/proc/max"), null, [-7, rt.call(f, P("/proc/min"), null, [7, live(dz)])]), 1]));
		}
		rt.setFv(f, "y", live(S), 1);
		rt.setFv(f, "falloff", live(S), (live(falloff) || 1));
	}
	rt.op(f, "Output", [], [live(f.src), live(S)], false);
	return f.dot;
}, false, { argTypes: [{ path: "/turf" }, {  }, { type: 32 }, {  }, {  }, {  }, {  }, {  }, {  }] });

// /proc/sound_to_playing_players  (code/game/sound.dm:84)
rt.def("/proc/sound_to_playing_players", function sound_to_playing_players(f: Frame, sound: Value, volume: Value, vary: Value) {
	let M: Value = null, MO: Value = null;
	let $e: any;
	f.vars = () => [sound, volume, M, MO, $e];
	if (live(volume) === null) {
		volume = 100;
	}
	sound = rt.call(f, P("/proc/get_sfx"), null, [live(sound)]);
	M = null;
	rt.forList(f, 0, rt.gl("player_list"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if ((truthy(rt.call(f, P("/proc/ismob"), null, [live(M)])) && !truthy((rt.istype(live(M), T("/mob/dead/new_player")) ? 1 : 0)))) {
			rt.callName(f, (MO = live(M)), "playsound_local", [null, rt.getStep(f, live(MO), 0), null, live(sound), null, live(volume), null, live(vary), "pressure_affected", 0], rt.Args.Named);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /proc/open_sound_channel  (code/game/sound.dm:92)
rt.def("/proc/open_sound_channel", function open_sound_channel(f: Frame) {
	f.dot = rt.incGl("next_channel", 1, false);
	if (!rt.gt(rt.gl("next_channel"), 1018)) return f.dot;
	rt.setGl("next_channel", 1);
	return f.dot;
});

// /mob/proc/stop_sound_channel  (code/game/sound.dm:97)
rt.def("/mob/proc/stop_sound_channel", function stop_sound_channel(f: Frame, chan: Value) {
	rt.op(f, "Output", [], [live(f.src), rt.call(f, P("/proc/sound"), null, [null, null, "repeat", 0, "wait", 0, "channel", live(chan)], rt.Args.Named)], false);
	return f.dot;
});

// /client/proc/playtitlemusic  (code/game/sound.dm:100)  may sleep
rt.def("/client/proc/playtitlemusic", function* playtitlemusic(f: Frame) {
	while (!truthy(rt.fv(f, "login_music", rt.gl("SSticker")))) {
		yield* g.call(f, P("/proc/stoplag"), null, []);
	}
	if (!(truthy(rt.sv(f, "prefs")) && truthy(rt.bitAnd(rt.fv(f, "toggles", rt.sv(f, "prefs")), 8)))) return f.dot;
	rt.op(f, "Output", [], [live(f.src), (yield* g.call(f, P("/proc/sound"), null, [null, rt.fv(f, "login_music", rt.gl("SSticker")), "repeat", 0, "wait", 0, "volume", 85, "channel", 1024], rt.Args.Named))], false);
	return f.dot;
}, true);

// /proc/get_rand_frequency  (code/game/sound.dm:106)
rt.def("/proc/get_rand_frequency", function get_rand_frequency(f: Frame) {
	return rt.call(f, P("/proc/rand"), null, [32000, 55000]);
});

// /proc/get_sfx  (code/game/sound.dm:109)
rt.def("/proc/get_sfx", function get_sfx(f: Frame, soundin: Value) {
	let $0: any;
	f.vars = () => [soundin, $0];
	if (truthy(rt.call(f, P("/proc/istext"), null, [live(soundin)]))) {
		$0 = live(soundin);
		if ($0 === "shatter") {
			soundin = rt.op(f, "PickUnweighted", [3], [rt.rsc("sound/effects/glassbr1.ogg"), rt.rsc("sound/effects/glassbr2.ogg"), rt.rsc("sound/effects/glassbr3.ogg")]);
		} else if ($0 === "explosion") {
			soundin = rt.op(f, "PickUnweighted", [2], [rt.rsc("sound/effects/explosion1.ogg"), rt.rsc("sound/effects/explosion2.ogg")]);
		} else if ($0 === "sparks") {
			soundin = rt.op(f, "PickUnweighted", [4], [rt.rsc("sound/effects/sparks1.ogg"), rt.rsc("sound/effects/sparks2.ogg"), rt.rsc("sound/effects/sparks3.ogg"), rt.rsc("sound/effects/sparks4.ogg")]);
		} else if ($0 === "rustle") {
			soundin = rt.op(f, "PickUnweighted", [5], [rt.rsc("sound/effects/rustle1.ogg"), rt.rsc("sound/effects/rustle2.ogg"), rt.rsc("sound/effects/rustle3.ogg"), rt.rsc("sound/effects/rustle4.ogg"), rt.rsc("sound/effects/rustle5.ogg")]);
		} else if ($0 === "bodyfall") {
			soundin = rt.op(f, "PickUnweighted", [4], [rt.rsc("sound/effects/bodyfall1.ogg"), rt.rsc("sound/effects/bodyfall2.ogg"), rt.rsc("sound/effects/bodyfall3.ogg"), rt.rsc("sound/effects/bodyfall4.ogg")]);
		} else if ($0 === "punch") {
			soundin = rt.op(f, "PickUnweighted", [4], [rt.rsc("sound/weapons/punch1.ogg"), rt.rsc("sound/weapons/punch2.ogg"), rt.rsc("sound/weapons/punch3.ogg"), rt.rsc("sound/weapons/punch4.ogg")]);
		} else if ($0 === "clownstep") {
			soundin = rt.op(f, "PickUnweighted", [2], [rt.rsc("sound/effects/clownstep1.ogg"), rt.rsc("sound/effects/clownstep2.ogg")]);
		} else if ($0 === "suitstep") {
			soundin = rt.op(f, "PickUnweighted", [2], [rt.rsc("sound/effects/suitstep1.ogg"), rt.rsc("sound/effects/suitstep2.ogg")]);
		} else if ($0 === "swing_hit") {
			soundin = rt.op(f, "PickUnweighted", [3], [rt.rsc("sound/weapons/genhit1.ogg"), rt.rsc("sound/weapons/genhit2.ogg"), rt.rsc("sound/weapons/genhit3.ogg")]);
		} else if ($0 === "hiss") {
			soundin = rt.op(f, "PickUnweighted", [4], [rt.rsc("sound/voice/hiss1.ogg"), rt.rsc("sound/voice/hiss2.ogg"), rt.rsc("sound/voice/hiss3.ogg"), rt.rsc("sound/voice/hiss4.ogg")]);
		} else if ($0 === "pageturn") {
			soundin = rt.op(f, "PickUnweighted", [3], [rt.rsc("sound/effects/pageturn1.ogg"), rt.rsc("sound/effects/pageturn2.ogg"), rt.rsc("sound/effects/pageturn3.ogg")]);
		} else if ($0 === "gunshot") {
			soundin = rt.op(f, "PickUnweighted", [4], [rt.rsc("sound/weapons/gunshot.ogg"), rt.rsc("sound/weapons/gunshot2.ogg"), rt.rsc("sound/weapons/gunshot3.ogg"), rt.rsc("sound/weapons/gunshot4.ogg")]);
		} else if ($0 === "ricochet") {
			soundin = rt.op(f, "PickUnweighted", [5], [rt.rsc("sound/weapons/effects/ric1.ogg"), rt.rsc("sound/weapons/effects/ric2.ogg"), rt.rsc("sound/weapons/effects/ric3.ogg"), rt.rsc("sound/weapons/effects/ric4.ogg"), rt.rsc("sound/weapons/effects/ric5.ogg")]);
		} else if ($0 === "terminal_type") {
			soundin = rt.op(f, "PickUnweighted", [8], [rt.rsc("sound/machines/terminal_button01.ogg"), rt.rsc("sound/machines/terminal_button02.ogg"), rt.rsc("sound/machines/terminal_button03.ogg"), rt.rsc("sound/machines/terminal_button04.ogg"), rt.rsc("sound/machines/terminal_button05.ogg"), rt.rsc("sound/machines/terminal_button06.ogg"), rt.rsc("sound/machines/terminal_button07.ogg"), rt.rsc("sound/machines/terminal_button08.ogg")]);
		} else if ($0 === "desceration") {
			soundin = rt.op(f, "PickUnweighted", [3], [rt.rsc("sound/misc/desceration-01.ogg"), rt.rsc("sound/misc/desceration-02.ogg"), rt.rsc("sound/misc/desceration-03.ogg")]);
		} else if ($0 === "im_here") {
			soundin = rt.op(f, "PickUnweighted", [2], [rt.rsc("sound/hallucinations/im_here1.ogg"), rt.rsc("sound/hallucinations/im_here2.ogg")]);
		} else if ($0 === "can_open") {
			soundin = rt.op(f, "PickUnweighted", [3], [rt.rsc("sound/effects/can_open1.ogg"), rt.rsc("sound/effects/can_open2.ogg"), rt.rsc("sound/effects/can_open3.ogg")]);
		}
	}
	return live(soundin);
});

// /proc/playsound_global  (code/game/sound.dm:150)
rt.def("/proc/playsound_global", function playsound_global(f: Frame, file: Value, repeat: Value, wait: Value, channel: Value, volume: Value) {
	let V: Value = null;
	let $e: any;
	f.vars = () => [repeat, V, $e];
	if (live(repeat) === null) {
		repeat = 0;
	}
	V = null;
	rt.forList(f, 0, rt.gl("clients"));
	while (($e = rt.next(f, 0)) !== undefined) {
		V = $e;
		rt.op(f, "Output", [], [live(V), rt.call(f, P("/proc/sound"), null, [live(file), live(repeat), live(wait), live(channel), live(volume)])], false);
	}
	rt.endFor(f, 0);
	return f.dot;
});
