// From code/modules/mob/living/silicon/ai/examine.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/silicon/ai/proc/examine  (code/modules/mob/living/silicon/ai/examine.dm:2)
rt.def("/mob/living/silicon/ai/proc/examine", function examine(f: Frame) {
	let msg: Value = null;
	f.vars = () => [msg];
	msg = fmt("<span class='info'>*---------*\nThis is ＀ <EM>＀</EM>!\n", [rt.call(f, P("/proc/bicon"), null, [live(f.src)]), live(f.src)]);
	if (isEqual(rt.sv(f, "stat"), 2)) {
		msg = rt.modify(live(msg), "<span class='deadsay'>It appears to be powered-down.</span>\n", add);
	} else {
		msg = rt.modify(live(msg), "<span class='warning'>", add);
		if (truthy(rt.callSrc(f, "getBruteLoss", []))) {
			if (rt.lt(rt.callSrc(f, "getBruteLoss", []), 30)) {
				msg = rt.modify(live(msg), "It looks slightly dented.\n", add);
			} else {
				msg = rt.modify(live(msg), "<B>It looks severely dented!</B>\n", add);
			}
		}
		if (truthy(rt.callSrc(f, "getFireLoss", []))) {
			if (rt.lt(rt.callSrc(f, "getFireLoss", []), 30)) {
				msg = rt.modify(live(msg), "It looks slightly charred.\n", add);
			} else {
				msg = rt.modify(live(msg), "<B>Its casing is melted and heat-warped!</B>\n", add);
			}
		}
		msg = rt.modify(live(msg), "</span>", add);
		if (truthy(rt.sv(f, "deployed_shell"))) {
			msg = rt.modify(live(msg), "The wireless networking light is blinking.\n", add);
		} else {
			if ((!truthy(rt.sv(f, "shunted")) && !truthy(rt.sv(f, "client")))) {
				msg = rt.modify(live(msg), fmt("＀Core.exe has stopped responding! NTOS is searching for a solution to the problem...\n", [live(f.src)]), add);
			}
		}
	}
	msg = rt.modify(live(msg), "*---------*</span>", add);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), live(msg)]);
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["user"] });
