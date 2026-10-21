// From code/game/objects/items/devices/radio/headset.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9167, "/obj/item/device/radio/headset", "/obj/item/device/radio", {
	keyslot2: null,
	name: "radio headset",
	desc: "An updated, modular intercom that fits over the head. Takes encryption keys. \nTo speak on the general radio frequency, use ; before speaking.",
	icon_state: "headset",
	item_state: "headset",
	materials: null,
	subspace_transmission: 1,
	canhear_range: 0,
	slot_flags: 16,
	dog_fashion: null,
});

// /obj/item/device/radio/headset/proc/<init>  (code/game/objects/items/devices/radio/headset.dm:6)
rt.def("/obj/item/device/radio/headset/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 75]));
	return f.dot;
});

// /obj/item/device/radio/headset/proc/Initialize  (code/game/objects/items/devices/radio/headset.dm:15)  may sleep
rt.def("/obj/item/device/radio/headset/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "recalculateChannels");
	return f.dot;
}, true);

// /obj/item/device/radio/headset/proc/Destroy  (code/game/objects/items/devices/radio/headset.dm:19)  may sleep
rt.def("/obj/item/device/radio/headset/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "keyslot")]);
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "keyslot2")]);
	rt.setSv(f, "keyslot", null);
	rt.setSv(f, "keyslot2", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/device/radio/headset/proc/talk_into  (code/game/objects/items/devices/radio/headset.dm:26)  may sleep
rt.def("/obj/item/device/radio/headset/proc/talk_into", function* talk_into(f: Frame) {
	if (!truthy(rt.sv(f, "listening"))) {
		return 3;
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["M", "message", "channel", "spans", "language"] });

// /obj/item/device/radio/headset/proc/receive_range  (code/game/objects/items/devices/radio/headset.dm:31)
rt.def("/obj/item/device/radio/headset/proc/receive_range", function receive_range(f: Frame, freq: Value, level: Value, AIuser: Value) {
	let H: Value = null;
	f.vars = () => [H];
	if (truthy((rt.istype(rt.fv(f, "loc", live(f.src)), T("/mob/living/carbon/human")) ? 1 : 0))) {
		if (isEqual(rt.gv(f, "ears", (H = rt.fv(f, "loc", live(f.src)))), live(f.src))) {
			return rt.callSuper(f, [live(freq), live(level)]);
		}
	} else {
		if (truthy(live(AIuser))) {
			return rt.callSuper(f, [live(freq), live(level)]);
		}
	}
	return -1;
});

rt.type(9170, "/obj/item/device/radio/headset/syndicate/alt", "/obj/item/device/radio/headset/syndicate", {
	name: "syndicate headset",
	desc: "A syndicate headset that can be used to hear all radio frequencies. Protects ears from flashbangs. \nTo access the syndicate channel, use ; before speaking.",
	origin_tech: "syndicate=3",
	icon_state: "syndie_headset",
	item_state: "syndie_headset",
});

// /obj/item/device/radio/headset/syndicate/alt/proc/Initialize  (code/game/objects/items/devices/radio/headset.dm:50)  may sleep
rt.def("/obj/item/device/radio/headset/syndicate/alt/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(rt.fv(f, "secondary_flags", live(f.src)))) {
		rt.setFv(f, "secondary_flags", live(f.src), rt.list());
	}
	rt.setAt(rt.fv(f, "secondary_flags", live(f.src)), "bang_protect", 1);
	return f.dot;
}, true, { args: ["mapload"] });

rt.type(9169, "/obj/item/device/radio/headset/syndicate", "/obj/item/device/radio/headset", {
	origin_tech: "syndicate=3",
});

// /obj/item/device/radio/headset/syndicate/proc/Initialize  (code/game/objects/items/devices/radio/headset.dm:58)  may sleep
rt.def("/obj/item/device/radio/headset/syndicate/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "make_syndie");
	return f.dot;
}, true);

rt.type(9172, "/obj/item/device/radio/headset/binary", "/obj/item/device/radio/headset", {
	origin_tech: "syndicate=3",
});

// /obj/item/device/radio/headset/binary/proc/Initialize  (code/game/objects/items/devices/radio/headset.dm:64)  may sleep
rt.def("/obj/item/device/radio/headset/binary/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "keyslot")]);
	rt.setSv(f, "keyslot", (yield* g.new_(f, T("/obj/item/device/encryptionkey/binary"), [])));
	yield* g.srcCall(f, "recalculateChannels");
	return f.dot;
}, true);

rt.type(9173, "/obj/item/device/radio/headset/headset_sec", "/obj/item/device/radio/headset", {
	name: "security radio headset",
	desc: "This is used by your elite security force. \nTo access the security channel, use :s.",
	icon_state: "sec_headset",
	keyslot: null,
});

// /obj/item/device/radio/headset/headset_sec/proc/<init>  (code/game/objects/items/devices/radio/headset.dm:73)  may sleep
rt.def("/obj/item/device/radio/headset/headset_sec/proc/<init>", function* _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = (yield* g.callSuper(f, []));
	rt.setSv(f, "keyslot", (yield* g.new_(f, T("/obj/item/device/encryptionkey/headset_sec"), [])));
	return f.dot;
}, true);

rt.type(9174, "/obj/item/device/radio/headset/headset_sec/alt", "/obj/item/device/radio/headset/headset_sec", {
	name: "security bowman headset",
	desc: "This is used by your elite security force. Protects ears from flashbangs. \nTo access the security channel, use :s.",
	icon_state: "sec_headset_alt",
	item_state: "sec_headset_alt",
});

// /obj/item/device/radio/headset/headset_sec/alt/proc/Initialize  (code/game/objects/items/devices/radio/headset.dm:82)  may sleep
rt.def("/obj/item/device/radio/headset/headset_sec/alt/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(rt.fv(f, "secondary_flags", live(f.src)))) {
		rt.setFv(f, "secondary_flags", live(f.src), rt.list());
	}
	rt.setAt(rt.fv(f, "secondary_flags", live(f.src)), "bang_protect", 1);
	return f.dot;
}, true, { args: ["mapload"] });

rt.type(9180, "/obj/item/device/radio/headset/headset_eng", "/obj/item/device/radio/headset", {
	name: "engineering radio headset",
	desc: "When the engineers wish to chat like girls. \nTo access the engineering channel, use :e. ",
	icon_state: "eng_headset",
	keyslot: null,
});

// /obj/item/device/radio/headset/headset_eng/proc/<init>  (code/game/objects/items/devices/radio/headset.dm:89)  may sleep
rt.def("/obj/item/device/radio/headset/headset_eng/proc/<init>", function* _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = (yield* g.callSuper(f, []));
	rt.setSv(f, "keyslot", (yield* g.new_(f, T("/obj/item/device/encryptionkey/headset_eng"), [])));
	return f.dot;
}, true);

rt.type(9181, "/obj/item/device/radio/headset/headset_rob", "/obj/item/device/radio/headset", {
	name: "robotics radio headset",
	desc: "Made specifically for the roboticists, who cannot decide between departments. \nTo access the engineering channel, use :e. For research, use :n.",
	icon_state: "rob_headset",
	keyslot: null,
});

// /obj/item/device/radio/headset/headset_rob/proc/<init>  (code/game/objects/items/devices/radio/headset.dm:95)  may sleep
rt.def("/obj/item/device/radio/headset/headset_rob/proc/<init>", function* _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = (yield* g.callSuper(f, []));
	rt.setSv(f, "keyslot", (yield* g.new_(f, T("/obj/item/device/encryptionkey/headset_rob"), [])));
	return f.dot;
}, true);

rt.type(9182, "/obj/item/device/radio/headset/headset_med", "/obj/item/device/radio/headset", {
	name: "medical radio headset",
	desc: "A headset for the trained staff of the medbay. \nTo access the medical channel, use :m.",
	icon_state: "med_headset",
	keyslot: null,
});

// /obj/item/device/radio/headset/headset_med/proc/<init>  (code/game/objects/items/devices/radio/headset.dm:101)  may sleep
rt.def("/obj/item/device/radio/headset/headset_med/proc/<init>", function* _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = (yield* g.callSuper(f, []));
	rt.setSv(f, "keyslot", (yield* g.new_(f, T("/obj/item/device/encryptionkey/headset_med"), [])));
	return f.dot;
}, true);

rt.type(9183, "/obj/item/device/radio/headset/headset_sci", "/obj/item/device/radio/headset", {
	name: "science radio headset",
	desc: "A sciency headset. Like usual. \nTo access the science channel, use :n.",
	icon_state: "sci_headset",
	keyslot: null,
});

// /obj/item/device/radio/headset/headset_sci/proc/<init>  (code/game/objects/items/devices/radio/headset.dm:107)  may sleep
rt.def("/obj/item/device/radio/headset/headset_sci/proc/<init>", function* _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = (yield* g.callSuper(f, []));
	rt.setSv(f, "keyslot", (yield* g.new_(f, T("/obj/item/device/encryptionkey/headset_sci"), [])));
	return f.dot;
}, true);

rt.type(9184, "/obj/item/device/radio/headset/headset_medsci", "/obj/item/device/radio/headset", {
	name: "medical research radio headset",
	desc: "A headset that is a result of the mating between medical and science. \nTo access the medical channel, use :m. For science, use :n.",
	icon_state: "medsci_headset",
	keyslot: null,
});

// /obj/item/device/radio/headset/headset_medsci/proc/<init>  (code/game/objects/items/devices/radio/headset.dm:113)  may sleep
rt.def("/obj/item/device/radio/headset/headset_medsci/proc/<init>", function* _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = (yield* g.callSuper(f, []));
	rt.setSv(f, "keyslot", (yield* g.new_(f, T("/obj/item/device/encryptionkey/headset_medsci"), [])));
	return f.dot;
}, true);

rt.type(9185, "/obj/item/device/radio/headset/headset_com", "/obj/item/device/radio/headset", {
	name: "command radio headset",
	desc: "A headset with a commanding channel. \nTo access the command channel, use :c.",
	icon_state: "com_headset",
	keyslot: null,
});

// /obj/item/device/radio/headset/headset_com/proc/<init>  (code/game/objects/items/devices/radio/headset.dm:119)  may sleep
rt.def("/obj/item/device/radio/headset/headset_com/proc/<init>", function* _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = (yield* g.callSuper(f, []));
	rt.setSv(f, "keyslot", (yield* g.new_(f, T("/obj/item/device/encryptionkey/headset_com"), [])));
	return f.dot;
}, true);

rt.type(9187, "/obj/item/device/radio/headset/heads/captain", "/obj/item/device/radio/headset/heads", {
	name: "０the captain's headset",
	desc: "The headset of the king. \nChannels are as follows: :c - command, :s - security, :e - engineering, :u - supply, :v - service, :m - medical, :n - science.",
	icon_state: "com_headset",
	keyslot: null,
});

// /obj/item/device/radio/headset/heads/captain/proc/<init>  (code/game/objects/items/devices/radio/headset.dm:128)  may sleep
rt.def("/obj/item/device/radio/headset/heads/captain/proc/<init>", function* _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = (yield* g.callSuper(f, []));
	rt.setSv(f, "keyslot", (yield* g.new_(f, T("/obj/item/device/encryptionkey/heads/captain"), [])));
	return f.dot;
}, true);

rt.type(9188, "/obj/item/device/radio/headset/heads/captain/alt", "/obj/item/device/radio/headset/heads/captain", {
	name: "０the captain's bowman headset",
	desc: "The headset of the boss. Protects ears from flashbangs. \nChannels are as follows: :c - command, :s - security, :e - engineering, :u - supply, :v - service, :m - medical, :n - science.",
	icon_state: "com_headset_alt",
	item_state: "com_headset_alt",
});

// /obj/item/device/radio/headset/heads/captain/alt/proc/Initialize  (code/game/objects/items/devices/radio/headset.dm:137)  may sleep
rt.def("/obj/item/device/radio/headset/heads/captain/alt/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(rt.fv(f, "secondary_flags", live(f.src)))) {
		rt.setFv(f, "secondary_flags", live(f.src), rt.list());
	}
	rt.setAt(rt.fv(f, "secondary_flags", live(f.src)), "bang_protect", 1);
	return f.dot;
}, true, { args: ["mapload"] });

rt.type(9189, "/obj/item/device/radio/headset/heads/rd", "/obj/item/device/radio/headset/heads", {
	name: "０the research director's headset",
	desc: "Headset of the fellow who keeps society marching towards technological singularity. \nTo access the science channel, use :n. For command, use :c.",
	icon_state: "com_headset",
	keyslot: null,
});

// /obj/item/device/radio/headset/heads/rd/proc/<init>  (code/game/objects/items/devices/radio/headset.dm:144)  may sleep
rt.def("/obj/item/device/radio/headset/heads/rd/proc/<init>", function* _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = (yield* g.callSuper(f, []));
	rt.setSv(f, "keyslot", (yield* g.new_(f, T("/obj/item/device/encryptionkey/heads/rd"), [])));
	return f.dot;
}, true);

rt.type(9190, "/obj/item/device/radio/headset/heads/hos", "/obj/item/device/radio/headset/heads", {
	name: "０the head of security's headset",
	desc: "The headset of the man in charge of keeping order and protecting the station. \nTo access the security channel, use :s. For command, use :c.",
	icon_state: "com_headset",
	keyslot: null,
});

// /obj/item/device/radio/headset/heads/hos/proc/<init>  (code/game/objects/items/devices/radio/headset.dm:150)  may sleep
rt.def("/obj/item/device/radio/headset/heads/hos/proc/<init>", function* _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = (yield* g.callSuper(f, []));
	rt.setSv(f, "keyslot", (yield* g.new_(f, T("/obj/item/device/encryptionkey/heads/hos"), [])));
	return f.dot;
}, true);

rt.type(9191, "/obj/item/device/radio/headset/heads/hos/alt", "/obj/item/device/radio/headset/heads/hos", {
	name: "０the head of security's bowman headset",
	desc: "The headset of the man in charge of keeping order and protecting the station. Protects ears from flashbangs. \nTo access the security channel, use :s. For command, use :c.",
	icon_state: "com_headset_alt",
	item_state: "com_headset_alt",
});

// /obj/item/device/radio/headset/heads/hos/alt/proc/Initialize  (code/game/objects/items/devices/radio/headset.dm:159)  may sleep
rt.def("/obj/item/device/radio/headset/heads/hos/alt/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(rt.fv(f, "secondary_flags", live(f.src)))) {
		rt.setFv(f, "secondary_flags", live(f.src), rt.list());
	}
	rt.setAt(rt.fv(f, "secondary_flags", live(f.src)), "bang_protect", 1);
	return f.dot;
}, true, { args: ["mapload"] });

rt.type(9192, "/obj/item/device/radio/headset/heads/ce", "/obj/item/device/radio/headset/heads", {
	name: "０the chief engineer's headset",
	desc: "The headset of the guy in charge of keeping the station powered and undamaged. \nTo access the engineering channel, use :e. For command, use :c.",
	icon_state: "com_headset",
	keyslot: null,
});

// /obj/item/device/radio/headset/heads/ce/proc/<init>  (code/game/objects/items/devices/radio/headset.dm:166)  may sleep
rt.def("/obj/item/device/radio/headset/heads/ce/proc/<init>", function* _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = (yield* g.callSuper(f, []));
	rt.setSv(f, "keyslot", (yield* g.new_(f, T("/obj/item/device/encryptionkey/heads/ce"), [])));
	return f.dot;
}, true);

rt.type(9193, "/obj/item/device/radio/headset/heads/cmo", "/obj/item/device/radio/headset/heads", {
	name: "０the chief medical officer's headset",
	desc: "The headset of the highly trained medical chief. \nTo access the medical channel, use :m. For command, use :c.",
	icon_state: "com_headset",
	keyslot: null,
});

// /obj/item/device/radio/headset/heads/cmo/proc/<init>  (code/game/objects/items/devices/radio/headset.dm:172)  may sleep
rt.def("/obj/item/device/radio/headset/heads/cmo/proc/<init>", function* _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = (yield* g.callSuper(f, []));
	rt.setSv(f, "keyslot", (yield* g.new_(f, T("/obj/item/device/encryptionkey/heads/cmo"), [])));
	return f.dot;
}, true);

rt.type(9194, "/obj/item/device/radio/headset/heads/hop", "/obj/item/device/radio/headset/heads", {
	name: "０the head of personnel's headset",
	desc: "The headset of the guy who will one day be captain. \nChannels are as follows: :u - supply, :v - service, :c - command.",
	icon_state: "com_headset",
	keyslot: null,
});

// /obj/item/device/radio/headset/heads/hop/proc/<init>  (code/game/objects/items/devices/radio/headset.dm:178)  may sleep
rt.def("/obj/item/device/radio/headset/heads/hop/proc/<init>", function* _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = (yield* g.callSuper(f, []));
	rt.setSv(f, "keyslot", (yield* g.new_(f, T("/obj/item/device/encryptionkey/heads/hop"), [])));
	return f.dot;
}, true);

rt.type(9195, "/obj/item/device/radio/headset/headset_cargo", "/obj/item/device/radio/headset", {
	name: "supply radio headset",
	desc: "A headset used by the QM and his slaves. \nTo access the supply channel, use :u.",
	icon_state: "cargo_headset",
	keyslot: null,
});

// /obj/item/device/radio/headset/headset_cargo/proc/<init>  (code/game/objects/items/devices/radio/headset.dm:184)  may sleep
rt.def("/obj/item/device/radio/headset/headset_cargo/proc/<init>", function* _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = (yield* g.callSuper(f, []));
	rt.setSv(f, "keyslot", (yield* g.new_(f, T("/obj/item/device/encryptionkey/headset_cargo"), [])));
	return f.dot;
}, true);

rt.type(9196, "/obj/item/device/radio/headset/headset_cargo/mining", "/obj/item/device/radio/headset/headset_cargo", {
	name: "mining radio headset",
	desc: "Headset used by shaft miners. \nTo access the supply channel, use :u. For science, use :n.",
	icon_state: "mine_headset",
	keyslot: null,
});

// /obj/item/device/radio/headset/headset_cargo/mining/proc/<init>  (code/game/objects/items/devices/radio/headset.dm:190)  may sleep
rt.def("/obj/item/device/radio/headset/headset_cargo/mining/proc/<init>", function* _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = (yield* g.callSuper(f, []));
	rt.setSv(f, "keyslot", (yield* g.new_(f, T("/obj/item/device/encryptionkey/headset_mining"), [])));
	return f.dot;
}, true);

rt.type(9197, "/obj/item/device/radio/headset/headset_srv", "/obj/item/device/radio/headset", {
	name: "service radio headset",
	desc: "Headset used by the service staff, tasked with keeping the station full, happy and clean. \nTo access the service channel, use :v.",
	icon_state: "srv_headset",
	keyslot: null,
});

// /obj/item/device/radio/headset/headset_srv/proc/<init>  (code/game/objects/items/devices/radio/headset.dm:196)  may sleep
rt.def("/obj/item/device/radio/headset/headset_srv/proc/<init>", function* _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = (yield* g.callSuper(f, []));
	rt.setSv(f, "keyslot", (yield* g.new_(f, T("/obj/item/device/encryptionkey/headset_service"), [])));
	return f.dot;
}, true);

rt.type(9198, "/obj/item/device/radio/headset/headset_cent", "/obj/item/device/radio/headset", {
	name: "１Centcom headset",
	desc: "A headset used by the upper echelons of Nanotrasen. \nTo access the centcom channel, use :y.",
	icon_state: "cent_headset",
	keyslot: null,
	keyslot2: null,
});

// /obj/item/device/radio/headset/headset_cent/proc/<init>  (code/game/objects/items/devices/radio/headset.dm:202)  may sleep
rt.def("/obj/item/device/radio/headset/headset_cent/proc/<init>", function* _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = (yield* g.callSuper(f, []));
	rt.setSv(f, "keyslot", (yield* g.new_(f, T("/obj/item/device/encryptionkey/headset_com"), [])));
	$0 = $0;
	rt.setSv(f, "keyslot2", (yield* g.new_(f, T("/obj/item/device/encryptionkey/headset_cent"), [])));
	return f.dot;
}, true);

rt.type(9199, "/obj/item/device/radio/headset/headset_cent/commander", "/obj/item/device/radio/headset/headset_cent", {
	keyslot: null,
});

// /obj/item/device/radio/headset/headset_cent/commander/proc/<init>  (code/game/objects/items/devices/radio/headset.dm:206)  may sleep
rt.def("/obj/item/device/radio/headset/headset_cent/commander/proc/<init>", function* _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = (yield* g.callSuper(f, []));
	rt.setSv(f, "keyslot", (yield* g.new_(f, T("/obj/item/device/encryptionkey/heads/captain"), [])));
	return f.dot;
}, true);

rt.type(9200, "/obj/item/device/radio/headset/headset_cent/alt", "/obj/item/device/radio/headset/headset_cent", {
	name: "１Centcom bowman headset",
	desc: "A headset especially for emergency response personnel. Protects ears from flashbangs. \nTo access the centcom channel, use :y.",
	icon_state: "cent_headset_alt",
	item_state: "cent_headset_alt",
	keyslot: null,
});

// /obj/item/device/radio/headset/headset_cent/alt/proc/<init>  (code/game/objects/items/devices/radio/headset.dm:213)  may sleep
rt.def("/obj/item/device/radio/headset/headset_cent/alt/proc/<init>", function* _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = (yield* g.callSuper(f, []));
	rt.setSv(f, "keyslot", null);
	return f.dot;
}, true);

// /obj/item/device/radio/headset/headset_cent/alt/proc/Initialize  (code/game/objects/items/devices/radio/headset.dm:216)  may sleep
rt.def("/obj/item/device/radio/headset/headset_cent/alt/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(rt.fv(f, "secondary_flags", live(f.src)))) {
		rt.setFv(f, "secondary_flags", live(f.src), rt.list());
	}
	rt.setAt(rt.fv(f, "secondary_flags", live(f.src)), "bang_protect", 1);
	return f.dot;
}, true, { args: ["mapload"] });

rt.type(9201, "/obj/item/device/radio/headset/ai", "/obj/item/device/radio/headset", {
	name: "０Integrated Subspace Transceiver ",
	keyslot2: null,
});

// /obj/item/device/radio/headset/ai/proc/<init>  (code/game/objects/items/devices/radio/headset.dm:221)  may sleep
rt.def("/obj/item/device/radio/headset/ai/proc/<init>", function* _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = (yield* g.callSuper(f, []));
	rt.setSv(f, "keyslot2", (yield* g.new_(f, T("/obj/item/device/encryptionkey/ai"), [])));
	return f.dot;
}, true);

// /obj/item/device/radio/headset/ai/proc/receive_range  (code/game/objects/items/devices/radio/headset.dm:224)
rt.def("/obj/item/device/radio/headset/ai/proc/receive_range", function receive_range(f: Frame, freq: Value, level: Value) {
	return rt.callSuper(f, [live(freq), live(level), 1]);
});

// /obj/item/device/radio/headset/proc/attackby  (code/game/objects/items/devices/radio/headset.dm:227)  may sleep
rt.def("/obj/item/device/radio/headset/proc/attackby", function* attackby(f: Frame) {
	let ch_name: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [ch_name, _T, $e];
	yield* g.callName(f, live(f.args[1]), "set_machine", [live(f.src)]);
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
		if ((truthy(rt.sv(f, "keyslot")) || truthy(rt.sv(f, "keyslot2")))) {
			ch_name = null;
			rt.forList(f, 0, rt.sv(f, "channels"));
			while (($e = rt.next(f, 0)) !== undefined) {
				ch_name = $e;
				yield* g.callName(f, rt.gl("SSradio"), "remove_object", [live(f.src), rt.index(rt.gl("radiochannels"), live(ch_name))]);
				rt.setAt(rt.sv(f, "secure_radio_connections"), live(ch_name), null);
			}
			rt.endFor(f, 0);
			if (truthy(rt.sv(f, "keyslot"))) {
				if (truthy((_T = rt.getStep(f, live(f.args[1]), 0)))) {
					rt.setFv(f, "loc", rt.sv(f, "keyslot"), live(_T));
					rt.setSv(f, "keyslot", null);
				}
			}
			if (truthy(rt.sv(f, "keyslot2"))) {
				if (truthy((_T = rt.getStep(f, live(f.args[1]), 0)))) {
					rt.setFv(f, "loc", rt.sv(f, "keyslot2"), live(_T));
					rt.setSv(f, "keyslot2", null);
				}
			}
			yield* g.srcCall(f, "recalculateChannels");
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You pop out the encryption keys in the headset.</span>"]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>This headset doesn't have any unique encryption keys!  How useless...</span>"]);
		}
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/device/encryptionkey")) ? 1 : 0))) {
			if ((truthy(rt.sv(f, "keyslot")) && truthy(rt.sv(f, "keyslot2")))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>The headset can't hold another key!</span>"]);
				return live(f.dot);
			}
			if (!truthy(rt.sv(f, "keyslot"))) {
				if (!truthy((yield* g.callName(f, live(f.args[1]), "transferItemToLoc", [live(f.args[0]), live(f.src)])))) {
					return live(f.dot);
				}
				rt.setSv(f, "keyslot", live(f.args[0]));
			} else {
				if (!truthy((yield* g.callName(f, live(f.args[1]), "transferItemToLoc", [live(f.args[0]), live(f.src)])))) {
					return live(f.dot);
				}
				rt.setSv(f, "keyslot2", live(f.args[0]));
			}
			yield* g.srcCall(f, "recalculateChannels");
		} else {
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/item/device/radio/headset/proc/recalculateChannels  (code/game/objects/items/devices/radio/headset.dm:280)
rt.def("/obj/item/device/radio/headset/proc/recalculateChannels", function recalculateChannels(f: Frame) {
	let ch_name: Value = null;
	let $e: any;
	f.vars = () => [ch_name, $e];
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "keyslot2"))) {
		ch_name = null;
		rt.forList(f, 0, rt.fv(f, "channels", rt.sv(f, "keyslot2")));
		while (($e = rt.next(f, 0)) !== undefined) {
			ch_name = $e;
			if (truthy((rt.isIn(f, live(ch_name), rt.fv(f, "channels", live(f.src))) ? 1 : 0))) {
				continue;
			}
			rt.modField(f, live(f.src), "channels", live(ch_name), add);
			rt.setAt(rt.fv(f, "channels", live(f.src)), live(ch_name), rt.index(rt.fv(f, "channels", rt.sv(f, "keyslot2")), live(ch_name)));
		}
		rt.endFor(f, 0);
		if (truthy(rt.fv(f, "translate_binary", rt.sv(f, "keyslot2")))) {
			rt.setFv(f, "translate_binary", live(f.src), 1);
		}
		if (truthy(rt.fv(f, "syndie", rt.sv(f, "keyslot2")))) {
			rt.setFv(f, "syndie", live(f.src), 1);
		}
		if (truthy(rt.fv(f, "independent", rt.sv(f, "keyslot2")))) {
			rt.setSv(f, "independent", 1);
		}
	}
	ch_name = null;
	rt.forList(f, 0, rt.sv(f, "channels"));
	while (($e = rt.next(f, 0)) !== undefined) {
		ch_name = $e;
		rt.setAt(rt.sv(f, "secure_radio_connections"), live(ch_name), rt.call(f, P("/proc/add_radio"), null, [live(f.src), rt.index(rt.gl("radiochannels"), live(ch_name))]));
	}
	rt.endFor(f, 0);
	return live(f.dot);
});

// /obj/item/device/radio/headset/proc/AltClick  (code/game/objects/items/devices/radio/headset.dm:304)
rt.def("/obj/item/device/radio/headset/proc/AltClick", function AltClick(f: Frame, user: Value) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	if (((!truthy((rt.istype(live(user), T("/mob/living")) ? 1 : 0)) || !truthy(rt.callSrc(f, "Adjacent", [live(user)]))) || truthy(rt.callName(f, live(user), "incapacitated", [])))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "command"))) return f.dot;
	rt.setSv(f, "use_command", (!truthy(rt.sv(f, "use_command")) ? 1 : 0));
	$0 = live(user);
	if (truthy(rt.sv(f, "use_command"))) {
		$1 = "on";
	} else {
		$1 = "off";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You toggle high-volume mode ＀.</span>", [$1])]);
	return f.dot;
});
