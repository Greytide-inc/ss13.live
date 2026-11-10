// Based on /tg/station's code/modules/mob/dead/new_player/login.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// login.dm:2
rt.def("/mob/dead/new_player/proc/Login", function* Login(f: Frame) {
	let postfix: Value = null;
	if (!this.mind) {
		this.mind = (yield* new_(T("/datum/mind"), this.key));
		this.mind.active = 1;
		this.mind.current = this;
	}
	yield* parent_proc();
	if (GLOB.join_motd) {
		const motd = is_creative() ? file2text("config/motd-creative.txt") + "<br>" : GLOB.join_motd; // tg_js: Creative has its own text
		to_chat(this, `<div class="motd">${motd}</div>`);
	}
	if (GLOB.admin_notice) {
		to_chat(this, `<span class='notice'><b>Admin Notice:</b>\n \t ${GLOB.admin_notice}</span>`);
	}
	if (GLOB.config.soft_popcap && living_player_count() >= GLOB.config.soft_popcap) {
		to_chat(this, `<span class='notice'><b>Server Notice:</b>\n \t ${GLOB.config.soft_popcap_message}</span>`);
	}
	(rt.modSrcVar(f, "sight", 16, rt.bitOr));
	yield* this.new_player_panel();
	yield* this.client.playtitlemusic();
	if (!(GLOB.SSticker.current_state < GAME_STATE_SETTING_UP)) return f.dot;
	let tl: Value = round(GLOB.SSticker.GetTimeLeft(), 1) / 10;
	if (tl >= 0) {
		postfix = `in about ${tl} seconds`;
	} else {
		postfix = "soon";
	}
	if (!is_creative()) to_chat(this, `Please set up your character and select "Ready". The game will start ${postfix}.`);
	return f.dot;
}, true);
