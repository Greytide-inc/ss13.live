// Based on /tg/station's code/modules/modular_computers/file_system/programs/antagonist/dos.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, add } = rt;


rt.type(4171, "/datum/computer_file/program/ntnet_dos", "/datum/computer_file/program", {
	target: null,
	dos_speed: 0,
	error: "",
	executed: 0,
	filename: "ntn_dos",
	filedesc: "DoS Traffic Generator",
	program_icon_state: "hostile",
	extended_desc: "This advanced script can perform denial of service attacks against NTNet quantum relays. The system administrator will probably notice this. Multiple devices can run this program together against same relay for increased effect",
	size: 20,
	requires_ntnet: 1,
	available_on_ntnet: 0,
	available_on_syndinet: 1,
	tgui_id: "ntos_net_dos",
	ui_style: "syndicate",
	ui_x: 400,
	ui_y: 250,
});

// dos.dm:22
rt.def("/datum/computer_file/program/ntnet_dos/proc/process_tick", function process_tick(f: Frame) {
	this.dos_speed = 0;
	if (this.ntnet_status === 1) {
		this.dos_speed = 5;
	} else if (this.ntnet_status === 2) {
		this.dos_speed = 10;
	} else if (this.ntnet_status === 3) {
		this.dos_speed = 20;
	}
	if (!(this.target && this.executed)) return f.dot;
	this.target.dos_overload += this.dos_speed;
	if (this.target.is_operational()) return f.dot;
	this.target.dos_sources.Remove(this);
	this.target = null;
	this.error = "Connection to destination relay lost.";
	return f.dot;
});

// dos.dm:38
rt.def("/datum/computer_file/program/ntnet_dos/proc/kill_program", function kill_program(f: Frame) {
	if (f.args[0] === null) {
		f.args[0] = 0;
	}
	if (this.target) {
		this.target.dos_sources.Remove(this);
	}
	this.target = null;
	this.executed = 0;
	parent_proc();
	return f.dot;
}, false, { args: ["forced"] });

// dos.dm:45
rt.def("/datum/computer_file/program/ntnet_dos/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value) {
	let R: Value = null, network_card: Value = null;
	let $e: any;
	if (yield* parent_proc()) {
		return 1;
	}
	if (action === "PRG_target_relay") {
		for (R of each(GLOB.ntnet_global.relays, T("/obj/machinery/ntnet_relay"))) {
			if (`${R.uid}` == rt.at(params, "targid")) {
				this.target = R;
			}
		}
		return 1;
	} else if (action === "PRG_reset") {
		if (this.target) {
			yield* this.target.dos_sources.Remove(this);
			this.target = null;
		}
		this.executed = 0;
		this.error = "";
		return 1;
	} else if (action === "PRG_execute") {
		if (this.target) {
			this.executed = 1;
			this.target.dos_sources.Add(this);
			if (GLOB.ntnet_global.intrusion_detection_enabled) {
				network_card = rt.index(this.computer.all_components, "NET");
				yield* GLOB.ntnet_global.add_log(`IDS WARNING - Excess traffic flood targeting relay ${this.target.uid} detected from device: ${network_card.get_network_tag()}`);
				GLOB.ntnet_global.intrusion_detection_alarm = 1;
			}
		}
		return 1;
	}
	return f.dot;
}, true);

// dos.dm:71
rt.def("/datum/computer_file/program/ntnet_dos/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let percentage: Value = null, j: Value = null, string: Value = null, i: Value = null, R: Value = null;
	let $e: any;
	if (!GLOB.ntnet_global) {
		return f.dot;
	}
	let data: Value = list();
	data = this.get_header_data();
	if (this.error) {
		rt.setAt(data, "error", this.error);
	} else if (this.target && this.executed) {
		rt.setAt(data, "target", 1);
		rt.setAt(data, "speed", this.dos_speed);
		percentage = this.target.dos_overload * 100 / this.target.dos_capacity;
		rt.setAt(data, "dos_strings", list());
		j;
		while (j < 10) {
			string = "";
			i = null;
			i;
			while (i < 20) {
				string = `${string}${prob(percentage)}`;
				i++;
			}
			rt.modAt(data, "dos_strings", list(rt.alist(f, ["nums", string])), add);
			j++;
		}
	} else {
		rt.setAt(data, "relays", list());
		for (R of each(GLOB.ntnet_global.relays, T("/obj/machinery/ntnet_relay"))) {
			rt.modAt(data, "relays", list(rt.alist(f, ["id", R.uid])), add);
		}
		rt.setAt(data, "focus", this.target ? this.target.uid : null);
	}
	return data;
});
