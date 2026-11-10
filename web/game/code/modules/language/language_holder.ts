// Based on /tg/station's code/modules/language/language_holder.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(2788, "/datum/language_holder", "/datum", {
	languages: null,
	shadow_languages: null,
	only_speaks_language: null,
	selected_default_language: null,
	language_menu: null,
	omnitongue: 0,
	owner: null,
});

// language_holder.dm:2
rt.def("/datum/language_holder/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.languages = list(T("/datum/language/common"));

	this.shadow_languages = list();
	return f.dot;
});

// language_holder.dm:14
rt.def("/datum/language_holder/proc/New", function New(f: Frame, owner: Value) {
	this.owner = owner;
	this.languages = typecacheof(this.languages);
	this.shadow_languages = typecacheof(this.shadow_languages);
	return f.dot;
});

// language_holder.dm:19
rt.def("/datum/language_holder/proc/Destroy", function* Destroy(f: Frame) {
	this.owner = null;
	yield* qdel(this.language_menu);
	this.language_menu = null;
	this.languages.Cut();
	this.shadow_languages.Cut();
	return (yield* parent_proc());
}, true);

// language_holder.dm:25
rt.def("/datum/language_holder/proc/copy", function copy(f: Frame, newowner: Value) {
	let copy: Value = null;
	(copy = new_(T("/datum/language_holder"), newowner)).languages = this.languages.Copy();
	copy.only_speaks_language = this.only_speaks_language;
	copy.selected_default_language = this.selected_default_language;
	copy.omnitongue = this.omnitongue;
	return copy;
});

// language_holder.dm:38
rt.def("/datum/language_holder/proc/grant_all_languages", function grant_all_languages(f: Frame, omnitongue: Value) {
	let la: Value = null;
	omnitongue ??= 0;
	for (la of each(GLOB.all_languages)) {
		this.grant_language(la);
	}
	if (!omnitongue) return f.dot;
	this.omnitongue = 1;
	return f.dot;
});

// language_holder.dm:45
rt.def("/datum/language_holder/proc/get_random_understood_language", function get_random_understood_language(f: Frame) {
	let dt: Value = null;
	let possible: Value = list();
	for (dt of each(this.languages)) {
		possible += dt;
	}
	f.dot = safepick(possible);
	return f.dot;
});

// language_holder.dm:51
rt.def("/datum/language_holder/proc/remove_language", function remove_language(f: Frame, dt: Value) {
	this.languages -= dt;
	return f.dot;
});

// language_holder.dm:54
rt.def("/datum/language_holder/proc/remove_all_languages", function remove_all_languages(f: Frame) {
	this.languages.Cut();
	return f.dot;
});

// language_holder.dm:57
rt.def("/datum/language_holder/proc/has_language", function* has_language(f: Frame, dt: Value) {
	let L: Value = null;
	if (is_type_in_typecache(dt, this.languages)) {
		return "language_known";
	}
	let AM: Value = this.get_atom();
	if ((L = (yield* AM.get_language_holder({ shadow: 0 }))) != this) {
		if (is_type_in_typecache(dt, L.shadow_languages)) {
			return "language_shadowed";
		}
	}
	return 0;
}, true);

// language_holder.dm:69
rt.def("/datum/language_holder/proc/copy_known_languages_from", function* copy_known_languages_from(f: Frame, thing: Value, replace: Value) {
	let other: Value = null, AM: Value = null, M: Value = null, l: Value = null;
	replace ??= 0;
	if (rt.istype(thing, T("/datum/language_holder"))) {
		other = thing;
	} else if (rt.istype(thing, T("/atom/movable"))) {
		other = (yield* (AM = thing).get_language_holder());
	} else if (rt.istype(thing, T("/datum/mind"))) {
		other = (yield* (M = thing).get_language_holder());
	}
	if (replace) {
		yield* this.remove_all_languages();
	}
	for (l of each(other.languages)) {
		yield* this.grant_language(l);
	}
	return f.dot;
}, true);

// language_holder.dm:86
rt.def("/datum/language_holder/proc/open_language_menu", function* open_language_menu(f: Frame, user: Value) {
	if (!this.language_menu) {
		this.language_menu = (yield* new_(T("/datum/language_menu"), this));
	}
	yield* this.language_menu.ui_interact(user);
	return f.dot;
}, true);

// language_holder.dm:91
rt.def("/datum/language_holder/proc/get_atom", function get_atom(f: Frame) {
	let M: Value = null;
	if (rt.istype(this.owner, T("/atom/movable"))) {
		f.dot = this.owner;
	} else {
		if (!rt.istype(this.owner, T("/datum/mind"))) return f.dot;
		if (!(M = this.owner).current) return f.dot;
		f.dot = M.current;
	}
	return f.dot;
});

rt.type(2789, "/datum/language_holder/alien", "/datum/language_holder", {
	languages: null,
});

// language_holder.dm:99
rt.def("/datum/language_holder/alien/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.languages = list(T("/datum/language/xenocommon"));
	return f.dot;
});

rt.type(2790, "/datum/language_holder/monkey", "/datum/language_holder", {
	languages: null,
});

// language_holder.dm:102
rt.def("/datum/language_holder/monkey/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.languages = list(T("/datum/language/monkey"));
	return f.dot;
});

rt.type(2791, "/datum/language_holder/swarmer", "/datum/language_holder", {
	languages: null,
});

// language_holder.dm:105
rt.def("/datum/language_holder/swarmer/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.languages = list(T("/datum/language/swarmer"));
	return f.dot;
});

rt.type(2792, "/datum/language_holder/clockmob", "/datum/language_holder", {
	languages: null,
	only_speaks_language: rt.typePath("/datum/language/ratvar"),
});

// language_holder.dm:108
rt.def("/datum/language_holder/clockmob/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.languages = list(T("/datum/language/common"), T("/datum/language/ratvar"));
	return f.dot;
});

rt.type(2793, "/datum/language_holder/construct", "/datum/language_holder", {
	languages: null,
});

// language_holder.dm:112
rt.def("/datum/language_holder/construct/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.languages = list(T("/datum/language/common"), T("/datum/language/narsie"));
	return f.dot;
});

rt.type(2794, "/datum/language_holder/drone", "/datum/language_holder", {
	languages: null,
	only_speaks_language: rt.typePath("/datum/language/drone"),
});

// language_holder.dm:115
rt.def("/datum/language_holder/drone/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.languages = list(T("/datum/language/common"), T("/datum/language/drone"), T("/datum/language/machine"));
	return f.dot;
});

rt.type(2796, "/datum/language_holder/slime", "/datum/language_holder", {
	languages: null,
});

// language_holder.dm:122
rt.def("/datum/language_holder/slime/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.languages = list(T("/datum/language/common"), T("/datum/language/slime"));
	return f.dot;
});

rt.type(2797, "/datum/language_holder/lightbringer", "/datum/language_holder", {
	languages: null,
});

// language_holder.dm:126
rt.def("/datum/language_holder/lightbringer/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.languages = list(T("/datum/language/slime"));
	return f.dot;
});

rt.type(2798, "/datum/language_holder/synthetic", "/datum/language_holder", {
	languages: null,
	shadow_languages: null,
});

// language_holder.dm:129
rt.def("/datum/language_holder/synthetic/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.languages = list(T("/datum/language/common"));

	this.shadow_languages = list(T("/datum/language/common"), T("/datum/language/machine"), T("/datum/language/draconic"));
	return f.dot;
});

rt.type(2799, "/datum/language_holder/universal", "/datum/language_holder", {});

// language_holder.dm:133
rt.def("/datum/language_holder/universal/proc/New", function New(f: Frame) {
	parent_proc();
	this.grant_all_languages({ omnitongue: 1 });
	return f.dot;
});
