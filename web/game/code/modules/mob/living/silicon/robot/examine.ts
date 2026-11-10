// Based on /tg/station's code/modules/mob/living/silicon/robot/examine.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { fmt } = rt;


// examine.dm:2
rt.def("/mob/living/silicon/robot/proc/examine", function examine(f: Frame, user: Value) {
	let act_module: Value = null;
	let $0: any;
	let msg: Value = fmt("<span class='info'>*---------*\nThis is ＀ ＇<EM>！</EM>!\n", [bicon(this), this]);
	if (this.desc) {
		msg += `${this.desc}\n`;
	}
	if (act_module = this.get_active_held_item()) {
		msg += fmt("It is holding ＀ ＇！.\n", [bicon(act_module), act_module]);
	}
	msg += "<span class='warning'>";
	if (this.getBruteLoss()) {
		if (this.getBruteLoss() < this.maxHealth * 0.5) {
			msg += "It looks slightly dented.\n";
		} else {
			msg += "<B>It looks severely dented!</B>\n";
		}
	}
	if (this.getFireLoss()) {
		if (this.getFireLoss() < this.maxHealth * 0.5) {
			msg += "It looks slightly charred.\n";
		} else {
			msg += "<B>It looks severely burnt and heat-warped!</B>\n";
		}
	}
	if (this.health < -this.maxHealth * 0.5) {
		msg += "It looks barely operational.\n";
	}
	if (this.fire_stacks < 0) {
		msg += "It's covered in water.\n";
	} else if (this.fire_stacks > 0) {
		msg += "It's coated in something flammable.\n";
	}
	msg += "</span>";
	if (this.opened) {
		if (this.cell) {
			$0 = "installed";
		} else {
			$0 = "missing";
		}
		msg += `<span class='warning'>Its cover is open and the power cell is ${$0}.</span>\n`;
	} else {
		msg += `Its cover is closed${this.locked ? "" : ", and looks unlocked"}.\n`;
	}
	if (this.cell && this.cell.charge <= 0) {
		msg += "<span class='warning'>Its battery indicator is blinking red!</span>\n";
	}
	if (is_servant_of_ratvar(this) && user.Adjacent(this) && !this.stat) {
		msg += "<span class='warning'>Its eyes are glowing a blazing yellow!</span>\n";
	}
	$0 = this.stat;
	if ($0 === 0) {
		if (this.shell) {
			if (this.deployed) {
				$0 = "active";
			} else {
				$0 = "empty";
			}
			msg += `It appears to be an ${$0} AI shell.\n`;
		} else if (!this.client) {
			msg += "It appears to be in stand-by mode.\n";
		}
	} else if ($0 === 1) {
		msg += "<span class='warning'>It doesn't seem to be responding.</span>\n";
	} else if ($0 === 2) {
		msg += "<span class='deadsay'>It looks like its system is corrupted and requires a reset.</span>\n";
	}
	msg += "*---------*</span>";
	to_chat(user, msg);
	parent_proc();
	return f.dot;
}, false);
