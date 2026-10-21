// From code/game/gamemodes/miniantags/abduction/machinery/experiment.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10440, "/obj/machinery/abductor/experiment", "/obj/machinery/abductor", {
	points: 0,
	credits: 0,
	history: null,
	abductee_minds: null,
	flash: " - || - ",
	console: null,
	anchored: 1,
	name: "experimentation machine",
	desc: "A large man-sized tube sporting a complex array of surgical machinery.",
	icon: rt.rsc("icons/obj/abductor.dmi"),
	icon_state: "experiment-open",
	density: 0,
	state_open: 1,
});

// /obj/machinery/abductor/experiment/proc/MouseDrop_T  (code/game/gamemodes/miniantags/abduction/machinery/experiment.dm:17)  may sleep
rt.def("/obj/machinery/abductor/experiment/proc/MouseDrop_T", function* MouseDrop_T(f: Frame, target: Value, user: Value) {
	f.vars = () => [target, user];
	if (((((truthy(rt.fv(f, "stat", live(user))) || truthy(rt.fv(f, "lying", live(user)))) || !truthy((yield* g.srcCall(f, "Adjacent", live(user))))) || !truthy((yield* g.callName(f, live(target), "Adjacent", [live(user)])))) || !truthy((rt.istype(live(target), T("/mob/living/carbon/human")) ? 1 : 0)))) {
		return live(f.dot);
	}
	if (truthy((yield* g.call(f, P("/proc/is_species"), null, [live(target), T("/datum/species/abductor")])))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "close_machine", live(target));
	return f.dot;
}, true);

// /obj/machinery/abductor/experiment/proc/attack_hand  (code/game/gamemodes/miniantags/abduction/machinery/experiment.dm:24)  may sleep
rt.def("/obj/machinery/abductor/experiment/proc/attack_hand", function* attack_hand(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "experimentUI", live(f.args[0]));
	return f.dot;
}, true, { args: ["user"] });

// /obj/machinery/abductor/experiment/proc/open_machine  (code/game/gamemodes/miniantags/abduction/machinery/experiment.dm:30)  may sleep
rt.def("/obj/machinery/abductor/experiment/proc/open_machine", function* open_machine(f: Frame) {
	if (!(!truthy(rt.sv(f, "state_open")) && !truthy(rt.sv(f, "panel_open")))) return f.dot;
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/machinery/abductor/experiment/proc/close_machine  (code/game/gamemodes/miniantags/abduction/machinery/experiment.dm:34)  may sleep
rt.def("/obj/machinery/abductor/experiment/proc/close_machine", function* close_machine(f: Frame, target: Value) {
	let A: Value = null;
	let $e: any;
	f.vars = () => [target, A, $e];
	A = null;
	rt.forList(f, 0, rt.sv(f, "loc"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if (truthy((yield* g.call(f, P("/proc/is_species"), null, [live(A), T("/datum/species/abductor")])))) {
			return live(f.dot);
		}
	}
	rt.endFor(f, 0);
	if (!(truthy(rt.sv(f, "state_open")) && !truthy(rt.sv(f, "panel_open")))) return f.dot;
	yield* g.callSuper(f, [live(target)]);
	return f.dot;
}, true);

// /obj/machinery/abductor/experiment/proc/relaymove  (code/game/gamemodes/miniantags/abduction/machinery/experiment.dm:41)  may sleep
rt.def("/obj/machinery/abductor/experiment/proc/relaymove", function* relaymove(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!isEqual(rt.fv(f, "stat", live(user)), 0)) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "container_resist", live(user));
	return f.dot;
}, true);

// /obj/machinery/abductor/experiment/proc/container_resist  (code/game/gamemodes/miniantags/abduction/machinery/experiment.dm:47)  may sleep
rt.def("/obj/machinery/abductor/experiment/proc/container_resist", function* container_resist(f: Frame, user: Value) {
	let breakout_time: Value = null;
	f.vars = () => [user, breakout_time];
	breakout_time = 600;
	yield* g.callName(f, live(user), "changeNext_move", [100]);
	rt.setFv(f, "last_special", live(user), add(rt.worldTime(f), 100));
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You lean on the back of ＀ and start pushing the door open... (this will take about a minute.)</span>", [live(f.src)])]);
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='italics'>You hear a metallic creaking from ＀!</span>", [live(f.src)])]);
	if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, live(breakout_time), "target", live(f.src)], rt.Args.Named)))) return f.dot;
	if ((((!truthy(live(user)) || !isEqual(rt.fv(f, "stat", live(user)), 0)) || !isEqual(rt.fv(f, "loc", live(user)), live(f.src))) || truthy(rt.sv(f, "state_open")))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ successfully broke out of ＀!</span>", [live(user), live(f.src)]));
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You successfully break out of ＀!</span>", [live(f.src)])]);
	yield* g.srcCall(f, "open_machine");
	return f.dot;
}, true);

// /obj/machinery/abductor/experiment/proc/dissection_icon  (code/game/gamemodes/miniantags/abduction/machinery/experiment.dm:64)
rt.def("/obj/machinery/abductor/experiment/proc/dissection_icon", function dissection_icon(f: Frame, H: Value) {
	let photo: Value = null, _g: Value = null, eyes: Value = null, S: Value = null, hair: Value = null, facial: Value = null, splat: Value = null;
	let $0: any;
	f.vars = () => [photo, _g, eyes, S, hair, facial, splat, $0];
	photo = null;
	if (isEqual(rt.fv(f, "gender", live(H)), "female")) {
		$0 = "f";
	} else {
		$0 = "m";
	}
	_g = $0;
	if ((!truthy(rt.fv(f, "mutant_races", rt.gl("config"))) || truthy(rt.gv(f, "use_skintones", rt.gv(f, "species", rt.fv(f, "dna", live(H))))))) {
		photo = rt.call(f, P("/proc/icon"), null, ["icon", rt.rsc("icons/mob/human.dmi"), "icon_state", fmt("＀_＀", [rt.fv(f, "skin_tone", live(H)), live(_g)])], rt.Args.Named);
	} else {
		rt.callName(f, (photo = rt.call(f, P("/proc/icon"), null, ["icon", rt.rsc("icons/mob/human.dmi"), "icon_state", fmt("＀_＀", [rt.gv(f, "id", rt.gv(f, "species", rt.fv(f, "dna", live(H)))), live(_g)])], rt.Args.Named)), "Blend", [fmt("#＀", [rt.index(rt.gv(f, "features", rt.fv(f, "dna", live(H))), "mcolor")]), 2]);
	}
	eyes = null;
	if (truthy((rt.isIn(f, 4, rt.gv(f, "species_traits", rt.gv(f, "species", rt.fv(f, "dna", live(H))))) ? 1 : 0))) {
		rt.callName(f, (eyes = rt.call(f, P("/proc/icon"), null, ["icon", rt.rsc("icons/mob/human_face.dmi"), "icon_state", "eyes"], rt.Args.Named)), "Blend", [fmt("#＀", [rt.fv(f, "eye_color", live(H))]), 2]);
	}
	S = null;
	if ((truthy((S = rt.index(rt.gl("hair_styles_list"), rt.fv(f, "hair_style", live(H))))) && truthy((rt.isIn(f, 2, rt.gv(f, "species_traits", rt.gv(f, "species", rt.fv(f, "dna", live(H))))) ? 1 : 0)))) {
		rt.callName(f, (hair = rt.call(f, P("/proc/icon"), null, ["icon", rt.fv(f, "icon", live(S)), "icon_state", fmt("＀", [rt.fv(f, "icon_state", live(S))])], rt.Args.Named)), "Blend", [fmt("#＀", [rt.fv(f, "hair_color", live(H))]), 2]);
		rt.callName(f, live(eyes), "Blend", [live(hair), 3]);
	}
	if ((truthy((S = rt.index(rt.gl("facial_hair_styles_list"), rt.fv(f, "facial_hair_style", live(H))))) && truthy((rt.isIn(f, 3, rt.gv(f, "species_traits", rt.gv(f, "species", rt.fv(f, "dna", live(H))))) ? 1 : 0)))) {
		rt.callName(f, (facial = rt.call(f, P("/proc/icon"), null, ["icon", rt.fv(f, "icon", live(S)), "icon_state", fmt("＀", [rt.fv(f, "icon_state", live(S))])], rt.Args.Named)), "Blend", [fmt("#＀", [rt.fv(f, "facial_hair_color", live(H))]), 2]);
		rt.callName(f, live(eyes), "Blend", [live(facial), 3]);
	}
	if (truthy(live(eyes))) {
		rt.callName(f, live(photo), "Blend", [live(eyes), 3]);
	}
	splat = rt.call(f, P("/proc/icon"), null, ["icon", rt.rsc("icons/mob/dam_mob.dmi"), "icon_state", "chest30"], rt.Args.Named);
	rt.callName(f, live(photo), "Blend", [live(splat), 3]);
	return live(photo);
});

// /obj/machinery/abductor/experiment/proc/experimentUI  (code/game/gamemodes/miniantags/abduction/machinery/experiment.dm:99)  may sleep
rt.def("/obj/machinery/abductor/experiment/proc/experimentUI", function* experimentUI(f: Frame, user: Value) {
	let dat: Value = null, _P: Value = null, mob_occupant: Value = null, popup: Value = null;
	let $0: any, $1: any;
	f.vars = () => [user, dat, _P, mob_occupant, popup, $0, $1];
	dat = null;
	dat = rt.modify(live(dat), "<h3> Experiment </h3>", add);
	if (truthy(rt.sv(f, "occupant"))) {
		yield* g.callName(f, (_P = (yield* g.new_(f, T("/obj/item/weapon/photo"), []))), "photocreate", [null, (yield* g.call(f, P("/proc/icon"), null, [null, (yield* g.srcCall(f, "dissection_icon", rt.sv(f, "occupant"))), "dir", 2], rt.Args.Named))]);
		rt.op(f, "BrowseResource", [], [live(user), rt.fv(f, "img", live(_P)), "dissection_img"], false);
		dat = rt.modify(live(dat), "<table><tr><td>", add);
		dat = rt.modify(live(dat), "<img src=dissection_img height=80 width=80>", add);
		dat = rt.modify(live(dat), "</td><td>", add);
		dat = rt.modify(live(dat), fmt("<a href='?src=＃;experiment=1'>Probe</a><br>", [live(f.src)]), add);
		dat = rt.modify(live(dat), fmt("<a href='?src=＃;experiment=2'>Dissect</a><br>", [live(f.src)]), add);
		dat = rt.modify(live(dat), fmt("<a href='?src=＃;experiment=3'>Analyze</a><br>", [live(f.src)]), add);
		dat = rt.modify(live(dat), "</td></tr></table>", add);
	} else {
		dat = rt.modify(live(dat), "<span class='linkOff'>Experiment </span>", add);
	}
	if (!truthy(rt.sv(f, "occupant"))) {
		dat = rt.modify(live(dat), "<h3>Machine Unoccupied</h3>", add);
	} else {
		dat = rt.modify(live(dat), "<h3>Subject Status : </h3>", add);
		dat = rt.modify(live(dat), fmt("＀ => ", [rt.fv(f, "name", rt.sv(f, "occupant"))]), add);
		$0 = rt.gv(f, "stat", (mob_occupant = rt.sv(f, "occupant")));
		if ($0 === 0) {
			dat = rt.modify(live(dat), "<span class='good'>Conscious</span>", add);
		} else if ($0 === 1) {
			dat = rt.modify(live(dat), "<span class='average'>Unconscious</span>", add);
		} else {
			dat = rt.modify(live(dat), "<span class='bad'>Deceased</span>", add);
		}
	}
	dat = rt.modify(live(dat), "<br>", add);
	dat = rt.modify(live(dat), fmt("＀", [rt.sv(f, "flash")]), add);
	dat = rt.modify(live(dat), "<br>", add);
	dat = rt.modify(live(dat), fmt("<a href='?src=＃;refresh=1'>Scan</a>", [live(f.src)]), add);
	$0 = live(f.src);
	if (truthy(rt.sv(f, "state_open"))) {
		$1 = "close=1'>Close</a>";
	} else {
		$1 = "open=1'>Open</a>";
	}
	dat = rt.modify(live(dat), fmt("<a href='?src=＃;＀", [$0, $1]), add);
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(user), "experiment", "Probing Console", 300, 300]))), "set_title_image", [(yield* g.callName(f, live(user), "browse_rsc_icon", [rt.sv(f, "icon"), rt.sv(f, "icon_state")]))]);
	yield* g.callName(f, live(popup), "set_content", [live(dat)]);
	yield* g.callName(f, live(popup), "open", []);
	return f.dot;
}, true);

// /obj/machinery/abductor/experiment/proc/Topic  (code/game/gamemodes/miniantags/abduction/machinery/experiment.dm:138)  may sleep
rt.def("/obj/machinery/abductor/experiment/proc/Topic", function* Topic(f: Frame) {
	let mob_occupant: Value = null;
	f.vars = () => [mob_occupant];
	if ((truthy((yield* g.callSuper(f, [], rt.Args.Same))) || isEqual(live(f.usr), rt.sv(f, "occupant")))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(f.usr), "set_machine", [live(f.src)]);
	if (truthy(rt.at(live(f.args[1]), "refresh"))) {
		yield* g.srcCall(f, "updateUsrDialog");
		return live(f.dot);
	}
	if (truthy(rt.at(live(f.args[1]), "open"))) {
		yield* g.srcCall(f, "open_machine");
		return live(f.dot);
	}
	if (truthy(rt.at(live(f.args[1]), "close"))) {
		yield* g.srcCall(f, "close_machine");
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "occupant"))) {
		if (!isEqual(rt.gv(f, "stat", (mob_occupant = rt.sv(f, "occupant"))), 2)) {
			if (truthy(rt.at(live(f.args[1]), "experiment"))) {
				rt.setSv(f, "flash", (yield* g.srcCall(f, "Experiment", rt.sv(f, "occupant"), rt.at(live(f.args[1]), "experiment"))));
			}
		}
	}
	yield* g.srcCall(f, "updateUsrDialog");
	yield* g.srcCall(f, "add_fingerprint", live(f.usr));
	return f.dot;
}, true, { args: ["href", "href_list"] });

// /obj/machinery/abductor/experiment/proc/Experiment  (code/game/gamemodes/miniantags/abduction/machinery/experiment.dm:159)  may sleep
rt.def("/obj/machinery/abductor/experiment/proc/Experiment", function* Experiment(f: Frame, occupant: Value, type: Value) {
	let H: Value = null, point_reward: Value = null, GlandTest: Value = null, objtype: Value = null, O: Value = null, G: Value = null;
	let $0: any, $e: any;
	f.vars = () => [occupant, type, H, point_reward, GlandTest, objtype, O, G, $0, $e];
	if (!truthy(rt.sv(f, "history"))) {
		rt.setSv(f, "history", rt.list());
	}
	H = live(occupant);
	point_reward = 0;
	if (truthy((rt.isIn(f, live(H), rt.sv(f, "history")) ? 1 : 0))) {
		return "<span class='bad'>Specimen already in database.</span>";
	}
	if (isEqual(rt.fv(f, "stat", live(H)), 2)) {
		yield* g.srcCall(f, "say", "Specimen deceased - please provide fresh sample.");
		return "<span class='bad'>Specimen deceased.</span>";
	}
	if (!truthy((GlandTest = rt.locateIn(f, T("/obj/item/organ/heart/gland"), rt.fv(f, "internal_organs", live(H)))))) {
		yield* g.srcCall(f, "say", "Experimental dissection not detected!");
		return "<span class='bad'>No glands detected!</span>";
	}
	if ((rt.fv(f, "mind", live(H)) !== null && rt.fv(f, "ckey", live(H)) !== null)) {
		if (!truthy(rt.sv(f, "abductee_minds"))) {
			rt.setSv(f, "abductee_minds", rt.list());
		}
		if (!truthy(rt.sv(f, "history"))) {
			rt.setSv(f, "history", rt.list());
		}
		rt.modSrcVar(f, "history", live(H), add);
		if (!truthy(rt.sv(f, "abductee_minds"))) {
			rt.setSv(f, "abductee_minds", rt.list());
		}
		rt.modSrcVar(f, "abductee_minds", rt.fv(f, "mind", live(H)), add);
		yield* g.srcCall(f, "say", "Processing specimen...");
		yield* g.call(f, P("/proc/sleep"), null, [5]);
		$0 = (yield* g.call(f, P("/proc/text2num"), null, [live(type)]));
		if ($0 === 1) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<span class='warning'>You feel violated.</span>"]);
		} else if ($0 === 2) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<span class='warning'>You feel yourself being sliced apart and put back together.</span>"]);
		} else if ($0 === 3) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<span class='warning'>You feel intensely watched.</span>"]);
		}
		yield* g.call(f, P("/proc/sleep"), null, [5]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<span class='warning'><b>Your mind snaps!</b></span>"]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<big><span class='warning'><b>You can't remember how you got here...</b></span></big>"]);
		if (truthy(rt.op(f, "Prob", [], [75]))) {
			$0 = T("/datum/objective/abductee/random");
		} else {
			$0 = rt.op(f, "PickUnweighted", [1], [subtract(subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/datum/objective/abductee")])), T("/datum/objective/abductee")), T("/datum/objective/abductee/random"))]);
		}
		objtype = $0;
		O = (yield* g.new_(f, live(objtype), []));
		rt.modField(f, rt.fv(f, "mode", rt.gl("SSticker")), "abductees", rt.fv(f, "mind", live(H)), add);
		rt.modField(f, rt.fv(f, "mind", live(H)), "objectives", live(O), add);
		yield* g.callName(f, rt.fv(f, "mind", live(H)), "announce_objectives", []);
		yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "update_abductor_icons_added", [rt.fv(f, "mind", live(H))]);
		G = null;
		rt.forList(f, 0, rt.fv(f, "internal_organs", live(H)), T("/obj/item/organ/heart/gland"));
		while (($e = rt.next(f, 0)) !== undefined) {
			G = $e;
			yield* g.callName(f, live(G), "Start", []);
			point_reward = rt.inc(live(point_reward), 1);
		}
		rt.endFor(f, 0);
		if (rt.gt(live(point_reward), 0)) {
			yield* g.srcCall(f, "open_machine");
			yield* g.srcCall(f, "SendBack", live(H));
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/machines/ding.ogg"), 50, 1]);
			rt.modSrcVar(f, "points", live(point_reward), add);
			rt.modSrcVar(f, "credits", live(point_reward), add);
			return fmt("<span class='good'>Experiment successful! ＀ new data-points collected.</span>", [live(point_reward)]);
		}
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/machines/buzz-sigh.ogg"), 50, 1]);
		return "<span class='bad'>Experiment failed! No replacement organ detected.</span>";
	} else {
		yield* g.srcCall(f, "say", "Brain activity nonexistent - disposing sample...");
		yield* g.srcCall(f, "open_machine");
		yield* g.srcCall(f, "SendBack", live(H));
		return "<span class='bad'>Specimen braindead - disposed.</span>";
	}
	return "<span class='bad'>ERROR</span>";
}, true);

// /obj/machinery/abductor/experiment/proc/SendBack  (code/game/gamemodes/miniantags/abduction/machinery/experiment.dm:216)  may sleep
rt.def("/obj/machinery/abductor/experiment/proc/SendBack", function* SendBack(f: Frame, H: Value) {
	f.vars = () => [H];
	yield* g.callName(f, live(H), "Sleeping", [160]);
	yield* g.callName(f, live(H), "uncuff", []);
	if (((truthy(rt.sv(f, "console")) && truthy(rt.fv(f, "pad", rt.sv(f, "console")))) && truthy(rt.gv(f, "teleport_target", rt.fv(f, "pad", rt.sv(f, "console")))))) {
		yield* g.callName(f, live(H), "forceMove", [rt.gv(f, "teleport_target", rt.fv(f, "pad", rt.sv(f, "console")))]);
		return live(f.dot);
	}
	yield* g.callName(f, rt.gl("SSjob"), "SendToLateJoin", [live(H), 0]);
	return live(f.dot);
}, true);

// /obj/machinery/abductor/experiment/proc/update_icon  (code/game/gamemodes/miniantags/abduction/machinery/experiment.dm:228)
rt.def("/obj/machinery/abductor/experiment/proc/update_icon", function update_icon(f: Frame) {
	if (truthy(rt.sv(f, "state_open"))) {
		rt.setSv(f, "icon_state", "experiment-open");
	} else {
		rt.setSv(f, "icon_state", "experiment");
	}
	return f.dot;
});
