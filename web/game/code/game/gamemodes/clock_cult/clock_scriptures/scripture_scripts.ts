// Based on /tg/station's code/game/gamemodes/clock_cult/clock_scriptures/scripture_scripts.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


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

// scripture_scripts.dm:12
rt.def("/datum/clockwork_scripture/create_object/ocular_warden/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.invocations = list("Guardians...", "...of the Engine...", "...defend us!");
	this.consumed_components = rt.alist(f, ["belligerent_eye", 2, "replicant_alloy", 1]);
	return f.dot;
});

// scripture_scripts.dm:26
rt.def("/datum/clockwork_scripture/create_object/ocular_warden/proc/check_special_requirements", function check_special_requirements(f: Frame) {
	let W: Value = null;
	for (W of each(range(OCULAR_WARDEN_EXCLUSION_RANGE, this.invoker), T("/obj/structure/destructible/clockwork/ocular_warden"))) {
		to_chat(this.invoker, "<span class='neovgre'>You sense another ocular warden too near this location. Placing another this close would cause them to fight.</span>");
		return 0;
	}
	return parent_proc();
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

// scripture_scripts.dm:39
rt.def("/datum/clockwork_scripture/create_object/cogscarab/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.invocations = list("Call forth...", "...the workers of Armorer.");
	this.consumed_components = rt.alist(f, ["belligerent_eye", 2, "hierophant_ansible", 1]);
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

// scripture_scripts.dm:59
rt.def("/datum/clockwork_scripture/create_object/vitality_matrix/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.invocations = list("Divinity...", "...steal their life...", "...for these shells!");
	this.consumed_components = rt.alist(f, ["belligerent_eye", 1, "vanguard_cogwheel", 2]);
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

// scripture_scripts.dm:80
rt.def("/datum/clockwork_scripture/channeled/mending_mantra/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.chant_invocations = list("Mend our dents!", "Heal our scratches!", "Repair our gears!");
	this.consumed_components = rt.alist(f, ["vanguard_cogwheel", 2, "replicant_alloy", 1]);
	return f.dot;
});

// scripture_scripts.dm:107
rt.def("/datum/clockwork_scripture/channeled/mending_mantra/proc/chant_effects", function* chant_effects(f: Frame, chant_number: Value) {
	let _T: Value = null, M: Value = null, S: Value = null, i: Value = null, H: Value = null, heal_ticks: Value = null, I: Value = null, i_5: Value = null, C: Value = null;
	let $e: any;
	for (M of each(range(7, this.invoker), T("/atom/movable"))) {
		if (rt.istype(M, T("/mob/living"))) {
			if (rt.istype(M, T("/mob/living/simple_animal/hostile/clockwork")) || rt.istype(M, T("/mob/living/simple_animal/drone/cogscarab"))) {
				if ((S = M).health == S.maxHealth || S.stat == 2) {
					continue;
				}
				_T = rt.getStep(f, M, 0);
				i = null;
				rt.forRange(f, 1, 1, this.heal_attempts, 1);
				while (($e = rt.next(f, 1)) !== undefined) {
					i = $e;
					if (S.health < S.maxHealth) {
						yield* S.adjustHealth(-this.heal_amount);
						yield* new_(T("/obj/effect/temp_visual/heal"), _T, "#1E8CE1");
						if (i == this.heal_attempts && S.health >= S.maxHealth) {
							to_chat(S, `<span class='inathneq'>"${text2ratvar(pick(GLOB.heal_finish_messages))}"</span>`);
							break;
						}
					} else {
						to_chat(S, `<span class='inathneq'>"${text2ratvar(pick(GLOB.heal_finish_messages))}"</span>`);
						break;
					}
				}
				rt.endFor(f, 1);
			} else if (rt.istype(M, T("/mob/living/silicon"))) {
				if ((S = M).health == S.maxHealth || S.stat == 2 || !is_servant_of_ratvar(S)) {
					continue;
				}
				_T = rt.getStep(f, M, 0);
				i = null;
				rt.forRange(f, 1, 1, this.heal_attempts, 1);
				while (($e = rt.next(f, 1)) !== undefined) {
					i = $e;
					if (S.health < S.maxHealth) {
						yield* S.heal_ordered_damage(this.heal_amount, GLOB.damage_heal_order);
						yield* new_(T("/obj/effect/temp_visual/heal"), _T, "#1E8CE1");
						if (i == this.heal_attempts && S.health >= S.maxHealth) {
							to_chat(S, `<span class='inathneq'>"${text2ratvar(pick(GLOB.heal_finish_messages))}"</span>`);
							break;
						}
					} else {
						to_chat(S, `<span class='inathneq'>"${text2ratvar(pick(GLOB.heal_finish_messages))}"</span>`);
						break;
					}
				}
				rt.endFor(f, 1);
			} else if (rt.istype(M, T("/mob/living/carbon/human"))) {
				if ((H = M).health == H.maxHealth || H.stat == 2 || !is_servant_of_ratvar(H)) {
					continue;
				}
				_T = rt.getStep(f, M, 0);
				heal_ticks = 0;
				if (is_type_in_typecache((I = H.get_item_by_slot(slot_wear_suit)), GLOB.ratvarian_armor_typecache)) {
					heal_ticks++;
				}
				if (is_type_in_typecache((I = H.get_item_by_slot(slot_head)), GLOB.ratvarian_armor_typecache)) {
					heal_ticks++;
				}
				if (is_type_in_typecache((I = H.get_item_by_slot(slot_gloves)), GLOB.ratvarian_armor_typecache)) {
					heal_ticks++;
				}
				if (is_type_in_typecache((I = H.get_item_by_slot(slot_shoes)), GLOB.ratvarian_armor_typecache)) {
					heal_ticks++;
				}
				if (heal_ticks) {
					i_5 = null;
					rt.forRange(f, 1, 1, heal_ticks, 1);
					while (($e = rt.next(f, 1)) !== undefined) {
						i_5 = $e;
						if (H.health < H.maxHealth) {
							yield* H.heal_ordered_damage(this.heal_amount, GLOB.damage_heal_order);
							yield* new_(T("/obj/effect/temp_visual/heal"), _T, "#1E8CE1");
							if (i_5 == heal_ticks && H.health >= H.maxHealth) {
								to_chat(H, `<span class='inathneq'>"${text2ratvar(pick(GLOB.heal_finish_messages))}"</span>`);
								break;
							}
						} else {
							to_chat(H, `<span class='inathneq'>"${text2ratvar(pick(GLOB.heal_finish_messages))}"</span>`);
							break;
						}
					}
					rt.endFor(f, 1);
				}
			}
		} else if (is_type_in_typecache(M, GLOB.heal_target_typecache)) {
			if ((C = M).obj_integrity == C.max_integrity || rt.istype(C, T("/obj/structure/destructible/clockwork")) && !C.can_be_repaired) {
				continue;
			}
			_T = rt.getStep(f, M, 0);
			i = null;
			rt.forRange(f, 1, 1, this.heal_attempts, 1);
			while (($e = rt.next(f, 1)) !== undefined) {
				i = $e;
				if (C.obj_integrity < C.max_integrity) {
					C.obj_integrity = min(C.obj_integrity + 5, C.max_integrity);
					yield* C.update_icon();
					yield* new_(T("/obj/effect/temp_visual/heal"), _T, "#1E8CE1");
				} else {
					break;
				}
			}
			rt.endFor(f, 1);
		}
	}
	yield* new_(T("/obj/effect/temp_visual/ratvar/mending_mantra"), rt.getStep(f, this.invoker, 0));
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

// scripture_scripts.dm:191
rt.def("/datum/clockwork_scripture/create_object/sigil_of_submission/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.invocations = list("Divinity, enlighten...", "...those who trespass here!");
	this.consumed_components = rt.alist(f, ["belligerent_eye", 1, "geis_capacitor", 2]);
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

// scripture_scripts.dm:211
rt.def("/datum/clockwork_scripture/create_object/soul_vessel/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.invocations = list("Herd the souls of...", "...the blasphemous damned!");
	this.consumed_components = rt.alist(f, ["vanguard_cogwheel", 1, "geis_capacitor", 2]);
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

// scripture_scripts.dm:231
rt.def("/datum/clockwork_scripture/create_object/replica_fabricator/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.invocations = list("With this device...", "...his presence shall be made known.");
	this.consumed_components = rt.alist(f, ["geis_capacitor", 1, "replicant_alloy", 2]);
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

// scripture_scripts.dm:252
rt.def("/datum/clockwork_scripture/function_call/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.invocations = list("Grant me...", "...the might of brass!");
	this.consumed_components = rt.alist(f, ["replicant_alloy", 2, "hierophant_ansible", 1]);
	return f.dot;
});

// scripture_scripts.dm:260
rt.def("/datum/clockwork_scripture/function_call/proc/check_special_requirements", function check_special_requirements(f: Frame) {
	let F: Value = null;
	for (F of each(this.invoker.actions, T("/datum/action/innate/function_call"))) {
		to_chat(this.invoker, "<span class='warning'>You have already bound a Ratvarian spear to yourself!</span>");
		return 0;
	}
	return this.invoker.can_hold_items();
});

// scripture_scripts.dm:266
rt.def("/datum/clockwork_scripture/function_call/proc/scripture_effects", function* scripture_effects(f: Frame) {
	let F: Value = null;
	this.invoker.visible_message(`<span class='warning'>A shimmer of yellow light infuses ${this.invoker}!</span>`, "<span class='brass'>You bind a Ratvarian spear to yourself. Use the \"Function Call\" action button to call it forth.</span>");
	yield* (F = (yield* new_(T("/datum/action/innate/function_call")))).Grant(this.invoker);
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

// scripture_scripts.dm:284
rt.def("/datum/action/innate/function_call/proc/IsAvailable", function IsAvailable(f: Frame) {
	if (!is_servant_of_ratvar(this.owner) || this.cooldown > rt.worldTime(f)) {
		return 0;
	}
	return parent_proc();
});

// scripture_scripts.dm:289
rt.def("/datum/action/innate/function_call/proc/Activate", function* Activate(f: Frame) {
	if (!this.owner.get_empty_held_indexes()) {
		to_chat(f.usr, "<span class='warning'>You need an empty hand to call forth your spear!</span>");
		return 0;
	}
	this.owner.visible_message(`<span class='warning'>A strange spear materializes in ${this.owner}'s hands!</span>`, "<span class='brass'>You call forth your spear!</span>");
	let R: Value = (yield* new_(T("/obj/item/clockwork/ratvarian_spear"), rt.getStep(f, f.usr, 0)));
	yield* this.owner.put_in_hands(R);
	if (!GLOB.ratvar_awakens) {
		to_chat(this.owner, "<span class='warning'>Your spear begins to break down in this plane of existence. You can't use it for long!</span>");
	}
	this.cooldown = this.base_cooldown + rt.worldTime(f);
	yield* this.owner.update_action_buttons_icon();
	yield* addtimer((yield* new_(T("/datum/callback"), this.owner, P("/mob/proc/update_action_buttons_icon"))), this.base_cooldown);
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

// scripture_scripts.dm:311
rt.def("/datum/clockwork_scripture/spatial_gateway/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.invocations = list("Spatial Gateway...", "...activate!");
	this.consumed_components = rt.alist(f, ["vanguard_cogwheel", 1, "hierophant_ansible", 2]);
	return f.dot;
});

// scripture_scripts.dm:322
rt.def("/datum/clockwork_scripture/spatial_gateway/proc/check_special_requirements", function check_special_requirements(f: Frame) {
	let L: Value = null, O: Value = null;
	if (!isturf(this.invoker.loc)) {
		to_chat(this.invoker, "<span class='warning'>You must not be inside an object to use this scripture!</span>");
		return 0;
	}
	let other_servants: Value = 0;
	for (L of each(GLOB.living_mob_list, T("/mob/living"))) {
		if (is_servant_of_ratvar(L) && !L.stat && L != this.invoker) {
			other_servants++;
		}
	}
	for (O of each(GLOB.all_clockwork_objects, T("/obj/structure/destructible/clockwork/powered/clockwork_obelisk"))) {
		if (O.anchored) {
			other_servants++;
		}
	}
	if (!other_servants) {
		to_chat(this.invoker, "<span class='warning'>There are no other conscious servants or anchored clockwork obelisks!</span>");
		return 0;
	}
	return 1;
});

// scripture_scripts.dm:340
rt.def("/datum/clockwork_scripture/spatial_gateway/proc/scripture_effects", function* scripture_effects(f: Frame) {
	let L: Value = null;
	let portal_uses: Value = 0;
	let duration: Value = 0;
	for (L of each(range(1, this.invoker), T("/mob/living"))) {
		if (!L.stat && is_servant_of_ratvar(L)) {
			portal_uses++;
			duration += 40;
		}
	}
	if (GLOB.ratvar_awakens) {
		portal_uses = max(portal_uses, 100);
		duration = max(duration, 100);
	}
	return (yield* this.slab.procure_gateway(this.invoker, duration, portal_uses));
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

// scripture_scripts.dm:360
rt.def("/datum/clockwork_scripture/channeled/volt_blaster/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.invocations = list("Amperage...", "...grant me your power!");
	this.chant_invocations = list("Use charge to kill!", "Slay with power!", "Hunt with energy!");
	this.consumed_components = rt.alist(f, ["geis_capacitor", 1, "hierophant_ansible", 2]);
	return f.dot;
});

// scripture_scripts.dm:371
rt.def("/datum/clockwork_scripture/channeled/volt_blaster/proc/chant_effects", function* chant_effects(f: Frame, chant_number: Value) {
	let ray: Value = null;
	this.slab.busy = null;
	(ray = (yield* new_(T("/datum/clockwork_scripture/ranged_ability/volt_ray")))).slab = this.slab;
	ray.invoker = this.invoker;
	let _T: Value = rt.getStep(f, this.invoker, 0);
	if (!(yield* ray.run_scripture()) && this.slab && this.invoker) {
		if (this.can_recite() && _T == rt.getStep(f, this.invoker, 0)) {
			to_chat(this.invoker, `<span class='nzcrentr'>"${text2ratvar(pick(GLOB.nzcrentr_insults))}"</span>`);
		} else {
			return 0;
		}
	}
	return 1;
}, true);
