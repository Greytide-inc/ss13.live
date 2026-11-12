// Based on /tg/station's code/game/objects/items/weapons/charter.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


rt.type(7124, "/obj/item/weapon/station_charter", "/obj/item/weapon", {
	used: 0,
	name_type: "station",
	unlimited_uses: 0,
	ignores_timeout: 0,
	response_timer_id: null,
	approval_time: 600,
	name: "station charter",
	icon: rt.rsc("icons/obj/wizard.dmi"),
	icon_state: "scroll2",
	desc: "An official document entrusting the governance of the station and surrounding space to the Captain. ",
}, { global: { standard_station_regex: 731 } });

// charter.dm:20
rt.def("/obj/item/weapon/station_charter/proc/Initialize", function* Initialize(f: Frame) {
	let regexstr: Value = null;
	f.dot = (yield* parent_proc());
	if (GLOB.standard_station_regex) return f.dot;
	let prefixes: Value = jointext(GLOB.station_prefixes, "|");
	let names: Value = jointext(GLOB.station_names, "|");
	let suffixes: Value = jointext(GLOB.station_suffixes, "|");
	let numerals: Value = jointext(GLOB.station_numerals, "|");
	GLOB.standard_station_regex = (yield* new_(T("/regex"), (regexstr = `((${prefixes}) )?((${names}) ?)(${suffixes}) (${numerals})`)));
	return f.dot;
}, true);

// charter.dm:31
rt.def("/obj/item/weapon/station_charter/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	if (this.used) {
		to_chat(user, `The ${this.name_type} has already been named.`);
		return f.dot;
	}
	if (!this.ignores_timeout && rt.worldTime(f) - GLOB.SSticker.round_start_time > 3000) {
		to_chat(user, `The crew has already settled into the shift. It probably wouldn't be good to rename the ${this.name_type} right now.`);
		return f.dot;
	}
	if (this.response_timer_id) {
		to_chat(user, "You're still waiting for approval from your employers about your proposed name change, it'd be best to wait for now.");
		return f.dot;
	}
	let new_name: Value = (yield* stripped_input(user, { message: `What do you want to name ${station_name()}? Keep in mind particularly terrible names may be rejected by your employers, while names using the standard format, will automatically be accepted.`, max_length: 80 }));
	if (this.response_timer_id) {
		to_chat(user, "You're still waiting for approval from your employers about your proposed name change, it'd be best to wait for now.");
		return f.dot;
	}
	if (!new_name) {
		return f.dot;
	}
	log_game(`${key_name(user)} has proposed to name the station as ${new_name}`);
	if (GLOB.standard_station_regex.Find(new_name)) {
		to_chat(user, "Your name has been automatically approved.");
		this.rename_station(new_name, user.name, user.real_name, key_name(user));
		return f.dot;
	}
	to_chat(user, "Your name has been sent to your employers for approval.");
	this.response_timer_id = (yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/weapon/station_charter/proc/rename_station"), new_name, user.name, user.real_name, key_name(user))), this.approval_time, 8));
	to_chat(GLOB.admins, fmt("<span class='adminnotice'><b><font color=orange>CUSTOM STATION RENAME:</font></b>＀ proposes to rename the ＀ to ＀ (will autoapprove in ＀ seconds). ＀ (<A HREF='?_src_=holder;reject_custom_name=＃'>REJECT</A>) ＀</span>", [`${key_name_admin(user)}${fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [user])} ${fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [user])}`, this.name_type, new_name, this.approval_time / 10, fmt("(<a href='?_src_=holder;adminsmite=＃'>SMITE</a>)", [user]), this, fmt("(<a href='?_src_=holder;CentcommReply=＃'>RPLY</a>)", [user])]));
	return f.dot;
}, true);

// charter.dm:65
rt.def("/obj/item/weapon/station_charter/proc/reject_proposed", function* reject_proposed(f: Frame, user: Value) {
	let _T: Value = null, m: Value = null;
	if (!user) {
		return f.dot;
	}
	if (!this.response_timer_id) {
		return f.dot;
	}
	(_T = rt.getStep(f, this, 0)).visible_message(`<span class='warning'>The proposed changes disappear from ${this}; it looks like they've been rejected.</span>`);
	message_admins((m = `${key_name(user)} has rejected the proposed station name.`));
	log_admin(m);
	yield* deltimer(this.response_timer_id);
	this.response_timer_id = null;
	return f.dot;
}, true);

// charter.dm:81
rt.def("/obj/item/weapon/station_charter/proc/rename_station", function rename_station(f: Frame, designation: Value, uname: Value, ureal_name: Value, ukey: Value) {
	this.response_timer_id = null; // the approval wait is over (tg left it set: "still waiting for approval", and an admin could reject a name already in use)
	set_station_name(designation);
	minor_announce(`${ureal_name} has designated your station as ${station_name()}`, "Captain's Charter", 0);
	log_game(`${ukey} has renamed the station as ${station_name()}.`);
	this.name = `station charter for ${station_name()}`;
	this.desc = `An official document entrusting the governance of ${station_name()} and surrounding space to Captain ${uname}.`;
	if (this.unlimited_uses) return f.dot;
	this.used = 1;
	return f.dot;
});

rt.type(7126, "/obj/item/weapon/station_charter/flag", "/obj/item/weapon/station_charter", {
	name_type: "planet",
	name: "nanotrasen banner",
	icon: rt.rsc("icons/obj/items.dmi"),
	icon_state: "banner",
	item_state: "banner",
	desc: "A cunning device used to claim ownership of planets.",
	w_class: 5,
	force: 15,
});

// charter.dm:108
rt.def("/obj/item/weapon/station_charter/flag/proc/rename_station", function rename_station(f: Frame, designation: Value, uname: Value, ureal_name: Value, ukey: Value) {
	this.response_timer_id = null; // the approval wait is over (tg left it set: "still waiting for approval", and an admin could reject a name already in use)
	set_station_name(designation);
	minor_announce(`${ureal_name} has designated the planet as ${station_name()}`, "Captain's Banner", 0);
	log_game(`${ukey} has renamed the planet as ${station_name()}.`);
	this.name = `banner of ${station_name()}`;
	this.desc = `The banner bears the official coat of arms of Nanotrasen, signifying that ${station_name()} has been claimed by Captain ${uname} in the name of the company.`;
	if (this.unlimited_uses) return f.dot;
	this.used = 1;
	return f.dot;
});
