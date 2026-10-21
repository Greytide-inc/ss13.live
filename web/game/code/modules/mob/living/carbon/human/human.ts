// From code/modules/mob/living/carbon/human/human.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4812, "/mob/living/carbon/human/dummy", "/mob/living/carbon/human", {
	real_name: "Test Dummy",
	status_flags: 4104,
});

// /mob/living/carbon/human/dummy/proc/New  (code/modules/mob/living/carbon/human/human.dm:13)  may sleep
rt.def("/mob/living/carbon/human/dummy/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "initialized"))) return f.dot;
	rt.setAt(f.argsList, 1, 0);
	yield* g.callSrc(f, "Initialize", [f.argsList], rt.Args.List);
	return f.dot;
}, true, { args: ["loc"] });

// /mob/living/carbon/human/proc/Initialize  (code/modules/mob/living/carbon/human/human.dm:22)  may sleep
rt.def("/mob/living/carbon/human/proc/Initialize", function* Initialize(f: Frame) {
	rt.modSrcVar(f, "verbs", P("/mob/living/proc/mob_sleep"), add);
	rt.modSrcVar(f, "verbs", P("/mob/living/proc/lay_down"), add);
	yield* g.srcCall(f, "create_bodyparts");
	yield* g.srcCall(f, "create_dna", live(f.src));
	yield* g.call(f, P("/proc/randomize_human"), null, [live(f.src)]);
	yield* g.callName(f, rt.sv(f, "dna"), "initialize_dna", []);
	if (truthy(rt.fv(f, "species", rt.sv(f, "dna")))) {
		yield* g.srcCall(f, "set_species", rt.gv(f, "type", rt.fv(f, "species", rt.sv(f, "dna"))));
	}
	yield* g.srcCall(f, "create_internal_organs");
	rt.setSv(f, "handcrafting", (yield* g.new_(f, T("/datum/personal_crafting"), [])));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /mob/living/carbon/human/proc/create_internal_organs  (code/modules/mob/living/carbon/human/human.dm:44)  may sleep
rt.def("/mob/living/carbon/human/proc/create_internal_organs", function* create_internal_organs(f: Frame) {
	if (!truthy((rt.isIn(f, 19, rt.gv(f, "species_traits", rt.fv(f, "species", rt.sv(f, "dna")))) ? 1 : 0))) {
		rt.modSrcVar(f, "internal_organs", (yield* g.new_(f, T("/obj/item/organ/appendix"), [])), add);
	}
	if (!truthy((rt.isIn(f, 10, rt.gv(f, "species_traits", rt.fv(f, "species", rt.sv(f, "dna")))) ? 1 : 0))) {
		if (truthy(rt.gv(f, "mutantlungs", rt.fv(f, "species", rt.sv(f, "dna"))))) {
			rt.modSrcVar(f, "internal_organs", (yield* g.new_(f, rt.gv(f, "mutantlungs", rt.fv(f, "species", rt.sv(f, "dna"))), [])), add);
		} else {
			rt.modSrcVar(f, "internal_organs", (yield* g.new_(f, T("/obj/item/organ/lungs"), [])), add);
		}
	}
	if (!truthy((rt.isIn(f, 12, rt.gv(f, "species_traits", rt.fv(f, "species", rt.sv(f, "dna")))) ? 1 : 0))) {
		rt.modSrcVar(f, "internal_organs", (yield* g.new_(f, T("/obj/item/organ/heart"), [])), add);
	}
	rt.modSrcVar(f, "internal_organs", (yield* g.new_(f, rt.gv(f, "mutanteyes", rt.fv(f, "species", rt.sv(f, "dna"))), [])), add);
	rt.modSrcVar(f, "internal_organs", (yield* g.new_(f, rt.gv(f, "mutantears", rt.fv(f, "species", rt.sv(f, "dna"))), [])), add);
	rt.modSrcVar(f, "internal_organs", (yield* g.new_(f, rt.gv(f, "mutanttongue", rt.fv(f, "species", rt.sv(f, "dna"))), [])), add);
	rt.modSrcVar(f, "internal_organs", (yield* g.new_(f, T("/obj/item/organ/brain"), [])), add);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /mob/living/carbon/human/proc/OpenCraftingMenu  (code/modules/mob/living/carbon/human/human.dm:61)  may sleep
rt.def("/mob/living/carbon/human/proc/OpenCraftingMenu", function* OpenCraftingMenu(f: Frame) {
	yield* g.callName(f, rt.sv(f, "handcrafting"), "ui_interact", [live(f.src)]);
	return f.dot;
}, true);

// /mob/living/carbon/human/proc/prepare_data_huds  (code/modules/mob/living/carbon/human/human.dm:65)  may sleep
rt.def("/mob/living/carbon/human/proc/prepare_data_huds", function* prepare_data_huds(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "sec_hud_set_ID");
	yield* g.srcCall(f, "sec_hud_set_implants");
	yield* g.srcCall(f, "sec_hud_set_security_status");
	yield* g.srcCall(f, "add_to_all_human_data_huds");
	return f.dot;
}, true);

// /mob/living/carbon/human/proc/Stat  (code/modules/mob/living/carbon/human/human.dm:74)  may sleep
rt.def("/mob/living/carbon/human/proc/Stat", function* Stat(f: Frame) {
	let SN: Value = null, D: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [SN, D, $0, $1, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy((yield* g.call(f, P("/proc/statpanel"), null, ["Status"])))) {
		yield* g.call(f, P("/proc/stat"), null, [null, fmt("Intent: ＀", [rt.sv(f, "a_intent")])]);
		yield* g.call(f, P("/proc/stat"), null, [null, fmt("Move Mode: ＀", [rt.sv(f, "m_intent")])]);
		if (truthy(rt.sv(f, "internal"))) {
			if (!truthy(rt.fv(f, "air_contents", rt.sv(f, "internal")))) {
				yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "internal")]);
			} else {
				yield* g.call(f, P("/proc/stat"), null, ["Internal Atmosphere Info", rt.fv(f, "name", rt.sv(f, "internal"))]);
				yield* g.call(f, P("/proc/stat"), null, ["Tank Pressure", (yield* g.callName(f, rt.fv(f, "air_contents", rt.sv(f, "internal")), "return_pressure", []))]);
				yield* g.call(f, P("/proc/stat"), null, ["Distribution Pressure", rt.fv(f, "distribute_pressure", rt.sv(f, "internal"))]);
			}
		}
		if (truthy(rt.sv(f, "mind"))) {
			if (truthy(rt.fv(f, "changeling", rt.sv(f, "mind")))) {
				yield* g.call(f, P("/proc/stat"), null, ["Chemical Storage", fmt("＀/＀", [rt.gv(f, "chem_charges", rt.fv(f, "changeling", rt.sv(f, "mind"))), rt.gv(f, "chem_storage", rt.fv(f, "changeling", rt.sv(f, "mind")))])]);
				yield* g.call(f, P("/proc/stat"), null, ["Absorbed DNA", rt.gv(f, "absorbedcount", rt.fv(f, "changeling", rt.sv(f, "mind")))]);
			}
		}
	}
	if (!truthy((rt.istype(rt.sv(f, "wear_suit"), T("/obj/item/clothing/suit/space/space_ninja")) ? 1 : 0))) return f.dot;
	SN = rt.sv(f, "wear_suit");
	if (!truthy((yield* g.call(f, P("/proc/statpanel"), null, ["SpiderOS"])))) return f.dot;
	$0 = "SpiderOS Status:";
	if (truthy(rt.fv(f, "s_initialized", live(SN)))) {
		$1 = "Initialized";
	} else {
		$1 = "Disabled";
	}
	yield* g.call(f, P("/proc/stat"), null, [$0, fmt("＀", [$1])]);
	yield* g.call(f, P("/proc/stat"), null, ["Current Time:", fmt("＀", [(yield* g.call(f, P("/proc/worldtime2text"), null, []))])]);
	if (!truthy(rt.fv(f, "s_initialized", live(SN)))) return f.dot;
	yield* g.call(f, P("/proc/stat"), null, ["Energy Charge:", fmt("＀%", [(yield* g.call(f, P("/proc/round"), null, [divide(rt.gv(f, "charge", rt.fv(f, "cell", live(SN))), 100)]))])]);
	yield* g.call(f, P("/proc/stat"), null, ["Smoke Bombs:", fmt("３ ！", [rt.fv(f, "s_bombs", live(SN))])]);
	yield* g.call(f, P("/proc/stat"), null, ["Fingerprints:", fmt("＀", [(yield* g.call(f, P("/proc/md5"), null, [rt.fv(f, "uni_identity", rt.sv(f, "dna"))]))])]);
	yield* g.call(f, P("/proc/stat"), null, ["Unique Identity:", fmt("＀", [rt.fv(f, "unique_enzymes", rt.sv(f, "dna"))])]);
	$0 = "Overall Status:";
	if (rt.gt(rt.sv(f, "stat"), 1)) {
		$1 = "dead";
	} else {
		$1 = fmt("＀% healthy", [rt.sv(f, "health")]);
	}
	yield* g.call(f, P("/proc/stat"), null, [$0, fmt("＀", [$1])]);
	yield* g.call(f, P("/proc/stat"), null, ["Nutrition Status:", fmt("＀", [rt.sv(f, "nutrition")])]);
	yield* g.call(f, P("/proc/stat"), null, ["Oxygen Loss:", fmt("＀", [(yield* g.srcCall(f, "getOxyLoss"))])]);
	yield* g.call(f, P("/proc/stat"), null, ["Toxin Levels:", fmt("＀", [(yield* g.srcCall(f, "getToxLoss"))])]);
	yield* g.call(f, P("/proc/stat"), null, ["Burn Severity:", fmt("＀", [(yield* g.srcCall(f, "getFireLoss"))])]);
	yield* g.call(f, P("/proc/stat"), null, ["Brute Trauma:", fmt("＀", [(yield* g.srcCall(f, "getBruteLoss"))])]);
	yield* g.call(f, P("/proc/stat"), null, ["Radiation Levels:", fmt("＀ rad", [rt.sv(f, "radiation")])]);
	yield* g.call(f, P("/proc/stat"), null, ["Body Temperature:", fmt("＀ degrees C (＀ degrees F)", [subtract(rt.sv(f, "bodytemperature"), 273.1499938964844), subtract(multiply(rt.sv(f, "bodytemperature"), 1.7999999523162842), 459.6700134277344)])]);
	if (!truthy(rt.len(f, rt.sv(f, "viruses")))) return f.dot;
	yield* g.call(f, P("/proc/stat"), null, ["Viruses:", null]);
	D = null;
	rt.forList(f, 0, rt.sv(f, "viruses"), T("/datum/disease"));
	while (($e = rt.next(f, 0)) !== undefined) {
		D = $e;
		yield* g.call(f, P("/proc/stat"), null, ["*", fmt("＀, Type: ＀, Stage: ＀/＀, Possible Cure: ＀", [rt.fv(f, "name", live(D)), rt.fv(f, "spread_text", live(D)), rt.fv(f, "stage", live(D)), rt.fv(f, "max_stages", live(D)), rt.fv(f, "cure_text", live(D))])]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /mob/living/carbon/human/proc/show_inv  (code/modules/mob/living/carbon/human/human.dm:123)  may sleep
rt.def("/mob/living/carbon/human/proc/show_inv", function* show_inv(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.callName(f, live(user), "set_machine", [live(f.src)]);
	// tg_js: one `strip` tgui window instead of the HTML popup (modules/mob/strip.ts)
	yield* g.srcCall(f, "ui_interact", live(user));
	return f.dot;
}, true);

// /mob/living/carbon/human/proc/Crossed  (code/modules/mob/living/carbon/human/human.dm:217)  may sleep
rt.def("/mob/living/carbon/human/proc/Crossed", function* Crossed(f: Frame, AM: Value) {
	let MB: Value = null;
	f.vars = () => [AM, MB];
	if (truthy((rt.istype((MB = live(AM)), T("/mob/living/simple_animal/bot/mulebot")) ? 1 : 0))) {
		yield* g.callName(f, live(MB), "RunOver", [live(f.src)]);
	}
	yield* g.srcCall(f, "spreadFire", live(AM));
	return f.dot;
}, true);

// /mob/living/carbon/human/proc/Topic  (code/modules/mob/living/carbon/human/human.dm:225)  may sleep
rt.def("/mob/living/carbon/human/proc/Topic", function* Topic(f: Frame) {
	let L: Value = null, I: Value = null, time_taken: Value = null, slot: Value = null, pocket_side: Value = null, pocket_id: Value = null, pocket_item: Value = null, place_item: Value = null, delay_denominator: Value = null, H: Value = null, perpname: Value = null, R: Value = null, _P: Value = null, health_status: Value = null, span: Value = null, status: Value = null, X: Value = null, BP: Value = null, brutedamage: Value = null, burndamage: Value = null, allowed_access: Value = null, G: Value = null, access: Value = null, setcriminal: Value = null, c: Value = null, t1: Value = null, t2: Value = null, crime: Value = null, counter: Value = null, counter_6: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [L, I, time_taken, slot, pocket_side, pocket_id, pocket_item, place_item, delay_denominator, H, perpname, R, _P, health_status, span, status, X, BP, brutedamage, burndamage, allowed_access, G, access, setcriminal, c, t1, t2, crime, counter, counter_6, $0, $1, $e];
	if (truthy((yield* g.callName(f, live(f.usr), "canUseTopic", [live(f.src), 1, 1])))) {
		if (truthy(rt.at(live(f.args[1]), "embedded_object"))) {
			if (!truthy((L = rt.locateIn(f, rt.at(live(f.args[1]), "embedded_limb"), rt.sv(f, "bodyparts"))))) {
				return live(f.dot);
			}
			if ((!truthy((I = rt.locateIn(f, rt.at(live(f.args[1]), "embedded_object"), rt.fv(f, "embedded_objects", live(L))))) || !isEqual(rt.fv(f, "loc", live(I)), live(f.src)))) {
				return live(f.dot);
			}
			time_taken = multiply(rt.fv(f, "embedded_unsafe_removal_time", live(I)), rt.fv(f, "w_class", live(I)));
			yield* g.callName(f, live(f.usr), "visible_message", [fmt("<span class='warning'>＀ attempts to remove ＀ from their ＀.</span>", [live(f.usr), live(I), rt.fv(f, "name", live(L))]), fmt("<span class='notice'>You attempt to remove ＀ from your ＀... (It will take ＀ seconds.)</span>", [live(I), rt.fv(f, "name", live(L)), divide(live(time_taken), 10)])]);
			if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.usr), null, live(time_taken), "needhand", 1, "target", live(f.src)], rt.Args.Named)))) {
				if ((((!truthy(live(I)) || !truthy(live(L))) || !isEqual(rt.fv(f, "loc", live(I)), live(f.src))) || !truthy((rt.isIn(f, live(I), rt.fv(f, "embedded_objects", live(L))) ? 1 : 0)))) {
					return live(f.dot);
				}
				(rt.modField(f, live(L), "embedded_objects", live(I), subtract));
				yield* g.callName(f, live(L), "receive_damage", [multiply(rt.fv(f, "embedded_unsafe_removal_pain_multiplier", live(I)), rt.fv(f, "w_class", live(I)))]);
				yield* g.callName(f, live(I), "forceMove", [rt.getStep(f, live(f.src), 0)]);
				yield* g.callName(f, live(f.usr), "put_in_hands", [live(I)]);
				yield* g.callName(f, live(f.usr), "emote", ["scream"]);
				yield* g.callName(f, live(f.usr), "visible_message", [fmt("＀ successfully rips ＀ out of their ＀!", [live(f.usr), live(I), rt.fv(f, "name", live(L))]), fmt("<span class='notice'>You successfully remove ＀ from your ＀.</span>", [live(I), rt.fv(f, "name", live(L))])]);
				if (!truthy((yield* g.srcCall(f, "has_embedded_objects")))) {
					yield* g.srcCall(f, "clear_alert", "embeddedobject");
				}
			}
			return live(f.dot);
		}
		if (truthy(rt.at(live(f.args[1]), "item"))) {
			if (truthy((rt.isIn(f, (slot = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "item")]))), (yield* g.srcCall(f, "check_obscured_slots"))) ? 1 : 0))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>You can't reach that! Something is covering it.</span>"]);
				yield* g.callName(f, live(f.src), "balloon_alert", [live(f.usr), "covered!"]);
				return live(f.dot);
			}
		}
		if (truthy(rt.at(live(f.args[1]), "pockets"))) {
			pocket_side = rt.at(live(f.args[1]), "pockets");
			if (isEqual(live(pocket_side), "right")) {
				$0 = 16;
			} else {
				$0 = 15;
			}
			pocket_id = $0;
			if (isEqual(live(pocket_id), 16)) {
				$0 = rt.sv(f, "r_store");
			} else {
				$0 = rt.sv(f, "l_store");
			}
			pocket_item = $0;
			place_item = (yield* g.callName(f, live(f.usr), "get_active_held_item", []));
			delay_denominator = 1;
			if ((truthy(live(pocket_item)) && !truthy(rt.bitAnd(rt.fv(f, "flags", live(pocket_item)), 128)))) {
				if (truthy(rt.bitAnd(rt.fv(f, "flags", live(pocket_item)), 2))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='warning'>You try to empty ＀'s ＀ pocket, it seems to be stuck!</span>", [live(f.src), live(pocket_side)])]);
				}
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='notice'>You try to empty ＀'s ＀ pocket.</span>", [live(f.src), live(pocket_side)])]);
			} else {
				if (((truthy(live(place_item)) && truthy((yield* g.callName(f, live(place_item), "mob_can_equip", [live(f.src), live(f.usr), live(pocket_id), 1])))) && !truthy(rt.bitAnd(rt.fv(f, "flags", live(place_item)), 128)))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='notice'>You try to place ＀ into ＀'s ＀ pocket.</span>", [live(place_item), live(f.src), live(pocket_side)])]);
					delay_denominator = 4;
				} else {
					return live(f.dot);
				}
			}
			if (truthy((yield* g.call(f, P("/proc/do_mob"), null, [live(f.usr), live(f.src), divide(40, live(delay_denominator))])))) {
				if (truthy(live(pocket_item))) {
					$0 = live(pocket_item);
					if (isEqual(live(pocket_id), 16)) {
						$1 = rt.sv(f, "r_store");
					} else {
						$1 = rt.sv(f, "l_store");
					}
					if (isEqual($0, $1)) {
						yield* g.srcCall(f, "dropItemToGround", live(pocket_item));
					}
				} else {
					if (truthy(live(place_item))) {
						if (truthy((yield* g.callName(f, live(place_item), "mob_can_equip", [live(f.src), live(f.usr), live(pocket_id), 0, 1])))) {
							yield* g.callName(f, live(f.usr), "temporarilyRemoveItemFromInventory", [live(place_item), 1]);
							yield* g.srcCall(f, "equip_to_slot", live(place_item), live(pocket_id), 1);
						}
					}
				}
				if ((isEqual(rt.fv(f, "machine", live(f.usr)), live(f.src)) && rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(f.usr)])), 1))) {
					yield* g.srcCall(f, "show_inv", live(f.usr));
				}
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='warning'>You feel your ＀ pocket being fumbled with!</span>", [live(pocket_side)])]);
			}
		}
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	if (!truthy(rt.at(live(f.args[1]), "hud"))) return f.dot;
	if (!truthy((rt.istype(live(f.usr), T("/mob/living/carbon/human")) ? 1 : 0))) return f.dot;
	// tg_js: the HUD links come from examining someone, so they need that person in sight; any HUD wearer could edit anyone's records from anywhere
	if (!rt.isIn(f, live(f.src), (yield* g.call(f, P("/proc/view"), null, [live(f.usr)])))) return f.dot;
	H = live(f.usr);
	perpname = (yield* g.srcCall(f, "get_face_name", (yield* g.srcCall(f, "get_id_name", ""))));
	if (!(truthy((rt.istype(rt.fv(f, "glasses", live(H)), T("/obj/item/clothing/glasses/hud")) ? 1 : 0)) || truthy((rt.istype((yield* g.callName(f, live(H), "getorganslot", ["eye_hud"])), T("/obj/item/organ/cyberimp/eyes/hud")) ? 1 : 0)))) return f.dot;
	R = (yield* g.call(f, P("/proc/find_record"), null, ["name", live(perpname), rt.fv(f, "general", rt.gl("data_core"))]));
	if ((truthy(rt.at(live(f.args[1]), "photo_front")) || truthy(rt.at(live(f.args[1]), "photo_side")))) {
		if (truthy(live(R))) {
			if (!truthy((yield* g.callName(f, live(H), "canUseHUD", [])))) {
				return live(f.dot);
			} else {
				if ((!truthy((rt.istype(rt.fv(f, "glasses", live(H)), T("/obj/item/clothing/glasses/hud")) ? 1 : 0)) && !truthy((rt.istype((yield* g.callName(f, live(H), "getorganslot", ["eye_hud"])), T("/obj/item/organ/cyberimp/eyes/hud/medical")) ? 1 : 0)))) {
					return live(f.dot);
				}
			}
			_P = null;
			if (truthy(rt.at(live(f.args[1]), "photo_front"))) {
				_P = rt.index(rt.fv(f, "fields", live(R)), "photo_front");
			} else {
				if (truthy(rt.at(live(f.args[1]), "photo_side"))) {
					_P = rt.index(rt.fv(f, "fields", live(R)), "photo_side");
				}
			}
			if (truthy(live(_P))) {
				yield* g.callName(f, live(_P), "show", [live(H)]);
			}
		}
	}
	if (isEqual(rt.at(live(f.args[1]), "hud"), "m")) {
		if ((truthy((rt.istype(rt.fv(f, "glasses", live(H)), T("/obj/item/clothing/glasses/hud/health")) ? 1 : 0)) || truthy((rt.istype((yield* g.callName(f, live(H), "getorganslot", ["eye_hud"])), T("/obj/item/organ/cyberimp/eyes/hud/medical")) ? 1 : 0)))) {
			if (truthy(rt.at(live(f.args[1]), "p_stat"))) {
				health_status = (yield* g.op(f, "Prompt", [0], [rt.index(rt.fv(f, "fields", live(R)), "p_stat"), "Medical HUD", "Specify a new physical status for this person.", live(f.usr), rt.list("Active", "Physically Unfit", "*Unconscious*", "*Deceased*", "Cancel")]));
				if (truthy(live(R))) {
					if (!truthy((yield* g.callName(f, live(H), "canUseHUD", [])))) {
						return live(f.dot);
					} else {
						if ((!truthy((rt.istype(rt.fv(f, "glasses", live(H)), T("/obj/item/clothing/glasses/hud/health")) ? 1 : 0)) && !truthy((rt.istype((yield* g.callName(f, live(H), "getorganslot", ["eye_hud"])), T("/obj/item/organ/cyberimp/eyes/hud/medical")) ? 1 : 0)))) {
							return live(f.dot);
						}
					}
					if ((truthy(live(health_status)) && !isEqual(live(health_status), "Cancel"))) {
						rt.setAt(rt.fv(f, "fields", live(R)), "p_stat", live(health_status));
					}
				}
				return live(f.dot);
			}
			if (truthy(rt.at(live(f.args[1]), "m_stat"))) {
				health_status = (yield* g.op(f, "Prompt", [0], [rt.index(rt.fv(f, "fields", live(R)), "m_stat"), "Medical HUD", "Specify a new mental status for this person.", live(f.usr), rt.list("Stable", "*Watch*", "*Unstable*", "*Insane*", "Cancel")]));
				if (truthy(live(R))) {
					if (!truthy((yield* g.callName(f, live(H), "canUseHUD", [])))) {
						return live(f.dot);
					} else {
						if ((!truthy((rt.istype(rt.fv(f, "glasses", live(H)), T("/obj/item/clothing/glasses/hud/health")) ? 1 : 0)) && !truthy((rt.istype((yield* g.callName(f, live(H), "getorganslot", ["eye_hud"])), T("/obj/item/organ/cyberimp/eyes/hud/medical")) ? 1 : 0)))) {
							return live(f.dot);
						}
					}
					if ((truthy(live(health_status)) && !isEqual(live(health_status), "Cancel"))) {
						rt.setAt(rt.fv(f, "fields", live(R)), "m_stat", live(health_status));
					}
				}
				return live(f.dot);
			}
			if (truthy(rt.at(live(f.args[1]), "evaluation"))) {
				if ((((!truthy((yield* g.srcCall(f, "getBruteLoss"))) && !truthy((yield* g.srcCall(f, "getFireLoss")))) && !truthy((yield* g.srcCall(f, "getOxyLoss")))) && rt.lt((yield* g.srcCall(f, "getToxLoss")), 20))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>No external injuries detected.</span><br>"]);
					return live(f.dot);
				}
				span = "notice";
				status = "";
				if (truthy((yield* g.srcCall(f, "getBruteLoss")))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<b>Physical trauma analysis:</b>"]);
					X = null;
					rt.forList(f, 0, rt.sv(f, "bodyparts"));
					while (($e = rt.next(f, 0)) !== undefined) {
						X = $e;
						BP = live(X);
						if (rt.gt((brutedamage = rt.fv(f, "brute_dam", live(BP))), 0)) {
							status = "received minor physical injuries.";
							span = "notice";
						}
						if (rt.gt(live(brutedamage), 20)) {
							status = "been seriously damaged.";
							span = "danger";
						}
						if (rt.gt(live(brutedamage), 40)) {
							status = "sustained major trauma!";
							span = "userdanger";
						}
						if (truthy(live(brutedamage))) {
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='＀'>＀ appears to have ＀</span>", [live(span), live(BP), live(status)])]);
						}
					}
					rt.endFor(f, 0);
				}
				if (truthy((yield* g.srcCall(f, "getFireLoss")))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<b>Analysis of skin burns:</b>"]);
					X = null;
					rt.forList(f, 0, rt.sv(f, "bodyparts"));
					while (($e = rt.next(f, 0)) !== undefined) {
						X = $e;
						BP = live(X);
						if (rt.gt((burndamage = rt.fv(f, "burn_dam", live(BP))), 0)) {
							status = "signs of minor burns.";
							span = "notice";
						}
						if (rt.gt(live(burndamage), 20)) {
							status = "serious burns.";
							span = "danger";
						}
						if (rt.gt(live(burndamage), 40)) {
							status = "major burns!";
							span = "userdanger";
						}
						if (truthy(live(burndamage))) {
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='＀'>＀ appears to have ＀</span>", [live(span), live(BP), live(status)])]);
						}
					}
					rt.endFor(f, 0);
				}
				if (truthy((yield* g.srcCall(f, "getOxyLoss")))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='danger'>Patient has signs of suffocation, emergency treatment may be required!</span>"]);
				}
				if (rt.gt((yield* g.srcCall(f, "getToxLoss")), 20)) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='danger'>Gathered data is inconsistent with the analysis, possible cause: poisoning.</span>"]);
				}
			}
		}
	}
	if (!isEqual(rt.at(live(f.args[1]), "hud"), "s")) return f.dot;
	if (!(truthy((rt.istype(rt.fv(f, "glasses", live(H)), T("/obj/item/clothing/glasses/hud/security")) ? 1 : 0)) || truthy((rt.istype((yield* g.callName(f, live(H), "getorganslot", ["eye_hud"])), T("/obj/item/organ/cyberimp/eyes/hud/security")) ? 1 : 0)))) return f.dot;
	if ((truthy(rt.fv(f, "stat", live(f.usr))) || isEqual(live(f.usr), live(f.src)))) {
		return live(f.dot);
	}
	allowed_access = null;
	if (!truthy(rt.gv(f, "emagged", (G = rt.fv(f, "glasses", live(H)))))) {
		if (truthy(rt.fv(f, "wear_id", live(H)))) {
			access = (yield* g.callName(f, rt.fv(f, "wear_id", live(H)), "GetAccess", []));
			if (truthy((rt.isIn(f, 63, live(access)) ? 1 : 0))) {
				allowed_access = (yield* g.callName(f, live(H), "get_authentification_name", []));
			}
		}
	} else {
		allowed_access = "@%&ERROR_%$*";
	}
	if (!truthy(live(allowed_access))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<span class='warning'>ERROR: Invalid Access</span>"]);
		return live(f.dot);
	}
	if (!truthy(live(perpname))) return f.dot;
	if (truthy((R = (yield* g.call(f, P("/proc/find_record"), null, ["name", live(perpname), rt.fv(f, "security", rt.gl("data_core"))]))))) {
		if (truthy(rt.at(live(f.args[1]), "status"))) {
			if (!isEqual((setcriminal = (yield* g.op(f, "Prompt", [0], [rt.index(rt.fv(f, "fields", live(R)), "criminal"), "Security HUD", "Specify a new criminal status for this person.", live(f.usr), rt.list("None", "*Arrest*", "Incarcerated", "Parolled", "Discharged", "Cancel")]))), "Cancel")) {
				if (truthy(live(R))) {
					if (truthy((yield* g.callName(f, live(H), "canUseHUD", [])))) {
						if ((truthy((rt.istype(rt.fv(f, "glasses", live(H)), T("/obj/item/clothing/glasses/hud/security")) ? 1 : 0)) || truthy((rt.istype((yield* g.callName(f, live(H), "getorganslot", ["eye_hud"])), T("/obj/item/organ/cyberimp/eyes/hud/security")) ? 1 : 0)))) {
							yield* g.srcCall(f, "investigate_log", fmt("＀ has been set from ＀ to ＀ by ＀ (＀).", [rt.fv(f, "key", live(f.src)), rt.index(rt.fv(f, "fields", live(R)), "criminal"), live(setcriminal), rt.fv(f, "name", live(f.usr)), rt.fv(f, "key", live(f.usr))]), "records");
							rt.setAt(rt.fv(f, "fields", live(R)), "criminal", live(setcriminal));
							yield* g.srcCall(f, "sec_hud_set_security_status");
						}
					}
				}
			}
			return live(f.dot);
		}
		if (truthy(rt.at(live(f.args[1]), "view"))) {
			if (truthy(live(R))) {
				if (!truthy((yield* g.callName(f, live(H), "canUseHUD", [])))) {
					return live(f.dot);
				} else {
					if ((!truthy((rt.istype(rt.fv(f, "glasses", live(H)), T("/obj/item/clothing/glasses/hud/security")) ? 1 : 0)) && !truthy((rt.istype((yield* g.callName(f, live(H), "getorganslot", ["eye_hud"])), T("/obj/item/organ/cyberimp/eyes/hud/security")) ? 1 : 0)))) {
						return live(f.dot);
					}
				}
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<b>Name:</b> ＀\t<b>Criminal Status:</b> ＀", [rt.index(rt.fv(f, "fields", live(R)), "name"), rt.index(rt.fv(f, "fields", live(R)), "criminal")])]);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<b>Minor Crimes:</b>"]);
				c = null;
				rt.forList(f, 0, rt.index(rt.fv(f, "fields", live(R)), "mi_crim"), T("/datum/data/crime"));
				while (($e = rt.next(f, 0)) !== undefined) {
					c = $e;
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<b>Crime:</b> ＀", [rt.fv(f, "crimeName", live(c))])]);
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<b>Details:</b> ＀", [rt.fv(f, "crimeDetails", live(c))])]);
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("Added by ＀ at ＀", [rt.fv(f, "author", live(c)), rt.fv(f, "time", live(c))])]);
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "----------"]);
				}
				rt.endFor(f, 0);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<b>Major Crimes:</b>"]);
				c = null;
				rt.forList(f, 0, rt.index(rt.fv(f, "fields", live(R)), "ma_crim"), T("/datum/data/crime"));
				while (($e = rt.next(f, 0)) !== undefined) {
					c = $e;
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<b>Crime:</b> ＀", [rt.fv(f, "crimeName", live(c))])]);
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<b>Details:</b> ＀", [rt.fv(f, "crimeDetails", live(c))])]);
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("Added by ＀ at ＀", [rt.fv(f, "author", live(c)), rt.fv(f, "time", live(c))])]);
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "----------"]);
				}
				rt.endFor(f, 0);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<b>Notes:</b> ＀", [rt.index(rt.fv(f, "fields", live(R)), "notes")])]);
			}
			return live(f.dot);
		}
		if (truthy(rt.at(live(f.args[1]), "add_crime"))) {
			$0 = (yield* g.call(f, P("/proc/alert"), null, ["What crime would you like to add?", "Security HUD", "Minor Crime", "Major Crime", "Cancel"]));
			if ($0 === "Minor Crime") {
				if (truthy(live(R))) {
					t1 = (yield* g.call(f, P("/proc/stripped_input"), null, ["Please input minor crime names:", "Security HUD", "", null]));
					t2 = (yield* g.call(f, P("/proc/stripped_multiline_input"), null, ["Please input minor crime details:", "Security HUD", "", null]));
					if (truthy(live(R))) {
						if (((!truthy(live(t1)) || !truthy(live(t2))) || !truthy(live(allowed_access)))) {
							return live(f.dot);
						} else {
							if (!truthy((yield* g.callName(f, live(H), "canUseHUD", [])))) {
								return live(f.dot);
							} else {
								if ((!truthy((rt.istype(rt.fv(f, "glasses", live(H)), T("/obj/item/clothing/glasses/hud/security")) ? 1 : 0)) && !truthy((rt.istype((yield* g.callName(f, live(H), "getorganslot", ["eye_hud"])), T("/obj/item/organ/cyberimp/eyes/hud/security")) ? 1 : 0)))) {
									return live(f.dot);
								}
							}
						}
						crime = (yield* g.callName(f, rt.gl("data_core"), "createCrimeEntry", [live(t1), live(t2), live(allowed_access), (yield* g.call(f, P("/proc/worldtime2text"), null, []))]));
						yield* g.callName(f, rt.gl("data_core"), "addMinorCrime", [rt.index(rt.fv(f, "fields", live(R)), "id"), live(crime)]);
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>Successfully added a minor crime.</span>"]);
						return live(f.dot);
					}
				}
			} else if ($0 === "Major Crime") {
				if (truthy(live(R))) {
					t1 = (yield* g.call(f, P("/proc/stripped_input"), null, ["Please input major crime names:", "Security HUD", "", null]));
					t2 = (yield* g.call(f, P("/proc/stripped_multiline_input"), null, ["Please input major crime details:", "Security HUD", "", null]));
					if (truthy(live(R))) {
						if (((!truthy(live(t1)) || !truthy(live(t2))) || !truthy(live(allowed_access)))) {
							return live(f.dot);
						} else {
							if (!truthy((yield* g.callName(f, live(H), "canUseHUD", [])))) {
								return live(f.dot);
							} else {
								if ((!truthy((rt.istype(rt.fv(f, "glasses", live(H)), T("/obj/item/clothing/glasses/hud/security")) ? 1 : 0)) && !truthy((rt.istype((yield* g.callName(f, live(H), "getorganslot", ["eye_hud"])), T("/obj/item/organ/cyberimp/eyes/hud/security")) ? 1 : 0)))) {
									return live(f.dot);
								}
							}
						}
						crime = (yield* g.callName(f, rt.gl("data_core"), "createCrimeEntry", [live(t1), live(t2), live(allowed_access), (yield* g.call(f, P("/proc/worldtime2text"), null, []))]));
						yield* g.callName(f, rt.gl("data_core"), "addMajorCrime", [rt.index(rt.fv(f, "fields", live(R)), "id"), live(crime)]);
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>Successfully added a major crime.</span>"]);
					}
				}
			}
			return live(f.dot);
		}
		if (truthy(rt.at(live(f.args[1]), "view_comment"))) {
			if (truthy(live(R))) {
				if (!truthy((yield* g.callName(f, live(H), "canUseHUD", [])))) {
					return live(f.dot);
				} else {
					if ((!truthy((rt.istype(rt.fv(f, "glasses", live(H)), T("/obj/item/clothing/glasses/hud/security")) ? 1 : 0)) && !truthy((rt.istype((yield* g.callName(f, live(H), "getorganslot", ["eye_hud"])), T("/obj/item/organ/cyberimp/eyes/hud/security")) ? 1 : 0)))) {
						return live(f.dot);
					}
				}
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<b>Comments/Log:</b>"]);
				counter = 1;
				while (truthy(rt.index(rt.fv(f, "fields", live(R)), fmt("com_＀", [live(counter)])))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), rt.index(rt.fv(f, "fields", live(R)), fmt("com_＀", [live(counter)]))]);
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "----------"]);
					counter = rt.inc(live(counter), 1);
				}
				return live(f.dot);
			}
		}
		if (truthy(rt.at(live(f.args[1]), "add_comment"))) {
			if (truthy(live(R))) {
				t1 = (yield* g.call(f, P("/proc/stripped_multiline_input"), null, ["Add Comment:", "Secure. records", null, null]));
				if (truthy(live(R))) {
					if ((!truthy(live(t1)) || !truthy(live(allowed_access)))) {
						return live(f.dot);
					} else {
						if (!truthy((yield* g.callName(f, live(H), "canUseHUD", [])))) {
							return live(f.dot);
						} else {
							if ((!truthy((rt.istype(rt.fv(f, "glasses", live(H)), T("/obj/item/clothing/glasses/hud/security")) ? 1 : 0)) && !truthy((rt.istype((yield* g.callName(f, live(H), "getorganslot", ["eye_hud"])), T("/obj/item/organ/cyberimp/eyes/hud/security")) ? 1 : 0)))) {
								return live(f.dot);
							}
						}
					}
					counter_6 = 1;
					while (truthy(rt.index(rt.fv(f, "fields", live(R)), fmt("com_＀", [live(counter_6)])))) {
						counter_6 = rt.inc(live(counter_6), 1);
					}
					rt.setAt(rt.fv(f, "fields", live(R)), fmt("com_＀", [live(counter_6)]), fmt("Made by ＀ on ＀ ＀, ＀<BR>＀", [live(allowed_access), (yield* g.call(f, P("/proc/worldtime2text"), null, [])), (yield* g.call(f, P("/proc/time2text"), null, [rt.fv(f, "realtime", rt.world()), "MMM DD"])), add(rt.gl("year_integer"), 540), live(t1)]));
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>Successfully added comment.</span>"]);
					return live(f.dot);
				}
			}
		}
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>Unable to locate a data core entry for this person.</span>"]);
	return f.dot;
}, true, { args: ["href", "href_list"] });

// /mob/living/carbon/human/proc/canUseHUD  (code/modules/mob/living/carbon/human/human.dm:501)
rt.def("/mob/living/carbon/human/proc/canUseHUD", function canUseHUD(f: Frame) {
	return (!(((truthy(rt.fv(f, "stat", live(f.src))) || truthy(rt.callSrc(f, "IsKnockdown", []))) || truthy(rt.callSrc(f, "IsStun", []))) || truthy(rt.callName(f, live(f.src), "restrained", []))) ? 1 : 0);
});

// /mob/living/carbon/human/proc/can_inject  (code/modules/mob/living/carbon/human/human.dm:505)
rt.def("/mob/living/carbon/human/proc/can_inject", function can_inject(f: Frame, user: Value, error_msg: Value, target_zone: Value, penetrate_thick: Value) {
	let $0: any, $1: any;
	f.vars = () => [target_zone, penetrate_thick, $0, $1];
	if (live(penetrate_thick) === null) {
		penetrate_thick = 0;
	}
	f.dot = 1;
	if ((truthy(live(user)) && !truthy(live(target_zone)))) {
		target_zone = rt.fv(f, "zone_selected", live(user));
	}
	if ((truthy(rt.sv(f, "dna")) && truthy((rt.isIn(f, 15, rt.gv(f, "species_traits", rt.fv(f, "species", rt.sv(f, "dna")))) ? 1 : 0)))) {
		f.dot = 0;
	}
	if (truthy(rt.call(f, P("/proc/above_neck"), null, [live(target_zone)]))) {
		if (((truthy(rt.sv(f, "head")) && truthy(rt.bitAnd(rt.fv(f, "flags", rt.sv(f, "head")), 8192))) && !truthy(live(penetrate_thick)))) {
			f.dot = 0;
		}
	} else {
		if (((truthy(rt.sv(f, "wear_suit")) && truthy(rt.bitAnd(rt.fv(f, "flags", rt.sv(f, "wear_suit")), 8192))) && !truthy(live(penetrate_thick)))) {
			f.dot = 0;
		}
	}
	if (!((!truthy(live(f.dot)) && truthy(live(error_msg))) && truthy(live(user)))) return f.dot;
	$0 = live(user);
	if (truthy(rt.call(f, P("/proc/above_neck"), null, [live(target_zone)]))) {
		$1 = fmt("on ＀ head", [rt.callSrc(f, "p_their", [])]);
	} else {
		$1 = fmt("on ＀ body", [rt.callSrc(f, "p_their", [])]);
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='alert'>There is no exposed flesh or thin material ＀.</span>", [$1])]);
	return f.dot;
});

// /mob/living/carbon/human/proc/check_obscured_slots  (code/modules/mob/living/carbon/human/human.dm:522)
rt.def("/mob/living/carbon/human/proc/check_obscured_slots", function check_obscured_slots(f: Frame) {
	let obscured: Value = null;
	f.vars = () => [obscured];
	obscured = rt.list();
	if (truthy(rt.sv(f, "wear_suit"))) {
		if (truthy(rt.bitAnd(rt.fv(f, "flags_inv", rt.sv(f, "wear_suit")), 1))) {
			(obscured = rt.modify(live(obscured), 9, rt.bitOr));
		}
		if (truthy(rt.bitAnd(rt.fv(f, "flags_inv", rt.sv(f, "wear_suit")), 4))) {
			(obscured = rt.modify(live(obscured), 14, rt.bitOr));
		}
		if (truthy(rt.bitAnd(rt.fv(f, "flags_inv", rt.sv(f, "wear_suit")), 8))) {
			(obscured = rt.modify(live(obscured), 12, rt.bitOr));
		}
	}
	if (truthy(rt.sv(f, "head"))) {
		if (truthy(rt.bitAnd(rt.fv(f, "flags_inv", rt.sv(f, "head")), 16))) {
			(obscured = rt.modify(live(obscured), 2, rt.bitOr));
		}
		if (truthy(rt.bitAnd(rt.fv(f, "flags_inv", rt.sv(f, "head")), 64))) {
			(obscured = rt.modify(live(obscured), 8, rt.bitOr));
		}
		if (truthy(rt.bitAnd(rt.fv(f, "flags_inv", rt.sv(f, "head")), 32))) {
			(obscured = rt.modify(live(obscured), 7, rt.bitOr));
		}
	}
	if (truthy(rt.sv(f, "wear_mask"))) {
		if (truthy(rt.bitAnd(rt.fv(f, "flags_inv", rt.sv(f, "wear_mask")), 64))) {
			(obscured = rt.modify(live(obscured), 8, rt.bitOr));
		}
	}
	if (truthy(rt.len(f, live(obscured)))) {
		return live(obscured);
	} else {
		return null;
	}
	return f.dot;
});

// /mob/living/carbon/human/proc/assess_threat  (code/modules/mob/living/carbon/human/human.dm:550)  may sleep
rt.def("/mob/living/carbon/human/proc/assess_threat", function* assess_threat(f: Frame, judgement_criteria: Value, lasercolor: Value, weaponcheck: Value) {
	let threatcount: Value = null, idcard: Value = null, I: Value = null, perpname: Value = null, R: Value = null;
	let $0: any, $e: any;
	f.vars = () => [judgement_criteria, lasercolor, weaponcheck, threatcount, idcard, I, perpname, R, $0, $e];
	if (live(lasercolor) === null) {
		lasercolor = "";
	}
	if (live(weaponcheck) === null) {
		weaponcheck = null;
	}
	if (truthy(rt.bitAnd(live(judgement_criteria), 1))) {
		return 10;
	}
	threatcount = 0;
	if (truthy(live(lasercolor))) {
		if (isEqual(live(lasercolor), "b")) {
			if (truthy((rt.istype(rt.sv(f, "wear_suit"), T("/obj/item/clothing/suit/redtag")) ? 1 : 0))) {
				threatcount = rt.modify(live(threatcount), 4, add);
			}
			if (truthy((yield* g.srcCall(f, "is_holding_item_of_type", T("/obj/item/weapon/gun/energy/laser/redtag"))))) {
				threatcount = rt.modify(live(threatcount), 4, add);
			}
			if (truthy((rt.istype(rt.sv(f, "belt"), T("/obj/item/weapon/gun/energy/laser/redtag")) ? 1 : 0))) {
				threatcount = rt.modify(live(threatcount), 2, add);
			}
		}
		if (isEqual(live(lasercolor), "r")) {
			if (truthy((rt.istype(rt.sv(f, "wear_suit"), T("/obj/item/clothing/suit/bluetag")) ? 1 : 0))) {
				threatcount = rt.modify(live(threatcount), 4, add);
			}
			if (truthy((yield* g.srcCall(f, "is_holding_item_of_type", T("/obj/item/weapon/gun/energy/laser/bluetag"))))) {
				threatcount = rt.modify(live(threatcount), 4, add);
			}
			if (truthy((rt.istype(rt.sv(f, "belt"), T("/obj/item/weapon/gun/energy/laser/bluetag")) ? 1 : 0))) {
				threatcount = rt.modify(live(threatcount), 2, add);
			}
		}
		return live(threatcount);
	}
	idcard = (yield* g.srcCall(f, "get_idcard"));
	if (((truthy(rt.bitAnd(live(judgement_criteria), 2)) && !truthy(live(idcard))) && isEqual(rt.sv(f, "name"), "Unknown"))) {
		threatcount = rt.modify(live(threatcount), 4, add);
	}
	if ((truthy(rt.bitAnd(live(judgement_criteria), 4)) && truthy(live(weaponcheck)))) {
		if ((!truthy(live(idcard)) || !truthy((rt.isIn(f, 66, rt.fv(f, "access", live(idcard))) ? 1 : 0)))) {
			I = null;
			rt.forList(f, 0, rt.sv(f, "held_items"), T("/obj/item"));
			while (($e = rt.next(f, 0)) !== undefined) {
				I = $e;
				if (truthy((yield* g.callName(f, live(weaponcheck), "Invoke", [live(I)])))) {
					threatcount = rt.modify(live(threatcount), 4, add);
				}
			}
			rt.endFor(f, 0);
			if (truthy((yield* g.callName(f, live(weaponcheck), "Invoke", [rt.sv(f, "belt")])))) {
				threatcount = rt.modify(live(threatcount), 2, add);
			}
		}
	}
	if (truthy(rt.bitAnd(live(judgement_criteria), 8))) {
		perpname = (yield* g.srcCall(f, "get_face_name", (yield* g.srcCall(f, "get_id_name"))));
		if ((truthy((R = (yield* g.call(f, P("/proc/find_record"), null, ["name", live(perpname), rt.fv(f, "security", rt.gl("data_core"))])))) && truthy(rt.index(rt.fv(f, "fields", live(R)), "criminal")))) {
			$0 = rt.index(rt.fv(f, "fields", live(R)), "criminal");
			if ($0 === "*Arrest*") {
				threatcount = rt.modify(live(threatcount), 5, add);
			} else if ($0 === "Incarcerated") {
				threatcount = rt.modify(live(threatcount), 2, add);
			} else if ($0 === "Parolled") {
				threatcount = rt.modify(live(threatcount), 2, add);
			}
		}
	}
	if ((truthy((rt.istype(rt.sv(f, "head"), T("/obj/item/clothing/head/wizard")) ? 1 : 0)) || truthy((rt.istype(rt.sv(f, "head"), T("/obj/item/clothing/head/helmet/space/hardsuit/wizard")) ? 1 : 0)))) {
		threatcount = rt.modify(live(threatcount), 2, add);
	}
	if (((truthy(rt.sv(f, "dna")) && truthy(rt.gv(f, "id", rt.fv(f, "species", rt.sv(f, "dna"))))) && !isEqual(rt.gv(f, "id", rt.fv(f, "species", rt.sv(f, "dna"))), "human"))) {
		threatcount = rt.modify(live(threatcount), 1, add);
	}
	if (truthy((yield* g.srcCall(f, "isloyal")))) {
		(threatcount = rt.modify(live(threatcount), 1, subtract));
	}
	if (truthy((rt.istype(live(idcard), T("/obj/item/weapon/card/id/syndicate")) ? 1 : 0))) {
		(threatcount = rt.modify(live(threatcount), 5, subtract));
	}
	return live(threatcount);
}, true);

// /mob/living/carbon/human/proc/set_cloned_appearance  (code/modules/mob/living/carbon/human/human.dm:623)  may sleep
rt.def("/mob/living/carbon/human/proc/set_cloned_appearance", function* set_cloned_appearance(f: Frame) {
	if (isEqual(rt.sv(f, "gender"), "male")) {
		rt.setSv(f, "facial_hair_style", "Full Beard");
	} else {
		rt.setSv(f, "facial_hair_style", "Shaved");
	}
	rt.setSv(f, "hair_style", rt.op(f, "PickUnweighted", [3], ["Bedhead", "Bedhead 2", "Bedhead 3"]));
	rt.setSv(f, "underwear", "Nude");
	yield* g.srcCall(f, "update_body");
	yield* g.srcCall(f, "update_hair");
	return f.dot;
}, true);

// /mob/living/carbon/human/proc/singularity_pull  (code/modules/mob/living/carbon/human/human.dm:633)  may sleep
rt.def("/mob/living/carbon/human/proc/singularity_pull", function* singularity_pull(f: Frame) {
	let hand: Value = null;
	let $e: any;
	f.vars = () => [hand, $e];
	if (rt.ge(live(f.args[1]), 5)) {
		hand = null;
		rt.forList(f, 0, rt.sv(f, "held_items"), T("/obj/item"));
		while (($e = rt.next(f, 0)) !== undefined) {
			hand = $e;
			if (((truthy(rt.op(f, "Prob", [], [multiply(live(f.args[1]), 5)])) && rt.ge(rt.fv(f, "w_class", live(hand)), divide(subtract(11, live(f.args[1])), 2))) && truthy((yield* g.srcCall(f, "dropItemToGround", live(hand)))))) {
				yield* g.call(f, P("/proc/step_towards"), null, [live(hand), live(f.src)]);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='warning'>＄！ pulls ％！ from your grip!</span>", [live(f.args[0]), live(hand)])]);
			}
		}
		rt.endFor(f, 0);
	}
	yield* g.srcCall(f, "rad_act", multiply(live(f.args[1]), 3));
	if (truthy((yield* g.srcCall(f, "mob_negates_gravity")))) {
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["S", "current_size"] });

// /mob/living/carbon/human/proc/do_cpr  (code/modules/mob/living/carbon/human/human.dm:644)  may sleep
rt.def("/mob/living/carbon/human/proc/do_cpr", function* do_cpr(f: Frame, C: Value) {
	let they_breathe: Value = null, they_lung: Value = null, suff: Value = null;
	f.vars = () => [C, they_breathe, they_lung, suff];
	if ((!truthy(rt.fv(f, "dna", live(C))) || !truthy(rt.gv(f, "species", rt.fv(f, "dna", live(C)))))) {
		return live(f.dot);
	}
	if ((isEqual(rt.fv(f, "stat", live(C)), 2) || truthy(rt.bitAnd(rt.fv(f, "status_flags", live(C)), 8192)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='warning'>＀ is dead!</span>", [rt.fv(f, "name", live(C))])]);
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "is_mouth_covered")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>Remove your mask first!</span>"]);
		return 0;
	}
	if (truthy((yield* g.callName(f, live(C), "is_mouth_covered", [])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='warning'>Remove ＀ mask first!</span>", [(yield* g.srcCall(f, "p_their"))])]);
		return 0;
	}
	if (!rt.lt(rt.fv(f, "cpr_time", live(C)), add(rt.worldTime(f), 30))) return f.dot;
	yield* g.srcCall(f, "visible_message", fmt("<span class='notice'>＀ is trying to perform CPR on ＀!</span>", [live(f.src), rt.fv(f, "name", live(C))]), fmt("<span class='notice'>You try to perform CPR on ＀... Hold still!</span>", [rt.fv(f, "name", live(C))]));
	if (!truthy((yield* g.call(f, P("/proc/do_mob"), null, [live(f.src), live(C)])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='warning'>You fail to perform CPR on ＀!</span>", [live(C)])]);
		return 0;
	}
	they_breathe = (!truthy((rt.isIn(f, 10, rt.gv(f, "species_traits", rt.gv(f, "species", rt.fv(f, "dna", live(C))))) ? 1 : 0)) ? 1 : 0);
	they_lung = (yield* g.callName(f, live(C), "getorganslot", ["lungs"]));
	if (rt.gt(rt.fv(f, "health", live(C)), 0)) {
		return live(f.dot);
	}
	yield* g.callName(f, live(f.src), "visible_message", [fmt("＀ performs CPR on ＀!", [live(f.src), rt.fv(f, "name", live(C))]), fmt("<span class='notice'>You perform CPR on ＀.</span>", [rt.fv(f, "name", live(C))])]);
	rt.setFv(f, "cpr_time", live(C), rt.worldTime(f));
	yield* g.call(f, P("/proc/add_logs"), null, [live(f.src), live(C), "CPRed"]);
	if ((truthy(live(they_breathe)) && truthy(live(they_lung)))) {
		suff = (yield* g.call(f, P("/proc/min"), null, [(yield* g.callName(f, live(C), "getOxyLoss", [])), 7]));
		yield* g.callName(f, live(C), "adjustOxyLoss", [rt.neg(live(suff))]);
		yield* g.callName(f, live(C), "updatehealth", []);
		yield* g.call(f, P("/proc/to_chat"), null, [live(C), "<span class='unconscious'>You feel a breath of fresh air enter your lungs... It feels good...</span>"]);
	} else {
		if ((truthy(live(they_breathe)) && !truthy(live(they_lung)))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(C), "<span class='unconscious'>You feel a breath of fresh air... but you don't feel any better...</span>"]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(C), "<span class='unconscious'>You feel a breath of fresh air... which is a sensation you don't recognise...</span>"]);
		}
	}
	return f.dot;
}, true);

// /mob/living/carbon/human/proc/generateStaticOverlay  (code/modules/mob/living/carbon/human/human.dm:684)  may sleep
rt.def("/mob/living/carbon/human/proc/generateStaticOverlay", function* generateStaticOverlay(f: Frame) {
	let staticOverlay: Value = null;
	f.vars = () => [staticOverlay];
	rt.setFv(f, "override", (staticOverlay = (yield* g.call(f, P("/proc/image"), null, [null, (yield* g.call(f, P("/proc/icon"), null, [rt.rsc("icons/effects/effects.dmi"), "static"])), "loc", live(f.src)], rt.Args.Named))), 1);
	rt.setAt(rt.sv(f, "staticOverlays"), "static", live(staticOverlay));
	rt.setFv(f, "override", (staticOverlay = (yield* g.call(f, P("/proc/image"), null, [null, (yield* g.call(f, P("/proc/icon"), null, [rt.rsc("icons/effects/effects.dmi"), "blank"])), "loc", live(f.src)], rt.Args.Named))), 1);
	rt.setAt(rt.sv(f, "staticOverlays"), "blank", live(staticOverlay));
	rt.setFv(f, "override", (staticOverlay = (yield* g.call(f, P("/proc/getLetterImage"), null, [live(f.src), "H", 1]))), 1);
	rt.setAt(rt.sv(f, "staticOverlays"), "letter", live(staticOverlay));
	rt.setFv(f, "override", (staticOverlay = (yield* g.call(f, P("/proc/getRandomAnimalImage"), null, [live(f.src)]))), 1);
	rt.setAt(rt.sv(f, "staticOverlays"), "animal", live(staticOverlay));
	return f.dot;
}, true);

// /mob/living/carbon/human/proc/cuff_resist  (code/modules/mob/living/carbon/human/human.dm:701)  may sleep
rt.def("/mob/living/carbon/human/proc/cuff_resist", function* cuff_resist(f: Frame) {
	if ((truthy(rt.sv(f, "dna")) && truthy((yield* g.callName(f, rt.sv(f, "dna"), "check_mutation", ["Hulk"]))))) {
		yield* g.srcCall(f, "say", rt.op(f, "PickUnweighted", [5], [";RAAAAAAAARGH!", ";HNNNNNNNNNGGGGGGH!", ";GWAAAAAAAARRRHHH!", "NNNNNNNNGGGGGGGGHH!", ";AAAAAAARRRGH!"]));
		if (truthy((yield* g.callSuper(f, [null, live(f.args[0]), "cuff_break", 1], rt.Args.Named)))) {
			yield* g.srcCall(f, "dropItemToGround", live(f.args[0]));
		}
	} else {
		if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
		yield* g.srcCall(f, "dropItemToGround", live(f.args[0]));
	}
	return f.dot;
}, true, { args: ["I"] });

// /mob/living/carbon/human/proc/clean_blood  (code/modules/mob/living/carbon/human/human.dm:710)
rt.def("/mob/living/carbon/human/proc/clean_blood", function clean_blood(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	if (truthy(rt.gv(f, "gloves", (H = live(f.src))))) {
		if (truthy(rt.callName(f, rt.fv(f, "gloves", live(H)), "clean_blood", []))) {
			rt.callName(f, live(H), "update_inv_gloves", []);
		}
	} else {
		rt.callSuper(f, [], rt.Args.Same);
		if (truthy(rt.fv(f, "bloody_hands", live(H)))) {
			rt.setFv(f, "bloody_hands", live(H), 0);
			rt.callName(f, live(H), "update_inv_gloves", []);
		}
	}
	rt.callSrc(f, "update_icons", []);
	return f.dot;
});

// /mob/living/carbon/human/proc/wash_cream  (code/modules/mob/living/carbon/human/human.dm:724)
rt.def("/mob/living/carbon/human/proc/wash_cream", function wash_cream(f: Frame) {
	rt.callSrc(f, "cut_overlay", [rt.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/effects/creampie.dmi"), "creampie_lizard"])]);
	rt.callSrc(f, "cut_overlay", [rt.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/effects/creampie.dmi"), "creampie_human"])]);
	return f.dot;
});

// /mob/living/carbon/human/proc/electrocution_animation  (code/modules/mob/living/carbon/human/human.dm:732)  may sleep
rt.def("/mob/living/carbon/human/proc/electrocution_animation", function* electrocution_animation(f: Frame, anim_duration: Value) {
	f.vars = () => [anim_duration];
	if ((truthy(rt.sv(f, "dna")) && truthy(rt.fv(f, "species", rt.sv(f, "dna"))))) {
		yield* g.srcCall(f, "add_atom_colour", "#000000", 2);
		if (!truthy(rt.gl("electrocution_skeleton_anim"))) {
			rt.setGl("electrocution_skeleton_anim", (yield* g.call(f, P("/proc/mutable_appearance"), null, [rt.sv(f, "icon"), "electrocuted_base"])));
			(rt.modField(f, rt.gl("electrocution_skeleton_anim"), "appearance_flags", 2, rt.bitOr));
		}
		yield* g.srcCall(f, "add_overlay", rt.gl("electrocution_skeleton_anim"));
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/mob/living/carbon/human/proc/end_electrocution_animation"), rt.gl("electrocution_skeleton_anim")])), live(anim_duration)]);
	} else {
		yield* g.call(f, P("/proc/flick_overlay_view"), null, [(yield* g.call(f, P("/proc/image"), null, [rt.sv(f, "icon"), live(f.src), "electrocuted_generic", 4.099999904632568])), live(f.src), live(anim_duration)]);
	}
	return f.dot;
}, true);

// /mob/living/carbon/human/proc/end_electrocution_animation  (code/modules/mob/living/carbon/human/human.dm:745)
rt.def("/mob/living/carbon/human/proc/end_electrocution_animation", function end_electrocution_animation(f: Frame, MA: Value) {
	rt.callSrc(f, "remove_atom_colour", [2, "#000000"]);
	rt.callSrc(f, "cut_overlay", [live(MA)]);
	return f.dot;
}, false, { argTypes: [{ path: "/mutable_appearance" }] });

// /mob/living/carbon/human/proc/canUseTopic  (code/modules/mob/living/carbon/human/human.dm:749)
rt.def("/mob/living/carbon/human/proc/canUseTopic", function canUseTopic(f: Frame, M: Value, be_close: Value) {
	f.vars = () => [be_close];
	if (live(be_close) === null) {
		be_close = 0;
	}
	if ((truthy(rt.callSrc(f, "incapacitated", [])) || truthy(rt.sv(f, "lying")))) {
		return live(f.dot);
	}
	if ((!truthy(rt.callSrc(f, "Adjacent", [live(M)])) && !isEqual(rt.fv(f, "loc", live(M)), live(f.src)))) {
		if ((isEqual(live(be_close), 0) && truthy(rt.callName(f, rt.sv(f, "dna"), "check_mutation", ["Telekinesis"])))) {
			if (truthy(rt.call(f, P("/proc/tkMaxRangeCheck"), null, [live(f.src), live(M)]))) {
				return 1;
			}
		}
		return live(f.dot);
	}
	return 1;
});

// /mob/living/carbon/human/proc/resist_restraints  (code/modules/mob/living/carbon/human/human.dm:759)  may sleep
rt.def("/mob/living/carbon/human/proc/resist_restraints", function* resist_restraints(f: Frame) {
	if ((truthy(rt.sv(f, "wear_suit")) && truthy(rt.fv(f, "breakouttime", rt.sv(f, "wear_suit"))))) {
		yield* g.srcCall(f, "changeNext_move", 100);
		rt.setSv(f, "last_special", add(rt.worldTime(f), 100));
		yield* g.srcCall(f, "cuff_resist", rt.sv(f, "wear_suit"));
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true);

// /mob/living/carbon/human/proc/replace_records_name  (code/modules/mob/living/carbon/human/human.dm:767)
rt.def("/mob/living/carbon/human/proc/replace_records_name", function replace_records_name(f: Frame, oldname: Value, newname: Value) {
	let L: Value = null, R: Value = null;
	let $e: any;
	f.vars = () => [L, R, $e];
	L = null;
	rt.forList(f, 0, rt.list(rt.fv(f, "general", rt.gl("data_core")), rt.fv(f, "medical", rt.gl("data_core")), rt.fv(f, "security", rt.gl("data_core")), rt.fv(f, "locked", rt.gl("data_core"))), T("/list"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		if (truthy((R = rt.call(f, P("/proc/find_record"), null, ["name", live(oldname), live(L)])))) {
			rt.setAt(rt.fv(f, "fields", live(R)), "name", live(newname));
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /mob/living/carbon/human/proc/get_total_tint  (code/modules/mob/living/carbon/human/human.dm:773)
rt.def("/mob/living/carbon/human/proc/get_total_tint", function get_total_tint(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "glasses"))) return f.dot;
	f.dot = rt.modify(live(f.dot), rt.fv(f, "tint", rt.sv(f, "glasses")), add);
	return f.dot;
});

// /mob/living/carbon/human/proc/update_health_hud  (code/modules/mob/living/carbon/human/human.dm:778)
rt.def("/mob/living/carbon/human/proc/update_health_hud", function update_health_hud(f: Frame) {
	let health_amount: Value = null, X: Value = null, BP: Value = null, damage: Value = null, comparison: Value = null, icon_num: Value = null, t: Value = null;
	let $0: any, $e: any;
	f.vars = () => [health_amount, X, BP, damage, comparison, icon_num, t, $0, $e];
	if ((!truthy(rt.sv(f, "client")) || !truthy(rt.sv(f, "hud_used")))) {
		return live(f.dot);
	}
	if (truthy(rt.callName(f, rt.fv(f, "species", rt.sv(f, "dna")), "update_health_hud", []))) {
		return live(f.dot);
	} else {
		if (truthy(rt.fv(f, "healths", rt.sv(f, "hud_used")))) {
			if (truthy(rt.callSuper(f, [(health_amount = subtract(rt.sv(f, "health"), rt.sv(f, "staminaloss")))]))) {
				$0 = rt.sv(f, "hal_screwyhud");
				if ($0 === 1) {
					rt.setFv(f, "icon_state", rt.fv(f, "healths", rt.sv(f, "hud_used")), "health6");
				} else if ($0 === 2) {
					rt.setFv(f, "icon_state", rt.fv(f, "healths", rt.sv(f, "hud_used")), "health7");
				} else if ($0 === 3) {
					rt.setFv(f, "icon_state", rt.fv(f, "healths", rt.sv(f, "hud_used")), "health0");
				}
			}
		}
		if (!truthy(rt.fv(f, "healthdoll", rt.sv(f, "hud_used")))) return f.dot;
		rt.callName(f, rt.fv(f, "healthdoll", rt.sv(f, "hud_used")), "cut_overlays", []);
		if (!isEqual(rt.sv(f, "stat"), 2)) {
			rt.setFv(f, "icon_state", rt.fv(f, "healthdoll", rt.sv(f, "hud_used")), "healthdoll_OVERLAY");
			X = null;
			rt.forList(f, 0, rt.sv(f, "bodyparts"));
			while (($e = rt.next(f, 0)) !== undefined) {
				X = $e;
				BP = live(X);
				damage = add(rt.fv(f, "burn_dam", live(BP)), rt.fv(f, "brute_dam", live(BP)));
				comparison = divide(rt.fv(f, "max_damage", live(BP)), 5);
				icon_num = 0;
				if (truthy(live(damage))) {
					icon_num = 1;
				}
				if (rt.gt(live(damage), live(comparison))) {
					icon_num = 2;
				}
				if (rt.gt(live(damage), multiply(live(comparison), 2))) {
					icon_num = 3;
				}
				if (rt.gt(live(damage), multiply(live(comparison), 3))) {
					icon_num = 4;
				}
				if (rt.gt(live(damage), multiply(live(comparison), 4))) {
					icon_num = 5;
				}
				if (isEqual(rt.sv(f, "hal_screwyhud"), 3)) {
					icon_num = 0;
				}
				if (truthy(live(icon_num))) {
					rt.callName(f, rt.fv(f, "healthdoll", rt.sv(f, "hud_used")), "add_overlay", [rt.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/mob/screen_gen.dmi"), fmt("＀＀", [rt.fv(f, "body_zone", live(BP)), live(icon_num)])])]);
				}
			}
			rt.endFor(f, 0);
			t = null;
			rt.forList(f, 0, rt.callSrc(f, "get_missing_limbs", []));
			while (($e = rt.next(f, 0)) !== undefined) {
				t = $e;
				rt.callName(f, rt.fv(f, "healthdoll", rt.sv(f, "hud_used")), "add_overlay", [rt.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/mob/screen_gen.dmi"), fmt("＀6", [live(t)])])]);
			}
			rt.endFor(f, 0);
		} else {
			rt.setFv(f, "icon_state", rt.fv(f, "healthdoll", rt.sv(f, "hud_used")), "healthdoll_DEAD");
		}
	}
	return f.dot;
});

// /mob/living/carbon/human/proc/fully_heal  (code/modules/mob/living/carbon/human/human.dm:823)  may sleep
rt.def("/mob/living/carbon/human/proc/fully_heal", function* fully_heal(f: Frame) {
	let HM: Value = null;
	let $e: any;
	f.vars = () => [HM, $e];
	if (live(f.args[0]) === null) {
		f.args[0] = 0;
	}
	if (truthy(live(f.args[0]))) {
		yield* g.srcCall(f, "regenerate_limbs");
		yield* g.srcCall(f, "regenerate_organs");
	}
	yield* g.srcCall(f, "remove_all_embedded_objects");
	yield* g.srcCall(f, "set_heartattack", 0);
	rt.setSv(f, "drunkenness", 0);
	HM = null;
	rt.forList(f, 0, rt.fv(f, "mutations", rt.sv(f, "dna")), T("/datum/mutation/human"));
	while (($e = rt.next(f, 0)) !== undefined) {
		HM = $e;
		if (!isEqual(rt.fv(f, "quality", live(HM)), 1)) {
			yield* g.callName(f, rt.sv(f, "dna"), "remove_mutation", [rt.fv(f, "name", live(HM))]);
		}
	}
	rt.endFor(f, 0);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["admin_revive"] });

// /mob/living/carbon/human/proc/influenceSin  (code/modules/mob/living/carbon/human/human.dm:835)
rt.def("/mob/living/carbon/human/proc/influenceSin", function influenceSin(f: Frame) {
	let O: Value = null;
	let $0: any;
	f.vars = () => [O, $0];
	O = null;
	$0 = rt.call(f, P("/proc/rand"), null, [1, 7]);
	if ($0 === 1) {
		rt.call(f, P("/proc/log_game"), null, [fmt("＀ was influenced by the sin of Acedia.", [live(f.src)])]);
		O = rt.new_(f, T("/datum/objective/sintouched/acedia"), []);
	} else if ($0 === 2) {
		rt.call(f, P("/proc/log_game"), null, [fmt("＀ was influenced by the sin of gluttony.", [live(f.src)])]);
		O = rt.new_(f, T("/datum/objective/sintouched/gluttony"), []);
	} else if ($0 === 3) {
		rt.call(f, P("/proc/log_game"), null, [fmt("＀ was influenced by the sin of greed.", [live(f.src)])]);
		O = rt.new_(f, T("/datum/objective/sintouched/greed"), []);
	} else if ($0 === 4) {
		rt.call(f, P("/proc/log_game"), null, [fmt("＀ was influenced by the sin of sloth.", [live(f.src)])]);
		O = rt.new_(f, T("/datum/objective/sintouched/sloth"), []);
	} else if ($0 === 5) {
		rt.call(f, P("/proc/log_game"), null, [fmt("＀ was influenced by the sin of wrath.", [live(f.src)])]);
		O = rt.new_(f, T("/datum/objective/sintouched/wrath"), []);
	} else if ($0 === 6) {
		rt.call(f, P("/proc/log_game"), null, [fmt("＀ was influenced by the sin of envy.", [live(f.src)])]);
		O = rt.new_(f, T("/datum/objective/sintouched/envy"), []);
	} else if ($0 === 7) {
		rt.call(f, P("/proc/log_game"), null, [fmt("＀ was influenced by the sin of pride.", [live(f.src)])]);
		O = rt.new_(f, T("/datum/objective/sintouched/pride"), []);
	}
	rt.modField(f, rt.fv(f, "mode", rt.gl("SSticker")), "sintouched", rt.fv(f, "mind", live(f.src)), add);
	rt.modField(f, rt.fv(f, "mind", live(f.src)), "objectives", live(O), add);
	rt.callName(f, rt.fv(f, "mind", live(f.src)), "announce_objectives", []);
	return f.dot;
});

// /mob/living/carbon/human/proc/check_weakness  (code/modules/mob/living/carbon/human/human.dm:862)  may sleep
rt.def("/mob/living/carbon/human/proc/check_weakness", function* check_weakness(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!(truthy(rt.sv(f, "dna")) && truthy(rt.fv(f, "species", rt.sv(f, "dna"))))) return f.dot;
	f.dot = rt.modify(live(f.dot), (yield* g.callName(f, rt.fv(f, "species", rt.sv(f, "dna")), "check_weakness", [live(f.args[0]), live(f.args[1])])), add);
	return f.dot;
}, true, { args: ["weapon", "attacker"] });

// /mob/living/carbon/human/proc/update_gravity  (code/modules/mob/living/carbon/human/human.dm:873)  may sleep
rt.def("/mob/living/carbon/human/proc/update_gravity", function* update_gravity(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	f.args[1] = rt.gv(f, "override_float", rt.fv(f, "species", rt.sv(f, "dna")));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["has_gravity", "override"] });

// /mob/living/carbon/human/proc/vomit  (code/modules/mob/living/carbon/human/human.dm:877)  may sleep
rt.def("/mob/living/carbon/human/proc/vomit", function* vomit(f: Frame) {
	if (live(f.args[0]) === null) {
		f.args[0] = 10;
	}
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 1;
	}
	if (live(f.args[3]) === null) {
		f.args[3] = 0;
	}
	if (live(f.args[4]) === null) {
		f.args[4] = 1;
	}
	if (live(f.args[5]) === null) {
		f.args[5] = 0;
	}
	if ((truthy(live(f.args[1])) && truthy((rt.isIn(f, 12, rt.gv(f, "species_traits", rt.fv(f, "species", rt.sv(f, "dna")))) ? 1 : 0)))) {
		if (truthy(live(f.args[4]))) {
			yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ dry heaves!</span>", [live(f.src)]), "<span class='userdanger'>You try to throw up, but there's nothing in your stomach!</span>");
		}
		if (truthy(live(f.args[2]))) {
			yield* g.srcCall(f, "Knockdown", 200);
		}
		return 1;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["lost_nutrition", "blood", "stun", "distance", "message", "toxic"] });

// /mob/living/carbon/human/proc/Bump  (code/modules/mob/living/carbon/human/human.dm:887)  may sleep
rt.def("/mob/living/carbon/human/proc/Bump", function* Bump(f: Frame) {
	let crashdir: Value = null, FP: Value = null;
	f.vars = () => [crashdir, FP];
	yield* g.callSuper(f, [], rt.Args.Same);
	crashdir = rt.getDir(f, live(f.src), live(f.args[0]));
	if (!truthy((FP = (yield* g.srcCall(f, "get_flightpack"))))) return f.dot;
	yield* g.callName(f, live(FP), "flight_impact", [live(f.args[0]), live(crashdir)]);
	return f.dot;
}, true, { args: ["A"] });

// /mob/living/carbon/human/proc/vv_get_dropdown  (code/modules/mob/living/carbon/human/human.dm:894)
rt.def("/mob/living/carbon/human/proc/vv_get_dropdown", function vv_get_dropdown(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	rt.setAt((f.dot = rt.modify(live(f.dot), "---", add)), "Make monkey", fmt("?_src_=vars;makemonkey=＃", [live(f.src)]));
	rt.setAt(live(f.dot), "Set Species", fmt("?_src_=vars;setspecies=＃", [live(f.src)]));
	rt.setAt(live(f.dot), "Make cyborg", fmt("?_src_=vars;makerobot=＃", [live(f.src)]));
	rt.setAt(live(f.dot), "Make alien", fmt("?_src_=vars;makealien=＃", [live(f.src)]));
	rt.setAt(live(f.dot), "Make slime", fmt("?_src_=vars;makeslime=＃", [live(f.src)]));
	rt.setAt(live(f.dot), "Toggle Purrbation", fmt("?_src_=vars;purrbation=＃", [live(f.src)]));
	return f.dot;
});

// /mob/living/carbon/human/proc/MouseDrop_T  (code/modules/mob/living/carbon/human/human.dm:904)  may sleep
rt.def("/mob/living/carbon/human/proc/MouseDrop_T", function* MouseDrop_T(f: Frame) {
	if ((((((!isEqual(live(f.args[0]), rt.sv(f, "pulling")) || rt.lt(rt.sv(f, "grab_state"), 1)) || !isEqual(live(f.args[1]), live(f.args[0]))) || !truthy((rt.istype(live(f.args[1]), T("/mob/living")) ? 1 : 0))) || truthy(rt.sv(f, "stat"))) || truthy(rt.fv(f, "stat", live(f.args[1]))))) {
		f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
		return live(f.dot);
	}
	yield* g.srcCall(f, "buckle_mob", live(f.args[0]), 1, 1);
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["target", "user"] });

// /mob/living/carbon/human/proc/buckle_mob  (code/modules/mob/living/carbon/human/human.dm:911)  may sleep
rt.def("/mob/living/carbon/human/proc/buckle_mob", function* buckle_mob(f: Frame, M: Value, force: Value, check_loc: Value) {
	f.vars = () => [M, force, check_loc];
	if (live(force) === null) {
		force = 0;
	}
	if (live(check_loc) === null) {
		check_loc = 1;
	}
	if (!truthy(live(force))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.call(f, P("/proc/is_type_in_typecache"), null, [live(M), rt.sv(f, "can_ride_typecache")])))) {
		yield* g.callName(f, live(M), "visible_message", [fmt("<span class='warning'>＀ really can't seem to mount ＀...</span>", [live(M), live(f.src)])]);
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "riding_datum"))) {
		rt.setSv(f, "riding_datum", (yield* g.new_(f, T("/datum/riding/human"), [live(f.src)])));
	}
	if ((((truthy(rt.sv(f, "buckled_mobs")) && (truthy((rt.isIn(f, live(M), rt.sv(f, "buckled_mobs")) ? 1 : 0)) || rt.ge(rt.len(f, rt.sv(f, "buckled_mobs")), rt.sv(f, "max_buckled_mobs")))) || truthy(rt.sv(f, "buckled"))) || !isEqual(rt.fv(f, "stat", live(M)), 0))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "visible_message", fmt("<span class='notice'>＀ starts to climb onto ＀...</span>", [live(M), live(f.src)]));
	if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(M), null, 15, "target", live(f.src)], rt.Args.Named)))) {
		if (truthy((rt.istype(live(M), T("/mob/living/carbon")) ? 1 : 0))) {
			if ((truthy((yield* g.callName(f, live(M), "incapacitated", [0, 1]))) || truthy((yield* g.srcCall(f, "incapacitated", 0, 1))))) {
				yield* g.callName(f, live(M), "visible_message", [fmt("<span class='warning'>＀ can't hang onto ＀!</span>", [live(M), live(f.src)])]);
				return live(f.dot);
			}
			if (!truthy((yield* g.callName(f, rt.sv(f, "riding_datum"), "equip_buckle_inhands", [live(M), 2])))) {
				yield* g.callName(f, live(M), "visible_message", [fmt("<span class='warning'>＀ can't climb onto ＀!</span>", [live(M), live(f.src)])]);
				return live(f.dot);
			}
		}
		f.dot = (yield* g.callSuper(f, [live(M), live(force), live(check_loc)]));
		yield* g.srcCall(f, "stop_pulling");
	} else {
		yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ fails to climb onto ＀!</span>", [live(M), live(f.src)]));
	}
	return f.dot;
}, true);

// /mob/living/carbon/human/proc/unbuckle_mob  (code/modules/mob/living/carbon/human/human.dm:935)  may sleep
rt.def("/mob/living/carbon/human/proc/unbuckle_mob", function* unbuckle_mob(f: Frame, M: Value, force: Value) {
	f.vars = () => [M, force];
	if (live(force) === null) {
		force = 0;
	}
	if (truthy((rt.istype(live(M), T("/mob/living/carbon")) ? 1 : 0))) {
		if (truthy(rt.sv(f, "riding_datum"))) {
			yield* g.callName(f, rt.sv(f, "riding_datum"), "unequip_buckle_inhands", [live(M)]);
			yield* g.callName(f, rt.sv(f, "riding_datum"), "restore_position", [live(M)]);
		}
	}
	f.dot = (yield* g.callSuper(f, [live(M), live(force)]));
	return f.dot;
}, true);
