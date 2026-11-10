// Based on /tg/station's code/datums/antagonists/antag_datum.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(895, "/datum/antagonist", "/datum", {
	name: "Antagonist",
	owner: null,
	silent: 0,
	can_coexist_with_others: 1,
	typecache_datum_blacklist: null,
	delete_on_death: 1,
});

// antag_datum.dm:9
rt.def("/datum/antagonist/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.typecache_datum_blacklist = list();
	return f.dot;
});

// antag_datum.dm:13
rt.def("/datum/antagonist/proc/New", function New(f: Frame, new_owner: Value) {
	this.typecache_datum_blacklist = typecacheof(this.typecache_datum_blacklist);
	if (!new_owner) return f.dot;
	this.owner = new_owner;
	return f.dot;
});

// antag_datum.dm:19
rt.def("/datum/antagonist/proc/Destroy", function* Destroy(f: Frame) {
	if (this.owner) {
		if (this.owner.antag_datums) {
			this.owner.antag_datums -= this;
			if (!rt.len(f, this.owner.antag_datums)) {
				this.owner.antag_datums = null;
			}
		}
	}
	this.owner = null;
	return (yield* parent_proc());
}, true);

// antag_datum.dm:25
rt.def("/datum/antagonist/proc/can_be_owned", function can_be_owned(f: Frame, new_owner: Value) {
	let i: Value = null, A: Value = null;
	f.dot = 1;
	if (this.owner.has_antag_datum(this.type)) {
		return 0;
	}
	for (i of each(this.owner.antag_datums)) {
		A = i;
		if (is_type_in_typecache(this, A.typecache_datum_blacklist)) {
			return 0;
		}
	}
	return f.dot;
});

// antag_datum.dm:33
rt.def("/datum/antagonist/proc/on_body_transfer", function* on_body_transfer(f: Frame, old_body: Value, new_body: Value) {
	yield* this.remove_innate_effects(old_body);
	yield* this.apply_innate_effects(new_body);
	return f.dot;
}, true);

// antag_datum.dm:46
rt.def("/datum/antagonist/proc/on_gain", function* on_gain(f: Frame) {
	if (!(this.owner && this.owner.current)) return f.dot;
	if (!this.silent) {
		this.greet();
	}
	yield* this.apply_innate_effects();
	return f.dot;
}, true);

// antag_datum.dm:52
rt.def("/datum/antagonist/proc/on_removal", function* on_removal(f: Frame) {
	yield* this.remove_innate_effects();
	if (this.owner) {
		if (this.owner.antag_datums) {
			this.owner.antag_datums -= this;
			if (!rt.len(f, this.owner.antag_datums)) {
				this.owner.antag_datums = null;
			}
		}
		if (!this.silent && this.owner.current) {
			this.farewell();
		}
	}
	yield* qdel(this);
	return f.dot;
}, true);
