// Based on /tg/station's code/modules/mob/living/carbon/examine.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


// examine.dm:2
rt.def("/mob/living/carbon/proc/examine", function examine(f: Frame, user: Value) {
	let I: Value = null, t: Value = null, temp: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $e: any;
	let t_He: Value = this.p_they(1);
	let t_His: Value = this.p_their(1);
	let t_his: Value = this.p_their();
	let t_him: Value = this.p_them();
	let t_has: Value = this.p_have();
	let t_is: Value = this.p_are();
	let msg: Value = fmt("<span class='info'>*---------*\nThis is ＀ ＇<EM>！</EM>!\n", [bicon(this), this]);
	if (this.handcuffed) {
		msg += `<span class='warning'>${t_He} ${t_is} ${bicon(this.handcuffed)} handcuffed!</span>\n`;
	}
	if (this.head) {
		msg += fmt("＀ ＀ wearing ＀ ＇！ on ＀ head. \n", [t_He, t_is, bicon(this.head), this.head, t_his]);
	}
	if (this.wear_mask) {
		msg += fmt("＀ ＀ wearing ＀ ＇！ on ＀ face.\n", [t_He, t_is, bicon(this.wear_mask), this.wear_mask, t_his]);
	}
	if (this.wear_neck) {
		msg += fmt("＀ ＀ wearing ＀ ＇！ around ＀ neck.\n", [t_He, t_is, bicon(this.wear_neck), this.wear_neck, t_his]);
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
	if (this.back) {
		msg += fmt("＀ ＀ ＀ ＇！ on ＀ back.\n", [t_He, t_has, bicon(this.back), this.back, t_his]);
	}
	let appears_dead: Value = 0;
	if (this.stat == 2) {
		appears_dead = 1;
		if (this.getorgan(T("/obj/item/organ/brain"))) {
			msg += `<span class='deadsay'>${t_He} ${t_is} limp and unresponsive, with no signs of life.</span>\n`;
		} else if (this.get_bodypart("head")) {
			msg += `<span class='deadsay'>${t_He} appears that ${t_his} brain is missing...</span>\n`;
		}
	}
	let missing: Value = this.get_missing_limbs();
	for (t of each(missing)) {
		if (t == "head") {
			msg += `<span class='deadsay'><B>${t_His} ${parse_zone(t)} is missing!</B></span>\n`;
			continue;
		}
		msg += `<span class='warning'><B>${t_His} ${parse_zone(t)} is missing!</B></span>\n`;
	}
	msg += "<span class='warning'>";
	if (temp = this.getBruteLoss()) {
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
		if (this.getCloneLoss() < 30) {
			msg += `${t_He} ${t_is} slightly deformed.\n`;
		} else {
			msg += `<b>${t_He} ${t_is} severely deformed.</b>\n`;
		}
	}
	if (this.getBrainLoss() > 60) {
		msg += `${t_He} seems to be clumsy and unable to think.\n`;
	}
	if (this.fire_stacks > 0) {
		msg += `${t_He} ${t_is} covered in something flammable.\n`;
	}
	if (this.fire_stacks < 0) {
		msg += `${t_He} ${t_is} looks a little soaked.\n`;
	}
	if (this.pulledby && this.pulledby.grab_state) {
		msg += `${t_He} ${t_is} restrained by ${this.pulledby}'s grip.\n`;
	}
	msg += "</span>";
	if (!appears_dead) {
		if (this.stat == 1) {
			msg += `${t_He} ${t_is}n't responding to anything around ${t_him} and seems to be asleep.\n`;
		}
		if (this.digitalcamo) {
			msg += `${t_He} ${t_is} moving ${t_his} body in an unnatural and blatantly unsimian manner.\n`;
		}
	}
	msg += "*---------*</span>";
	to_chat(user, msg);
	return f.dot;
});
