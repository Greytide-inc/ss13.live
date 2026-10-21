// From code/game/gamemodes/clock_cult/clock_scriptures/scripture_scripts.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1218, "/datum/clockwork_scripture/create_object/ocular_warden", "/datum/clockwork_scripture/create_object", {
	descname: "Structure, Turret",
	name: "Ocular Warden",
	desc: "Forms an automatic short-range turret which will automatically attack nearby unrestrained non-Servants that can see it.",
	invocations: null,
	channel_time: 120,
	consumed_components: null,
	creator_message: "<span class='brass'>You form an ocular warden, which will automatically attack nearby unrestrained non-Servants that can see it.</span>",
	observer_message: "<span class='warning'>A brass eye takes shape and slowly rises into the air, its red iris glaring!</span>",
	usage_tip: "Although powerful, the warden is very fragile and should optimally be placed behind barricades.",
	tier: "Script",
	one_per_tile: 1,
	space_allowed: 1,
	primary_component: "belligerent_eye",
	sort_priority: 1,
	quickbind: 1,
	quickbind_desc: "Creates an Ocular Warden, which will automatically attack nearby unrestrained non-Servants that can see it.",
	object_path: rt.typePath("/obj/structure/destructible/clockwork/ocular_warden"),
});

// /datum/clockwork_scripture/create_object/ocular_warden/proc/<init>  (code/game/gamemodes/clock_cult/clock_scriptures/scripture_scripts.dm:12)
rt.def("/datum/clockwork_scripture/create_object/ocular_warden/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "invocations", rt.list("Guardians...", "...of the Engine...", "...defend us!"));
	rt.setSv(f, "consumed_components", rt.alist(f, ["belligerent_eye", 2, "replicant_alloy", 1]));
	return f.dot;
});

// /datum/clockwork_scripture/create_object/ocular_warden/proc/check_special_requirements  (code/game/gamemodes/clock_cult/clock_scriptures/scripture_scripts.dm:26)
rt.def("/datum/clockwork_scripture/create_object/ocular_warden/proc/check_special_requirements", function check_special_requirements(f: Frame) {
	let W: Value = null;
	let $e: any;
	f.vars = () => [W, $e];
	W = null;
	rt.forList(f, 0, rt.call(f, P("/proc/range"), null, [3, rt.sv(f, "invoker")]), T("/obj/structure/destructible/clockwork/ocular_warden"));
	while (($e = rt.next(f, 0)) !== undefined) {
		W = $e;
		rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "invoker"), "<span class='neovgre'>You sense another ocular warden too near this location. Placing another this close would cause them to fight.</span>"]);
		return 0;
	}
	rt.endFor(f, 0);
	return rt.callSuper(f, [], rt.Args.Same);
});

rt.type(1219, "/datum/clockwork_scripture/create_object/cogscarab", "/datum/clockwork_scripture/create_object", {
	descname: "Constructor Soul Vessel Shell",
	name: "Cogscarab",
	desc: "Creates a small shell fitted for soul vessels. Adding an active soul vessel to it results in a small construct with tools and an inbuilt fabricator.",
	invocations: null,
	channel_time: 60,
	consumed_components: null,
	creator_message: "<span class='brass'>You form a cogscarab, a constructor soul vessel receptacle.</span>",
	observer_message: "<span class='warning'>The slab disgorges a puddle of black metal that contracts and forms into a strange shell!</span>",
	usage_tip: "Useless without a soul vessel and should not be created without one.",
	tier: "Script",
	primary_component: "belligerent_eye",
	sort_priority: 2,
	quickbind: 1,
	quickbind_desc: "Creates a Cogscarab Shell, which produces a Cogscarab when filled with a Soul Vessel.",
	object_path: rt.typePath("/obj/structure/destructible/clockwork/shell/cogscarab"),
});

// /datum/clockwork_scripture/create_object/cogscarab/proc/<init>  (code/game/gamemodes/clock_cult/clock_scriptures/scripture_scripts.dm:39)
rt.def("/datum/clockwork_scripture/create_object/cogscarab/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "invocations", rt.list("Call forth...", "...the workers of Armorer."));
	rt.setSv(f, "consumed_components", rt.alist(f, ["belligerent_eye", 2, "hierophant_ansible", 1]));
	return f.dot;
});

rt.type(1220, "/datum/clockwork_scripture/create_object/vitality_matrix", "/datum/clockwork_scripture/create_object", {
	descname: "Trap, Damage to Healing",
	name: "Vitality Matrix",
	desc: "Places a sigil that drains life from any living non-Servants that cross it. Servants that cross it, however, will be healed based on how much Vitality all Matrices have drained from non-Servants. Dead Servants can be revived by this sigil if there is vitality equal to the target Servant's non-oxygen damage.",
	invocations: null,
	channel_time: 60,
	consumed_components: null,
	whispered: 1,
	creator_message: "<span class='brass'>A vitality matrix appears below you. It will drain life from non-Servants and heal Servants that cross it.</span>",
	usage_tip: "The sigil will be consumed upon reviving a Servant.",
	tier: "Script",
	one_per_tile: 1,
	primary_component: "vanguard_cogwheel",
	sort_priority: 3,
	quickbind: 1,
	quickbind_desc: "Creates a Vitality Matrix, which drains non-Servants on it to heal Servants that cross it.",
	object_path: rt.typePath("/obj/effect/clockwork/sigil/vitality"),
});

// /datum/clockwork_scripture/create_object/vitality_matrix/proc/<init>  (code/game/gamemodes/clock_cult/clock_scriptures/scripture_scripts.dm:59)
rt.def("/datum/clockwork_scripture/create_object/vitality_matrix/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "invocations", rt.list("Divinity...", "...steal their life...", "...for these shells!"));
	rt.setSv(f, "consumed_components", rt.alist(f, ["belligerent_eye", 1, "vanguard_cogwheel", 2]));
	return f.dot;
});

rt.type(1201, "/datum/clockwork_scripture/channeled/mending_mantra", "/datum/clockwork_scripture/channeled", {
	heal_attempts: 4,
	heal_amount: 2.5,
	descname: "Channeled, Area Healing and Repair",
	name: "Mending Mantra",
	desc: "Repairs nearby structures and constructs. Servants wearing clockwork armor will also be healed. Channeled every two seconds for a maximum of twenty seconds.",
	chant_invocations: null,
	chant_amount: 10,
	chant_interval: 20,
	consumed_components: null,
	usage_tip: "This is a very effective way to rapidly reinforce a base after an attack.",
	tier: "Script",
	primary_component: "vanguard_cogwheel",
	sort_priority: 4,
	quickbind: 1,
	quickbind_desc: "Repairs nearby structures and constructs. Servants wearing clockwork armor will also be healed.<br><b>Maximum 10 chants.</b>",
}, { global: { damage_heal_order: 650, heal_finish_messages: 651, heal_target_typecache: 952, ratvarian_armor_typecache: 953 } });

// /datum/clockwork_scripture/channeled/mending_mantra/proc/<init>  (code/game/gamemodes/clock_cult/clock_scriptures/scripture_scripts.dm:80)
rt.def("/datum/clockwork_scripture/channeled/mending_mantra/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "chant_invocations", rt.list("Mend our dents!", "Heal our scratches!", "Repair our gears!"));
	rt.setSv(f, "consumed_components", rt.alist(f, ["vanguard_cogwheel", 2, "replicant_alloy", 1]));
	return f.dot;
});

// /datum/clockwork_scripture/channeled/mending_mantra/proc/chant_effects  (code/game/gamemodes/clock_cult/clock_scriptures/scripture_scripts.dm:107)  may sleep
rt.def("/datum/clockwork_scripture/channeled/mending_mantra/proc/chant_effects", function* chant_effects(f: Frame, chant_number: Value) {
	let _T: Value = null, M: Value = null, S: Value = null, i: Value = null, H: Value = null, heal_ticks: Value = null, I: Value = null, i_5: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [chant_number, _T, M, S, i, H, heal_ticks, I, i_5, C, $e];
	_T = null;
	M = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [7, rt.sv(f, "invoker")])), T("/atom/movable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (truthy((rt.istype(live(M), T("/mob/living")) ? 1 : 0))) {
			if ((truthy((rt.istype(live(M), T("/mob/living/simple_animal/hostile/clockwork")) ? 1 : 0)) || truthy((rt.istype(live(M), T("/mob/living/simple_animal/drone/cogscarab")) ? 1 : 0)))) {
				if ((isEqual(rt.gv(f, "health", (S = live(M))), rt.fv(f, "maxHealth", live(S))) || isEqual(rt.fv(f, "stat", live(S)), 2))) {
					continue;
				}
				_T = rt.getStep(f, live(M), 0);
				i = null;
				rt.forRange(f, 1, 1, rt.sv(f, "heal_attempts"), 1);
				while (($e = rt.next(f, 1)) !== undefined) {
					i = $e;
					if (rt.lt(rt.fv(f, "health", live(S)), rt.fv(f, "maxHealth", live(S)))) {
						yield* g.callName(f, live(S), "adjustHealth", [rt.neg(rt.sv(f, "heal_amount"))]);
						yield* g.new_(f, T("/obj/effect/temp_visual/heal"), [live(_T), "#1E8CE1"]);
						if ((isEqual(live(i), rt.sv(f, "heal_attempts")) && rt.ge(rt.fv(f, "health", live(S)), rt.fv(f, "maxHealth", live(S))))) {
							yield* g.call(f, P("/proc/to_chat"), null, [live(S), fmt("<span class='inathneq'>\"＀\"</span>", [(yield* g.call(f, P("/proc/text2ratvar"), null, [rt.op(f, "PickUnweighted", [1], [rt.gl("heal_finish_messages")])]))])]);
							break;
						}
					} else {
						yield* g.call(f, P("/proc/to_chat"), null, [live(S), fmt("<span class='inathneq'>\"＀\"</span>", [(yield* g.call(f, P("/proc/text2ratvar"), null, [rt.op(f, "PickUnweighted", [1], [rt.gl("heal_finish_messages")])]))])]);
						break;
					}
				}
				rt.endFor(f, 1);
			} else {
				if (truthy((rt.istype(live(M), T("/mob/living/silicon")) ? 1 : 0))) {
					if (((isEqual(rt.gv(f, "health", (S = live(M))), rt.fv(f, "maxHealth", live(S))) || isEqual(rt.fv(f, "stat", live(S)), 2)) || !truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(S)]))))) {
						continue;
					}
					_T = rt.getStep(f, live(M), 0);
					i = null;
					rt.forRange(f, 1, 1, rt.sv(f, "heal_attempts"), 1);
					while (($e = rt.next(f, 1)) !== undefined) {
						i = $e;
						if (rt.lt(rt.fv(f, "health", live(S)), rt.fv(f, "maxHealth", live(S)))) {
							yield* g.callName(f, live(S), "heal_ordered_damage", [rt.sv(f, "heal_amount"), rt.gl("damage_heal_order")]);
							yield* g.new_(f, T("/obj/effect/temp_visual/heal"), [live(_T), "#1E8CE1"]);
							if ((isEqual(live(i), rt.sv(f, "heal_attempts")) && rt.ge(rt.fv(f, "health", live(S)), rt.fv(f, "maxHealth", live(S))))) {
								yield* g.call(f, P("/proc/to_chat"), null, [live(S), fmt("<span class='inathneq'>\"＀\"</span>", [(yield* g.call(f, P("/proc/text2ratvar"), null, [rt.op(f, "PickUnweighted", [1], [rt.gl("heal_finish_messages")])]))])]);
								break;
							}
						} else {
							yield* g.call(f, P("/proc/to_chat"), null, [live(S), fmt("<span class='inathneq'>\"＀\"</span>", [(yield* g.call(f, P("/proc/text2ratvar"), null, [rt.op(f, "PickUnweighted", [1], [rt.gl("heal_finish_messages")])]))])]);
							break;
						}
					}
					rt.endFor(f, 1);
				} else {
					if (truthy((rt.istype(live(M), T("/mob/living/carbon/human")) ? 1 : 0))) {
						if (((isEqual(rt.gv(f, "health", (H = live(M))), rt.fv(f, "maxHealth", live(H))) || isEqual(rt.fv(f, "stat", live(H)), 2)) || !truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(H)]))))) {
							continue;
						}
						_T = rt.getStep(f, live(M), 0);
						heal_ticks = 0;
						if (truthy((yield* g.call(f, P("/proc/is_type_in_typecache"), null, [(I = (yield* g.callName(f, live(H), "get_item_by_slot", [13]))), rt.gl("ratvarian_armor_typecache")])))) {
							heal_ticks = rt.inc(live(heal_ticks), 1);
						}
						if (truthy((yield* g.call(f, P("/proc/is_type_in_typecache"), null, [(I = (yield* g.callName(f, live(H), "get_item_by_slot", [11]))), rt.gl("ratvarian_armor_typecache")])))) {
							heal_ticks = rt.inc(live(heal_ticks), 1);
						}
						if (truthy((yield* g.call(f, P("/proc/is_type_in_typecache"), null, [(I = (yield* g.callName(f, live(H), "get_item_by_slot", [9]))), rt.gl("ratvarian_armor_typecache")])))) {
							heal_ticks = rt.inc(live(heal_ticks), 1);
						}
						if (truthy((yield* g.call(f, P("/proc/is_type_in_typecache"), null, [(I = (yield* g.callName(f, live(H), "get_item_by_slot", [12]))), rt.gl("ratvarian_armor_typecache")])))) {
							heal_ticks = rt.inc(live(heal_ticks), 1);
						}
						if (truthy(live(heal_ticks))) {
							i_5 = null;
							rt.forRange(f, 1, 1, live(heal_ticks), 1);
							while (($e = rt.next(f, 1)) !== undefined) {
								i_5 = $e;
								if (rt.lt(rt.fv(f, "health", live(H)), rt.fv(f, "maxHealth", live(H)))) {
									yield* g.callName(f, live(H), "heal_ordered_damage", [rt.sv(f, "heal_amount"), rt.gl("damage_heal_order")]);
									yield* g.new_(f, T("/obj/effect/temp_visual/heal"), [live(_T), "#1E8CE1"]);
									if ((isEqual(live(i_5), live(heal_ticks)) && rt.ge(rt.fv(f, "health", live(H)), rt.fv(f, "maxHealth", live(H))))) {
										yield* g.call(f, P("/proc/to_chat"), null, [live(H), fmt("<span class='inathneq'>\"＀\"</span>", [(yield* g.call(f, P("/proc/text2ratvar"), null, [rt.op(f, "PickUnweighted", [1], [rt.gl("heal_finish_messages")])]))])]);
										break;
									}
								} else {
									yield* g.call(f, P("/proc/to_chat"), null, [live(H), fmt("<span class='inathneq'>\"＀\"</span>", [(yield* g.call(f, P("/proc/text2ratvar"), null, [rt.op(f, "PickUnweighted", [1], [rt.gl("heal_finish_messages")])]))])]);
									break;
								}
							}
							rt.endFor(f, 1);
						}
					}
				}
			}
		} else {
			if (truthy((yield* g.call(f, P("/proc/is_type_in_typecache"), null, [live(M), rt.gl("heal_target_typecache")])))) {
				if ((isEqual(rt.gv(f, "obj_integrity", (C = live(M))), rt.fv(f, "max_integrity", live(C))) || (truthy((rt.istype(live(C), T("/obj/structure/destructible/clockwork")) ? 1 : 0)) && !truthy(rt.fv(f, "can_be_repaired", live(C)))))) {
					continue;
				}
				_T = rt.getStep(f, live(M), 0);
				i = null;
				rt.forRange(f, 1, 1, rt.sv(f, "heal_attempts"), 1);
				while (($e = rt.next(f, 1)) !== undefined) {
					i = $e;
					if (rt.lt(rt.fv(f, "obj_integrity", live(C)), rt.fv(f, "max_integrity", live(C)))) {
						rt.setFv(f, "obj_integrity", live(C), (yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "obj_integrity", live(C)), 5), rt.fv(f, "max_integrity", live(C))])));
						yield* g.callName(f, live(C), "update_icon", []);
						yield* g.new_(f, T("/obj/effect/temp_visual/heal"), [live(_T), "#1E8CE1"]);
					} else {
						break;
					}
				}
				rt.endFor(f, 1);
			}
		}
	}
	rt.endFor(f, 0);
	yield* g.new_(f, T("/obj/effect/temp_visual/ratvar/mending_mantra"), [rt.getStep(f, rt.sv(f, "invoker"), 0)]);
	return 1;
}, true);

rt.type(1221, "/datum/clockwork_scripture/create_object/sigil_of_submission", "/datum/clockwork_scripture/create_object", {
	descname: "Trap, Conversion",
	name: "Sigil of Submission",
	desc: "Places a luminous sigil that will enslave any valid beings standing on it after a time.",
	invocations: null,
	channel_time: 60,
	consumed_components: null,
	whispered: 1,
	creator_message: "<span class='brass'>A luminous sigil appears below you. The next non-servant to cross it will be enslaved after a brief time if they do not move.</span>",
	usage_tip: "This is not a primary conversion method - use Geis for that. It is advantageous as a trap, however, as it will transmit the name of the newly-converted.",
	tier: "Script",
	one_per_tile: 1,
	primary_component: "geis_capacitor",
	sort_priority: 5,
	quickbind: 1,
	quickbind_desc: "Creates a Sigil of Submission, which will convert one non-Servant that remains on it.",
	object_path: rt.typePath("/obj/effect/clockwork/sigil/submission"),
});

// /datum/clockwork_scripture/create_object/sigil_of_submission/proc/<init>  (code/game/gamemodes/clock_cult/clock_scriptures/scripture_scripts.dm:191)
rt.def("/datum/clockwork_scripture/create_object/sigil_of_submission/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "invocations", rt.list("Divinity, enlighten...", "...those who trespass here!"));
	rt.setSv(f, "consumed_components", rt.alist(f, ["belligerent_eye", 1, "geis_capacitor", 2]));
	return f.dot;
});

rt.type(1222, "/datum/clockwork_scripture/create_object/soul_vessel", "/datum/clockwork_scripture/create_object", {
	descname: "Clockwork Posibrain",
	name: "Soul Vessel",
	desc: "Forms an ancient positronic brain with an overriding directive to serve Ratvar.",
	invocations: null,
	channel_time: 30,
	consumed_components: null,
	whispered: 1,
	creator_message: "<span class='brass'>You form a soul vessel, which can be used in-hand to attract spirits, or used on an unconscious or dead human to extract their consciousness.</span>",
	usage_tip: "The vessel can be used as a teleport target for Spatial Gateway, though it is generally better-used by placing it in a shell or cyborg body.",
	tier: "Script",
	space_allowed: 1,
	primary_component: "geis_capacitor",
	sort_priority: 6,
	quickbind: 1,
	quickbind_desc: "Creates a Soul Vessel, which can be placed in construct shells and cyborg bodies once filled.",
	object_path: rt.typePath("/obj/item/device/mmi/posibrain/soul_vessel"),
});

// /datum/clockwork_scripture/create_object/soul_vessel/proc/<init>  (code/game/gamemodes/clock_cult/clock_scriptures/scripture_scripts.dm:211)
rt.def("/datum/clockwork_scripture/create_object/soul_vessel/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "invocations", rt.list("Herd the souls of...", "...the blasphemous damned!"));
	rt.setSv(f, "consumed_components", rt.alist(f, ["vanguard_cogwheel", 1, "geis_capacitor", 2]));
	return f.dot;
});

rt.type(1223, "/datum/clockwork_scripture/create_object/replica_fabricator", "/datum/clockwork_scripture/create_object", {
	descname: "Replaces Objects with Ratvarian Versions",
	name: "Replica Fabricator",
	desc: "Forms a device that, when used on certain objects, replaces them with their Ratvarian equivalents. It requires power to function.",
	invocations: null,
	channel_time: 20,
	consumed_components: null,
	whispered: 1,
	creator_message: "<span class='brass'>You form a replica fabricator.</span>",
	usage_tip: "Clockwork Walls cause nearby Tinkerer's Caches to generate components passively, making this a vital tool. Clockwork Floors heal toxin damage in Servants standing on them.",
	tier: "Script",
	space_allowed: 1,
	primary_component: "replicant_alloy",
	sort_priority: 7,
	quickbind: 1,
	quickbind_desc: "Creates a Replica Fabricator, which can convert various objects to Ratvarian variants.",
	object_path: rt.typePath("/obj/item/clockwork/replica_fabricator/preloaded"),
});

// /datum/clockwork_scripture/create_object/replica_fabricator/proc/<init>  (code/game/gamemodes/clock_cult/clock_scriptures/scripture_scripts.dm:231)
rt.def("/datum/clockwork_scripture/create_object/replica_fabricator/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "invocations", rt.list("With this device...", "...his presence shall be made known."));
	rt.setSv(f, "consumed_components", rt.alist(f, ["geis_capacitor", 1, "replicant_alloy", 2]));
	return f.dot;
});

rt.type(1234, "/datum/clockwork_scripture/function_call", "/datum/clockwork_scripture", {
	descname: "Permanent Summonable Spear",
	name: "Function Call",
	desc: "Grants the invoker the ability to call forth a powerful Ratvarian spear every three minutes. The spear will deal significant damage to Nar-Sie's dogs and silicon lifeforms, but will vanish three minutes after being summoned.",
	invocations: null,
	channel_time: 20,
	consumed_components: null,
	whispered: 1,
	usage_tip: "You can impale human targets with the spear by pulling them, then attacking. Throwing the spear at a mob will do massive damage and knock them down, but break the spear.",
	tier: "Script",
	primary_component: "replicant_alloy",
	sort_priority: 8,
});

// /datum/clockwork_scripture/function_call/proc/<init>  (code/game/gamemodes/clock_cult/clock_scriptures/scripture_scripts.dm:252)
rt.def("/datum/clockwork_scripture/function_call/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "invocations", rt.list("Grant me...", "...the might of brass!"));
	rt.setSv(f, "consumed_components", rt.alist(f, ["replicant_alloy", 2, "hierophant_ansible", 1]));
	return f.dot;
});

// /datum/clockwork_scripture/function_call/proc/check_special_requirements  (code/game/gamemodes/clock_cult/clock_scriptures/scripture_scripts.dm:260)
rt.def("/datum/clockwork_scripture/function_call/proc/check_special_requirements", function check_special_requirements(f: Frame) {
	let F: Value = null;
	let $e: any;
	f.vars = () => [F, $e];
	F = null;
	rt.forList(f, 0, rt.fv(f, "actions", rt.sv(f, "invoker")), T("/datum/action/innate/function_call"));
	while (($e = rt.next(f, 0)) !== undefined) {
		F = $e;
		rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "invoker"), "<span class='warning'>You have already bound a Ratvarian spear to yourself!</span>"]);
		return 0;
	}
	rt.endFor(f, 0);
	return rt.callName(f, rt.sv(f, "invoker"), "can_hold_items", []);
});

// /datum/clockwork_scripture/function_call/proc/scripture_effects  (code/game/gamemodes/clock_cult/clock_scriptures/scripture_scripts.dm:266)  may sleep
rt.def("/datum/clockwork_scripture/function_call/proc/scripture_effects", function* scripture_effects(f: Frame) {
	let F: Value = null;
	f.vars = () => [F];
	yield* g.callName(f, rt.sv(f, "invoker"), "visible_message", [fmt("<span class='warning'>A shimmer of yellow light infuses ＀!</span>", [rt.sv(f, "invoker")]), "<span class='brass'>You bind a Ratvarian spear to yourself. Use the \"Function Call\" action button to call it forth.</span>"]);
	yield* g.callName(f, (F = (yield* g.new_(f, T("/datum/action/innate/function_call"), []))), "Grant", [rt.sv(f, "invoker")]);
	return 1;
}, true);

rt.type(90, "/datum/action/innate/function_call", "/datum/action/innate", {
	cooldown: 0,
	base_cooldown: 1800,
	name: "Function Call",
	desc: "Allows you to summon a Ratvarian spear to fight enemies.",
	button_icon_state: "ratvarian_spear",
	background_icon_state: "bg_clock",
	check_flags: 11,
	buttontooltipstyle: "clockcult",
});

// /datum/action/innate/function_call/proc/IsAvailable  (code/game/gamemodes/clock_cult/clock_scriptures/scripture_scripts.dm:284)
rt.def("/datum/action/innate/function_call/proc/IsAvailable", function IsAvailable(f: Frame) {
	if ((!truthy(rt.call(f, P("/proc/is_servant_of_ratvar"), null, [rt.sv(f, "owner")])) || rt.gt(rt.sv(f, "cooldown"), rt.worldTime(f)))) {
		return 0;
	}
	return rt.callSuper(f, [], rt.Args.Same);
});

// /datum/action/innate/function_call/proc/Activate  (code/game/gamemodes/clock_cult/clock_scriptures/scripture_scripts.dm:289)  may sleep
rt.def("/datum/action/innate/function_call/proc/Activate", function* Activate(f: Frame) {
	let R: Value = null;
	f.vars = () => [R];
	if (!truthy((yield* g.callName(f, rt.sv(f, "owner"), "get_empty_held_indexes", [])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>You need an empty hand to call forth your spear!</span>"]);
		return 0;
	}
	yield* g.callName(f, rt.sv(f, "owner"), "visible_message", [fmt("<span class='warning'>A strange spear materializes in ＀'s hands!</span>", [rt.sv(f, "owner")]), "<span class='brass'>You call forth your spear!</span>"]);
	R = (yield* g.new_(f, T("/obj/item/clockwork/ratvarian_spear"), [rt.getStep(f, live(f.usr), 0)]));
	yield* g.callName(f, rt.sv(f, "owner"), "put_in_hands", [live(R)]);
	if (!truthy(rt.gl("ratvar_awakens"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class='warning'>Your spear begins to break down in this plane of existence. You can't use it for long!</span>"]);
	}
	rt.setSv(f, "cooldown", add(rt.sv(f, "base_cooldown"), rt.worldTime(f)));
	yield* g.callName(f, rt.sv(f, "owner"), "update_action_buttons_icon", []);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [rt.sv(f, "owner"), P("/mob/proc/update_action_buttons_icon")])), rt.sv(f, "base_cooldown")]);
	return 1;
}, true);

rt.type(1235, "/datum/clockwork_scripture/spatial_gateway", "/datum/clockwork_scripture", {
	descname: "Teleport Gate",
	name: "Spatial Gateway",
	desc: "Tears open a miniaturized gateway in spacetime to any conscious servant that can transport objects or creatures to its destination. Each servant assisting in the invocation adds one additional use and four additional seconds to the gateway's uses and duration.",
	invocations: null,
	channel_time: 80,
	consumed_components: null,
	multiple_invokers_used: 1,
	multiple_invokers_optional: 1,
	usage_tip: "This gateway is strictly one-way and will only allow things through the invoker's portal.",
	tier: "Script",
	primary_component: "hierophant_ansible",
	sort_priority: 9,
	quickbind: 1,
	quickbind_desc: "Allows you to create a one-way Spatial Gateway to a living Servant or Clockwork Obelisk.",
});

// /datum/clockwork_scripture/spatial_gateway/proc/<init>  (code/game/gamemodes/clock_cult/clock_scriptures/scripture_scripts.dm:311)
rt.def("/datum/clockwork_scripture/spatial_gateway/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "invocations", rt.list("Spatial Gateway...", "...activate!"));
	rt.setSv(f, "consumed_components", rt.alist(f, ["vanguard_cogwheel", 1, "hierophant_ansible", 2]));
	return f.dot;
});

// /datum/clockwork_scripture/spatial_gateway/proc/check_special_requirements  (code/game/gamemodes/clock_cult/clock_scriptures/scripture_scripts.dm:322)
rt.def("/datum/clockwork_scripture/spatial_gateway/proc/check_special_requirements", function check_special_requirements(f: Frame) {
	let other_servants: Value = null, L: Value = null, O: Value = null;
	let $e: any;
	f.vars = () => [other_servants, L, O, $e];
	if (!truthy(rt.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", rt.sv(f, "invoker"))]))) {
		rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "invoker"), "<span class='warning'>You must not be inside an object to use this scripture!</span>"]);
		return 0;
	}
	other_servants = 0;
	L = null;
	rt.forList(f, 0, rt.gl("living_mob_list"), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		if (((truthy(rt.call(f, P("/proc/is_servant_of_ratvar"), null, [live(L)])) && !truthy(rt.fv(f, "stat", live(L)))) && !isEqual(live(L), rt.sv(f, "invoker")))) {
			other_servants = rt.inc(live(other_servants), 1);
		}
	}
	rt.endFor(f, 0);
	O = null;
	rt.forList(f, 0, rt.gl("all_clockwork_objects"), T("/obj/structure/destructible/clockwork/powered/clockwork_obelisk"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		if (truthy(rt.fv(f, "anchored", live(O)))) {
			other_servants = rt.inc(live(other_servants), 1);
		}
	}
	rt.endFor(f, 0);
	if (!truthy(live(other_servants))) {
		rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "invoker"), "<span class='warning'>There are no other conscious servants or anchored clockwork obelisks!</span>"]);
		return 0;
	}
	return 1;
});

// /datum/clockwork_scripture/spatial_gateway/proc/scripture_effects  (code/game/gamemodes/clock_cult/clock_scriptures/scripture_scripts.dm:340)  may sleep
rt.def("/datum/clockwork_scripture/spatial_gateway/proc/scripture_effects", function* scripture_effects(f: Frame) {
	let portal_uses: Value = null, duration: Value = null, L: Value = null;
	let $e: any;
	f.vars = () => [portal_uses, duration, L, $e];
	portal_uses = 0;
	duration = 0;
	L = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [1, rt.sv(f, "invoker")])), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		if ((!truthy(rt.fv(f, "stat", live(L))) && truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(L)]))))) {
			portal_uses = rt.inc(live(portal_uses), 1);
			duration = rt.modify(live(duration), 40, add);
		}
	}
	rt.endFor(f, 0);
	if (truthy(rt.gl("ratvar_awakens"))) {
		portal_uses = (yield* g.call(f, P("/proc/max"), null, [live(portal_uses), 100]));
		duration = (yield* g.call(f, P("/proc/max"), null, [live(duration), 100]));
	}
	return (yield* g.callName(f, rt.sv(f, "slab"), "procure_gateway", [rt.sv(f, "invoker"), live(duration), live(portal_uses)]));
}, true);

rt.type(1202, "/datum/clockwork_scripture/channeled/volt_blaster", "/datum/clockwork_scripture/channeled", {
	descname: "Channeled, Targeted Energy Blasts",
	name: "Volt Blaster",
	desc: "Allows you to fire five energy rays at target locations. Channeled every fourth of a second for a maximum of ten seconds.",
	channel_time: 30,
	invocations: null,
	chant_invocations: null,
	chant_amount: 5,
	chant_interval: 4,
	consumed_components: null,
	usage_tip: "Though it requires you to stand still, this scripture can do massive damage.",
	tier: "Script",
	primary_component: "hierophant_ansible",
	sort_priority: 10,
	quickbind: 1,
	quickbind_desc: "Allows you to fire energy rays at target locations.<br><b>Maximum 5 chants.</b>",
}, { global: { nzcrentr_insults: 652 } });

// /datum/clockwork_scripture/channeled/volt_blaster/proc/<init>  (code/game/gamemodes/clock_cult/clock_scriptures/scripture_scripts.dm:360)
rt.def("/datum/clockwork_scripture/channeled/volt_blaster/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "invocations", rt.list("Amperage...", "...grant me your power!"));
	rt.setSv(f, "chant_invocations", rt.list("Use charge to kill!", "Slay with power!", "Hunt with energy!"));
	rt.setSv(f, "consumed_components", rt.alist(f, ["geis_capacitor", 1, "hierophant_ansible", 2]));
	return f.dot;
});

// /datum/clockwork_scripture/channeled/volt_blaster/proc/chant_effects  (code/game/gamemodes/clock_cult/clock_scriptures/scripture_scripts.dm:371)  may sleep
rt.def("/datum/clockwork_scripture/channeled/volt_blaster/proc/chant_effects", function* chant_effects(f: Frame, chant_number: Value) {
	let ray: Value = null, _T: Value = null;
	f.vars = () => [chant_number, ray, _T];
	rt.setFv(f, "busy", rt.sv(f, "slab"), null);
	rt.setFv(f, "slab", (ray = (yield* g.new_(f, T("/datum/clockwork_scripture/ranged_ability/volt_ray"), []))), rt.sv(f, "slab"));
	rt.setFv(f, "invoker", live(ray), rt.sv(f, "invoker"));
	_T = rt.getStep(f, rt.sv(f, "invoker"), 0);
	if (((!truthy((yield* g.callName(f, live(ray), "run_scripture", []))) && truthy(rt.sv(f, "slab"))) && truthy(rt.sv(f, "invoker")))) {
		if ((truthy((yield* g.srcCall(f, "can_recite"))) && isEqual(live(_T), rt.getStep(f, rt.sv(f, "invoker"), 0)))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "invoker"), fmt("<span class='nzcrentr'>\"＀\"</span>", [(yield* g.call(f, P("/proc/text2ratvar"), null, [rt.op(f, "PickUnweighted", [1], [rt.gl("nzcrentr_insults")])]))])]);
		} else {
			return 0;
		}
	}
	return 1;
}, true);
