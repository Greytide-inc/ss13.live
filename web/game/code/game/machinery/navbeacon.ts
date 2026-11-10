// Based on /tg/station's code/game/machinery/navbeacon.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, add, subtract, fmt } = rt;


rt.type(10807, "/obj/machinery/navbeacon", "/obj/machinery", {
	open: 0,
	locked: 1,
	freq: 1445,
	location: "",
	codes: null,
	codes_txt: "",
	level: 1,
	anchored: 1,
	icon: rt.rsc("icons/obj/objects.dmi"),
	icon_state: "navbeacon0-f",
	name: "navigation beacon",
	desc: "A radio beacon used for bot navigation.",
	layer: 2.5,
	obj_integrity: 500,
	max_integrity: 500,
	armor: null,
	req_access: null,
});

// navbeacon.dm:15
rt.def("/obj/machinery/navbeacon/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 70, "bullet", 70, "laser", 70, "energy", 70, "bomb", 0, "bio", 0, "rad", 0, "fire", 80, "acid", 80]);
	this.req_access = list(10, 29);
	return f.dot;
});

// navbeacon.dm:27
rt.def("/obj/machinery/navbeacon/proc/New", function* New(f: Frame) {
	let _T: Value = null;
	yield* parent_proc();
	this.set_codes();
	yield* this.hide((_T = this.loc).intact);
	if (rt.at(this.codes, "patrol")) {
		if (!rt.index(GLOB.navbeacons, `${this.z}`)) {
			rt.setAt(GLOB.navbeacons, `${this.z}`, list());
		}
		rt.modAt(GLOB.navbeacons, `${this.z}`, this, add);
	}
	if (!rt.at(this.codes, "delivery")) return f.dot;
	GLOB.deliverybeacons += this;
	GLOB.deliverybeacontags += this.location;
	return f.dot;
}, true);

// navbeacon.dm:42
rt.def("/obj/machinery/navbeacon/proc/Destroy", function* Destroy(f: Frame) {
	(rt.modAt(GLOB.navbeacons, `${this.z}`, this, subtract));
	GLOB.deliverybeacons -= this;
	return (yield* parent_proc());
}, true);

// navbeacon.dm:48
rt.def("/obj/machinery/navbeacon/proc/set_codes", function set_codes(f: Frame) {
	let e: Value = null, index: Value = null, key: Value = null, val: Value = null;
	if (!this.codes_txt) {
		return f.dot;
	}
	this.codes = new_(T("/list"));
	let entries: Value = splittext(this.codes_txt, ";");
	for (e of each(entries)) {
		if (index = findtext(e, "=")) {
			key = copytext(e, 1, index);
			val = copytext(e, index + 1);
			rt.setAt(this.codes, key, val);
		} else {
			rt.setAt(this.codes, e, "1");
		}
	}
	return f.dot;
});

// navbeacon.dm:68
rt.def("/obj/machinery/navbeacon/proc/hide", function hide(f: Frame, intact: Value) {
	this.invisibility = intact ? INVISIBILITY_MAXIMUM : 0;
	this.updateicon();
	return f.dot;
});

// navbeacon.dm:73
rt.def("/obj/machinery/navbeacon/proc/updateicon", function updateicon(f: Frame) {
	let state: Value = `navbeacon${this.open}`;
	if (this.invisibility) {
		this.icon_state = `${state}-f`;
	} else {
		this.icon_state = `${state}`;
	}
	return f.dot;
});

// navbeacon.dm:82
rt.def("/obj/machinery/navbeacon/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let _T: Value = null;
	let $0: any, $1: any, $2: any;
	if ((_T = this.loc).intact) {
		return f.dot;
	}
	if (rt.istype(I, T("/obj/item/weapon/screwdriver"))) {
		this.open = (!this.open ? 1 : 0);
		$0 = user;
		$1 = user;
		if (this.open) {

			$2 = "opens";
		} else {
			$2 = "closes";
		}
		$1 = `${$1} ${$2} the beacon's cover.`;
		$0.visible_message($1, `<span class='notice'>You ${this.open ? "open" : "close"} the beacon's cover.</span>`);
		this.updateicon();
	} else if (rt.istype(I, T("/obj/item/weapon/card/id")) || rt.istype(I, T("/obj/item/device/pda"))) {
		if (this.open) {
			if (yield* this.allowed(user)) {
				this.locked = (!this.locked ? 1 : 0);
				to_chat(user, `<span class='notice'>Controls are now ${this.locked ? "locked" : "unlocked"}.</span>`);
			} else {
				to_chat(user, "<span class='danger'>Access denied.</span>");
			}
			yield* this.updateDialog();
		} else {
			to_chat(user, "<span class='warning'>You must open the cover first!</span>");
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// navbeacon.dm:107
rt.def("/obj/machinery/navbeacon/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	yield* this.interact(user, 1);
	return f.dot;
}, true);

// navbeacon.dm:113
rt.def("/obj/machinery/navbeacon/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	yield* this.interact(user, 0);
	return f.dot;
}, true);

// navbeacon.dm:116
rt.def("/obj/machinery/navbeacon/proc/interact", function* interact(f: Frame, user: Value, ai: Value) {
	let _T: Value = null, t: Value = null, key: Value = null, popup: Value = null;
	let $0: any, $1: any, $e: any;
	ai ??= 0;
	if ((_T = this.loc).intact) {
		return f.dot;
	}
	if (!this.open && !ai) {
		to_chat(user, "<span class='warning'>The beacon's control cover is closed!</span>");
		return f.dot;
	}
	if (this.locked && !ai) {
		if (this.location) {
			$0 = this.location;
		} else {
			$0 = "(none)";
		}
		t = `<TT><B>Navigation Beacon</B><HR><BR>\n<i>(swipe card to unlock controls)</i><BR>\nLocation: ${$0}</A><BR>\nTransponder Codes:<UL>`;
		for (key of each(this.codes)) {
			t += `<LI>${key} ... ${rt.index(this.codes, key)}`;
		}
		t += "<UL></TT>";
	} else {
		$0 = this;
		if (this.location) {
			$1 = this.location;
		} else {
			$1 = "None";
		}
		t = fmt("<TT><B>Navigation Beacon</B><HR><BR>\n<i>(swipe card to lock controls)</i><BR>\n\n<HR>\nLocation: <A href='byond://?src=＃;locedit=1'>＀</A><BR>\nTransponder Codes:<UL>", [$0, $1]);
		key = null;
		for (key of each(this.codes)) {
			t += `<LI>${key} ... ${rt.index(this.codes, key)}`;
			t += fmt("\t<A href='byond://?src=＃;edit=1;code=＀'>Edit</A>", [this, key]);
			t += fmt("\t<A href='byond://?src=＃;delete=1;code=＀'>Delete</A><BR>", [this, key]);
		}
		t += fmt("\t<A href='byond://?src=＃;add=1;'>Add New</A><BR>", [this]);
		t += "<UL></TT>";
	}
	(popup = (yield* new_(T("/datum/browser"), user, "navbeacon", "Navigation Beacon", 300, 400))).set_content(t);
	yield* popup.open();
	return f.dot;
}, true);

// navbeacon.dm:159
rt.def("/obj/machinery/navbeacon/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let newloc: Value = null, codekey: Value = null, newkey: Value = null, codeval: Value = null, newval: Value = null, newkey_0: Value = null, newval_1: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (!(this.open && !this.locked)) return f.dot;
	yield* f.usr.set_machine(this);
	if (rt.at(href_list, "locedit")) {
		if (newloc = copytext(sanitize((yield* g.op(f, "Prompt", [3], [null, this.location, "Navigation Beacon", "Enter New Location", null]))), 1, 1024)) {
			this.location = newloc;
			yield* this.updateDialog();
		}
	} else if (rt.at(href_list, "edit")) {
		codekey = rt.at(href_list, "code");
		if (!(newkey = (yield* stripped_input(f.usr, "Enter Transponder Code Key", "Navigation Beacon", codekey)))) {
			return f.dot;
		}
		codeval = rt.index(this.codes, codekey);
		if (!(newval = (yield* stripped_input(f.usr, "Enter Transponder Code Value", "Navigation Beacon", codeval)))) {
			newval = codekey;
			return f.dot;
		}
		yield* this.codes.Remove(codekey);
		rt.setAt(this.codes, newkey, newval);
		yield* this.updateDialog();
	} else if (rt.at(href_list, "delete")) {
		codekey = rt.at(href_list, "code");
		yield* this.codes.Remove(codekey);
		yield* this.updateDialog();
	} else {
		if (!rt.at(href_list, "add")) return f.dot;
		if (!(newkey_0 = (yield* stripped_input(f.usr, "Enter New Transponder Code Key", "Navigation Beacon")))) {
			return f.dot;
		}
		if (!(newval_1 = (yield* stripped_input(f.usr, "Enter New Transponder Code Value", "Navigation Beacon")))) {
			newval_1 = "1";
			return f.dot;
		}
		if (!this.codes) {
			this.codes = (yield* new_(T("/list")));
		}
		rt.setAt(this.codes, newkey_0, newval_1);
		yield* this.updateDialog();
	}
	return f.dot;
}, true);
