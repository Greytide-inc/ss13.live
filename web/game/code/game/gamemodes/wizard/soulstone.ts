// From code/game/gamemodes/wizard/soulstone.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9218, "/obj/item/device/soulstone", "/obj/item/device", {
	usability: 0,
	reusable: 1,
	spent: 0,
	name: "soulstone shard",
	icon: rt.rsc("icons/obj/wizard.dmi"),
	icon_state: "soulstone",
	item_state: "electronic",
	layer: 3.6,
	desc: "A fragment of the legendary treasure known simply as the 'Soul Stone'. The shard still flickers with a fraction of the full artefact's power.",
	w_class: 1,
	slot_flags: 512,
	origin_tech: "bluespace=4;materials=5",
});

// /obj/item/device/soulstone/proc/was_used  (code/game/gamemodes/wizard/soulstone.dm:17)
rt.def("/obj/item/device/soulstone/proc/was_used", function was_used(f: Frame) {
	if (truthy(rt.sv(f, "reusable"))) return f.dot;
	rt.setSv(f, "spent", 1);
	rt.setSv(f, "name", fmt("dull ＀", [rt.sv(f, "name")]));
	rt.setSv(f, "desc", "A fragment of the legendary treasure known simply as the 'Soul Stone'. The shard lies still, dull and lifeless; whatever spark it once held long extinguished.");
	return f.dot;
});

// /obj/item/device/soulstone/proc/pickup  (code/game/gamemodes/wizard/soulstone.dm:32)
rt.def("/obj/item/device/soulstone/proc/pickup", function pickup(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!((!truthy(rt.call(f, P("/proc/iscultist"), null, [live(f.args[0])])) && !truthy(rt.call(f, P("/proc/iswizard"), null, [live(f.args[0])]))) && !truthy(rt.sv(f, "usability")))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='danger'>An overwhelming feeling of dread comes over you as you pick up the soulstone. It would be wise to be rid of this quickly.</span>"]);
	rt.callName(f, live(f.args[0]), "Dizzy", [120]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/device/soulstone/proc/examine  (code/game/gamemodes/wizard/soulstone.dm:38)
rt.def("/obj/item/device/soulstone/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!(((truthy(rt.sv(f, "usability")) || truthy(rt.call(f, P("/proc/iscultist"), null, [live(f.args[0])]))) || truthy(rt.call(f, P("/proc/iswizard"), null, [live(f.args[0])]))) || truthy((rt.istype(live(f.args[0]), T("/mob/dead/observer")) ? 1 : 0)))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='cult'>A soulstone, used to capture souls, either from unconscious or sleeping humans or from freed shades.</span>"]);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='cult'>The captured soul can be placed into a construct shell to produce a construct, or released from the stone as a shade.</span>"]);
	if (!truthy(rt.sv(f, "spent"))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='cult'>This shard is spent; it is now just a creepy rock.</span>"]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/device/soulstone/proc/attack  (code/game/gamemodes/wizard/soulstone.dm:48)  may sleep
rt.def("/obj/item/device/soulstone/proc/attack", function* attack(f: Frame) {
	if (((!truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(f.args[1])]))) && !truthy((yield* g.call(f, P("/proc/iswizard"), null, [live(f.args[1])])))) && !truthy(rt.sv(f, "usability")))) {
		yield* g.callName(f, live(f.args[1]), "Unconscious", [100]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='userdanger'>Your body is wracked with debilitating pain!</span>"]);
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "spent"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>There is no power left in the shard.</span>"]);
		return live(f.dot);
	}
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0))) {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	if (truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(f.args[0])])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='cultlarge'>\"Come now, do not capture your bretheren's soul.\"</span>"]);
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/add_logs"), null, [live(f.args[1]), live(f.args[0]), fmt("captured ＀'s soul", [rt.fv(f, "name", live(f.args[0]))]), live(f.src)]);
	yield* g.srcCall(f, "transfer_soul", "VICTIM", live(f.args[0]), live(f.args[1]));
	return f.dot;
}, true, { args: ["M", "user"] });

// /obj/item/device/soulstone/proc/attack_self  (code/game/gamemodes/wizard/soulstone.dm:67)  may sleep
rt.def("/obj/item/device/soulstone/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(user)])), 1)) {
		return live(f.dot);
	}
	if (((!truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(user)]))) && !truthy((yield* g.call(f, P("/proc/iswizard"), null, [live(user)])))) && !truthy(rt.sv(f, "usability")))) {
		yield* g.callName(f, live(user), "Unconscious", [100]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='userdanger'>Your body is wracked with debilitating pain!</span>"]);
		return live(f.dot);
	}
	yield* g.srcCall(f, "release_shades", live(user));
	return f.dot;
}, true);

// /obj/item/device/soulstone/proc/release_shades  (code/game/gamemodes/wizard/soulstone.dm:76)  may sleep
rt.def("/obj/item/device/soulstone/proc/release_shades", function* release_shades(f: Frame, user: Value) {
	let A: Value = null;
	let $e: any;
	f.vars = () => [user, A, $e];
	A = null;
	rt.forList(f, 0, live(f.src), T("/mob/living/simple_animal/shade"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		(rt.modField(f, live(A), "status_flags", 16773119, rt.bitAnd));
		rt.setFv(f, "canmove", live(A), 1);
		yield* g.callName(f, live(A), "forceMove", [rt.getStep(f, live(user), 0)]);
		yield* g.callName(f, live(A), "cancel_camera", []);
		rt.setSv(f, "icon_state", "soulstone");
		rt.setSv(f, "name", rt.initial(f, live(f.src), "name"));
		if ((truthy((yield* g.call(f, P("/proc/iswizard"), null, [live(user)]))) || truthy(rt.sv(f, "usability")))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(A), fmt("<b>You have been released from your prison, but you are still bound to ＀'s will. Help them succeed in their goals at all costs.</b>", [rt.fv(f, "real_name", live(user))])]);
		} else {
			if (truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(user)])))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(A), "<b>You have been released from your prison, but you are still bound to the cult's will. Help them succeed in their goals at all costs.</b>"]);
			}
		}
		yield* g.srcCall(f, "was_used");
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(12540, "/obj/structure/constructshell", "/obj/structure", {
	name: "empty shell",
	icon: rt.rsc("icons/obj/wizard.dmi"),
	icon_state: "construct-cult",
	desc: "A wicked machine used by those skilled in magical arts. It is inactive.",
});

// /obj/structure/constructshell/proc/examine  (code/game/gamemodes/wizard/soulstone.dm:97)
rt.def("/obj/structure/constructshell/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!((truthy(rt.call(f, P("/proc/iscultist"), null, [live(f.args[0])])) || truthy(rt.call(f, P("/proc/iswizard"), null, [live(f.args[0])]))) || isEqual(rt.fv(f, "stat", live(f.args[0])), 2))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='cult'>A construct shell, used to house bound souls from a soulstone.</span>"]);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='cult'>Placing a soulstone with a soul into this shell allows you to produce your choice of the following:</span>"]);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='cult'>An <b>Artificer</b>, which can produce <b>more shells and soulstones</b>, as well as fortifications.</span>"]);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='cult'>A <b>Wraith</b>, which does high damage and can jaunt through walls, though it is quite fragile.</span>"]);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='cult'>A <b>Juggernaut</b>, which is very hard to kill and can produce temporary walls, but is slow.</span>"]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/structure/constructshell/proc/attackby  (code/game/gamemodes/wizard/soulstone.dm:106)  may sleep
rt.def("/obj/structure/constructshell/proc/attackby", function* attackby(f: Frame) {
	let SS: Value = null;
	f.vars = () => [SS];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/device/soulstone")) ? 1 : 0))) {
		SS = live(f.args[0]);
		if (((!truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(f.args[1])]))) && !truthy((yield* g.call(f, P("/proc/iswizard"), null, [live(f.args[1])])))) && !truthy(rt.fv(f, "usability", live(SS))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='danger'>An overwhelming feeling of dread comes over you as you attempt to place the soulstone into the shell. It would be wise to be rid of this quickly.</span>"]);
			yield* g.callName(f, live(f.args[1]), "Dizzy", [120]);
			return live(f.dot);
		}
		yield* g.callName(f, live(SS), "transfer_soul", ["CONSTRUCT", live(f.src), live(f.args[1])]);
		yield* g.callName(f, live(SS), "was_used", []);
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["O", "user", "params"] });

// /obj/item/device/soulstone/proc/transfer_soul  (code/game/gamemodes/wizard/soulstone.dm:121)  may sleep
rt.def("/obj/item/device/soulstone/proc/transfer_soul", function* transfer_soul(f: Frame, choice: Value, target: Value, user: Value) {
	let _T: Value = null, W: Value = null, A: Value = null, construct_class: Value = null, B: Value = null;
	let $0: any, $e: any;
	f.vars = () => [choice, target, user, _T, W, A, construct_class, B, $0, $e];
	$0 = live(choice);
	if ($0 === "FORCE") {
		if (!truthy((rt.istype(live(target), T("/mob/living/carbon")) ? 1 : 0))) {
			return 0;
		}
		if (truthy(rt.len(f, rt.sv(f, "contents")))) {
			return 0;
		}
		if (rt.gv(f, "client", (_T = live(target))) !== null) {
			W = null;
			rt.forList(f, 0, live(_T), T("/obj/item"));
			while (($e = rt.next(f, 0)) !== undefined) {
				W = $e;
				yield* g.callName(f, live(_T), "dropItemToGround", [live(W)]);
			}
			rt.endFor(f, 0);
			yield* g.srcCall(f, "init_shade", live(_T), live(user));
			return 1;
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='userdanger'>Capture failed!</span>: The soul has already fled its mortal frame. You attempt to bring it back..."]);
			return (yield* g.srcCall(f, "getCultGhost", live(_T), live(user)));
		}
	} else if ($0 === "VICTIM") {
		if (truthy((yield* g.call(f, P("/proc/is_sacrifice_target"), null, [rt.gv(f, "mind", (_T = live(target)))])))) {
			if (truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(user)])))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='cult'><b>\"This soul is mine.</b></span> <span class='cultlarge'>SACRIFICE THEM!\"</span>"]);
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='danger'>The soulstone seems to reject this soul.</span>"]);
			}
			return 0;
		}
		if (truthy(rt.len(f, rt.sv(f, "contents")))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='userdanger'>Capture failed!</span>: The soulstone is full! Free an existing soul to make room."]);
		} else {
			if (!isEqual(rt.fv(f, "stat", live(_T)), 0)) {
				if (rt.fv(f, "client", live(_T)) === null) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='userdanger'>Capture failed!</span>: The soul has already fled its mortal frame. You attempt to bring it back..."]);
					yield* g.srcCall(f, "getCultGhost", live(_T), live(user));
				} else {
					W = null;
					rt.forList(f, 0, live(_T), T("/obj/item"));
					while (($e = rt.next(f, 0)) !== undefined) {
						W = $e;
						yield* g.callName(f, live(_T), "dropItemToGround", [live(W)]);
					}
					rt.endFor(f, 0);
					yield* g.callSrc(f, "init_shade", [null, live(_T), null, live(user), "vic", 1], rt.Args.Named);
					yield* g.call(f, P("/proc/qdel"), null, [live(_T)]);
				}
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='userdanger'>Capture failed!</span>: Kill or maim the victim first!"]);
			}
		}
	} else if ($0 === "SHADE") {
		_T = live(target);
		if (truthy(rt.len(f, rt.sv(f, "contents")))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='userdanger'>Capture failed!</span>: The soulstone is full! Free an existing soul to make room."]);
		} else {
			rt.setFv(f, "loc", live(_T), live(f.src));
			(rt.modField(f, live(_T), "status_flags", 4096, rt.bitOr));
			rt.setFv(f, "canmove", live(_T), 0);
			rt.setFv(f, "health", live(_T), rt.fv(f, "maxHealth", live(_T)));
			rt.setSv(f, "icon_state", "soulstone2");
			rt.setSv(f, "name", fmt("soulstone: Shade of ＀", [rt.fv(f, "real_name", live(_T))]));
			yield* g.call(f, P("/proc/to_chat"), null, [live(_T), "<span class='notice'>Your soul has been captured by the soulstone. Its arcane energies are reknitting your ethereal form.</span>"]);
			if (!isEqual(live(user), live(_T))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='info'><b>Capture successful!</b>:</span> ＀'s soul has been captured and stored within the soulstone.", [rt.fv(f, "real_name", live(_T))])]);
			}
		}
	} else if ($0 === "CONSTRUCT") {
		_T = live(target);
		if (truthy((A = rt.locateIn(f, T("/mob/living/simple_animal/shade"), live(f.src))))) {
			construct_class = (yield* g.call(f, P("/proc/alert"), null, [live(user), "Please choose which type of construct you wish to create.", null, "Juggernaut", "Wraith", "Artificer"]));
			if ((!truthy(live(_T)) || !truthy(rt.fv(f, "loc", live(_T))))) {
				return live(f.dot);
			}
			$0 = live(construct_class);
			if ($0 === "Juggernaut") {
				yield* g.call(f, P("/proc/makeNewConstruct"), null, [T("/mob/living/simple_animal/hostile/construct/armored"), live(A), live(user), 0, rt.fv(f, "loc", live(_T))]);
			} else if ($0 === "Wraith") {
				yield* g.call(f, P("/proc/makeNewConstruct"), null, [T("/mob/living/simple_animal/hostile/construct/wraith"), live(A), live(user), 0, rt.fv(f, "loc", live(_T))]);
			} else if ($0 === "Artificer") {
				if ((truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(user)]))) || truthy((yield* g.call(f, P("/proc/iswizard"), null, [live(user)]))))) {
					yield* g.call(f, P("/proc/makeNewConstruct"), null, [T("/mob/living/simple_animal/hostile/construct/builder"), live(A), live(user), 0, rt.fv(f, "loc", live(_T))]);
				} else {
					yield* g.call(f, P("/proc/makeNewConstruct"), null, [T("/mob/living/simple_animal/hostile/construct/builder/noncult"), live(A), live(user), 0, rt.fv(f, "loc", live(_T))]);
				}
			}
			B = null;
			rt.forList(f, 0, rt.gv(f, "cult", rt.fv(f, "mode", rt.gl("SSticker"))), T("/datum/mind"));
			while (($e = rt.next(f, 0)) !== undefined) {
				B = $e;
				if (isEqual(live(B), rt.fv(f, "mind", live(A)))) {
					(rt.modField(f, rt.fv(f, "mode", rt.gl("SSticker")), "cult", rt.fv(f, "mind", live(A)), subtract));
					yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "update_cult_icons_removed", [rt.fv(f, "mind", live(A))]);
				}
			}
			rt.endFor(f, 0);
			yield* g.call(f, P("/proc/qdel"), null, [live(_T)]);
			yield* g.callName(f, live(user), "drop_item", []);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='userdanger'>Creation failed!</span>: The soul stone is empty! Go kill someone!"]);
		}
	}
	return f.dot;
}, true);

// /proc/makeNewConstruct  (code/game/gamemodes/wizard/soulstone.dm:207)  may sleep
rt.def("/proc/makeNewConstruct", function* makeNewConstruct(f: Frame, ctype: Value, target: Value, stoner: Value, cultoverride: Value, loc_override: Value) {
	let newstruct: Value = null, SM: Value = null, BS: Value = null;
	let $0: any, $1: any;
	f.vars = () => [ctype, target, stoner, cultoverride, loc_override, newstruct, SM, BS, $0, $1];
	if (live(stoner) === null) {
		stoner = null;
	}
	if (live(cultoverride) === null) {
		cultoverride = 0;
	}
	if (live(loc_override) === null) {
		loc_override = null;
	}
	if (truthy(live(loc_override))) {
		$0 = live(loc_override);
	} else {
		$0 = rt.getStep(f, live(target), 0);
	}
	newstruct = (yield* g.new_(f, live(ctype), [$0]));
	if (truthy(live(stoner))) {
		(rt.modField(f, live(newstruct), "faction", fmt("＃", [live(stoner)]), rt.bitOr));
		rt.setFv(f, "master", live(newstruct), live(stoner));
		yield* g.callName(f, (SM = (yield* g.new_(f, T("/datum/action/innate/seek_master"), []))), "Grant", [live(newstruct)]);
	}
	rt.setFv(f, "key", live(newstruct), rt.fv(f, "key", live(target)));
	BS = null;
	if ((((truthy(rt.fv(f, "mind", live(newstruct))) && ((truthy(live(stoner)) && truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(stoner)])))) || truthy(live(cultoverride)))) && truthy(rt.gl("SSticker"))) && truthy(rt.fv(f, "mode", rt.gl("SSticker"))))) {
		yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "add_cultist", [rt.fv(f, "mind", live(newstruct)), 0]);
	}
	if ((truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(stoner)]))) || truthy(live(cultoverride)))) {
		$0 = live(newstruct);
		if (truthy(live(stoner))) {
			$1 = fmt(" and ＀", [live(stoner)]);
		} else {
			$1 = "";
		}
		yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<b>You are still bound to serve the cult＀, follow their orders and help them complete their goals at all costs.</b>", [$1])]);
	} else {
		if (truthy(live(stoner))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(newstruct), fmt("<b>You are still bound to serve your creator, ＀, follow their orders and help them complete their goals at all costs.</b>", [live(stoner)])]);
		}
	}
	yield* g.callName(f, live(newstruct), "clear_alert", ["bloodsense"]);
	if (truthy((BS = (yield* g.callName(f, live(newstruct), "throw_alert", ["bloodsense", T("/obj/screen/alert/bloodsense")]))))) {
		rt.setFv(f, "Cviewer", live(BS), live(newstruct));
	}
	yield* g.callName(f, live(newstruct), "cancel_camera", []);
	return f.dot;
}, true);

// /obj/item/device/soulstone/proc/init_shade  (code/game/gamemodes/wizard/soulstone.dm:229)  may sleep
rt.def("/obj/item/device/soulstone/proc/init_shade", function* init_shade(f: Frame, _T: Value, U: Value, vic: Value) {
	let S: Value = null;
	f.vars = () => [_T, U, vic, S];
	if (live(vic) === null) {
		vic = 0;
	}
	yield* g.new_(f, T("/obj/effect/decal/remains/human"), [rt.fv(f, "loc", live(_T))]);
	rt.setFv(f, "invisibility", live(_T), 101);
	yield* g.callName(f, live(_T), "dust_animation", []);
	(rt.modField(f, (S = (yield* g.new_(f, T("/mob/living/simple_animal/shade"), [live(f.src)]))), "status_flags", 4096, rt.bitOr));
	rt.setFv(f, "canmove", live(S), 0);
	rt.setFv(f, "name", live(S), fmt("Shade of ＀", [rt.fv(f, "real_name", live(_T))]));
	rt.setFv(f, "real_name", live(S), fmt("Shade of ＀", [rt.fv(f, "real_name", live(_T))]));
	rt.setFv(f, "key", live(S), rt.fv(f, "key", live(_T)));
	if (truthy(live(U))) {
		(rt.modField(f, live(S), "faction", fmt("＃", [live(U)]), rt.bitOr));
	}
	if ((truthy(live(U)) && truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(U)]))))) {
		yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "add_cultist", [rt.fv(f, "mind", live(S)), 0]);
	}
	yield* g.callName(f, live(S), "cancel_camera", []);
	rt.setSv(f, "name", fmt("soulstone: Shade of ＀", [rt.fv(f, "real_name", live(_T))]));
	rt.setSv(f, "icon_state", "soulstone2");
	if ((truthy(live(U)) && (truthy((yield* g.call(f, P("/proc/iswizard"), null, [live(U)]))) || truthy(rt.sv(f, "usability"))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(S), fmt("Your soul has been captured! You are now bound to ＀'s will. Help them succeed in their goals at all costs.", [rt.fv(f, "real_name", live(U))])]);
	} else {
		if ((truthy(live(U)) && truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(U)]))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(S), "Your soul has been captured! You are now bound to the cult's will. Help them succeed in their goals at all costs."]);
		}
	}
	if (!(truthy(live(vic)) && truthy(live(U)))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [live(U), fmt("<span class='info'><b>Capture successful!</b>:</span> ＀'s soul has been ripped from their body and stored within the soul stone.", [rt.fv(f, "real_name", live(_T))])]);
	return f.dot;
}, true);

// /obj/item/device/soulstone/proc/getCultGhost  (code/game/gamemodes/wizard/soulstone.dm:256)  may sleep
rt.def("/obj/item/device/soulstone/proc/getCultGhost", function* getCultGhost(f: Frame, _T: Value, U: Value) {
	let chosen_ghost: Value = null, ghost: Value = null, consenting_candidates: Value = null, W: Value = null;
	let $e: any;
	f.vars = () => [_T, U, chosen_ghost, ghost, consenting_candidates, W, $e];
	chosen_ghost = null;
	ghost = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob/dead/observer"));
	while (($e = rt.next(f, 0)) !== undefined) {
		ghost = $e;
		if (((truthy(rt.fv(f, "mind", live(ghost))) && isEqual(rt.gv(f, "current", rt.fv(f, "mind", live(ghost))), live(_T))) && truthy(rt.fv(f, "client", live(ghost))))) {
			chosen_ghost = live(ghost);
			break;
		}
	}
	rt.endFor(f, 0);
	if (!truthy(live(chosen_ghost))) {
		if (truthy(rt.getLen(f, (consenting_candidates = (yield* g.call(f, P("/proc/pollGhostCandidates"), null, [null, "Would you like to play as a Shade?", null, "Cultist", null, null, null, "cultist", "poll_time", 50], rt.Args.Named)))))) {
			chosen_ghost = rt.op(f, "PickUnweighted", [1], [live(consenting_candidates)]);
		}
	}
	if (!truthy(live(_T))) {
		return 0;
	}
	if (!truthy(live(chosen_ghost))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(U), "<span class='danger'>There were no spirits willing to become a shade.</span>"]);
		return 0;
	}
	if (truthy(rt.len(f, rt.sv(f, "contents")))) {
		return 0;
	}
	rt.setFv(f, "ckey", live(_T), rt.fv(f, "ckey", live(chosen_ghost)));
	W = null;
	rt.forList(f, 0, live(_T), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		W = $e;
		yield* g.callName(f, live(_T), "dropItemToGround", [live(W)]);
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "init_shade", live(_T), live(U));
	yield* g.call(f, P("/proc/qdel"), null, [live(_T)]);
	return 1;
}, true);
