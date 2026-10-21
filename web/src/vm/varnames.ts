// The names in `datum.vars`, in BYOND 511's order (measured with tools/map-check/probes/vars and
// tests/dm/vars.dm): the type's own declared vars first (ancestors first), then a fixed table per
// built-in root type. DMStandard also declares vars 511 doesn't have (vis_contents, filters, ...);
// they still read and write in the VM but are not listed.
// Unverified: the order of instance vars against statics/globals (BYOND interleaves them in
// declaration order; the compiled JSON keeps them apart, so statics come after the instance vars here).

import type { DMType } from "./objtree.js";

const s = (t: string): string[] => t.split(",");
const DATUM = s("tag,type,parent_type,vars");
const ATOM = s(
	"type,parent_type,tag,name,desc,suffix,text,icon,icon_state,overlays,underlays,dir,visibility,luminosity,opacity,density," +
		"layer,gender,mouse_over_pointer,mouse_drag_pointer,mouse_drop_pointer,mouse_drop_zone,verbs,vars,contents,invisibility," +
		"infra_luminosity,pixel_x,pixel_y,mouse_opacity,pixel_z,override,maptext,maptext_width,maptext_height,transform,alpha," +
		"color,blend_mode,appearance,maptext_x,maptext_y,plane,appearance_flags,pixel_w",
);
const MOVABLE = s(
	"animate_movement,loc,x,y,z,screen_loc,pixel_step_size,bounds,locs,step_x,step_y,step_size,bound_x,bound_y,bound_width,bound_height,glide_size",
);
const LOC = s("loc,x,y,z");
const MOB_OWN = s("sight,client,group,ckey,key,see_in_dark,see_invisible,see_infrared");
const MOB_MOVABLE = [MOVABLE[6], MOVABLE[0], MOVABLE[5], ...MOVABLE.slice(7)]; // pixel_step_size,animate_movement,screen_loc,bounds...
const IMAGE = [MOVABLE[0], ...LOC, MOVABLE[5], MOVABLE[6], MOVABLE[16], ...ATOM];

const TABLES = new Map<string, string[]>([
	["/datum", DATUM],
	["/matrix", [...s("a,b,c,d,e,f"), ...DATUM]],
	["/area", ATOM],
	["/turf", [...LOC, ...ATOM]],
	["/obj", [...MOVABLE, ...ATOM]],
	["/atom/movable", [...MOVABLE, ...ATOM]],
	["/mob", [...ATOM, ...LOC, ...MOB_OWN, ...MOB_MOVABLE]],
	["/image", IMAGE],
	["/mutable_appearance", IMAGE],
]);

/** What DMStandard declares beyond 511. */
const EXTRA = new Set(s("vis_locs,vis_contents,icon_w,icon_z,filters,render_source,render_target,vis_flags,pixloc,particles"));

/** Declared by DMStandard on /atom or /image but not part of these roots in 511. */
const HIDDEN = new Map<string, string[]>([
	["/turf", s("step_x,step_y")],
	["/area", s("step_x,step_y,loc,x,y,z")],
	["/image", s("bound_width,bound_height")],
	["/mutable_appearance", s("bound_width,bound_height")],
]);

const cache = new WeakMap<DMType, string[] | null>();

/** The names for `t.vars`, or null for a type with no table (the caller lists every var). */
export function orderedVarNames(t: DMType, globalNames: string[]): string[] | null {
	let l = cache.get(t);
	if (l === undefined) {
		let table: string[] | undefined;
		let root = "";
		for (let p: DMType | null = t; p && !table; p = p.parent) {
			table = TABLES.get(p.path);
			root = p.path;
		}
		if (!table) l = null;
		else {
			const known = new Set([...table, ...(HIDDEN.get(root) ?? [])]);
			l = [];
			for (const k of t.vars.keys()) if (!known.has(k) && !EXTRA.has(k)) l.push(k);
			l.push(...globalNames, ...table);
		}
		cache.set(t, l);
	}
	return l;
}
