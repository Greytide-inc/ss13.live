// From code/game/gamemodes/clock_cult/clock_structures/ratvar_the_clockwork_justicar.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12151, "/obj/structure/destructible/clockwork/massive/ratvar", "/obj/structure/destructible/clockwork/massive", {
	prey: null,
	clashing: 0,
	convert_range: 10,
	clockwork_desc: "<span class='large_brass'><b><i>Ratvar, the Clockwork Justiciar, your master eternal.</i></b></span>",
	light_power: 0.7,
	light_range: 15,
	light_color: "#BE8700",
	name: "Ratvar, the Clockwork Justiciar",
	desc: "<span class='userdanger'>What is what is what are what real what is all a lie all a lie it's all a lie why how can what is</span>",
	icon: rt.rsc("icons/effects/512x512.dmi"),
	icon_state: "ratvar",
	pixel_x: -235,
	pixel_y: -248,
	resistance_flags: 115,
	appearance_flags: 0,
	dangerous_possession: 1,
});

// /obj/structure/destructible/clockwork/massive/ratvar/proc/Initialize  (code/game/gamemodes/clock_cult/clock_structures/ratvar_the_clockwork_justicar.dm:21)  may sleep
rt.def("/obj/structure/destructible/clockwork/massive/ratvar/proc/Initialize", function* Initialize(f: Frame) {
	let O: Value = null, alert_overlay: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [O, alert_overlay, A, $e];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.incGl("ratvar_awakens", 1, true);
	O = null;
	rt.forList(f, 0, rt.gl("all_clockwork_objects"), T("/obj"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		yield* g.callName(f, live(O), "ratvar_act", []);
	}
	rt.endFor(f, 0);
	if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
		rt.setFv(f, "isprocessing", live(f.src), 1);
		rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	}
	yield* g.call(f, P("/proc/send_to_playing_players"), null, [fmt("<span class='ratvar'>\"＀!!\"</span>", [(yield* g.call(f, P("/proc/text2ratvar"), null, ["ONCE AGAIN MY LIGHT SHALL SHINE ACROSS THIS PATHETIC REALM"]))])]);
	yield* g.call(f, P("/proc/sound_to_playing_players"), null, [rt.rsc("sound/effects/ratvar_reveal.ogg")]);
	alert_overlay = (yield* g.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/effects/clockwork_effects.dmi"), "ratvar_alert"]));
	A = (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)]));
	yield* g.call(f, P("/proc/notify_ghosts"), null, [null, fmt("The Justiciar's light calls to you! Reach out to Ratvar in ＀ to be granted a shell to spread his glory!", [rt.fv(f, "name", live(A))]), null, null, "source", live(f.src), "alert_overlay", live(alert_overlay)], rt.Args.Named);
	yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [rt.fv(f, "emergency", rt.gl("SSshuttle")), P("/obj/docking_port/mobile/emergency/proc/request"), null, 0, null, 0, 0]);
	return f.dot;
}, true);

// /obj/structure/destructible/clockwork/massive/ratvar/proc/Destroy  (code/game/gamemodes/clock_cult/clock_structures/ratvar_the_clockwork_justicar.dm:34)  may sleep
rt.def("/obj/structure/destructible/clockwork/massive/ratvar/proc/Destroy", function* Destroy(f: Frame) {
	let O: Value = null;
	let $e: any;
	f.vars = () => [O, $e];
	rt.incGl("ratvar_awakens", -1, true);
	O = null;
	rt.forList(f, 0, rt.gl("all_clockwork_objects"), T("/obj"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		yield* g.callName(f, live(O), "ratvar_act", []);
	}
	rt.endFor(f, 0);
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	yield* g.call(f, P("/proc/send_to_playing_players"), null, ["<span class='heavy_brass'><font size=6>\"NO! I will not... be...</font> <font size=5>banished...</font> <font size=4>again...\"</font></span>"]);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/structure/destructible/clockwork/massive/ratvar/proc/attack_ghost  (code/game/gamemodes/clock_cult/clock_structures/ratvar_the_clockwork_justicar.dm:42)  may sleep
rt.def("/obj/structure/destructible/clockwork/massive/ratvar/proc/attack_ghost", function* attack_ghost(f: Frame, O: Value) {
	let alertresult: Value = null, R: Value = null;
	f.vars = () => [O, alertresult, R];
	if ((((isEqual((alertresult = (yield* g.call(f, P("/proc/alert"), null, [live(O), "Embrace the Justiciar's light? You can no longer be cloned!", null, "Yes", "No"]))), "No") || (!truthy(live(O)) || truthy(rt.fv(f, "gc_destroyed", live(O))))) || !truthy((rt.istype(live(O), T("/mob/dead/observer")) ? 1 : 0))) || !truthy(rt.fv(f, "key", live(O))))) {
		return 0;
	}
	yield* g.callName(f, (R = (yield* g.new_(f, T("/mob/living/simple_animal/drone/cogscarab/ratvar"), [rt.getStep(f, live(f.src), 0)]))), "visible_message", [fmt("<span class='heavy_brass'>＀ forms, and its eyes blink open, glowing bright red!</span>", [live(R)])]);
	rt.setFv(f, "key", live(R), rt.fv(f, "key", live(O)));
	return f.dot;
}, true);

// /obj/structure/destructible/clockwork/massive/ratvar/proc/Bump  (code/game/gamemodes/clock_cult/clock_structures/ratvar_the_clockwork_justicar.dm:50)  may sleep
rt.def("/obj/structure/destructible/clockwork/massive/ratvar/proc/Bump", function* Bump(f: Frame, A: Value) {
	let _T: Value = null;
	f.vars = () => [A, _T];
	if (isEqual((_T = rt.getStep(f, live(A), 0)), rt.sv(f, "loc"))) {
		_T = rt.getStep(f, live(_T), rt.sv(f, "dir"));
	}
	yield* g.srcCall(f, "forceMove", live(_T));
	return f.dot;
}, true);

// /obj/structure/destructible/clockwork/massive/ratvar/proc/process  (code/game/gamemodes/clock_cult/clock_structures/ratvar_the_clockwork_justicar.dm:61)  may sleep
rt.def("/obj/structure/destructible/clockwork/massive/ratvar/proc/process", function* process(f: Frame) {
	let I: Value = null, _T: Value = null, dir_to_step_in: Value = null, meals: Value = null, L: Value = null;
	let $e: any;
	f.vars = () => [I, _T, dir_to_step_in, meals, L, $e];
	if (truthy(rt.sv(f, "clashing"))) {
		return live(f.dot);
	}
	I = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/circlerangeturfs"), null, [live(f.src), rt.sv(f, "convert_range")])));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		yield* g.callName(f, (_T = live(I)), "ratvar_act", []);
	}
	rt.endFor(f, 0);
	I = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/circleviewturfs"), null, [live(f.src), (yield* g.call(f, P("/proc/round"), null, [multiply(rt.sv(f, "convert_range"), 0.5)]))])));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		yield* g.callName(f, (_T = live(I)), "ratvar_act", [1]);
	}
	rt.endFor(f, 0);
	dir_to_step_in = rt.op(f, "PickUnweighted", [1], [rt.gl("cardinal")]);
	meals = rt.list();
	L = null;
	rt.forList(f, 0, rt.gl("living_mob_list"), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		if (((isEqual(rt.fv(f, "z", live(L)), rt.sv(f, "z")) && !truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(L)])))) && truthy(rt.fv(f, "mind", live(L))))) {
			meals = rt.modify(live(meals), live(L), add);
		}
	}
	rt.endFor(f, 0);
	if ((truthy(rt.gl("cult_narsie")) && isEqual(rt.fv(f, "z", rt.gl("cult_narsie")), rt.sv(f, "z")))) {
		meals = rt.list(rt.gl("cult_narsie"));
		rt.setSv(f, "prey", rt.gl("cult_narsie"));
		if (rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), rt.sv(f, "prey")])), 10)) {
			yield* g.srcCall(f, "clash");
			return live(f.dot);
		}
	}
	if (!truthy(rt.sv(f, "prey"))) {
		if ((!truthy(rt.sv(f, "prey")) && truthy(rt.length(live(meals))))) {
			L = rt.sv(f, "prey");
			rt.setSv(f, "prey", rt.op(f, "PickUnweighted", [1], [live(meals)]));
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "prey"), "<span class='heavy_brass'><font size=5>\"You will do, heretic.\"</font></span>\n<span class='userdanger'>You feel something massive turn its crushing focus to you...</span>"]);
			yield* g.callName(f, live(L), "playsound_local", [null, rt.sv(f, "prey"), null, rt.rsc("sound/effects/ratvar_reveal.ogg"), null, 100, null, 0, "pressure_affected", 0], rt.Args.Named);
		}
	} else {
		if (((((!truthy((rt.istype(rt.sv(f, "prey"), T("/obj/singularity/narsie")) ? 1 : 0)) && truthy(rt.op(f, "Prob", [], [10]))) && rt.gt(rt.length(live(meals)), 1)) || !isEqual(rt.fv(f, "z", rt.sv(f, "prey")), rt.sv(f, "z"))) || !truthy((rt.isIn(f, rt.sv(f, "prey"), live(meals)) ? 1 : 0)))) {
			if (truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [rt.sv(f, "prey")])))) {
				yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "prey"), "<span class='heavy_brass'><font size=5>\"Serve me well.\"</font></span>\n<span class='big_brass'>You feel great joy as your god turns His eye to another heretic...</span>"]);
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "prey"), "<span class='heavy_brass'><font size=5>\"No matter. I will find you later, heretic.\"</font></span>\n<span class='userdanger'>You feel tremendous relief as the crushing focus relents...</span>"]);
			}
			rt.setSv(f, "prey", null);
		} else {
			dir_to_step_in = rt.getDir(f, live(f.src), rt.sv(f, "prey"));
		}
	}
	yield* g.call(f, P("/proc/step"), null, [live(f.src), live(dir_to_step_in)]);
	return f.dot;
}, true, { waitfor: false });

// /obj/structure/destructible/clockwork/massive/ratvar/proc/clash  (code/game/gamemodes/clock_cult/clock_structures/ratvar_the_clockwork_justicar.dm:99)  may sleep
rt.def("/obj/structure/destructible/clockwork/massive/ratvar/proc/clash", function* clash(f: Frame) {
	if ((truthy(rt.sv(f, "clashing")) || !isEqual(rt.sv(f, "prey"), rt.gl("cult_narsie")))) {
		return live(f.dot);
	}
	rt.setSv(f, "clashing", 1);
	rt.setFv(f, "clashing", rt.gl("cult_narsie"), 1);
	yield* g.call(f, P("/proc/to_chat"), null, [rt.world(), fmt("<span class='heavy_brass'><font size=5>\"＀\"</font></span>", [rt.op(f, "PickUnweighted", [3], ["BLOOD GOD!!!", "NAR-SIE!!!", "AT LAST, YOUR TIME HAS COME!"])])]);
	yield* g.call(f, P("/proc/to_chat"), null, [rt.world(), "<span class='cult'><font size=5>\"<b>Ratvar?! How?!</b>\"</font></span>"]);
	yield* g.srcCall(f, "clash_of_the_titans", rt.gl("cult_narsie"));
	return 1;
}, true);

// /obj/structure/destructible/clockwork/massive/ratvar/proc/clash_of_the_titans  (code/game/gamemodes/clock_cult/clock_structures/ratvar_the_clockwork_justicar.dm:110)  may sleep
rt.def("/obj/structure/destructible/clockwork/massive/ratvar/proc/clash_of_the_titans", function* clash_of_the_titans(f: Frame, narsie: Value) {
	let winner: Value = null, base_victory_chance: Value = null, M: Value = null, ratvar_chance: Value = null, narsie_chance: Value = null, M_4: Value = null;
	let $0: any, $e: any;
	f.vars = () => [narsie, winner, base_victory_chance, M, ratvar_chance, narsie_chance, M_4, $0, $e];
	winner = "Undeclared";
	base_victory_chance = 1;
	while (truthy(live(f.src)) && truthy(live(narsie))) {
		yield* g.call(f, P("/proc/sound_to_playing_players"), null, [rt.rsc("sound/magic/clockwork/ratvar_attack.ogg")]);
		yield* g.call(f, P("/proc/sleep"), null, [5.199999809265137]);
		M = null;
		rt.forList(f, 0, rt.gl("mob_list"), T("/mob"));
		while (($e = rt.next(f, 0)) !== undefined) {
			M = $e;
			if (!truthy((rt.istype(live(M), T("/mob/dead/new_player")) ? 1 : 0))) {
				yield* g.call(f, P("/proc/flash_color"), null, [null, live(M), "flash_color", "#966400", "flash_time", 1], rt.Args.Named);
				yield* g.call(f, P("/proc/shake_camera"), null, [live(M), 4, 3]);
			}
		}
		rt.endFor(f, 0);
		ratvar_chance = (yield* g.call(f, P("/proc/min"), null, [rt.length(rt.gv(f, "servants_of_ratvar", rt.fv(f, "mode", rt.gl("SSticker")))), 50]));
		narsie_chance = (yield* g.call(f, P("/proc/min"), null, [rt.length(rt.gv(f, "cult", rt.fv(f, "mode", rt.gl("SSticker")))), 50]));
		ratvar_chance = (yield* g.call(f, P("/proc/rand"), null, [live(base_victory_chance), live(ratvar_chance)]));
		narsie_chance = (yield* g.call(f, P("/proc/rand"), null, [live(base_victory_chance), live(narsie_chance)]));
		if (rt.gt(live(ratvar_chance), live(narsie_chance))) {
			winner = "Ratvar";
			break;
		}
		yield* g.call(f, P("/proc/sleep"), null, [(yield* g.call(f, P("/proc/rand"), null, [2, 5]))]);
		yield* g.call(f, P("/proc/sound_to_playing_players"), null, [rt.rsc("sound/magic/clockwork/narsie_attack.ogg")]);
		yield* g.call(f, P("/proc/sleep"), null, [7.400000095367432]);
		M_4 = null;
		rt.forList(f, 0, rt.gl("mob_list"), T("/mob"));
		while (($e = rt.next(f, 0)) !== undefined) {
			M_4 = $e;
			if (!truthy((rt.istype(live(M_4), T("/mob/dead/new_player")) ? 1 : 0))) {
				yield* g.call(f, P("/proc/flash_color"), null, [null, live(M_4), "flash_color", "#C80000", "flash_time", 1], rt.Args.Named);
				yield* g.call(f, P("/proc/shake_camera"), null, [live(M_4), 4, 3]);
			}
		}
		rt.endFor(f, 0);
		if (rt.gt(live(narsie_chance), live(ratvar_chance))) {
			winner = "Nar-Sie";
			break;
		}
		(base_victory_chance = rt.modify(live(base_victory_chance), 2, multiply));
	}
	$0 = live(winner);
	if ($0 === "Ratvar") {
		yield* g.call(f, P("/proc/send_to_playing_players"), null, [fmt("<span class='heavy_brass'><font size=5>\"＀\"</font></span>\n<span class='cult'><font size=5>\"<b>＀\"</b></font></span>", [rt.op(f, "PickUnweighted", [4], ["DIE! DIE! DIE!", "FILTH!!!", "SUFFER!!!", (yield* g.call(f, P("/proc/text2ratvar"), null, ["ROT FOR CENTURIES AS I HAVE!!"]))]), rt.op(f, "PickUnweighted", [4], ["Nooooo...", "Not die. To y-", "Die. Ratv-", "Sas tyen re-"])])]);
		yield* g.call(f, P("/proc/sound_to_playing_players"), null, [rt.rsc("sound/magic/clockwork/anima_fragment_attack.ogg")]);
		yield* g.call(f, P("/proc/sound_to_playing_players"), null, [rt.rsc("sound/magic/demon_dies.ogg"), 50]);
		rt.setSv(f, "clashing", 0);
		yield* g.call(f, P("/proc/qdel"), null, [live(narsie)]);
	} else if ($0 === "Nar-Sie") {
		yield* g.call(f, P("/proc/send_to_playing_players"), null, [fmt("<span class='cult'><font size=5>\"<b>＀</b>\"</font></span>", [rt.op(f, "PickUnweighted", [3], ["Ha.", "Ra'sha fonn dest.", "You fool. To come here."])])]);
		yield* g.call(f, P("/proc/sound_to_playing_players"), null, [rt.rsc("sound/magic/demon_attack1.ogg")]);
		yield* g.call(f, P("/proc/sound_to_playing_players"), null, [rt.rsc("sound/magic/clockwork/anima_fragment_death.ogg"), 50]);
		rt.setFv(f, "clashing", live(narsie), 0);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	}
	return f.dot;
}, true);
