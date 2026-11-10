// Based on /tg/station's code/modules/admin/verbs/adminhelp.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g, add, fmt } = rt;


// adminhelp.dm:8
rt.def("/datum/controller/global_vars/proc/InitGlobalahelp_tickets", function* InitGlobalahelp_tickets(f: Frame) {
	GLOB.ahelp_tickets = (yield* new_(T("/datum/admin_help_tickets")));
	this.gvars_datum_init_order += "ahelp_tickets";
	return f.dot;
}, true);

rt.type(1839, "/datum/admin_help_tickets", "/datum", {
	active_tickets: null,
	closed_tickets: null,
	resolved_tickets: null,
	astatclick: null,
	cstatclick: null,
	rstatclick: null,
});

// adminhelp.dm:11
rt.def("/datum/admin_help_tickets/proc/<init>", function* _init_(f: Frame) {
	yield* parent_proc();
	this.active_tickets = list();

	this.closed_tickets = list();

	this.resolved_tickets = list();

	this.astatclick = (yield* new_(T("/obj/effect/statclick/ticket_list"), null, null, 1));

	this.cstatclick = (yield* new_(T("/obj/effect/statclick/ticket_list"), null, null, 2));

	this.rstatclick = (yield* new_(T("/obj/effect/statclick/ticket_list"), null, null, 3));
	return f.dot;
}, true);

// adminhelp.dm:20
rt.def("/datum/admin_help_tickets/proc/Destroy", function* Destroy(f: Frame) {
	let I: Value = null;
	if (this.active_tickets) {
		for (I of each(this.active_tickets)) {
			yield* qdel(I);
		}
		this.active_tickets.Cut();
	}
	if (this.closed_tickets) {
		I = null;
		for (I of each(this.closed_tickets)) {
			yield* qdel(I);
		}
		this.closed_tickets.Cut();
	}
	if (this.resolved_tickets) {
		I = null;
		for (I of each(this.resolved_tickets)) {
			yield* qdel(I);
		}
		this.resolved_tickets.Cut();
	}
	yield* qdel(this.astatclick);
	this.astatclick = null;
	yield* qdel(this.cstatclick);
	this.cstatclick = null;
	yield* qdel(this.rstatclick);
	this.rstatclick = null;
	return (yield* parent_proc());
}, true);

// adminhelp.dm:48
rt.def("/datum/admin_help_tickets/proc/ListInsert", function ListInsert(f: Frame, new_ticket: Value) {
	let ticket_list: Value = null, num_closed: Value = null, I: Value = null, AH: Value = null;
	let $e: any;
	if (new_ticket.state === 1) {
		ticket_list = this.active_tickets;
	} else if (new_ticket.state === 2) {
		ticket_list = this.closed_tickets;
	} else if (new_ticket.state === 3) {
		ticket_list = this.resolved_tickets;
	} else {
		CRASH(`Invalid ticket state: ${new_ticket.state}`);
	}
	if (num_closed = rt.len(f, ticket_list)) {
		rt.forRange(f, 0, 1, num_closed, 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			I = $e;
			if ((AH = rt.index(ticket_list, I)).id > new_ticket.id) {
				ticket_list.Insert(I, new_ticket);
				return f.dot;
			}
		}
		rt.endFor(f, 0);
	}
	ticket_list += new_ticket;
	return f.dot;
});

// adminhelp.dm:70
rt.def("/datum/admin_help_tickets/proc/BrowseTickets", function BrowseTickets(f: Frame, state: Value) {
	let l2b: Value = null, title: Value = null, I: Value = null, AH: Value = null;
	let $e: any;
	if (state === 1) {
		l2b = this.active_tickets;
		title = "Active Tickets";
	} else if (state === 2) {
		l2b = this.closed_tickets;
		title = "Closed Tickets";
	} else if (state === 3) {
		l2b = this.resolved_tickets;
		title = "Resolved Tickets";
	}
	if (!l2b) {
		return f.dot;
	}
	let dat: Value = list(`<html><head><title>${title}</title></head>`);
	dat += `<A HREF='?_src_=holder;ahelp_tickets=${state}'>Refresh</A><br><br>`;
	for (I of each(l2b)) {
		dat += fmt("<span class='adminnotice'><span class='adminhelp'>Ticket #＀</span>: <A HREF='?_src_=holder;ahelp=＃;ahelp_action=ticket'>＀: ＀</A></span><br>", [(AH = I).id, AH, AH.initiator_key_name, AH.name]);
	}
	rt.op(f, "Browse", [], [f.usr, dat.Join(), `window=ahelp_list${state};size=600x480`], false);
	return f.dot;
});

// adminhelp.dm:93
rt.def("/datum/admin_help_tickets/proc/stat_entry", function stat_entry(f: Frame) {
	let I: Value = null, AH: Value = null;
	let num_disconnected: Value = 0;
	stat("Active Tickets:", this.astatclick.update(`${rt.len(f, this.active_tickets)}`));
	for (I of each(this.active_tickets)) {
		if ((AH = I).initiator) {
			stat(`#${AH.id}. ${AH.initiator_key_name}:`, AH.statclick.update());
		} else {
			num_disconnected++;
		}
	}
	if (num_disconnected) {
		stat("Disconnected:", this.astatclick.update(`${num_disconnected}`));
	}
	stat("Closed Tickets:", this.cstatclick.update(`${rt.len(f, this.closed_tickets)}`));
	stat("Resolved Tickets:", this.rstatclick.update(`${rt.len(f, this.resolved_tickets)}`));
	return f.dot;
});

// adminhelp.dm:107
rt.def("/datum/admin_help_tickets/proc/ClientLogin", function ClientLogin(f: Frame, C: Value) {
	C.current_ticket = this.CKey2ActiveTicket(C.ckey);
	if (!C.current_ticket) return f.dot;
	C.current_ticket.AddInteraction("Client reconnected.");
	C.current_ticket.initiator = C;
	return f.dot;
});

// adminhelp.dm:114
rt.def("/datum/admin_help_tickets/proc/ClientLogout", function ClientLogout(f: Frame, C: Value) {
	if (!C.current_ticket) return f.dot;
	C.current_ticket.AddInteraction("Client disconnected.");
	C.current_ticket.initiator = null;
	C.current_ticket = null;
	return f.dot;
});

// adminhelp.dm:121
rt.def("/datum/admin_help_tickets/proc/CKey2ActiveTicket", function CKey2ActiveTicket(f: Frame, ckey: Value) {
	let I: Value = null, AH: Value = null;
	for (I of each(this.active_tickets)) {
		if ((AH = I).initiator_ckey == ckey) {
			return AH;
		}
	}
	return f.dot;
});

rt.type(11214, "/obj/effect/statclick/ticket_list", "/obj/effect/statclick", {
	current_state: null,
});

// adminhelp.dm:134
rt.def("/obj/effect/statclick/ticket_list/proc/New", function* New(f: Frame, loc: Value, name: Value, state: Value) {
	this.current_state = state;
	yield* parent_proc();
	return f.dot;
}, true);

// adminhelp.dm:138
rt.def("/obj/effect/statclick/ticket_list/proc/Click", function Click(f: Frame) {
	GLOB.ahelp_tickets.BrowseTickets(this.current_state);
	return f.dot;
});

rt.type(1840, "/datum/admin_help", "/datum", {
	id: null,
	name: null,
	state: 1,
	opened_at: null,
	closed_at: null,
	initiator: null,
	initiator_ckey: null,
	initiator_key_name: null,
	_interactions: null,
	statclick: null,
}, { global: { ticket_counter: 655 } });

// adminhelp.dm:167
rt.def("/datum/admin_help/proc/New", function* New(f: Frame, msg: Value, C: Value, is_bwoink: Value) {
	let admin_number_present: Value = null;
	if (!(msg = sanitize(copytext(msg, 1, 1024))) || !C || !C.mob) {
		yield* qdel(this);
		return f.dot;
	}
	this.id = rt.incGl("ticket_counter", 1, false);
	this.opened_at = rt.worldTime(f);
	this.name = msg;
	this.initiator = C;
	this.initiator_ckey = this.initiator.ckey;
	this.initiator_key_name = key_name(this.initiator, 0, 1);
	if (this.initiator.current_ticket) {
		stack_trace("Multiple ahelp current_tickets");
		this.initiator.current_ticket.AddInteraction("Ticket erroneously left open by code");
		yield* this.initiator.current_ticket.Close();
	}
	this.initiator.current_ticket = this;
	yield* this.TimeoutVerb();
	let parsed_message: Value = keywords_lookup(msg);
	this.statclick = (yield* new_(T("/obj/effect/statclick/ahelp"), null, this));
	this._interactions = list();
	if (is_bwoink) {
		this.AddInteraction(`<font color='blue'>${key_name_admin(f.usr)} PM'd ${this.LinkedReplyName()}</font>`);
		message_admins(`<font color='blue'>Ticket ${this.TicketHref(`#${this.id}`)} created</font>`);
	} else {
		this.MessageNoRecipient(parsed_message);
		admin_number_present = rt.len(f, rt.at(get_admin_counts(4), "present"));
		log_admin_private(`Ticket #${this.id}: ${key_name(this.initiator)}: ${this.name} - heard by ${admin_number_present} non-AFK admins who have +BAN.`);
		if (admin_number_present <= 0) {
			to_chat(C, "<span class='notice'>No active admins are online, your adminhelp is saved and an admin will see it when one connects.</span>");
		}
	}
	GLOB.ahelp_tickets.active_tickets += this;
	return f.dot;
}, true);

// adminhelp.dm:208
rt.def("/datum/admin_help/proc/Destroy", function* Destroy(f: Frame) {
	yield* this.RemoveActive();
	GLOB.ahelp_tickets.closed_tickets -= this;
	GLOB.ahelp_tickets.resolved_tickets -= this;
	return (yield* parent_proc());
}, true);

// adminhelp.dm:214
rt.def("/datum/admin_help/proc/AddInteraction", function AddInteraction(f: Frame, formatted_message: Value) {
	this._interactions += `${gameTimestamp()}: ${formatted_message}`;
	return f.dot;
});

// adminhelp.dm:218
rt.def("/datum/admin_help/proc/TimeoutVerb", function* TimeoutVerb(f: Frame) {
	this.initiator.verbs -= P("/client/verb/adminhelp");
	this.initiator.adminhelptimerid = (yield* addtimer((yield* new_(T("/datum/callback"), this.initiator, P("/client/proc/giveadminhelpverb"))), 1200, 8));
	return f.dot;
}, true);

// adminhelp.dm:223
rt.def("/datum/admin_help/proc/FullMonty", function FullMonty(f: Frame, ref_src: Value) {
	if (!ref_src) {
		ref_src = fmt("＃", [this]);
	}
	f.dot = `${fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [this.initiator.mob])} ${fmt("(<a href='?_src_=holder;adminplayeropts=＃'>PP</a>)", [this.initiator.mob])} ${fmt("(<a href='?_src_=vars;Vars=＃'>VV</a>)", [this.initiator.mob])} ${fmt("(<a href='?_src_=holder;subtlemessage=＃'>SM</a>)", [this.initiator.mob])} ${fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [this.initiator.mob])} ${fmt("(<a href='?_src_=holder;traitor=＃'>TP</a>)", [this.initiator.mob])} ${fmt("(<a href='?_src_=holder;individuallog=＃'>LOGS</a>)", [this.initiator.mob])} ${fmt("(<a href='?_src_=holder;adminsmite=＃'>SMITE</a>)", [this.initiator.mob])}`;
	if (this.state != 1) return f.dot;
	f.dot += this.ClosureLinks(ref_src);
	return f.dot;
});

// adminhelp.dm:231
rt.def("/datum/admin_help/proc/ClosureLinks", function ClosureLinks(f: Frame, ref_src: Value) {
	if (!ref_src) {
		ref_src = fmt("＃", [this]);
	}
	f.dot = ` (<A HREF='?_src_=holder;ahelp=${ref_src};ahelp_action=reject'>REJT</A>)`;
	f.dot += ` (<A HREF='?_src_=holder;ahelp=${ref_src};ahelp_action=icissue'>IC</A>)`;
	f.dot += ` (<A HREF='?_src_=holder;ahelp=${ref_src};ahelp_action=close'>CLOSE</A>)`;
	f.dot += ` (<A HREF='?_src_=holder;ahelp=${ref_src};ahelp_action=resolve'>RSLVE</A>)`;
	return f.dot;
});

// adminhelp.dm:240
rt.def("/datum/admin_help/proc/LinkedReplyName", function LinkedReplyName(f: Frame, ref_src: Value) {
	if (!ref_src) {
		ref_src = fmt("＃", [this]);
	}
	return `<A HREF='?_src_=holder;ahelp=${ref_src};ahelp_action=reply'>${this.initiator_key_name}</A>`;
});

// adminhelp.dm:246
rt.def("/datum/admin_help/proc/TicketHref", function TicketHref(f: Frame, msg: Value, ref_src: Value, action: Value) {
	action ??= "ticket";
	if (!ref_src) {
		ref_src = fmt("＃", [this]);
	}
	return `<A HREF='?_src_=holder;ahelp=${ref_src};ahelp_action=${action}'>${msg}</A>`;
});

// adminhelp.dm:253
rt.def("/datum/admin_help/proc/MessageNoRecipient", function MessageNoRecipient(f: Frame, msg: Value) {
	let X: Value = null;
	let ref_src: Value = fmt("＃", [this]);
	let chat_msg: Value = `<span class='adminnotice'><span class='adminhelp'>Ticket ${this.TicketHref(`#${this.id}`, ref_src)}</span><b>: ${this.LinkedReplyName(ref_src)} ${this.FullMonty(ref_src)}:</b> ${msg}</span>`;
	this.AddInteraction(`<font color='red'>${this.LinkedReplyName(ref_src)}: ${msg}</font>`);
	for (X of each(GLOB.admins, T("/client"))) {
		if (rt.bitAnd(X.prefs.toggles, 1)) {
			rt.op(f, "Output", [], [X, rt.rsc("sound/effects/adminhelp.ogg")], false);
		}
		window_flash(X, { ignorepref: 1 });
		to_chat(X, chat_msg);
	}
	to_chat(this.initiator, `<span class='adminnotice'>PM to-<b>Admins</b>: ${this.name}</span>`);
	return f.dot;
});

// adminhelp.dm:270
rt.def("/datum/admin_help/proc/Reopen", function* Reopen(f: Frame) {
	let msg: Value = null;
	if (this.state == 1) {
		to_chat(f.usr, "<span class='warning'>This ticket is already open.</span>");
		return f.dot;
	}
	if (GLOB.ahelp_tickets.CKey2ActiveTicket(this.initiator_ckey)) {
		to_chat(f.usr, "<span class='warning'>This user already has an active ticket, cannot reopen this one.</span>");
		return f.dot;
	}
	this.statclick = (yield* new_(T("/obj/effect/statclick/ahelp"), null, this));
	GLOB.ahelp_tickets.active_tickets += this;
	GLOB.ahelp_tickets.closed_tickets -= this;
	GLOB.ahelp_tickets.resolved_tickets -= this;
	this.state = 1;
	this.closed_at = null;
	if (this.initiator) {
		this.initiator.current_ticket = this;
	}
	this.AddInteraction(`<font color='purple'>Reopened by ${key_name_admin(f.usr)}</font>`);
	message_admins((msg = `<span class='adminhelp'>Ticket ${this.TicketHref(`#${this.id}`)} reopened by ${key_name_admin(f.usr)}.</span>`));
	log_admin_private(msg);
	this.TicketPanel();
	return f.dot;
}, true);

// adminhelp.dm:301
rt.def("/datum/admin_help/proc/RemoveActive", function* RemoveActive(f: Frame) {
	if (this.state != 1) {
		return f.dot;
	}
	this.closed_at = rt.worldTime(f);
	yield* qdel(this.statclick);
	this.statclick = null;
	GLOB.ahelp_tickets.active_tickets -= this;
	if (!(this.initiator && this.initiator.current_ticket == this)) return f.dot;
	this.initiator.current_ticket = null;
	return f.dot;
}, true);

// adminhelp.dm:311
rt.def("/datum/admin_help/proc/Close", function* Close(f: Frame, key_name: Value, silent: Value) {
	let msg: Value = null;
	key_name ??= key_name_admin(f.usr);
	silent ??= 0;
	if (this.state != 1) {
		return f.dot;
	}
	yield* this.RemoveActive();
	this.state = 2;
	GLOB.ahelp_tickets.ListInsert(this);
	this.AddInteraction(`<font color='red'>Closed by ${key_name}.</font>`);
	if (silent) return f.dot;
	message_admins((msg = `Ticket ${this.TicketHref(`#${this.id}`)} closed by ${key_name}.`));
	log_admin_private(msg);
	return f.dot;
}, true);

// adminhelp.dm:325
rt.def("/datum/admin_help/proc/Resolve", function* Resolve(f: Frame, key_name: Value, silent: Value) {
	let msg: Value = null;
	key_name ??= key_name_admin(f.usr);
	silent ??= 0;
	if (this.state != 1) {
		return f.dot;
	}
	yield* this.RemoveActive();
	this.state = 3;
	GLOB.ahelp_tickets.ListInsert(this);
	if (this.initiator) {
		yield* this.initiator.giveadminhelpverb();
	}
	this.AddInteraction(`<font color='green'>Resolved by ${key_name}.</font>`);
	if (silent) return f.dot;
	message_admins((msg = `Ticket ${this.TicketHref(`#${this.id}`)} resolved by ${key_name}`));
	log_admin_private(msg);
	return f.dot;
}, true);

// adminhelp.dm:343
rt.def("/datum/admin_help/proc/Reject", function* Reject(f: Frame, key_name: Value) {
	let msg: Value = null;
	key_name ??= key_name_admin(f.usr);
	if (this.state != 1) {
		return f.dot;
	}
	if (this.initiator) {
		yield* this.initiator.giveadminhelpverb();
		rt.op(f, "OutputReference", [rt.R.srcVar("initiator")], [rt.rsc("sound/effects/adminhelp.ogg")], false);
		to_chat(this.initiator, "<font color='red' size='4'><b>- AdminHelp Rejected! -</b></font>");
		to_chat(this.initiator, "<font color='red'><b>Your admin help was rejected.</b> The adminhelp verb has been returned to you so that you may try again.</font>");
		to_chat(this.initiator, "Please try to be calm, clear, and descriptive in admin helps, do not assume the admin has seen any related events, and clearly state the names of anybody you are reporting.");
	}
	message_admins((msg = `Ticket ${this.TicketHref(`#${this.id}`)} rejected by ${key_name}`));
	log_admin_private(msg);
	this.AddInteraction(`Rejected by ${key_name}.`);
	yield* this.Close({ silent: 1 });
	return f.dot;
}, true);

// adminhelp.dm:364
rt.def("/datum/admin_help/proc/ICIssue", function* ICIssue(f: Frame, key_name: Value) {
	key_name ??= key_name_admin(f.usr);
	if (this.state != 1) {
		return f.dot;
	}
	let msg: Value = "<font color='red' size='4'><b>- AdminHelp marked as IC issue! -</b></font><br>";
	msg += "<font color='red'><b>Losing is part of the game!</b></font><br>";
	msg += "<font color='red'>Your character will frequently die, sometimes without even a possibility of avoiding it. Events will often be out of your control. No matter how good or prepared you are, sometimes you just lose.</font>";
	if (this.initiator) {
		to_chat(this.initiator, msg);
	}
	message_admins((msg = `Ticket ${this.TicketHref(`#${this.id}`)} marked as IC by ${key_name}`));
	log_admin_private(msg);
	this.AddInteraction(`Marked as IC issue by ${key_name}`);
	yield* this.Resolve({ silent: 1 });
	return f.dot;
}, true);

// adminhelp.dm:383
rt.def("/datum/admin_help/proc/TicketPanel", function TicketPanel(f: Frame) {
	let I: Value = null;
	let $e: any;
	let dat: Value = list(`<html><head><title>Ticket #${this.id}</title></head>`);
	let ref_src: Value = fmt("＃", [this]);
	dat += `<h4>Admin Help Ticket #${this.id}: ${this.LinkedReplyName(ref_src)}</h4>`;
	dat += "<b>State: ";
	if (this.state === 1) {
		dat += "<font color='red'>OPEN</font>";
	} else if (this.state === 3) {
		dat += "<font color='green'>RESOLVED</font>";
	} else if (this.state === 2) {
		dat += "CLOSED";
	} else {
		dat += "UNKNOWN";
	}
	dat += `</b>${GLOB.TAB}${this.TicketHref("Refresh", ref_src)}${GLOB.TAB}${this.TicketHref("Re-Title", ref_src, "retitle")}`;
	if (this.state != 1) {
		dat += `${GLOB.TAB}${this.TicketHref("Reopen", ref_src, "reopen")}`;
	}
	dat += `<br><br>Opened at: ${gameTimestamp({ wtime: this.opened_at })} (Approx ${(rt.worldTime(f) - this.opened_at) / 600} minutes ago)`;
	if (this.closed_at) {
		dat += `<br>Closed at: ${gameTimestamp({ wtime: this.closed_at })} (Approx ${(rt.worldTime(f) - this.closed_at) / 600} minutes ago)`;
	}
	dat += "<br><br>";
	if (this.initiator) {
		dat += `<b>Actions:</b> ${this.FullMonty(ref_src)}<br>`;
	} else {
		dat += `<b>DISCONNECTED</b>${GLOB.TAB}${this.ClosureLinks(ref_src)}<br>`;
	}
	dat += "<br><b>Log:</b><br><br>";
	for (I of each(this._interactions)) {
		dat += `${I}<br>`;
	}
	rt.op(f, "Browse", [], [f.usr, dat.Join(), `window=ahelp${this.id};size=620x480`], false);
	return f.dot;
});

// adminhelp.dm:414
rt.def("/datum/admin_help/proc/Retitle", function* Retitle(f: Frame) {
	let new_title: Value = null, msg: Value = null;
	if (new_title = (yield* g.op(f, "Prompt", [3], [this.name, "Rename Ticket", "Enter a title for the ticket", f.usr, null]))) {
		this.name = new_title;
		message_admins((msg = `Ticket ${this.TicketHref(`#${this.id}`)} titled ${this.name} by ${key_name_admin(f.usr)}`));
		log_admin_private(msg);
	}
	this.TicketPanel();
	return f.dot;
}, true);

// adminhelp.dm:426
rt.def("/datum/admin_help/proc/Action", function* Action(f: Frame, action: Value) {
	if (action === "ticket") {
		this.TicketPanel();
	} else if (action === "retitle") {
		yield* this.Retitle();
	} else if (action === "reject") {
		yield* this.Reject();
	} else if (action === "reply") {
		yield* f.usr.client.cmd_ahelp_reply(this.initiator);
	} else if (action === "icissue") {
		yield* this.ICIssue();
	} else if (action === "close") {
		yield* this.Close();
	} else if (action === "resolve") {
		yield* this.Resolve();
	} else if (action === "reopen") {
		yield* this.Reopen();
	}
	return f.dot;
}, true);

rt.type(11215, "/obj/effect/statclick/ahelp", "/obj/effect/statclick", {
	ahelp_datum: null,
});

// adminhelp.dm:452
rt.def("/obj/effect/statclick/ahelp/proc/Initialize", function Initialize(f: Frame, mapload: Value, AH: Value) {
	this.ahelp_datum = AH;
	f.dot = parent_proc();
	return f.dot;
}, false);

// adminhelp.dm:456
rt.def("/obj/effect/statclick/ahelp/proc/update", function update(f: Frame) {
	return parent_proc(this.ahelp_datum.name);
});

// adminhelp.dm:459
rt.def("/obj/effect/statclick/ahelp/proc/Click", function Click(f: Frame) {
	this.ahelp_datum.TicketPanel();
	return f.dot;
});

// adminhelp.dm:463
rt.def("/obj/effect/statclick/ahelp/proc/Destroy", function* Destroy(f: Frame) {
	this.ahelp_datum = null;
	return (yield* parent_proc());
}, true);

// adminhelp.dm:470
rt.def("/client/proc/giveadminhelpverb", function* giveadminhelpverb(f: Frame) {
	(rt.modField(f, this, "verbs", P("/client/verb/adminhelp"), rt.bitOr));
	yield* deltimer(this.adminhelptimerid);
	this.adminhelptimerid = 0;
	return f.dot;
}, true);

// adminhelp.dm:479
rt.def("/client/verb/adminhelp", function* adminhelp(f: Frame, msg: Value) {
	if (GLOB.say_disabled) {
		to_chat(f.usr, "<span class='danger'>Speech is currently admin-disabled.</span>");
		return f.dot;
	}
	if (rt.bitAnd(this.prefs.muted, 8)) {
		to_chat(this, "<span class='danger'>Error: Admin-PM: You cannot send adminhelps (Muted).</span>");
		return f.dot;
	}
	if (this.handle_spam_prevention(msg, 8)) {
		return f.dot;
	}
	if (!msg) {
		return f.dot;
	}
	if (this.current_ticket) {
		if ((yield* alert(f.usr, "You already have a ticket open. Is this for the same issue?", null, "Yes", "No")) != "No") {
			if (this.current_ticket) {
				this.current_ticket.MessageNoRecipient(msg);
				yield* this.current_ticket.TimeoutVerb();
				return f.dot;
			} else {
				to_chat(f.usr, "<span class='warning'>Ticket not found, creating new one...</span>");
			}
		} else {
			this.current_ticket.AddInteraction(`${key_name_admin(f.usr)} opened a new ticket.`);
			yield* this.current_ticket.Close();
		}
	}
	yield* new_(T("/datum/admin_help"), msg, this, 0);
	return f.dot;
}, true, { verb: { name: "Adminhelp", category: "Admin" }, argTypes: [{ type: 2 }] });

// adminhelp.dm:512
rt.def("/client/proc/cmd_admin_ticket_panel", function* cmd_admin_ticket_panel(f: Frame) {
	let browse_to: Value = null;
	if (!check_rights(2, 1)) {
		return f.dot;
	}
	const subject = (yield* g.op(f, "Prompt", [1], [null, null, null, "Display which ticket list?", list("Active Tickets", "Closed Tickets", "Resolved Tickets")]));
	if (subject === "Active Tickets") {
		browse_to = 1;
	} else if (subject === "Closed Tickets") {
		browse_to = 2;
	} else if (subject === "Resolved Tickets") {
		browse_to = 3;
	} else {
		return f.dot;
	}
	GLOB.ahelp_tickets.BrowseTickets(browse_to);
	return f.dot;
}, true, { verb: { name: "Show Ticket List", category: "Admin" } });

// adminhelp.dm:537
rt.def("/proc/admin_ticket_log", function admin_ticket_log(f: Frame, what: Value, message: Value) {
	let C: Value = null, Mob: Value = null, AH: Value = null;
	if (rt.istype((Mob = what), T("/mob"))) {
		C = Mob.client;
	} else {
		C = what;
	}
	if (rt.istype(C, T("/client")) && C.current_ticket) {
		C.current_ticket.AddInteraction(message);
		return C.current_ticket;
	}
	if (!istext(what)) return f.dot;
	if (!(AH = GLOB.ahelp_tickets.CKey2ActiveTicket(what))) return f.dot;
	AH.AddInteraction(message);
	return AH;
});

// adminhelp.dm:556
rt.def("/proc/get_admin_counts", function get_admin_counts(f: Frame, requiredflags: Value) {
	let X: Value = null;
	requiredflags ??= 4;
	f.dot = rt.alist(f, ["total", list(), "noflags", list(), "afk", list(), "stealth", list(), "present", list()]);
	for (X of each(GLOB.admins, T("/client"))) {
		rt.modAt(f.dot, "total", X, add);
		if (requiredflags != 0 && !check_rights_for(X, requiredflags)) {
			rt.modAt(f.dot, "noflags", X, add);
		} else if (X.is_afk()) {
			rt.modAt(f.dot, "afk", X, add);
		} else if (X.holder.fakekey) {
			rt.modAt(f.dot, "stealth", X, add);
		} else {
			rt.modAt(f.dot, "present", X, add);
		}
	}
	return f.dot;
});

// adminhelp.dm:625
rt.def("/proc/keywords_lookup", function keywords_lookup(f: Frame, msg: Value) {
	let M: Value = null, indexing: Value = null, string: Value = null, L: Value = null, surname_found: Value = null, i: Value = null, word: Value = null, original_word: Value = null, word_9: Value = null, found: Value = null, is_antag: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $e: any;
	let adminhelp_ignored_words: Value = list("unknown", "the", "a", "an", "of", "monkey", "alien", "as", "i");
	let msglist: Value = splittext(msg, " ");
	let surnames: Value = list();
	let forenames: Value = list();
	let ckeys: Value = list();
	let founds: Value = "";
	for (M of each(GLOB.mob_list, T("/mob"))) {
		indexing = list(M.real_name, M.name);
		if (M.mind) {
			indexing += M.mind.name;
		}
		string = null;
		for (string of each(indexing)) {
			L = splittext(string, " ");
			surname_found = 0;
			i = rt.len(f, L);
			while (i >= 1) {
				if (word = ckey(rt.index(L, i))) {
					rt.setAt(surnames, word, M);
					surname_found = i;
					break;
				}
				i--;
			}
			i = 1;
			while (i < surname_found) {
				if (word = ckey(rt.index(L, i))) {
					rt.setAt(forenames, word, M);
				}
				i++;
			}
			rt.setAt(ckeys, M.ckey, M);
		}
	}
	let ai_found: Value = 0;
	msg = "";
	let mobs_found: Value = list();
	for (original_word of each(msglist)) {
		if (word_9 = ckey(original_word)) {
			if (!rt.isIn(f, word_9, adminhelp_ignored_words)) {
				if (word_9 == "ai") {
					ai_found = 1;
				} else {
					if (!(found = rt.index(ckeys, word_9))) {
						if (!(found = rt.index(surnames, word_9))) {
							found = rt.index(forenames, word_9);
						}
					}
					if (found) {
						if (!rt.isIn(f, found, mobs_found)) {
							mobs_found += found;
							if (!ai_found && rt.istype(found, T("/mob/living/silicon/ai"))) {
								ai_found = 1;
							}
							is_antag = 0;
							if (found.mind && found.mind.special_role) {
								is_antag = 1;
							}
							$0 = found.name;
							$1 = found.real_name;
							$2 = found.ckey;
							if (is_antag) {

								$3 = "(Antag)";
							} else {
								$3 = null;
							}
							founds += `Name: ${$0}(${$1}) Ckey: ${$2} ${$3} `;
							$0 = original_word;
							if (is_antag) {
								$1 = "red";
							} else {
								$1 = "black";
							}
							msg += fmt("＀<font size='1' color='＀'>(<A HREF='?_src_=holder;adminmoreinfo=＃'>?</A>|<A HREF='?_src_=holder;adminplayerobservefollow=＃'>F</A>)</font> ", [$0, $1, found, found]);
							continue;
						}
					}
				}
			}
		}
		msg += `${original_word} `;
	}
	return msg;
});
