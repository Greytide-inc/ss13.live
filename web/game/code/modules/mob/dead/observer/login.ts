// Based on /tg/station's code/modules/mob/dead/observer/login.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



// login.dm:2
rt.def("/mob/dead/observer/proc/Login", function* Login(f: Frame) {
	let preferred_form: Value = null;
	yield* parent_proc();
	this.ghost_accs = this.client.prefs.ghost_accs;
	this.ghost_others = this.client.prefs.ghost_others;
	if (IsAdminGhost(this)) {
		this.has_unlimited_silicon_privilege = 1;
	}
	if (this.client.prefs.unlock_content) {
		preferred_form = this.client.prefs.ghost_form;
		this.ghost_orbit = this.client.prefs.ghost_orbit;
	}
	yield* this.update_icon(preferred_form);
	this.updateghostimages();
	return f.dot;
}, true);
