// Based on /tg/station's code/game/gamemodes/miniantags/abduction/machinery/experiment.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


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

// experiment.dm:17
rt.def("/obj/machinery/abductor/experiment/proc/MouseDrop_T", function* MouseDrop_T(f: Frame, target: Value, user: Value) {
	if (user.stat || user.lying || !this.Adjacent(user) || !target.Adjacent(user) || !rt.istype(target, T("/mob/living/carbon/human"))) {
		return f.dot;
	}
	if (is_species(target, T("/datum/species/abductor"))) {
		return f.dot;
	}
	yield* this.close_machine(target);
	return f.dot;
}, true);

// experiment.dm:24
rt.def("/obj/machinery/abductor/experiment/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	yield* this.experimentUI(user);
	return f.dot;
}, true);

// experiment.dm:30
rt.def("/obj/machinery/abductor/experiment/proc/open_machine", function* open_machine(f: Frame) {
	if (!(!this.state_open && !this.panel_open)) return f.dot;
	yield* parent_proc();
	return f.dot;
}, true);

// experiment.dm:34
rt.def("/obj/machinery/abductor/experiment/proc/close_machine", function* close_machine(f: Frame, target: Value) {
	let A: Value = null;
	for (A of each(this.loc)) {
		if (is_species(A, T("/datum/species/abductor"))) {
			return f.dot;
		}
	}
	if (!(this.state_open && !this.panel_open)) return f.dot;
	yield* parent_proc(target);
	return f.dot;
}, true);

// experiment.dm:41
rt.def("/obj/machinery/abductor/experiment/proc/relaymove", function* relaymove(f: Frame, user: Value) {
	if (user.stat != 0) {
		return f.dot;
	}
	yield* this.container_resist(user);
	return f.dot;
}, true);

// experiment.dm:47
rt.def("/obj/machinery/abductor/experiment/proc/container_resist", function* container_resist(f: Frame, user: Value) {
	let breakout_time: Value = 600;
	user.changeNext_move(100);
	user.last_special = rt.worldTime(f) + 100;
	to_chat(user, `<span class='notice'>You lean on the back of ${this} and start pushing the door open... (this will take about a minute.)</span>`);
	user.visible_message(`<span class='italics'>You hear a metallic creaking from ${this}!</span>`);
	if (!(yield* do_after(user, breakout_time, { target: this }))) return f.dot;
	if (!user || user.stat != 0 || user.loc != this || this.state_open) {
		return f.dot;
	}
	this.visible_message(`<span class='warning'>${user} successfully broke out of ${this}!</span>`);
	to_chat(user, `<span class='notice'>You successfully break out of ${this}!</span>`);
	yield* this.open_machine();
	return f.dot;
}, true);

// experiment.dm:64
rt.def("/obj/machinery/abductor/experiment/proc/dissection_icon", function dissection_icon(f: Frame, H: Value) {
	let photo: Value = null, eyes: Value = null, S: Value = null, hair: Value = null, facial: Value = null;
	let _g: Value = H.gender == "female" ? "f" : "m";
	if (!GLOB.config.mutant_races || H.dna.species.use_skintones) {
		photo = icon({ icon: rt.rsc("icons/mob/human.dmi"), icon_state: `${H.skin_tone}_${_g}` });
	} else {
		(photo = icon({ icon: rt.rsc("icons/mob/human.dmi"), icon_state: `${H.dna.species.id}_${_g}` })).Blend(`#${rt.index(H.dna.features, "mcolor")}`, 2);
	}
	if (rt.isIn(f, EYECOLOR, H.dna.species.species_traits)) {
		(eyes = icon({ icon: rt.rsc("icons/mob/human_face.dmi"), icon_state: "eyes" })).Blend(`#${H.eye_color}`, 2);
	}
	if ((S = rt.index(GLOB.hair_styles_list, H.hair_style)) && rt.isIn(f, 2, H.dna.species.species_traits)) {
		(hair = icon({ icon: S.icon, icon_state: `${S.icon_state}` })).Blend(`#${H.hair_color}`, 2);
		eyes.Blend(hair, 3);
	}
	if ((S = rt.index(GLOB.facial_hair_styles_list, H.facial_hair_style)) && rt.isIn(f, 3, H.dna.species.species_traits)) {
		(facial = icon({ icon: S.icon, icon_state: `${S.icon_state}` })).Blend(`#${H.facial_hair_color}`, 2);
		eyes.Blend(facial, 3);
	}
	if (eyes) {
		photo.Blend(eyes, 3);
	}
	let splat: Value = icon({ icon: rt.rsc("icons/mob/dam_mob.dmi"), icon_state: "chest30" });
	photo.Blend(splat, 3);
	return photo;
});

// experiment.dm:99
rt.def("/obj/machinery/abductor/experiment/proc/experimentUI", function* experimentUI(f: Frame, user: Value) {
	let dat: Value = null, _P: Value = null, mob_occupant: Value = null, popup: Value = null;
	dat += "<h3> Experiment </h3>";
	if (this.occupant) {
		(_P = (yield* new_(T("/obj/item/weapon/photo")))).photocreate(null, (yield* icon(this.dissection_icon(this.occupant), { dir: 2 })));
		rt.op(f, "BrowseResource", [], [user, _P.img, "dissection_img"], false);
		dat += "<table><tr><td>";
		dat += "<img src=dissection_img height=80 width=80>";
		dat += "</td><td>";
		dat += fmt("<a href='?src=＃;experiment=1'>Probe</a><br>", [this]);
		dat += fmt("<a href='?src=＃;experiment=2'>Dissect</a><br>", [this]);
		dat += fmt("<a href='?src=＃;experiment=3'>Analyze</a><br>", [this]);
		dat += "</td></tr></table>";
	} else {
		dat += "<span class='linkOff'>Experiment </span>";
	}
	if (!this.occupant) {
		dat += "<h3>Machine Unoccupied</h3>";
	} else {
		dat += "<h3>Subject Status : </h3>";
		dat += `${this.occupant.name} => `;
		const stat_2 = (mob_occupant = this.occupant).stat;
		if (stat_2 === 0) {
			dat += "<span class='good'>Conscious</span>";
		} else if (stat_2 === 1) {
			dat += "<span class='average'>Unconscious</span>";
		} else {
			dat += "<span class='bad'>Deceased</span>";
		}
	}
	dat += "<br>";
	dat += `${this.flash}`;
	dat += "<br>";
	dat += fmt("<a href='?src=＃;refresh=1'>Scan</a>", [this]);
	let $0: any = this;
	dat += fmt("<a href='?src=＃;＀", [$0, this.state_open ? "close=1'>Close</a>" : "open=1'>Open</a>"]);
	(popup = (yield* new_(T("/datum/browser"), user, "experiment", "Probing Console", 300, 300))).set_title_image(user.browse_rsc_icon(this.icon, this.icon_state));
	popup.set_content(dat);
	yield* popup.open();
	return f.dot;
}, true);

// experiment.dm:138
rt.def("/obj/machinery/abductor/experiment/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let mob_occupant: Value = null;
	if ((yield* parent_proc()) || f.usr == this.occupant) {
		return f.dot;
	}
	yield* f.usr.set_machine(this);
	if (rt.at(href_list, "refresh")) {
		yield* this.updateUsrDialog();
		return f.dot;
	}
	if (rt.at(href_list, "open")) {
		yield* this.open_machine();
		return f.dot;
	}
	if (rt.at(href_list, "close")) {
		yield* this.close_machine();
		return f.dot;
	}
	if (this.occupant) {
		if ((mob_occupant = this.occupant).stat != 2) {
			if (rt.at(href_list, "experiment")) {
				this.flash = (yield* this.Experiment(this.occupant, rt.at(href_list, "experiment")));
			}
		}
	}
	yield* this.updateUsrDialog();
	yield* this.add_fingerprint(f.usr);
	return f.dot;
}, true);

// experiment.dm:159
rt.def("/obj/machinery/abductor/experiment/proc/Experiment", function* Experiment(f: Frame, occupant: Value, type: Value) {
	let GlandTest: Value = null, objtype: Value = null, O: Value = null, G: Value = null;
	let $0: any, $e: any;
	if (!this.history) {
		this.history = list();
	}
	let H: Value = occupant;
	let point_reward: Value = 0;
	if (rt.isIn(f, H, this.history)) {
		return "<span class='bad'>Specimen already in database.</span>";
	}
	if (H.stat == 2) {
		yield* this.say("Specimen deceased - please provide fresh sample.");
		return "<span class='bad'>Specimen deceased.</span>";
	}
	if (!(GlandTest = rt.locateIn(f, T("/obj/item/organ/heart/gland"), H.internal_organs))) {
		yield* this.say("Experimental dissection not detected!");
		return "<span class='bad'>No glands detected!</span>";
	}
	if (H.mind !== null && H.ckey !== null) {
		if (!this.abductee_minds) {
			this.abductee_minds = list();
		}
		if (!this.history) {
			this.history = list();
		}
		this.history += H;
		if (!this.abductee_minds) {
			this.abductee_minds = list();
		}
		this.abductee_minds += H.mind;
		yield* this.say("Processing specimen...");
		yield* sleep(5);
		$0 = text2num(type);
		if ($0 === 1) {
			to_chat(H, "<span class='warning'>You feel violated.</span>");
		} else if ($0 === 2) {
			to_chat(H, "<span class='warning'>You feel yourself being sliced apart and put back together.</span>");
		} else if ($0 === 3) {
			to_chat(H, "<span class='warning'>You feel intensely watched.</span>");
		}
		yield* sleep(5);
		to_chat(H, "<span class='warning'><b>Your mind snaps!</b></span>");
		to_chat(H, "<big><span class='warning'><b>You can't remember how you got here...</b></span></big>");
		if (prob(75)) {
			$0 = T("/datum/objective/abductee/random");
		} else {
			$0 = pick(typesof(T("/datum/objective/abductee")) - T("/datum/objective/abductee") - T("/datum/objective/abductee/random"));
		}
		objtype = $0;
		O = (yield* new_(objtype));
		GLOB.SSticker.mode.abductees += H.mind;
		H.mind.objectives += O;
		H.mind.announce_objectives();
		GLOB.SSticker.mode.update_abductor_icons_added(H.mind);
		for (G of each(H.internal_organs, T("/obj/item/organ/heart/gland"))) {
			yield* G.Start();
			point_reward++;
		}
		if (point_reward > 0) {
			yield* this.open_machine();
			yield* this.SendBack(H);
			playsound(this.loc, rt.rsc("sound/machines/ding.ogg"), 50, 1);
			this.points += point_reward;
			this.credits += point_reward;
			return `<span class='good'>Experiment successful! ${point_reward} new data-points collected.</span>`;
		}
		playsound(this.loc, rt.rsc("sound/machines/buzz-sigh.ogg"), 50, 1);
		return "<span class='bad'>Experiment failed! No replacement organ detected.</span>";
	} else {
		yield* this.say("Brain activity nonexistent - disposing sample...");
		yield* this.open_machine();
		yield* this.SendBack(H);
		return "<span class='bad'>Specimen braindead - disposed.</span>";
	}
	return "<span class='bad'>ERROR</span>";
}, true);

// experiment.dm:216
rt.def("/obj/machinery/abductor/experiment/proc/SendBack", function* SendBack(f: Frame, H: Value) {
	yield* H.Sleeping(160);
	yield* H.uncuff();
	if (this.console && this.console.pad && this.console.pad.teleport_target) {
		yield* H.forceMove(this.console.pad.teleport_target);
		return f.dot;
	}
	yield* GLOB.SSjob.SendToLateJoin(H, 0);
	return f.dot;
}, true);

// experiment.dm:228
rt.def("/obj/machinery/abductor/experiment/proc/update_icon", function update_icon(f: Frame) {
	if (this.state_open) {
		this.icon_state = "experiment-open";
	} else {
		this.icon_state = "experiment";
	}
	return f.dot;
});
