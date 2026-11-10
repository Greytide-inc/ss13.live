// Based on /tg/station's code/modules/mob/login.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { P } = rt;


// login.dm:2
rt.def("/mob/proc/Login", function* Login(f: Frame) {
	(rt.modGl("player_list", this, rt.bitOr));
	this.lastKnownIP = this.client.address;
	this.computer_id = this.client.computer_id;
	log_access(`Mob Login: ${key_name(this)} was assigned to a ${this.type}`);
	yield* rt.world().update_status();
	this.client.screen = list();
	this.client.images = list();
	if (!this.hud_used) {
		yield* this.create_mob_hud();
	}
	if (this.hud_used) {
		yield* this.hud_used.show_hud(this.hud_used.hud_version);
	}
	this.next_move = 1;
	yield* parent_proc();
	yield* this.reset_perspective(this.loc);
	if (this.loc) {
		this.loc.on_log(1);
	}
	this.reload_huds();
	this.reload_fullscreen();
	if (rt.isIn(f, this.ckey, GLOB.deadmins)) {
		this.verbs += P("/client/proc/readmin");
	}
	this.add_click_catcher();
	this.sync_mind();
	this.client.sethotkeys();
	this.update_client_colour();
	if (this.client) {
		this.client.click_intercept = null;
		yield* this.client.change_view(this.client.default_view());
	}
	if (!rt.index(GLOB.individual_log_list, this.ckey)) {
		rt.setAt(GLOB.individual_log_list, this.ckey, this.logging);
	} else {
		this.logging = rt.index(GLOB.individual_log_list, this.ckey);
	}
	return f.dot;
}, true);
