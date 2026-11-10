// Based on /tg/station's code/datums/mutations.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


// mutations.dm:1
rt.def("/datum/controller/global_vars/proc/InitGlobalmutations_list", function InitGlobalmutations_list(f: Frame) {
	GLOB.mutations_list = list();
	this.gvars_datum_init_order += "mutations_list";
	return f.dot;
});

rt.type(589, "/datum/mutation/human", "/datum/mutation", {
	dna_block: null,
	quality: null,
	get_chance: 100,
	lowest_value: 2048,
	text_gain_indication: "",
	text_lose_indication: "",
	visual_indicators: null,
	layer_used: 26,
	species_allowed: null,
	health_req: null,
	limb_req: null,
	time_coeff: 1,
});

// mutations.dm:18
rt.def("/datum/mutation/human/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.visual_indicators = list();

	this.species_allowed = list();
	return f.dot;
});

// mutations.dm:26
rt.def("/datum/mutation/human/proc/force_give", function* force_give(f: Frame, owner: Value) {
	this.set_block(owner);
	f.dot = (yield* this.on_acquiring(owner));
	return f.dot;
}, true);

// mutations.dm:30
rt.def("/datum/mutation/human/proc/force_lose", function* force_lose(f: Frame, owner: Value) {
	this.set_block(owner, 0);
	f.dot = (yield* this.on_losing(owner));
	return f.dot;
}, true);

// mutations.dm:34
rt.def("/datum/mutation/human/proc/set_se", function set_se(f: Frame, se_string: Value, on: Value) {
	on ??= 1;
	if (!se_string || lentext(se_string) < 57) {
		return f.dot;
	}
	let before: Value = copytext(se_string, 1, (this.dna_block - 1) * DNA_BLOCK_SIZE + 1);
	let injection: Value = num2hex(on ? rand(this.lowest_value, 4095) : rand(0, this.lowest_value - 1), DNA_BLOCK_SIZE);
	let after: Value = copytext(se_string, this.dna_block * DNA_BLOCK_SIZE + 1, 0);
	return before + injection + after;
});

// mutations.dm:42
rt.def("/datum/mutation/human/proc/set_block", function set_block(f: Frame, owner: Value, on: Value) {
	on ??= 1;
	if (!(owner && owner.has_dna())) return f.dot;
	owner.dna.struc_enzymes = this.set_se(owner.dna.struc_enzymes, on);
	return f.dot;
});

// mutations.dm:46
rt.def("/datum/mutation/human/proc/check_block_string", function check_block_string(f: Frame, se_string: Value) {
	if (!se_string || lentext(se_string) < 57) {
		return 0;
	}
	if (!(hex2num(getblock(se_string, this.dna_block)) >= this.lowest_value)) return f.dot;
	return 1;
});

// mutations.dm:52
rt.def("/datum/mutation/human/proc/check_block", function* check_block(f: Frame, owner: Value, force_powers: Value) {
	force_powers ??= 0;
	if (this.check_block_string(owner.dna.struc_enzymes)) {
		if (prob(this.get_chance) || force_powers) {
			f.dot = (yield* this.on_acquiring(owner));
		}
	} else {
		f.dot = (yield* this.on_losing(owner));
	}
	return f.dot;
}, true);

// mutations.dm:59
rt.def("/datum/mutation/human/proc/on_acquiring", function on_acquiring(f: Frame, owner: Value) {
	if (!owner || !rt.istype(owner, T("/mob/living/carbon/human")) || owner.stat == 2 || rt.isIn(f, this, owner.dna.mutations)) {
		return 1;
	}
	if (rt.len(f, this.species_allowed) && !this.species_allowed.Find(owner.dna.species.id)) {
		return 1;
	}
	if (this.health_req && owner.health < this.health_req) {
		return 1;
	}
	if (this.limb_req && !owner.get_bodypart(this.limb_req)) {
		return 1;
	}
	owner.dna.mutations.Add(this);
	if (this.text_gain_indication) {
		to_chat(owner, this.text_gain_indication);
	}
	if (!rt.len(f, this.visual_indicators)) return f.dot;
	let mut_overlay: Value = list(this.get_visual_indicator(owner));
	if (rt.index(owner.overlays_standing, this.layer_used)) {
		mut_overlay = rt.index(owner.overlays_standing, this.layer_used);
		(mut_overlay = rt.modify(mut_overlay, this.get_visual_indicator(owner), rt.bitOr));
	}
	owner.remove_overlay(this.layer_used);
	rt.setAt(owner.overlays_standing, this.layer_used, mut_overlay);
	owner.apply_overlay(this.layer_used);
	return f.dot;
});

// mutations.dm:95
rt.def("/datum/mutation/human/proc/on_losing", function on_losing(f: Frame, owner: Value) {
	let mut_overlay: Value = null;
	if (owner && rt.istype(owner, T("/mob/living/carbon/human")) && owner.dna.mutations.Remove(this)) {
		if (this.text_lose_indication && owner.stat != 2) {
			to_chat(owner, this.text_lose_indication);
		}
		if (rt.len(f, this.visual_indicators)) {
			mut_overlay = list();
			if (rt.index(owner.overlays_standing, this.layer_used)) {
				mut_overlay = rt.index(owner.overlays_standing, this.layer_used);
			}
			owner.remove_overlay(this.layer_used);
			mut_overlay.Remove(this.get_visual_indicator(owner));
			rt.setAt(owner.overlays_standing, this.layer_used, mut_overlay);
			owner.apply_overlay(this.layer_used);
		}
		return 0;
	}
	return 1;
});

// mutations.dm:114
rt.def("/datum/mutation/human/proc/get_spans", function get_spans(f: Frame) {
	return list();
});

rt.type(590, "/datum/mutation/human/hulk", "/datum/mutation/human", {
	name: "Hulk",
	quality: 1,
	get_chance: 15,
	lowest_value: 3072,
	text_gain_indication: "<span class='notice'>Your muscles hurt!</span>",
	species_allowed: null,
	health_req: 25,
});

// mutations.dm:123
rt.def("/datum/mutation/human/hulk/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.species_allowed = list("human");
	return f.dot;
});

// mutations.dm:127
rt.def("/datum/mutation/human/hulk/proc/on_acquiring", function* on_acquiring(f: Frame, owner: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	let status: Value = 15;
	(rt.modField(f, owner, "status_flags", rt.op(f, "BitNot", [], [status]), rt.bitAnd));
	yield* owner.update_body_parts();
	return f.dot;
}, true);

// mutations.dm:135
rt.def("/datum/mutation/human/hulk/proc/on_attack_hand", function* on_attack_hand(f: Frame, owner: Value, target: Value, proximity: Value) {
	if (!proximity) return f.dot;
	return (yield* target.attack_hulk(owner));
}, true);

// mutations.dm:138
rt.def("/datum/mutation/human/hulk/proc/on_life", function* on_life(f: Frame, owner: Value) {
	if (!(owner.health < 0)) return f.dot;
	yield* this.on_losing(owner);
	to_chat(owner, "<span class='danger'>You suddenly feel very weak.</span>");
	return f.dot;
}, true);

// mutations.dm:143
rt.def("/datum/mutation/human/hulk/proc/on_losing", function* on_losing(f: Frame, owner: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	(rt.modField(f, owner, "status_flags", 15, rt.bitOr));
	yield* owner.update_body_parts();
	return f.dot;
}, true);

// mutations.dm:150
rt.def("/datum/mutation/human/hulk/proc/say_mod", function say_mod(f: Frame, message: Value) {
	if (message) {
		message = `${uppertext(replacetext(message, ".", "!"))}!!`;
	}
	return message;
});

rt.type(591, "/datum/mutation/human/telekinesis", "/datum/mutation/human", {
	name: "Telekinesis",
	quality: 1,
	get_chance: 20,
	lowest_value: 3072,
	text_gain_indication: "<span class='notice'>You feel smarter!</span>",
	limb_req: "head",
});

// mutations.dm:163
rt.def("/datum/mutation/human/telekinesis/proc/New", function New(f: Frame) {
	parent_proc();
	(rt.modSrcVar(f, "visual_indicators", mutable_appearance(rt.rsc("icons/effects/genetics.dmi"), "telekinesishead", -26), rt.bitOr));
	return f.dot;
});

// mutations.dm:167
rt.def("/datum/mutation/human/telekinesis/proc/get_visual_indicator", function get_visual_indicator(f: Frame, owner: Value) {
	return rt.index(this.visual_indicators, 1);
});

// mutations.dm:170
rt.def("/datum/mutation/human/telekinesis/proc/on_ranged_attack", function* on_ranged_attack(f: Frame, owner: Value, target: Value) {
	yield* target.attack_tk(owner);
	return f.dot;
}, true);

rt.type(592, "/datum/mutation/human/cold_resistance", "/datum/mutation/human", {
	name: "Cold Resistance",
	quality: 1,
	get_chance: 25,
	lowest_value: 3072,
	text_gain_indication: "<span class='notice'>Your body feels warm!</span>",
	time_coeff: 5,
});

// mutations.dm:182
rt.def("/datum/mutation/human/cold_resistance/proc/New", function New(f: Frame) {
	parent_proc();
	(rt.modSrcVar(f, "visual_indicators", mutable_appearance(rt.rsc("icons/effects/genetics.dmi"), "fire", -26), rt.bitOr));
	return f.dot;
});

// mutations.dm:186
rt.def("/datum/mutation/human/cold_resistance/proc/get_visual_indicator", function get_visual_indicator(f: Frame, owner: Value) {
	return rt.index(this.visual_indicators, 1);
});

// mutations.dm:189
rt.def("/datum/mutation/human/cold_resistance/proc/on_life", function* on_life(f: Frame, owner: Value) {
	if (!owner.getFireLoss()) return f.dot;
	if (!prob(1)) return f.dot;
	yield* owner.heal_bodypart_damage(0, 1);
	return f.dot;
}, true);

rt.type(593, "/datum/mutation/human/x_ray", "/datum/mutation/human", {
	name: "X Ray Vision",
	quality: 1,
	get_chance: 25,
	lowest_value: 3072,
	text_gain_indication: "<span class='notice'>The walls suddenly disappear!</span>",
	time_coeff: 2,
});

// mutations.dm:203
rt.def("/datum/mutation/human/x_ray/proc/on_acquiring", function* on_acquiring(f: Frame, owner: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	yield* owner.update_sight();
	return f.dot;
}, true);

// mutations.dm:209
rt.def("/datum/mutation/human/x_ray/proc/on_losing", function* on_losing(f: Frame, owner: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	yield* owner.update_sight();
	return f.dot;
}, true);

rt.type(594, "/datum/mutation/human/nearsight", "/datum/mutation/human", {
	name: "Near Sightness",
	quality: 3,
	text_gain_indication: "<span class='danger'>You can't see very well.</span>",
});

// mutations.dm:220
rt.def("/datum/mutation/human/nearsight/proc/on_acquiring", function* on_acquiring(f: Frame, owner: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	yield* owner.become_nearsighted();
	return f.dot;
}, true);

// mutations.dm:225
rt.def("/datum/mutation/human/nearsight/proc/on_losing", function* on_losing(f: Frame, owner: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	yield* owner.cure_nearsighted();
	return f.dot;
}, true);

rt.type(595, "/datum/mutation/human/epilepsy", "/datum/mutation/human", {
	name: "Epilepsy",
	quality: 2,
	text_gain_indication: "<span class='danger'>You get a headache.</span>",
});

// mutations.dm:236
rt.def("/datum/mutation/human/epilepsy/proc/on_life", function* on_life(f: Frame, owner: Value) {
	if (!(prob(1) && owner.stat == 0)) return f.dot;
	owner.visible_message(`<span class='danger'>${owner} starts having a seizure!</span>`, "<span class='userdanger'>You have a seizure!</span>");
	yield* owner.Unconscious(200);
	owner.Jitter(1000);
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/datum/mutation/human/epilepsy/proc/jitter_less"), owner)), 90);
	return f.dot;
}, true);

// mutations.dm:244
rt.def("/datum/mutation/human/epilepsy/proc/jitter_less", function jitter_less(f: Frame, owner: Value) {
	if (!owner) return f.dot;
	owner.jitteriness = 10;
	return f.dot;
}, false, { argTypes: [{ type: 8, path: "/mob/living/carbon/human" }] });

rt.type(596, "/datum/mutation/human/bad_dna", "/datum/mutation/human", {
	name: "Unstable DNA",
	quality: 2,
	text_gain_indication: "<span class='danger'>You feel strange.</span>",
});

// mutations.dm:252
rt.def("/datum/mutation/human/bad_dna/proc/on_acquiring", function* on_acquiring(f: Frame, owner: Value) {
	let new_mob: Value = null;
	to_chat(owner, this.text_gain_indication);
	if (prob(95)) {
		if (prob(50)) {
			new_mob = (yield* owner.randmutb());
		} else {
			new_mob = (yield* owner.randmuti());
		}
	} else {
		new_mob = (yield* owner.randmutg());
	}
	if (new_mob && ismob(new_mob)) {
		owner = new_mob;
	}
	f.dot = owner;
	yield* this.on_losing(owner);
	return f.dot;
}, true);

rt.type(597, "/datum/mutation/human/cough", "/datum/mutation/human", {
	name: "Cough",
	quality: 3,
	text_gain_indication: "<span class='danger'>You start coughing.</span>",
});

// mutations.dm:272
rt.def("/datum/mutation/human/cough/proc/on_life", function* on_life(f: Frame, owner: Value) {
	if (!(prob(5) && owner.stat == 0)) return f.dot;
	yield* owner.drop_item();
	yield* owner.emote("cough");
	return f.dot;
}, true);

rt.type(598, "/datum/mutation/human/dwarfism", "/datum/mutation/human", {
	name: "Dwarfism",
	quality: 1,
	get_chance: 15,
	lowest_value: 3072,
});

// mutations.dm:283
rt.def("/datum/mutation/human/dwarfism/proc/on_acquiring", function on_acquiring(f: Frame, owner: Value) {
	if (parent_proc()) {
		return f.dot;
	}
	owner.resize = 0.8;
	owner.update_transform();
	(rt.modField(f, owner, "pass_flags", 1, rt.bitOr));
	owner.visible_message(`<span class='danger'>${owner} suddenly shrinks!</span>`, "<span class='notice'>Everything around you seems to grow..</span>");
	return f.dot;
}, false);

// mutations.dm:291
rt.def("/datum/mutation/human/dwarfism/proc/on_losing", function on_losing(f: Frame, owner: Value) {
	if (parent_proc()) {
		return f.dot;
	}
	owner.resize = 1.25;
	owner.update_transform();
	(rt.modField(f, owner, "pass_flags", 16777214, rt.bitAnd));
	owner.visible_message(`<span class='danger'>${owner} suddenly grows!</span>`, "<span class='notice'>Everything around you seems to shrink..</span>");
	return f.dot;
}, false);

rt.type(599, "/datum/mutation/human/clumsy", "/datum/mutation/human", {
	name: "Clumsiness",
	quality: 3,
	text_gain_indication: "<span class='danger'>You feel lightheaded.</span>",
});

// mutations.dm:305
rt.def("/datum/mutation/human/clumsy/proc/on_acquiring", function on_acquiring(f: Frame, owner: Value) {
	if (parent_proc()) {
		return f.dot;
	}
	(rt.modField(f, owner, "disabilities", 256, rt.bitOr));
	return f.dot;
}, false);

// mutations.dm:310
rt.def("/datum/mutation/human/clumsy/proc/on_losing", function on_losing(f: Frame, owner: Value) {
	if (parent_proc()) {
		return f.dot;
	}
	(rt.modField(f, owner, "disabilities", 16776959, rt.bitAnd));
	return f.dot;
}, false);

rt.type(600, "/datum/mutation/human/tourettes", "/datum/mutation/human", {
	name: "Tourettes Syndrome",
	quality: 2,
	text_gain_indication: "<span class='danger'>You twitch.</span>",
});

// mutations.dm:320
rt.def("/datum/mutation/human/tourettes/proc/on_life", function* on_life(f: Frame, owner: Value) {
	let $0: any, $1: any;
	if (!(prob(10) && owner.stat == 0)) return f.dot;
	yield* owner.Stun(200);
	const die = rand(1, 3);
	if (die === 1) {
		yield* owner.emote("twitch");
	} else if (rt.inRange(die, 2, 3)) {
		$0 = owner;
		if (prob(50)) {
			$1 = ";";
		} else {
			$1 = "";
		}
		yield* $0.say(`${$1}${pick("SHIT", "PISS", "FUCK", "CUNT", "COCKSUCKER", "MOTHERFUCKER", "TITS")}`);
	}
	let x_offset_old: Value = owner.pixel_x;
	let y_offset_old: Value = owner.pixel_y;
	let x_offset: Value = owner.pixel_x + rand(-2, 2);
	let y_offset: Value = owner.pixel_y + rand(-1, 1);
	rt.op(f, "Animate", [2, 8], [null, owner, "pixel_x", x_offset, "pixel_y", y_offset, "time", 1]);
	rt.op(f, "Animate", [2, 8], [null, owner, "pixel_x", x_offset_old, "pixel_y", y_offset_old, "time", 1]);
	return f.dot;
}, true);

rt.type(601, "/datum/mutation/human/nervousness", "/datum/mutation/human", {
	name: "Nervousness",
	quality: 3,
	text_gain_indication: "<span class='danger'>You feel nervous.</span>",
});

// mutations.dm:340
rt.def("/datum/mutation/human/nervousness/proc/on_life", function on_life(f: Frame, owner: Value) {
	if (!prob(10)) return f.dot;
	owner.stuttering = max(10, owner.stuttering);
	return f.dot;
});

rt.type(602, "/datum/mutation/human/deaf", "/datum/mutation/human", {
	name: "Deafness",
	quality: 2,
	text_gain_indication: "<span class='danger'>You can't seem to hear anything.</span>",
});

// mutations.dm:349
rt.def("/datum/mutation/human/deaf/proc/on_acquiring", function on_acquiring(f: Frame, owner: Value) {
	if (parent_proc()) {
		return f.dot;
	}
	(rt.modField(f, owner, "disabilities", 4, rt.bitOr));
	return f.dot;
}, false);

// mutations.dm:354
rt.def("/datum/mutation/human/deaf/proc/on_losing", function on_losing(f: Frame, owner: Value) {
	if (parent_proc()) {
		return f.dot;
	}
	(rt.modField(f, owner, "disabilities", 16777211, rt.bitAnd));
	return f.dot;
}, false);

rt.type(603, "/datum/mutation/human/blind", "/datum/mutation/human", {
	name: "Blindness",
	quality: 2,
	text_gain_indication: "<span class='danger'>You can't seem to see anything.</span>",
});

// mutations.dm:364
rt.def("/datum/mutation/human/blind/proc/on_acquiring", function* on_acquiring(f: Frame, owner: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	yield* owner.become_blind();
	return f.dot;
}, true);

// mutations.dm:369
rt.def("/datum/mutation/human/blind/proc/on_losing", function* on_losing(f: Frame, owner: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	yield* owner.cure_blind();
	return f.dot;
}, true);

rt.type(604, "/datum/mutation/human/race", "/datum/mutation/human", {
	name: "Monkified",
	quality: 2,
	time_coeff: 2,
});

// mutations.dm:380
rt.def("/datum/mutation/human/race/proc/on_acquiring", function* on_acquiring(f: Frame, owner: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	f.dot = (yield* owner.monkeyize(311));
	return f.dot;
}, true);

// mutations.dm:385
rt.def("/datum/mutation/human/race/proc/on_losing", function* on_losing(f: Frame, owner: Value) {
	if (!(owner && rt.istype(owner, T("/mob/living/carbon/monkey")) && owner.stat != TR_KEEPVIRUS && (yield* owner.dna.mutations.Remove(this)))) return f.dot;
	f.dot = (yield* owner.humanize(311));
	return f.dot;
}, true);

rt.type(605, "/datum/mutation/human/chameleon", "/datum/mutation/human", {
	name: "Chameleon",
	quality: 1,
	get_chance: 20,
	lowest_value: 3072,
	text_gain_indication: "<span class='notice'>You feel one with your surroundings.</span>",
	text_lose_indication: "<span class='notice'>You feel oddly exposed.</span>",
	time_coeff: 5,
});

// mutations.dm:398
rt.def("/datum/mutation/human/chameleon/proc/on_acquiring", function on_acquiring(f: Frame, owner: Value) {
	if (parent_proc()) {
		return f.dot;
	}
	owner.alpha = CHAMELEON_MUTATION_DEFAULT_TRANSPARENCY;
	return f.dot;
}, false);

// mutations.dm:403
rt.def("/datum/mutation/human/chameleon/proc/on_life", function on_life(f: Frame, owner: Value) {
	owner.alpha = max(0, owner.alpha - 25);
	return f.dot;
});

// mutations.dm:406
rt.def("/datum/mutation/human/chameleon/proc/on_move", function on_move(f: Frame, owner: Value) {
	owner.alpha = CHAMELEON_MUTATION_DEFAULT_TRANSPARENCY;
	return f.dot;
});

// mutations.dm:410
rt.def("/datum/mutation/human/chameleon/proc/on_attack_hand", function on_attack_hand(f: Frame, owner: Value, target: Value, proximity: Value) {
	if (!proximity) return f.dot;
	owner.alpha = CHAMELEON_MUTATION_DEFAULT_TRANSPARENCY;
	return f.dot;
});

// mutations.dm:414
rt.def("/datum/mutation/human/chameleon/proc/on_losing", function on_losing(f: Frame, owner: Value) {
	if (parent_proc()) {
		return f.dot;
	}
	owner.alpha = 255;
	return f.dot;
}, false);

rt.type(606, "/datum/mutation/human/wacky", "/datum/mutation/human", {
	name: "Wacky",
	quality: 3,
	text_gain_indication: "<span class='sans'>You feel an off sensation in your voicebox.</span>",
	text_lose_indication: "<span class='notice'>The off sensation passes.</span>",
});

// mutations.dm:425
rt.def("/datum/mutation/human/wacky/proc/get_spans", function get_spans(f: Frame) {
	return list("sans");
});

rt.type(607, "/datum/mutation/human/mute", "/datum/mutation/human", {
	name: "Mute",
	quality: 2,
	text_gain_indication: "<span class='danger'>You feel unable to express yourself at all.</span>",
	text_lose_indication: "<span class='danger'>You feel able to speak freely again.</span>",
});

// mutations.dm:434
rt.def("/datum/mutation/human/mute/proc/on_acquiring", function on_acquiring(f: Frame, owner: Value) {
	if (parent_proc()) {
		return f.dot;
	}
	(rt.modField(f, owner, "disabilities", 2, rt.bitOr));
	return f.dot;
}, false);

// mutations.dm:439
rt.def("/datum/mutation/human/mute/proc/on_losing", function on_losing(f: Frame, owner: Value) {
	if (parent_proc()) {
		return f.dot;
	}
	(rt.modField(f, owner, "disabilities", 16777213, rt.bitAnd));
	return f.dot;
}, false);

rt.type(608, "/datum/mutation/human/smile", "/datum/mutation/human", {
	name: "Smile",
	quality: 3,
	dna_block: -1,
	text_gain_indication: "<span class='notice'>You feel so happy. Nothing can be wrong with anything. :)</span>",
	text_lose_indication: "<span class='notice'>Everything is terrible again. :(</span>",
});

// mutations.dm:452
rt.def("/datum/mutation/human/smile/proc/say_mod", function say_mod(f: Frame, message: Value) {
	if (message) {
		message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = ` ${message} `), " stupid ", " smart ")), " retard ", " genius ")), " unrobust ", " robust ")), " dumb ", " smart ")), " awful ", " great ")), " gay ", pick(" nice ", " ok ", " alright "))), " horrible ", " fun ")), " terrible ", " terribly fun ")), " terrifying ", " wonderful ")), " gross ", " cool ")), " disgusting ", " amazing ")), " loser ", " winner ")), " useless ", " useful ")), " oh god ", " cheese and crackers ")), " jesus ", " gee wiz ")), " weak ", " strong ")), " kill ", " hug ")), " murder ", " tease ")), " ugly ", " beautiful ")), " douchbag ", " nice guy ")), " whore ", " lady ")), " nerd ", " smart guy ")), " moron ", " fun person ")), " IT'S LOOSE ", " EVERYTHING IS FINE ")), " sex ", " hug fight ")), " idiot ", " genius ")), " fat ", " thin ")), " beer ", " water with ice ")), " drink ", " water ")), " feminist ", " empowered woman ")), " i hate you ", " you're mean ")), " nigger ", " african american ")), " jew ", " jewish ")), " shit ", " shiz ")), " crap ", " poo ")), " slut ", " tease ")), " ass ", " butt ")), " damn ", " dang ")), " fuck ", "  ")), " penis ", " privates ")), " cunt ", " privates ")), " dick ", " jerk ")), " vagina ", " privates ");
	}
	return trim(message);
});

rt.type(609, "/datum/mutation/human/unintelligable", "/datum/mutation/human", {
	name: "Unintelligable",
	quality: 2,
	text_gain_indication: "<span class='danger'>You can't seem to form any coherent thoughts!</span>",
	text_lose_indication: "<span class='danger'>Your mind feels more clear.</span>",
});

// mutations.dm:507
rt.def("/datum/mutation/human/unintelligable/proc/say_mod", function say_mod(f: Frame, message: Value) {
	let prefix: Value = null, words: Value = null, rearranged: Value = null, i: Value = null, cword: Value = null, suffix: Value = null;
	if (message) {
		if ((prefix = copytext(message, 1, 2)) == ";") {
			message = copytext(message, 2);
		} else if (rt.isIn(f, prefix, list(":", "#"))) {
			prefix += copytext(message, 2, 3);
			message = copytext(message, 3);
		} else {
			prefix = "";
		}
		words = splittext(message, " ");
		rearranged = list();
		i = 1;
		while (i <= rt.len(f, words)) {
			cword = pick(words);
			words.Remove(cword);
			suffix = copytext(cword, rt.length(cword) - 1, rt.length(cword));
			while (rt.isIn(f, ((rt.length(cword) > 0 ? 1 : 0) && suffix), list(".", ",", ";", "!", ":", "?"))) {
				suffix = copytext((cword = copytext(cword, 1, rt.length(cword) - 1)), rt.length(cword) - 1, rt.length(cword));
			}
			if (rt.length(cword)) {
				rearranged += cword;
			}
			i++;
		}
		message = `${prefix}${uppertext(jointext(rearranged, " "))}!!`;
	}
	return message;
});

rt.type(610, "/datum/mutation/human/swedish", "/datum/mutation/human", {
	name: "Swedish",
	quality: 3,
	dna_block: -1,
	text_gain_indication: "<span class='notice'>You feel Swedish, however that works.</span>",
	text_lose_indication: "<span class='notice'>The feeling of Swedishness passes.</span>",
});

// mutations.dm:539
rt.def("/datum/mutation/human/swedish/proc/say_mod", function say_mod(f: Frame, message: Value) {
	if (message) {
		message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext(message, "w", "v")), "j", "y")), "a", pick("�", "�", "�", "a"))), "bo", "bjo")), "o", pick("�", "�", "o"));
		if (prob(30)) {
			message += ` Bork${pick("", ", bork", ", bork, bork")}!`;
		}
	}
	return message;
});

rt.type(611, "/datum/mutation/human/chav", "/datum/mutation/human", {
	name: "Chav",
	quality: 3,
	dna_block: -1,
	text_gain_indication: "<span class='notice'>Ye feel like a reet prat like, innit?</span>",
	text_lose_indication: "<span class='notice'>You no longer feel like being rude and sassy.</span>",
});

// mutations.dm:557
rt.def("/datum/mutation/human/chav/proc/say_mod", function say_mod(f: Frame, message: Value) {
	if (message) {
		message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = ` ${message} `), " looking at  ", "  gawpin' at ")), " great ", " bangin' ")), " man ", " mate ")), " friend ", pick(" mate ", " bruv ", " bledrin "))), " what ", " wot ")), " drink ", " wet ")), " get ", " giz ")), " what ", " wot ")), " no thanks ", " wuddent fukken do one ")), " i don't know ", " wot mate ")), " no ", " naw ")), " robust ", " chin ")), "  hi  ", " how what how ")), " hello ", " sup bruv ")), " kill ", " bang ")), " murder ", " bang ")), " windows ", " windies ")), " window ", " windy ")), " break ", " do ")), " your ", " yer ")), " security ", " coppers ");
	}
	return trim(message);
});

rt.type(612, "/datum/mutation/human/elvis", "/datum/mutation/human", {
	name: "Elvis",
	quality: 3,
	dna_block: -1,
	text_gain_indication: "<span class='notice'>You feel pretty good, honeydoll.</span>",
	text_lose_indication: "<span class='notice'>You feel a little less conversation would be great.</span>",
});

// mutations.dm:589
rt.def("/datum/mutation/human/elvis/proc/on_life", function on_life(f: Frame, owner: Value) {
	let dancetypes: Value = null, dancemoves: Value = null;
	const chosen = pick(1, 2);
	if (chosen === 1) {
		if (prob(15)) {
			dancetypes = list("swinging", "fancy", "stylish", "20'th century", "jivin'", "rock and roller", "cool", "salacious", "bashing", "smashing");
			dancemoves = pick(dancetypes);
			owner.visible_message(`<b>${owner}</b> busts out some ${dancemoves} moves!`);
		}
	} else if (chosen === 2) {
		if (!prob(15)) return f.dot;
		owner.visible_message(`<b>${owner}</b> ${pick("jiggles their hips", "rotates their hips", "gyrates their hips", "taps their foot", "dances to an imaginary song", "jiggles their legs", "snaps their fingers")}!`);
	}
	return f.dot;
});

// mutations.dm:601
rt.def("/datum/mutation/human/elvis/proc/say_mod", function say_mod(f: Frame, message: Value) {
	if (message) {
		message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = ` ${message} `), " i'm not ", " I aint ")), " girl ", pick(" honey ", " baby ", " baby doll "))), " man ", pick(" son ", " buddy ", " brother", " pal ", " friendo "))), " out of ", " outta ")), " thank you ", " thank you, thank you very much ")), " what are you ", " whatcha ")), " yes ", pick(" sure", "yea "))), " faggot ", " square ")), " muh valids ", " getting my kicks ");
	}
	return trim(message);
});

rt.type(613, "/datum/mutation/human/stoner", "/datum/mutation/human", {
	name: "Stoner",
	quality: 2,
	dna_block: -1,
	text_gain_indication: "<span class='notice'>You feel...totally chill, man!</span>",
	text_lose_indication: "<span class='notice'>You feel like you have a better sense of time.</span>",
});

// mutations.dm:621
rt.def("/datum/mutation/human/stoner/proc/on_acquiring", function* on_acquiring(f: Frame, owner: Value) {
	yield* parent_proc();
	yield* owner.grant_language(T("/datum/language/beachbum"));
	yield* owner.remove_language(T("/datum/language/common"));
	return f.dot;
}, true);

// mutations.dm:626
rt.def("/datum/mutation/human/stoner/proc/on_losing", function* on_losing(f: Frame, owner: Value) {
	yield* parent_proc();
	yield* owner.grant_language(T("/datum/language/common"));
	yield* owner.remove_language(T("/datum/language/beachbum"));
	return f.dot;
}, true);

rt.type(614, "/datum/mutation/human/laser_eyes", "/datum/mutation/human", {
	name: "Laser Eyes",
	quality: 1,
	dna_block: -1,
	text_gain_indication: "<span class='notice'>You feel pressure building up behind your eyes.</span>",
	layer_used: 21,
	limb_req: "head",
});

// mutations.dm:639
rt.def("/datum/mutation/human/laser_eyes/proc/New", function New(f: Frame) {
	parent_proc();
	(rt.modSrcVar(f, "visual_indicators", mutable_appearance(rt.rsc("icons/effects/genetics.dmi"), "lasereyes", -21), rt.bitOr));
	return f.dot;
});

// mutations.dm:643
rt.def("/datum/mutation/human/laser_eyes/proc/get_visual_indicator", function get_visual_indicator(f: Frame, owner: Value) {
	return rt.index(this.visual_indicators, 1);
});

// mutations.dm:646
rt.def("/datum/mutation/human/laser_eyes/proc/on_ranged_attack", function* on_ranged_attack(f: Frame, owner: Value, target: Value) {
	if (owner.a_intent != "harm") return f.dot;
	yield* owner.LaserEyes(target);
	return f.dot;
}, true);

// mutations.dm:654
rt.def("/mob/living/carbon/human/proc/update_mutations_overlay", function* update_mutations_overlay(f: Frame) {
	let CM: Value = null, mut_overlay: Value = null, V: Value = null, MA: Value = null;
	for (CM of each(this.dna.mutations, T("/datum/mutation/human"))) {
		if (rt.len(f, CM.species_allowed) && !CM.species_allowed.Find(this.dna.species.id)) {
			yield* CM.force_lose(this);
			continue;
		}
		if (rt.len(f, CM.visual_indicators)) {
			mut_overlay = list();
			if (rt.index(this.overlays_standing, CM.layer_used)) {
				mut_overlay = rt.index(this.overlays_standing, CM.layer_used);
			}
			V = CM.get_visual_indicator(this);
			if (!mut_overlay.Find(V)) {
				this.remove_overlay(CM.layer_used);
				MA = null;
				for (MA of each(CM.visual_indicators, T("/mutable_appearance"))) {
					yield* mut_overlay.Remove(MA);
				}
				(mut_overlay = rt.modify(mut_overlay, V, rt.bitOr));
				rt.setAt(this.overlays_standing, CM.layer_used, mut_overlay);
				this.apply_overlay(CM.layer_used);
			}
		}
	}
	return f.dot;
}, true);
