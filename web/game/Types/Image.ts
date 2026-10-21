// From Types/Image.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5106, "/image", "/datum", {
	alpha: 255,
	appearance: null,
	appearance_flags: 0,
	blend_mode: 0,
	color: null,
	contents: null,
	density: 0,
	desc: null,
	gender: "neuter",
	glide_size: 0,
	infra_luminosity: 0,
	invisibility: null,
	filters: null,
	layer: -1,
	luminosity: 0,
	maptext: null,
	maptext_width: 32,
	maptext_height: 32,
	maptext_x: 0,
	maptext_y: 0,
	mouse_over_pointer: 0,
	mouse_drag_pointer: 0,
	mouse_drop_pointer: 1,
	mouse_drop_zone: 0,
	mouse_opacity: 1,
	name: "image",
	opacity: 0,
	overlays: null,
	override: 0,
	pixel_step_size: 0,
	pixel_x: 0,
	pixel_y: 0,
	pixel_w: 0,
	pixel_z: 0,
	plane: -32767,
	render_source: null,
	render_target: null,
	suffix: null,
	text: "i",
	transform: null,
	underlays: null,
	verbs: null,
	visibility: 1,
	vis_flags: 0,
	bound_width: null,
	bound_height: null,
	x: null,
	y: null,
	z: null,
	vis_contents: null,
	dir: null,
	icon: null,
	icon_state: null,
	loc: null,
});

// /image/proc/<init>  (Types/Image.dm:17)
rt.def("/image/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "filters", rt.list());
	return f.dot;
});
