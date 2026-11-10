// Based on /tg/station's code/modules/admin/verbs/map_template_loadverb.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


// map_template_loadverb.dm:7
rt.def("/client/proc/map_template_load", function* map_template_load(f: Frame) {
	let map: Value = null, _T: Value = null, S: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	if (!(map = (yield* g.op(f, "Prompt", [1], [null, "Place Map Template", "Choose a Map Template to place at your CURRENT LOCATION", f.usr, GLOB.SSmapping.map_templates])))) {
		return f.dot;
	}
	let template: Value = rt.index(GLOB.SSmapping.map_templates, map);
	if (!(_T = rt.getStep(f, this.mob, 0))) {
		return f.dot;
	}
	let preview: Value = list();
	for (S of each((yield* template.get_affected_turfs(_T, { centered: 1 })))) {
		preview += image(rt.rsc("icons/turf/overlays.dmi"), S, "greenOverlay");
	}
	f.usr.client.images += preview;
	if ((yield* alert(f.usr, "Confirm location.", "Template Confirm", "Yes", "No")) == "Yes") {
		if (yield* template.load(_T, { centered: 1 })) {
			$0 = key_name_admin(f.usr);
			$1 = template.name;
			if (_T) {
				$2 = `${`(${_T.x},${_T.y},${_T.z})`} ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${_T.x};Y=${_T.y};Z=${_T.z}'>JMP</a>)`}`;
			} else {
				$2 = "nonexistent location";
			}
			message_admins(`<span class='adminnotice'>${$0} has placed a map template (${$1}) at ${`${$2}`}</span>`);
		} else {
			to_chat(f.usr, "Failed to place map");
		}
	}
	f.usr.client.images -= preview;
	return f.dot;
}, true, { verb: { name: "Map template - Place", category: "Debug" } });

// map_template_loadverb.dm:31
rt.def("/client/proc/map_template_upload", function* map_template_upload(f: Frame) {
	let map: Value = null, M: Value = null;
	if (!(map = (yield* g.op(f, "Prompt", [513], [null, "Upload Map Template", "Choose a Map Template to upload to template storage", f.usr, null])))) {
		return f.dot;
	}
	if (copytext(`${map}`, -4) != ".dmm") {
		to_chat(f.usr, `Bad map file: ${map}`);
		return f.dot;
	}
	if (yield* (M = (yield* new_(T("/datum/map_template"), map, `${map}`))).preload_size(map)) {
		to_chat(f.usr, `Map template '${map}' ready to place (${M.width}x${M.height})`);
		rt.setAt(GLOB.SSmapping.map_templates, M.name, M);
		message_admins(`<span class='adminnotice'>${key_name_admin(f.usr)} has uploaded a map template (${map})</span>`);
	} else {
		to_chat(f.usr, `Map template '${map}' failed to load properly`);
	}
	return f.dot;
}, true, { verb: { name: "Map Template - Upload", category: "Debug" } });
