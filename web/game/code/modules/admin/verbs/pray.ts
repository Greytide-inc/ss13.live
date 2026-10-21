// From code/modules/admin/verbs/pray.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/verb/pray  (code/modules/admin/verbs/pray.dm:6)
rt.def("/mob/verb/pray", function pray(f: Frame, msg: Value) {
	let cross: Value = null, font_color: Value = null, prayer_type: Value = null, deity: Value = null, C: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $e: any;
	f.vars = () => [msg, cross, font_color, prayer_type, deity, C, $0, $1, $2, $3, $e];
	if (truthy(rt.gl("say_disabled"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='danger'>Speech is currently admin-disabled.</span>"]);
		return live(f.dot);
	}
	if (!truthy((msg = rt.call(f, P("/proc/copytext"), null, [rt.call(f, P("/proc/sanitize"), null, [live(msg)]), 1, 1024])))) {
		return live(f.dot);
	}
	rt.call(f, P("/proc/log_prayer"), null, [fmt("＀/(＀): ＀", [rt.fv(f, "key", live(f.src)), rt.fv(f, "name", live(f.src)), live(msg)])]);
	if (truthy(rt.fv(f, "client", live(f.usr)))) {
		if (truthy(rt.bitAnd(rt.gv(f, "muted", rt.gv(f, "prefs", rt.fv(f, "client", live(f.usr)))), 4))) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='danger'>You cannot pray (muted).</span>"]);
			return live(f.dot);
		}
		if (truthy(rt.callName(f, rt.fv(f, "client", live(f.src)), "handle_spam_prevention", [live(msg), 4]))) {
			return live(f.dot);
		}
	}
	cross = rt.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/obj/storage.dmi"), "bible"]);
	font_color = "purple";
	prayer_type = "PRAYER";
	deity = null;
	if (isEqual(rt.fv(f, "job", live(f.usr)), "Chaplain")) {
		rt.setFv(f, "icon_state", live(cross), "kingyellow");
		font_color = "blue";
		prayer_type = "CHAPLAIN PRAYER";
		if (truthy(rt.fv(f, "deity", rt.gl("SSreligion")))) {
			deity = rt.fv(f, "deity", rt.gl("SSreligion"));
		}
	} else {
		if (truthy(rt.call(f, P("/proc/iscultist"), null, [live(f.usr)]))) {
			rt.setFv(f, "icon_state", live(cross), "tome");
			font_color = "red";
			prayer_type = "CULTIST PRAYER";
			deity = "Nar-Sie";
		}
	}
	$0 = rt.call(f, P("/proc/bicon"), null, [live(cross)]);
	$1 = live(font_color);
	$2 = live(prayer_type);
	if (truthy(live(deity))) {
		$3 = fmt(" (to ＀)", [live(deity)]);
	} else {
		$3 = "";
	}
	msg = fmt("<span class='adminnotice'>＀<b><font color=＀>＀＀: </font>＀ ＀:</b> ＀</span>", [$0, $1, $2, $3, fmt("＀ ＀", [rt.call(f, P("/proc/key_name_admin"), null, [live(f.src)]), fmt("＀ ＀ ＀ ＀ ＀ ＀ ＀ ＀", [fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [live(f.src)]), fmt("(<a href='?_src_=holder;adminplayeropts=＃'>PP</a>)", [live(f.src)]), fmt("(<a href='?_src_=vars;Vars=＃'>VV</a>)", [live(f.src)]), fmt("(<a href='?_src_=holder;subtlemessage=＃'>SM</a>)", [live(f.src)]), fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [live(f.src)]), fmt("(<a href='?_src_=holder;traitor=＃'>TP</a>)", [live(f.src)]), fmt("(<a href='?_src_=holder;individuallog=＃'>LOGS</a>)", [live(f.src)]), fmt("(<a href='?_src_=holder;adminsmite=＃'>SMITE</a>)", [live(f.src)])])]), fmt("(<a href='?_src_=holder;adminspawncookie=＃'>SC</a>)", [live(f.src)]), live(msg)]);
	C = null;
	rt.forList(f, 0, rt.gl("admins"), T("/client"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		if (truthy(rt.bitAnd(rt.gv(f, "chat_toggles", rt.fv(f, "prefs", live(C))), 16))) {
			rt.call(f, P("/proc/to_chat"), null, [live(C), live(msg)]);
			if (truthy(rt.bitAnd(rt.gv(f, "toggles", rt.fv(f, "prefs", live(C))), 512))) {
				if (isEqual(rt.fv(f, "job", live(f.usr)), "Chaplain")) {
					rt.op(f, "Output", [], [live(C), rt.rsc("sound/effects/pray.ogg")], false);
				}
			}
		}
	}
	rt.endFor(f, 0);
	rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "Your prayers have been received by the gods."]);
	return f.dot;
}, false, { verb: { name: "Pray", category: "IC" }, argTypes: [{ type: 2 }] });

// /proc/Centcomm_announce  (code/modules/admin/verbs/pray.dm:50)
rt.def("/proc/Centcomm_announce", function Centcomm_announce(f: Frame, text: Value, Sender: Value) {
	let msg: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [msg, C, $e];
	msg = rt.call(f, P("/proc/copytext"), null, [rt.call(f, P("/proc/sanitize"), null, [live(text)]), 1, 1024]);
	msg = fmt("<span class='adminnotice'><b><font color=orange>CENTCOM:</font>＀ ＀:</b> ＀</span>", [fmt("＀ ＀", [rt.call(f, P("/proc/key_name_admin"), null, [live(Sender)]), fmt("＀ ＀ ＀ ＀ ＀ ＀ ＀ ＀", [fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [live(Sender)]), fmt("(<a href='?_src_=holder;adminplayeropts=＃'>PP</a>)", [live(Sender)]), fmt("(<a href='?_src_=vars;Vars=＃'>VV</a>)", [live(Sender)]), fmt("(<a href='?_src_=holder;subtlemessage=＃'>SM</a>)", [live(Sender)]), fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [live(Sender)]), fmt("(<a href='?_src_=holder;traitor=＃'>TP</a>)", [live(Sender)]), fmt("(<a href='?_src_=holder;individuallog=＃'>LOGS</a>)", [live(Sender)]), fmt("(<a href='?_src_=holder;adminsmite=＃'>SMITE</a>)", [live(Sender)])])]), fmt("(<a href='?_src_=holder;CentcommReply=＃'>RPLY</a>)", [live(Sender)]), live(msg)]);
	rt.call(f, P("/proc/to_chat"), null, [rt.gl("admins"), live(msg)]);
	C = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/computer/communications"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		rt.callName(f, live(C), "overrideCooldown", []);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /proc/Syndicate_announce  (code/modules/admin/verbs/pray.dm:57)
rt.def("/proc/Syndicate_announce", function Syndicate_announce(f: Frame, text: Value, Sender: Value) {
	let msg: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [msg, C, $e];
	msg = rt.call(f, P("/proc/copytext"), null, [rt.call(f, P("/proc/sanitize"), null, [live(text)]), 1, 1024]);
	msg = fmt("<span class='adminnotice'><b><font color=crimson>SYNDICATE:</font>＀ ＀:</b> ＀</span>", [fmt("＀ ＀", [rt.call(f, P("/proc/key_name_admin"), null, [live(Sender)]), fmt("＀ ＀ ＀ ＀ ＀ ＀ ＀ ＀", [fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [live(Sender)]), fmt("(<a href='?_src_=holder;adminplayeropts=＃'>PP</a>)", [live(Sender)]), fmt("(<a href='?_src_=vars;Vars=＃'>VV</a>)", [live(Sender)]), fmt("(<a href='?_src_=holder;subtlemessage=＃'>SM</a>)", [live(Sender)]), fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [live(Sender)]), fmt("(<a href='?_src_=holder;traitor=＃'>TP</a>)", [live(Sender)]), fmt("(<a href='?_src_=holder;individuallog=＃'>LOGS</a>)", [live(Sender)]), fmt("(<a href='?_src_=holder;adminsmite=＃'>SMITE</a>)", [live(Sender)])])]), fmt("(<a href='?_src_=holder;SyndicateReply=＃'>RPLY</a>)", [live(Sender)]), live(msg)]);
	rt.call(f, P("/proc/to_chat"), null, [rt.gl("admins"), live(msg)]);
	C = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/computer/communications"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		rt.callName(f, live(C), "overrideCooldown", []);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /proc/Nuke_request  (code/modules/admin/verbs/pray.dm:64)
rt.def("/proc/Nuke_request", function Nuke_request(f: Frame, text: Value, Sender: Value) {
	let msg: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [msg, C, $e];
	msg = rt.call(f, P("/proc/copytext"), null, [rt.call(f, P("/proc/sanitize"), null, [live(text)]), 1, 1024]);
	msg = fmt("<span class='adminnotice'><b><font color=orange>NUKE CODE REQUEST:</font>＀ ＀ ＀:</b> ＀</span>", [fmt("＀ ＀", [rt.call(f, P("/proc/key_name_admin"), null, [live(Sender)]), fmt("＀ ＀ ＀ ＀ ＀ ＀ ＀ ＀", [fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [live(Sender)]), fmt("(<a href='?_src_=holder;adminplayeropts=＃'>PP</a>)", [live(Sender)]), fmt("(<a href='?_src_=vars;Vars=＃'>VV</a>)", [live(Sender)]), fmt("(<a href='?_src_=holder;subtlemessage=＃'>SM</a>)", [live(Sender)]), fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [live(Sender)]), fmt("(<a href='?_src_=holder;traitor=＃'>TP</a>)", [live(Sender)]), fmt("(<a href='?_src_=holder;individuallog=＃'>LOGS</a>)", [live(Sender)]), fmt("(<a href='?_src_=holder;adminsmite=＃'>SMITE</a>)", [live(Sender)])])]), fmt("(<a href='?_src_=holder;CentcommReply=＃'>RPLY</a>)", [live(Sender)]), "(<a href='?_src_=holder;set_selfdestruct_code=1'>SETCODE</a>)", live(msg)]);
	rt.call(f, P("/proc/to_chat"), null, [rt.gl("admins"), live(msg)]);
	C = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/computer/communications"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		rt.callName(f, live(C), "overrideCooldown", []);
	}
	rt.endFor(f, 0);
	return f.dot;
});
