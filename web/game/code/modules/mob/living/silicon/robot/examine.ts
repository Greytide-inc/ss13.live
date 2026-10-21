// From code/modules/mob/living/silicon/robot/examine.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/silicon/robot/proc/examine  (code/modules/mob/living/silicon/robot/examine.dm:2)
rt.def("/mob/living/silicon/robot/proc/examine", function examine(f: Frame) {
	let msg: Value = null, act_module: Value = null;
	let $0: any;
	f.vars = () => [msg, act_module, $0];
	msg = fmt("<span class='info'>*---------*\nThis is ＀ ＇<EM>！</EM>!\n", [rt.call(f, P("/proc/bicon"), null, [live(f.src)]), live(f.src)]);
	if (truthy(rt.sv(f, "desc"))) {
		msg = rt.modify(live(msg), fmt("＀\n", [rt.sv(f, "desc")]), add);
	}
	if (truthy((act_module = rt.callSrc(f, "get_active_held_item", [])))) {
		msg = rt.modify(live(msg), fmt("It is holding ＀ ＇！.\n", [rt.call(f, P("/proc/bicon"), null, [live(act_module)]), live(act_module)]), add);
	}
	msg = rt.modify(live(msg), "<span class='warning'>", add);
	if (truthy(rt.callName(f, live(f.src), "getBruteLoss", []))) {
		if (rt.lt(rt.callName(f, live(f.src), "getBruteLoss", []), multiply(rt.sv(f, "maxHealth"), 0.5))) {
			msg = rt.modify(live(msg), "It looks slightly dented.\n", add);
		} else {
			msg = rt.modify(live(msg), "<B>It looks severely dented!</B>\n", add);
		}
	}
	if (truthy(rt.callName(f, live(f.src), "getFireLoss", []))) {
		if (rt.lt(rt.callName(f, live(f.src), "getFireLoss", []), multiply(rt.sv(f, "maxHealth"), 0.5))) {
			msg = rt.modify(live(msg), "It looks slightly charred.\n", add);
		} else {
			msg = rt.modify(live(msg), "<B>It looks severely burnt and heat-warped!</B>\n", add);
		}
	}
	if (rt.lt(rt.fv(f, "health", live(f.src)), multiply(rt.neg(rt.sv(f, "maxHealth")), 0.5))) {
		msg = rt.modify(live(msg), "It looks barely operational.\n", add);
	}
	if (rt.lt(rt.fv(f, "fire_stacks", live(f.src)), 0)) {
		msg = rt.modify(live(msg), "It's covered in water.\n", add);
	} else {
		if (rt.gt(rt.fv(f, "fire_stacks", live(f.src)), 0)) {
			msg = rt.modify(live(msg), "It's coated in something flammable.\n", add);
		}
	}
	msg = rt.modify(live(msg), "</span>", add);
	if (truthy(rt.sv(f, "opened"))) {
		if (truthy(rt.sv(f, "cell"))) {
			$0 = "installed";
		} else {
			$0 = "missing";
		}
		msg = rt.modify(live(msg), fmt("<span class='warning'>Its cover is open and the power cell is ＀.</span>\n", [$0]), add);
	} else {
		if (truthy(rt.sv(f, "locked"))) {
			$0 = "";
		} else {
			$0 = ", and looks unlocked";
		}
		msg = rt.modify(live(msg), fmt("Its cover is closed＀.\n", [$0]), add);
	}
	if ((truthy(rt.sv(f, "cell")) && rt.le(rt.fv(f, "charge", rt.sv(f, "cell")), 0))) {
		msg = rt.modify(live(msg), "<span class='warning'>Its battery indicator is blinking red!</span>\n", add);
	}
	if (((truthy(rt.call(f, P("/proc/is_servant_of_ratvar"), null, [live(f.src)])) && truthy(rt.callName(f, live(f.args[0]), "Adjacent", [live(f.src)]))) && !truthy(rt.sv(f, "stat")))) {
		msg = rt.modify(live(msg), "<span class='warning'>Its eyes are glowing a blazing yellow!</span>\n", add);
	}
	$0 = rt.sv(f, "stat");
	if ($0 === 0) {
		if (truthy(rt.sv(f, "shell"))) {
			if (truthy(rt.sv(f, "deployed"))) {
				$0 = "active";
			} else {
				$0 = "empty";
			}
			msg = rt.modify(live(msg), fmt("It appears to be an ＀ AI shell.\n", [$0]), add);
		} else {
			if (!truthy(rt.sv(f, "client"))) {
				msg = rt.modify(live(msg), "It appears to be in stand-by mode.\n", add);
			}
		}
	} else if ($0 === 1) {
		msg = rt.modify(live(msg), "<span class='warning'>It doesn't seem to be responding.</span>\n", add);
	} else if ($0 === 2) {
		msg = rt.modify(live(msg), "<span class='deadsay'>It looks like its system is corrupted and requires a reset.</span>\n", add);
	}
	msg = rt.modify(live(msg), "*---------*</span>", add);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), live(msg)]);
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["user"] });
