// From code/game/gamemodes/clock_cult/clock_helpers/hierophant_network.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /proc/hierophant_message  (code/game/gamemodes/clock_cult/clock_helpers/hierophant_network.dm:3)
rt.def("/proc/hierophant_message", function hierophant_message(f: Frame, message: Value, servantsonly: Value, target: Value) {
	let M: Value = null, link: Value = null;
	let $e: any;
	f.vars = () => [M, link, $e];
	if (!truthy(live(message))) {
		return 0;
	}
	M = null;
	rt.forList(f, 0, rt.gl("mob_list"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if ((!truthy(live(servantsonly)) && truthy((rt.istype(live(M), T("/mob/dead/observer")) ? 1 : 0)))) {
			if (truthy(live(target))) {
				link = fmt("<a href=?src=＃;follow=＃>(F)</a>", [live(M), live(target)]);
				rt.call(f, P("/proc/to_chat"), null, [live(M), fmt("＀ ＀", [live(link), live(message)])]);
			} else {
				rt.call(f, P("/proc/to_chat"), null, [live(M), live(message)]);
			}
		} else {
			if (truthy(rt.call(f, P("/proc/is_servant_of_ratvar"), null, [live(M)]))) {
				rt.call(f, P("/proc/to_chat"), null, [live(M), live(message)]);
			}
		}
	}
	rt.endFor(f, 0);
	return 1;
});

// /proc/titled_hierophant_message  (code/game/gamemodes/clock_cult/clock_helpers/hierophant_network.dm:18)
rt.def("/proc/titled_hierophant_message", function titled_hierophant_message(f: Frame, user: Value, message: Value, name_span: Value, message_span: Value, user_title: Value) {
	let parsed_message: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [name_span, message_span, user_title, parsed_message, $0, $1, $2];
	if (live(name_span) === null) {
		name_span = "heavy_brass";
	}
	if (live(message_span) === null) {
		message_span = "brass";
	}
	if (live(user_title) === null) {
		user_title = "Servant";
	}
	if ((!truthy(live(user)) || !truthy(live(message)))) {
		return 0;
	}
	$0 = live(name_span);
	if (truthy(live(user_title))) {
		$1 = fmt("＀ ", [live(user_title)]);
	} else {
		$1 = "";
	}
	if (truthy(rt.call(f, P("/proc/findtextEx"), null, [rt.fv(f, "name", live(user)), rt.fv(f, "real_name", live(user))]))) {
		$2 = rt.fv(f, "name", live(user));
	} else {
		$2 = fmt("＀ (as ＀)", [rt.fv(f, "real_name", live(user)), rt.fv(f, "name", live(user))]);
	}
	rt.call(f, P("/proc/hierophant_message"), null, [(parsed_message = fmt("<span class='＀'>＀＀: </span><span class='＀'>\"＀\"</span>", [$0, $1, $2, live(message_span), live(message)])), 0, live(user)]);
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

// /datum/action/innate/hierophant/proc/IsAvailable  (code/game/gamemodes/clock_cult/clock_helpers/hierophant_network.dm:38)
rt.def("/datum/action/innate/hierophant/proc/IsAvailable", function IsAvailable(f: Frame) {
	if (!truthy(rt.call(f, P("/proc/is_servant_of_ratvar"), null, [rt.sv(f, "owner")]))) {
		return 0;
	}
	return rt.callSuper(f, [], rt.Args.Same);
});

// /datum/action/innate/hierophant/proc/Activate  (code/game/gamemodes/clock_cult/clock_helpers/hierophant_network.dm:43)  may sleep
rt.def("/datum/action/innate/hierophant/proc/Activate", function* Activate(f: Frame) {
	let input: Value = null;
	f.vars = () => [input];
	if ((!truthy((input = (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.usr), "Please enter a message to send to other servants.", "Hierophant Network", ""])))) || !truthy((yield* g.srcCall(f, "IsAvailable"))))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/titled_hierophant_message"), null, [rt.sv(f, "owner"), live(input), rt.sv(f, "span_for_name"), rt.sv(f, "span_for_message"), rt.sv(f, "title")]);
	return f.dot;
}, true);
