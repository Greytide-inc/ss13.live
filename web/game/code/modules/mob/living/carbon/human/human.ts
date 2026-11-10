// Based on /tg/station's code/modules/mob/living/carbon/human/human.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g, fmt } = rt;


rt.type(4812, "/mob/living/carbon/human/dummy", "/mob/living/carbon/human", {
	real_name: "Test Dummy",
	status_flags: 4104,
});

// human.dm:13
rt.def("/mob/living/carbon/human/dummy/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	if (this.initialized) return f.dot;
	rt.setAt(f.argsList, 1, 0);
	yield* g.callSrc(f, "Initialize", [f.argsList], rt.Args.List);
	return f.dot;
}, true, { args: ["loc"] });

// human.dm:22
rt.def("/mob/living/carbon/human/proc/Initialize", function* Initialize(f: Frame) {
	this.verbs += P("/mob/living/proc/mob_sleep");
	this.verbs += P("/mob/living/proc/lay_down");
	yield* this.create_bodyparts();
	yield* this.create_dna(this);
	yield* randomize_human(this);
	yield* this.dna.initialize_dna();
	if (this.dna.species) {
		yield* this.set_species(this.dna.species.type);
	}
	yield* this.create_internal_organs();
	this.handcrafting = (yield* new_(T("/datum/personal_crafting")));
	yield* parent_proc();
	return f.dot;
}, true);

// human.dm:44
rt.def("/mob/living/carbon/human/proc/create_internal_organs", function* create_internal_organs(f: Frame) {
	if (!rt.isIn(f, NOHUNGER, this.dna.species.species_traits)) {
		this.internal_organs += (yield* new_(T("/obj/item/organ/appendix")));
	}
	if (!rt.isIn(f, NOBREATH, this.dna.species.species_traits)) {
		if (this.dna.species.mutantlungs) {
			this.internal_organs += (yield* new_(this.dna.species.mutantlungs));
		} else {
			this.internal_organs += (yield* new_(T("/obj/item/organ/lungs")));
		}
	}
	if (!rt.isIn(f, NOBLOOD, this.dna.species.species_traits)) {
		this.internal_organs += (yield* new_(T("/obj/item/organ/heart")));
	}
	this.internal_organs += (yield* new_(this.dna.species.mutanteyes));
	this.internal_organs += (yield* new_(this.dna.species.mutantears));
	this.internal_organs += (yield* new_(this.dna.species.mutanttongue));
	this.internal_organs += (yield* new_(T("/obj/item/organ/brain")));
	yield* parent_proc();
	return f.dot;
}, true);

// human.dm:61
rt.def("/mob/living/carbon/human/proc/OpenCraftingMenu", function* OpenCraftingMenu(f: Frame) {
	yield* this.handcrafting.ui_interact(this);
	return f.dot;
}, true);

// human.dm:65
rt.def("/mob/living/carbon/human/proc/prepare_data_huds", function* prepare_data_huds(f: Frame) {
	yield* parent_proc();
	yield* this.sec_hud_set_ID();
	this.sec_hud_set_implants();
	this.sec_hud_set_security_status();
	this.add_to_all_human_data_huds();
	return f.dot;
}, true);

// human.dm:74
rt.def("/mob/living/carbon/human/proc/Stat", function* Stat(f: Frame) {
	let D: Value = null;
	let $e: any;
	yield* parent_proc();
	if (statpanel("Status")) {
		stat(null, `Intent: ${this.a_intent}`);
		stat(null, `Move Mode: ${this.m_intent}`);
		if (this.internal) {
			if (!this.internal.air_contents) {
				yield* qdel(this.internal);
			} else {
				stat("Internal Atmosphere Info", this.internal.name);
				stat("Tank Pressure", this.internal.air_contents.return_pressure());
				stat("Distribution Pressure", this.internal.distribute_pressure);
			}
		}
		if (this.mind) {
			if (this.mind.changeling) {
				stat("Chemical Storage", `${this.mind.changeling.chem_charges}/${this.mind.changeling.chem_storage}`);
				stat("Absorbed DNA", this.mind.changeling.absorbedcount);
			}
		}
	}
	if (!rt.istype(this.wear_suit, T("/obj/item/clothing/suit/space/space_ninja"))) return f.dot;
	let SN: Value = this.wear_suit;
	if (!statpanel("SpiderOS")) return f.dot;
	let $0: any = "SpiderOS Status:";
	stat($0, `${SN.s_initialized ? "Initialized" : "Disabled"}`);
	stat("Current Time:", `${worldtime2text()}`);
	if (!SN.s_initialized) return f.dot;
	stat("Energy Charge:", `${round(SN.cell.charge / 100)}%`);
	stat("Smoke Bombs:", fmt("３ ！", [SN.s_bombs]));
	stat("Fingerprints:", `${md5(this.dna.uni_identity)}`);
	stat("Unique Identity:", `${this.dna.unique_enzymes}`);
	stat("Overall Status:", `${this.stat > 1 ? "dead" : `${this.health}% healthy`}`);
	stat("Nutrition Status:", `${this.nutrition}`);
	stat("Oxygen Loss:", `${this.getOxyLoss()}`);
	stat("Toxin Levels:", `${this.getToxLoss()}`);
	stat("Burn Severity:", `${this.getFireLoss()}`);
	stat("Brute Trauma:", `${this.getBruteLoss()}`);
	stat("Radiation Levels:", `${this.radiation} rad`);
	stat("Body Temperature:", `${this.bodytemperature - T0C} degrees C (${this.bodytemperature * 1.8 - 459.67} degrees F)`);
	if (!rt.len(f, this.viruses)) return f.dot;
	stat("Viruses:", null);
	for (D of each(this.viruses, T("/datum/disease"))) {
		stat("*", `${D.name}, Type: ${D.spread_text}, Stage: ${D.stage}/${D.max_stages}, Possible Cure: ${D.cure_text}`);
	}
	return f.dot;
}, true);

// human.dm:123
rt.def("/mob/living/carbon/human/proc/show_inv", function* show_inv(f: Frame, user: Value) {
	yield* user.set_machine(this);
	// tg_js: one `strip` tgui window instead of the HTML popup (modules/mob/strip.ts)
	yield* this.ui_interact(user);
	return f.dot;
}, true);

// human.dm:217
rt.def("/mob/living/carbon/human/proc/Crossed", function* Crossed(f: Frame, AM: Value) {
	let MB: Value = null;
	if (rt.istype((MB = AM), T("/mob/living/simple_animal/bot/mulebot"))) {
		yield* MB.RunOver(this);
	}
	yield* this.spreadFire(AM);
	return f.dot;
}, true);

// human.dm:225
rt.def("/mob/living/carbon/human/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let L: Value = null, I: Value = null, time_taken: Value = null, slot: Value = null, pocket_side: Value = null, pocket_id: Value = null, pocket_item: Value = null, place_item: Value = null, delay_denominator: Value = null, _P: Value = null, health_status: Value = null, span: Value = null, status: Value = null, X: Value = null, BP: Value = null, brutedamage: Value = null, burndamage: Value = null, allowed_access: Value = null, G: Value = null, access: Value = null, setcriminal: Value = null, c: Value = null, t1: Value = null, t2: Value = null, crime: Value = null, counter: Value = null, counter_6: Value = null;
	let $e: any;
	if (f.usr.canUseTopic(this, 1, 1)) {
		if (rt.at(href_list, "embedded_object")) {
			if (!(L = rt.locateIn(f, rt.at(href_list, "embedded_limb"), this.bodyparts))) {
				return f.dot;
			}
			if (!(I = rt.locateIn(f, rt.at(href_list, "embedded_object"), L.embedded_objects)) || I.loc != this) {
				return f.dot;
			}
			time_taken = I.embedded_unsafe_removal_time * I.w_class;
			f.usr.visible_message(`<span class='warning'>${f.usr} attempts to remove ${I} from their ${L.name}.</span>`, `<span class='notice'>You attempt to remove ${I} from your ${L.name}... (It will take ${time_taken / 10} seconds.)</span>`);
			if (yield* do_after(f.usr, time_taken, { needhand: 1, target: this })) {
				if (!I || !L || I.loc != this || !rt.isIn(f, I, L.embedded_objects)) {
					return f.dot;
				}
				L.embedded_objects -= I;
				yield* L.receive_damage(I.embedded_unsafe_removal_pain_multiplier * I.w_class);
				yield* I.forceMove(rt.getStep(f, this, 0));
				yield* f.usr.put_in_hands(I);
				yield* f.usr.emote("scream");
				f.usr.visible_message(`${f.usr} successfully rips ${I} out of their ${L.name}!`, `<span class='notice'>You successfully remove ${I} from your ${L.name}.</span>`);
				if (!this.has_embedded_objects()) {
					yield* this.clear_alert("embeddedobject");
				}
			}
			return f.dot;
		}
		if (rt.at(href_list, "item")) {
			if (rt.isIn(f, (slot = text2num(rt.at(href_list, "item"))), this.check_obscured_slots())) {
				to_chat(f.usr, "<span class='warning'>You can't reach that! Something is covering it.</span>");
				yield* this.balloon_alert(f.usr, "covered!");
				return f.dot;
			}
		}
		if (rt.at(href_list, "pockets")) {
			pocket_side = rt.at(href_list, "pockets");
			pocket_id = pocket_side == "right" ? 16 : 15;
			pocket_item = pocket_id == 16 ? this.r_store : this.l_store;
			place_item = f.usr.get_active_held_item();
			delay_denominator = 1;
			if (pocket_item && !rt.bitAnd(pocket_item.flags, 128)) {
				if (rt.bitAnd(pocket_item.flags, 2)) {
					to_chat(f.usr, `<span class='warning'>You try to empty ${this}'s ${pocket_side} pocket, it seems to be stuck!</span>`);
				}
				to_chat(f.usr, `<span class='notice'>You try to empty ${this}'s ${pocket_side} pocket.</span>`);
			} else if (place_item && (yield* place_item.mob_can_equip(this, f.usr, pocket_id, 1)) && !rt.bitAnd(place_item.flags, 128)) {
				to_chat(f.usr, `<span class='notice'>You try to place ${place_item} into ${this}'s ${pocket_side} pocket.</span>`);
				delay_denominator = 4;
			} else {
				return f.dot;
			}
			if (yield* do_mob(f.usr, this, 40 / delay_denominator)) {
				if (pocket_item) {
					if (pocket_item == (pocket_id == 16 ? this.r_store : this.l_store)) {
						yield* this.dropItemToGround(pocket_item);
					}
				} else if (place_item) {
					if (yield* place_item.mob_can_equip(this, f.usr, pocket_id, 0, 1)) {
						yield* f.usr.temporarilyRemoveItemFromInventory(place_item, 1);
						yield* this.equip_to_slot(place_item, pocket_id, 1);
					}
				}
				if (f.usr.machine == this && get_dist(this, f.usr) <= 1) {
					yield* this.show_inv(f.usr);
				}
			} else {
				to_chat(this, `<span class='warning'>You feel your ${pocket_side} pocket being fumbled with!</span>`);
			}
		}
		yield* parent_proc();
	}
	if (!rt.at(href_list, "hud")) return f.dot;
	if (!rt.istype(f.usr, T("/mob/living/carbon/human"))) return f.dot;
	// tg_js: the HUD links come from examining someone, so they need that person in sight; any HUD wearer could edit anyone's records from anywhere
	if (!rt.isIn(f, this, view(f.usr))) return f.dot;
	let H: Value = f.usr;
	let perpname: Value = this.get_face_name(this.get_id_name(""));
	if (!(rt.istype(H.glasses, T("/obj/item/clothing/glasses/hud")) || rt.istype(H.getorganslot("eye_hud"), T("/obj/item/organ/cyberimp/eyes/hud")))) return f.dot;
	let R: Value = find_record("name", perpname, GLOB.data_core.general);
	if (rt.at(href_list, "photo_front") || rt.at(href_list, "photo_side")) {
		if (R) {
			if (!H.canUseHUD()) {
				return f.dot;
			} else if (!rt.istype(H.glasses, T("/obj/item/clothing/glasses/hud")) && !rt.istype(H.getorganslot("eye_hud"), T("/obj/item/organ/cyberimp/eyes/hud/medical"))) {
				return f.dot;
			}
			if (rt.at(href_list, "photo_front")) {
				_P = rt.index(R.fields, "photo_front");
			} else if (rt.at(href_list, "photo_side")) {
				_P = rt.index(R.fields, "photo_side");
			}
			if (_P) {
				yield* _P.show(H);
			}
		}
	}
	if (rt.at(href_list, "hud") == "m") {
		if (rt.istype(H.glasses, T("/obj/item/clothing/glasses/hud/health")) || rt.istype(H.getorganslot("eye_hud"), T("/obj/item/organ/cyberimp/eyes/hud/medical"))) {
			if (rt.at(href_list, "p_stat")) {
				health_status = (yield* g.op(f, "Prompt", [0], [rt.index(R.fields, "p_stat"), "Medical HUD", "Specify a new physical status for this person.", f.usr, list("Active", "Physically Unfit", "*Unconscious*", "*Deceased*", "Cancel")]));
				if (R) {
					if (!H.canUseHUD()) {
						return f.dot;
					} else if (!rt.istype(H.glasses, T("/obj/item/clothing/glasses/hud/health")) && !rt.istype(H.getorganslot("eye_hud"), T("/obj/item/organ/cyberimp/eyes/hud/medical"))) {
						return f.dot;
					}
					if (health_status && health_status != "Cancel") {
						rt.setAt(R.fields, "p_stat", health_status);
					}
				}
				return f.dot;
			}
			if (rt.at(href_list, "m_stat")) {
				health_status = (yield* g.op(f, "Prompt", [0], [rt.index(R.fields, "m_stat"), "Medical HUD", "Specify a new mental status for this person.", f.usr, list("Stable", "*Watch*", "*Unstable*", "*Insane*", "Cancel")]));
				if (R) {
					if (!H.canUseHUD()) {
						return f.dot;
					} else if (!rt.istype(H.glasses, T("/obj/item/clothing/glasses/hud/health")) && !rt.istype(H.getorganslot("eye_hud"), T("/obj/item/organ/cyberimp/eyes/hud/medical"))) {
						return f.dot;
					}
					if (health_status && health_status != "Cancel") {
						rt.setAt(R.fields, "m_stat", health_status);
					}
				}
				return f.dot;
			}
			if (rt.at(href_list, "evaluation")) {
				if (!this.getBruteLoss() && !this.getFireLoss() && !this.getOxyLoss() && this.getToxLoss() < 20) {
					to_chat(f.usr, "<span class='notice'>No external injuries detected.</span><br>");
					return f.dot;
				}
				span = "notice";
				status = "";
				if (this.getBruteLoss()) {
					to_chat(f.usr, "<b>Physical trauma analysis:</b>");
					for (X of each(this.bodyparts)) {
						BP = X;
						if ((brutedamage = BP.brute_dam) > 0) {
							status = "received minor physical injuries.";
							span = "notice";
						}
						if (brutedamage > 20) {
							status = "been seriously damaged.";
							span = "danger";
						}
						if (brutedamage > 40) {
							status = "sustained major trauma!";
							span = "userdanger";
						}
						if (brutedamage) {
							to_chat(f.usr, `<span class='${span}'>${BP} appears to have ${status}</span>`);
						}
					}
				}
				if (this.getFireLoss()) {
					to_chat(f.usr, "<b>Analysis of skin burns:</b>");
					X = null;
					for (X of each(this.bodyparts)) {
						BP = X;
						if ((burndamage = BP.burn_dam) > 0) {
							status = "signs of minor burns.";
							span = "notice";
						}
						if (burndamage > 20) {
							status = "serious burns.";
							span = "danger";
						}
						if (burndamage > 40) {
							status = "major burns!";
							span = "userdanger";
						}
						if (burndamage) {
							to_chat(f.usr, `<span class='${span}'>${BP} appears to have ${status}</span>`);
						}
					}
				}
				if (this.getOxyLoss()) {
					to_chat(f.usr, "<span class='danger'>Patient has signs of suffocation, emergency treatment may be required!</span>");
				}
				if (this.getToxLoss() > 20) {
					to_chat(f.usr, "<span class='danger'>Gathered data is inconsistent with the analysis, possible cause: poisoning.</span>");
				}
			}
		}
	}
	if (rt.at(href_list, "hud") != "s") return f.dot;
	if (!(rt.istype(H.glasses, T("/obj/item/clothing/glasses/hud/security")) || rt.istype(H.getorganslot("eye_hud"), T("/obj/item/organ/cyberimp/eyes/hud/security")))) return f.dot;
	if (f.usr.stat || f.usr == this) {
		return f.dot;
	}
	if (!(G = H.glasses).emagged) {
		if (H.wear_id) {
			access = H.wear_id.GetAccess();
			if (rt.isIn(f, 63, access)) {
				allowed_access = H.get_authentification_name();
			}
		}
	} else {
		allowed_access = "@%&ERROR_%$*";
	}
	if (!allowed_access) {
		to_chat(H, "<span class='warning'>ERROR: Invalid Access</span>");
		return f.dot;
	}
	if (!perpname) return f.dot;
	if (R = find_record("name", perpname, GLOB.data_core.security)) {
		if (rt.at(href_list, "status")) {
			if ((setcriminal = (yield* g.op(f, "Prompt", [0], [rt.index(R.fields, "criminal"), "Security HUD", "Specify a new criminal status for this person.", f.usr, list("None", "*Arrest*", "Incarcerated", "Parolled", "Discharged", "Cancel")]))) != "Cancel") {
				if (R) {
					if (H.canUseHUD()) {
						if (rt.istype(H.glasses, T("/obj/item/clothing/glasses/hud/security")) || rt.istype(H.getorganslot("eye_hud"), T("/obj/item/organ/cyberimp/eyes/hud/security"))) {
							this.investigate_log(`${this.key} has been set from ${rt.index(R.fields, "criminal")} to ${setcriminal} by ${f.usr.name} (${f.usr.key}).`, "records");
							rt.setAt(R.fields, "criminal", setcriminal);
							this.sec_hud_set_security_status();
						}
					}
				}
			}
			return f.dot;
		}
		if (rt.at(href_list, "view")) {
			if (R) {
				if (!H.canUseHUD()) {
					return f.dot;
				} else if (!rt.istype(H.glasses, T("/obj/item/clothing/glasses/hud/security")) && !rt.istype(H.getorganslot("eye_hud"), T("/obj/item/organ/cyberimp/eyes/hud/security"))) {
					return f.dot;
				}
				to_chat(f.usr, `<b>Name:</b> ${rt.index(R.fields, "name")}\t<b>Criminal Status:</b> ${rt.index(R.fields, "criminal")}`);
				to_chat(f.usr, "<b>Minor Crimes:</b>");
				for (c of each(rt.index(R.fields, "mi_crim"), T("/datum/data/crime"))) {
					to_chat(f.usr, `<b>Crime:</b> ${c.crimeName}`);
					to_chat(f.usr, `<b>Details:</b> ${c.crimeDetails}`);
					to_chat(f.usr, `Added by ${c.author} at ${c.time}`);
					to_chat(f.usr, "----------");
				}
				to_chat(f.usr, "<b>Major Crimes:</b>");
				c = null;
				for (c of each(rt.index(R.fields, "ma_crim"), T("/datum/data/crime"))) {
					to_chat(f.usr, `<b>Crime:</b> ${c.crimeName}`);
					to_chat(f.usr, `<b>Details:</b> ${c.crimeDetails}`);
					to_chat(f.usr, `Added by ${c.author} at ${c.time}`);
					to_chat(f.usr, "----------");
				}
				to_chat(f.usr, `<b>Notes:</b> ${rt.index(R.fields, "notes")}`);
			}
			return f.dot;
		}
		if (rt.at(href_list, "add_crime")) {
			const subject = (yield* alert("What crime would you like to add?", "Security HUD", "Minor Crime", "Major Crime", "Cancel"));
			if (subject === "Minor Crime") {
				if (R) {
					t1 = (yield* stripped_input("Please input minor crime names:", "Security HUD", "", null));
					t2 = (yield* stripped_multiline_input("Please input minor crime details:", "Security HUD", "", null));
					if (R) {
						if (!t1 || !t2 || !allowed_access) {
							return f.dot;
						} else if (!H.canUseHUD()) {
							return f.dot;
						} else if (!rt.istype(H.glasses, T("/obj/item/clothing/glasses/hud/security")) && !rt.istype(H.getorganslot("eye_hud"), T("/obj/item/organ/cyberimp/eyes/hud/security"))) {
							return f.dot;
						}
						crime = GLOB.data_core.createCrimeEntry(t1, t2, allowed_access, worldtime2text());
						GLOB.data_core.addMinorCrime(rt.index(R.fields, "id"), crime);
						to_chat(f.usr, "<span class='notice'>Successfully added a minor crime.</span>");
						return f.dot;
					}
				}
			} else if (subject === "Major Crime") {
				if (R) {
					t1 = (yield* stripped_input("Please input major crime names:", "Security HUD", "", null));
					t2 = (yield* stripped_multiline_input("Please input major crime details:", "Security HUD", "", null));
					if (R) {
						if (!t1 || !t2 || !allowed_access) {
							return f.dot;
						} else if (!H.canUseHUD()) {
							return f.dot;
						} else if (!rt.istype(H.glasses, T("/obj/item/clothing/glasses/hud/security")) && !rt.istype(H.getorganslot("eye_hud"), T("/obj/item/organ/cyberimp/eyes/hud/security"))) {
							return f.dot;
						}
						crime = GLOB.data_core.createCrimeEntry(t1, t2, allowed_access, worldtime2text());
						GLOB.data_core.addMajorCrime(rt.index(R.fields, "id"), crime);
						to_chat(f.usr, "<span class='notice'>Successfully added a major crime.</span>");
					}
				}
			}
			return f.dot;
		}
		if (rt.at(href_list, "view_comment")) {
			if (R) {
				if (!H.canUseHUD()) {
					return f.dot;
				} else if (!rt.istype(H.glasses, T("/obj/item/clothing/glasses/hud/security")) && !rt.istype(H.getorganslot("eye_hud"), T("/obj/item/organ/cyberimp/eyes/hud/security"))) {
					return f.dot;
				}
				to_chat(f.usr, "<b>Comments/Log:</b>");
				counter = 1;
				while (rt.index(R.fields, `com_${counter}`)) {
					to_chat(f.usr, rt.index(R.fields, `com_${counter}`));
					to_chat(f.usr, "----------");
					counter++;
				}
				return f.dot;
			}
		}
		if (rt.at(href_list, "add_comment")) {
			if (R) {
				t1 = (yield* stripped_multiline_input("Add Comment:", "Secure. records", null, null));
				if (R) {
					if (!t1 || !allowed_access) {
						return f.dot;
					} else if (!H.canUseHUD()) {
						return f.dot;
					} else if (!rt.istype(H.glasses, T("/obj/item/clothing/glasses/hud/security")) && !rt.istype(H.getorganslot("eye_hud"), T("/obj/item/organ/cyberimp/eyes/hud/security"))) {
						return f.dot;
					}
					counter_6 = 1;
					while (rt.index(R.fields, `com_${counter_6}`)) {
						counter_6++;
					}
					rt.setAt(R.fields, `com_${counter_6}`, `Made by ${allowed_access} on ${worldtime2text()} ${time2text(rt.world().realtime, "MMM DD")}, ${GLOB.year_integer + 540}<BR>${t1}`);
					to_chat(f.usr, "<span class='notice'>Successfully added comment.</span>");
					return f.dot;
				}
			}
		}
	}
	to_chat(f.usr, "<span class='warning'>Unable to locate a data core entry for this person.</span>");
	return f.dot;
}, true);

// human.dm:501
rt.def("/mob/living/carbon/human/proc/canUseHUD", function canUseHUD(f: Frame) {
	return (!(this.stat || this.IsKnockdown() || this.IsStun() || this.restrained()) ? 1 : 0);
});

// human.dm:505
rt.def("/mob/living/carbon/human/proc/can_inject", function can_inject(f: Frame, user: Value, error_msg: Value, target_zone: Value, penetrate_thick: Value) {
	let $1: any;
	penetrate_thick ??= 0;
	f.dot = 1;
	if (user && !target_zone) {
		target_zone = user.zone_selected;
	}
	if (this.dna && rt.isIn(f, PIERCEIMMUNE, this.dna.species.species_traits)) {
		f.dot = 0;
	}
	if (above_neck(target_zone)) {
		if (this.head && rt.bitAnd(this.head.flags, THICKMATERIAL) && !penetrate_thick) {
			f.dot = 0;
		}
	} else if (this.wear_suit && rt.bitAnd(this.wear_suit.flags, THICKMATERIAL) && !penetrate_thick) {
		f.dot = 0;
	}
	if (!(!f.dot && error_msg && user)) return f.dot;
	let $0: any = user;
	if (above_neck(target_zone)) {
		$1 = `on ${this.p_their()} head`;
	} else {
		$1 = `on ${this.p_their()} body`;
	}
	to_chat($0, `<span class='alert'>There is no exposed flesh or thin material ${$1}.</span>`);
	return f.dot;
});

// human.dm:522
rt.def("/mob/living/carbon/human/proc/check_obscured_slots", function check_obscured_slots(f: Frame) {
	let obscured: Value = list();
	if (this.wear_suit) {
		if (rt.bitAnd(this.wear_suit.flags_inv, HIDEGLOVES)) {
			(obscured = rt.modify(obscured, slot_gloves, rt.bitOr));
		}
		if (rt.bitAnd(this.wear_suit.flags_inv, HIDEJUMPSUIT)) {
			(obscured = rt.modify(obscured, slot_w_uniform, rt.bitOr));
		}
		if (rt.bitAnd(this.wear_suit.flags_inv, HIDESHOES)) {
			(obscured = rt.modify(obscured, slot_shoes, rt.bitOr));
		}
	}
	if (this.head) {
		if (rt.bitAnd(this.head.flags_inv, HIDEMASK)) {
			(obscured = rt.modify(obscured, slot_wear_mask, rt.bitOr));
		}
		if (rt.bitAnd(this.head.flags_inv, HIDEEYES)) {
			(obscured = rt.modify(obscured, slot_glasses, rt.bitOr));
		}
		if (rt.bitAnd(this.head.flags_inv, HIDEEARS)) {
			(obscured = rt.modify(obscured, slot_ears, rt.bitOr));
		}
	}
	if (this.wear_mask) {
		if (rt.bitAnd(this.wear_mask.flags_inv, HIDEEYES)) {
			(obscured = rt.modify(obscured, slot_glasses, rt.bitOr));
		}
	}
	if (rt.len(f, obscured)) {
		return obscured;
	} else {
		return null;
	}
});

// human.dm:550
rt.def("/mob/living/carbon/human/proc/assess_threat", function* assess_threat(f: Frame, judgement_criteria: Value, lasercolor: Value, weaponcheck: Value) {
	let I: Value = null, perpname: Value = null, R: Value = null;
	let $e: any;
	lasercolor ??= "";
	if (rt.bitAnd(judgement_criteria, JUDGE_EMAGGED)) {
		return 10;
	}
	let threatcount: Value = 0;
	if (lasercolor) {
		if (lasercolor == "b") {
			if (rt.istype(this.wear_suit, T("/obj/item/clothing/suit/redtag"))) {
				threatcount += 4;
			}
			if (this.is_holding_item_of_type(T("/obj/item/weapon/gun/energy/laser/redtag"))) {
				threatcount += 4;
			}
			if (rt.istype(this.belt, T("/obj/item/weapon/gun/energy/laser/redtag"))) {
				threatcount += 2;
			}
		}
		if (lasercolor == "r") {
			if (rt.istype(this.wear_suit, T("/obj/item/clothing/suit/bluetag"))) {
				threatcount += 4;
			}
			if (this.is_holding_item_of_type(T("/obj/item/weapon/gun/energy/laser/bluetag"))) {
				threatcount += 4;
			}
			if (rt.istype(this.belt, T("/obj/item/weapon/gun/energy/laser/bluetag"))) {
				threatcount += 2;
			}
		}
		return threatcount;
	}
	let idcard: Value = this.get_idcard();
	if (rt.bitAnd(judgement_criteria, JUDGE_IDCHECK) && !idcard && this.name == "Unknown") {
		threatcount += 4;
	}
	if (rt.bitAnd(judgement_criteria, JUDGE_WEAPONCHECK) && weaponcheck) {
		if (!idcard || !rt.isIn(f, 66, idcard.access)) {
			for (I of each(this.held_items, T("/obj/item"))) {
				if (yield* weaponcheck.Invoke(I)) {
					threatcount += 4;
				}
			}
			if (yield* weaponcheck.Invoke(this.belt)) {
				threatcount += 2;
			}
		}
	}
	if (rt.bitAnd(judgement_criteria, JUDGE_RECORDCHECK)) {
		perpname = this.get_face_name(this.get_id_name());
		if ((R = find_record("name", perpname, GLOB.data_core.security)) && rt.index(R.fields, "criminal")) {
			const criminal = rt.index(R.fields, "criminal");
			if (criminal === "*Arrest*") {
				threatcount += 5;
			} else if (criminal === "Incarcerated") {
				threatcount += 2;
			} else if (criminal === "Parolled") {
				threatcount += 2;
			}
		}
	}
	if (rt.istype(this.head, T("/obj/item/clothing/head/wizard")) || rt.istype(this.head, T("/obj/item/clothing/head/helmet/space/hardsuit/wizard"))) {
		threatcount += 2;
	}
	if (this.dna && this.dna.species.id && this.dna.species.id != "human") {
		threatcount += 1;
	}
	if (this.isloyal()) {
		threatcount -= 1;
	}
	if (rt.istype(idcard, T("/obj/item/weapon/card/id/syndicate"))) {
		threatcount -= 5;
	}
	return threatcount;
}, true);

// human.dm:623
rt.def("/mob/living/carbon/human/proc/set_cloned_appearance", function* set_cloned_appearance(f: Frame) {
	if (this.gender == "male") {
		this.facial_hair_style = "Full Beard";
	} else {
		this.facial_hair_style = "Shaved";
	}
	this.hair_style = pick("Bedhead", "Bedhead 2", "Bedhead 3");
	this.underwear = "Nude";
	yield* this.update_body();
	yield* this.update_hair();
	return f.dot;
}, true);

// human.dm:633
rt.def("/mob/living/carbon/human/proc/singularity_pull", function* singularity_pull(f: Frame, S: Value, current_size: Value) {
	let hand: Value = null;
	if (current_size >= STAGE_THREE) {
		for (hand of each(this.held_items, T("/obj/item"))) {
			if (prob(current_size * 5) && hand.w_class >= (11 - current_size) / 2 && (yield* this.dropItemToGround(hand))) {
				yield* step_towards(hand, this);
				to_chat(this, fmt("<span class='warning'>＄！ pulls ％！ from your grip!</span>", [S, hand]));
			}
		}
	}
	yield* this.rad_act(current_size * 3);
	if (this.mob_negates_gravity()) {
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// human.dm:644
rt.def("/mob/living/carbon/human/proc/do_cpr", function* do_cpr(f: Frame, C: Value) {
	let suff: Value = null;
	if (!C.dna || !C.dna.species) {
		return f.dot;
	}
	if (C.stat == 2 || rt.bitAnd(C.status_flags, FAKEDEATH)) {
		to_chat(this, `<span class='warning'>${C.name} is dead!</span>`);
		return f.dot;
	}
	if (this.is_mouth_covered()) {
		to_chat(this, "<span class='warning'>Remove your mask first!</span>");
		return 0;
	}
	if (C.is_mouth_covered()) {
		to_chat(this, `<span class='warning'>Remove ${this.p_their()} mask first!</span>`);
		return 0;
	}
	if (!(C.cpr_time < rt.worldTime(f) + 30)) return f.dot;
	this.visible_message(`<span class='notice'>${this} is trying to perform CPR on ${C.name}!</span>`, `<span class='notice'>You try to perform CPR on ${C.name}... Hold still!</span>`);
	if (!(yield* do_mob(this, C))) {
		to_chat(this, `<span class='warning'>You fail to perform CPR on ${C}!</span>`);
		return 0;
	}
	let they_breathe: Value = (!rt.isIn(f, NOBREATH, C.dna.species.species_traits) ? 1 : 0);
	let they_lung: Value = C.getorganslot("lungs");
	if (C.health > 0) {
		return f.dot;
	}
	this.visible_message(`${this} performs CPR on ${C.name}!`, `<span class='notice'>You perform CPR on ${C.name}.</span>`);
	C.cpr_time = rt.worldTime(f);
	add_logs(this, C, "CPRed");
	if (they_breathe && they_lung) {
		suff = min(C.getOxyLoss(), 7);
		yield* C.adjustOxyLoss(-suff);
		yield* C.updatehealth();
		to_chat(C, "<span class='unconscious'>You feel a breath of fresh air enter your lungs... It feels good...</span>");
	} else if (they_breathe && !they_lung) {
		to_chat(C, "<span class='unconscious'>You feel a breath of fresh air... but you don't feel any better...</span>");
	} else {
		to_chat(C, "<span class='unconscious'>You feel a breath of fresh air... which is a sensation you don't recognise...</span>");
	}
	return f.dot;
}, true);

// human.dm:684
rt.def("/mob/living/carbon/human/proc/generateStaticOverlay", function* generateStaticOverlay(f: Frame) {
	let staticOverlay: Value = null;
	(staticOverlay = (yield* image(icon(rt.rsc("icons/effects/effects.dmi"), "static"), { loc: this }))).override = 1;
	rt.setAt(this.staticOverlays, "static", staticOverlay);
	(staticOverlay = (yield* image(icon(rt.rsc("icons/effects/effects.dmi"), "blank"), { loc: this }))).override = 1;
	rt.setAt(this.staticOverlays, "blank", staticOverlay);
	(staticOverlay = (yield* getLetterImage(this, "H", 1))).override = 1;
	rt.setAt(this.staticOverlays, "letter", staticOverlay);
	(staticOverlay = getRandomAnimalImage(this)).override = 1;
	rt.setAt(this.staticOverlays, "animal", staticOverlay);
	return f.dot;
}, true);

// human.dm:701
rt.def("/mob/living/carbon/human/proc/cuff_resist", function* cuff_resist(f: Frame, I: Value) {
	if (this.dna && this.dna.check_mutation("Hulk")) {
		yield* this.say(pick(";RAAAAAAAARGH!", ";HNNNNNNNNNGGGGGGH!", ";GWAAAAAAAARRRHHH!", "NNNNNNNNGGGGGGGGHH!", ";AAAAAAARRRGH!"));
		if (yield* parent_proc(I, { cuff_break: 1 })) {
			yield* this.dropItemToGround(I);
		}
	} else {
		if (!(yield* parent_proc())) return f.dot;
		yield* this.dropItemToGround(I);
	}
	return f.dot;
}, true);

// human.dm:710
rt.def("/mob/living/carbon/human/proc/clean_blood", function clean_blood(f: Frame) {
	let H: Value = null;
	if ((H = this).gloves) {
		if (H.gloves.clean_blood()) {
			H.update_inv_gloves();
		}
	} else {
		parent_proc();
		if (H.bloody_hands) {
			H.bloody_hands = 0;
			H.update_inv_gloves();
		}
	}
	this.update_icons();
	return f.dot;
});

// human.dm:724
rt.def("/mob/living/carbon/human/proc/wash_cream", function wash_cream(f: Frame) {
	this.cut_overlay(mutable_appearance(rt.rsc("icons/effects/creampie.dmi"), "creampie_lizard"));
	this.cut_overlay(mutable_appearance(rt.rsc("icons/effects/creampie.dmi"), "creampie_human"));
	return f.dot;
});

// human.dm:732
rt.def("/mob/living/carbon/human/proc/electrocution_animation", function* electrocution_animation(f: Frame, anim_duration: Value) {
	if (this.dna && this.dna.species) {
		this.add_atom_colour("#000000", 2);
		if (!GLOB.electrocution_skeleton_anim) {
			GLOB.electrocution_skeleton_anim = mutable_appearance(this.icon, "electrocuted_base");
			(rt.modField(f, GLOB.electrocution_skeleton_anim, "appearance_flags", 2, rt.bitOr));
		}
		this.add_overlay(GLOB.electrocution_skeleton_anim);
		yield* addtimer((yield* new_(T("/datum/callback"), this, P("/mob/living/carbon/human/proc/end_electrocution_animation"), GLOB.electrocution_skeleton_anim)), anim_duration);
	} else {
		yield* flick_overlay_view(image(this.icon, this, "electrocuted_generic", ABOVE_MOB_LAYER), this, anim_duration);
	}
	return f.dot;
}, true);

// human.dm:745
rt.def("/mob/living/carbon/human/proc/end_electrocution_animation", function end_electrocution_animation(f: Frame, MA: Value) {
	this.remove_atom_colour(TEMPORARY_COLOUR_PRIORITY, "#000000");
	this.cut_overlay(MA);
	return f.dot;
}, false, { argTypes: [{ path: "/mutable_appearance" }] });

// human.dm:749
rt.def("/mob/living/carbon/human/proc/canUseTopic", function canUseTopic(f: Frame, M: Value, be_close: Value) {
	be_close ??= 0;
	if (this.incapacitated() || this.lying) {
		return f.dot;
	}
	if (!this.Adjacent(M) && M.loc != this) {
		if (be_close == 0 && this.dna.check_mutation("Telekinesis")) {
			if (tkMaxRangeCheck(this, M)) {
				return 1;
			}
		}
		return f.dot;
	}
	return 1;
});

// human.dm:759
rt.def("/mob/living/carbon/human/proc/resist_restraints", function* resist_restraints(f: Frame) {
	if (this.wear_suit && this.wear_suit.breakouttime) {
		this.changeNext_move(100);
		this.last_special = rt.worldTime(f) + 100;
		yield* this.cuff_resist(this.wear_suit);
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// human.dm:767
rt.def("/mob/living/carbon/human/proc/replace_records_name", function replace_records_name(f: Frame, oldname: Value, newname: Value) {
	let L: Value = null, R: Value = null;
	for (L of each(list(GLOB.data_core.general, GLOB.data_core.medical, GLOB.data_core.security, GLOB.data_core.locked), T("/list"))) {
		if (R = find_record("name", oldname, L)) {
			rt.setAt(R.fields, "name", newname);
		}
	}
	return f.dot;
});

// human.dm:773
rt.def("/mob/living/carbon/human/proc/get_total_tint", function get_total_tint(f: Frame) {
	f.dot = parent_proc();
	if (!this.glasses) return f.dot;
	f.dot += this.glasses.tint;
	return f.dot;
});

// human.dm:778
rt.def("/mob/living/carbon/human/proc/update_health_hud", function update_health_hud(f: Frame) {
	let health_amount: Value = null, X: Value = null, BP: Value = null, damage: Value = null, comparison: Value = null, icon_num: Value = null, t: Value = null;
	let $e: any;
	if (!this.client || !this.hud_used) {
		return f.dot;
	}
	if (this.dna.species.update_health_hud()) {
		return f.dot;
	} else {
		if (this.hud_used.healths) {
			if (parent_proc((health_amount = this.health - this.staminaloss))) {
				if (this.hal_screwyhud === SCREWYHUD_CRIT) {
					this.hud_used.healths.icon_state = "health6";
				} else if (this.hal_screwyhud === SCREWYHUD_DEAD) {
					this.hud_used.healths.icon_state = "health7";
				} else if (this.hal_screwyhud === SCREWYHUD_HEALTHY) {
					this.hud_used.healths.icon_state = "health0";
				}
			}
		}
		if (!this.hud_used.healthdoll) return f.dot;
		this.hud_used.healthdoll.cut_overlays();
		if (this.stat != SCREWYHUD_DEAD) {
			this.hud_used.healthdoll.icon_state = "healthdoll_OVERLAY";
			for (X of each(this.bodyparts)) {
				BP = X;
				damage = BP.burn_dam + BP.brute_dam;
				comparison = BP.max_damage / 5;
				icon_num = 0;
				if (damage) {
					icon_num = 1;
				}
				if (damage > comparison) {
					icon_num = 2;
				}
				if (damage > comparison * 2) {
					icon_num = 3;
				}
				if (damage > comparison * 3) {
					icon_num = 4;
				}
				if (damage > comparison * 4) {
					icon_num = 5;
				}
				if (this.hal_screwyhud == SCREWYHUD_HEALTHY) {
					icon_num = 0;
				}
				if (icon_num) {
					this.hud_used.healthdoll.add_overlay(mutable_appearance(rt.rsc("icons/mob/screen_gen.dmi"), `${BP.body_zone}${icon_num}`));
				}
			}
			for (t of each(this.get_missing_limbs())) {
				this.hud_used.healthdoll.add_overlay(mutable_appearance(rt.rsc("icons/mob/screen_gen.dmi"), `${t}6`));
			}
		} else {
			this.hud_used.healthdoll.icon_state = "healthdoll_DEAD";
		}
	}
	return f.dot;
});

// human.dm:823
rt.def("/mob/living/carbon/human/proc/fully_heal", function* fully_heal(f: Frame) {
	let HM: Value = null;
	if (f.args[0] === null) {
		f.args[0] = 0;
	}
	if (f.args[0]) {
		yield* this.regenerate_limbs();
		yield* this.regenerate_organs();
	}
	yield* this.remove_all_embedded_objects();
	this.set_heartattack(0);
	this.drunkenness = 0;
	for (HM of each(this.dna.mutations, T("/datum/mutation/human"))) {
		if (HM.quality != 1) {
			yield* this.dna.remove_mutation(HM.name);
		}
	}
	yield* parent_proc();
	return f.dot;
}, true, { args: ["admin_revive"] });

// human.dm:835
rt.def("/mob/living/carbon/human/proc/influenceSin", function influenceSin(f: Frame) {
	let O: Value = null;
	const die = rand(1, 7);
	if (die === 1) {
		log_game(`${this} was influenced by the sin of Acedia.`);
		O = new_(T("/datum/objective/sintouched/acedia"));
	} else if (die === 2) {
		log_game(`${this} was influenced by the sin of gluttony.`);
		O = new_(T("/datum/objective/sintouched/gluttony"));
	} else if (die === 3) {
		log_game(`${this} was influenced by the sin of greed.`);
		O = new_(T("/datum/objective/sintouched/greed"));
	} else if (die === 4) {
		log_game(`${this} was influenced by the sin of sloth.`);
		O = new_(T("/datum/objective/sintouched/sloth"));
	} else if (die === 5) {
		log_game(`${this} was influenced by the sin of wrath.`);
		O = new_(T("/datum/objective/sintouched/wrath"));
	} else if (die === 6) {
		log_game(`${this} was influenced by the sin of envy.`);
		O = new_(T("/datum/objective/sintouched/envy"));
	} else if (die === 7) {
		log_game(`${this} was influenced by the sin of pride.`);
		O = new_(T("/datum/objective/sintouched/pride"));
	}
	GLOB.SSticker.mode.sintouched += this.mind;
	this.mind.objectives += O;
	this.mind.announce_objectives();
	return f.dot;
});

// human.dm:862
rt.def("/mob/living/carbon/human/proc/check_weakness", function* check_weakness(f: Frame, weapon: Value, attacker: Value) {
	f.dot = (yield* parent_proc());
	if (!(this.dna && this.dna.species)) return f.dot;
	f.dot += (yield* this.dna.species.check_weakness(weapon, attacker));
	return f.dot;
}, true);

// human.dm:873
rt.def("/mob/living/carbon/human/proc/update_gravity", function* update_gravity(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	f.args[1] = this.dna.species.override_float;
	yield* parent_proc();
	return f.dot;
}, true, { args: ["has_gravity", "override"] });

// human.dm:877
rt.def("/mob/living/carbon/human/proc/vomit", function* vomit(f: Frame) {
	if (f.args[0] === null) {
		f.args[0] = 10;
	}
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (f.args[2] === null) {
		f.args[2] = 1;
	}
	if (f.args[3] === null) {
		f.args[3] = 0;
	}
	if (f.args[4] === null) {
		f.args[4] = 1;
	}
	if (f.args[5] === null) {
		f.args[5] = 0;
	}
	if (f.args[1] && rt.isIn(f, NOBLOOD, this.dna.species.species_traits)) {
		if (f.args[4]) {
			this.visible_message(`<span class='warning'>${this} dry heaves!</span>`, "<span class='userdanger'>You try to throw up, but there's nothing in your stomach!</span>");
		}
		if (f.args[2]) {
			yield* this.Knockdown(200);
		}
		return 1;
	}
	yield* parent_proc();
	return f.dot;
}, true, { args: ["lost_nutrition", "blood", "stun", "distance", "message", "toxic"] });

// human.dm:887
rt.def("/mob/living/carbon/human/proc/Bump", function* Bump(f: Frame, A: Value) {
	let FP: Value = null;
	yield* parent_proc();
	let crashdir: Value = rt.getDir(f, this, A);
	if (!(FP = this.get_flightpack())) return f.dot;
	yield* FP.flight_impact(A, crashdir);
	return f.dot;
}, true);

// human.dm:894
rt.def("/mob/living/carbon/human/proc/vv_get_dropdown", function vv_get_dropdown(f: Frame) {
	f.dot = parent_proc();
	rt.setAt((f.dot += "---"), "Make monkey", fmt("?_src_=vars;makemonkey=＃", [this]));
	rt.setAt(f.dot, "Set Species", fmt("?_src_=vars;setspecies=＃", [this]));
	rt.setAt(f.dot, "Make cyborg", fmt("?_src_=vars;makerobot=＃", [this]));
	rt.setAt(f.dot, "Make alien", fmt("?_src_=vars;makealien=＃", [this]));
	rt.setAt(f.dot, "Make slime", fmt("?_src_=vars;makeslime=＃", [this]));
	rt.setAt(f.dot, "Toggle Purrbation", fmt("?_src_=vars;purrbation=＃", [this]));
	return f.dot;
});

// human.dm:904
rt.def("/mob/living/carbon/human/proc/MouseDrop_T", function* MouseDrop_T(f: Frame, target: Value, user: Value) {
	if (target != this.pulling || this.grab_state < 1 || user != target || !rt.istype(user, T("/mob/living")) || this.stat || user.stat) {
		f.dot = (yield* parent_proc());
		return f.dot;
	}
	yield* this.buckle_mob(target, 1, 1);
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// human.dm:911
rt.def("/mob/living/carbon/human/proc/buckle_mob", function* buckle_mob(f: Frame, M: Value, force: Value, check_loc: Value) {
	force ??= 0;
	check_loc ??= 1;
	if (!force) {
		return f.dot;
	}
	if (!is_type_in_typecache(M, this.can_ride_typecache)) {
		M.visible_message(`<span class='warning'>${M} really can't seem to mount ${this}...</span>`);
		return f.dot;
	}
	if (!this.riding_datum) {
		this.riding_datum = (yield* new_(T("/datum/riding/human"), this));
	}
	if (this.buckled_mobs && (rt.isIn(f, M, this.buckled_mobs) || rt.len(f, this.buckled_mobs) >= this.max_buckled_mobs) || this.buckled || M.stat != 0) {
		return f.dot;
	}
	this.visible_message(`<span class='notice'>${M} starts to climb onto ${this}...</span>`);
	if (yield* do_after(M, 15, { target: this })) {
		if (rt.istype(M, T("/mob/living/carbon"))) {
			if (M.incapacitated(0, 1) || this.incapacitated(0, 1)) {
				M.visible_message(`<span class='warning'>${M} can't hang onto ${this}!</span>`);
				return f.dot;
			}
			if (!(yield* this.riding_datum.equip_buckle_inhands(M, 2))) {
				M.visible_message(`<span class='warning'>${M} can't climb onto ${this}!</span>`);
				return f.dot;
			}
		}
		f.dot = (yield* parent_proc(M, force, check_loc));
		yield* this.stop_pulling();
	} else {
		this.visible_message(`<span class='warning'>${M} fails to climb onto ${this}!</span>`);
	}
	return f.dot;
}, true);

// human.dm:935
rt.def("/mob/living/carbon/human/proc/unbuckle_mob", function* unbuckle_mob(f: Frame, M: Value, force: Value) {
	force ??= 0;
	if (rt.istype(M, T("/mob/living/carbon"))) {
		if (this.riding_datum) {
			yield* this.riding_datum.unequip_buckle_inhands(M);
			yield* this.riding_datum.restore_position(M);
		}
	}
	f.dot = (yield* parent_proc(M, force));
	return f.dot;
}, true);
