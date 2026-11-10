// Based on /tg/station's code/modules/research/research.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(4181, "/datum/research", "/datum", {
	possible_tech: null,
	known_tech: null,
	possible_designs: null,
	known_designs: null,
});

// research.dm:50
rt.def("/datum/research/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.possible_tech = list();

	this.known_tech = list();

	this.possible_designs = list();

	this.known_designs = list();
	return f.dot;
});

// research.dm:56
rt.def("/datum/research/proc/New", function* New(f: Frame) {
	let _T: Value = null, D: Value = null;
	for (_T of each(typesof(T("/datum/tech")) - T("/datum/tech"))) {
		this.possible_tech += (yield* new_(_T, this));
	}
	for (D of each(typesof(T("/datum/design")) - T("/datum/design"))) {
		this.possible_designs += (yield* new_(D, this));
	}
	yield* this.RefreshResearch();
	return f.dot;
}, true);

// research.dm:65
rt.def("/datum/research/proc/TechHasReqs", function TechHasReqs(f: Frame, _T: Value) {
	let req: Value = null, known: Value = null;
	if (rt.len(f, _T.req_tech) == 0) {
		return 1;
	}
	for (req of each(_T.req_tech)) {
		if (!(known = rt.index(this.known_tech, req)) || known.level < rt.index(_T.req_tech, req)) {
			return 0;
		}
	}
	return 1;
});

// research.dm:76
rt.def("/datum/research/proc/DesignHasReqs", function DesignHasReqs(f: Frame, D: Value) {
	let req: Value = null, known: Value = null;
	if (rt.len(f, D.req_tech) == 0) {
		return 1;
	}
	for (req of each(D.req_tech)) {
		if (!(known = rt.index(this.known_tech, req)) || known.level < rt.index(D.req_tech, req)) {
			return 0;
		}
	}
	return 1;
});

// research.dm:87
rt.def("/datum/research/proc/AddTech2Known", function* AddTech2Known(f: Frame, _T: Value) {
	let known: Value = null;
	if (!_T) {
		return f.dot;
	}
	if (rt.index(this.known_tech, _T.id)) {
		known = rt.index(this.known_tech, _T.id);
		if (_T.level > known.level) {
			known.level = _T.level;
		}
		return f.dot;
	}
	rt.setAt(this.known_tech, _T.id, (yield* _T.copy()));
	return f.dot;
}, true);

// research.dm:97
rt.def("/datum/research/proc/AddDesign2Known", function AddDesign2Known(f: Frame, D: Value) {
	if (rt.index(this.known_designs, D.id)) {
		return f.dot;
	}
	rt.setAt(this.known_designs, D.id, D);
	return f.dot;
});

// research.dm:104
rt.def("/datum/research/proc/RefreshResearch", function* RefreshResearch(f: Frame) {
	let PT: Value = null, PD: Value = null, v: Value = null, _T: Value = null;
	for (PT of each(this.possible_tech, T("/datum/tech"))) {
		if (this.TechHasReqs(PT)) {
			yield* this.AddTech2Known(PT);
		}
	}
	for (PD of each(this.possible_designs, T("/datum/design"))) {
		if (this.DesignHasReqs(PD)) {
			this.AddDesign2Known(PD);
		}
	}
	for (v of each(this.known_tech)) {
		(_T = rt.index(this.known_tech, v)).level = max(0, min(_T.level, 20));
	}
	return f.dot;
}, true);

// research.dm:120
rt.def("/datum/research/proc/UpdateTech", function UpdateTech(f: Frame, ID: Value, level: Value) {
	let KT: Value = null;
	if (!((KT = rt.index(this.known_tech, ID)) && KT.level <= level)) return f.dot;
	KT.level = max(KT.level + 1, level);
	return f.dot;
});

// research.dm:127
rt.def("/datum/research/proc/IsTechHigher", function IsTechHigher(f: Frame, ID: Value, level: Value) {
	let KT: Value = null;
	if (!(KT = rt.index(this.known_tech, ID))) return f.dot;
	if (KT.level <= level) {
		return 1;
	} else {
		return 0;
	}
});

// research.dm:135
rt.def("/datum/research/proc/FindDesignByID", function FindDesignByID(f: Frame, id: Value) {
	return rt.index(this.known_designs, id);
});

rt.type(4182, "/datum/research/autolathe", "/datum/research", {});

// research.dm:140
rt.def("/datum/research/autolathe/proc/New", function* New(f: Frame) {
	let _T: Value = null, path: Value = null, D: Value = null;
	for (_T of each(typesof(T("/datum/tech")) - T("/datum/tech"))) {
		this.possible_tech += (yield* new_(_T, this));
	}
	for (path of each(typesof(T("/datum/design")) - T("/datum/design"))) {
		this.possible_designs += (D = (yield* new_(path, this)));
		if (rt.bitAnd(D.build_type, AUTOLATHE) && rt.isIn(f, "initial", D.category)) {
			this.AddDesign2Known(D);
		}
	}
	return f.dot;
}, true);

rt.type(4183, "/datum/research/limbgrower", "/datum/research", {});

// research.dm:150
rt.def("/datum/research/limbgrower/proc/New", function* New(f: Frame) {
	let _T: Value = null, path: Value = null, D: Value = null;
	for (_T of each(typesof(T("/datum/tech")) - T("/datum/tech"))) {
		this.possible_tech += (yield* new_(_T, this));
	}
	for (path of each(typesof(T("/datum/design")) - T("/datum/design"))) {
		this.possible_designs += (D = (yield* new_(path, this)));
		if (rt.bitAnd(D.build_type, LIMBGROWER) && rt.isIn(f, "initial", D.category)) {
			this.AddDesign2Known(D);
		}
	}
	return f.dot;
}, true);

// research.dm:159
rt.def("/datum/research/autolathe/proc/AddDesign2Known", function AddDesign2Known(f: Frame, D: Value) {
	if (!rt.bitAnd(D.build_type, AUTOLATHE)) {
		return f.dot;
	}
	parent_proc();
	return f.dot;
}, false);

rt.type(4184, "/datum/research/biogenerator", "/datum/research", {});

// research.dm:165
rt.def("/datum/research/biogenerator/proc/New", function* New(f: Frame) {
	let _T: Value = null, path: Value = null, D: Value = null;
	for (_T of each(typesof(T("/datum/tech")) - T("/datum/tech"))) {
		this.possible_tech += (yield* new_(_T, this));
	}
	for (path of each(typesof(T("/datum/design")) - T("/datum/design"))) {
		this.possible_designs += (D = (yield* new_(path, this)));
		if (rt.bitAnd(D.build_type, BIOGENERATOR) && rt.isIn(f, "initial", D.category)) {
			this.AddDesign2Known(D);
		}
	}
	return f.dot;
}, true);

// research.dm:174
rt.def("/datum/research/biogenerator/proc/AddDesign2Known", function AddDesign2Known(f: Frame, D: Value) {
	if (!rt.bitAnd(D.build_type, BIOGENERATOR)) {
		return f.dot;
	}
	parent_proc();
	return f.dot;
}, false);

rt.type(4185, "/datum/research/smelter", "/datum/research", {});

// research.dm:180
rt.def("/datum/research/smelter/proc/New", function* New(f: Frame) {
	let _T: Value = null, path: Value = null, D: Value = null;
	for (_T of each(typesof(T("/datum/tech")) - T("/datum/tech"))) {
		this.possible_tech += (yield* new_(_T, this));
	}
	for (path of each(typesof(T("/datum/design")) - T("/datum/design"))) {
		this.possible_designs += (D = (yield* new_(path, this)));
		if (rt.bitAnd(D.build_type, SMELTER) && rt.isIn(f, "initial", D.category)) {
			this.AddDesign2Known(D);
		}
	}
	return f.dot;
}, true);

// research.dm:189
rt.def("/datum/research/smelter/proc/AddDesign2Known", function AddDesign2Known(f: Frame, D: Value) {
	if (!rt.bitAnd(D.build_type, SMELTER)) {
		return f.dot;
	}
	parent_proc();
	return f.dot;
}, false);

rt.type(4186, "/datum/tech", "/datum", {
	name: "name",
	desc: "description",
	id: "id",
	level: 1,
	rare: 1,
	req_tech: null,
});

// research.dm:205
rt.def("/datum/tech/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_tech = list();
	return f.dot;
});

// research.dm:304
rt.def("/datum/tech/proc/getCost", function getCost(f: Frame, current_level: Value) {
	if (!current_level) {
		current_level = rt.initial(f, this, "level");
	}
	if (current_level >= this.level) {
		return 0;
	}
	let cost: Value = 0;
	let i: Value = current_level + 1;
	while (i <= this.level) {
		if (i != rt.initial(f, this, "level")) {
			cost += i * this.rare;
		}
		i++;
	}
	return cost;
});

// research.dm:319
rt.def("/datum/tech/proc/copy", function* copy(f: Frame) {
	let _T: Value = null;
	(_T = (yield* new_(this.type))).level = this.level;
	return _T;
}, true);

rt.type(6684, "/obj/item/weapon/disk/tech_disk", "/obj/item/weapon/disk", {
	tech_stored: null,
	max_tech_stored: 1,
	name: "technology disk",
	desc: "A disk for storing technology data for further research.",
	icon_state: "datadisk0",
	materials: null,
});

// research.dm:328
rt.def("/obj/item/weapon/disk/tech_disk/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.tech_stored = list();
	this.materials = rt.alist(f, ["$metal", 300, "$glass", 100]);
	return f.dot;
});

// research.dm:332
rt.def("/obj/item/weapon/disk/tech_disk/proc/Initialize", function* Initialize(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.dot = (yield* parent_proc());
	this.pixel_x = rand(-5, 5);
	this.pixel_y = rand(-5, 5);
	rt.forRange(f, 0, 1, this.max_tech_stored, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		this.tech_stored += null;
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(6685, "/obj/item/weapon/disk/tech_disk/adv", "/obj/item/weapon/disk/tech_disk", {
	max_tech_stored: 5,
	name: "advanced technology disk",
	desc: "A disk for storing technology data for further research. This one has extra storage space.",
	materials: null,
});

// research.dm:342
rt.def("/obj/item/weapon/disk/tech_disk/adv/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 300, "$glass", 100, "$silver", 50]);
	return f.dot;
});

rt.type(6686, "/obj/item/weapon/disk/tech_disk/super_adv", "/obj/item/weapon/disk/tech_disk", {
	max_tech_stored: 10,
	name: "quantum technology disk",
	desc: "A disk for storing technology data for further research. This one has extremely large storage space.",
	materials: null,
});

// research.dm:348
rt.def("/obj/item/weapon/disk/tech_disk/super_adv/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 300, "$glass", 100, "$silver", 100, "$gold", 100]);
	return f.dot;
});

rt.type(6687, "/obj/item/weapon/disk/tech_disk/debug", "/obj/item/weapon/disk/tech_disk", {
	max_tech_stored: 0,
	name: "centcomm technology disk",
	desc: "A debug item for research",
	materials: null,
});

// research.dm:354
rt.def("/obj/item/weapon/disk/tech_disk/debug/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = list();
	return f.dot;
});

// research.dm:358
rt.def("/obj/item/weapon/disk/tech_disk/debug/proc/Initialize", function* Initialize(f: Frame) {
	let techs: Value = null, V: Value = null, _T: Value = null;
	f.dot = (yield* parent_proc());
	this.max_tech_stored = rt.len(f, (techs = typesof(T("/datum/tech")) - T("/datum/tech")));
	for (V of each(techs)) {
		this.tech_stored += (_T = (yield* new_(V)));
		_T.level = 8;
	}
	return f.dot;
}, true);
