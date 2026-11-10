// Based on /tg/station's code/modules/fields/fields.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// fields.dm:13
rt.def("/proc/make_field", function* make_field(f: Frame, field_type: Value, field_params: Value, override_checks: Value, start_field: Value) {
	let F: Value = null;
	override_checks ??= 0;
	start_field ??= 1;
	if (!(F = (yield* new_(field_type))).assume_params(field_params) && !override_checks) {
		yield* qdel(F);
		F = null;
	}
	if (!F.check_variables() && !override_checks) {
		yield* qdel(F);
		F = null;
	}
	if (start_field && (F || override_checks)) {
		yield* F.Initialize();
	}
	return F;
}, true);

rt.type(1507, "/datum/proximity_monitor/advanced", "/datum/proximity_monitor", {
	name: "１Energy Field",
	field_shape: 0,
	square_height: 0,
	square_width: 0,
	square_depth_up: 0,
	square_depth_down: 0,
	process_inner_turfs: 0,
	process_edge_turfs: 0,
	setup_edge_turfs: 0,
	setup_field_turfs: 0,
	use_host_turf: 0,
	field_turfs: null,
	edge_turfs: null,
	field_turfs_new: null,
	edge_turfs_new: null,
});

// fields.dm:37
rt.def("/datum/proximity_monitor/advanced/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.field_turfs = list();

	this.edge_turfs = list();

	this.field_turfs_new = list();

	this.edge_turfs_new = list();
	return f.dot;
});

// fields.dm:43
rt.def("/datum/proximity_monitor/advanced/proc/Destroy", function* Destroy(f: Frame) {
	yield* this.full_cleanup();
	return (yield* parent_proc());
}, true);

// fields.dm:48
rt.def("/datum/proximity_monitor/advanced/proc/assume_params", function assume_params(f: Frame, field_params: Value) {
	let param: Value = null;
	let pass_check: Value = 1;
	for (param of each(field_params)) {
		if (rt.index(this.vars, param) || rt.index(this.vars, param) === null || rt.isIn(f, param, this.vars)) {
			rt.setAt(this.vars, param, rt.index(field_params, param));
		} else {
			pass_check = 0;
		}
	}
	return pass_check;
});

// fields.dm:57
rt.def("/datum/proximity_monitor/advanced/proc/check_variables", function check_variables(f: Frame) {
	let pass: Value = 1;
	if (this.field_shape == 0) {
		pass = 0;
	}
	if (this.current_range < 0 || this.square_height < 0 || this.square_width < 0 || this.square_depth_up < 0 || this.square_depth_down < 0) {
		pass = 0;
	}
	if (!rt.istype(this.host, T("/atom"))) {
		pass = 0;
	}
	return pass;
});

// fields.dm:67
rt.def("/datum/proximity_monitor/advanced/proc/process", function* process(f: Frame) {
	let _T: Value = null;
	if (this.process_inner_turfs) {
		for (_T of each(this.field_turfs, T("/turf"))) {
			this.process_inner_turf(_T);
			if (rt.tickUsage(f) > GLOB.current_ticklimit) {
				yield* stoplag();
			}
		}
	}
	if (!this.process_edge_turfs) return f.dot;
	_T = null;
	for (_T of each(this.edge_turfs, T("/turf"))) {
		this.process_edge_turf(_T);
		if (rt.tickUsage(f) > GLOB.current_ticklimit) {
			yield* stoplag();
		}
	}
	return f.dot;
}, true, { waitfor: false });

// fields.dm:80
rt.def("/datum/proximity_monitor/advanced/proc/Initialize", function* Initialize(f: Frame) {
	yield* this.setup_field();
	this.post_setup_field();
	return f.dot;
}, true);

// fields.dm:84
rt.def("/datum/proximity_monitor/advanced/proc/full_cleanup", function* full_cleanup(f: Frame) {
	let _T: Value = null;
	for (_T of each(this.edge_turfs, T("/turf"))) {
		yield* this.cleanup_edge_turf(_T);
	}
	_T = null;
	for (_T of each(this.field_turfs, T("/turf"))) {
		yield* this.cleanup_field_turf(_T);
	}
	return f.dot;
}, true);

// fields.dm:90
rt.def("/datum/proximity_monitor/advanced/proc/check_movement", function check_movement(f: Frame) {
	if (!this.use_host_turf) {
		if (this.host.loc != this.last_host_loc) {
			this.last_host_loc = this.host.loc;
			return 1;
		}
	} else if (rt.getStep(f, this.host, 0) != this.last_host_loc) {
		this.last_host_loc = rt.getStep(f, this.host, 0);
		return 1;
	}
	return 0;
});

// fields.dm:101
rt.def("/datum/proximity_monitor/advanced/proc/recalculate_field", function* recalculate_field(f: Frame, ignore_movement_check: Value) {
	let _T: Value = null;
	ignore_movement_check ??= 0;
	if (!(ignore_movement_check || this.check_movement()) && this.field_shape != 0) {
		return f.dot;
	}
	this.update_new_turfs();
	let needs_setup: Value = (yield* this.field_turfs_new.Copy());
	if (this.setup_field_turfs) {
		for (_T of each(this.field_turfs, T("/turf"))) {
			if (!rt.isIn(f, _T, needs_setup)) {
				yield* this.cleanup_field_turf(_T);
			} else {
				needs_setup -= _T;
			}
			if (rt.tickUsage(f) > GLOB.current_ticklimit) {
				yield* stoplag();
			}
		}
		_T = null;
		for (_T of each(needs_setup, T("/turf"))) {
			yield* this.setup_field_turf(_T);
			if (rt.tickUsage(f) > GLOB.current_ticklimit) {
				yield* stoplag();
			}
		}
	}
	if (!this.setup_edge_turfs) return f.dot;
	_T = null;
	for (_T of each(this.edge_turfs, T("/turf"))) {
		yield* this.cleanup_edge_turf(_T);
		if (rt.tickUsage(f) > GLOB.current_ticklimit) {
			yield* stoplag();
		}
	}
	_T = null;
	for (_T of each(this.edge_turfs_new, T("/turf"))) {
		yield* this.setup_edge_turf(_T);
		if (rt.tickUsage(f) > GLOB.current_ticklimit) {
			yield* stoplag();
		}
	}
	return f.dot;
}, true);

// fields.dm:148
rt.def("/datum/proximity_monitor/advanced/proc/HandleMove", function* HandleMove(f: Frame) {
	let _host: Value = this.host;
	let new_host_loc: Value = _host.loc;
	if (this.last_host_loc == new_host_loc) return f.dot;
	yield* this.recalculate_field();
	return f.dot;
}, true);

// fields.dm:156
rt.def("/datum/proximity_monitor/advanced/proc/setup_field", function* setup_field(f: Frame) {
	let _T: Value = null;
	this.update_new_turfs();
	if (this.setup_field_turfs) {
		for (_T of each(this.field_turfs_new, T("/turf"))) {
			yield* this.setup_field_turf(_T);
			if (rt.tickUsage(f) > GLOB.current_ticklimit) {
				yield* stoplag();
			}
		}
	}
	if (!this.setup_edge_turfs) return f.dot;
	_T = null;
	for (_T of each(this.edge_turfs_new, T("/turf"))) {
		yield* this.setup_edge_turf(_T);
		if (rt.tickUsage(f) > GLOB.current_ticklimit) {
			yield* stoplag();
		}
	}
	return f.dot;
}, true);

// fields.dm:167
rt.def("/datum/proximity_monitor/advanced/proc/cleanup_field_turf", function* cleanup_field_turf(f: Frame, _T: Value) {
	yield* qdel(rt.index(this.field_turfs, _T));
	this.field_turfs -= _T;
	return f.dot;
}, true);

// fields.dm:171
rt.def("/datum/proximity_monitor/advanced/proc/cleanup_edge_turf", function* cleanup_edge_turf(f: Frame, _T: Value) {
	yield* qdel(rt.index(this.edge_turfs, _T));
	this.edge_turfs -= _T;
	return f.dot;
}, true);

// fields.dm:175
rt.def("/datum/proximity_monitor/advanced/proc/setup_field_turf", function* setup_field_turf(f: Frame, _T: Value) {
	rt.setAt(this.field_turfs, _T, (yield* new_(T("/obj/effect/abstract/proximity_checker/advanced/field_turf"), _T, this)));
	return f.dot;
}, true);

// fields.dm:178
rt.def("/datum/proximity_monitor/advanced/proc/setup_edge_turf", function* setup_edge_turf(f: Frame, _T: Value) {
	rt.setAt(this.edge_turfs, _T, (yield* new_(T("/obj/effect/abstract/proximity_checker/advanced/field_edge"), _T, this)));
	return f.dot;
}, true);

// fields.dm:181
rt.def("/datum/proximity_monitor/advanced/proc/update_new_turfs", function update_new_turfs(f: Frame) {
	let _T: Value = null, center_turfs: Value = null, _T_2: Value = null;
	let $e: any;
	if (!rt.istype(this.host, T("/atom"))) {
		return 0;
	}
	let center: Value = rt.getStep(f, this.host, 0);
	this.field_turfs_new = list();
	this.edge_turfs_new = list();
	if (this.field_shape === 0) {
		return 0;
	} else if (this.field_shape === FIELD_SHAPE_RADIUS_SQUARE) {
		for (_T of each(block(rt.locate(center.x - this.current_range, center.y - this.current_range, center.z - this.square_depth_down), rt.locate(center.x + this.current_range, center.y + this.current_range, center.z + this.square_depth_up)), T("/turf"))) {
			this.field_turfs_new += _T;
		}
		this.edge_turfs_new = this.field_turfs_new.Copy();
		if (this.current_range >= 1) {
			center_turfs = list();
			for (_T_2 of each(block(rt.locate(center.x - this.current_range + 1, center.y - this.current_range + 1, center.z - this.square_depth_down), rt.locate(center.x + this.current_range - 1, center.y + this.current_range - 1, center.z + this.square_depth_up)), T("/turf"))) {
				center_turfs += _T_2;
			}
			_T_2 = null;
			for (_T_2 of each(center_turfs, T("/turf"))) {
				this.edge_turfs_new -= _T_2;
			}
		}
	} else if (this.field_shape === FIELD_SHAPE_CUSTOM_SQUARE) {
		_T = null;
		for (_T of each(block(rt.locate(center.x - this.square_width, center.y - this.square_height, center.z - this.square_depth_down), rt.locate(center.x + this.square_width, center.y + this.square_height, center.z + this.square_depth_up)), T("/turf"))) {
			this.field_turfs_new += _T;
		}
		this.edge_turfs_new = this.field_turfs_new.Copy();
		if (!(this.square_height >= 1 && this.square_width >= 1)) return f.dot;
		center_turfs = list();
		_T_2 = null;
		for (_T_2 of each(block(rt.locate(center.x - this.square_width + 1, center.y - this.square_height + 1, center.z - this.square_depth_down), rt.locate(center.x + this.square_width - 1, center.y + this.square_height - 1, center.z + this.square_depth_up)), T("/turf"))) {
			center_turfs += _T_2;
		}
		_T_2 = null;
		for (_T_2 of each(center_turfs, T("/turf"))) {
			this.edge_turfs_new -= _T_2;
		}
	}
	return f.dot;
});

// fields.dm:212
rt.def("/datum/proximity_monitor/advanced/proc/get_edgeturf_direction", function get_edgeturf_direction(f: Frame, _T: Value, center_override: Value) {
	let checking_from: Value = rt.getStep(f, this.host, 0);
	if (rt.istype(center_override, T("/turf"))) {
		checking_from = center_override;
	}
	if (this.field_shape != 1 && this.field_shape != 2) {
		return f.dot;
	}
	if (!rt.isIn(f, _T, this.edge_turfs)) {
		return f.dot;
	}
	if (this.field_shape === 1) {
		if ((_T.x == checking_from.x + this.current_range || _T.x == checking_from.x - this.current_range) && (_T.y == checking_from.y + this.current_range || _T.y == checking_from.y - this.current_range)) {
			return rt.getDir(f, checking_from, _T);
		}
		if (_T.x == checking_from.x + this.current_range) {
			return 4;
		}
		if (_T.x == checking_from.x - this.current_range) {
			return 8;
		}
		if (_T.y == checking_from.y - this.current_range) {
			return 2;
		}
		if (_T.y == checking_from.y + this.current_range) {
			return 1;
		}
	} else if (this.field_shape === 2) {
		if ((_T.x == checking_from.x + this.square_width || _T.x == checking_from.x - this.square_width) && (_T.y == checking_from.y + this.square_height || _T.y == checking_from.y - this.square_height)) {
			return rt.getDir(f, checking_from, _T);
		}
		if (_T.x == checking_from.x + this.square_width) {
			return 4;
		}
		if (_T.x == checking_from.x - this.square_width) {
			return 8;
		}
		if (_T.y == checking_from.y - this.square_height) {
			return 2;
		}
		if (_T.y != checking_from.y + this.square_height) return f.dot;
		return 1;
	}
	return f.dot;
});

rt.type(1508, "/datum/proximity_monitor/advanced/debug", "/datum/proximity_monitor/advanced", {
	set_fieldturf_color: "#aaffff",
	set_edgeturf_color: "#ffaaff",
	name: "１Color Matrix Field",
	field_shape: 1,
	current_range: 5,
	setup_field_turfs: 1,
	setup_edge_turfs: 1,
});

// fields.dm:254
rt.def("/datum/proximity_monitor/advanced/debug/proc/recalculate_field", function* recalculate_field(f: Frame) {
	yield* parent_proc();
	return f.dot;
}, true);

// fields.dm:257
rt.def("/datum/proximity_monitor/advanced/debug/proc/post_setup_field", function post_setup_field(f: Frame) {
	parent_proc();
	return f.dot;
});

// fields.dm:261
rt.def("/datum/proximity_monitor/advanced/debug/proc/setup_edge_turf", function* setup_edge_turf(f: Frame, T: Value) {
	T.color = this.set_edgeturf_color;
	yield* parent_proc();
	return f.dot;
}, true);

// fields.dm:264
rt.def("/datum/proximity_monitor/advanced/debug/proc/cleanup_edge_turf", function* cleanup_edge_turf(f: Frame, T: Value) {
	T.color = rt.initial(f, T, "color");
	yield* parent_proc();
	if (!rt.isIn(f, T, this.field_turfs)) return f.dot;
	T.color = this.set_fieldturf_color;
	return f.dot;
}, true);

// fields.dm:271
rt.def("/datum/proximity_monitor/advanced/debug/proc/setup_field_turf", function* setup_field_turf(f: Frame, T: Value) {
	T.color = this.set_fieldturf_color;
	yield* parent_proc();
	return f.dot;
}, true);

// fields.dm:274
rt.def("/datum/proximity_monitor/advanced/debug/proc/cleanup_field_turf", function* cleanup_field_turf(f: Frame, T: Value) {
	T.color = rt.initial(f, T, "color");
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(9273, "/obj/item/device/multitool/field_debug", "/obj/item/device/multitool", {
	field_params: null,
	field_type: rt.typePath("/datum/proximity_monitor/advanced/debug"),
	operating: 0,
	current: null,
	name: "strange multitool",
	desc: "Seems to project a colored field!",
});

// fields.dm:281
rt.def("/obj/item/device/multitool/field_debug/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.field_params = rt.alist(f, ["field_shape", 1, "current_range", 5, "set_fieldturf_color", "#aaffff", "set_edgeturf_color", "#ffaaff"]);
	return f.dot;
});

// fields.dm:287
rt.def("/obj/item/device/multitool/field_debug/proc/New", function* New(f: Frame) {
	if (!this.isprocessing) {
		this.isprocessing = 1;
		GLOB.SSobj.processing += this;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// fields.dm:291
rt.def("/obj/item/device/multitool/field_debug/proc/Destroy", function* Destroy(f: Frame) {
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	yield* qdel(this.current);
	this.current = null;
	yield* parent_proc();
	return f.dot;
}, true);

// fields.dm:296
rt.def("/obj/item/device/multitool/field_debug/proc/setup_debug_field", function* setup_debug_field(f: Frame) {
	let new_params: Value = null;
	rt.setAt((new_params = (yield* this.field_params.Copy())), "host", this);
	this.current = (yield* make_field(this.field_type, new_params));
	return f.dot;
}, true);

// fields.dm:301
rt.def("/obj/item/device/multitool/field_debug/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let $2: any;
	this.operating = (!this.operating ? 1 : 0);
	let $0: any = user;
	let $1: any = this;
	if (this.operating) {

		$2 = "on";
	} else {
		$2 = "off";
	}
	to_chat($0, `You turn the ${$1} ${$2}.`);
	if (!rt.istype(this.current, T("/datum/proximity_monitor/advanced")) && this.operating) {
		yield* this.setup_debug_field();
	} else {
		if (this.operating) return f.dot;
		yield* qdel(this.current);
		this.current = null;
	}
	return f.dot;
}, true);

// fields.dm:309
rt.def("/obj/item/device/multitool/field_debug/proc/on_mob_move", function* on_mob_move(f: Frame) {
	yield* this.check_turf(rt.getStep(f, this, 0));
	return f.dot;
}, true);

// fields.dm:312
rt.def("/obj/item/device/multitool/field_debug/proc/process", function* process(f: Frame) {
	yield* this.check_turf(rt.getStep(f, this, 0));
	return f.dot;
}, true, { waitfor: false });

// fields.dm:315
rt.def("/obj/item/device/multitool/field_debug/proc/check_turf", function* check_turf(f: Frame, _T: Value) {
	yield* this.current.HandleMove();
	return f.dot;
}, true);
