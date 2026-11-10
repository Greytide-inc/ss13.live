// Based on /tg/station's code/game/gamemodes/cult/talisman.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


rt.type(6563, "/obj/item/weapon/paper/talisman", "/obj/item/weapon/paper", {
	cultist_name: "talisman",
	cultist_desc: "A basic talisman. It serves no purpose.",
	invocation: "Naise meam!",
	uses: 1,
	health_cost: 0,
	creation_time: 100,
});

// talisman.dm:10
rt.def("/obj/item/weapon/paper/talisman/proc/examine", function examine(f: Frame, user: Value) {
	if (iscultist(user) || user.stat == 2) {
		to_chat(user, `<b>Name:</b> ${this.cultist_name}`);
		to_chat(user, `<b>Effect:</b> ${this.cultist_desc}`);
		to_chat(user, `<b>Uses Remaining:</b> ${this.uses}`);
	} else {
		to_chat(user, "<span class='danger'>There are indecipherable images scrawled on the paper in what looks to be... <i>blood?</i></span>");
	}
	return f.dot;
});

// talisman.dm:18
rt.def("/obj/item/weapon/paper/talisman/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	if (!iscultist(user)) {
		to_chat(user, "<span class='danger'>There are indecipherable images scrawled on the paper in what looks to be... <i>blood?</i></span>");
		return f.dot;
	}
	if (yield* this.invoke(user)) {
		this.uses--;
	}
	if (!(this.uses <= 0)) return f.dot;
	yield* user.drop_item();
	yield* qdel(this);
	return f.dot;
}, true);

// talisman.dm:28
rt.def("/obj/item/weapon/paper/talisman/proc/invoke", function* invoke(f: Frame, user: Value, successfuluse: Value) {
	let C: Value = null;
	successfuluse ??= 1;
	f.dot = successfuluse;
	if (!successfuluse) return f.dot;
	if (this.invocation) {
		yield* user.whisper(this.invocation, { language: T("/datum/language/common") });
	}
	if (!(this.health_cost && rt.istype(user, T("/mob/living/carbon")))) return f.dot;
	yield* (C = user).apply_damage(this.health_cost, "brute", pick("l_arm", "r_arm"));
	return f.dot;
}, true);

rt.type(6566, "/obj/item/weapon/paper/talisman/malformed", "/obj/item/weapon/paper/talisman", {
	cultist_name: "malformed talisman",
	cultist_desc: "A talisman with gibberish scrawlings. No good can come from invoking this.",
	invocation: "Ra'sha yoka!",
});

// talisman.dm:43
rt.def("/obj/item/weapon/paper/talisman/malformed/proc/invoke", function* invoke(f: Frame, user: Value, successfuluse: Value) {
	let C: Value = null;
	successfuluse ??= 1;
	to_chat(user, "<span class='cultitalic'>You feel a pain in your head. The Geometer is displeased.</span>");
	if (!rt.istype(user, T("/mob/living/carbon"))) return f.dot;
	yield* (C = user).apply_damage(10, "brute", "head");
	return f.dot;
}, true);

rt.type(6567, "/obj/item/weapon/paper/talisman/teleport", "/obj/item/weapon/paper/talisman", {
	cultist_name: "Talisman of Teleportation",
	cultist_desc: "A single-use talisman that will teleport a user to a random rune of the same keyword.",
	invocation: "Sas'so c'arta forbici!",
	health_cost: 5,
	creation_time: 80,
	color: "#551A8B",
});

// talisman.dm:58
rt.def("/obj/item/weapon/paper/talisman/teleport/proc/invoke", function* invoke(f: Frame) {
	let R: Value = null, _T: Value = null, target: Value = null;
	if (f.args[1] === null) {
		f.args[1] = 1;
	}
	let potential_runes: Value = list();
	let teleportnames: Value = list();
	for (R of each(GLOB.teleport_runes)) {
		_T = R;
		rt.setAt(potential_runes, avoid_assoc_duplicate_keys(_T.listkey, teleportnames), _T);
	}
	if (!rt.len(f, potential_runes)) {
		to_chat(f.args[0], "<span class='warning'>There are no valid runes to teleport to!</span>");
		log_game("Teleport talisman failed - no other teleport runes");
		return (yield* parent_proc(f.args[0], 0));
	}
	if (f.args[0].z > ZLEVEL_SPACEMAX) {
		to_chat(f.args[0], "<span class='cultitalic'>You are not in the right dimension!</span>");
		log_game("Teleport talisman failed - user in away mission");
		return (yield* parent_proc(f.args[0], 0));
	}
	let input_rune_key: Value = (yield* g.op(f, "Prompt", [1], [null, "Rune to Teleport to", "Choose a rune to teleport to.", f.args[0], potential_runes]));
	let actual_selected_rune: Value = rt.index(potential_runes, input_rune_key);
	if (!this || !this || this.gc_destroyed || !f.args[0] || !f.args[0].is_holding(this) || f.args[0].incapacitated() || !actual_selected_rune) {
		return (yield* parent_proc(f.args[0], 0));
	}
	if (is_blocked_turf((target = rt.getStep(f, actual_selected_rune, 0)), 1)) {
		to_chat(f.args[0], "<span class='warning'>The target rune is blocked. Attempting to teleport to it would be massively unwise.</span>");
		return (yield* parent_proc(f.args[0], 0));
	}
	f.args[0].visible_message(`<span class='warning'>Dust flows from ${f.args[0]}'s hand, and ${f.args[0].p_they()} disappear${f.args[0].p_s()} with a sharp crack!</span>`, "<span class='cultitalic'>You speak the words of the talisman and find yourself somewhere else!</span>", "<i>You hear a sharp crack.</i>");
	yield* f.args[0].forceMove(target);
	target.visible_message("<span class='warning'>There is a boom of outrushing air as something appears above the rune!</span>", null, "<i>You hear a boom.</i>");
	return (yield* parent_proc());
}, true, { args: ["user", "successfuluse"] });

rt.type(6568, "/obj/item/weapon/paper/talisman/summon_tome", "/obj/item/weapon/paper/talisman", {
	cultist_name: "Talisman of Tome Summoning",
	cultist_desc: "A one-use talisman that will call an untranslated tome from the archives of the Geometer.",
	invocation: "N'ath reth sh'yro eth d'raggathnor!",
	health_cost: 1,
	creation_time: 30,
	color: "#512727",
});

// talisman.dm:98
rt.def("/obj/item/weapon/paper/talisman/summon_tome/proc/invoke", function* invoke(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 1;
	}
	f.dot = (yield* parent_proc());
	f.args[0].visible_message(`<span class='warning'>${f.args[0]}'s hand glows red for a moment.</span>`, "<span class='cultitalic'>You speak the words of the talisman!</span>");
	yield* new_(T("/obj/item/weapon/tome"), rt.getStep(f, f.args[0], 0));
	f.args[0].visible_message(`<span class='warning'>A tome appears at ${f.args[0]}'s feet!</span>`, "<span class='cultitalic'>An arcane tome materializes at your feet.</span>");
	return f.dot;
}, true, { args: ["user", "successfuluse"] });

rt.type(6569, "/obj/item/weapon/paper/talisman/true_sight", "/obj/item/weapon/paper/talisman", {
	revealing: 0,
	cultist_name: "Talisman of Veiling",
	cultist_desc: "A multi-use talisman that hides nearby runes. On its second use, will reveal nearby runes.",
	invocation: "Kla'atu barada nikt'o!",
	health_cost: 1,
	creation_time: 30,
	uses: 6,
	color: "#9c9c9c",
});

// talisman.dm:116
rt.def("/obj/item/weapon/paper/talisman/true_sight/proc/invoke", function* invoke(f: Frame) {
	let R: Value = null;
	if (f.args[1] === null) {
		f.args[1] = 1;
	}
	f.dot = (yield* parent_proc());
	if (!this.revealing) {
		f.args[0].visible_message(`<span class='warning'>Thin grey dust falls from ${f.args[0]}'s hand!</span>`, "<span class='cultitalic'>You speak the words of the talisman, hiding nearby runes.</span>");
		this.invocation = "Nikt'o barada kla'atu!";
		this.revealing = 1;
		for (R of each(range(4, f.args[0]), T("/obj/effect/rune"))) {
			R.talismanhide();
		}
	} else {
		f.args[0].visible_message(`<span class='warning'>A flash of light shines from ${f.args[0]}'s hand!</span>`, "<span class='cultitalic'>You speak the words of the talisman, revealing nearby runes.</span>");
		R = null;
		for (R of each(range(3, f.args[0]), T("/obj/effect/rune"))) {
			R.talismanreveal();
		}
	}
	return f.dot;
}, true, { args: ["user", "successfuluse"] });

rt.type(6570, "/obj/item/weapon/paper/talisman/emp", "/obj/item/weapon/paper/talisman", {
	cultist_name: "Talisman of Electromagnetic Pulse",
	cultist_desc: "A talisman that will cause a moderately-sized electromagnetic pulse.",
	invocation: "Ta'gh fara'qha fel d'amar det!",
	health_cost: 5,
	color: "#4d94ff",
});

// talisman.dm:139
rt.def("/obj/item/weapon/paper/talisman/emp/proc/invoke", function* invoke(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 1;
	}
	f.dot = (yield* parent_proc());
	f.args[0].visible_message(`<span class='warning'>${f.args[0]}'s hand flashes a bright blue!</span>`, "<span class='cultitalic'>You speak the words of the talisman, emitting an EMP blast.</span>");
	yield* empulse(this, 4, 8);
	return f.dot;
}, true, { args: ["user", "successfuluse"] });

rt.type(6571, "/obj/item/weapon/paper/talisman/stun", "/obj/item/weapon/paper/talisman", {
	cultist_name: "Talisman of Stunning",
	cultist_desc: "A talisman that will stun and inhibit speech on a single target. To use, attack target directly.",
	invocation: "Fuu ma'jin!",
	health_cost: 10,
	color: "#ff0000",
});

// talisman.dm:155
rt.def("/obj/item/weapon/paper/talisman/stun/proc/invoke", function* invoke(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (f.args[1]) {
		return (yield* parent_proc());
	}
	if (iscultist(f.args[0])) {
		to_chat(f.args[0], "<span class='warning'>To use this talisman, attack the target directly.</span>");
	} else {
		to_chat(f.args[0], "<span class='danger'>There are indecipherable images scrawled on the paper in what looks to be... <i>blood?</i></span>");
	}
	return 0;
}, true, { args: ["user", "successfuluse"] });

// talisman.dm:163
rt.def("/obj/item/weapon/paper/talisman/stun/proc/attack", function* attack(f: Frame) {
	let N: Value = null, S: Value = null, C: Value = null;
	if (f.args[2] === null) {
		f.args[2] = 1;
	}
	if (iscultist(f.args[1])) {
		yield* this.invoke(f.args[1], 1);
		f.args[1].visible_message(`<span class='warning'>${f.args[1]} holds up ${this}, which explodes in a flash of red light!</span>`, `<span class='cultitalic'>You stun ${f.args[0]} with the talisman!</span>`);
		if (N = rt.locateIn(f, T("/obj/item/weapon/nullrod"), f.args[0])) {
			f.args[0].visible_message(`<span class='warning'>${f.args[0]}'s holy weapon absorbs the talisman's light!</span>`, "<span class='userdanger'>Your holy weapon absorbs the blinding light!</span>");
		} else {
			yield* f.args[0].Knockdown(200);
			yield* f.args[0].flash_act(1, 1);
			if (rt.istype(f.args[0], T("/mob/living/silicon"))) {
				yield* (S = f.args[0]).emp_act(1);
			} else if (rt.istype(f.args[0], T("/mob/living/carbon"))) {
				(C = f.args[0]).silent += 5;
				C.stuttering += 15;
				C.cultslurring += 15;
				C.Jitter(15);
			}
			if (is_servant_of_ratvar(f.args[0])) {
				yield* f.args[0].adjustBruteLoss(15);
			}
		}
		yield* f.args[1].drop_item();
		yield* qdel(this);
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true, { args: ["target", "user", "successfuluse"] });

rt.type(6572, "/obj/item/weapon/paper/talisman/armor", "/obj/item/weapon/paper/talisman", {
	cultist_name: "Talisman of Arming",
	cultist_desc: "A talisman that will equip the invoker with cultist equipment if there is a slot to equip it to.",
	invocation: "N'ath reth sh'yro eth draggathnor!",
	creation_time: 80,
	color: "#33cc33",
});

// talisman.dm:200
rt.def("/obj/item/weapon/paper/talisman/armor/proc/invoke", function* invoke(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 1;
	}
	f.dot = (yield* parent_proc());
	f.args[0].visible_message(`<span class='warning'>Otherworldly armor suddenly appears on ${f.args[0]}!</span>`, "<span class='cultitalic'>You speak the words of the talisman, arming yourself!</span>");
	yield* f.args[0].equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/head/culthood/alt"), f.args[0])), slot_head);
	yield* f.args[0].equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/suit/cultrobes/alt"), f.args[0])), slot_wear_suit);
	yield* f.args[0].equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/shoes/cult/alt"), f.args[0])), slot_shoes);
	yield* f.args[0].equip_to_slot_or_del((yield* new_(T("/obj/item/weapon/storage/backpack/cultpack"), f.args[0])), slot_back);
	yield* f.args[0].drop_item();
	yield* f.args[0].put_in_hands((yield* new_(T("/obj/item/weapon/melee/cultblade"), f.args[0])));
	yield* f.args[0].put_in_hands((yield* new_(T("/obj/item/weapon/restraints/legcuffs/bola/cult"), f.args[0])));
	return f.dot;
}, true, { args: ["user", "successfuluse"] });

// talisman.dm:212
rt.def("/obj/item/weapon/paper/talisman/armor/proc/attack", function* attack(f: Frame, target: Value, user: Value) {
	if (iscultist(user) && iscultist(target)) {
		yield* user.drop_item();
		yield* this.invoke(target);
		yield* qdel(this);
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(6573, "/obj/item/weapon/paper/talisman/horror", "/obj/item/weapon/paper/talisman", {
	cultist_name: "Talisman of Horrors",
	cultist_desc: "A talisman that will break the mind of the victim with nightmarish hallucinations.",
	invocation: "Lo'Nab Na'Dm!",
	creation_time: 80,
	color: "#ffb366",
});

// talisman.dm:229
rt.def("/obj/item/weapon/paper/talisman/horror/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value) {
	let H: Value = null;
	if (!(iscultist(user) && get_dist(user, target) < 7)) return f.dot;
	to_chat(user, `<span class='cultitalic'>You disturb ${target} with visions of madness!</span>`);
	if (rt.istype(target, T("/mob/living/carbon"))) {
		yield* (H = target).reagents.add_reagent("mindbreaker", 12);
		if (is_servant_of_ratvar(target)) {
			to_chat(target, "<span class='userdanger'>You see a brief but horrible vision of Ratvar, rusted and scrapped, being torn apart.</span>");
			yield* target.emote("scream");
			target.confused = max(0, target.confused + 3);
			yield* target.flash_act();
		}
	}
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(6574, "/obj/item/weapon/paper/talisman/construction", "/obj/item/weapon/paper/talisman", {
	cultist_name: "Talisman of Construction",
	cultist_desc: "Use this talisman on at least twenty-five metal sheets to create an empty construct shell",
	invocation: "Ethra p'ni dedol!",
	uses: 25,
	creation_time: 80,
	color: "#000000",
});

// talisman.dm:252
rt.def("/obj/item/weapon/paper/talisman/construction/proc/attack_self", function attack_self(f: Frame, user: Value) {
	if (iscultist(user)) {
		to_chat(user, "<span class='warning'>To use this talisman, place it upon a stack of metal sheets.</span>");
	} else {
		to_chat(user, "<span class='danger'>There are indecipherable images scrawled on the paper in what looks to be... <i>blood?</i></span>");
	}
	return f.dot;
});

// talisman.dm:259
rt.def("/obj/item/weapon/paper/talisman/construction/proc/attack", function* attack(f: Frame, M: Value, user: Value) {
	if (iscultist(user)) {
		to_chat(user, "<span class='cultitalic'>This talisman will only work on a stack of metal or plasteel sheets!</span>");
		log_game("Construct talisman failed - not a valid target");
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// talisman.dm:266
rt.def("/obj/item/weapon/paper/talisman/construction/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity_flag: Value, click_parameters: Value) {
	let quantity: Value = null;
	yield* parent_proc();
	if (!(proximity_flag && iscultist(user))) return f.dot;
	let _T: Value = rt.getStep(f, target, 0);
	if (rt.istype(target, T("/obj/item/stack/sheet/metal"))) {
		if (yield* target.use(25)) {
			yield* new_(T("/obj/structure/constructshell"), _T);
			to_chat(user, "<span class='warning'>The talisman clings to the metal and twists it into a construct shell!</span>");
			rt.op(f, "Output", [], [user, sound(rt.rsc("sound/effects/magic.ogg"), 0, 1, 25)], false);
			yield* this.invoke(user, 1);
			yield* qdel(this);
		} else {
			to_chat(user, "<span class='warning'>You need more metal to produce a construct shell!</span>");
		}
	} else if (rt.istype(target, T("/obj/item/stack/sheet/plasteel"))) {
		this.uses -= (quantity = min(target.amount, this.uses));
		yield* new_(T("/obj/item/stack/sheet/runed_metal"), _T, quantity);
		yield* target.use(quantity);
		to_chat(user, "<span class='warning'>The talisman clings to the plasteel, transforming it into runed metal!</span>");
		rt.op(f, "Output", [], [user, sound(rt.rsc("sound/effects/magic.ogg"), 0, 1, 25)], false);
		yield* this.invoke(user, 1);
		if (this.uses <= 0) {
			yield* qdel(this);
		}
	} else {
		to_chat(user, "<span class='warning'>The talisman must be used on metal or plasteel!</span>");
	}
	return f.dot;
}, true);

rt.type(6575, "/obj/item/weapon/paper/talisman/shackle", "/obj/item/weapon/paper/talisman", {
	cultist_name: "Talisman of Shackling",
	cultist_desc: "Use this talisman on a victim to handcuff them with dark bindings.",
	invocation: "In'totum Lig'abis!",
	uses: 6,
	color: "#B27300",
});

// talisman.dm:302
rt.def("/obj/item/weapon/paper/talisman/shackle/proc/invoke", function* invoke(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (f.args[1]) {
		return (yield* parent_proc());
	}
	if (iscultist(f.args[0])) {
		to_chat(f.args[0], "<span class='warning'>To use this talisman, attack the target directly.</span>");
	} else {
		to_chat(f.args[0], "<span class='danger'>There are indecipherable images scrawled on the paper in what looks to be... <i>blood?</i></span>");
	}
	return 0;
}, true, { args: ["user", "successfuluse"] });

// talisman.dm:310
rt.def("/obj/item/weapon/paper/talisman/shackle/proc/attack", function* attack(f: Frame, target: Value, user: Value) {
	if (iscultist(user) && rt.istype(target, T("/mob/living/carbon"))) {
		if (target.stat == 2) {
			user.visible_message("<span class='cultitalic'>This talisman's magic does not affect the dead!</span>");
			return f.dot;
		}
		yield* this.CuffAttack(target, user);
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// talisman.dm:319
rt.def("/obj/item/weapon/paper/talisman/shackle/proc/CuffAttack", function* CuffAttack(f: Frame, C: Value, user: Value) {
	if (!C.handcuffed) {
		yield* this.invoke(user, 1);
		playsound(this.loc, rt.rsc("sound/weapons/cablecuff.ogg"), 30, 1, -2);
		C.visible_message(`<span class='danger'>${user} begins restraining ${C} with dark magic!</span>`, `<span class='userdanger'>${user} begins shaping a dark magic around your wrists!</span>`);
		if (yield* do_mob(user, C, 30)) {
			if (!C.handcuffed) {
				C.handcuffed = (yield* new_(T("/obj/item/weapon/restraints/handcuffs/energy/cult/used"), C));
				yield* C.update_handcuffed();
				to_chat(user, `<span class='notice'>You shackle ${C}.</span>`);
				add_logs(user, C, "handcuffed");
				this.uses--;
			} else {
				to_chat(user, `<span class='warning'>${C} is already bound.</span>`);
			}
		} else {
			to_chat(user, `<span class='warning'>You fail to shackle ${C}.</span>`);
		}
	} else {
		to_chat(user, `<span class='warning'>${C} is already bound.</span>`);
	}
	if (!(this.uses <= 0)) return f.dot;
	yield* user.drop_item();
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(5778, "/obj/item/weapon/restraints/handcuffs/energy/cult/used", "/obj/item/weapon/restraints/handcuffs/energy/cult", {});

// talisman.dm:349
rt.def("/obj/item/weapon/restraints/handcuffs/energy/cult/used/proc/dropped", function* dropped(f: Frame, user: Value) {
	user.visible_message(`<span class='danger'>${user}'s shackles shatter in a discharge of dark magic!</span>`, `<span class='userdanger'>Your ${this} shatters in a discharge of dark magic!</span>`);
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);
