// Based on /tg/station's code/modules/admin/create_mob.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


// create_mob.dm:4
rt.def("/datum/admins/proc/create_mob", function create_mob(f: Frame, user: Value) {
	let mobjs: Value = null;
	if (!GLOB.create_mob_html) {
		mobjs = jointext(typesof(T("/mob")), ";");
		GLOB.create_mob_html = file2text(rt.rsc("html/create_object.html"));
		GLOB.create_mob_html = replacetext(GLOB.create_mob_html, "null /* object types */", `"${mobjs}"`);
	}
	rt.op(f, "Browse", [], [user, replacetext(GLOB.create_mob_html, "/* ref src */", fmt("＃", [this])), "window=create_mob;size=425x475"], false);
	return f.dot;
});

// create_mob.dm:13
rt.def("/proc/randomize_human", function* randomize_human(f: Frame, H: Value) {
	H.gender = pick("male", "female");
	H.real_name = random_unique_name(H.gender);
	H.name = H.real_name;
	H.underwear = (yield* random_underwear(H.gender));
	H.skin_tone = random_skin_tone();
	H.hair_style = random_hair_style(H.gender);
	H.facial_hair_style = random_facial_hair_style(H.gender);
	H.hair_color = random_short_color();
	H.facial_hair_color = H.hair_color;
	H.eye_color = random_eye_color();
	H.dna.blood_type = random_blood_type();
	yield* H.update_body();
	yield* H.update_hair();
	yield* H.update_body_parts();
	return f.dot;
}, true);
