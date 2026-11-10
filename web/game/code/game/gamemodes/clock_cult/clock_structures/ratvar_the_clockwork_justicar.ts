// Based on /tg/station's code/game/gamemodes/clock_cult/clock_structures/ratvar_the_clockwork_justicar.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


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

// ratvar_the_clockwork_justicar.dm:21
rt.def("/obj/structure/destructible/clockwork/massive/ratvar/proc/Initialize", function* Initialize(f: Frame) {
	let O: Value = null;
	f.dot = (yield* parent_proc());
	GLOB.ratvar_awakens++;
	for (O of each(GLOB.all_clockwork_objects, T("/obj"))) {
		yield* O.ratvar_act();
	}
	if (!this.isprocessing) {
		this.isprocessing = 1;
		GLOB.SSobj.processing += this;
	}
	send_to_playing_players(`<span class='ratvar'>"${text2ratvar("ONCE AGAIN MY LIGHT SHALL SHINE ACROSS THIS PATHETIC REALM")}!!"</span>`);
	sound_to_playing_players(rt.rsc("sound/effects/ratvar_reveal.ogg"));
	let alert_overlay: Value = mutable_appearance(rt.rsc("icons/effects/clockwork_effects.dmi"), "ratvar_alert");
	let A: Value = get_area(this);
	yield* notify_ghosts(`The Justiciar's light calls to you! Reach out to Ratvar in ${A.name} to be granted a shell to spread his glory!`, null, { source: this, alert_overlay: alert_overlay });
	yield* ImmediateInvokeAsync(GLOB.SSshuttle.emergency, P("/obj/docking_port/mobile/emergency/proc/request"), null, 0, null, 0, 0);
	return f.dot;
}, true);

// ratvar_the_clockwork_justicar.dm:34
rt.def("/obj/structure/destructible/clockwork/massive/ratvar/proc/Destroy", function* Destroy(f: Frame) {
	let O: Value = null;
	GLOB.ratvar_awakens--;
	for (O of each(GLOB.all_clockwork_objects, T("/obj"))) {
		yield* O.ratvar_act();
	}
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	send_to_playing_players("<span class='heavy_brass'><font size=6>\"NO! I will not... be...</font> <font size=5>banished...</font> <font size=4>again...\"</font></span>");
	return (yield* parent_proc());
}, true);

// ratvar_the_clockwork_justicar.dm:42
rt.def("/obj/structure/destructible/clockwork/massive/ratvar/proc/attack_ghost", function* attack_ghost(f: Frame, O: Value) {
	let alertresult: Value = null, R: Value = null;
	if ((alertresult = (yield* alert(O, "Embrace the Justiciar's light? You can no longer be cloned!", null, "Yes", "No"))) == "No" || !O || O.gc_destroyed || !rt.istype(O, T("/mob/dead/observer")) || !O.key) {
		return 0;
	}
	(R = (yield* new_(T("/mob/living/simple_animal/drone/cogscarab/ratvar"), rt.getStep(f, this, 0)))).visible_message(`<span class='heavy_brass'>${R} forms, and its eyes blink open, glowing bright red!</span>`);
	R.key = O.key;
	return f.dot;
}, true);

// ratvar_the_clockwork_justicar.dm:50
rt.def("/obj/structure/destructible/clockwork/massive/ratvar/proc/Bump", function* Bump(f: Frame, A: Value) {
	let _T: Value = null;
	if ((_T = rt.getStep(f, A, 0)) == this.loc) {
		_T = rt.getStep(f, _T, this.dir);
	}
	yield* this.forceMove(_T);
	return f.dot;
}, true);

// ratvar_the_clockwork_justicar.dm:61
rt.def("/obj/structure/destructible/clockwork/massive/ratvar/proc/process", function* process(f: Frame) {
	let I: Value = null, _T: Value = null, L: Value = null;
	if (this.clashing) {
		return f.dot;
	}
	for (I of each(circlerangeturfs(this, this.convert_range))) {
		yield* (_T = I).ratvar_act();
	}
	I = null;
	for (I of each(circleviewturfs(this, round(this.convert_range * 0.5)))) {
		yield* (_T = I).ratvar_act(1);
	}
	let dir_to_step_in: Value = pick(GLOB.cardinal);
	let meals: Value = list();
	for (L of each(GLOB.living_mob_list, T("/mob/living"))) {
		if (L.z == this.z && !is_servant_of_ratvar(L) && L.mind) {
			meals += L;
		}
	}
	if (GLOB.cult_narsie && GLOB.cult_narsie.z == this.z) {
		meals = list(GLOB.cult_narsie);
		this.prey = GLOB.cult_narsie;
		if (get_dist(this, this.prey) <= 10) {
			yield* this.clash();
			return f.dot;
		}
	}
	if (!this.prey) {
		if (!this.prey && rt.length(meals)) {
			L = this.prey;
			this.prey = pick(meals);
			to_chat(this.prey, "<span class='heavy_brass'><font size=5>\"You will do, heretic.\"</font></span>\n<span class='userdanger'>You feel something massive turn its crushing focus to you...</span>");
			yield* L.playsound_local(this.prey, rt.rsc("sound/effects/ratvar_reveal.ogg"), 100, 0, { pressure_affected: 0 });
		}
	} else if (!rt.istype(this.prey, T("/obj/singularity/narsie")) && prob(10) && rt.length(meals) > 1 || this.prey.z != this.z || !rt.isIn(f, this.prey, meals)) {
		if (is_servant_of_ratvar(this.prey)) {
			to_chat(this.prey, "<span class='heavy_brass'><font size=5>\"Serve me well.\"</font></span>\n<span class='big_brass'>You feel great joy as your god turns His eye to another heretic...</span>");
		} else {
			to_chat(this.prey, "<span class='heavy_brass'><font size=5>\"No matter. I will find you later, heretic.\"</font></span>\n<span class='userdanger'>You feel tremendous relief as the crushing focus relents...</span>");
		}
		this.prey = null;
	} else {
		dir_to_step_in = rt.getDir(f, this, this.prey);
	}
	yield* step(this, dir_to_step_in);
	return f.dot;
}, true, { waitfor: false });

// ratvar_the_clockwork_justicar.dm:99
rt.def("/obj/structure/destructible/clockwork/massive/ratvar/proc/clash", function* clash(f: Frame) {
	if (this.clashing || this.prey != GLOB.cult_narsie) {
		return f.dot;
	}
	this.clashing = 1;
	GLOB.cult_narsie.clashing = 1;
	to_chat(rt.world(), `<span class='heavy_brass'><font size=5>"${pick("BLOOD GOD!!!", "NAR-SIE!!!", "AT LAST, YOUR TIME HAS COME!")}"</font></span>`);
	to_chat(rt.world(), "<span class='cult'><font size=5>\"<b>Ratvar?! How?!</b>\"</font></span>");
	yield* this.clash_of_the_titans(GLOB.cult_narsie);
	return 1;
}, true);

// ratvar_the_clockwork_justicar.dm:110
rt.def("/obj/structure/destructible/clockwork/massive/ratvar/proc/clash_of_the_titans", function* clash_of_the_titans(f: Frame, narsie: Value) {
	let M: Value = null, ratvar_chance: Value = null, narsie_chance: Value = null, M_4: Value = null;
	let $e: any;
	let winner: Value = "Undeclared";
	let base_victory_chance: Value = 1;
	while (this && narsie) {
		sound_to_playing_players(rt.rsc("sound/magic/clockwork/ratvar_attack.ogg"));
		yield* sleep(5.2);
		M = null;
		for (M of each(GLOB.mob_list, T("/mob"))) {
			if (!rt.istype(M, T("/mob/dead/new_player"))) {
				yield* flash_color(M, { flash_color: "#966400", flash_time: 1 });
				shake_camera(M, 4, 3);
			}
		}
		ratvar_chance = min(rt.length(GLOB.SSticker.mode.servants_of_ratvar), 50);
		narsie_chance = min(rt.length(GLOB.SSticker.mode.cult), 50);
		ratvar_chance = rand(base_victory_chance, ratvar_chance);
		narsie_chance = rand(base_victory_chance, narsie_chance);
		if (ratvar_chance > narsie_chance) {
			winner = "Ratvar";
			break;
		}
		yield* sleep(rand(2, 5));
		sound_to_playing_players(rt.rsc("sound/magic/clockwork/narsie_attack.ogg"));
		yield* sleep(7.4);
		M_4 = null;
		for (M_4 of each(GLOB.mob_list, T("/mob"))) {
			if (!rt.istype(M_4, T("/mob/dead/new_player"))) {
				yield* flash_color(M_4, { flash_color: "#C80000", flash_time: 1 });
				shake_camera(M_4, 4, 3);
			}
		}
		if (narsie_chance > ratvar_chance) {
			winner = "Nar-Sie";
			break;
		}
		base_victory_chance *= 2;
	}
	if (winner === "Ratvar") {
		send_to_playing_players(`<span class='heavy_brass'><font size=5>"${pick("DIE! DIE! DIE!", "FILTH!!!", "SUFFER!!!", text2ratvar("ROT FOR CENTURIES AS I HAVE!!"))}"</font></span>\n<span class='cult'><font size=5>"<b>${pick("Nooooo...", "Not die. To y-", "Die. Ratv-", "Sas tyen re-")}"</b></font></span>`);
		sound_to_playing_players(rt.rsc("sound/magic/clockwork/anima_fragment_attack.ogg"));
		sound_to_playing_players(rt.rsc("sound/magic/demon_dies.ogg"), 50);
		this.clashing = 0;
		yield* qdel(narsie);
	} else if (winner === "Nar-Sie") {
		send_to_playing_players(`<span class='cult'><font size=5>"<b>${pick("Ha.", "Ra'sha fonn dest.", "You fool. To come here.")}</b>"</font></span>`);
		sound_to_playing_players(rt.rsc("sound/magic/demon_attack1.ogg"));
		sound_to_playing_players(rt.rsc("sound/magic/clockwork/anima_fragment_death.ogg"), 50);
		narsie.clashing = 0;
		yield* qdel(this);
	}
	return f.dot;
}, true);
