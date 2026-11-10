// Based on /tg/station's code/modules/mob/living/carbon/human/examine.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


// examine.dm:3
rt.def("/mob/living/carbon/human/proc/examine", function examine(f: Frame, user: Value) {
	let accessory_msg: Value = null, U: Value = null, I: Value = null, hand_number: Value = null, foundghost: Value = null, G: Value = null, X: Value = null, BP: Value = null, I_14: Value = null, t: Value = null, i: Value = null, auto: Value = null, dodebug: Value = null, interestdebug: Value = null, H: Value = null, CIH: Value = null, perpname: Value = null, R: Value = null, cyberimp_detect: Value = null, CI: Value = null, health_r: Value = null, criminal: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $e: any;
	let t_He: Value = this.p_they(1);
	let t_His: Value = this.p_their(1);
	let t_his: Value = this.p_their();
	let t_him: Value = this.p_them();
	let t_has: Value = this.p_have();
	let t_is: Value = this.p_are();
	let msg: Value = `<span class='info'>*---------*\nThis is <EM>${this.name}</EM>!\n`;
	let obscured: Value = this.check_obscured_slots();
	let skipface: Value = ((this.wear_mask && rt.bitAnd(this.wear_mask.flags_inv, HIDEFACE)) || (this.head && rt.bitAnd(this.head.flags_inv, HIDEFACE)));
	if (this.w_uniform && !rt.isIn(f, slot_w_uniform, obscured)) {
		if (rt.istype(this.w_uniform, T("/obj/item/clothing/under"))) {
			if ((U = this.w_uniform).attached_accessory) {
				accessory_msg += fmt(" with ＀ ＇！", [bicon(U.attached_accessory), U.attached_accessory]);
			}
		}
		if (this.w_uniform.blood_DNA) {
			$0 = t_He;
			$1 = t_is;
			$2 = this.w_uniform;
			if (this.w_uniform.gender == "plural") {
				$3 = "some";
			} else {
				$3 = "a";
			}
			msg += fmt("<span class='warning'>＀ ＀ wearing ６＂ ＀ blood-stained ＀＀!</span>\n", [$0, $1, $2, $3, this.w_uniform.name, accessory_msg]);
		} else {
			msg += fmt("＀ ＀ wearing ＀ ＇！＀.\n", [t_He, t_is, bicon(this.w_uniform), this.w_uniform, accessory_msg]);
		}
	}
	if (this.head) {
		if (this.head.blood_DNA) {
			$0 = t_He;
			$1 = t_is;
			$2 = bicon(this.head);
			if (this.head.gender == "plural") {
				$3 = "some";
			} else {
				$3 = "a";
			}
			msg += `<span class='warning'>${$0} ${$1} wearing ${$2} ${$3} blood-stained ${this.head.name} on ${t_his} head!</span>\n`;
		} else {
			msg += fmt("＀ ＀ wearing ＀ ＇！ on ＀ head.\n", [t_He, t_is, bicon(this.head), this.head, t_his]);
		}
	}
	if (this.wear_suit) {
		if (this.wear_suit.blood_DNA) {
			$0 = t_He;
			$1 = t_is;
			$2 = bicon(this.wear_suit);
			if (this.wear_suit.gender == "plural") {
				$3 = "some";
			} else {
				$3 = "a";
			}
			msg += `<span class='warning'>${$0} ${$1} wearing ${$2} ${$3} blood-stained ${this.wear_suit.name}!</span>\n`;
		} else {
			msg += fmt("＀ ＀ wearing ＀ ＇！.\n", [t_He, t_is, bicon(this.wear_suit), this.wear_suit]);
		}
		if (this.s_store) {
			if (this.s_store.blood_DNA) {
				$0 = t_He;
				$1 = t_is;
				$2 = bicon(this.s_store);
				if (this.s_store.gender == "plural") {
					$3 = "some";
				} else {
					$3 = "a";
				}
				msg += `<span class='warning'>${$0} ${$1} carrying ${$2} ${$3} blood-stained ${this.s_store.name} on ${t_his} ${this.wear_suit.name}!</span>\n`;
			} else {
				msg += fmt("＀ ＀ carrying ＀ ＇！ on ＀ ＀.\n", [t_He, t_is, bicon(this.s_store), this.s_store, t_his, this.wear_suit.name]);
			}
		}
	}
	if (this.back) {
		if (this.back.blood_DNA) {
			$0 = t_He;
			$1 = t_has;
			$2 = bicon(this.back);
			if (this.back.gender == "plural") {
				$3 = "some";
			} else {
				$3 = "a";
			}
			msg += `<span class='warning'>${$0} ${$1} ${$2} ${$3} blood-stained ${this.back} on ${t_his} back.</span>\n`;
		} else {
			msg += fmt("＀ ＀ ＀ ＇！ on ＀ back.\n", [t_He, t_has, bicon(this.back), this.back, t_his]);
		}
	}
	for (I of each(this.held_items, T("/obj/item"))) {
		if (!rt.bitAnd(I.flags, ABSTRACT)) {
			if (I.blood_DNA) {
				$0 = t_He;
				$1 = t_is;
				$2 = bicon(I);
				if (I.gender == "plural") {
					$3 = "some";
				} else {
					$3 = "a";
				}
				msg += `<span class='warning'>${$0} ${$1} holding ${$2} ${$3} blood-stained ${I.name} in ${t_his} ${this.get_held_index_name(this.get_held_index_of_item(I))}!</span>\n`;
			} else {
				msg += fmt("＀ ＀ holding ＀ ＇！ in ＀ ＀.\n", [t_He, t_is, bicon(I), I, t_his, this.get_held_index_name(this.get_held_index_of_item(I))]);
			}
		}
	}
	if (this.gloves && !rt.isIn(f, slot_gloves, obscured)) {
		if (this.gloves.blood_DNA) {
			$0 = t_He;
			$1 = t_has;
			$2 = bicon(this.gloves);
			if (this.gloves.gender == "plural") {
				$3 = "some";
			} else {
				$3 = "a";
			}
			msg += `<span class='warning'>${$0} ${$1} ${$2} ${$3} blood-stained ${this.gloves.name} on ${t_his} hands!</span>\n`;
		} else {
			msg += fmt("＀ ＀ ＀ ＇！ on ＀ hands.\n", [t_He, t_has, bicon(this.gloves), this.gloves, t_his]);
		}
	} else if (this.blood_DNA) {
		if (hand_number = this.get_num_arms()) {
			$0 = t_He;
			$1 = t_has;
			if (hand_number > 1) {
				$2 = "";
			} else {
				$2 = "a";
			}
			if (hand_number > 1) {
				$3 = "s";
			} else {
				$3 = "";
			}
			msg += `<span class='warning'>${$0} ${$1} ${$2} blood-stained hand${$3}!</span>\n`;
		}
	}
	if (this.handcuffed) {
		if (rt.istype(this.handcuffed, T("/obj/item/weapon/restraints/handcuffs/cable"))) {
			msg += `<span class='warning'>${t_He} ${t_is} ${bicon(this.handcuffed)} restrained with cable!</span>\n`;
		} else {
			msg += `<span class='warning'>${t_He} ${t_is} ${bicon(this.handcuffed)} handcuffed!</span>\n`;
		}
	}
	if (this.belt) {
		if (this.belt.blood_DNA) {
			$0 = t_He;
			$1 = t_has;
			$2 = bicon(this.belt);
			if (this.belt.gender == "plural") {
				$3 = "some";
			} else {
				$3 = "a";
			}
			msg += `<span class='warning'>${$0} ${$1} ${$2} ${$3} blood-stained ${this.belt.name} about ${t_his} waist!</span>\n`;
		} else {
			msg += fmt("＀ ＀ ＀ ＇！ about ＀ waist.\n", [t_He, t_has, bicon(this.belt), this.belt, t_his]);
		}
	}
	if (this.shoes && !rt.isIn(f, slot_shoes, obscured)) {
		if (this.shoes.blood_DNA) {
			$0 = t_He;
			$1 = t_is;
			$2 = bicon(this.shoes);
			if (this.shoes.gender == "plural") {
				$3 = "some";
			} else {
				$3 = "a";
			}
			msg += `<span class='warning'>${$0} ${$1} wearing ${$2} ${$3} blood-stained ${this.shoes.name} on ${t_his} feet!</span>\n`;
		} else {
			msg += fmt("＀ ＀ wearing ＀ ＇！ on ＀ feet.\n", [t_He, t_is, bicon(this.shoes), this.shoes, t_his]);
		}
	}
	if (this.wear_mask && !rt.isIn(f, slot_wear_mask, obscured)) {
		if (this.wear_mask.blood_DNA) {
			$0 = t_He;
			$1 = t_has;
			$2 = bicon(this.wear_mask);
			if (this.wear_mask.gender == "plural") {
				$3 = "some";
			} else {
				$3 = "a";
			}
			msg += `<span class='warning'>${$0} ${$1} ${$2} ${$3} blood-stained ${this.wear_mask.name} on ${t_his} face!</span>\n`;
		} else {
			msg += fmt("＀ ＀ ＀ ＇！ on ＀ face.\n", [t_He, t_has, bicon(this.wear_mask), this.wear_mask, t_his]);
		}
	}
	if (this.wear_neck && !rt.isIn(f, slot_neck, obscured)) {
		msg += fmt("＀ ＀ wearing ＀ ＇！ around ＀ neck.\n", [t_He, t_is, bicon(this.wear_neck), this.wear_neck, t_his]);
	}
	if (this.glasses && !rt.isIn(f, slot_glasses, obscured)) {
		if (this.glasses.blood_DNA) {
			$0 = t_He;
			$1 = t_has;
			$2 = bicon(this.glasses);
			if (this.glasses.gender == "plural") {
				$3 = "some";
			} else {
				$3 = "a";
			}
			msg += `<span class='warning'>${$0} ${$1} ${$2} ${$3} blood-stained ${this.glasses} covering ${t_his} eyes!</span>\n`;
		} else {
			msg += fmt("＀ ＀ ＀ ＇！ covering ＀ eyes.\n", [t_He, t_has, bicon(this.glasses), this.glasses, t_his]);
		}
	}
	if (this.ears && !rt.isIn(f, slot_ears, obscured)) {
		msg += fmt("＀ ＀ ＀ ＇！ on ＀ ears.\n", [t_He, t_has, bicon(this.ears), this.ears, t_his]);
	}
	if (this.wear_id) {
		msg += fmt("＀ ＀ wearing ＀ ＇！.\n", [t_He, t_is, bicon(this.wear_id), this.wear_id]);
	}
	if (rt.inRange(this.jitteriness, 300, 1e+31)) {
		msg += `<span class='warning'><B>${t_He} ${t_is} convulsing violently!</B></span>\n`;
	} else if (rt.inRange(this.jitteriness, 200, 300)) {
		msg += `<span class='warning'>${t_He} ${t_is} extremely jittery.</span>\n`;
	} else if (rt.inRange(this.jitteriness, 100, 200)) {
		msg += `<span class='warning'>${t_He} ${t_is} twitching ever so slightly.</span>\n`;
	}
	let appears_dead: Value = 0;
	if (this.stat == 2 || rt.bitAnd(this.status_flags, FAKEDEATH)) {
		appears_dead = 1;
		if (this.suiciding) {
			msg += `<span class='warning'>${t_He} appear${this.p_s()} to have committed suicide... there is no hope of recovery.</span>\n`;
		}
		if (this.hellbound) {
			msg += `<span class='warning'>${t_His} soul seems to have been ripped out of ${t_his} body.  Revival is impossible.</span>\n`;
		}
		msg += `<span class='deadsay'>${t_He} ${t_is} limp and unresponsive; there are no signs of life`;
		if (this.getorgan(T("/obj/item/organ/brain"))) {
			if (!this.key) {
				foundghost = 0;
				if (this.mind) {
					for (G of each(GLOB.player_list, T("/mob/dead/observer"))) {
						if (G.mind == this.mind) {
							foundghost = 1;
							if (G.can_reenter_corpse == 0) {
								foundghost = 0;
							}
							break;
						}
					}
				}
				if (!foundghost) {
					msg += ` and ${t_his} soul has departed`;
				}
			}
		}
		msg += "...</span>\n";
	}
	if (this.get_bodypart("head") && !this.getorgan(T("/obj/item/organ/brain"))) {
		msg += `<span class='deadsay'>It appears that ${t_his} brain is missing...</span>\n`;
	}
	let temp: Value = this.getBruteLoss();
	msg += "<span class='warning'>";
	let missing: Value = list("head", "chest", "l_arm", "r_arm", "l_leg", "r_leg");
	for (X of each(this.bodyparts)) {
		missing -= (BP = X).body_zone;
		I_14 = null;
		for (I_14 of each(BP.embedded_objects, T("/obj/item"))) {
			msg += fmt("<B>＀ ＀ ＇！ ＀ embedded in ＀ ＀!</B>\n", [t_He, t_has, bicon(I_14), I_14, t_his, BP.name]);
		}
	}
	let l_limbs_missing: Value = 0;
	let r_limbs_missing: Value = 0;
	for (t of each(missing)) {
		if (t == "head") {
			msg += `<span class='deadsay'><B>${t_His} ${parse_zone(t)} is missing!</B><span class='warning'>\n`;
			continue;
		}
		if (t == "l_arm" || t == "l_leg") {
			l_limbs_missing++;
		} else if (t == "r_arm" || t == "r_leg") {
			r_limbs_missing++;
		}
		msg += `<B>${capitalize(t_his)} ${parse_zone(t)} is missing!</B>\n`;
	}
	if (l_limbs_missing >= 2 && r_limbs_missing == 0) {
		msg += `${t_He} looks all right now.\n`;
	} else if (l_limbs_missing == 0 && r_limbs_missing >= 2) {
		msg += `${t_He} really keeps to the left.\n`;
	} else if (l_limbs_missing >= 2 && r_limbs_missing >= 2) {
		msg += `${t_He} doesn't seem all there.\n`;
	}
	if (temp) {
		if (temp < 30) {
			msg += `${t_He} ${t_has} minor bruising.\n`;
		} else {
			msg += `<B>${t_He} ${t_has} severe bruising!</B>\n`;
		}
	}
	if (temp = this.getFireLoss()) {
		if (temp < 30) {
			msg += `${t_He} ${t_has} minor burns.\n`;
		} else {
			msg += `<B>${t_He} ${t_has} severe burns!</B>\n`;
		}
	}
	if (temp = this.getCloneLoss()) {
		if (temp < 30) {
			msg += `${t_He} ${t_has} minor cellular damage.\n`;
		} else {
			msg += `<B>${t_He} ${t_has} severe cellular damage.</B>\n`;
		}
	}
	if (this.fire_stacks > 0) {
		msg += `${t_He} ${t_is} covered in something flammable.\n`;
	}
	if (this.fire_stacks < 0) {
		msg += `${t_He} looks a little soaked.\n`;
	}
	if (this.pulledby && this.pulledby.grab_state) {
		msg += `${t_He} ${t_is} restrained by ${this.pulledby}'s grip.\n`;
	}
	if (this.nutrition < 100) {
		msg += `${t_He} ${t_is} severely malnourished.\n`;
	} else if (this.nutrition >= NUTRITION_LEVEL_FAT) {
		if (user.nutrition < 100) {
			msg += `${t_He} ${t_is} plump and delicious looking - Like a fat little piggy. A tasty piggy.\n`;
		} else {
			msg += `${t_He} ${t_is} quite chubby.\n`;
		}
	}
	if (this.blood_volume < BLOOD_VOLUME_SAFE) {
		msg += `${t_He} ${t_has} pale skin.\n`;
	}
	if (this.bleedsuppress) {
		msg += `${t_He} ${t_is} bandaged with something.\n`;
	} else if (this.bleed_rate) {
		if (this.reagents.has_reagent("heparin")) {
			msg += `<b>${t_He} ${t_is} bleeding uncontrollably!</b>\n`;
		} else {
			msg += `<B>${t_He} ${t_is} bleeding!</B>\n`;
		}
	}
	if (this.reagents.has_reagent("teslium")) {
		msg += `${t_He} is emitting a gentle blue glow!\n`;
	}
	if (rt.istype(this.stun_absorption, T("/list"))) {
		for (i of each(this.stun_absorption)) {
			if (rt.index(rt.index(this.stun_absorption, i), "end_time") > rt.worldTime(f) && rt.index(rt.index(this.stun_absorption, i), "examine_message")) {
				msg += `${t_He} ${t_is}${rt.index(rt.index(this.stun_absorption, i), "examine_message")}\n`;
			}
		}
	}
	if (this.drunkenness && !skipface && !appears_dead) {
		if (rt.inRange(this.drunkenness, 11, 21)) {
			msg += `${t_He} ${t_is} slightly flushed.\n`;
		} else if (rt.inRange(this.drunkenness, 21.01, 41)) {
			msg += `${t_He} ${t_is} flushed.\n`;
		} else if (rt.inRange(this.drunkenness, 41.01, 51)) {
			msg += `${t_He} ${t_is} quite flushed and ${t_his} breath smells of alcohol.\n`;
		} else if (rt.inRange(this.drunkenness, 51.01, 61)) {
			msg += `${t_He} is very flushed and ${t_his} movements jerky, with breath reeking of alcohol.\n`;
		} else if (rt.inRange(this.drunkenness, 61.01, 91)) {
			msg += `${t_He} looks like a drunken mess.\n`;
		} else if (rt.inRange(this.drunkenness, 91.01, 1e+31)) {
			msg += `${t_He} ${t_is} a shitfaced, slobbering wreck.\n`;
		}
	}
	msg += "</span>";
	if (!appears_dead) {
		if (this.stat == 1) {
			msg += `${t_He} ${t_is}n't responding to anything around ${t_him} and seems to be asleep.\n`;
		} else if (this.getBrainLoss() >= 60) {
			msg += `${t_He} ${t_has} a stupid expression on ${t_his} face.\n`;
		}
		if (this.getorgan(T("/obj/item/organ/brain"))) {
			if (rt.istype(this, T("/mob/living/carbon/human/interactive"))) {
				if ((auto = this).showexaminetext) {
					msg += `<span class='deadsay'>${t_He} ${t_is} appears to be some sort of sick automaton, ${t_his} eyes are glazed over and ${t_his} mouth is slightly agape.</span>\n`;
				}
				if (auto.debugexamine) {
					dodebug = auto.doing2string(auto.doing);
					interestdebug = auto.interest2string(auto.interest);
					msg += `<span class='deadsay'>${t_He} ${t_is} appears to be ${interestdebug} and ${dodebug}.</span>\n`;
				}
			} else if (!this.key) {
				msg += `<span class='deadsay'>${t_He} ${t_is} totally catatonic. The stresses of life in deep-space must have been too much for ${t_him}. Any recovery is unlikely.</span>\n`;
			} else if (!this.client) {
				msg += `${t_He} ${t_has} a blank, absent-minded stare and appears completely unresponsive to anything. ${t_He} may snap out of it soon.\n`;
			}
		}
		if (this.digitalcamo) {
			msg += `${t_He} ${t_is} moving ${t_his} body in an unnatural and blatantly inhuman manner.\n`;
		}
	}
	if (rt.istype(user, T("/mob/living/carbon/human"))) {
		H = user;
		CIH = H.getorgan(T("/obj/item/organ/cyberimp/eyes/hud"));
		if (rt.istype(H.glasses, T("/obj/item/clothing/glasses/hud")) || CIH) {
			if (perpname = this.get_face_name(this.get_id_name(""))) {
				if (R = find_record("name", perpname, GLOB.data_core.general)) {
					msg += `<span class='deptradio'>Rank:</span> ${rt.index(R.fields, "rank")}<br>`;
					msg += fmt("<a href='?src=＃;hud=1;photo_front=1'>[Front photo]</a> ", [this]);
					msg += fmt("<a href='?src=＃;hud=1;photo_side=1'>[Side photo]</a><br>", [this]);
				}
				if (rt.istype(H.glasses, T("/obj/item/clothing/glasses/hud/health")) || rt.istype(CIH, T("/obj/item/organ/cyberimp/eyes/hud/medical"))) {
					for (CI of each(this.internal_organs, T("/obj/item/organ/cyberimp"))) {
						if (CI.status == ORGAN_ROBOTIC) {
							cyberimp_detect += `${this.name} is modified with a ${CI.name}.<br>`;
						}
					}
					if (cyberimp_detect) {
						msg += "Detected cybernetic modifications:<br>";
						msg += cyberimp_detect;
					}
					if (R) {
						health_r = rt.index(R.fields, "p_stat");
						msg += fmt("<a href='?src=＃;hud=m;p_stat=1'>[＀]</a>", [this, health_r]);
						health_r = rt.index(R.fields, "m_stat");
						msg += fmt("<a href='?src=＃;hud=m;m_stat=1'>[＀]</a><br>", [this, health_r]);
					}
					if (R = find_record("name", perpname, GLOB.data_core.medical)) {
						msg += fmt("<a href='?src=＃;hud=m;evaluation=1'>[Medical evaluation]</a><br>", [this]);
					}
				}
				if (rt.istype(H.glasses, T("/obj/item/clothing/glasses/hud/security")) || rt.istype(CIH, T("/obj/item/organ/cyberimp/eyes/hud/security"))) {
					if (!user.stat && user != this) {
						criminal = "None";
						if (R = find_record("name", perpname, GLOB.data_core.security)) {
							criminal = rt.index(R.fields, "criminal");
						}
						msg += fmt("<span class='deptradio'>Criminal status:</span> <a href='?src=＃;hud=s;status=1'>[＀]</a>\n", [this, criminal]);
						msg += fmt("<span class='deptradio'>Security record:</span> <a href='?src=＃;hud=s;view=1'>[View]</a> ", [this]);
						msg += fmt("<a href='?src=＃;hud=s;add_crime=1'>[Add crime]</a> ", [this]);
						msg += fmt("<a href='?src=＃;hud=s;view_comment=1'>[View comment log]</a> ", [this]);
						msg += fmt("<a href='?src=＃;hud=s;add_comment=1'>[Add comment]</a>\n", [this]);
					}
				}
			}
		}
	}
	msg += "*---------*</span>";
	to_chat(user, msg);
	return f.dot;
});
