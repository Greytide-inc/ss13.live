// Based on /tg/station's code/controllers/subsystem/atoms.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


rt.type(15, "/datum/controller/subsystem/atoms", "/datum/controller/subsystem", {
	initialized: 0,
	old_initialized: null,
	late_loaders: null,
	created_atoms: null,
	BadInitializeCalls: null,
	name: "Atoms",
	init_order: 11,
	flags: 2,
});

// atoms.dm:6
rt.def("/datum/controller/subsystem/atoms/proc/New", function* New(f: Frame) {
	if (GLOB.SSatoms != this) {
		if (rt.istype(GLOB.SSatoms, T("/datum/controller/subsystem/atoms"))) {
			yield* this.Recover();
			yield* qdel(GLOB.SSatoms);
		}
		GLOB.SSatoms = this;
	}
	this.PreInit();
	return f.dot;
}, true);

// atoms.dm:17
rt.def("/datum/controller/subsystem/atoms/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.BadInitializeCalls = list();
	return f.dot;
});

// atoms.dm:20
rt.def("/datum/controller/subsystem/atoms/proc/Initialize", function* Initialize(f: Frame, timeofday: Value) {
	GLOB.fire_overlay.appearance_flags = 2;
	yield* this.setupGenetics();
	this.initialized = INITIALIZATION_INNEW_MAPLOAD;
	yield* this.InitializeAtoms();
	return (yield* parent_proc());
}, true);

// atoms.dm:27
rt.def("/datum/controller/subsystem/atoms/proc/InitializeAtoms", function* InitializeAtoms(f: Frame, atoms: Value) {
	let count: Value = null, I: Value = null, A: Value = null, A_2: Value = null;
	if (this.initialized == INITIALIZATION_INSSATOMS) {
		return f.dot;
	}
	this.initialized = 1;
	if (!this.late_loaders) {
		this.late_loaders = list();
	}
	let mapload_arg: Value = list(1);
	if (atoms) {
		this.created_atoms = list();
		count = rt.len(f, atoms);
		for (I of each(atoms)) {
			if (!(A = I).initialized) {
				if (yield* this.InitAtom(I, mapload_arg)) {
					atoms -= I;
				}
				if (rt.tickUsage(f) > GLOB.current_ticklimit) {
					yield* stoplag();
				}
			}
		}
	} else {
		count = 0;
		for (A_2 of each(rt.world(), T("/atom"))) {
			if (!A_2.initialized) {
				yield* this.InitAtom(A_2, mapload_arg);
				count++;
				if (rt.tickUsage(f) > GLOB.current_ticklimit) {
					yield* stoplag();
				}
			}
		}
	}
	log_world(`Initialized ${count} atoms`);
	this.initialized = INITIALIZATION_INNEW_REGULAR;
	if (rt.len(f, this.late_loaders)) {
		I = null;
		for (I of each(this.late_loaders)) {
			yield* (A = I).LateInitialize();
		}
		this.late_loaders.Cut();
	}
	if (!atoms) return f.dot;
	f.dot = this.created_atoms + atoms;
	this.created_atoms = null;
	return f.dot;
}, true);

// atoms.dm:70
rt.def("/datum/controller/subsystem/atoms/proc/InitAtom", function* InitAtom(f: Frame, A: Value, _arguments: Value) {
	let the_type: Value = A.type;
	if (A.gc_destroyed) {
		(rt.modAt(this.BadInitializeCalls, the_type, 1, rt.bitOr));
		return 1;
	}
	let start_tick: Value = rt.worldTime(f);
	let result: Value = (yield* g.callName(f, A, "Initialize", [_arguments], rt.Args.List));
	if (start_tick != rt.worldTime(f)) {
		(rt.modAt(this.BadInitializeCalls, the_type, 4, rt.bitOr));
	}
	let qdeleted: Value = 0;
	if (result != 0) {
		if (result === 1) {
			if (rt.index(_arguments, 1)) {
				this.late_loaders += A;
			} else {
				yield* A.LateInitialize();
			}
		} else if (result === 2) {
			yield* qdel(A);
			qdeleted = 1;
		} else {
			(rt.modAt(this.BadInitializeCalls, the_type, 8, rt.bitOr));
		}
	}
	if (!A) {
		qdeleted = 1;
	} else if (!A.initialized) {
		(rt.modAt(this.BadInitializeCalls, the_type, 2, rt.bitOr));
	}
	return (qdeleted || A.gc_destroyed);
}, true);

// atoms.dm:104
rt.def("/datum/controller/subsystem/atoms/proc/map_loader_begin", function map_loader_begin(f: Frame) {
	this.old_initialized = this.initialized;
	this.initialized = INITIALIZATION_INSSATOMS;
	return f.dot;
});

// atoms.dm:108
rt.def("/datum/controller/subsystem/atoms/proc/map_loader_stop", function map_loader_stop(f: Frame) {
	this.initialized = this.old_initialized;
	return f.dot;
});

// atoms.dm:112
rt.def("/datum/controller/subsystem/atoms/proc/Recover", function* Recover(f: Frame) {
	this.initialized = GLOB.SSatoms.initialized;
	if (this.initialized == INITIALIZATION_INNEW_MAPLOAD) {
		yield* this.InitializeAtoms();
	}
	this.old_initialized = GLOB.SSatoms.old_initialized;
	this.BadInitializeCalls = GLOB.SSatoms.BadInitializeCalls;
	return f.dot;
}, true);

// atoms.dm:118
rt.def("/datum/controller/subsystem/atoms/proc/setupGenetics", function* setupGenetics(f: Frame) {
	let A: Value = null, B: Value = null;
	let avnums: Value = (yield* new_(T("/list"), DNA_STRUC_ENZYMES_BLOCKS));
	let i: Value = 1;
	while (i <= DNA_STRUC_ENZYMES_BLOCKS) {
		rt.setAt(avnums, i, i);
		if (rt.tickUsage(f) > GLOB.current_ticklimit) {
			yield* stoplag();
		}
		i++;
	}
	for (A of each(typesof(T("/datum/mutation/human")) - T("/datum/mutation/human"))) {
		if ((B = (yield* new_(A))).dna_block == NON_SCANNABLE) {
			continue;
		}
		B.dna_block = pick_n_take(avnums);
		if (B.quality == POSITIVE) {
			(rt.modGl("good_mutations", B, rt.bitOr));
		} else if (B.quality == NEGATIVE) {
			(rt.modGl("bad_mutations", B, rt.bitOr));
		} else if (B.quality == MINOR_NEGATIVE) {
			(rt.modGl("not_good_mutations", B, rt.bitOr));
		}
		if (rt.tickUsage(f) > GLOB.current_ticklimit) {
			yield* stoplag();
		}
	}
	return f.dot;
}, true);

// atoms.dm:137
rt.def("/datum/controller/subsystem/atoms/proc/InitLog", function InitLog(f: Frame) {
	let path: Value = null, fails: Value = null;
	f.dot = "";
	for (path of each(this.BadInitializeCalls)) {
		f.dot += `Path : ${path} \n`;
		if (rt.bitAnd((fails = rt.index(this.BadInitializeCalls, path)), 2)) {
			f.dot += "- Didn't call atom/Initialize()\n";
		}
		if (rt.bitAnd(fails, 8)) {
			f.dot += "- Didn't return an Initialize hint\n";
		}
		if (rt.bitAnd(fails, 1)) {
			f.dot += "- Qdel'd in New()\n";
		}
		if (rt.bitAnd(fails, 4)) {
			f.dot += "- Slept during Initialize()\n";
		}
	}
	return f.dot;
});

// atoms.dm:151
rt.def("/datum/controller/subsystem/atoms/proc/Shutdown", function Shutdown(f: Frame) {
	let initlog: Value = null;
	if (!(initlog = this.InitLog())) return f.dot;
	text2file(initlog, `${GLOB.log_directory}/initialize.log`);
	return f.dot;
});
