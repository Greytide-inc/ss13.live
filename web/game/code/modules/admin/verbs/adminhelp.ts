// From code/modules/admin/verbs/adminhelp.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalahelp_tickets  (code/modules/admin/verbs/adminhelp.dm:8)  may sleep
rt.def("/datum/controller/global_vars/proc/InitGlobalahelp_tickets", function* InitGlobalahelp_tickets(f: Frame) {
	rt.setGl("ahelp_tickets", (yield* g.new_(f, T("/datum/admin_help_tickets"), [])));
	rt.modSrcVar(f, "gvars_datum_init_order", "ahelp_tickets", add);
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

// /datum/admin_help_tickets/proc/<init>  (code/modules/admin/verbs/adminhelp.dm:11)  may sleep
rt.def("/datum/admin_help_tickets/proc/<init>", function* _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = (yield* g.callSuper(f, []));
	rt.setSv(f, "active_tickets", rt.list());
	$0 = $0;
	rt.setSv(f, "closed_tickets", rt.list());
	$0 = $0;
	rt.setSv(f, "resolved_tickets", rt.list());
	$0 = $0;
	rt.setSv(f, "astatclick", (yield* g.new_(f, T("/obj/effect/statclick/ticket_list"), [null, null, 1])));
	$0 = $0;
	rt.setSv(f, "cstatclick", (yield* g.new_(f, T("/obj/effect/statclick/ticket_list"), [null, null, 2])));
	$0 = $0;
	rt.setSv(f, "rstatclick", (yield* g.new_(f, T("/obj/effect/statclick/ticket_list"), [null, null, 3])));
	return f.dot;
}, true);

// /datum/admin_help_tickets/proc/Destroy  (code/modules/admin/verbs/adminhelp.dm:20)  may sleep
rt.def("/datum/admin_help_tickets/proc/Destroy", function* Destroy(f: Frame) {
	let I: Value = null;
	let $e: any;
	f.vars = () => [I, $e];
	if (truthy(rt.sv(f, "active_tickets"))) {
		I = null;
		rt.forList(f, 0, rt.sv(f, "active_tickets"));
		while (($e = rt.next(f, 0)) !== undefined) {
			I = $e;
			yield* g.call(f, P("/proc/qdel"), null, [live(I)]);
		}
		rt.endFor(f, 0);
		yield* g.callName(f, rt.sv(f, "active_tickets"), "Cut", []);
	}
	if (truthy(rt.sv(f, "closed_tickets"))) {
		I = null;
		rt.forList(f, 0, rt.sv(f, "closed_tickets"));
		while (($e = rt.next(f, 0)) !== undefined) {
			I = $e;
			yield* g.call(f, P("/proc/qdel"), null, [live(I)]);
		}
		rt.endFor(f, 0);
		yield* g.callName(f, rt.sv(f, "closed_tickets"), "Cut", []);
	}
	if (truthy(rt.sv(f, "resolved_tickets"))) {
		I = null;
		rt.forList(f, 0, rt.sv(f, "resolved_tickets"));
		while (($e = rt.next(f, 0)) !== undefined) {
			I = $e;
			yield* g.call(f, P("/proc/qdel"), null, [live(I)]);
		}
		rt.endFor(f, 0);
		yield* g.callName(f, rt.sv(f, "resolved_tickets"), "Cut", []);
	}
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "astatclick")]);
	rt.setSv(f, "astatclick", null);
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "cstatclick")]);
	rt.setSv(f, "cstatclick", null);
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "rstatclick")]);
	rt.setSv(f, "rstatclick", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /datum/admin_help_tickets/proc/TicketByID  (code/modules/admin/verbs/adminhelp.dm:30)
rt.def("/datum/admin_help_tickets/proc/TicketByID", function TicketByID(f: Frame, id: Value) {
	let lists: Value = null, I: Value = null, J: Value = null, AH: Value = null;
	let $e: any;
	f.vars = () => [lists, I, J, AH, $e];
	lists = rt.list(rt.sv(f, "active_tickets"), rt.sv(f, "closed_tickets"), rt.sv(f, "resolved_tickets"));
	I = null;
	rt.forList(f, 0, live(lists));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		J = null;
		rt.forList(f, 1, live(I));
		while (($e = rt.next(f, 1)) !== undefined) {
			J = $e;
			if (isEqual(rt.gv(f, "id", (AH = live(J))), live(id))) {
				return live(J);
			}
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/admin_help_tickets/proc/TicketsByCKey  (code/modules/admin/verbs/adminhelp.dm:37)
rt.def("/datum/admin_help_tickets/proc/TicketsByCKey", function TicketsByCKey(f: Frame, ckey: Value) {
	let lists: Value = null, I: Value = null, J: Value = null, AH: Value = null;
	let $e: any;
	f.vars = () => [lists, I, J, AH, $e];
	f.dot = rt.list();
	lists = rt.list(rt.sv(f, "active_tickets"), rt.sv(f, "closed_tickets"), rt.sv(f, "resolved_tickets"));
	I = null;
	rt.forList(f, 0, live(lists));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		J = null;
		rt.forList(f, 1, live(I));
		while (($e = rt.next(f, 1)) !== undefined) {
			J = $e;
			if (isEqual(rt.gv(f, "initiator_ckey", (AH = live(J))), live(ckey))) {
				f.dot = rt.modify(live(f.dot), live(AH), add);
			}
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/admin_help_tickets/proc/ListInsert  (code/modules/admin/verbs/adminhelp.dm:48)
rt.def("/datum/admin_help_tickets/proc/ListInsert", function ListInsert(f: Frame, new_ticket: Value) {
	let ticket_list: Value = null, num_closed: Value = null, I: Value = null, AH: Value = null;
	let $0: any, $e: any;
	f.vars = () => [ticket_list, num_closed, I, AH, $0, $e];
	ticket_list = null;
	$0 = rt.fv(f, "state", live(new_ticket));
	if ($0 === 1) {
		ticket_list = rt.sv(f, "active_tickets");
	} else if ($0 === 2) {
		ticket_list = rt.sv(f, "closed_tickets");
	} else if ($0 === 3) {
		ticket_list = rt.sv(f, "resolved_tickets");
	} else {
		rt.call(f, P("/proc/CRASH"), null, [fmt("Invalid ticket state: ＀", [rt.fv(f, "state", live(new_ticket))])]);
	}
	if (truthy((num_closed = rt.len(f, live(ticket_list))))) {
		I = null;
		rt.forRange(f, 0, 1, live(num_closed), 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			I = $e;
			if (rt.gt(rt.gv(f, "id", (AH = rt.index(live(ticket_list), live(I)))), rt.fv(f, "id", live(new_ticket)))) {
				rt.callName(f, live(ticket_list), "Insert", [live(I), live(new_ticket)]);
				return live(f.dot);
			}
		}
		rt.endFor(f, 0);
	}
	ticket_list = rt.modify(live(ticket_list), live(new_ticket), add);
	return f.dot;
});

// /datum/admin_help_tickets/proc/BrowseTickets  (code/modules/admin/verbs/adminhelp.dm:70)
rt.def("/datum/admin_help_tickets/proc/BrowseTickets", function BrowseTickets(f: Frame, state: Value) {
	let l2b: Value = null, title: Value = null, dat: Value = null, I: Value = null, AH: Value = null;
	let $0: any, $e: any;
	f.vars = () => [l2b, title, dat, I, AH, $0, $e];
	l2b = null;
	title = null;
	$0 = live(state);
	if ($0 === 1) {
		l2b = rt.sv(f, "active_tickets");
		title = "Active Tickets";
	} else if ($0 === 2) {
		l2b = rt.sv(f, "closed_tickets");
		title = "Closed Tickets";
	} else if ($0 === 3) {
		l2b = rt.sv(f, "resolved_tickets");
		title = "Resolved Tickets";
	}
	if (!truthy(live(l2b))) {
		return live(f.dot);
	}
	dat = rt.list(fmt("<html><head><title>＀</title></head>", [live(title)]));
	dat = rt.modify(live(dat), fmt("<A HREF='?_src_=holder;ahelp_tickets=＀'>Refresh</A><br><br>", [live(state)]), add);
	I = null;
	rt.forList(f, 0, live(l2b));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		dat = rt.modify(live(dat), fmt("<span class='adminnotice'><span class='adminhelp'>Ticket #＀</span>: <A HREF='?_src_=holder;ahelp=＃;ahelp_action=ticket'>＀: ＀</A></span><br>", [rt.gv(f, "id", (AH = live(I))), live(AH), rt.fv(f, "initiator_key_name", live(AH)), rt.fv(f, "name", live(AH))]), add);
	}
	rt.endFor(f, 0);
	rt.op(f, "Browse", [], [live(f.usr), rt.callName(f, live(dat), "Join", []), fmt("window=ahelp_list＀;size=600x480", [live(state)])], false);
	return f.dot;
});

// /datum/admin_help_tickets/proc/stat_entry  (code/modules/admin/verbs/adminhelp.dm:93)
rt.def("/datum/admin_help_tickets/proc/stat_entry", function stat_entry(f: Frame) {
	let num_disconnected: Value = null, I: Value = null, AH: Value = null;
	let $e: any;
	f.vars = () => [num_disconnected, I, AH, $e];
	num_disconnected = 0;
	rt.call(f, P("/proc/stat"), null, ["Active Tickets:", rt.callName(f, rt.sv(f, "astatclick"), "update", [fmt("＀", [rt.len(f, rt.sv(f, "active_tickets"))])])]);
	I = null;
	rt.forList(f, 0, rt.sv(f, "active_tickets"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (truthy(rt.gv(f, "initiator", (AH = live(I))))) {
			rt.call(f, P("/proc/stat"), null, [fmt("#＀. ＀:", [rt.fv(f, "id", live(AH)), rt.fv(f, "initiator_key_name", live(AH))]), rt.callName(f, rt.fv(f, "statclick", live(AH)), "update", [])]);
		} else {
			num_disconnected = rt.inc(live(num_disconnected), 1);
		}
	}
	rt.endFor(f, 0);
	if (truthy(live(num_disconnected))) {
		rt.call(f, P("/proc/stat"), null, ["Disconnected:", rt.callName(f, rt.sv(f, "astatclick"), "update", [fmt("＀", [live(num_disconnected)])])]);
	}
	rt.call(f, P("/proc/stat"), null, ["Closed Tickets:", rt.callName(f, rt.sv(f, "cstatclick"), "update", [fmt("＀", [rt.len(f, rt.sv(f, "closed_tickets"))])])]);
	rt.call(f, P("/proc/stat"), null, ["Resolved Tickets:", rt.callName(f, rt.sv(f, "rstatclick"), "update", [fmt("＀", [rt.len(f, rt.sv(f, "resolved_tickets"))])])]);
	return f.dot;
});

// /datum/admin_help_tickets/proc/ClientLogin  (code/modules/admin/verbs/adminhelp.dm:107)
rt.def("/datum/admin_help_tickets/proc/ClientLogin", function ClientLogin(f: Frame, C: Value) {
	rt.setFv(f, "current_ticket", live(C), rt.callSrc(f, "CKey2ActiveTicket", [rt.fv(f, "ckey", live(C))]));
	if (!truthy(rt.fv(f, "current_ticket", live(C)))) return f.dot;
	rt.callName(f, rt.fv(f, "current_ticket", live(C)), "AddInteraction", ["Client reconnected."]);
	rt.setFv(f, "initiator", rt.fv(f, "current_ticket", live(C)), live(C));
	return f.dot;
});

// /datum/admin_help_tickets/proc/ClientLogout  (code/modules/admin/verbs/adminhelp.dm:114)
rt.def("/datum/admin_help_tickets/proc/ClientLogout", function ClientLogout(f: Frame, C: Value) {
	if (!truthy(rt.fv(f, "current_ticket", live(C)))) return f.dot;
	rt.callName(f, rt.fv(f, "current_ticket", live(C)), "AddInteraction", ["Client disconnected."]);
	rt.setFv(f, "initiator", rt.fv(f, "current_ticket", live(C)), null);
	rt.setFv(f, "current_ticket", live(C), null);
	return f.dot;
});

// /datum/admin_help_tickets/proc/CKey2ActiveTicket  (code/modules/admin/verbs/adminhelp.dm:121)
rt.def("/datum/admin_help_tickets/proc/CKey2ActiveTicket", function CKey2ActiveTicket(f: Frame, ckey: Value) {
	let I: Value = null, AH: Value = null;
	let $e: any;
	f.vars = () => [I, AH, $e];
	I = null;
	rt.forList(f, 0, rt.sv(f, "active_tickets"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (isEqual(rt.gv(f, "initiator_ckey", (AH = live(I))), live(ckey))) {
			return live(AH);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

rt.type(11214, "/obj/effect/statclick/ticket_list", "/obj/effect/statclick", {
	current_state: null,
});

// /obj/effect/statclick/ticket_list/proc/New  (code/modules/admin/verbs/adminhelp.dm:134)  may sleep
rt.def("/obj/effect/statclick/ticket_list/proc/New", function* New(f: Frame) {
	rt.setSv(f, "current_state", live(f.args[2]));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["loc", "name", "state"] });

// /obj/effect/statclick/ticket_list/proc/Click  (code/modules/admin/verbs/adminhelp.dm:138)
rt.def("/obj/effect/statclick/ticket_list/proc/Click", function Click(f: Frame) {
	rt.callName(f, rt.gl("ahelp_tickets"), "BrowseTickets", [rt.sv(f, "current_state")]);
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

// /datum/admin_help/proc/New  (code/modules/admin/verbs/adminhelp.dm:167)  may sleep
rt.def("/datum/admin_help/proc/New", function* New(f: Frame, msg: Value, C: Value, is_bwoink: Value) {
	let parsed_message: Value = null, admin_number_present: Value = null;
	f.vars = () => [msg, C, is_bwoink, parsed_message, admin_number_present];
	if (((!truthy((msg = (yield* g.call(f, P("/proc/sanitize"), null, [(yield* g.call(f, P("/proc/copytext"), null, [live(msg), 1, 1024]))])))) || !truthy(live(C))) || !truthy(rt.fv(f, "mob", live(C))))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return live(f.dot);
	}
	rt.setSv(f, "id", rt.incGl("ticket_counter", 1, false));
	rt.setSv(f, "opened_at", rt.worldTime(f));
	rt.setSv(f, "name", live(msg));
	rt.setSv(f, "initiator", live(C));
	rt.setSv(f, "initiator_ckey", rt.fv(f, "ckey", rt.sv(f, "initiator")));
	rt.setSv(f, "initiator_key_name", (yield* g.call(f, P("/proc/key_name"), null, [rt.sv(f, "initiator"), 0, 1])));
	if (truthy(rt.fv(f, "current_ticket", rt.sv(f, "initiator")))) {
		yield* g.call(f, P("/proc/stack_trace"), null, ["Multiple ahelp current_tickets"]);
		yield* g.callName(f, rt.fv(f, "current_ticket", rt.sv(f, "initiator")), "AddInteraction", ["Ticket erroneously left open by code"]);
		yield* g.callName(f, rt.fv(f, "current_ticket", rt.sv(f, "initiator")), "Close", []);
	}
	rt.setFv(f, "current_ticket", rt.sv(f, "initiator"), live(f.src));
	yield* g.srcCall(f, "TimeoutVerb");
	parsed_message = (yield* g.call(f, P("/proc/keywords_lookup"), null, [live(msg)]));
	rt.setSv(f, "statclick", (yield* g.new_(f, T("/obj/effect/statclick/ahelp"), [null, live(f.src)])));
	rt.setSv(f, "_interactions", rt.list());
	if (truthy(live(is_bwoink))) {
		yield* g.srcCall(f, "AddInteraction", fmt("<font color='blue'>＀ PM'd ＀</font>", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), (yield* g.srcCall(f, "LinkedReplyName"))]));
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("<font color='blue'>Ticket ＀ created</font>", [(yield* g.srcCall(f, "TicketHref", fmt("#＀", [rt.sv(f, "id")])))])]);
	} else {
		yield* g.srcCall(f, "MessageNoRecipient", live(parsed_message));
		admin_number_present = rt.len(f, rt.at((yield* g.call(f, P("/proc/get_admin_counts"), null, [4])), "present"));
		yield* g.call(f, P("/proc/log_admin_private"), null, [fmt("Ticket #＀: ＀: ＀ - heard by ＀ non-AFK admins who have +BAN.", [rt.sv(f, "id"), (yield* g.call(f, P("/proc/key_name"), null, [rt.sv(f, "initiator")])), rt.sv(f, "name"), live(admin_number_present)])]);
		if (rt.le(live(admin_number_present), 0)) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(C), "<span class='notice'>No active admins are online, your adminhelp is saved and an admin will see it when one connects.</span>"]);
		}
	}
	rt.modField(f, rt.gl("ahelp_tickets"), "active_tickets", live(f.src), add);
	return f.dot;
}, true);

// /datum/admin_help/proc/Destroy  (code/modules/admin/verbs/adminhelp.dm:208)  may sleep
rt.def("/datum/admin_help/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.srcCall(f, "RemoveActive");
	(rt.modField(f, rt.gl("ahelp_tickets"), "closed_tickets", live(f.src), subtract));
	(rt.modField(f, rt.gl("ahelp_tickets"), "resolved_tickets", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /datum/admin_help/proc/AddInteraction  (code/modules/admin/verbs/adminhelp.dm:214)
rt.def("/datum/admin_help/proc/AddInteraction", function AddInteraction(f: Frame, formatted_message: Value) {
	rt.modSrcVar(f, "_interactions", fmt("＀: ＀", [rt.call(f, P("/proc/gameTimestamp"), null, []), live(formatted_message)]), add);
	return f.dot;
});

// /datum/admin_help/proc/TimeoutVerb  (code/modules/admin/verbs/adminhelp.dm:218)  may sleep
rt.def("/datum/admin_help/proc/TimeoutVerb", function* TimeoutVerb(f: Frame) {
	(rt.modField(f, rt.sv(f, "initiator"), "verbs", P("/client/verb/adminhelp"), subtract));
	rt.setFv(f, "adminhelptimerid", rt.sv(f, "initiator"), (yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [rt.sv(f, "initiator"), P("/client/proc/giveadminhelpverb")])), 1200, 8])));
	return f.dot;
}, true);

// /datum/admin_help/proc/FullMonty  (code/modules/admin/verbs/adminhelp.dm:223)
rt.def("/datum/admin_help/proc/FullMonty", function FullMonty(f: Frame, ref_src: Value) {
	f.vars = () => [ref_src];
	if (!truthy(live(ref_src))) {
		ref_src = fmt("＃", [live(f.src)]);
	}
	f.dot = fmt("＀ ＀ ＀ ＀ ＀ ＀ ＀ ＀", [fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [rt.fv(f, "mob", rt.sv(f, "initiator"))]), fmt("(<a href='?_src_=holder;adminplayeropts=＃'>PP</a>)", [rt.fv(f, "mob", rt.sv(f, "initiator"))]), fmt("(<a href='?_src_=vars;Vars=＃'>VV</a>)", [rt.fv(f, "mob", rt.sv(f, "initiator"))]), fmt("(<a href='?_src_=holder;subtlemessage=＃'>SM</a>)", [rt.fv(f, "mob", rt.sv(f, "initiator"))]), fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [rt.fv(f, "mob", rt.sv(f, "initiator"))]), fmt("(<a href='?_src_=holder;traitor=＃'>TP</a>)", [rt.fv(f, "mob", rt.sv(f, "initiator"))]), fmt("(<a href='?_src_=holder;individuallog=＃'>LOGS</a>)", [rt.fv(f, "mob", rt.sv(f, "initiator"))]), fmt("(<a href='?_src_=holder;adminsmite=＃'>SMITE</a>)", [rt.fv(f, "mob", rt.sv(f, "initiator"))])]);
	if (!isEqual(rt.sv(f, "state"), 1)) return f.dot;
	f.dot = rt.modify(live(f.dot), rt.callSrc(f, "ClosureLinks", [live(ref_src)]), add);
	return f.dot;
});

// /datum/admin_help/proc/ClosureLinks  (code/modules/admin/verbs/adminhelp.dm:231)
rt.def("/datum/admin_help/proc/ClosureLinks", function ClosureLinks(f: Frame, ref_src: Value) {
	f.vars = () => [ref_src];
	if (!truthy(live(ref_src))) {
		ref_src = fmt("＃", [live(f.src)]);
	}
	f.dot = fmt(" (<A HREF='?_src_=holder;ahelp=＀;ahelp_action=reject'>REJT</A>)", [live(ref_src)]);
	f.dot = rt.modify(live(f.dot), fmt(" (<A HREF='?_src_=holder;ahelp=＀;ahelp_action=icissue'>IC</A>)", [live(ref_src)]), add);
	f.dot = rt.modify(live(f.dot), fmt(" (<A HREF='?_src_=holder;ahelp=＀;ahelp_action=close'>CLOSE</A>)", [live(ref_src)]), add);
	f.dot = rt.modify(live(f.dot), fmt(" (<A HREF='?_src_=holder;ahelp=＀;ahelp_action=resolve'>RSLVE</A>)", [live(ref_src)]), add);
	return f.dot;
});

// /datum/admin_help/proc/LinkedReplyName  (code/modules/admin/verbs/adminhelp.dm:240)
rt.def("/datum/admin_help/proc/LinkedReplyName", function LinkedReplyName(f: Frame, ref_src: Value) {
	f.vars = () => [ref_src];
	if (!truthy(live(ref_src))) {
		ref_src = fmt("＃", [live(f.src)]);
	}
	return fmt("<A HREF='?_src_=holder;ahelp=＀;ahelp_action=reply'>＀</A>", [live(ref_src), rt.sv(f, "initiator_key_name")]);
	return f.dot;
});

// /datum/admin_help/proc/TicketHref  (code/modules/admin/verbs/adminhelp.dm:246)
rt.def("/datum/admin_help/proc/TicketHref", function TicketHref(f: Frame, msg: Value, ref_src: Value, action: Value) {
	f.vars = () => [ref_src, action];
	if (live(action) === null) {
		action = "ticket";
	}
	if (!truthy(live(ref_src))) {
		ref_src = fmt("＃", [live(f.src)]);
	}
	return fmt("<A HREF='?_src_=holder;ahelp=＀;ahelp_action=＀'>＀</A>", [live(ref_src), live(action), live(msg)]);
	return f.dot;
});

// /datum/admin_help/proc/MessageNoRecipient  (code/modules/admin/verbs/adminhelp.dm:253)
rt.def("/datum/admin_help/proc/MessageNoRecipient", function MessageNoRecipient(f: Frame, msg: Value) {
	let ref_src: Value = null, chat_msg: Value = null, X: Value = null;
	let $e: any;
	f.vars = () => [ref_src, chat_msg, X, $e];
	ref_src = fmt("＃", [live(f.src)]);
	chat_msg = fmt("<span class='adminnotice'><span class='adminhelp'>Ticket ＀</span><b>: ＀ ＀:</b> ＀</span>", [rt.callSrc(f, "TicketHref", [fmt("#＀", [rt.sv(f, "id")]), live(ref_src)]), rt.callSrc(f, "LinkedReplyName", [live(ref_src)]), rt.callSrc(f, "FullMonty", [live(ref_src)]), live(msg)]);
	rt.callSrc(f, "AddInteraction", [fmt("<font color='red'>＀: ＀</font>", [rt.callSrc(f, "LinkedReplyName", [live(ref_src)]), live(msg)])]);
	X = null;
	rt.forList(f, 0, rt.gl("admins"), T("/client"));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		if (truthy(rt.bitAnd(rt.gv(f, "toggles", rt.fv(f, "prefs", live(X))), 1))) {
			rt.op(f, "Output", [], [live(X), rt.rsc("sound/effects/adminhelp.ogg")], false);
		}
		rt.call(f, P("/proc/window_flash"), null, [null, live(X), "ignorepref", 1], rt.Args.Named);
		rt.call(f, P("/proc/to_chat"), null, [live(X), live(chat_msg)]);
	}
	rt.endFor(f, 0);
	rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "initiator"), fmt("<span class='adminnotice'>PM to-<b>Admins</b>: ＀</span>", [rt.sv(f, "name")])]);
	return f.dot;
});

// /datum/admin_help/proc/Reopen  (code/modules/admin/verbs/adminhelp.dm:270)  may sleep
rt.def("/datum/admin_help/proc/Reopen", function* Reopen(f: Frame) {
	let msg: Value = null;
	let $0: any;
	f.vars = () => [msg, $0];
	if (isEqual(rt.sv(f, "state"), 1)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>This ticket is already open.</span>"]);
		return live(f.dot);
	}
	if (truthy((yield* g.callName(f, rt.gl("ahelp_tickets"), "CKey2ActiveTicket", [rt.sv(f, "initiator_ckey")])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>This user already has an active ticket, cannot reopen this one.</span>"]);
		return live(f.dot);
	}
	rt.setSv(f, "statclick", (yield* g.new_(f, T("/obj/effect/statclick/ahelp"), [null, live(f.src)])));
	rt.modField(f, rt.gl("ahelp_tickets"), "active_tickets", live(f.src), add);
	(rt.modField(f, rt.gl("ahelp_tickets"), "closed_tickets", live(f.src), subtract));
	(rt.modField(f, rt.gl("ahelp_tickets"), "resolved_tickets", live(f.src), subtract));
	rt.setSv(f, "state", 1);
	rt.setSv(f, "closed_at", null);
	if (truthy(rt.sv(f, "initiator"))) {
		rt.setFv(f, "current_ticket", rt.sv(f, "initiator"), live(f.src));
	}
	yield* g.srcCall(f, "AddInteraction", fmt("<font color='purple'>Reopened by ＀</font>", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]))]));
	yield* g.call(f, P("/proc/message_admins"), null, [(msg = fmt("<span class='adminhelp'>Ticket ＀ reopened by ＀.</span>", [(yield* g.srcCall(f, "TicketHref", fmt("#＀", [rt.sv(f, "id")]))), (yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]))]))]);
	yield* g.call(f, P("/proc/log_admin_private"), null, [live(msg)]);
	yield* g.srcCall(f, "TicketPanel");
	return f.dot;
}, true);

// /datum/admin_help/proc/RemoveActive  (code/modules/admin/verbs/adminhelp.dm:301)  may sleep
rt.def("/datum/admin_help/proc/RemoveActive", function* RemoveActive(f: Frame) {
	if (!isEqual(rt.sv(f, "state"), 1)) {
		return live(f.dot);
	}
	rt.setSv(f, "closed_at", rt.worldTime(f));
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "statclick")]);
	rt.setSv(f, "statclick", null);
	(rt.modField(f, rt.gl("ahelp_tickets"), "active_tickets", live(f.src), subtract));
	if (!(truthy(rt.sv(f, "initiator")) && isEqual(rt.fv(f, "current_ticket", rt.sv(f, "initiator")), live(f.src)))) return f.dot;
	rt.setFv(f, "current_ticket", rt.sv(f, "initiator"), null);
	return f.dot;
}, true);

// /datum/admin_help/proc/Close  (code/modules/admin/verbs/adminhelp.dm:311)  may sleep
rt.def("/datum/admin_help/proc/Close", function* Close(f: Frame, key_name: Value, silent: Value) {
	let msg: Value = null;
	f.vars = () => [key_name, silent, msg];
	if (live(key_name) === null) {
		key_name = (yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]));
	}
	if (live(silent) === null) {
		silent = 0;
	}
	if (!isEqual(rt.sv(f, "state"), 1)) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "RemoveActive");
	rt.setSv(f, "state", 2);
	yield* g.callName(f, rt.gl("ahelp_tickets"), "ListInsert", [live(f.src)]);
	yield* g.srcCall(f, "AddInteraction", fmt("<font color='red'>Closed by ＀.</font>", [live(key_name)]));
	if (truthy(live(silent))) return f.dot;
	yield* g.call(f, P("/proc/message_admins"), null, [(msg = fmt("Ticket ＀ closed by ＀.", [(yield* g.srcCall(f, "TicketHref", fmt("#＀", [rt.sv(f, "id")]))), live(key_name)]))]);
	yield* g.call(f, P("/proc/log_admin_private"), null, [live(msg)]);
	return f.dot;
}, true);

// /datum/admin_help/proc/Resolve  (code/modules/admin/verbs/adminhelp.dm:325)  may sleep
rt.def("/datum/admin_help/proc/Resolve", function* Resolve(f: Frame, key_name: Value, silent: Value) {
	let msg: Value = null;
	f.vars = () => [key_name, silent, msg];
	if (live(key_name) === null) {
		key_name = (yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]));
	}
	if (live(silent) === null) {
		silent = 0;
	}
	if (!isEqual(rt.sv(f, "state"), 1)) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "RemoveActive");
	rt.setSv(f, "state", 3);
	yield* g.callName(f, rt.gl("ahelp_tickets"), "ListInsert", [live(f.src)]);
	if (truthy(rt.sv(f, "initiator"))) {
		yield* g.callName(f, rt.sv(f, "initiator"), "giveadminhelpverb", []);
	}
	yield* g.srcCall(f, "AddInteraction", fmt("<font color='green'>Resolved by ＀.</font>", [live(key_name)]));
	if (truthy(live(silent))) return f.dot;
	yield* g.call(f, P("/proc/message_admins"), null, [(msg = fmt("Ticket ＀ resolved by ＀", [(yield* g.srcCall(f, "TicketHref", fmt("#＀", [rt.sv(f, "id")]))), live(key_name)]))]);
	yield* g.call(f, P("/proc/log_admin_private"), null, [live(msg)]);
	return f.dot;
}, true);

// /datum/admin_help/proc/Reject  (code/modules/admin/verbs/adminhelp.dm:343)  may sleep
rt.def("/datum/admin_help/proc/Reject", function* Reject(f: Frame, key_name: Value) {
	let msg: Value = null;
	f.vars = () => [key_name, msg];
	if (live(key_name) === null) {
		key_name = (yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]));
	}
	if (!isEqual(rt.sv(f, "state"), 1)) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "initiator"))) {
		yield* g.callName(f, rt.sv(f, "initiator"), "giveadminhelpverb", []);
		rt.op(f, "OutputReference", [rt.R.srcVar("initiator")], [rt.rsc("sound/effects/adminhelp.ogg")], false);
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "initiator"), "<font color='red' size='4'><b>- AdminHelp Rejected! -</b></font>"]);
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "initiator"), "<font color='red'><b>Your admin help was rejected.</b> The adminhelp verb has been returned to you so that you may try again.</font>"]);
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "initiator"), "Please try to be calm, clear, and descriptive in admin helps, do not assume the admin has seen any related events, and clearly state the names of anybody you are reporting."]);
	}
	yield* g.call(f, P("/proc/message_admins"), null, [(msg = fmt("Ticket ＀ rejected by ＀", [(yield* g.srcCall(f, "TicketHref", fmt("#＀", [rt.sv(f, "id")]))), live(key_name)]))]);
	yield* g.call(f, P("/proc/log_admin_private"), null, [live(msg)]);
	yield* g.srcCall(f, "AddInteraction", fmt("Rejected by ＀.", [live(key_name)]));
	yield* g.callSrc(f, "Close", ["silent", 1], rt.Args.Named);
	return f.dot;
}, true);

// /datum/admin_help/proc/ICIssue  (code/modules/admin/verbs/adminhelp.dm:364)  may sleep
rt.def("/datum/admin_help/proc/ICIssue", function* ICIssue(f: Frame, key_name: Value) {
	let msg: Value = null;
	f.vars = () => [key_name, msg];
	if (live(key_name) === null) {
		key_name = (yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]));
	}
	if (!isEqual(rt.sv(f, "state"), 1)) {
		return live(f.dot);
	}
	msg = "<font color='red' size='4'><b>- AdminHelp marked as IC issue! -</b></font><br>";
	msg = rt.modify(live(msg), "<font color='red'><b>Losing is part of the game!</b></font><br>", add);
	msg = rt.modify(live(msg), "<font color='red'>Your character will frequently die, sometimes without even a possibility of avoiding it. Events will often be out of your control. No matter how good or prepared you are, sometimes you just lose.</font>", add);
	if (truthy(rt.sv(f, "initiator"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "initiator"), live(msg)]);
	}
	yield* g.call(f, P("/proc/message_admins"), null, [(msg = fmt("Ticket ＀ marked as IC by ＀", [(yield* g.srcCall(f, "TicketHref", fmt("#＀", [rt.sv(f, "id")]))), live(key_name)]))]);
	yield* g.call(f, P("/proc/log_admin_private"), null, [live(msg)]);
	yield* g.srcCall(f, "AddInteraction", fmt("Marked as IC issue by ＀", [live(key_name)]));
	yield* g.callSrc(f, "Resolve", ["silent", 1], rt.Args.Named);
	return f.dot;
}, true);

// /datum/admin_help/proc/TicketPanel  (code/modules/admin/verbs/adminhelp.dm:383)
rt.def("/datum/admin_help/proc/TicketPanel", function TicketPanel(f: Frame) {
	let dat: Value = null, ref_src: Value = null, I: Value = null;
	let $0: any, $e: any;
	f.vars = () => [dat, ref_src, I, $0, $e];
	dat = rt.list(fmt("<html><head><title>Ticket #＀</title></head>", [rt.sv(f, "id")]));
	ref_src = fmt("＃", [live(f.src)]);
	dat = rt.modify(live(dat), fmt("<h4>Admin Help Ticket #＀: ＀</h4>", [rt.sv(f, "id"), rt.callSrc(f, "LinkedReplyName", [live(ref_src)])]), add);
	dat = rt.modify(live(dat), "<b>State: ", add);
	$0 = rt.sv(f, "state");
	if ($0 === 1) {
		dat = rt.modify(live(dat), "<font color='red'>OPEN</font>", add);
	} else if ($0 === 3) {
		dat = rt.modify(live(dat), "<font color='green'>RESOLVED</font>", add);
	} else if ($0 === 2) {
		dat = rt.modify(live(dat), "CLOSED", add);
	} else {
		dat = rt.modify(live(dat), "UNKNOWN", add);
	}
	dat = rt.modify(live(dat), fmt("</b>＀＀＀＀", [rt.gl("TAB"), rt.callSrc(f, "TicketHref", ["Refresh", live(ref_src)]), rt.gl("TAB"), rt.callSrc(f, "TicketHref", ["Re-Title", live(ref_src), "retitle"])]), add);
	if (!isEqual(rt.sv(f, "state"), 1)) {
		dat = rt.modify(live(dat), fmt("＀＀", [rt.gl("TAB"), rt.callSrc(f, "TicketHref", ["Reopen", live(ref_src), "reopen"])]), add);
	}
	dat = rt.modify(live(dat), fmt("<br><br>Opened at: ＀ (Approx ＀ minutes ago)", [rt.call(f, P("/proc/gameTimestamp"), null, ["wtime", rt.sv(f, "opened_at")], rt.Args.Named), divide(subtract(rt.worldTime(f), rt.sv(f, "opened_at")), 600)]), add);
	if (truthy(rt.sv(f, "closed_at"))) {
		dat = rt.modify(live(dat), fmt("<br>Closed at: ＀ (Approx ＀ minutes ago)", [rt.call(f, P("/proc/gameTimestamp"), null, ["wtime", rt.sv(f, "closed_at")], rt.Args.Named), divide(subtract(rt.worldTime(f), rt.sv(f, "closed_at")), 600)]), add);
	}
	dat = rt.modify(live(dat), "<br><br>", add);
	if (truthy(rt.sv(f, "initiator"))) {
		dat = rt.modify(live(dat), fmt("<b>Actions:</b> ＀<br>", [rt.callSrc(f, "FullMonty", [live(ref_src)])]), add);
	} else {
		dat = rt.modify(live(dat), fmt("<b>DISCONNECTED</b>＀＀<br>", [rt.gl("TAB"), rt.callSrc(f, "ClosureLinks", [live(ref_src)])]), add);
	}
	dat = rt.modify(live(dat), "<br><b>Log:</b><br><br>", add);
	I = null;
	rt.forList(f, 0, rt.sv(f, "_interactions"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		dat = rt.modify(live(dat), fmt("＀<br>", [live(I)]), add);
	}
	rt.endFor(f, 0);
	rt.op(f, "Browse", [], [live(f.usr), rt.callName(f, live(dat), "Join", []), fmt("window=ahelp＀;size=620x480", [rt.sv(f, "id")])], false);
	return f.dot;
});

// /datum/admin_help/proc/Retitle  (code/modules/admin/verbs/adminhelp.dm:414)  may sleep
rt.def("/datum/admin_help/proc/Retitle", function* Retitle(f: Frame) {
	let new_title: Value = null, msg: Value = null;
	f.vars = () => [new_title, msg];
	if (truthy((new_title = (yield* g.op(f, "Prompt", [3], [rt.sv(f, "name"), "Rename Ticket", "Enter a title for the ticket", live(f.usr), null]))))) {
		rt.setSv(f, "name", live(new_title));
		yield* g.call(f, P("/proc/message_admins"), null, [(msg = fmt("Ticket ＀ titled ＀ by ＀", [(yield* g.srcCall(f, "TicketHref", fmt("#＀", [rt.sv(f, "id")]))), rt.sv(f, "name"), (yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]))]))]);
		yield* g.call(f, P("/proc/log_admin_private"), null, [live(msg)]);
	}
	yield* g.srcCall(f, "TicketPanel");
	return f.dot;
}, true);

// /datum/admin_help/proc/Action  (code/modules/admin/verbs/adminhelp.dm:426)  may sleep
rt.def("/datum/admin_help/proc/Action", function* Action(f: Frame, action: Value) {
	let $0: any;
	f.vars = () => [action, $0];
	$0 = live(action);
	if ($0 === "ticket") {
		yield* g.srcCall(f, "TicketPanel");
	} else if ($0 === "retitle") {
		yield* g.srcCall(f, "Retitle");
	} else if ($0 === "reject") {
		yield* g.srcCall(f, "Reject");
	} else if ($0 === "reply") {
		yield* g.callName(f, rt.fv(f, "client", live(f.usr)), "cmd_ahelp_reply", [rt.sv(f, "initiator")]);
	} else if ($0 === "icissue") {
		yield* g.srcCall(f, "ICIssue");
	} else if ($0 === "close") {
		yield* g.srcCall(f, "Close");
	} else if ($0 === "resolve") {
		yield* g.srcCall(f, "Resolve");
	} else if ($0 === "reopen") {
		yield* g.srcCall(f, "Reopen");
	}
	return f.dot;
}, true);

rt.type(11215, "/obj/effect/statclick/ahelp", "/obj/effect/statclick", {
	ahelp_datum: null,
});

// /obj/effect/statclick/ahelp/proc/Initialize  (code/modules/admin/verbs/adminhelp.dm:452)
rt.def("/obj/effect/statclick/ahelp/proc/Initialize", function Initialize(f: Frame) {
	rt.setSv(f, "ahelp_datum", live(f.args[1]));
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["mapload", "AH"] });

// /obj/effect/statclick/ahelp/proc/update  (code/modules/admin/verbs/adminhelp.dm:456)
rt.def("/obj/effect/statclick/ahelp/proc/update", function update(f: Frame) {
	return rt.callSuper(f, [rt.fv(f, "name", rt.sv(f, "ahelp_datum"))]);
});

// /obj/effect/statclick/ahelp/proc/Click  (code/modules/admin/verbs/adminhelp.dm:459)
rt.def("/obj/effect/statclick/ahelp/proc/Click", function Click(f: Frame) {
	rt.callName(f, rt.sv(f, "ahelp_datum"), "TicketPanel", []);
	return f.dot;
});

// /obj/effect/statclick/ahelp/proc/Destroy  (code/modules/admin/verbs/adminhelp.dm:463)  may sleep
rt.def("/obj/effect/statclick/ahelp/proc/Destroy", function* Destroy(f: Frame) {
	rt.setSv(f, "ahelp_datum", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /client/proc/giveadminhelpverb  (code/modules/admin/verbs/adminhelp.dm:470)  may sleep
rt.def("/client/proc/giveadminhelpverb", function* giveadminhelpverb(f: Frame) {
	(rt.modField(f, live(f.src), "verbs", P("/client/verb/adminhelp"), rt.bitOr));
	yield* g.call(f, P("/proc/deltimer"), null, [rt.sv(f, "adminhelptimerid")]);
	rt.setSv(f, "adminhelptimerid", 0);
	return f.dot;
}, true);

// /client/verb/adminhelp  (code/modules/admin/verbs/adminhelp.dm:479)  may sleep
rt.def("/client/verb/adminhelp", function* adminhelp(f: Frame, msg: Value) {
	f.vars = () => [msg];
	if (truthy(rt.gl("say_disabled"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='danger'>Speech is currently admin-disabled.</span>"]);
		return live(f.dot);
	}
	if (truthy(rt.bitAnd(rt.fv(f, "muted", rt.sv(f, "prefs")), 8))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'>Error: Admin-PM: You cannot send adminhelps (Muted).</span>"]);
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "handle_spam_prevention", live(msg), 8)))) {
		return live(f.dot);
	}
	if (!truthy(live(msg))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "current_ticket"))) {
		if (!isEqual((yield* g.call(f, P("/proc/alert"), null, [live(f.usr), "You already have a ticket open. Is this for the same issue?", null, "Yes", "No"])), "No")) {
			if (truthy(rt.sv(f, "current_ticket"))) {
				yield* g.callName(f, rt.sv(f, "current_ticket"), "MessageNoRecipient", [live(msg)]);
				yield* g.callName(f, rt.sv(f, "current_ticket"), "TimeoutVerb", []);
				return live(f.dot);
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>Ticket not found, creating new one...</span>"]);
			}
		} else {
			yield* g.callName(f, rt.sv(f, "current_ticket"), "AddInteraction", [fmt("＀ opened a new ticket.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]))])]);
			yield* g.callName(f, rt.sv(f, "current_ticket"), "Close", []);
		}
	}
	yield* g.new_(f, T("/datum/admin_help"), [live(msg), live(f.src), 0]);
	return f.dot;
}, true, { verb: { name: "Adminhelp", category: "Admin" }, argTypes: [{ type: 2 }] });

// /client/proc/cmd_admin_ticket_panel  (code/modules/admin/verbs/adminhelp.dm:512)  may sleep
rt.def("/client/proc/cmd_admin_ticket_panel", function* cmd_admin_ticket_panel(f: Frame) {
	let browse_to: Value = null;
	let $0: any;
	f.vars = () => [browse_to, $0];
	if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [2, 1])))) {
		return live(f.dot);
	}
	browse_to = null;
	$0 = (yield* g.op(f, "Prompt", [1], [null, null, null, "Display which ticket list?", rt.list("Active Tickets", "Closed Tickets", "Resolved Tickets")]));
	if ($0 === "Active Tickets") {
		browse_to = 1;
	} else if ($0 === "Closed Tickets") {
		browse_to = 2;
	} else if ($0 === "Resolved Tickets") {
		browse_to = 3;
	} else {
		return live(f.dot);
	}
	yield* g.callName(f, rt.gl("ahelp_tickets"), "BrowseTickets", [live(browse_to)]);
	return f.dot;
}, true, { verb: { name: "Show Ticket List", category: "Admin" } });

// /proc/admin_ticket_log  (code/modules/admin/verbs/adminhelp.dm:537)
rt.def("/proc/admin_ticket_log", function admin_ticket_log(f: Frame, what: Value, message: Value) {
	let C: Value = null, Mob: Value = null, AH: Value = null;
	f.vars = () => [C, Mob, AH];
	C = null;
	if (truthy((rt.istype((Mob = live(what)), T("/mob")) ? 1 : 0))) {
		C = rt.fv(f, "client", live(Mob));
	} else {
		C = live(what);
	}
	if ((truthy((rt.istype(live(C), T("/client")) ? 1 : 0)) && truthy(rt.fv(f, "current_ticket", live(C))))) {
		rt.callName(f, rt.fv(f, "current_ticket", live(C)), "AddInteraction", [live(message)]);
		return rt.fv(f, "current_ticket", live(C));
	}
	if (!truthy(rt.call(f, P("/proc/istext"), null, [live(what)]))) return f.dot;
	if (!truthy((AH = rt.callName(f, rt.gl("ahelp_tickets"), "CKey2ActiveTicket", [live(what)])))) return f.dot;
	rt.callName(f, live(AH), "AddInteraction", [live(message)]);
	return live(AH);
});

// /proc/get_admin_counts  (code/modules/admin/verbs/adminhelp.dm:556)
rt.def("/proc/get_admin_counts", function get_admin_counts(f: Frame, requiredflags: Value) {
	let X: Value = null;
	let $e: any;
	f.vars = () => [requiredflags, X, $e];
	if (live(requiredflags) === null) {
		requiredflags = 4;
	}
	f.dot = rt.alist(f, ["total", rt.list(), "noflags", rt.list(), "afk", rt.list(), "stealth", rt.list(), "present", rt.list()]);
	X = null;
	rt.forList(f, 0, rt.gl("admins"), T("/client"));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		rt.modAt(live(f.dot), "total", live(X), add);
		if ((!isEqual(live(requiredflags), 0) && !truthy(rt.call(f, P("/proc/check_rights_for"), null, [live(X), live(requiredflags)])))) {
			rt.modAt(live(f.dot), "noflags", live(X), add);
		} else {
			if (truthy(rt.callName(f, live(X), "is_afk", []))) {
				rt.modAt(live(f.dot), "afk", live(X), add);
			} else {
				if (truthy(rt.gv(f, "fakekey", rt.fv(f, "holder", live(X))))) {
					rt.modAt(live(f.dot), "stealth", live(X), add);
				} else {
					rt.modAt(live(f.dot), "present", live(X), add);
				}
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /proc/keywords_lookup  (code/modules/admin/verbs/adminhelp.dm:625)
rt.def("/proc/keywords_lookup", function keywords_lookup(f: Frame, msg: Value) {
	let adminhelp_ignored_words: Value = null, msglist: Value = null, surnames: Value = null, forenames: Value = null, ckeys: Value = null, founds: Value = null, M: Value = null, indexing: Value = null, string: Value = null, L: Value = null, surname_found: Value = null, i: Value = null, word: Value = null, ai_found: Value = null, mobs_found: Value = null, original_word: Value = null, word_9: Value = null, found: Value = null, is_antag: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $e: any;
	f.vars = () => [msg, adminhelp_ignored_words, msglist, surnames, forenames, ckeys, founds, M, indexing, string, L, surname_found, i, word, ai_found, mobs_found, original_word, word_9, found, is_antag, $0, $1, $2, $3, $e];
	adminhelp_ignored_words = rt.list("unknown", "the", "a", "an", "of", "monkey", "alien", "as", "i");
	msglist = rt.call(f, P("/proc/splittext"), null, [live(msg), " "]);
	surnames = rt.list();
	forenames = rt.list();
	ckeys = rt.list();
	founds = "";
	M = null;
	rt.forList(f, 0, rt.gl("mob_list"), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		indexing = rt.list(rt.fv(f, "real_name", live(M)), rt.fv(f, "name", live(M)));
		if (truthy(rt.fv(f, "mind", live(M)))) {
			indexing = rt.modify(live(indexing), rt.gv(f, "name", rt.fv(f, "mind", live(M))), add);
		}
		string = null;
		rt.forList(f, 1, live(indexing));
		while (($e = rt.next(f, 1)) !== undefined) {
			string = $e;
			L = rt.call(f, P("/proc/splittext"), null, [live(string), " "]);
			surname_found = 0;
			i = null;
			i = rt.len(f, live(L));
			while (rt.ge(live(i), 1)) {
				if (truthy((word = rt.call(f, P("/proc/ckey"), null, [rt.index(live(L), live(i))])))) {
					rt.setAt(live(surnames), live(word), live(M));
					surname_found = live(i);
					break;
				}
				i = rt.inc(live(i), -1);
			}
			i = null;
			i = 1;
			while (rt.lt(live(i), live(surname_found))) {
				if (truthy((word = rt.call(f, P("/proc/ckey"), null, [rt.index(live(L), live(i))])))) {
					rt.setAt(live(forenames), live(word), live(M));
				}
				i = rt.inc(live(i), 1);
			}
			rt.setAt(live(ckeys), rt.fv(f, "ckey", live(M)), live(M));
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	ai_found = 0;
	msg = "";
	mobs_found = rt.list();
	original_word = null;
	rt.forList(f, 0, live(msglist));
	while (($e = rt.next(f, 0)) !== undefined) {
		original_word = $e;
		if (truthy((word_9 = rt.call(f, P("/proc/ckey"), null, [live(original_word)])))) {
			if (!truthy((rt.isIn(f, live(word_9), live(adminhelp_ignored_words)) ? 1 : 0))) {
				if (isEqual(live(word_9), "ai")) {
					ai_found = 1;
				} else {
					if (!truthy((found = rt.index(live(ckeys), live(word_9))))) {
						if (!truthy((found = rt.index(live(surnames), live(word_9))))) {
							found = rt.index(live(forenames), live(word_9));
						}
					}
					if (truthy(live(found))) {
						if (!truthy((rt.isIn(f, live(found), live(mobs_found)) ? 1 : 0))) {
							mobs_found = rt.modify(live(mobs_found), live(found), add);
							if ((!truthy(live(ai_found)) && truthy((rt.istype(live(found), T("/mob/living/silicon/ai")) ? 1 : 0)))) {
								ai_found = 1;
							}
							is_antag = 0;
							if ((truthy(rt.fv(f, "mind", live(found))) && truthy(rt.gv(f, "special_role", rt.fv(f, "mind", live(found)))))) {
								is_antag = 1;
							}
							$0 = rt.fv(f, "name", live(found));
							$1 = rt.fv(f, "real_name", live(found));
							$2 = rt.fv(f, "ckey", live(found));
							if (truthy(live(is_antag))) {
								$2 = $2;
								$3 = "(Antag)";
							} else {
								$3 = null;
							}
							founds = rt.modify(live(founds), fmt("Name: ＀(＀) Ckey: ＀ ＀ ", [$0, $1, $2, $3]), add);
							$0 = live(original_word);
							if (truthy(live(is_antag))) {
								$1 = "red";
							} else {
								$1 = "black";
							}
							msg = rt.modify(live(msg), fmt("＀<font size='1' color='＀'>(<A HREF='?_src_=holder;adminmoreinfo=＃'>?</A>|<A HREF='?_src_=holder;adminplayerobservefollow=＃'>F</A>)</font> ", [$0, $1, live(found), live(found)]), add);
							continue;
						}
					}
				}
			}
		}
		msg = rt.modify(live(msg), fmt("＀ ", [live(original_word)]), add);
	}
	rt.endFor(f, 0);
	return live(msg);
});
