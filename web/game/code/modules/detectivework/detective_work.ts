// Based on /tg/station's code/modules/detectivework/detective_work.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, add, fmt } = rt;


// detective_work.dm:6
rt.def("/atom/proc/add_fibers", function* add_fibers(f: Frame, M: Value) {
	let G: Value = null, fibertext: Value = null;
	if (M.gloves && rt.istype(M.gloves, T("/obj/item/clothing"))) {
		if ((G = M.gloves).transfer_blood > 1) {
			if (yield* this.add_blood(G.blood_DNA)) {
				G.transfer_blood--;
			}
		}
	} else if (M.bloody_hands > 1) {
		if (yield* this.add_blood(M.blood_DNA)) {
			M.bloody_hands--;
		}
	}
	if (!this.suit_fibers) {
		this.suit_fibers = list();
	}
	let item_multiplier: Value = rt.istype(this, T("/obj/item")) ? 1.2 : 1;
	if (M.wear_suit) {
		fibertext = fmt("Material from ＇！.", [M.wear_suit]);
		if (prob(10 * item_multiplier) && !rt.isIn(f, fibertext, this.suit_fibers)) {
			this.suit_fibers += fibertext;
		}
		if (!rt.bitAnd(M.wear_suit.body_parts_covered, CHEST)) {
			if (M.w_uniform) {
				fibertext = fmt("Fibers from ＇！.", [M.w_uniform]);
				if (prob(12 * item_multiplier) && !rt.isIn(f, fibertext, this.suit_fibers)) {
					this.suit_fibers += fibertext;
				}
			}
		}
		if (!rt.bitAnd(M.wear_suit.body_parts_covered, HANDS)) {
			if (M.gloves) {
				fibertext = `Material from a pair of ${M.gloves.name}.`;
				if (prob(20 * item_multiplier) && !rt.isIn(f, fibertext, this.suit_fibers)) {
					this.suit_fibers += fibertext;
				}
			}
		}
	} else if (M.w_uniform) {
		fibertext = fmt("Fibers from ＇！.", [M.w_uniform]);
		if (prob(15 * item_multiplier) && !rt.isIn(f, fibertext, this.suit_fibers)) {
			this.suit_fibers += fibertext;
		}
		if (M.gloves) {
			fibertext = `Material from a pair of ${M.gloves.name}.`;
			if (prob(20 * item_multiplier) && !rt.isIn(f, fibertext, this.suit_fibers)) {
				this.suit_fibers += `Material from a pair of ${M.gloves.name}.`;
			}
		}
	} else {
		if (!M.gloves) return f.dot;
		fibertext = `Material from a pair of ${M.gloves.name}.`;
		if (!(prob(20 * item_multiplier) && !rt.isIn(f, fibertext, this.suit_fibers))) return f.dot;
		this.suit_fibers += `Material from a pair of ${M.gloves.name}.`;
	}
	return f.dot;
}, true);

// detective_work.dm:52
rt.def("/atom/proc/add_hiddenprint", function add_hiddenprint(f: Frame, M: Value) {
	let H: Value = null, laststamppos: Value = null;
	if (!M || !M.key) {
		return f.dot;
	}
	if (!this.fingerprintshidden) {
		this.fingerprintshidden = list();
	}
	let hasgloves: Value = "";
	if (rt.istype(M, T("/mob/living/carbon/human"))) {
		if ((H = M).gloves) {
			hasgloves = "(gloves)";
		}
	}
	let current_time: Value = time_stamp();
	if (!rt.index(this.fingerprintshidden, M.key)) {
		rt.setAt(this.fingerprintshidden, M.key, `First: ${M.real_name}[${current_time}]${hasgloves}. Ckey: ${M.ckey}`);
	} else {
		if (laststamppos = findtext(rt.index(this.fingerprintshidden, M.key), " Last: ")) {
			rt.setAt(this.fingerprintshidden, M.key, copytext(rt.index(this.fingerprintshidden, M.key), 1, laststamppos));
		}
		rt.modAt(this.fingerprintshidden, M.key, ` Last: ${M.real_name}[${current_time}]${hasgloves}. Ckey: ${M.ckey}`, add);
	}
	this.fingerprintslast = M.ckey;
	return f.dot;
});

// detective_work.dm:78
rt.def("/atom/proc/add_fingerprint", function* add_fingerprint(f: Frame, M: Value, ignoregloves: Value) {
	let H: Value = null, G: Value = null;
	ignoregloves ??= 0;
	if (!M || !M.key) {
		return f.dot;
	}
	this.add_hiddenprint(M);
	if (!rt.istype(M, T("/mob/living/carbon/human"))) return f.dot;
	yield* this.add_fibers((H = M));
	if (H.gloves) {
		if ((G = H.gloves).transfer_prints) {
			ignoregloves = 1;
		}
		if (!ignoregloves) {
			yield* H.gloves.add_fingerprint(H, 1);
			return f.dot;
		}
	}
	if (!this.fingerprints) {
		this.fingerprints = list();
	}
	let full_print: Value = md5(H.dna.uni_identity);
	rt.setAt(this.fingerprints, full_print, full_print);
	return f.dot;
}, true);

// detective_work.dm:108
rt.def("/atom/proc/transfer_fingerprints_to", function transfer_fingerprints_to(f: Frame, A: Value) {
	if (!rt.istype(A.fingerprints, T("/list"))) {
		A.fingerprints = list();
	}
	if (!rt.istype(A.fingerprintshidden, T("/list"))) {
		A.fingerprintshidden = list();
	}
	if (!rt.istype(this.fingerprints, T("/list"))) {
		this.fingerprints = list();
	}
	if (!rt.istype(this.fingerprintshidden, T("/list"))) {
		this.fingerprintshidden = list();
	}
	if (this.fingerprints) {
		(rt.modField(f, A, "fingerprints", this.fingerprints.Copy(), rt.bitOr));
	}
	if (this.fingerprintshidden) {
		(rt.modField(f, A, "fingerprintshidden", this.fingerprintshidden.Copy(), rt.bitOr));
	}
	A.fingerprintslast = this.fingerprintslast;
	return f.dot;
});
