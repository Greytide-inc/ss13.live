// Based on /tg/station's code/modules/mob/living/silicon/ai/examine.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



// examine.dm:2
rt.def("/mob/living/silicon/ai/proc/examine", function examine(f: Frame, user: Value) {
	let msg: Value = `<span class='info'>*---------*\nThis is ${bicon(this)} <EM>${this}</EM>!\n`;
	if (this.stat == 2) {
		msg += "<span class='deadsay'>It appears to be powered-down.</span>\n";
	} else {
		msg += "<span class='warning'>";
		if (this.getBruteLoss()) {
			if (this.getBruteLoss() < 30) {
				msg += "It looks slightly dented.\n";
			} else {
				msg += "<B>It looks severely dented!</B>\n";
			}
		}
		if (this.getFireLoss()) {
			if (this.getFireLoss() < 30) {
				msg += "It looks slightly charred.\n";
			} else {
				msg += "<B>Its casing is melted and heat-warped!</B>\n";
			}
		}
		msg += "</span>";
		if (this.deployed_shell) {
			msg += "The wireless networking light is blinking.\n";
		} else if (!this.shunted && !this.client) {
			msg += `${this}Core.exe has stopped responding! NTOS is searching for a solution to the problem...\n`;
		}
	}
	msg += "*---------*</span>";
	to_chat(user, msg);
	parent_proc();
	return f.dot;
}, false);
