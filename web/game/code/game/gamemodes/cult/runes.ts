// Based on /tg/station's code/game/gamemodes/cult/runes.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g, fmt } = rt;


// runes.dm:1
rt.def("/datum/controller/global_vars/proc/InitGlobalsacrificed", function InitGlobalsacrificed(f: Frame) {
	GLOB.sacrificed = list();
	this.gvars_datum_init_order += "sacrificed";
	return f.dot;
});

// runes.dm:2
rt.def("/datum/controller/global_vars/proc/InitGlobalrune_types", function InitGlobalrune_types(f: Frame) {
	GLOB.rune_types = null;
	this.gvars_datum_init_order += "rune_types";
	return f.dot;
});

// runes.dm:3
rt.def("/datum/controller/global_vars/proc/InitGlobalteleport_runes", function InitGlobalteleport_runes(f: Frame) {
	GLOB.teleport_runes = list();
	this.gvars_datum_init_order += "teleport_runes";
	return f.dot;
});

// runes.dm:4
rt.def("/datum/controller/global_vars/proc/InitGlobalwall_runes", function InitGlobalwall_runes(f: Frame) {
	GLOB.wall_runes = list();
	this.gvars_datum_init_order += "wall_runes";
	return f.dot;
});

rt.type(11425, "/obj/effect/rune", "/obj/effect", {
	cultist_name: "basic rune",
	cultist_desc: "a basic rune with no function.",
	invocation: "Aiy ele-mayo!",
	req_cultists: 1,
	req_cultists_text: null,
	rune_in_use: 0,
	scribe_delay: 50,
	scribe_damage: 0.1,
	allow_excess_invokers: 0,
	invoke_damage: 0,
	construct_invoke: 1,
	req_keyword: 0,
	keyword: null,
	anchored: 1,
	name: "rune",
	desc: "An odd collection of symbols drawn in what seems to be blood.",
	icon: rt.rsc("icons/obj/rune.dmi"),
	icon_state: "1",
	resistance_flags: 50,
	layer: 2.5,
	color: "#FF0000",
});

// runes.dm:45
rt.def("/obj/effect/rune/proc/Initialize", function Initialize(f: Frame, mapload: Value, set_keyword: Value) {
	f.dot = parent_proc();
	if (!set_keyword) return f.dot;
	this.keyword = set_keyword;
	return f.dot;
}, false);

// runes.dm:50
rt.def("/obj/effect/rune/proc/examine", function examine(f: Frame, user: Value) {
	let $1: any;
	parent_proc();
	if (!(iscultist(user) || user.stat == 2)) return f.dot;
	to_chat(user, `<b>Name:</b> ${this.cultist_name}`);
	to_chat(user, `<b>Effects:</b> ${capitalize(this.cultist_desc)}`);
	let $0: any = user;
	if (this.req_cultists_text) {
		$1 = `${this.req_cultists_text}`;
	} else {
		$1 = `${this.req_cultists}`;
	}
	to_chat($0, `<b>Required Acolytes:</b> ${$1}`);
	if (!(this.req_keyword && this.keyword)) return f.dot;
	to_chat(user, `<b>Keyword:</b> ${this.keyword}`);
	return f.dot;
}, false);

// runes.dm:59
rt.def("/obj/effect/rune/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (rt.istype(I, T("/obj/item/weapon/tome")) && iscultist(user)) {
		to_chat(user, `<span class='notice'>You carefully erase the ${lowertext(this.cultist_name)} rune.</span>`);
		yield* qdel(this);
	} else {
		if (!rt.istype(I, T("/obj/item/weapon/nullrod"))) return f.dot;
		yield* user.say("BEGONE FOUL MAGIKS!!");
		to_chat(user, `<span class='danger'>You disrupt the magic of ${this} with ${I}.</span>`);
		yield* qdel(this);
	}
	return f.dot;
}, true);

// runes.dm:68
rt.def("/obj/effect/rune/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let invokers: Value = null;
	if (!iscultist(user)) {
		to_chat(user, `<span class='warning'>You aren't able to understand the words of ${this}.</span>`);
		return f.dot;
	}
	if (rt.len(f, (invokers = (yield* this.can_invoke(user)))) >= this.req_cultists) {
		yield* this.invoke(invokers);
	} else {
		yield* this.fail_invoke();
	}
	return f.dot;
}, true);

// runes.dm:78
rt.def("/obj/effect/rune/proc/attack_animal", function* attack_animal(f: Frame, M: Value) {
	if (!(rt.istype(M, T("/mob/living/simple_animal/shade")) || rt.istype(M, T("/mob/living/simple_animal/hostile/construct")))) return f.dot;
	if (this.construct_invoke || !iscultist(M)) {
		yield* this.attack_hand(M);
	} else {
		to_chat(M, "<span class='warning'>You are unable to invoke the rune!</span>");
	}
	return f.dot;
}, true);

// runes.dm:85
rt.def("/obj/effect/rune/proc/talismanhide", function talismanhide(f: Frame) {
	this.visible_message(`<span class='danger'>${this} fades away.</span>`);
	this.invisibility = 60;
	this.alpha = 100;
	return f.dot;
});

// runes.dm:91
rt.def("/obj/effect/rune/proc/talismanreveal", function talismanreveal(f: Frame) {
	this.invisibility = 0;
	this.visible_message(`<span class='danger'>${this} suddenly appears!</span>`);
	this.alpha = rt.initial(f, this, "alpha");
	return f.dot;
});

// runes.dm:106
rt.def("/obj/effect/rune/proc/can_invoke", function can_invoke(f: Frame, user: Value) {
	let L: Value = null, H: Value = null, i: Value = null, L_3: Value = null;
	let $e: any;
	let invokers: Value = list();
	let chanters: Value = list();
	if (user) {
		chanters += user;
		invokers += user;
	}
	if (this.req_cultists > 1 || this.allow_excess_invokers) {
		for (L of each(range(1, this), T("/mob/living"))) {
			if (iscultist(L)) {
				if (L == user) {
					continue;
				}
				if (rt.istype(L, T("/mob/living/carbon/human"))) {
					if (rt.bitAnd((H = L).disabilities, 2) || H.silent) {
						continue;
					}
				}
				if (L.stat) {
					continue;
				}
				invokers += L;
			}
		}
		if (rt.len(f, invokers) >= this.req_cultists) {
			invokers -= user;
			if (this.allow_excess_invokers) {
				chanters += invokers;
			} else {
				shuffle_inplace(invokers);
				rt.forRange(f, 0, 1, this.req_cultists, 1);
				while (($e = rt.next(f, 0)) !== undefined) {
					i = $e;
					if (L_3 = pick_n_take(invokers)) {
						chanters += L_3;
					}
				}
				rt.endFor(f, 0);
			}
		}
	}
	return chanters;
});

// runes.dm:137
rt.def("/obj/effect/rune/proc/invoke", function* invoke(f: Frame, invokers: Value) {
	let M: Value = null, L: Value = null;
	for (M of each(invokers)) {
		L = M;
		if (this.invocation) {
			yield* L.say(this.invocation, { language: T("/datum/language/common") });
		}
		if (this.invoke_damage) {
			yield* L.apply_damage(this.invoke_damage, "brute");
			to_chat(L, `<span class='cultitalic'>${this} saps your strength!</span>`);
		}
	}
	yield* this.do_invoke_glow();
	return f.dot;
}, true);

// runes.dm:148
rt.def("/obj/effect/rune/proc/do_invoke_glow", function* do_invoke_glow(f: Frame) {
	let oldtransform: Value = this.transform;
	rt.op(f, "Animate", [2, 8], [null, this, "transform", matrix() * 2, "alpha", 0, "time", 5]);
	yield* sleep(5);
	rt.op(f, "Animate", [2, 8], [null, this, "transform", oldtransform, "alpha", 255, "time", 0]);
	return f.dot;
}, true, { waitfor: false });

// runes.dm:155
rt.def("/obj/effect/rune/proc/fail_invoke", function* fail_invoke(f: Frame) {
	this.visible_message("<span class='warning'>The markings pulse with a small flash of red light, then fall dark.</span>");
	let oldcolor: Value = this.color;
	this.color = "#ff0000";
	rt.op(f, "Animate", [2, 6], [null, this, "color", oldcolor, "time", 5]);
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/atom/proc/update_atom_colour"))), 5);
	return f.dot;
}, true);

rt.type(11426, "/obj/effect/rune/malformed", "/obj/effect/rune", {
	cultist_name: "malformed rune",
	cultist_desc: "a senseless rune written in gibberish. No good can come from invoking this.",
	invocation: "Ra'sha yoka!",
	invoke_damage: 30,
});

// runes.dm:169
rt.def("/obj/effect/rune/malformed/proc/Initialize", function Initialize(f: Frame, mapload: Value, set_keyword: Value) {
	f.dot = parent_proc();
	this.icon_state = `${rand(1, 7)}`;
	this.color = rt.op(f, "Rgb", [1, 3], [rand(0, 255), rand(0, 255), rand(0, 255)]);
	return f.dot;
}, false);

// runes.dm:174
rt.def("/obj/effect/rune/malformed/proc/invoke", function* invoke(f: Frame, invokers: Value) {
	yield* parent_proc();
	yield* qdel(this);
	return f.dot;
}, true);

// runes.dm:178
rt.def("/mob/proc/null_rod_check", function null_rod_check(f: Frame) {
	let N: Value = null;
	if ((N = rt.locateIn(f, T("/obj/item/weapon/nullrod"), this)) && !GLOB.ratvar_awakens) {
		return N;
	}
	return 0;
});

// runes.dm:184
rt.def("/mob/proc/bible_check", function bible_check(f: Frame) {
	let B: Value = null;
	if (this.is_holding((B = rt.locateIn(f, T("/obj/item/weapon/storage/book/bible"), this)))) {
		return B;
	}
	return 0;
});

rt.type(11427, "/obj/effect/rune/imbue", "/obj/effect/rune", {
	cultist_name: "Create Talisman",
	cultist_desc: "transforms paper into powerful magic talismans.",
	invocation: "H'drak v'loso, mir'kanas verbot!",
	icon_state: "3",
	color: "#0000FF",
});

// runes.dm:198
rt.def("/obj/effect/rune/imbue/proc/invoke", function* invoke(f: Frame, invokers: Value) {
	let I: Value = null, J: Value = null, talisman_cult_name: Value = null;
	let user: Value = rt.index(invokers, 1);
	let papers_on_rune: Value = this.checkpapers();
	let possible_talismans: Value = list();
	if (!rt.len(f, papers_on_rune)) {
		to_chat(user, `<span class='cultitalic'>There must be a blank paper on top of ${this}!</span>`);
		yield* this.fail_invoke();
		log_game("Talisman Creation rune failed - no blank papers on rune");
		return f.dot;
	}
	if (this.rune_in_use) {
		to_chat(user, `<span class='cultitalic'>${this} can only support one ritual at a time!</span>`);
		yield* this.fail_invoke();
		log_game("Talisman Creation rune failed - already in use");
		return f.dot;
	}
	for (I of each(typesof(T("/obj/item/weapon/paper/talisman")) - T("/obj/item/weapon/paper/talisman") - T("/obj/item/weapon/paper/talisman/malformed") - T("/obj/item/weapon/paper/talisman/supply") - T("/obj/item/weapon/paper/talisman/supply/weak") - T("/obj/item/weapon/paper/talisman/summon_tome"))) {
		J = I;
		if (talisman_cult_name = rt.initial(f, J, "cultist_name")) {
			rt.setAt(possible_talismans, talisman_cult_name, J);
		}
	}
	let entered_talisman_name: Value = (yield* g.op(f, "Prompt", [1], [null, "Talisman Choices", "Choose a talisman to imbue.", user, possible_talismans]));
	let talisman_type: Value = rt.index(possible_talismans, entered_talisman_name);
	if (!this.Adjacent(user) || !this || !this || this.gc_destroyed || user.incapacitated() || this.rune_in_use || !talisman_type) {
		return f.dot;
	}
	if (!rt.len(f, (papers_on_rune = this.checkpapers()))) {
		to_chat(user, `<span class='cultitalic'>There must be a blank paper on top of ${this}!</span>`);
		yield* this.fail_invoke();
		log_game("Talisman Creation rune failed - no blank papers on rune");
		return f.dot;
	}
	let paper_to_imbue: Value = rt.index(papers_on_rune, 1);
	yield* parent_proc();
	this.visible_message("<span class='warning'>Dark power begins to channel into the paper!</span>");
	this.rune_in_use = 1;
	if (yield* do_after(user, rt.initial(f, talisman_type, "creation_time"), { target: paper_to_imbue })) {
		yield* new_(talisman_type, rt.getStep(f, this, 0));
		this.visible_message(`<span class='warning'>${this} glows with power, and bloody images form themselves on ${paper_to_imbue}.</span>`);
		yield* qdel(paper_to_imbue);
	}
	this.rune_in_use = 0;
	return f.dot;
}, true);

// runes.dm:240
rt.def("/obj/effect/rune/imbue/proc/checkpapers", function checkpapers(f: Frame) {
	let _P: Value = null;
	f.dot = list();
	for (_P of each(rt.getStep(f, this, 0), T("/obj/item/weapon/paper"))) {
		if (!_P.info && !rt.istype(_P, T("/obj/item/weapon/paper/talisman"))) {
			(f.dot = rt.modify(f.dot, _P, rt.bitOr));
		}
	}
	return f.dot;
});

rt.type(11428, "/obj/effect/rune/teleport", "/obj/effect/rune", {
	listkey: null,
	cultist_name: "Teleport",
	cultist_desc: "warps everything above it to another chosen teleport rune.",
	invocation: "Sas'so c'arta forbici!",
	req_keyword: 1,
	icon_state: "2",
	color: "#551A8B",
});

// runes.dm:255
rt.def("/obj/effect/rune/teleport/proc/Initialize", function Initialize(f: Frame, mapload: Value, set_keyword: Value) {
	f.dot = parent_proc();
	let A: Value = get_area(this);
	let locname: Value = rt.initial(f, A, "name");
	this.listkey = set_keyword ? `${set_keyword} ${locname}` : `${locname}`;
	GLOB.teleport_runes += this;
	return f.dot;
}, false);

// runes.dm:262
rt.def("/obj/effect/rune/teleport/proc/Destroy", function* Destroy(f: Frame) {
	GLOB.teleport_runes -= this;
	return (yield* parent_proc());
}, true);

// runes.dm:266
rt.def("/obj/effect/rune/teleport/proc/invoke", function* invoke(f: Frame, invokers: Value) {
	let R: Value = null, _T: Value = null, target: Value = null, A: Value = null;
	let $0: any, $1: any, $e: any;
	let user: Value = rt.index(invokers, 1);
	let potential_runes: Value = list();
	let teleportnames: Value = list();
	for (R of each(GLOB.teleport_runes)) {
		if ((_T = R) != this && _T.z <= ZLEVEL_SPACEMAX) {
			rt.setAt(potential_runes, avoid_assoc_duplicate_keys(_T.listkey, teleportnames), _T);
		}
	}
	if (!rt.len(f, potential_runes)) {
		to_chat(user, "<span class='warning'>There are no valid runes to teleport to!</span>");
		log_game("Teleport rune failed - no other teleport runes");
		yield* this.fail_invoke();
		return f.dot;
	}
	if (user.z > ZLEVEL_SPACEMAX) {
		to_chat(user, "<span class='cultitalic'>You are not in the right dimension!</span>");
		log_game("Teleport rune failed - user in away mission");
		yield* this.fail_invoke();
		return f.dot;
	}
	let input_rune_key: Value = (yield* g.op(f, "Prompt", [1], [null, "Rune to Teleport to", "Choose a rune to teleport to.", user, potential_runes]));
	let actual_selected_rune: Value = rt.index(potential_runes, input_rune_key);
	if (!this.Adjacent(user) || !this || !this || this.gc_destroyed || user.incapacitated() || !actual_selected_rune) {
		yield* this.fail_invoke();
		return f.dot;
	}
	let _T_5: Value = rt.getStep(f, this, 0);
	if (is_blocked_turf((target = rt.getStep(f, actual_selected_rune, 0)), 1)) {
		to_chat(user, "<span class='warning'>The target rune is blocked. Attempting to teleport to it would be massively unwise.</span>");
		yield* this.fail_invoke();
		return f.dot;
	}
	let movedsomething: Value = 0;
	let moveuserlater: Value = 0;
	for (A of each(_T_5, T("/atom/movable"))) {
		if (A == user) {
			moveuserlater = 1;
			movedsomething = 1;
			continue;
		}
		if (!A.anchored) {
			movedsomething = 1;
			yield* A.forceMove(target);
		}
	}
	if (movedsomething) {
		yield* parent_proc();
		this.visible_message("<span class='warning'>There is a sharp crack of inrushing air, and everything above the rune disappears!</span>", null, "<i>You hear a sharp crack.</i>");
		$0 = user;
		if (moveuserlater) {
			$1 = "r vision blurs, and you suddenly appear somewhere else";
		} else {
			$1 = " send everything above the rune away";
		}
		to_chat($0, `<span class='cult'>You${$1}.</span>`);
		if (moveuserlater) {
			yield* user.forceMove(target);
		}
		target.visible_message("<span class='warning'>There is a boom of outrushing air as something appears above the rune!</span>", null, "<i>You hear a boom.</i>");
	} else {
		yield* this.fail_invoke();
	}
	return f.dot;
}, true);

rt.type(11429, "/obj/effect/rune/convert", "/obj/effect/rune", {
	cultist_name: "Offer",
	cultist_desc: "offers a noncultist above it to Nar-Sie, either converting them or sacrificing them.",
	req_cultists_text: "2 for conversion, 3 for living sacrifices and sacrifice targets.",
	invocation: "Mah'weyh pleggh at e'ntrath!",
	req_cultists: 1,
	allow_excess_invokers: 1,
	rune_in_use: 0,
	icon_state: "3",
	color: "#FFFFFF",
});

// runes.dm:337
rt.def("/obj/effect/rune/convert/proc/invoke", function* invoke(f: Frame, invokers: Value) {
	let M: Value = null;
	if (this.rune_in_use) {
		return f.dot;
	}
	let myriad_targets: Value = list();
	let _T: Value = rt.getStep(f, this, 0);
	for (M of each(_T, T("/mob/living"))) {
		if (!iscultist(M)) {
			(myriad_targets = rt.modify(myriad_targets, M, rt.bitOr));
		}
	}
	if (!rt.len(f, myriad_targets)) {
		yield* this.fail_invoke();
		log_game("Offer rune failed - no eligible targets");
		return f.dot;
	}
	this.rune_in_use = 1;
	this.visible_message(`<span class='warning'>${this} pulses blood red!</span>`);
	let oldcolor: Value = this.color;
	this.color = "#7D1717";
	let L: Value = pick(myriad_targets);
	let is_clock: Value = is_servant_of_ratvar(L);
	let is_convertable: Value = is_convertable_to_cult(L);
	if (L.stat != 2 && (is_clock || is_convertable)) {
		this.invocation = "Mah'weyh pleggh at e'ntrath!";
		yield* parent_proc();
		if (is_clock) {
			L.visible_message(`<span class='warning'>${L}'s eyes glow a defiant yellow!</span>`, "<span class='cultlarge'>\"Stop resisting. You <i>will</i> be mi-\"</span>\n<span class='large_brass'>\"Give up and you will feel pain unlike anything you've ever felt!\"</span>");
			yield* L.Knockdown(80);
		} else if (is_convertable) {
			yield* this.do_convert(L, invokers);
		}
	} else {
		this.invocation = "Barhah hra zar'garis!";
		yield* parent_proc();
		yield* this.do_sacrifice(L, invokers);
	}
	rt.op(f, "Animate", [2, 6], [null, this, "color", oldcolor, "time", 5]);
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/atom/proc/update_atom_colour"))), 5);
	this.rune_in_use = 0;
	return f.dot;
}, true);

// runes.dm:372
rt.def("/obj/effect/rune/convert/proc/do_convert", function* do_convert(f: Frame, convertee: Value, invokers: Value) {
	let M: Value = null;
	let $2: any, $e: any;
	if (rt.len(f, invokers) < 2) {
		for (M of each(invokers)) {
			to_chat(M, `<span class='warning'>You need more invokers to convert ${convertee}!</span>`);
		}
		log_game("Offer rune failed - tried conversion with one invoker");
		return 0;
	}
	if (convertee.null_rod_check()) {
		M = null;
		for (M of each(invokers)) {
			to_chat(M, `<span class='warning'>Something is shielding ${convertee}'s mind!</span>`);
		}
		log_game("Offer rune failed - convertee had null rod");
		return 0;
	}
	let brutedamage: Value = convertee.getBruteLoss();
	let burndamage: Value = convertee.getFireLoss();
	if (brutedamage || burndamage) {
		yield* convertee.adjustBruteLoss(-(brutedamage * 0.75));
		yield* convertee.adjustFireLoss(-(burndamage * 0.75));
	}
	let $0: any = convertee;
	let $1: any = convertee;
	if (brutedamage || burndamage) {
		$2 = `even as ${convertee.p_their()} wounds heal and close`;
	} else {
		$2 = `as the markings below ${convertee.p_them()} glow a bloody red`;
	}
	$0.visible_message(`<span class='warning'>${$1} writhes in pain ${$2}!</span>`, "<span class='cultlarge'><i>AAAAAAAAAAAAAA-</i></span>");
	yield* GLOB.SSticker.mode.add_cultist(convertee.mind, 1);
	yield* new_(T("/obj/item/weapon/tome"), rt.getStep(f, this, 0));
	convertee.mind.special_role = "Cultist";
	to_chat(convertee, "<span class='cultitalic'><b>Your blood pulses. Your head throbs. The world goes red. All at once you are aware of a horrible, horrible, truth. The veil of reality has been ripped away and something evil takes root.</b></span>");
	to_chat(convertee, "<span class='cultitalic'><b>Assist your new compatriots in their dark dealings. Your goal is theirs, and theirs is yours. You serve the Geometer above all else. Bring it back.</b></span>");
	return 1;
}, true);

// runes.dm:401
rt.def("/obj/effect/rune/convert/proc/do_sacrifice", function* do_sacrifice(f: Frame, sacrificial: Value, invokers: Value) {
	let M: Value = null;
	let big_sac: Value = 0;
	if (((rt.istype(sacrificial, T("/mob/living/carbon/human")) || rt.istype(sacrificial, T("/mob/living/silicon/robot"))) && sacrificial.stat != 2 || is_sacrifice_target(sacrificial.mind)) && rt.len(f, invokers) < 3) {
		for (M of each(invokers)) {
			to_chat(M, `<span class='cultitalic'>${sacrificial} is too greatly linked to the world! You need three acolytes!</span>`);
		}
		log_game("Offer rune failed - not enough acolytes and target is living or sac target");
		return 0;
	}
	if (sacrificial.mind) {
		GLOB.sacrificed += sacrificial.mind;
		if (is_sacrifice_target(sacrificial.mind)) {
			GLOB.sac_complete = 1;
			big_sac = 1;
		}
	} else {
		GLOB.sacrificed += sacrificial;
	}
	yield* new_(T("/obj/effect/temp_visual/cult/sac"), rt.getStep(f, this, 0));
	M = null;
	for (M of each(invokers)) {
		if (big_sac) {
			to_chat(M, "<span class='cultlarge'>\"Yes! This is the one I desire! You have done well.\"</span>");
		} else if (rt.istype(sacrificial, T("/mob/living/carbon/human")) || rt.istype(sacrificial, T("/mob/living/silicon/robot"))) {
			to_chat(M, "<span class='cultlarge'>\"I accept this sacrifice.\"</span>");
		} else {
			to_chat(M, "<span class='cultlarge'>\"I accept this meager sacrifice.\"</span>");
		}
	}
	let stone: Value = (yield* new_(T("/obj/item/device/soulstone"), rt.getStep(f, this, 0)));
	if (sacrificial.mind) {
		stone.invisibility = INVISIBILITY_MAXIMUM;
		yield* stone.transfer_soul("FORCE", sacrificial, f.usr);
		stone.invisibility = 0;
	}
	if (sacrificial) {
		if (rt.istype(sacrificial, T("/mob/living/silicon/robot"))) {
			playsound(sacrificial, rt.rsc("sound/magic/disable_tech.ogg"), 100, 1);
			yield* sacrificial.dust();
		} else {
			playsound(sacrificial, rt.rsc("sound/magic/disintegrate.ogg"), 100, 1);
			yield* sacrificial.gib();
		}
	}
	return 1;
}, true);

rt.type(11430, "/obj/effect/rune/narsie", "/obj/effect/rune", {
	used: 0,
	cultist_name: "Summon Nar-Sie",
	cultist_desc: "tears apart dimensional barriers, calling forth the Geometer. Requires 9 invokers.",
	invocation: "TOK-LYR RQA-NAP G'OLT-ULOFT!!",
	req_cultists: 9,
	scribe_delay: 500,
	scribe_damage: 40.1,
	icon: rt.rsc("icons/effects/96x96.dmi"),
	color: "#7D1717",
	icon_state: "rune_large",
	pixel_x: -32,
	pixel_y: -32,
});

// runes.dm:455
rt.def("/obj/effect/rune/narsie/proc/Initialize", function Initialize(f: Frame, mapload: Value, set_keyword: Value) {
	f.dot = parent_proc();
	(rt.modGl("poi_list", this, rt.bitOr));
	return f.dot;
}, false);

// runes.dm:459
rt.def("/obj/effect/rune/narsie/proc/Destroy", function* Destroy(f: Frame) {
	GLOB.poi_list -= this;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// runes.dm:468
rt.def("/obj/effect/rune/narsie/proc/invoke", function* invoke(f: Frame, invokers: Value) {
	let M: Value = null;
	if (this.used) {
		return f.dot;
	}
	if (this.z != ZLEVEL_STATION) {
		return f.dot;
	}
	if (rt.locateIn(f, T("/obj/singularity/narsie"), GLOB.poi_list)) {
		for (M of each(invokers)) {
			to_chat(M, "<span class='warning'>Nar-Sie is already on this plane!</span>");
		}
		log_game("Summon Nar-Sie rune failed - already summoned");
		return f.dot;
	}
	this.used = 1;
	yield* parent_proc();
	send_to_playing_players(rt.rsc("sound/effects/dimensional_rend.ogg"));
	let _T: Value = rt.getStep(f, this, 0);
	yield* sleep(40);
	if (this) {
		this.color = "#FF0000";
	}
	GLOB.SSticker.mode.eldergod = 0;
	yield* new_(T("/obj/singularity/narsie/large/cult"), _T);
	return f.dot;
}, true);

// runes.dm:488
rt.def("/obj/effect/rune/narsie/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (rt.istype(I, T("/obj/item/weapon/tome")) && iscultist(user)) {
		user.visible_message(`<span class='warning'>${user.name} begins erasing the ${this}...</span>`, `<span class='notice'>You begin erasing the ${this}...</span>`);
		if (yield* do_after(user, 50, { target: this })) {
			log_game(`Summon Narsie rune erased by ${user.mind.key} (ckey) with a tome`);
			message_admins(`${key_name_admin(user)} erased a Narsie rune with a tome`);
			yield* parent_proc();
		}
	} else {
		if (!rt.istype(I, T("/obj/item/weapon/nullrod"))) return f.dot;
		log_game(`Summon Narsie rune erased by ${user.mind.key} (ckey) using a null rod`);
		message_admins(`${key_name_admin(user)} erased a Narsie rune with a null rod`);
		yield* parent_proc();
	}
	return f.dot;
}, true);

rt.type(11431, "/obj/effect/rune/raise_dead", "/obj/effect/rune", {
	cultist_name: "Resurrect Cultist",
	cultist_desc: "requires the corpse of a cultist placed upon the rune. Provided there have been sufficient sacrifices, they will be revived.",
	invocation: "Pasnar val'keriam usinar. Savrae ines amutan. Yam'toth remium il'tarat!",
	icon_state: "1",
	color: "#C80000",
}, { global: { revives_used: 778 } });

// runes.dm:510
rt.def("/obj/effect/rune/raise_dead/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (!(iscultist(user) || user.stat == 2)) return f.dot;
	let revive_number: Value = rt.length(GLOB.sacrificed) - GLOB.revives_used;
	to_chat(user, `<b>Revives Remaining:</b> ${revive_number}`);
	return f.dot;
}, false);

// runes.dm:516
rt.def("/obj/effect/rune/raise_dead/proc/invoke", function* invoke(f: Frame, invokers: Value) {
	let mob_to_revive: Value = null, M: Value = null;
	let _T: Value = rt.getStep(f, this, 0);
	let potential_revive_mobs: Value = list();
	let user: Value = rt.index(invokers, 1);
	if (this.rune_in_use) {
		return f.dot;
	}
	this.rune_in_use = 1;
	for (M of each(_T.contents, T("/mob/living"))) {
		if (iscultist(M) && M.stat == 2) {
			(potential_revive_mobs = rt.modify(potential_revive_mobs, M, rt.bitOr));
		}
	}
	if (!rt.len(f, potential_revive_mobs)) {
		to_chat(user, "<span class='cultitalic'>There are no dead cultists on the rune!</span>");
		log_game("Raise Dead rune failed - no corpses to revive");
		yield* this.fail_invoke();
		this.rune_in_use = 0;
		return f.dot;
	}
	if (rt.length(GLOB.sacrificed) <= GLOB.revives_used) {
		to_chat(user, "<span class='warning'>You have sacrificed too few people to revive a cultist!</span>");
		yield* this.fail_invoke();
		this.rune_in_use = 0;
		return f.dot;
	}
	if (rt.len(f, potential_revive_mobs) > 1) {
		mob_to_revive = (yield* g.op(f, "Prompt", [1], [null, "Cultist to Revive", "Choose a cultist to revive.", user, potential_revive_mobs]));
	} else {
		mob_to_revive = rt.index(potential_revive_mobs, 1);
	}
	if (!this || !this || this.gc_destroyed || this.rune_in_use || !(yield* this.validness_checks(mob_to_revive, user))) {
		this.rune_in_use = 0;
		return f.dot;
	}
	if (user.name == "Herbert West") {
		this.invocation = "To life, to life, I bring them!";
	} else {
		this.invocation = rt.initial(f, this, "invocation");
	}
	yield* parent_proc();
	GLOB.revives_used++;
	yield* mob_to_revive.revive(1, 1);
	yield* mob_to_revive.grab_ghost();
	to_chat(mob_to_revive, "<span class='cultlarge'>\"PASNAR SAVRAE YAM'TOTH. Arise.\"</span>");
	mob_to_revive.visible_message(`<span class='warning'>${mob_to_revive} draws in a huge breath, red light shining from ${mob_to_revive.p_their()} eyes.</span>`, "<span class='cultlarge'>You awaken suddenly from the void. You're alive!</span>");
	this.rune_in_use = 0;
	return f.dot;
}, true);

// runes.dm:558
rt.def("/obj/effect/rune/raise_dead/proc/validness_checks", function* validness_checks(f: Frame, target_mob: Value, user: Value) {
	let ghost: Value = null;
	let _T: Value = rt.getStep(f, this, 0);
	if (!user || user.gc_destroyed) {
		return 0;
	}
	if (!this.Adjacent(user) || user.incapacitated()) {
		return 0;
	}
	if (!target_mob || target_mob.gc_destroyed) {
		yield* this.fail_invoke();
		return 0;
	}
	if (!rt.isIn(f, target_mob, _T.contents)) {
		to_chat(user, "<span class='cultitalic'>The cultist to revive has been moved!</span>");
		yield* this.fail_invoke();
		log_game("Raise Dead rune failed - revival target moved");
		return 0;
	}
	if (!(ghost = target_mob.get_ghost(1)) && (!target_mob.mind || !target_mob.mind.active)) {
		to_chat(user, "<span class='cultitalic'>The corpse to revive has no spirit!</span>");
		yield* this.fail_invoke();
		log_game("Raise Dead rune failed - revival target has no ghost");
		return 0;
	}
	if (!rt.len(f, GLOB.sacrificed) || rt.len(f, GLOB.sacrificed) <= GLOB.revives_used) {
		to_chat(user, "<span class='warning'>You have sacrificed too few people to revive a cultist!</span>");
		yield* this.fail_invoke();
		log_game("Raise Dead rune failed - too few sacrificed");
		return 0;
	}
	return 1;
}, true);

// runes.dm:585
rt.def("/obj/effect/rune/raise_dead/proc/fail_invoke", function* fail_invoke(f: Frame) {
	let M: Value = null;
	yield* parent_proc();
	for (M of each(range(1, this), T("/mob/living"))) {
		if (iscultist(M) && M.stat == 2) {
			M.visible_message(`<span class='warning'>${M} twitches.</span>`);
		}
	}
	return f.dot;
}, true);

rt.type(11432, "/obj/effect/rune/emp", "/obj/effect/rune", {
	cultist_name: "Electromagnetic Disruption",
	cultist_desc: "emits a large electromagnetic pulse, increasing in size for each cultist invoking it, hindering electronics and disabling silicons.",
	invocation: "Ta'gh fara'qha fel d'amar det!",
	allow_excess_invokers: 1,
	icon_state: "5",
	color: "#4D94FF",
});

// runes.dm:601
rt.def("/obj/effect/rune/emp/proc/invoke", function* invoke(f: Frame, invokers: Value) {
	let M: Value = null, L: Value = null;
	let $e: any;
	let E: Value = rt.getStep(f, this, 0);
	yield* parent_proc();
	this.visible_message(`<span class='warning'>${this} glows blue for a moment before vanishing.</span>`);
	const length_2 = rt.len(f, invokers);
	if (rt.inRange(length_2, 1, 2)) {
		playsound(E, rt.rsc("sound/items/welder2.ogg"), 25, 1);
		for (M of each(invokers)) {
			to_chat(M, "<span class='warning'>You feel a minute vibration pass through you...</span>");
		}
	} else if (rt.inRange(length_2, 3, 6)) {
		playsound(E, rt.rsc("sound/magic/disable_tech.ogg"), 50, 1);
		M = null;
		for (M of each(invokers)) {
			to_chat(M, "<span class='danger'>Your hair stands on end as a shockwave emanates from the rune!</span>");
		}
	} else if (rt.inRange(length_2, 7, 1e+31)) {
		playsound(E, rt.rsc("sound/magic/disable_tech.ogg"), 100, 1);
		M = null;
		for (M of each(invokers)) {
			to_chat((L = M), "<span class='userdanger'>You chant in unison and a colossal burst of energy knocks you backward!</span>");
			yield* L.Knockdown(40);
		}
	}
	yield* qdel(this);
	yield* empulse(E, 9 * rt.len(f, invokers), 12 * rt.len(f, invokers));
	return f.dot;
}, true);

rt.type(11433, "/obj/effect/rune/spirit", "/obj/effect/rune", {
	affecting: null,
	cultist_name: "Spirit Sight",
	cultist_desc: "severs the link between one's spirit and body. This effect is taxing and one's physical body will take damage while this is active.",
	invocation: "Fwe'sh mah erl nyag r'ya!",
	rune_in_use: 0,
	construct_invoke: 0,
	icon_state: "7",
	color: "#7D1717",
});

// runes.dm:635
rt.def("/obj/effect/rune/spirit/proc/Destroy", function* Destroy(f: Frame) {
	this.affecting = null;
	return (yield* parent_proc());
}, true);

// runes.dm:638
rt.def("/obj/effect/rune/spirit/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (!this.affecting) return f.dot;
	to_chat(user, `<span class='cultitalic'>A translucent field encases ${this.affecting} above the rune!</span>`);
	return f.dot;
}, false);

// runes.dm:644
rt.def("/obj/effect/rune/spirit/proc/can_invoke", function can_invoke(f: Frame, user: Value) {
	if (this.rune_in_use) {
		to_chat(user, `<span class='cultitalic'>${this} cannot support more than one body!</span>`);
		log_game("Spirit Sight rune failed - more than one user");
		return list();
	}
	let _T: Value = rt.getStep(f, this, 0);
	if (!rt.isIn(f, user, _T)) {
		to_chat(user, `<span class='cultitalic'>You must be standing on top of ${this}!</span>`);
		log_game("Spirit Sight rune failed - user not standing on rune");
		return list();
	}
	return parent_proc();
}, false);

// runes.dm:655
rt.def("/obj/effect/rune/spirit/proc/invoke", function* invoke(f: Frame, invokers: Value) {
	let G: Value = null;
	let user: Value = rt.index(invokers, 1);
	yield* parent_proc();
	let _T: Value = rt.getStep(f, this, 0);
	this.rune_in_use = 1;
	this.affecting = user;
	this.affecting.add_atom_colour("#7D1717", 1);
	this.affecting.visible_message(`<span class='warning'>${this.affecting} freezes statue-still, glowing an unearthly red.</span>`, "<span class='cult'>You see what lies beyond. All is revealed. While this is a wondrous experience, your physical form will waste away in this state. Hurry...</span>");
	yield* this.affecting.ghostize(1);
	while (!(!this.affecting || this.affecting.gc_destroyed)) {
		yield* this.affecting.apply_damage(0.1, "brute");
		if (!rt.isIn(f, this.affecting, _T)) {
			user.visible_message(`<span class='warning'>A spectral tendril wraps around ${this.affecting} and pulls ${this.affecting.p_them()} back to the rune!</span>`);
			yield* this.Beam(this.affecting, { icon_state: "drainbeam", time: 2 });
			yield* this.affecting.forceMove(rt.getStep(f, this, 0));
		}
		if (this.affecting.key) {
			this.affecting.visible_message(`<span class='warning'>${this.affecting} slowly relaxes, the glow around ${this.affecting.p_them()} dimming.</span>`, `<span class='danger'>You are re-united with your physical form. ${this} releases its hold over you.</span>`);
			this.affecting.remove_atom_colour(ADMIN_COLOUR_PRIORITY, "#7D1717");
			yield* this.affecting.Knockdown(60);
			break;
		}
		if (this.affecting.stat == 1) {
			if (prob(1)) {
				to_chat((G = this.affecting.get_ghost()), "<span class='cultitalic'>You feel the link between you and your body weakening... you must hurry!</span>");
			}
		} else if (this.affecting.stat == 2) {
			this.affecting.remove_atom_colour(1, "#7D1717");
			to_chat((G = this.affecting.get_ghost()), `<span class='cultitalic'><b>You suddenly feel your physical form pass on. ${this}'s exertion has killed you!</b></span>`);
			break;
		}
		yield* sleep(1);
	}
	this.affecting = null;
	this.rune_in_use = 0;
	return f.dot;
}, true);

rt.type(11434, "/obj/effect/rune/wall", "/obj/effect/rune", {
	density_timer: null,
	recharging: 0,
	cultist_name: "Form Barrier",
	cultist_desc: "when invoked, makes a temporary invisible wall to block passage. Can be invoked again to reverse this.",
	invocation: "Khari'd! Eske'te tannin!",
	CanAtmosPass: -2,
	icon_state: "1",
	color: "#C80000",
});

// runes.dm:701
rt.def("/obj/effect/rune/wall/proc/Initialize", function Initialize(f: Frame, mapload: Value, set_keyword: Value) {
	f.dot = parent_proc();
	GLOB.wall_runes += this;
	return f.dot;
}, false);

// runes.dm:705
rt.def("/obj/effect/rune/wall/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (!this.density) return f.dot;
	to_chat(user, `<span class='cultitalic'>There is a barely perceptible shimmering of the air above ${this}.</span>`);
	return f.dot;
}, false);

// runes.dm:711
rt.def("/obj/effect/rune/wall/proc/Destroy", function* Destroy(f: Frame) {
	this.density = 0;
	GLOB.wall_runes -= this;
	this.air_update_turf(1);
	return (yield* parent_proc());
}, true);

// runes.dm:721
rt.def("/obj/effect/rune/wall/proc/invoke", function* invoke(f: Frame, invokers: Value) {
	let C: Value = null;
	let $2: any, $4: any;
	if (this.recharging) {
		return f.dot;
	}
	let user: Value = rt.index(invokers, 1);
	yield* parent_proc();
	this.density = (!this.density ? 1 : 0);
	yield* this.update_state();
	if (this.density) {
		yield* this.spread_density();
	}
	let carbon_user: Value = (rt.istype(user, T("/mob/living/carbon")) ? 1 : 0);
	let $0: any = user;
	let $1: any = user;
	if (carbon_user) {

		$2 = `places ${user.p_their()} hands on`;
	} else {
		$2 = "stares intently at";
	}
	let $3: any = this;
	if (this.density) {
		$4 = "the air above it begins to shimmer";
	} else {
		$4 = "the shimmer above it fades";
	}
	$1 = `<span class='warning'>${$1} ${$2} ${$3}, and ${$4}.</span>`;
	if (carbon_user) {
		$2 = "your life ";
	} else {
		$2 = "";
	}
	$3 = this;
	if (this.density) {
		$4 = "temporarily preventing";
	} else {
		$4 = "allowing";
	}
	$0.visible_message($1, `<span class='cultitalic'>You channel ${$2}energy into ${$3}, ${$4} passage above it.</span>`);
	if (!carbon_user) return f.dot;
	yield* (C = user).apply_damage(2, "brute", pick("l_arm", "r_arm"));
	return f.dot;
}, true);

// runes.dm:735
rt.def("/obj/effect/rune/wall/proc/spread_density", function* spread_density(f: Frame) {
	let R: Value = null, W: Value = null;
	for (R of each(GLOB.wall_runes)) {
		if ((W = R).z == this.z && get_dist(this, W) <= 2 && !W.density && !W.recharging) {
			W.density = 1;
			yield* W.update_state();
			yield* W.spread_density();
		}
	}
	this.density_timer = (yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/effect/rune/wall/proc/lose_density"))), 900, 8));
	return f.dot;
}, true);

// runes.dm:747
rt.def("/obj/effect/rune/wall/proc/lose_density", function* lose_density(f: Frame) {
	if (!this.density) return f.dot;
	this.recharging = 1;
	this.density = 0;
	yield* this.update_state();
	let oldcolor: Value = this.color;
	this.add_atom_colour("#696969", FIXED_COLOUR_PRIORITY);
	rt.op(f, "Animate", [2, 8], [null, this, "color", oldcolor, "time", 50, "easing", 64]);
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/effect/rune/wall/proc/recharge"))), 50);
	return f.dot;
}, true);

// runes.dm:755
rt.def("/obj/effect/rune/wall/proc/recharge", function recharge(f: Frame) {
	this.recharging = 0;
	this.add_atom_colour("#C80000", FIXED_COLOUR_PRIORITY);
	return f.dot;
});

// runes.dm:758
rt.def("/obj/effect/rune/wall/proc/update_state", function* update_state(f: Frame) {
	let shimmer: Value = null;
	yield* deltimer(this.density_timer);
	this.air_update_turf(1);
	if (this.density) {
		(rt.modField(f, (shimmer = mutable_appearance(rt.rsc("icons/effects/effects.dmi"), "barriershimmer", ABOVE_MOB_LAYER)), "appearance_flags", 2, rt.bitOr));
		shimmer.alpha = 60;
		shimmer.color = "#701414";
		this.add_overlay(shimmer);
		this.add_atom_colour("#FF0000", FIXED_COLOUR_PRIORITY);
	} else {
		this.cut_overlays();
		this.add_atom_colour("#C80000", FIXED_COLOUR_PRIORITY);
	}
	return f.dot;
}, true);

rt.type(11435, "/obj/effect/rune/summon", "/obj/effect/rune", {
	cultist_name: "Summon Cultist",
	cultist_desc: "summons a single cultist to the rune. Requires 2 invokers.",
	invocation: "N'ath reth sh'yro eth d'rekkathnor!",
	req_cultists: 2,
	invoke_damage: 10,
	icon_state: "5",
	color: "#00FF00",
});

// runes.dm:782
rt.def("/obj/effect/rune/summon/proc/invoke", function* invoke(f: Frame, invokers: Value) {
	let M: Value = null;
	let user: Value = rt.index(invokers, 1);
	let cultists: Value = list();
	for (M of each(GLOB.SSticker.mode.cult, T("/datum/mind"))) {
		if (!rt.isIn(f, M.current, invokers) && M.current && M.current.stat != 2) {
			(cultists = rt.modify(cultists, M.current, rt.bitOr));
		}
	}
	let cultist_to_summon: Value = (yield* g.op(f, "Prompt", [1], [null, "Followers of the Geometer", `Who do you wish to call to ${this}?`, user, cultists]));
	if (!this.Adjacent(user) || !this || !this || this.gc_destroyed || user.incapacitated()) {
		return f.dot;
	}
	if (!cultist_to_summon) {
		to_chat(user, "<span class='cultitalic'>You require a summoning target!</span>");
		yield* this.fail_invoke();
		log_game("Summon Cultist rune failed - no target");
		return f.dot;
	}
	if (cultist_to_summon.stat == 2) {
		to_chat(user, `<span class='cultitalic'>${cultist_to_summon} has died!</span>`);
		yield* this.fail_invoke();
		log_game("Summon Cultist rune failed - target died");
		return f.dot;
	}
	if (!iscultist(cultist_to_summon)) {
		to_chat(user, `<span class='cultitalic'>${cultist_to_summon} is not a follower of the Geometer!</span>`);
		yield* this.fail_invoke();
		log_game("Summon Cultist rune failed - target was deconverted");
		return f.dot;
	}
	if (cultist_to_summon.z > ZLEVEL_SPACEMAX) {
		to_chat(user, `<span class='cultitalic'>${cultist_to_summon} is not in our dimension!</span>`);
		yield* this.fail_invoke();
		log_game("Summon Cultist rune failed - target in away mission");
		return f.dot;
	}
	cultist_to_summon.visible_message(`<span class='warning'>${cultist_to_summon} suddenly disappears in a flash of red light!</span>`, "<span class='cultitalic'><b>Overwhelming vertigo consumes you as you are hurled through the air!</b></span>");
	yield* parent_proc();
	this.visible_message(`<span class='warning'>A foggy shape materializes atop ${this} and solidifes into ${cultist_to_summon}!</span>`);
	yield* cultist_to_summon.forceMove(rt.getStep(f, this, 0));
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(11436, "/obj/effect/rune/blood_boil", "/obj/effect/rune", {
	tick_damage: 25,
	cultist_name: "Boil Blood",
	cultist_desc: "boils the blood of non-believers who can see the rune, rapidly dealing extreme amounts of damage. Requires 3 invokers.",
	invocation: "Dedo ol'btoh!",
	light_color: "#C48A18",
	req_cultists: 3,
	invoke_damage: 10,
	construct_invoke: 0,
	rune_in_use: 0,
	icon_state: "4",
	color: "#C80000",
});

// runes.dm:837
rt.def("/obj/effect/rune/blood_boil/proc/invoke", function* invoke(f: Frame, invokers: Value) {
	let L: Value = null, N: Value = null;
	if (this.rune_in_use) {
		return f.dot;
	}
	yield* parent_proc();
	this.rune_in_use = 1;
	let _T: Value = rt.getStep(f, this, 0);
	this.visible_message(`<span class='warning'>${this} turns a bright, glowing orange!</span>`);
	this.color = "#FC9B54";
	this.set_light(6, 1, this.color);
	for (L of each(viewers(_T), T("/mob/living"))) {
		if (!iscultist(L) && L.blood_volume) {
			if (N = L.null_rod_check()) {
				to_chat(L, fmt("<span class='userdanger'>＄！ suddenly burns hotly before returning to normal!</span>", [N]));
				continue;
			}
			to_chat(L, "<span class='cultlarge'>Your blood boils in your veins!</span>");
			if (is_servant_of_ratvar(L)) {
				to_chat(L, "<span class='userdanger'>You feel an unholy darkness dimming the Justiciar's light!</span>");
			}
		}
	}
	rt.op(f, "Animate", [2, 6], [null, this, "color", "#FCB56D", "time", 4]);
	yield* sleep(4);
	if (!this || this.gc_destroyed) {
		return f.dot;
	}
	yield* this.do_area_burn(_T, 0.5);
	rt.op(f, "Animate", [2, 6], [null, this, "color", "#FFDF80", "time", 5]);
	yield* sleep(5);
	if (!this || this.gc_destroyed) {
		return f.dot;
	}
	yield* this.do_area_burn(_T, 1);
	rt.op(f, "Animate", [2, 6], [null, this, "color", "#FFFDF4", "time", 6]);
	yield* sleep(6);
	if (!this || this.gc_destroyed) {
		return f.dot;
	}
	yield* this.do_area_burn(_T, 1.5);
	yield* new_(T("/obj/effect/hotspot"), _T);
	yield* qdel(this);
	return f.dot;
}, true);

// runes.dm:871
rt.def("/obj/effect/rune/blood_boil/proc/do_area_burn", function* do_area_burn(f: Frame, _T: Value, multiplier: Value) {
	let L: Value = null, N: Value = null;
	this.set_light(6, 1, this.color);
	for (L of each(viewers(_T), T("/mob/living"))) {
		if (!iscultist(L) && L.blood_volume) {
			if (N = L.null_rod_check()) {
				continue;
			}
			yield* L.take_overall_damage(this.tick_damage * multiplier, this.tick_damage * multiplier);
			if (is_servant_of_ratvar(L)) {
				yield* L.adjustStaminaLoss(this.tick_damage * 0.5);
			}
		}
	}
	return f.dot;
}, true);

rt.type(11437, "/obj/effect/rune/manifest", "/obj/effect/rune", {
	ghost_limit: 5,
	ghosts: 0,
	cultist_name: "Manifest Spirit",
	cultist_desc: "manifests a spirit as a servant of the Geometer. The invoker must not move from atop the rune, and will take damage for each summoned spirit.",
	invocation: "Gal'h'rfikk harfrandid mud'gib!",
	invoke_damage: 10,
	construct_invoke: 0,
	icon_state: "6",
	color: "#C80000",
});

// runes.dm:894
rt.def("/obj/effect/rune/manifest/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	yield* notify_ghosts(`Manifest rune created in ${get_area(this)}.`, rt.rsc("sound/effects/ghost2.ogg"), { source: this });
	return f.dot;
}, true);

// runes.dm:898
rt.def("/obj/effect/rune/manifest/proc/can_invoke", function* can_invoke(f: Frame, user: Value) {
	let O: Value = null;
	if (!rt.isIn(f, user, rt.getStep(f, this, 0))) {
		to_chat(user, `<span class='cultitalic'>You must be standing on ${this}!</span>`);
		yield* this.fail_invoke();
		log_game("Manifest rune failed - user not standing on rune");
		return list();
	}
	if (user.has_status_effect(T("/datum/status_effect/cultghost"))) {
		to_chat(user, "<span class='cultitalic'>Ghosts can't summon more ghosts!</span>");
		yield* this.fail_invoke();
		log_game("Manifest rune failed - user is a ghost");
		return list();
	}
	if (this.ghosts >= this.ghost_limit) {
		to_chat(user, "<span class='cultitalic'>You are sustaining too many ghosts to summon more!</span>");
		yield* this.fail_invoke();
		log_game("Manifest rune failed - too many summoned ghosts");
		return list();
	}
	let ghosts_on_rune: Value = list();
	for (O of each(rt.getStep(f, this, 0), T("/mob/dead/observer"))) {
		if (O.client && !jobban_isbanned(O, "cultist")) {
			(ghosts_on_rune = rt.modify(ghosts_on_rune, O, rt.bitOr));
		}
	}
	if (!rt.len(f, ghosts_on_rune)) {
		to_chat(user, `<span class='cultitalic'>There are no spirits near ${this}!</span>`);
		yield* this.fail_invoke();
		log_game("Manifest rune failed - no nearby ghosts");
		return list();
	}
	return (yield* parent_proc());
}, true);

// runes.dm:925
rt.def("/obj/effect/rune/manifest/proc/invoke", function* invoke(f: Frame, invokers: Value) {
	let O: Value = null, new_human: Value = null, I: Value = null;
	let $1: any, $e: any;
	let user: Value = rt.index(invokers, 1);
	let ghosts_on_rune: Value = list();
	for (O of each(rt.getStep(f, this, 0), T("/mob/dead/observer"))) {
		if (O.client && !jobban_isbanned(O, "cultist")) {
			(ghosts_on_rune = rt.modify(ghosts_on_rune, O, rt.bitOr));
		}
	}
	let ghost_to_spawn: Value = pick(ghosts_on_rune);
	(new_human = (yield* new_(T("/mob/living/carbon/human"), rt.getStep(f, this, 0)))).real_name = ghost_to_spawn.real_name;
	new_human.alpha = 150;
	yield* new_human.equipOutfit(T("/datum/outfit/ghost_cultist"));
	yield* new_human.apply_status_effect(T("/datum/status_effect/cultghost"));
	yield* parent_proc();
	this.ghosts++;
	playsound(this, rt.rsc("sound/magic/exit_blood.ogg"), 50, 1);
	let $0: any = this;
	if (new_human.gender == "female") {
		$1 = "wo";
	} else {
		$1 = "";
	}
	this.visible_message(`<span class='warning'>A cloud of red mist forms above ${$0}, and from within steps... a ${$1}man.</span>`);
	to_chat(user, `<span class='cultitalic'>Your blood begins flowing into ${this}. You must remain in place and conscious to maintain the forms of those summoned. This will hurt you slowly but surely...</span>`);
	let _T: Value = rt.getStep(f, this, 0);
	let N: Value = (yield* new_(T("/obj/structure/emergency_shield/invoker"), _T));
	new_human.key = ghost_to_spawn.key;
	yield* GLOB.SSticker.mode.add_cultist(new_human.mind, 0);
	to_chat(new_human, "<span class='cultitalic'><b>You are a servant of the Geometer. You have been made semi-corporeal by the cult of Nar-Sie, and you are to serve them at all costs.</b></span>");
	while (!(!this || this.gc_destroyed) && !(!user || user.gc_destroyed) && !(!new_human || new_human.gc_destroyed) && rt.isIn(f, user, _T)) {
		if (user.stat || new_human.InCritical()) {
			break;
		}
		yield* user.apply_damage(0.1, "brute");
		yield* sleep(1);
	}
	yield* qdel(N);
	this.ghosts--;
	if (!new_human) return f.dot;
	new_human.visible_message(`<span class='warning'>${new_human} suddenly dissolves into bones and ashes.</span>`, "<span class='cultlarge'>Your link to the world fades. Your form breaks apart.</span>");
	for (I of each(new_human, T("/obj"))) {
		yield* new_human.dropItemToGround(I, 1);
	}
	yield* new_human.dust();
	return f.dot;
}, true);
