// Based on /tg/station's code/modules/mob/mob_transformation_simple.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g } = rt;


// mob_transformation_simple.dm:7
rt.def("/mob/proc/change_mob_type", function* change_mob_type(f: Frame, new_type: Value, location: Value, new_name: Value, delete_old_mob: Value) {
	let M: Value = null, C: Value = null, D: Value = null, H: Value = null;
	delete_old_mob ??= 0;
	if (rt.istype(this, T("/mob/dead/new_player"))) {
		to_chat(f.usr, "<span class='danger'>Cannot convert players who have not entered yet.</span>");
		return f.dot;
	}
	if (!new_type) {
		new_type = (yield* g.op(f, "Prompt", [3], [null, null, "Mob type", "Mob type path:", null]));
	}
	if (istext(new_type)) {
		new_type = text2path(new_type);
	}
	if (!ispath(new_type)) {
		to_chat(f.usr, `Invalid type path (new_type = ${new_type}) in change_mob_type(). Contact a coder.`);
		return f.dot;
	}
	if (ispath(new_type, T("/mob/dead/new_player"))) {
		to_chat(f.usr, "<span class='danger'>Cannot convert into a new_player mob type.</span>");
		return f.dot;
	}
	if (isturf(location)) {
		M = (yield* new_(new_type, location));
	} else {
		M = (yield* new_(new_type, this.loc));
	}
	if (!M || !ismob(M)) {
		to_chat(f.usr, `Type path is not a mob (new_type = ${new_type}) in change_mob_type(). Contact a coder.`);
		yield* qdel(M);
		return f.dot;
	}
	if (istext(new_name)) {
		M.name = new_name;
		M.real_name = new_name;
	} else {
		M.name = this.name;
		M.real_name = this.real_name;
	}
	if (this.has_dna() && M.has_dna()) {
		C = this;
		D = M;
		yield* C.dna.transfer_identity(D);
		yield* D.updateappearance({ mutcolor_update: 1, mutations_overlay_update: 1 });
	} else if (rt.istype(M, T("/mob/living/carbon/human"))) {
		H = M;
		yield* this.client.prefs.copy_to(H);
		yield* H.dna.update_dna_identity();
	}
	if (this.mind && rt.istype(M, T("/mob/living"))) {
		yield* this.mind.transfer_to(M, 1);
	} else {
		M.key = this.key;
	}
	if (delete_old_mob) {
		yield* addtimer((yield* new_(T("/datum/callback"), "some_magic_bullshit", P("/proc/qdel"), this)), 1, 8);
	}
	return M;
}, true);
