// Based on /tg/station's code/modules/admin/verbs/possess.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// possess.dm:5
rt.def("/proc/possess", function possess(f: Frame, O: Value) {
	let _T: Value = null;
	if (O.dangerous_possession && GLOB.config.forbid_singulo_possession) {
		to_chat(f.usr, `${O} is too powerful for you to possess.`);
		return f.dot;
	}
	if (_T = rt.getStep(f, O, 0)) {
		log_admin(`${key_name(f.usr)} has possessed ${O} (${O.type}) at (${_T.x}, ${_T.y}, ${_T.z})`);
		message_admins(`${key_name(f.usr)} has possessed ${O} (${O.type}) at (${_T.x}, ${_T.y}, ${_T.z})`);
	} else {
		log_admin(`${key_name(f.usr)} has possessed ${O} (${O.type}) at an unknown location`);
		message_admins(`${key_name(f.usr)} has possessed ${O} (${O.type}) at an unknown location`);
	}
	if (!f.usr.control_object) {
		f.usr.name_archive = f.usr.real_name;
	}
	f.usr.loc = O;
	f.usr.real_name = O.name;
	f.usr.name = O.name;
	f.usr.client.eye = O;
	f.usr.control_object = O;
	return f.dot;
}, false, { verb: { name: "Possess Obj", category: "Object" }, argTypes: [{ type: 4, path: "/obj", source: "world" }] });

// possess.dm:33
rt.def("/proc/release", function release(f: Frame, O: Value) {
	let H: Value = null;
	if (f.usr.control_object && f.usr.name_archive) {
		f.usr.real_name = f.usr.name_archive;
		f.usr.name = f.usr.real_name;
		if (rt.istype(f.usr, T("/mob/living/carbon/human"))) {
			(H = f.usr).name = H.get_visible_name();
		}
	}
	f.usr.loc = O.loc;
	f.usr.client.eye = f.usr;
	f.usr.control_object = null;
	return f.dot;
}, false, { verb: { name: "Release Obj", category: "Object" }, argTypes: [{ type: 4, path: "/obj", source: "world" }] });
