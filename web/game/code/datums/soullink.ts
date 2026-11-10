// Based on /tg/station's code/datums/soullink.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { g } = rt;


// soullink.dm:8
rt.def("/mob/living/proc/Destroy", function* Destroy(f: Frame) {
	let s: Value = null, S: Value = null;
	for (s of each(this.ownedSoullinks)) {
		yield* (S = s).ownerDies(0);
		yield* qdel(s);
	}
	this.ownedSoullinks = null;
	s = null;
	for (s of each(this.sharedSoullinks)) {
		yield* (S = s).sharerDies(0);
		S.removeSoulsharer(this);
	}
	this.sharedSoullinks = null;
	return (yield* parent_proc());
}, true);

rt.type(862, "/datum/soullink", "/datum", {
	soulowner: null,
	soulsharer: null,
	id: null,
});

// Empty in tg.
rt.def("/datum/soullink/proc/ownerDies", undefined, false, { args: ["gibbed", "owner"] });

// Empty in tg.
rt.def("/datum/soullink/proc/sharerDies", undefined, false, { args: ["gibbed", "owner"] });

// soullink.dm:34
rt.def("/datum/soullink/proc/Destroy", function* Destroy(f: Frame) {
	if (this.soulowner) {
		if (this.soulowner.ownedSoullinks) {
			this.soulowner.ownedSoullinks -= this;
			if (!rt.len(f, this.soulowner.ownedSoullinks)) {
				this.soulowner.ownedSoullinks = null;
			}
		}
		this.soulowner = null;
	}
	if (this.soulsharer) {
		if (this.soulsharer.sharedSoullinks) {
			this.soulsharer.sharedSoullinks -= this;
			if (!rt.len(f, this.soulsharer.sharedSoullinks)) {
				this.soulsharer.sharedSoullinks = null;
			}
		}
		this.soulsharer = null;
	}
	return (yield* parent_proc());
}, true);

// soullink.dm:42
rt.def("/datum/soullink/proc/removeSoulsharer", function removeSoulsharer(f: Frame, sharer: Value) {
	if (this.soulsharer != sharer) return f.dot;
	this.soulsharer = null;
	if (!sharer.sharedSoullinks) return f.dot;
	sharer.sharedSoullinks -= this;
	if (rt.len(f, sharer.sharedSoullinks)) return f.dot;
	sharer.sharedSoullinks = null;
	return f.dot;
});

// soullink.dm:50
rt.def("/datum/soullink/proc/parseArgs", function parseArgs(f: Frame, owner: Value, sharer: Value) {
	if (!owner || !sharer) {
		return 0;
	}
	this.soulowner = owner;
	this.soulsharer = sharer;
	if (!owner.ownedSoullinks) {
		owner.ownedSoullinks = list();
	}
	owner.ownedSoullinks += this;
	if (!sharer.sharedSoullinks) {
		sharer.sharedSoullinks = list();
	}
	sharer.sharedSoullinks += this;
	return 1;
});

// soullink.dm:68
rt.def("/proc/soullink", function* soullink(f: Frame) {
	let S: Value = null;
	if (!(yield* g.callName(f, (S = (yield* new_(f.args[0]))), "parseArgs", [(yield* f.argsList.Copy(2, 0))], rt.Args.List))) return f.dot;
	return S;
}, true, { args: ["typepath"] });

rt.type(863, "/datum/soullink/multisharer", "/datum/soullink", {
	soulsharers: null,
});

// soullink.dm:82
rt.def("/datum/soullink/multisharer/proc/parseArgs", function parseArgs(f: Frame, owner: Value, sharers: Value) {
	let l: Value = null, L: Value = null;
	if (!owner || !rt.length(sharers)) {
		return 0;
	}
	this.soulowner = owner;
	this.soulsharers = sharers;
	if (!owner.ownedSoullinks) {
		owner.ownedSoullinks = list();
	}
	owner.ownedSoullinks += this;
	for (l of each(sharers)) {
		if (!(L = l).sharedSoullinks) {
			L.sharedSoullinks = list();
		}
		L.sharedSoullinks += this;
	}
	return 1;
});

// soullink.dm:93
rt.def("/datum/soullink/multisharer/proc/removeSoulsharer", function removeSoulsharer(f: Frame, sharer: Value) {
	if (!this.soulsharers) return f.dot;
	this.soulsharers -= sharer;
	if (rt.len(f, this.soulsharers)) return f.dot;
	this.soulsharers = null;
	return f.dot;
});

rt.type(865, "/datum/soullink/sharedfate", "/datum/soullink", {});

// soullink.dm:105
rt.def("/datum/soullink/sharedfate/proc/ownerDies", function* ownerDies(f: Frame, gibbed: Value, owner: Value) {
	if (!this.soulsharer) return f.dot;
	yield* this.soulsharer.death(gibbed);
	return f.dot;
}, true);

// soullink.dm:109
rt.def("/datum/soullink/sharedfate/proc/sharerDies", function* sharerDies(f: Frame, gibbed: Value, sharer: Value) {
	if (!this.soulowner) return f.dot;
	yield* this.soulowner.death(gibbed);
	return f.dot;
}, true);

rt.type(866, "/datum/soullink/oneway", "/datum/soullink", {});

// soullink.dm:119
rt.def("/datum/soullink/oneway/proc/ownerDies", function* ownerDies(f: Frame, gibbed: Value, owner: Value) {
	if (!this.soulsharer) return f.dot;
	yield* this.soulsharer.dust(0);
	return f.dot;
}, true);

rt.type(867, "/datum/soullink/sharedbody", "/datum/soullink", {});

// soullink.dm:130
rt.def("/datum/soullink/sharedbody/proc/ownerDies", function* ownerDies(f: Frame, gibbed: Value, owner: Value) {
	if (!(this.soulowner && this.soulsharer)) return f.dot;
	if (this.soulsharer.mind) {
		yield* this.soulsharer.mind.transfer_to(this.soulowner);
	}
	yield* this.soulsharer.death(gibbed);
	return f.dot;
}, true);

// soullink.dm:136
rt.def("/datum/soullink/sharedbody/proc/sharerDies", function* sharerDies(f: Frame, gibbed: Value, sharer: Value) {
	if (!(this.soulowner && this.soulsharer && this.soulsharer.mind)) return f.dot;
	yield* this.soulsharer.mind.transfer_to(this.soulowner);
	return f.dot;
}, true);

rt.type(864, "/datum/soullink/multisharer/replacementpool", "/datum/soullink/multisharer", {});

// soullink.dm:149
rt.def("/datum/soullink/multisharer/replacementpool/proc/ownerDies", function* ownerDies(f: Frame, gibbed: Value, owner: Value) {
	let l: Value = null, L: Value = null;
	if (!(rt.length(this.soulsharers) && !gibbed)) return f.dot;
	let souls: Value = shuffle((yield* this.soulsharers.Copy()));
	for (l of each(souls)) {
		if ((L = l).stat != 2 && L.mind) {
			yield* L.mind.transfer_to(this.soulowner);
			yield* this.soulowner.revive(1, 1);
			yield* L.death(0);
		}
	}
	return f.dot;
}, true);

// soullink.dm:160
rt.def("/datum/soullink/multisharer/replacementpool/proc/sharerDies", function sharerDies(f: Frame, gibbed: Value, sharer: Value) {
	this.removeSoulsharer(sharer);
	return f.dot;
});
