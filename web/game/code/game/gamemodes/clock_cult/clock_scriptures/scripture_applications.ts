// From code/game/gamemodes/clock_cult/clock_scriptures/scripture_applications.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1204, "/datum/clockwork_scripture/create_object/sigil_of_accession", "/datum/clockwork_scripture/create_object", {
	descname: "Trap, Permanent Conversion",
	name: "Sigil of Accession",
	desc: "Places a luminous sigil much like a Sigil of Submission, but it will remain even after successfully converting a non-implanted target. It will penetrate mindshield implants once before disappearing.",
	invocations: null,
	channel_time: 70,
	consumed_components: null,
	whispered: 1,
	creator_message: "<span class='brass'>A luminous sigil appears below you. All non-servants to cross it will be enslaved after a brief time if they do not move.</span>",
	usage_tip: "It will remain after converting a target, unless that target has a mindshield implant, which it will break to convert them, but consume itself in the process.",
	tier: "Application",
	one_per_tile: 1,
	primary_component: "belligerent_eye",
	sort_priority: 1,
	quickbind: 1,
	quickbind_desc: "Creates a Sigil of Accession, which can convert a mindshielded non-Servant that remains on it.",
	object_path: rt.typePath("/obj/effect/clockwork/sigil/submission/accession"),
	prevent_path: rt.typePath("/obj/effect/clockwork/sigil/submission"),
});

// /datum/clockwork_scripture/create_object/sigil_of_accession/proc/<init>  (code/game/gamemodes/clock_cult/clock_scriptures/scripture_applications.dm:13)
rt.def("/datum/clockwork_scripture/create_object/sigil_of_accession/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "invocations", rt.list("Divinity, enslave...", "...all who trespass here!"));
	rt.setSv(f, "consumed_components", rt.alist(f, ["belligerent_eye", 4, "geis_capacitor", 2, "hierophant_ansible", 2]));
	return f.dot;
});

rt.type(1230, "/datum/clockwork_scripture/fellowship_armory", "/datum/clockwork_scripture", {
	descname: "Area Servant Armor",
	name: "Fellowship Armory",
	desc: "Equips the invoker and all visible Servants with Ratvarian armor. This armor provides high melee resistance but a weakness to lasers. It grows faster to invoke with more adjacent Servants.",
	invocations: null,
	channel_time: 100,
	consumed_components: null,
	usage_tip: "This scripture will replace all weaker armor worn by affected Servants.",
	tier: "Application",
	multiple_invokers_used: 1,
	multiple_invokers_optional: 1,
	primary_component: "vanguard_cogwheel",
	sort_priority: 2,
	quickbind: 1,
	quickbind_desc: "Attempts to armor all nearby Servants with powerful Ratvarian armor.",
}, { global: { ratvarian_armor_typecache: 954, better_armor_typecache: 955 } });

// /datum/clockwork_scripture/fellowship_armory/proc/<init>  (code/game/gamemodes/clock_cult/clock_scriptures/scripture_applications.dm:35)
rt.def("/datum/clockwork_scripture/fellowship_armory/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "invocations", rt.list("Shield us...", "...with the...", "... fragments of Engine!"));
	rt.setSv(f, "consumed_components", rt.alist(f, ["vanguard_cogwheel", 4, "replicant_alloy", 2, "hierophant_ansible", 2]));
	return f.dot;
});

// /datum/clockwork_scripture/fellowship_armory/proc/run_scripture  (code/game/gamemodes/clock_cult/clock_scriptures/scripture_applications.dm:55)  may sleep
rt.def("/datum/clockwork_scripture/fellowship_armory/proc/run_scripture", function* run_scripture(f: Frame) {
	let L: Value = null;
	let $e: any;
	f.vars = () => [L, $e];
	L = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/orange"), null, [1, rt.sv(f, "invoker")])), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		if (truthy((yield* g.call(f, P("/proc/can_recite_scripture"), null, [live(L)])))) {
			rt.setSv(f, "channel_time", (yield* g.call(f, P("/proc/max"), null, [subtract(rt.sv(f, "channel_time"), 10), 0])));
		}
	}
	rt.endFor(f, 0);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /datum/clockwork_scripture/fellowship_armory/proc/scripture_effects  (code/game/gamemodes/clock_cult/clock_scriptures/scripture_applications.dm:62)  may sleep
rt.def("/datum/clockwork_scripture/fellowship_armory/proc/scripture_effects", function* scripture_effects(f: Frame) {
	let affected: Value = null, L: Value = null, do_message: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [affected, L, do_message, I, $e];
	affected = 0;
	L = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/view"), null, [7, rt.getStep(f, rt.sv(f, "invoker"), 0)])), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		if ((isEqual(rt.fv(f, "stat", live(L)), 2) || !truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(L)]))))) {
			continue;
		}
		do_message = 0;
		if (truthy((yield* g.srcCall(f, "remove_item_if_better", (I = (yield* g.callName(f, live(L), "get_item_by_slot", [13]))), live(L))))) {
			do_message = rt.modify(live(do_message), (yield* g.callName(f, live(L), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/suit/armor/clockwork"), [null])), 13])), add);
		}
		if (truthy((yield* g.srcCall(f, "remove_item_if_better", (I = (yield* g.callName(f, live(L), "get_item_by_slot", [11]))), live(L))))) {
			do_message = rt.modify(live(do_message), (yield* g.callName(f, live(L), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/head/helmet/clockwork"), [null])), 11])), add);
		}
		if (truthy((yield* g.srcCall(f, "remove_item_if_better", (I = (yield* g.callName(f, live(L), "get_item_by_slot", [9]))), live(L))))) {
			do_message = rt.modify(live(do_message), (yield* g.callName(f, live(L), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/gloves/clockwork"), [null])), 9])), add);
		}
		if (truthy((yield* g.srcCall(f, "remove_item_if_better", (I = (yield* g.callName(f, live(L), "get_item_by_slot", [12]))), live(L))))) {
			do_message = rt.modify(live(do_message), (yield* g.callName(f, live(L), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/shoes/clockwork"), [null])), 12])), add);
		}
		if (truthy(live(do_message))) {
			yield* g.callName(f, live(L), "visible_message", [fmt("<span class='warning'>Strange armor appears on ＀!</span>", [live(L)]), "<span class='heavy_brass'>A bright shimmer runs down your body, equipping you with Ratvarian armor.</span>"]);
			yield* g.call(f, P("/proc/playsound"), null, [live(L), rt.rsc("sound/magic/clockwork/fellowship_armory.ogg"), multiply(15, live(do_message)), 1]);
			affected = rt.inc(live(affected), 1);
		}
	}
	rt.endFor(f, 0);
	return live(affected);
}, true);

// /datum/clockwork_scripture/fellowship_armory/proc/remove_item_if_better  (code/game/gamemodes/clock_cult/clock_scriptures/scripture_applications.dm:85)  may sleep
rt.def("/datum/clockwork_scripture/fellowship_armory/proc/remove_item_if_better", function* remove_item_if_better(f: Frame, I: Value, user: Value) {
	f.vars = () => [I, user];
	if (!truthy(live(I))) {
		return 1;
	}
	if (truthy((yield* g.call(f, P("/proc/is_type_in_typecache"), null, [live(I), rt.gl("ratvarian_armor_typecache#2")])))) {
		return 0;
	}
	if ((!truthy(rt.gl("ratvar_awakens")) && truthy((yield* g.call(f, P("/proc/is_type_in_typecache"), null, [live(I), rt.gl("better_armor_typecache")]))))) {
		return 0;
	}
	return (yield* g.callName(f, live(user), "dropItemToGround", [live(I)]));
}, true);

rt.type(1231, "/datum/clockwork_scripture/memory_allocation", "/datum/clockwork_scripture", {
	descname: "Guardian",
	name: "Memory Allocation",
	desc: "Allocates part of your consciousness to a Clockwork Marauder, a vigilant fighter that lives within you, able to be called forth by Speaking its True Name or if you become exceptionally low on health.<br>If it remains close to you, you will gradually regain health up to a low amount, but it will die if it goes too far from you.",
	invocations: null,
	channel_time: 100,
	consumed_components: null,
	usage_tip: "Marauders are useful as personal bodyguards and frontline warriors.",
	tier: "Application",
	primary_component: "geis_capacitor",
	sort_priority: 3,
});

// /datum/clockwork_scripture/memory_allocation/proc/<init>  (code/game/gamemodes/clock_cult/clock_scriptures/scripture_applications.dm:102)
rt.def("/datum/clockwork_scripture/memory_allocation/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "invocations", rt.list("Fright's will...", "...call forth..."));
	rt.setSv(f, "consumed_components", rt.alist(f, ["belligerent_eye", 2, "vanguard_cogwheel", 2, "geis_capacitor", 4]));
	return f.dot;
});

// /datum/clockwork_scripture/memory_allocation/proc/check_special_requirements  (code/game/gamemodes/clock_cult/clock_scriptures/scripture_applications.dm:109)
rt.def("/datum/clockwork_scripture/memory_allocation/proc/check_special_requirements", function check_special_requirements(f: Frame) {
	let M: Value = null;
	let $e: any;
	f.vars = () => [M, $e];
	M = null;
	rt.forList(f, 0, rt.gl("all_clockwork_mobs"), T("/mob/living/simple_animal/hostile/clockwork/marauder"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (isEqual(rt.fv(f, "host", live(M)), rt.sv(f, "invoker"))) {
			rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "invoker"), "<span class='warning'>You can only house one marauder at a time!</span>"]);
			return 0;
		}
	}
	rt.endFor(f, 0);
	return 1;
});

// /datum/clockwork_scripture/memory_allocation/proc/scripture_effects  (code/game/gamemodes/clock_cult/clock_scriptures/scripture_applications.dm:116)  may sleep
rt.def("/datum/clockwork_scripture/memory_allocation/proc/scripture_effects", function* scripture_effects(f: Frame) {
	return (yield* g.srcCall(f, "create_marauder"));
}, true);

// /datum/clockwork_scripture/memory_allocation/proc/create_marauder  (code/game/gamemodes/clock_cult/clock_scriptures/scripture_applications.dm:119)  may sleep
rt.def("/datum/clockwork_scripture/memory_allocation/proc/create_marauder", function* create_marauder(f: Frame) {
	let marauder_candidates: Value = null, theghost: Value = null, M: Value = null;
	f.vars = () => [marauder_candidates, theghost, M];
	yield* g.callName(f, rt.sv(f, "invoker"), "visible_message", [fmt("<span class='warning'>A purple tendril appears from ＀'s ＀ and impales itself in ＀ forehead!</span>", [rt.sv(f, "invoker"), rt.fv(f, "name", rt.sv(f, "slab")), (yield* g.callName(f, rt.sv(f, "invoker"), "p_their", []))]), fmt("<span class='sevtug'>A tendril flies from ＀ into your forehead. You begin waiting while it painfully rearranges your thought pattern...</span>", [rt.sv(f, "slab")])]);
	rt.setFv(f, "notransform", rt.sv(f, "invoker"), 1);
	rt.setFv(f, "busy", rt.sv(f, "slab"), "Thought Modification in progress");
	if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, rt.sv(f, "invoker"), null, 50, "target", rt.sv(f, "invoker")], rt.Args.Named)))) {
		yield* g.callName(f, rt.sv(f, "invoker"), "visible_message", [fmt("<span class='warning'>The tendril, covered in blood, retracts from ＀'s head and back into the ＀!</span>", [rt.sv(f, "invoker"), rt.fv(f, "name", rt.sv(f, "slab"))]), "<span class='userdanger'>Total agony overcomes you as the tendril is forced out early!</span>"]);
		rt.setFv(f, "notransform", rt.sv(f, "invoker"), 0);
		yield* g.callName(f, rt.sv(f, "invoker"), "Knockdown", [100]);
		yield* g.callName(f, rt.sv(f, "invoker"), "apply_damage", [10, "brute", "head"]);
		rt.setFv(f, "busy", rt.sv(f, "slab"), null);
		return 0;
	}
	yield* g.call(f, P("/proc/clockwork_say"), null, [rt.sv(f, "invoker"), (yield* g.call(f, P("/proc/text2ratvar"), null, ["...the mind made..."]))]);
	rt.setFv(f, "notransform", rt.sv(f, "invoker"), 0);
	rt.setFv(f, "busy", rt.sv(f, "slab"), "Marauder Selection in progress");
	if (!truthy((yield* g.srcCall(f, "check_special_requirements")))) {
		return 0;
	}
	yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "invoker"), "<span class='warning'>The tendril shivers slightly as it selects a marauder...</span>"]);
	marauder_candidates = (yield* g.call(f, P("/proc/pollGhostCandidates"), null, [fmt("Do you want to play as the clockwork marauder of ＀?", [rt.fv(f, "real_name", rt.sv(f, "invoker"))]), "servant of Ratvar", null, 0, 50, "clockwork_marauder"]));
	if (!truthy((yield* g.srcCall(f, "check_special_requirements")))) {
		return 0;
	}
	if (!truthy(rt.len(f, live(marauder_candidates)))) {
		yield* g.callName(f, rt.sv(f, "invoker"), "visible_message", [fmt("<span class='warning'>The tendril retracts from ＀'s head, sealing the entry wound as it does so!</span>", [rt.sv(f, "invoker")]), "<span class='warning'>The tendril was unsuccessful! Perhaps you should try again another time.</span>"]);
		return 0;
	}
	yield* g.call(f, P("/proc/clockwork_say"), null, [rt.sv(f, "invoker"), (yield* g.call(f, P("/proc/text2ratvar"), null, ["...sword and shield!"]))]);
	theghost = rt.op(f, "PickUnweighted", [1], [live(marauder_candidates)]);
	rt.setFv(f, "key", (M = (yield* g.new_(f, T("/mob/living/simple_animal/hostile/clockwork/marauder"), [rt.sv(f, "invoker")]))), rt.fv(f, "key", live(theghost)));
	yield* g.callName(f, live(M), "bind_to_host", [rt.sv(f, "invoker")]);
	yield* g.callName(f, rt.sv(f, "invoker"), "visible_message", [fmt("<span class='warning'>The tendril retracts from ＀'s head, sealing the entry wound as it does so!</span>", [rt.sv(f, "invoker")]), fmt("<span class='sevtug'>＀, a clockwork marauder, has taken up residence in your mind. Communicate with it via the \"Linked Minds\" action button.</span>", [rt.fv(f, "true_name", live(M))])]);
	return 1;
}, true);

rt.type(1205, "/datum/clockwork_scripture/create_object/anima_fragment", "/datum/clockwork_scripture/create_object", {
	descname: "Fast Soul Vessel Shell",
	name: "Anima Fragment",
	desc: "Creates a large shell fitted for soul vessels. Adding an active soul vessel to it results in a powerful construct with decent health and slight regeneration, notable melee power, and exceptional speed, though taking damage will temporarily slow it down.",
	invocations: null,
	channel_time: 80,
	consumed_components: null,
	creator_message: "<span class='brass'>You form an anima fragment, a powerful soul vessel receptacle.</span>",
	observer_message: "<span class='warning'>The slab disgorges a puddle of black metal that expands and forms into a strange shell!</span>",
	usage_tip: "Useless without a soul vessel and should not be created without one.",
	tier: "Application",
	primary_component: "replicant_alloy",
	sort_priority: 4,
	quickbind: 1,
	quickbind_desc: "Creates a Fragment Shell, which produces an Anima Fragment when filled with a Soul Vessel.",
	object_path: rt.typePath("/obj/structure/destructible/clockwork/shell/fragment"),
});

// /datum/clockwork_scripture/create_object/anima_fragment/proc/<init>  (code/game/gamemodes/clock_cult/clock_scriptures/scripture_applications.dm:162)
rt.def("/datum/clockwork_scripture/create_object/anima_fragment/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "invocations", rt.list("Call forth...", "...the soldiers of Armorer."));
	rt.setSv(f, "consumed_components", rt.alist(f, ["belligerent_eye", 2, "vanguard_cogwheel", 2, "replicant_alloy", 4]));
	return f.dot;
});

rt.type(1206, "/datum/clockwork_scripture/create_object/sigil_of_transmission", "/datum/clockwork_scripture/create_object", {
	descname: "Structure Battery",
	name: "Sigil of Transmission",
	desc: "Places a sigil that stores energy to power clockwork structures.",
	invocations: null,
	channel_time: 70,
	consumed_components: null,
	whispered: 1,
	creator_message: "<span class='brass'>A sigil silently appears below you. It will automatically power clockwork structures near it.</span>",
	usage_tip: "Cyborgs can charge from this sigil by remaining over it for 5 seconds.",
	tier: "Application",
	one_per_tile: 1,
	primary_component: "hierophant_ansible",
	sort_priority: 5,
	quickbind: 1,
	quickbind_desc: "Creates a Sigil of Transmission, which stores power for clockwork structures.",
	object_path: rt.typePath("/obj/effect/clockwork/sigil/transmission"),
});

// /datum/clockwork_scripture/create_object/sigil_of_transmission/proc/<init>  (code/game/gamemodes/clock_cult/clock_scriptures/scripture_applications.dm:181)
rt.def("/datum/clockwork_scripture/create_object/sigil_of_transmission/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "invocations", rt.list("Divinity...", "...power our creations!"));
	rt.setSv(f, "consumed_components", rt.alist(f, ["vanguard_cogwheel", 2, "geis_capacitor", 2, "hierophant_ansible", 4]));
	return f.dot;
});

rt.type(1207, "/datum/clockwork_scripture/create_object/interdiction_lens", "/datum/clockwork_scripture/create_object", {
	descname: "Structure, Area Sabotage, Power Generator",
	name: "Interdiction Lens",
	desc: "Creates a clockwork totem that sabotages nearby machinery and funnels drained power into nearby Sigils of Transmission or the area's APC.",
	invocations: null,
	channel_time: 80,
	consumed_components: null,
	creator_message: "<span class='brass'>You form an interdiction lens, which disrupts cameras and radios and drains power.</span>",
	observer_message: "<span class='warning'>A brass totem rises from the ground, a purple gem appearing in its center!</span>",
	invokers_required: 2,
	multiple_invokers_used: 1,
	usage_tip: "If it fails to funnel power into a nearby Sigil of Transmission or the area's APC and fails to disable even one thing, it will disable itself for two minutes.",
	tier: "Application",
	one_per_tile: 1,
	primary_component: "belligerent_eye",
	sort_priority: 6,
	quickbind: 1,
	quickbind_desc: "Creates an Interdiction Lens, which drains power into nearby Sigils of Transmission.",
	object_path: rt.typePath("/obj/structure/destructible/clockwork/powered/interdiction_lens"),
});

// /datum/clockwork_scripture/create_object/interdiction_lens/proc/<init>  (code/game/gamemodes/clock_cult/clock_scriptures/scripture_applications.dm:201)
rt.def("/datum/clockwork_scripture/create_object/interdiction_lens/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "invocations", rt.list("May this totem...", "...shroud the false suns!"));
	rt.setSv(f, "consumed_components", rt.alist(f, ["belligerent_eye", 5, "replicant_alloy", 2, "hierophant_ansible", 2]));
	return f.dot;
});

rt.type(1208, "/datum/clockwork_scripture/create_object/prolonging_prism", "/datum/clockwork_scripture/create_object", {
	descname: "Powered Structure, Delay Emergency Shuttles",
	name: "Prolonging Prism",
	desc: "Creates a mechanized prism which will delay the arrival of an emergency shuttle by 2 minutes at a massive power cost.",
	invocations: null,
	channel_time: 80,
	consumed_components: null,
	creator_message: "<span class='brass'>You form a prolonging prism, which will delay the arrival of an emergency shuttle at a massive power cost.</span>",
	observer_message: "<span class='warning'>An onyx prism forms in midair and sprouts tendrils to support itself!</span>",
	invokers_required: 2,
	multiple_invokers_used: 1,
	usage_tip: "The power cost to delay a shuttle increases based on CV and the number of times activated.",
	tier: "Application",
	one_per_tile: 1,
	primary_component: "vanguard_cogwheel",
	sort_priority: 7,
	quickbind: 1,
	quickbind_desc: "Creates a Prolonging Prism, which will delay the arrival of an emergency shuttle by 2 minutes at a massive power cost.",
	object_path: rt.typePath("/obj/structure/destructible/clockwork/powered/prolonging_prism"),
});

// /datum/clockwork_scripture/create_object/prolonging_prism/proc/<init>  (code/game/gamemodes/clock_cult/clock_scriptures/scripture_applications.dm:223)
rt.def("/datum/clockwork_scripture/create_object/prolonging_prism/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "invocations", rt.list("May this prism...", "...grant us time to enact his will!"));
	rt.setSv(f, "consumed_components", rt.alist(f, ["vanguard_cogwheel", 5, "geis_capacitor", 2, "replicant_alloy", 2]));
	return f.dot;
});

// /datum/clockwork_scripture/create_object/prolonging_prism/proc/check_special_requirements  (code/game/gamemodes/clock_cult/clock_scriptures/scripture_applications.dm:238)
rt.def("/datum/clockwork_scripture/create_object/prolonging_prism/proc/check_special_requirements", function check_special_requirements(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	if ((((isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "docked") || isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "igniting")) || isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "stranded")) || isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "escape"))) {
		rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "invoker"), "<span class='inathneq'>\"It is too late to construct one of these, champion.\"</span>"]);
		return 0;
	}
	if ((!truthy((_T = rt.getStep(f, rt.sv(f, "invoker"), 0))) || !isEqual(rt.fv(f, "z", live(_T)), 2))) {
		rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "invoker"), "<span class='inathneq'>\"You must be on the station to construct one of these, champion.\"</span>"]);
		return 0;
	}
	return rt.callSuper(f, [], rt.Args.Same);
});

rt.type(1209, "/datum/clockwork_scripture/create_object/mania_motor", "/datum/clockwork_scripture/create_object", {
	descname: "Powered Structure, Area Denial",
	name: "Mania Motor",
	desc: "Creates a mania motor which causes minor damage and a variety of negative mental effects in nearby non-Servant humans, potentially up to and including conversion.",
	invocations: null,
	channel_time: 80,
	consumed_components: null,
	creator_message: "<span class='brass'>You form a mania motor, which causes minor damage and negative mental effects in non-Servants.</span>",
	observer_message: "<span class='warning'>A two-pronged machine rises from the ground!</span>",
	invokers_required: 2,
	multiple_invokers_used: 1,
	usage_tip: "It will also cure hallucinations and brain damage in nearby Servants.",
	tier: "Application",
	one_per_tile: 1,
	primary_component: "geis_capacitor",
	sort_priority: 8,
	quickbind: 1,
	quickbind_desc: "Creates a Mania Motor, which causes minor damage and negative mental effects in non-Servants.",
	object_path: rt.typePath("/obj/structure/destructible/clockwork/powered/mania_motor"),
});

// /datum/clockwork_scripture/create_object/mania_motor/proc/<init>  (code/game/gamemodes/clock_cult/clock_scriptures/scripture_applications.dm:255)
rt.def("/datum/clockwork_scripture/create_object/mania_motor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "invocations", rt.list("May this transmitter...", "...break the will of all who oppose us!"));
	rt.setSv(f, "consumed_components", rt.alist(f, ["geis_capacitor", 5, "replicant_alloy", 2, "hierophant_ansible", 2]));
	return f.dot;
});

rt.type(1210, "/datum/clockwork_scripture/create_object/tinkerers_daemon", "/datum/clockwork_scripture/create_object", {
	descname: "Powered Structure, Component Generator",
	name: "Tinkerer's Daemon",
	desc: "Creates a tinkerer's daemon which can rapidly collect components. It will only function if it has sufficient power, active daemons are outnumbered by Servants by a ratio of 5:1, and there is at least one existing cache.",
	invocations: null,
	channel_time: 80,
	consumed_components: null,
	creator_message: "<span class='brass'>You form a tinkerer's daemon which can rapidly collect components at a power cost.</span>",
	invokers_required: 2,
	multiple_invokers_used: 1,
	usage_tip: "Vital to your success!",
	tier: "Application",
	one_per_tile: 1,
	primary_component: "replicant_alloy",
	sort_priority: 9,
	quickbind: 1,
	quickbind_desc: "Creates a Tinkerer's Daemon, which can rapidly collect components for power.",
	object_path: rt.typePath("/obj/structure/destructible/clockwork/powered/tinkerers_daemon"),
});

// /datum/clockwork_scripture/create_object/tinkerers_daemon/proc/<init>  (code/game/gamemodes/clock_cult/clock_scriptures/scripture_applications.dm:278)
rt.def("/datum/clockwork_scripture/create_object/tinkerers_daemon/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "invocations", rt.list("May this generator...", "...collect Engine parts that yet hold greatness!"));
	rt.setSv(f, "consumed_components", rt.alist(f, ["belligerent_eye", 2, "geis_capacitor", 2, "replicant_alloy", 5]));
	return f.dot;
});

rt.type(1211, "/datum/clockwork_scripture/create_object/clockwork_obelisk", "/datum/clockwork_scripture/create_object", {
	descname: "Powered Structure, Teleportation Hub",
	name: "Clockwork Obelisk",
	desc: "Creates a clockwork obelisk that can broadcast messages over the Hierophant Network or open a Spatial Gateway to any living Servant or clockwork obelisk.",
	invocations: null,
	channel_time: 80,
	consumed_components: null,
	creator_message: "<span class='brass'>You form a clockwork obelisk which can broadcast messages or produce Spatial Gateways.</span>",
	observer_message: "<span class='warning'>A brass obelisk appears hanging in midair!</span>",
	invokers_required: 2,
	multiple_invokers_used: 1,
	usage_tip: "Producing a gateway has a high power cost. Gateways to or between clockwork obelisks receive double duration and uses.",
	tier: "Application",
	one_per_tile: 1,
	primary_component: "hierophant_ansible",
	sort_priority: 10,
	quickbind: 1,
	quickbind_desc: "Creates a Clockwork Obelisk, which can send messages or open Spatial Gateways with power.",
	object_path: rt.typePath("/obj/structure/destructible/clockwork/powered/clockwork_obelisk"),
});

// /datum/clockwork_scripture/create_object/clockwork_obelisk/proc/<init>  (code/game/gamemodes/clock_cult/clock_scriptures/scripture_applications.dm:299)
rt.def("/datum/clockwork_scripture/create_object/clockwork_obelisk/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "invocations", rt.list("May this obelisk...", "...take us to all places!"));
	rt.setSv(f, "consumed_components", rt.alist(f, ["belligerent_eye", 2, "vanguard_cogwheel", 2, "hierophant_ansible", 5]));
	return f.dot;
});
