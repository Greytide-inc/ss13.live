// Based on /tg/station's code/__DEFINES/role_preferences.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// role_preferences.dm:30
rt.def("/datum/controller/global_vars/proc/InitGlobalspecial_roles", function InitGlobalspecial_roles(f: Frame) {
	GLOB.special_roles = rt.alist(f, ["traitor", T("/datum/game_mode/traitor"), "operative", T("/datum/game_mode/nuclear"), "changeling", T("/datum/game_mode/changeling"), "wizard", T("/datum/game_mode/wizard"), null, "malf AI", "revolutionary", T("/datum/game_mode/revolution"), null, "xenomorph", null, "pAI", "cultist", T("/datum/game_mode/cult"), "blob", T("/datum/game_mode/blob"), null, "space ninja", "monkey", T("/datum/game_mode/monkey"), "gangster", T("/datum/game_mode/gang"), null, "revenant", "abductor", T("/datum/game_mode/abduction"), "devil", T("/datum/game_mode/devil"), "servant of Ratvar", T("/datum/game_mode/clockwork_cult")]);
	this.gvars_datum_init_order += "special_roles";
	return f.dot;
});
