// Based on /tg/station's code/game/gamemodes/clock_cult/clock_helpers/hierophant_network.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


// hierophant_network.dm:3
rt.def("/proc/hierophant_message", function hierophant_message(f: Frame, message: Value, servantsonly: Value, target: Value) {
	let M: Value = null, link: Value = null;
	if (!message) {
		return 0;
	}
	for (M of each(GLOB.mob_list)) {
		if (!servantsonly && rt.istype(M, T("/mob/dead/observer"))) {
			if (target) {
				link = fmt("<a href=?src=＃;follow=＃>(F)</a>", [M, target]);
				to_chat(M, `${link} ${message}`);
			} else {
				to_chat(M, message);
			}
		} else if (is_servant_of_ratvar(M)) {
			to_chat(M, message);
		}
	}
	return 1;
});

// hierophant_network.dm:18
rt.def("/proc/titled_hierophant_message", function titled_hierophant_message(f: Frame, user: Value, message: Value, name_span: Value, message_span: Value, user_title: Value) {
	let parsed_message: Value = null;
	let $1: any, $2: any;
	name_span ??= "heavy_brass";
	message_span ??= "brass";
	user_title ??= "Servant";
	if (!user || !message) {
		return 0;
	}
	let $0: any = name_span;
	if (user_title) {
		$1 = `${user_title} `;
	} else {
		$1 = "";
	}
	if (findtextEx(user.name, user.real_name)) {
		$2 = user.name;
	} else {
		$2 = `${user.real_name} (as ${user.name})`;
	}
	hierophant_message((parsed_message = `<span class='${$0}'>${$1}${$2}: </span><span class='${message_span}'>"${message}"</span>`), 0, user);
	return 1;
});

rt.type(87, "/datum/action/innate/hierophant", "/datum/action/innate", {
	title: "Servant",
	span_for_name: "heavy_brass",
	span_for_message: "brass",
	name: "Hierophant Network",
	desc: "Allows you to communicate with other Servants.",
	button_icon_state: "hierophant",
	background_icon_state: "bg_clock",
	check_flags: 11,
	buttontooltipstyle: "clockcult",
});

// hierophant_network.dm:38
rt.def("/datum/action/innate/hierophant/proc/IsAvailable", function IsAvailable(f: Frame) {
	if (!is_servant_of_ratvar(this.owner)) {
		return 0;
	}
	return parent_proc();
});

// hierophant_network.dm:43
rt.def("/datum/action/innate/hierophant/proc/Activate", function* Activate(f: Frame) {
	let input: Value = null;
	if (!(input = (yield* stripped_input(f.usr, "Please enter a message to send to other servants.", "Hierophant Network", ""))) || !(yield* this.IsAvailable())) {
		return f.dot;
	}
	titled_hierophant_message(this.owner, input, this.span_for_name, this.span_for_message, this.title);
	return f.dot;
}, true);
