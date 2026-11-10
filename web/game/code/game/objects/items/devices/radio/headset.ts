// Based on /tg/station's code/game/objects/items/devices/radio/headset.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, add } = rt;


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

// headset.dm:6
rt.def("/obj/item/device/radio/headset/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 75]);
	return f.dot;
});

// headset.dm:15
rt.def("/obj/item/device/radio/headset/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.recalculateChannels();
	return f.dot;
}, true);

// headset.dm:19
rt.def("/obj/item/device/radio/headset/proc/Destroy", function* Destroy(f: Frame) {
	yield* qdel(this.keyslot);
	yield* qdel(this.keyslot2);
	this.keyslot = null;
	this.keyslot2 = null;
	return (yield* parent_proc());
}, true);

// headset.dm:26
rt.def("/obj/item/device/radio/headset/proc/talk_into", function* talk_into(f: Frame, M: Value, message: Value, channel: Value, spans: Value, language: Value) {
	if (!this.listening) {
		return 3;
	}
	return (yield* parent_proc());
}, true);

// headset.dm:31
rt.def("/obj/item/device/radio/headset/proc/receive_range", function receive_range(f: Frame, freq: Value, level: Value, AIuser: Value) {
	let H: Value = null;
	if (rt.istype(this.loc, T("/mob/living/carbon/human"))) {
		if ((H = this.loc).ears == this) {
			return parent_proc(freq, level);
		}
	} else if (AIuser) {
		return parent_proc(freq, level);
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

// headset.dm:50
rt.def("/obj/item/device/radio/headset/syndicate/alt/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	f.dot = (yield* parent_proc());
	if (!this.secondary_flags) {
		this.secondary_flags = list();
	}
	rt.setAt(this.secondary_flags, "bang_protect", 1);
	return f.dot;
}, true);

rt.type(9169, "/obj/item/device/radio/headset/syndicate", "/obj/item/device/radio/headset", {
	origin_tech: "syndicate=3",
});

// headset.dm:58
rt.def("/obj/item/device/radio/headset/syndicate/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	yield* this.make_syndie();
	return f.dot;
}, true);

rt.type(9172, "/obj/item/device/radio/headset/binary", "/obj/item/device/radio/headset", {
	origin_tech: "syndicate=3",
});

// headset.dm:64
rt.def("/obj/item/device/radio/headset/binary/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	yield* qdel(this.keyslot);
	this.keyslot = (yield* new_(T("/obj/item/device/encryptionkey/binary")));
	this.recalculateChannels();
	return f.dot;
}, true);

rt.type(9173, "/obj/item/device/radio/headset/headset_sec", "/obj/item/device/radio/headset", {
	name: "security radio headset",
	desc: "This is used by your elite security force. \nTo access the security channel, use :s.",
	icon_state: "sec_headset",
	keyslot: null,
});

// headset.dm:73
rt.def("/obj/item/device/radio/headset/headset_sec/proc/<init>", function* _init_(f: Frame) {
	yield* parent_proc();
	this.keyslot = (yield* new_(T("/obj/item/device/encryptionkey/headset_sec")));
	return f.dot;
}, true);

rt.type(9174, "/obj/item/device/radio/headset/headset_sec/alt", "/obj/item/device/radio/headset/headset_sec", {
	name: "security bowman headset",
	desc: "This is used by your elite security force. Protects ears from flashbangs. \nTo access the security channel, use :s.",
	icon_state: "sec_headset_alt",
	item_state: "sec_headset_alt",
});

// headset.dm:82
rt.def("/obj/item/device/radio/headset/headset_sec/alt/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	f.dot = (yield* parent_proc());
	if (!this.secondary_flags) {
		this.secondary_flags = list();
	}
	rt.setAt(this.secondary_flags, "bang_protect", 1);
	return f.dot;
}, true);

rt.type(9180, "/obj/item/device/radio/headset/headset_eng", "/obj/item/device/radio/headset", {
	name: "engineering radio headset",
	desc: "When the engineers wish to chat like girls. \nTo access the engineering channel, use :e. ",
	icon_state: "eng_headset",
	keyslot: null,
});

// headset.dm:89
rt.def("/obj/item/device/radio/headset/headset_eng/proc/<init>", function* _init_(f: Frame) {
	yield* parent_proc();
	this.keyslot = (yield* new_(T("/obj/item/device/encryptionkey/headset_eng")));
	return f.dot;
}, true);

rt.type(9181, "/obj/item/device/radio/headset/headset_rob", "/obj/item/device/radio/headset", {
	name: "robotics radio headset",
	desc: "Made specifically for the roboticists, who cannot decide between departments. \nTo access the engineering channel, use :e. For research, use :n.",
	icon_state: "rob_headset",
	keyslot: null,
});

// headset.dm:95
rt.def("/obj/item/device/radio/headset/headset_rob/proc/<init>", function* _init_(f: Frame) {
	yield* parent_proc();
	this.keyslot = (yield* new_(T("/obj/item/device/encryptionkey/headset_rob")));
	return f.dot;
}, true);

rt.type(9182, "/obj/item/device/radio/headset/headset_med", "/obj/item/device/radio/headset", {
	name: "medical radio headset",
	desc: "A headset for the trained staff of the medbay. \nTo access the medical channel, use :m.",
	icon_state: "med_headset",
	keyslot: null,
});

// headset.dm:101
rt.def("/obj/item/device/radio/headset/headset_med/proc/<init>", function* _init_(f: Frame) {
	yield* parent_proc();
	this.keyslot = (yield* new_(T("/obj/item/device/encryptionkey/headset_med")));
	return f.dot;
}, true);

rt.type(9183, "/obj/item/device/radio/headset/headset_sci", "/obj/item/device/radio/headset", {
	name: "science radio headset",
	desc: "A sciency headset. Like usual. \nTo access the science channel, use :n.",
	icon_state: "sci_headset",
	keyslot: null,
});

// headset.dm:107
rt.def("/obj/item/device/radio/headset/headset_sci/proc/<init>", function* _init_(f: Frame) {
	yield* parent_proc();
	this.keyslot = (yield* new_(T("/obj/item/device/encryptionkey/headset_sci")));
	return f.dot;
}, true);

rt.type(9184, "/obj/item/device/radio/headset/headset_medsci", "/obj/item/device/radio/headset", {
	name: "medical research radio headset",
	desc: "A headset that is a result of the mating between medical and science. \nTo access the medical channel, use :m. For science, use :n.",
	icon_state: "medsci_headset",
	keyslot: null,
});

// headset.dm:113
rt.def("/obj/item/device/radio/headset/headset_medsci/proc/<init>", function* _init_(f: Frame) {
	yield* parent_proc();
	this.keyslot = (yield* new_(T("/obj/item/device/encryptionkey/headset_medsci")));
	return f.dot;
}, true);

rt.type(9185, "/obj/item/device/radio/headset/headset_com", "/obj/item/device/radio/headset", {
	name: "command radio headset",
	desc: "A headset with a commanding channel. \nTo access the command channel, use :c.",
	icon_state: "com_headset",
	keyslot: null,
});

// headset.dm:119
rt.def("/obj/item/device/radio/headset/headset_com/proc/<init>", function* _init_(f: Frame) {
	yield* parent_proc();
	this.keyslot = (yield* new_(T("/obj/item/device/encryptionkey/headset_com")));
	return f.dot;
}, true);

rt.type(9187, "/obj/item/device/radio/headset/heads/captain", "/obj/item/device/radio/headset/heads", {
	name: "０the captain's headset",
	desc: "The headset of the king. \nChannels are as follows: :c - command, :s - security, :e - engineering, :u - supply, :v - service, :m - medical, :n - science.",
	icon_state: "com_headset",
	keyslot: null,
});

// headset.dm:128
rt.def("/obj/item/device/radio/headset/heads/captain/proc/<init>", function* _init_(f: Frame) {
	yield* parent_proc();
	this.keyslot = (yield* new_(T("/obj/item/device/encryptionkey/heads/captain")));
	return f.dot;
}, true);

rt.type(9188, "/obj/item/device/radio/headset/heads/captain/alt", "/obj/item/device/radio/headset/heads/captain", {
	name: "０the captain's bowman headset",
	desc: "The headset of the boss. Protects ears from flashbangs. \nChannels are as follows: :c - command, :s - security, :e - engineering, :u - supply, :v - service, :m - medical, :n - science.",
	icon_state: "com_headset_alt",
	item_state: "com_headset_alt",
});

// headset.dm:137
rt.def("/obj/item/device/radio/headset/heads/captain/alt/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	f.dot = (yield* parent_proc());
	if (!this.secondary_flags) {
		this.secondary_flags = list();
	}
	rt.setAt(this.secondary_flags, "bang_protect", 1);
	return f.dot;
}, true);

rt.type(9189, "/obj/item/device/radio/headset/heads/rd", "/obj/item/device/radio/headset/heads", {
	name: "０the research director's headset",
	desc: "Headset of the fellow who keeps society marching towards technological singularity. \nTo access the science channel, use :n. For command, use :c.",
	icon_state: "com_headset",
	keyslot: null,
});

// headset.dm:144
rt.def("/obj/item/device/radio/headset/heads/rd/proc/<init>", function* _init_(f: Frame) {
	yield* parent_proc();
	this.keyslot = (yield* new_(T("/obj/item/device/encryptionkey/heads/rd")));
	return f.dot;
}, true);

rt.type(9190, "/obj/item/device/radio/headset/heads/hos", "/obj/item/device/radio/headset/heads", {
	name: "０the head of security's headset",
	desc: "The headset of the man in charge of keeping order and protecting the station. \nTo access the security channel, use :s. For command, use :c.",
	icon_state: "com_headset",
	keyslot: null,
});

// headset.dm:150
rt.def("/obj/item/device/radio/headset/heads/hos/proc/<init>", function* _init_(f: Frame) {
	yield* parent_proc();
	this.keyslot = (yield* new_(T("/obj/item/device/encryptionkey/heads/hos")));
	return f.dot;
}, true);

rt.type(9191, "/obj/item/device/radio/headset/heads/hos/alt", "/obj/item/device/radio/headset/heads/hos", {
	name: "０the head of security's bowman headset",
	desc: "The headset of the man in charge of keeping order and protecting the station. Protects ears from flashbangs. \nTo access the security channel, use :s. For command, use :c.",
	icon_state: "com_headset_alt",
	item_state: "com_headset_alt",
});

// headset.dm:159
rt.def("/obj/item/device/radio/headset/heads/hos/alt/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	f.dot = (yield* parent_proc());
	if (!this.secondary_flags) {
		this.secondary_flags = list();
	}
	rt.setAt(this.secondary_flags, "bang_protect", 1);
	return f.dot;
}, true);

rt.type(9192, "/obj/item/device/radio/headset/heads/ce", "/obj/item/device/radio/headset/heads", {
	name: "０the chief engineer's headset",
	desc: "The headset of the guy in charge of keeping the station powered and undamaged. \nTo access the engineering channel, use :e. For command, use :c.",
	icon_state: "com_headset",
	keyslot: null,
});

// headset.dm:166
rt.def("/obj/item/device/radio/headset/heads/ce/proc/<init>", function* _init_(f: Frame) {
	yield* parent_proc();
	this.keyslot = (yield* new_(T("/obj/item/device/encryptionkey/heads/ce")));
	return f.dot;
}, true);

rt.type(9193, "/obj/item/device/radio/headset/heads/cmo", "/obj/item/device/radio/headset/heads", {
	name: "０the chief medical officer's headset",
	desc: "The headset of the highly trained medical chief. \nTo access the medical channel, use :m. For command, use :c.",
	icon_state: "com_headset",
	keyslot: null,
});

// headset.dm:172
rt.def("/obj/item/device/radio/headset/heads/cmo/proc/<init>", function* _init_(f: Frame) {
	yield* parent_proc();
	this.keyslot = (yield* new_(T("/obj/item/device/encryptionkey/heads/cmo")));
	return f.dot;
}, true);

rt.type(9194, "/obj/item/device/radio/headset/heads/hop", "/obj/item/device/radio/headset/heads", {
	name: "０the head of personnel's headset",
	desc: "The headset of the guy who will one day be captain. \nChannels are as follows: :u - supply, :v - service, :c - command.",
	icon_state: "com_headset",
	keyslot: null,
});

// headset.dm:178
rt.def("/obj/item/device/radio/headset/heads/hop/proc/<init>", function* _init_(f: Frame) {
	yield* parent_proc();
	this.keyslot = (yield* new_(T("/obj/item/device/encryptionkey/heads/hop")));
	return f.dot;
}, true);

rt.type(9195, "/obj/item/device/radio/headset/headset_cargo", "/obj/item/device/radio/headset", {
	name: "supply radio headset",
	desc: "A headset used by the QM and his slaves. \nTo access the supply channel, use :u.",
	icon_state: "cargo_headset",
	keyslot: null,
});

// headset.dm:184
rt.def("/obj/item/device/radio/headset/headset_cargo/proc/<init>", function* _init_(f: Frame) {
	yield* parent_proc();
	this.keyslot = (yield* new_(T("/obj/item/device/encryptionkey/headset_cargo")));
	return f.dot;
}, true);

rt.type(9196, "/obj/item/device/radio/headset/headset_cargo/mining", "/obj/item/device/radio/headset/headset_cargo", {
	name: "mining radio headset",
	desc: "Headset used by shaft miners. \nTo access the supply channel, use :u. For science, use :n.",
	icon_state: "mine_headset",
	keyslot: null,
});

// headset.dm:190
rt.def("/obj/item/device/radio/headset/headset_cargo/mining/proc/<init>", function* _init_(f: Frame) {
	yield* parent_proc();
	this.keyslot = (yield* new_(T("/obj/item/device/encryptionkey/headset_mining")));
	return f.dot;
}, true);

rt.type(9197, "/obj/item/device/radio/headset/headset_srv", "/obj/item/device/radio/headset", {
	name: "service radio headset",
	desc: "Headset used by the service staff, tasked with keeping the station full, happy and clean. \nTo access the service channel, use :v.",
	icon_state: "srv_headset",
	keyslot: null,
});

// headset.dm:196
rt.def("/obj/item/device/radio/headset/headset_srv/proc/<init>", function* _init_(f: Frame) {
	yield* parent_proc();
	this.keyslot = (yield* new_(T("/obj/item/device/encryptionkey/headset_service")));
	return f.dot;
}, true);

rt.type(9198, "/obj/item/device/radio/headset/headset_cent", "/obj/item/device/radio/headset", {
	name: "１Centcom headset",
	desc: "A headset used by the upper echelons of Nanotrasen. \nTo access the centcom channel, use :y.",
	icon_state: "cent_headset",
	keyslot: null,
	keyslot2: null,
});

// headset.dm:202
rt.def("/obj/item/device/radio/headset/headset_cent/proc/<init>", function* _init_(f: Frame) {
	yield* parent_proc();
	this.keyslot = (yield* new_(T("/obj/item/device/encryptionkey/headset_com")));

	this.keyslot2 = (yield* new_(T("/obj/item/device/encryptionkey/headset_cent")));
	return f.dot;
}, true);

rt.type(9199, "/obj/item/device/radio/headset/headset_cent/commander", "/obj/item/device/radio/headset/headset_cent", {
	keyslot: null,
});

// headset.dm:206
rt.def("/obj/item/device/radio/headset/headset_cent/commander/proc/<init>", function* _init_(f: Frame) {
	yield* parent_proc();
	this.keyslot = (yield* new_(T("/obj/item/device/encryptionkey/heads/captain")));
	return f.dot;
}, true);

rt.type(9200, "/obj/item/device/radio/headset/headset_cent/alt", "/obj/item/device/radio/headset/headset_cent", {
	name: "１Centcom bowman headset",
	desc: "A headset especially for emergency response personnel. Protects ears from flashbangs. \nTo access the centcom channel, use :y.",
	icon_state: "cent_headset_alt",
	item_state: "cent_headset_alt",
	keyslot: null,
});

// headset.dm:213
rt.def("/obj/item/device/radio/headset/headset_cent/alt/proc/<init>", function* _init_(f: Frame) {
	yield* parent_proc();
	this.keyslot = null;
	return f.dot;
}, true);

// headset.dm:216
rt.def("/obj/item/device/radio/headset/headset_cent/alt/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	f.dot = (yield* parent_proc());
	if (!this.secondary_flags) {
		this.secondary_flags = list();
	}
	rt.setAt(this.secondary_flags, "bang_protect", 1);
	return f.dot;
}, true);

rt.type(9201, "/obj/item/device/radio/headset/ai", "/obj/item/device/radio/headset", {
	name: "０Integrated Subspace Transceiver ",
	keyslot2: null,
});

// headset.dm:221
rt.def("/obj/item/device/radio/headset/ai/proc/<init>", function* _init_(f: Frame) {
	yield* parent_proc();
	this.keyslot2 = (yield* new_(T("/obj/item/device/encryptionkey/ai")));
	return f.dot;
}, true);

// headset.dm:224
rt.def("/obj/item/device/radio/headset/ai/proc/receive_range", function receive_range(f: Frame, freq: Value, level: Value) {
	return parent_proc(freq, level, 1);
});

// headset.dm:227
rt.def("/obj/item/device/radio/headset/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let ch_name: Value = null, _T: Value = null;
	yield* user.set_machine(this);
	if (rt.istype(W, T("/obj/item/weapon/screwdriver"))) {
		if (this.keyslot || this.keyslot2) {
			for (ch_name of each(this.channels)) {
				yield* GLOB.SSradio.remove_object(this, rt.index(GLOB.radiochannels, ch_name));
				rt.setAt(this.secure_radio_connections, ch_name, null);
			}
			if (this.keyslot) {
				if (_T = rt.getStep(f, user, 0)) {
					this.keyslot.loc = _T;
					this.keyslot = null;
				}
			}
			if (this.keyslot2) {
				if (_T = rt.getStep(f, user, 0)) {
					this.keyslot2.loc = _T;
					this.keyslot2 = null;
				}
			}
			this.recalculateChannels();
			to_chat(user, "<span class='notice'>You pop out the encryption keys in the headset.</span>");
		} else {
			to_chat(user, "<span class='warning'>This headset doesn't have any unique encryption keys!  How useless...</span>");
		}
	} else if (rt.istype(W, T("/obj/item/device/encryptionkey"))) {
		if (this.keyslot && this.keyslot2) {
			to_chat(user, "<span class='warning'>The headset can't hold another key!</span>");
			return f.dot;
		}
		if (!this.keyslot) {
			if (!(yield* user.transferItemToLoc(W, this))) {
				return f.dot;
			}
			this.keyslot = W;
		} else {
			if (!(yield* user.transferItemToLoc(W, this))) {
				return f.dot;
			}
			this.keyslot2 = W;
		}
		this.recalculateChannels();
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// headset.dm:280
rt.def("/obj/item/device/radio/headset/proc/recalculateChannels", function recalculateChannels(f: Frame) {
	let ch_name: Value = null;
	parent_proc();
	if (this.keyslot2) {
		for (ch_name of each(this.keyslot2.channels)) {
			if (rt.isIn(f, ch_name, this.channels)) {
				continue;
			}
			rt.modField(f, this, "channels", ch_name, add);
			rt.setAt(this.channels, ch_name, rt.index(this.keyslot2.channels, ch_name));
		}
		if (this.keyslot2.translate_binary) {
			this.translate_binary = 1;
		}
		if (this.keyslot2.syndie) {
			this.syndie = 1;
		}
		if (this.keyslot2.independent) {
			this.independent = 1;
		}
	}
	ch_name = null;
	for (ch_name of each(this.channels)) {
		rt.setAt(this.secure_radio_connections, ch_name, add_radio(this, rt.index(GLOB.radiochannels, ch_name)));
	}
	return f.dot;
});

// headset.dm:304
rt.def("/obj/item/device/radio/headset/proc/AltClick", function AltClick(f: Frame, user: Value) {
	if (!rt.istype(user, T("/mob/living")) || !this.Adjacent(user) || user.incapacitated()) {
		return f.dot;
	}
	if (!this.command) return f.dot;
	this.use_command = (!this.use_command ? 1 : 0);
	let $0: any = user;
	to_chat($0, `<span class='notice'>You toggle high-volume mode ${this.use_command ? "on" : "off"}.</span>`);
	return f.dot;
});
