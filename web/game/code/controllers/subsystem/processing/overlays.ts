// Based on /tg/station's code/controllers/subsystem/processing/overlays.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(56, "/datum/controller/subsystem/processing/overlays", "/datum/controller/subsystem/processing", {
	overlay_icon_state_caches: null,
	overlay_icon_cache: null,
	initialized: 0,
	name: "Overlay",
	flags: 16,
	wait: 1,
	priority: 500,
	init_order: -6,
	runlevels: 14,
	stat_tag: "Ov",
	currentrun: null,
});

// overlays.dm:1
rt.def("/datum/controller/subsystem/processing/overlays/proc/New", function* New(f: Frame) {
	if (GLOB.SSoverlays != this) {
		if (rt.istype(GLOB.SSoverlays, T("/datum/controller/subsystem/processing/overlays"))) {
			yield* this.Recover();
			yield* qdel(GLOB.SSoverlays);
		}
		GLOB.SSoverlays = this;
	}
	this.PreInit();
	return f.dot;
}, true);

// overlays.dm:10
rt.def("/datum/controller/subsystem/processing/overlays/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.currentrun = null;
	return f.dot;
});

// overlays.dm:16
rt.def("/datum/controller/subsystem/processing/overlays/proc/PreInit", function PreInit(f: Frame) {
	if (!this.overlay_icon_state_caches) {
		this.overlay_icon_state_caches = list();
	}
	if (this.overlay_icon_cache) return f.dot;
	this.overlay_icon_cache = list();
	return f.dot;
});

// overlays.dm:21
rt.def("/datum/controller/subsystem/processing/overlays/proc/Initialize", function* Initialize(f: Frame) {
	this.initialized = 1;
	yield* this.Flush();
	yield* parent_proc();
	return f.dot;
}, true);

// overlays.dm:30
rt.def("/datum/controller/subsystem/processing/overlays/proc/fire", function* fire(f: Frame, resumed: Value, mc_check: Value) {
	let thing: Value = null;
	resumed ??= 0;
	mc_check ??= 1;
	while (rt.len(f, this.processing)) {
		thing = rt.index(this.processing, rt.len(f, this.processing));
		this.processing.len--;
		if (thing) {
			thing.compile_overlays(0);
		}
		if (mc_check) {
			if (rt.tickUsage(f) > GLOB.current_ticklimit || this.state != 2 ? this.pause() : 0) {
				break;
			}
		} else if (rt.tickUsage(f) > GLOB.current_ticklimit) {
			yield* stoplag();
		}
	}
	return f.dot;
}, true);

// overlays.dm:42
rt.def("/datum/controller/subsystem/processing/overlays/proc/Flush", function* Flush(f: Frame) {
	if (!rt.len(f, this.processing)) return f.dot;
	yield* this.fire({ mc_check: 0 });
	return f.dot;
}, true);

// overlays.dm:47
rt.def("/atom/proc/compile_overlays", function compile_overlays(f: Frame) {
	if (rt.length(this.priority_overlays) && rt.length(this.our_overlays)) {
		this.overlays = this.our_overlays + this.priority_overlays;
	} else if (rt.length(this.our_overlays)) {
		this.overlays = this.our_overlays;
	} else if (rt.length(this.priority_overlays)) {
		this.overlays = this.priority_overlays;
	} else {
		this.overlays.Cut();
	}
	(rt.modSrcVar(f, "flags", 16776959, rt.bitAnd));
	return f.dot;
});

// overlays.dm:60
rt.def("/proc/iconstate2appearance", function iconstate2appearance(f: Frame, icon: Value, iconstate: Value) {
	let cached_icon: Value = null, cached_appearance: Value = null;
	let icon_states_cache: Value = GLOB.SSoverlays.overlay_icon_state_caches;
	if (cached_icon = rt.index(icon_states_cache, icon)) {
		if (cached_appearance = rt.index(cached_icon, `${iconstate}`)) {
			return cached_appearance;
		}
	}
	GLOB.stringbro.icon = icon;
	GLOB.stringbro.icon_state = iconstate;
	if (!cached_icon) {
		cached_icon = list();
		rt.setAt(icon_states_cache, icon, cached_icon);
	}
	cached_appearance = GLOB.stringbro.appearance;
	rt.setAt(cached_icon, `${iconstate}`, cached_appearance);
	return cached_appearance;
});

// overlays.dm:77
rt.def("/proc/icon2appearance", function icon2appearance(f: Frame, icon: Value) {
	let icon_cache: Value = null;
	f.dot = rt.index((icon_cache = GLOB.SSoverlays.overlay_icon_cache), icon);
	if (f.dot) return f.dot;
	GLOB.iconbro.icon = icon;
	f.dot = GLOB.iconbro.appearance;
	rt.setAt(icon_cache, icon, f.dot);
	return f.dot;
});

// overlays.dm:85
rt.def("/atom/proc/build_appearance_list", function build_appearance_list(f: Frame, new_overlays: Value) {
	let i: Value = null, cached_overlay: Value = null;
	let $e: any;
	if (!rt.istype(new_overlays, T("/list"))) {
		new_overlays = list(new_overlays);
	} else {
		listclearnulls(new_overlays);
	}
	rt.forRange(f, 0, 1, rt.length(new_overlays), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (istext((cached_overlay = rt.index(new_overlays, i)))) {
			rt.setAt(new_overlays, i, iconstate2appearance(this.icon, cached_overlay));
		} else if (isicon(cached_overlay)) {
			rt.setAt(new_overlays, i, icon2appearance(cached_overlay));
		} else {
			GLOB.appearance_bro.appearance = cached_overlay;
			if (!ispath(cached_overlay)) {
				GLOB.appearance_bro.dir = cached_overlay.dir;
			}
			rt.setAt(new_overlays, i, GLOB.appearance_bro.appearance);
		}
	}
	rt.endFor(f, 0);
	return new_overlays;
});

// overlays.dm:105
rt.def("/atom/proc/cut_overlays", function cut_overlays(f: Frame, priority: Value) {
	priority ??= 0;
	let cached_overlays: Value = this.our_overlays;
	let cached_priority: Value = this.priority_overlays;
	let need_compile: Value = 0;
	if (rt.length(cached_overlays)) {
		cached_overlays.Cut();
		need_compile = 1;
	}
	if (priority && rt.length(cached_priority)) {
		cached_priority.Cut();
		need_compile = 1;
	}
	if (!(!rt.bitAnd(this.flags, 256) && need_compile)) return f.dot;
	(rt.modSrcVar(f, "flags", 256, rt.bitOr));
	GLOB.SSoverlays.processing += this;
	return f.dot;
});

// overlays.dm:122
rt.def("/atom/proc/cut_overlay", function cut_overlay(f: Frame, overlays: Value, priority: Value) {
	if (!overlays) {
		return f.dot;
	}
	overlays = this.build_appearance_list(overlays);
	let cached_overlays: Value = this.our_overlays;
	let cached_priority: Value = this.priority_overlays;
	let init_o_len: Value = rt.length(cached_overlays);
	let init_p_len: Value = rt.length(cached_priority);
	if (cached_overlays) {
		cached_overlays -= overlays;
		if (!rt.len(f, cached_overlays)) {
			cached_overlays = null;
		}
	}
	if (priority) {
		if (cached_priority) {
			cached_priority -= overlays;
			if (!rt.len(f, cached_priority)) {
				cached_priority = null;
			}
		}
	}
	if (!(!rt.bitAnd(this.flags, 256) && (init_o_len != rt.length(cached_priority) || init_p_len != rt.length(cached_overlays)))) return f.dot;
	(rt.modSrcVar(f, "flags", 256, rt.bitOr));
	GLOB.SSoverlays.processing += this;
	return f.dot;
});

// overlays.dm:140
rt.def("/atom/proc/add_overlay", function add_overlay(f: Frame, overlays: Value, priority: Value) {
	let need_compile: Value = null;
	priority ??= 0;
	if (!overlays) {
		return f.dot;
	}
	overlays = this.build_appearance_list(overlays);
	if (!this.our_overlays) {
		this.our_overlays = list();
	}
	if (!this.priority_overlays) {
		this.priority_overlays = list();
	}
	let cached_overlays: Value = this.our_overlays;
	let cached_priority: Value = this.priority_overlays;
	let init_o_len: Value = rt.len(f, cached_overlays);
	let init_p_len: Value = rt.len(f, cached_priority);
	if (priority) {
		cached_priority += overlays;
		need_compile = (init_p_len != rt.len(f, cached_priority) ? 1 : 0);
	} else {
		cached_overlays += overlays;
		need_compile = (init_o_len != rt.len(f, cached_overlays) ? 1 : 0);
	}
	if (!(!rt.bitAnd(this.flags, 256) && need_compile)) return f.dot;
	(rt.modSrcVar(f, "flags", 256, rt.bitOr));
	GLOB.SSoverlays.processing += this;
	return f.dot;
});

// overlays.dm:165
rt.def("/atom/proc/copy_overlays", function copy_overlays(f: Frame, other: Value, cut_old: Value) {
	let cached_other: Value = null;
	if (!other) {
		if (cut_old) {
			this.cut_overlays();
		}
		return f.dot;
	}
	if (cached_other = other.our_overlays) {
		if (cut_old || !rt.length(this.our_overlays)) {
			this.our_overlays = cached_other.Copy();
		} else {
			(rt.modSrcVar(f, "our_overlays", cached_other, rt.bitOr));
		}
		if (!rt.bitAnd(this.flags, 256)) {
			(rt.modSrcVar(f, "flags", 256, rt.bitOr));
			GLOB.SSoverlays.processing += this;
		}
	} else {
		if (!cut_old) return f.dot;
		this.cut_overlays();
	}
	return f.dot;
});

// overlays.dm:186
rt.def("/image/proc/add_overlay", function add_overlay(f: Frame, x: Value) {
	this.overlays += x;
	return f.dot;
});

// overlays.dm:189
rt.def("/image/proc/cut_overlay", function cut_overlay(f: Frame, x: Value) {
	this.overlays -= x;
	return f.dot;
});

// overlays.dm:192
rt.def("/image/proc/cut_overlays", function cut_overlays(f: Frame, x: Value) {
	this.overlays.Cut();
	return f.dot;
});

// overlays.dm:195
rt.def("/image/proc/copy_overlays", function copy_overlays(f: Frame, other: Value, cut_old: Value) {
	let cached_other: Value = null;
	if (!other) {
		if (cut_old) {
			this.cut_overlays();
		}
		return f.dot;
	}
	if (cached_other = other.our_overlays) {
		if (cut_old || !rt.len(f, this.overlays)) {
			this.overlays = cached_other.Copy();
		} else {
			(rt.modSrcVar(f, "overlays", cached_other, rt.bitOr));
		}
	} else {
		if (!cut_old) return f.dot;
		this.cut_overlays();
	}
	return f.dot;
});
