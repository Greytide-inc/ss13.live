// Based on /tg/station's code/modules/admin/verbs/pray.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


// pray.dm:6
rt.def("/mob/verb/pray", function pray(f: Frame, msg: Value) {
	let deity: Value = null, C: Value = null;
	let $3: any, $e: any;
	if (GLOB.say_disabled) {
		to_chat(f.usr, "<span class='danger'>Speech is currently admin-disabled.</span>");
		return f.dot;
	}
	if (!(msg = copytext(sanitize(msg), 1, 1024))) {
		return f.dot;
	}
	log_prayer(`${this.key}/(${this.name}): ${msg}`);
	if (f.usr.client) {
		if (rt.bitAnd(f.usr.client.prefs.muted, 4)) {
			to_chat(f.usr, "<span class='danger'>You cannot pray (muted).</span>");
			return f.dot;
		}
		if (this.client.handle_spam_prevention(msg, 4)) {
			return f.dot;
		}
	}
	let cross: Value = mutable_appearance(rt.rsc("icons/obj/storage.dmi"), "bible");
	let font_color: Value = "purple";
	let prayer_type: Value = "PRAYER";
	if (f.usr.job == "Chaplain") {
		cross.icon_state = "kingyellow";
		font_color = "blue";
		prayer_type = "CHAPLAIN PRAYER";
		if (GLOB.SSreligion.deity) {
			deity = GLOB.SSreligion.deity;
		}
	} else if (iscultist(f.usr)) {
		cross.icon_state = "tome";
		font_color = "red";
		prayer_type = "CULTIST PRAYER";
		deity = "Nar-Sie";
	}
	let $0: any = bicon(cross);
	let $1: any = font_color;
	let $2: any = prayer_type;
	if (deity) {
		$3 = ` (to ${deity})`;
	} else {
		$3 = "";
	}
	msg = `<span class='adminnotice'>${$0}<b><font color=${$1}>${$2}${$3}: </font>${`${key_name_admin(this)} ${`${fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [this])} ${fmt("(<a href='?_src_=holder;adminplayeropts=＃'>PP</a>)", [this])} ${fmt("(<a href='?_src_=vars;Vars=＃'>VV</a>)", [this])} ${fmt("(<a href='?_src_=holder;subtlemessage=＃'>SM</a>)", [this])} ${fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [this])} ${fmt("(<a href='?_src_=holder;traitor=＃'>TP</a>)", [this])} ${fmt("(<a href='?_src_=holder;individuallog=＃'>LOGS</a>)", [this])} ${fmt("(<a href='?_src_=holder;adminsmite=＃'>SMITE</a>)", [this])}`}`} ${fmt("(<a href='?_src_=holder;adminspawncookie=＃'>SC</a>)", [this])}:</b> ${msg}</span>`;
	for (C of each(GLOB.admins, T("/client"))) {
		if (rt.bitAnd(C.prefs.chat_toggles, 16)) {
			to_chat(C, msg);
			if (rt.bitAnd(C.prefs.toggles, 512)) {
				if (f.usr.job == "Chaplain") {
					rt.op(f, "Output", [], [C, rt.rsc("sound/effects/pray.ogg")], false);
				}
			}
		}
	}
	to_chat(f.usr, "Your prayers have been received by the gods.");
	return f.dot;
}, false, { verb: { name: "Pray", category: "IC" }, argTypes: [{ type: 2 }] });

// pray.dm:50
rt.def("/proc/Centcomm_announce", function Centcomm_announce(f: Frame, text: Value, Sender: Value) {
	let C: Value = null;
	let msg: Value = copytext(sanitize(text), 1, 1024);
	msg = `<span class='adminnotice'><b><font color=orange>CENTCOM:</font>${`${key_name_admin(Sender)} ${`${fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [Sender])} ${fmt("(<a href='?_src_=holder;adminplayeropts=＃'>PP</a>)", [Sender])} ${fmt("(<a href='?_src_=vars;Vars=＃'>VV</a>)", [Sender])} ${fmt("(<a href='?_src_=holder;subtlemessage=＃'>SM</a>)", [Sender])} ${fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [Sender])} ${fmt("(<a href='?_src_=holder;traitor=＃'>TP</a>)", [Sender])} ${fmt("(<a href='?_src_=holder;individuallog=＃'>LOGS</a>)", [Sender])} ${fmt("(<a href='?_src_=holder;adminsmite=＃'>SMITE</a>)", [Sender])}`}`} ${fmt("(<a href='?_src_=holder;CentcommReply=＃'>RPLY</a>)", [Sender])}:</b> ${msg}</span>`;
	to_chat(GLOB.admins, msg);
	for (C of each(GLOB.machines, T("/obj/machinery/computer/communications"))) {
		C.overrideCooldown();
	}
	return f.dot;
});

// pray.dm:57
rt.def("/proc/Syndicate_announce", function Syndicate_announce(f: Frame, text: Value, Sender: Value) {
	let C: Value = null;
	let msg: Value = copytext(sanitize(text), 1, 1024);
	msg = `<span class='adminnotice'><b><font color=crimson>SYNDICATE:</font>${`${key_name_admin(Sender)} ${`${fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [Sender])} ${fmt("(<a href='?_src_=holder;adminplayeropts=＃'>PP</a>)", [Sender])} ${fmt("(<a href='?_src_=vars;Vars=＃'>VV</a>)", [Sender])} ${fmt("(<a href='?_src_=holder;subtlemessage=＃'>SM</a>)", [Sender])} ${fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [Sender])} ${fmt("(<a href='?_src_=holder;traitor=＃'>TP</a>)", [Sender])} ${fmt("(<a href='?_src_=holder;individuallog=＃'>LOGS</a>)", [Sender])} ${fmt("(<a href='?_src_=holder;adminsmite=＃'>SMITE</a>)", [Sender])}`}`} ${fmt("(<a href='?_src_=holder;SyndicateReply=＃'>RPLY</a>)", [Sender])}:</b> ${msg}</span>`;
	to_chat(GLOB.admins, msg);
	for (C of each(GLOB.machines, T("/obj/machinery/computer/communications"))) {
		C.overrideCooldown();
	}
	return f.dot;
});

// pray.dm:64
rt.def("/proc/Nuke_request", function Nuke_request(f: Frame, text: Value, Sender: Value) {
	let C: Value = null;
	let msg: Value = copytext(sanitize(text), 1, 1024);
	msg = `<span class='adminnotice'><b><font color=orange>NUKE CODE REQUEST:</font>${`${key_name_admin(Sender)} ${`${fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [Sender])} ${fmt("(<a href='?_src_=holder;adminplayeropts=＃'>PP</a>)", [Sender])} ${fmt("(<a href='?_src_=vars;Vars=＃'>VV</a>)", [Sender])} ${fmt("(<a href='?_src_=holder;subtlemessage=＃'>SM</a>)", [Sender])} ${fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [Sender])} ${fmt("(<a href='?_src_=holder;traitor=＃'>TP</a>)", [Sender])} ${fmt("(<a href='?_src_=holder;individuallog=＃'>LOGS</a>)", [Sender])} ${fmt("(<a href='?_src_=holder;adminsmite=＃'>SMITE</a>)", [Sender])}`}`} ${fmt("(<a href='?_src_=holder;CentcommReply=＃'>RPLY</a>)", [Sender])} ${"(<a href='?_src_=holder;set_selfdestruct_code=1'>SETCODE</a>)"}:</b> ${msg}</span>`;
	to_chat(GLOB.admins, msg);
	for (C of each(GLOB.machines, T("/obj/machinery/computer/communications"))) {
		C.overrideCooldown();
	}
	return f.dot;
});
