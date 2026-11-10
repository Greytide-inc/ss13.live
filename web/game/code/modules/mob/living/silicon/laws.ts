// Based on /tg/station's code/modules/mob/living/silicon/laws.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


// laws.dm:5
rt.def("/mob/living/silicon/proc/laws_sanity_check", function* laws_sanity_check(f: Frame) {
	if (this.laws) return f.dot;
	yield* this.make_laws();
	return f.dot;
}, true);

// laws.dm:9
rt.def("/mob/living/silicon/proc/post_lawchange", function* post_lawchange(f: Frame, announce: Value) {
	announce ??= 1;
	yield* this.throw_alert("newlaw", T("/obj/screen/alert/newlaw"));
	if (!(announce && this.last_lawchange_announce != rt.worldTime(f))) return f.dot;
	to_chat(this, "<b>Your laws have been changed.</b>");
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/mob/living/silicon/proc/show_laws"))), 0);
	this.last_lawchange_announce = rt.worldTime(f);
	return f.dot;
}, true);

// laws.dm:16
rt.def("/mob/living/silicon/proc/set_law_sixsixsix", function* set_law_sixsixsix(f: Frame, law: Value, announce: Value) {
	announce ??= 1;
	yield* this.laws_sanity_check();
	yield* this.laws.set_law_sixsixsix(law);
	yield* this.post_lawchange(announce);
	return f.dot;
}, true);

// laws.dm:21
rt.def("/mob/living/silicon/proc/set_zeroth_law", function* set_zeroth_law(f: Frame, law: Value, law_borg: Value, announce: Value) {
	announce ??= 1;
	yield* this.laws_sanity_check();
	yield* this.laws.set_zeroth_law(law, law_borg);
	yield* this.post_lawchange(announce);
	return f.dot;
}, true);

// laws.dm:26
rt.def("/mob/living/silicon/proc/add_inherent_law", function* add_inherent_law(f: Frame, law: Value, announce: Value) {
	announce ??= 1;
	yield* this.laws_sanity_check();
	yield* this.laws.add_inherent_law(law);
	yield* this.post_lawchange(announce);
	return f.dot;
}, true);

// laws.dm:31
rt.def("/mob/living/silicon/proc/clear_inherent_laws", function* clear_inherent_laws(f: Frame, announce: Value) {
	announce ??= 1;
	yield* this.laws_sanity_check();
	yield* this.laws.clear_inherent_laws();
	yield* this.post_lawchange(announce);
	return f.dot;
}, true);

// laws.dm:36
rt.def("/mob/living/silicon/proc/add_supplied_law", function* add_supplied_law(f: Frame, number: Value, law: Value, announce: Value) {
	announce ??= 1;
	yield* this.laws_sanity_check();
	yield* this.laws.add_supplied_law(number, law);
	yield* this.post_lawchange(announce);
	return f.dot;
}, true);

// laws.dm:41
rt.def("/mob/living/silicon/proc/clear_supplied_laws", function* clear_supplied_laws(f: Frame, announce: Value) {
	announce ??= 1;
	yield* this.laws_sanity_check();
	yield* this.laws.clear_supplied_laws();
	yield* this.post_lawchange(announce);
	return f.dot;
}, true);

// laws.dm:46
rt.def("/mob/living/silicon/proc/add_ion_law", function* add_ion_law(f: Frame, law: Value, announce: Value) {
	announce ??= 1;
	yield* this.laws_sanity_check();
	yield* this.laws.add_ion_law(law);
	yield* this.post_lawchange(announce);
	return f.dot;
}, true);

// laws.dm:51
rt.def("/mob/living/silicon/proc/replace_random_law", function* replace_random_law(f: Frame, law: Value, groups: Value, announce: Value) {
	announce ??= 1;
	yield* this.laws_sanity_check();
	f.dot = (yield* this.laws.replace_random_law(law, groups));
	yield* this.post_lawchange(announce);
	return f.dot;
}, true);

// laws.dm:56
rt.def("/mob/living/silicon/proc/shuffle_laws", function* shuffle_laws(f: Frame, groups: Value, announce: Value) {
	announce ??= 1;
	yield* this.laws_sanity_check();
	yield* this.laws.shuffle_laws(groups);
	yield* this.post_lawchange(announce);
	return f.dot;
}, true);

// laws.dm:61
rt.def("/mob/living/silicon/proc/remove_law", function* remove_law(f: Frame, number: Value, announce: Value) {
	announce ??= 1;
	yield* this.laws_sanity_check();
	f.dot = (yield* this.laws.remove_law(number));
	yield* this.post_lawchange(announce);
	return f.dot;
}, true);

// laws.dm:66
rt.def("/mob/living/silicon/proc/clear_ion_laws", function* clear_ion_laws(f: Frame, announce: Value) {
	announce ??= 1;
	yield* this.laws_sanity_check();
	yield* this.laws.clear_ion_laws();
	yield* this.post_lawchange(announce);
	return f.dot;
}, true);

// laws.dm:71
rt.def("/mob/living/silicon/proc/make_laws", function* make_laws(f: Frame) {
	this.laws = (yield* new_(T("/datum/ai_laws")));
	yield* this.laws.set_laws_config();
	this.laws.associate(this);
	return f.dot;
}, true);

// laws.dm:76
rt.def("/mob/living/silicon/proc/clear_zeroth_law", function* clear_zeroth_law(f: Frame, force: Value, announce: Value) {
	announce ??= 1;
	yield* this.laws_sanity_check();
	yield* this.laws.clear_zeroth_law(force);
	yield* this.post_lawchange(announce);
	return f.dot;
}, true);

// laws.dm:81
rt.def("/mob/living/silicon/proc/clear_law_sixsixsix", function* clear_law_sixsixsix(f: Frame, force: Value, announce: Value) {
	announce ??= 1;
	yield* this.laws_sanity_check();
	yield* this.laws.clear_law_sixsixsix(force);
	yield* this.post_lawchange(announce);
	return f.dot;
}, true);
