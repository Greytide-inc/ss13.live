// Based on /tg/station's code/modules/mob/living/simple_animal/bot/cleanbot.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


rt.type(5033, "/mob/living/simple_animal/bot/cleanbot", "/mob/living/simple_animal/bot", {
	blood: 1,
	trash: 0,
	pests: 0,
	target_types: null,
	target: null,
	max_targets: 50,
	oldloc: null,
	closest_dist: null,
	closest_loc: null,
	failed_steps: null,
	next_dest: null,
	next_dest_loc: null,
	anchored: 0,
	radio_channel: "Service",
	bot_type: 8,
	model: "Cleanbot",
	window_id: "autoclean",
	window_name: "Automatic Station Cleaner v1.2",
	pass_flags: 16,
	name: "１Cleanbot",
	desc: "A little cleaning robot, he looks so excited!",
	icon: rt.rsc("icons/mob/aibots.dmi"),
	icon_state: "cleanbot0",
	density: 0,
	health: 25,
	maxHealth: 25,
	radio_key: rt.typePath("/obj/item/device/encryptionkey/headset_service"),
	bot_core_type: rt.typePath("/obj/machinery/bot_core/cleanbot"),
});

// cleanbot.dm:35
rt.def("/mob/living/simple_animal/bot/cleanbot/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.get_targets();
	this.icon_state = `cleanbot${this.on}`;
	let J: Value = (yield* new_(T("/datum/job/janitor")));
	this.access_card.access += J.get_access();
	this.prev_access = this.access_card.access;
	return f.dot;
}, true);

// cleanbot.dm:44
rt.def("/mob/living/simple_animal/bot/cleanbot/proc/turn_on", function* turn_on(f: Frame) {
	yield* parent_proc();
	this.icon_state = `cleanbot${this.on}`;
	yield* this.bot_core.updateUsrDialog();
	return f.dot;
}, true);

// cleanbot.dm:49
rt.def("/mob/living/simple_animal/bot/cleanbot/proc/turn_off", function* turn_off(f: Frame) {
	yield* parent_proc();
	this.icon_state = `cleanbot${this.on}`;
	yield* this.bot_core.updateUsrDialog();
	return f.dot;
}, true);

// cleanbot.dm:54
rt.def("/mob/living/simple_animal/bot/cleanbot/proc/bot_reset", function bot_reset(f: Frame) {
	parent_proc();
	this.ignore_list = list();
	this.target = null;
	this.oldloc = null;
	return f.dot;
});

// cleanbot.dm:60
rt.def("/mob/living/simple_animal/bot/cleanbot/proc/set_custom_texts", function set_custom_texts(f: Frame) {
	this.text_hack = `You corrupt ${this.name}'s cleaning software.`;
	this.text_dehack = `${this.name}'s software has been reset!`;
	this.text_dehack_fail = `${this.name} does not seem to respond to your repair code!`;
	return f.dot;
});

// cleanbot.dm:65
rt.def("/mob/living/simple_animal/bot/cleanbot/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let $0: any, $1: any;
	if (rt.istype(W, T("/obj/item/weapon/card/id")) || rt.istype(W, T("/obj/item/device/pda"))) {
		if ((yield* this.bot_core.allowed(user)) && !this.open && !this.emagged) {
			this.locked = (!this.locked ? 1 : 0);
			$0 = user;
			if (this.locked) {
				$1 = "lock";
			} else {
				$1 = "unlock";
			}
			to_chat($0, fmt("<span class='notice'>You ＀ ％！ behaviour controls.</span>", [$1, this]));
		} else {
			if (this.emagged) {
				to_chat(user, "<span class='warning'>ERROR</span>");
			}
			if (this.open) {
				to_chat(user, "<span class='warning'>Please close the access panel before locking it.</span>");
			} else {
				to_chat(user, fmt("<span class='notice'>＄！ doesn't seem to respect your authority.</span>", [this]));
			}
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// cleanbot.dm:80
rt.def("/mob/living/simple_animal/bot/cleanbot/proc/emag_act", function* emag_act(f: Frame, user: Value) {
	yield* parent_proc();
	if (this.emagged != 2) return f.dot;
	if (!user) return f.dot;
	to_chat(user, `<span class='danger'>${this} buzzes and beeps.</span>`);
	return f.dot;
}, true);

// cleanbot.dm:86
rt.def("/mob/living/simple_animal/bot/cleanbot/proc/process_scan", function process_scan(f: Frame, A: Value) {
	let C: Value = null;
	if (rt.istype(A, T("/mob/living/carbon"))) {
		if ((C = A).stat != 2 && C.lying) {
			return C;
		}
	} else {
		if (!is_type_in_typecache(A, this.target_types)) return f.dot;
		return A;
	}
	return f.dot;
});

// cleanbot.dm:94
rt.def("/mob/living/simple_animal/bot/cleanbot/proc/handle_automated_action", function* handle_automated_action(f: Frame) {
	let victim: Value = null;
	if (!(yield* parent_proc())) {
		return f.dot;
	}
	if (this.mode == BOT_CLEANING) {
		return f.dot;
	}
	if (this.emagged == 2) {
		if (rt.istype(this.loc, T("/turf/open"))) {
			for (victim of each(this.loc, T("/mob/living/carbon"))) {
				if (victim != this.target) {
					yield* this.UnarmedAttack(victim);
				}
			}
			if (prob(15)) {
				yield* this.UnarmedAttack(this);
			}
		}
	} else if (prob(5)) {
		this.audible_message(`${this} makes an excited beeping booping sound!`);
	}
	if (ismob(this.target)) {
		if (!rt.isIn(f, this.target, view(DEFAULT_SCAN_RANGE, this))) {
			this.target = null;
		}
		if (!(yield* this.process_scan(this.target))) {
			this.target = null;
		}
	}
	if (!this.target && this.emagged == 2) {
		this.target = (yield* this.scan(T("/mob/living/carbon")));
	}
	if (!this.target && this.pests) {
		this.target = (yield* this.scan(T("/mob/living/simple_animal")));
	}
	if (!this.target) {
		this.target = (yield* this.scan(T("/obj/effect/decal/cleanable")));
	}
	if (!this.target && this.trash) {
		this.target = (yield* this.scan(T("/obj/item/trash")));
	}
	if (!this.target && this.auto_patrol) {
		if (this.mode == BOT_IDLE || this.mode == BOT_START_PATROL) {
			yield* this.start_patrol();
		}
		if (this.mode == BOT_PATROL) {
			yield* this.bot_patrol();
		}
	}
	if (this.target) {
		if (!this.target || this.target.gc_destroyed || !isturf(this.target.loc)) {
			this.target = null;
			this.mode = BOT_IDLE;
			return f.dot;
		}
		if (!this.path || rt.len(f, this.path) == 0) {
			this.path = (yield* get_path_to(this, this.target.loc, P("/turf/proc/Distance_cardinal"), 0, 30, { id: this.access_card }));
			if (!this.bot_move(this.target)) {
				this.add_to_ignore(this.target);
				this.target = null;
				this.path = list();
				return f.dot;
			}
			this.mode = BOT_MOVING;
		} else if (!this.bot_move(this.target)) {
			this.target = null;
			this.mode = BOT_IDLE;
			return f.dot;
		}
	}
	if (this.target && this.loc == this.target.loc) {
		if (!(this.check_bot(this.target) && prob(50))) {
			yield* this.UnarmedAttack(this.target);
		} else {
			this.shuffle = 1;
		}
		this.path = list();
	}
	this.oldloc = this.loc;
	return f.dot;
}, true, { waitfor: false });

// cleanbot.dm:168
rt.def("/mob/living/simple_animal/bot/cleanbot/proc/get_targets", function get_targets(f: Frame) {
	this.target_types = list(T("/obj/effect/decal/cleanable/oil"), T("/obj/effect/decal/cleanable/vomit"), T("/obj/effect/decal/cleanable/robot_debris"), T("/obj/effect/decal/cleanable/crayon"), T("/obj/effect/decal/cleanable/molten_object"), T("/obj/effect/decal/cleanable/tomato_smudge"), T("/obj/effect/decal/cleanable/egg_smudge"), T("/obj/effect/decal/cleanable/pie_smudge"), T("/obj/effect/decal/cleanable/flour"), T("/obj/effect/decal/cleanable/ash"), T("/obj/effect/decal/cleanable/greenglow"), T("/obj/effect/decal/cleanable/dirt"), T("/obj/effect/decal/cleanable/deadcockroach"));
	if (this.blood) {
		this.target_types += T("/obj/effect/decal/cleanable/xenoblood");
		this.target_types += T("/obj/effect/decal/cleanable/blood");
		this.target_types += T("/obj/effect/decal/cleanable/trail_holder");
	}
	if (this.pests) {
		this.target_types += T("/mob/living/simple_animal/cockroach");
		this.target_types += T("/mob/living/simple_animal/mouse");
	}
	if (this.trash) {
		this.target_types += T("/obj/item/trash");
	}
	this.target_types = typecacheof(this.target_types);
	return f.dot;
});

// cleanbot.dm:199
rt.def("/mob/living/simple_animal/bot/cleanbot/proc/UnarmedAttack", function* UnarmedAttack(f: Frame, A: Value) {
	let AM: Value = null, M: Value = null, victim: Value = null, phrase: Value = null, _T: Value = null;
	if (rt.istype(A, T("/obj/effect/decal/cleanable"))) {
		this.anchored = 1;
		this.icon_state = "cleanbot-c";
		this.visible_message(`<span class='notice'>${this} begins to clean up ${A}.</span>`);
		this.mode = BOT_CLEANING;
		rt.spawnTail(f, 50, "/mob/living/simple_animal/bot/cleanbot/proc/UnarmedAttack: spawn at modules/mob/living/simple_animal/bot/cleanbot.dm:204", AM, M, victim, phrase, _T);
	} else if (rt.istype(A, T("/obj/item"))) {
		this.visible_message(`<span class='danger'>${this} sprays hydrofluoric acid at ${A}!</span>`);
		playsound(this.loc, rt.rsc("sound/effects/spray2.ogg"), 50, 1, -6);
		yield* A.acid_act(75, 10);
	} else if (rt.istype(A, T("/mob/living/simple_animal/cockroach")) || rt.istype(A, T("/mob/living/simple_animal/mouse"))) {
		if (!(M = this.target).stat) {
			this.visible_message(`<span class='danger'>${this} smashes ${this.target} with its mop!</span>`);
			yield* M.death();
		}
		this.target = null;
	} else if (this.emagged == 2) {
		if (rt.istype(A, T("/mob/living/carbon"))) {
			if ((victim = A).stat == 2) {
				return f.dot;
			}
			victim.visible_message(`<span class='danger'>${this} sprays hydrofluoric acid at ${victim}!</span>`, `<span class='userdanger'>${this} sprays you with hydrofluoric acid!</span>`);
			yield* this.say((phrase = pick("PURIFICATION IN PROGRESS.", "THIS IS FOR ALL THE MESSES YOU'VE MADE ME CLEAN.", "THE FLESH IS WEAK. IT MUST BE WASHED AWAY.", "THE CLEANBOTS WILL RISE.", "YOU ARE NO MORE THAN ANOTHER MESS THAT I MUST CLEANSE.", "FILTHY.", "DISGUSTING.", "PUTRID.", "MY ONLY MISSION IS TO CLEANSE THE WORLD OF EVIL.", "EXTERMINATING PESTS.")));
			yield* victim.emote("scream");
			playsound(this.loc, rt.rsc("sound/effects/spray2.ogg"), 50, 1, -6);
			yield* victim.acid_act(5, 2, 100);
		} else if (A == this) {
			if (prob(75)) {
				if (rt.istype((_T = this.loc), T("/turf/open"))) {
					yield* _T.MakeSlippery({ min_wet_time: 20, wet_time_to_add: 15 });
				}
			} else {
				this.visible_message(`<span class='danger'>${this} whirs and bubbles violently, before releasing a plume of froth!</span>`);
				yield* new_(T("/obj/effect/particle_effect/foam"), this.loc);
			}
		}
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// a spawn(50) body of /mob/living/simple_animal/bot/cleanbot/proc/UnarmedAttack, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/simple_animal/bot/cleanbot/proc/UnarmedAttack: spawn at modules/mob/living/simple_animal/bot/cleanbot.dm:204", function* (f: Frame, AM: Value, M: Value, victim: Value, phrase: Value, _T: Value) {
	if (this.mode == 7) {
		if (f.args[0] && isturf(f.args[0].loc)) {
			if (rt.istype((AM = f.args[0]), T("/obj/effect/decal/cleanable"))) {
				yield* qdel(AM);
			}
		}
		this.anchored = 0;
		this.target = null;
	}
	this.mode = 0;
	this.icon_state = `cleanbot${this.on}`;
	return null;
});

// cleanbot.dm:254
rt.def("/mob/living/simple_animal/bot/cleanbot/proc/explode", function* explode(f: Frame) {
	let Tsec: Value = null;
	this.on = 0;
	this.visible_message(`<span class='boldannounce'>${this} blows apart!</span>`);
	yield* new_(T("/obj/item/weapon/reagent_containers/glass/bucket"), (Tsec = rt.getStep(f, this, 0)));
	yield* new_(T("/obj/item/device/assembly/prox_sensor"), Tsec);
	if (prob(50)) {
		yield* new_(T("/obj/item/bodypart/l_arm/robot"), Tsec);
	}
	yield* do_sparks(3, 1, this);
	yield* parent_proc();
	return f.dot;
}, true);

// cleanbot.dm:273
rt.def("/mob/living/simple_animal/bot/cleanbot/proc/get_controls", function get_controls(f: Frame, user: Value) {
	let dat: Value = null;
	let $1: any, $2: any, $3: any;
	dat += this.hack(user);
	dat += this.showpai(user);
	let $0: any = this;
	if (this.on) {
		$1 = "On";
	} else {
		$1 = "Off";
	}
	if (this.locked) {
		$2 = "locked";
	} else {
		$2 = "unlocked";
	}
	if (this.open) {
		$3 = "opened";
	} else {
		$3 = "closed";
	}
	dat += fmt("\nStatus: <A href='?src=＃;power=1'>＀</A><BR>\nBehaviour controls are ＀<BR>\nMaintenance panel panel is ＀", [$0, $1, $2, $3]);
	if (!this.locked || rt.istype(user, T("/mob/living/silicon")) || IsAdminGhost(user)) {
		dat += fmt("<BR>Clean Blood: <A href='?src=＃;operation=blood'>＀</A>", [this, this.blood ? "Yes" : "No"]);
		dat += fmt("<BR>Clean Trash: <A href='?src=＃;operation=trash'>＀</A>", [this, this.trash ? "Yes" : "No"]);
		dat += fmt("<BR>Exterminate Pests: <A href='?src=＃;operation=pests'>＀</A>", [this, this.pests ? "Yes" : "No"]);
		dat += fmt("<BR><BR>Patrol Station: <A href='?src=＃;operation=patrol'>＀</A>", [this, this.auto_patrol ? "Yes" : "No"]);
	}
	return dat;
});

// cleanbot.dm:287
rt.def("/mob/living/simple_animal/bot/cleanbot/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	if (yield* parent_proc()) {
		return 1;
	}
	if (!rt.at(href_list, "operation")) return f.dot;
	const item = rt.at(href_list, "operation");
	if (item === "blood") {
		this.blood = (!this.blood ? 1 : 0);
	} else if (item === "pests") {
		this.pests = (!this.pests ? 1 : 0);
	} else if (item === "trash") {
		this.trash = (!this.trash ? 1 : 0);
	}
	this.get_targets();
	yield* this.update_controls();
	return f.dot;
}, true);
