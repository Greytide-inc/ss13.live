// Based on /tg/station's code/modules/mob/living/silicon/pai/personality.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(359, "/datum/paiCandidate", "/datum", {
	name: null,
	key: null,
	description: null,
	role: null,
	comments: null,
	ready: 0,
});

// personality.dm:11
rt.def("/datum/paiCandidate/proc/savefile_path", function savefile_path(f: Frame, user: Value) {
	return `data/player_saves/${copytext(user.ckey, 1, 2)}/${user.ckey}/pai.sav`;
});

// personality.dm:14
rt.def("/datum/paiCandidate/proc/savefile_save", function savefile_save(f: Frame, user: Value) {
	let F: Value = null;
	if (IsGuestKey(user.key)) {
		return 0;
	}
	rt.op(f, "OutputReference", [rt.R.index], [(F = new_(T("/savefile"), this.savefile_path(user))), "name", this.name], false);
	rt.op(f, "OutputReference", [rt.R.index], [F, "description", this.description], false);
	rt.op(f, "OutputReference", [rt.R.index], [F, "role", this.role], false);
	rt.op(f, "OutputReference", [rt.R.index], [F, "comments", this.comments], false);
	rt.op(f, "OutputReference", [rt.R.index], [F, "version", 1], false);
	return 1;
});

// personality.dm:35
rt.def("/datum/paiCandidate/proc/savefile_load", function* savefile_load(f: Frame, user: Value, silent: Value) {
	let path: Value = null, F: Value = null;
	silent ??= 1;
	if (IsGuestKey(user.key)) {
		return 0;
	}
	if (!fexists((path = this.savefile_path(user)))) {
		return 0;
	}
	if (!(F = (yield* new_(T("/savefile"), path)))) {
		return f.dot;
	}
	let version: Value = rt.input(f, rt.R.index, null, [F, "version"]);
	if (version === null || version != 1) {
		fdel(path);
		if (!silent) {
			yield* alert(user, "Your savefile was incompatible with this version and was deleted.");
		}
		return 0;
	}
	this.name = rt.input(f, rt.R.index, null, [F, "name"]);
	this.description = rt.input(f, rt.R.index, null, [F, "description"]);
	this.role = rt.input(f, rt.R.index, null, [F, "role"]);
	this.comments = rt.input(f, rt.R.index, null, [F, "comments"]);
	return 1;
}, true);
