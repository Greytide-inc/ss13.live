// Types declared in code/modules/mob/living/silicon/robot that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";

rt.type(429, "/datum/emote/sound/silicon/buzz", "/datum/emote/sound/silicon", {
	key: "buzz",
	key_third_person: "buzzes",
	message: "buzzes.",
	message_param: "buzzes at %t.",
	sound: rt.rsc("sound/machines/buzz-sigh.ogg"),
});
rt.type(430, "/datum/emote/sound/silicon/buzz2", "/datum/emote/sound/silicon", {
	key: "buzz2",
	message: "buzzes twice.",
	sound: rt.rsc("sound/machines/buzz-two.ogg"),
});
rt.type(431, "/datum/emote/sound/silicon/chime", "/datum/emote/sound/silicon", {
	key: "chime",
	key_third_person: "chimes",
	message: "chimes.",
	sound: rt.rsc("sound/machines/chime.ogg"),
});
rt.type(432, "/datum/emote/sound/silicon/honk", "/datum/emote/sound/silicon", {
	key: "honk",
	key_third_person: "honks",
	message: "honks.",
	vary: 1,
	sound: rt.rsc("sound/items/bikehorn.ogg"),
});
rt.type(433, "/datum/emote/sound/silicon/ping", "/datum/emote/sound/silicon", {
	key: "ping",
	key_third_person: "pings",
	message: "pings.",
	message_param: "pings at %t.",
	sound: rt.rsc("sound/machines/ping.ogg"),
});
rt.type(434, "/datum/emote/sound/silicon/sad", "/datum/emote/sound/silicon", {
	key: "sad",
	message: "plays a sad trombone...",
	sound: rt.rsc("sound/misc/sadtrombone.ogg"),
});
rt.type(435, "/datum/emote/sound/silicon/warn", "/datum/emote/sound/silicon", {
	key: "warn",
	message: "blares an alarm!",
	sound: rt.rsc("sound/machines/warning-buzzer.ogg"),
});
rt.type(532, "/datum/emote/silicon/boop", "/datum/emote/silicon", {
	key: "boop",
	key_third_person: "boops",
	message: "boops.",
});
rt.type(4117, "/datum/robot_energy_storage/metal", "/datum/robot_energy_storage", {
	name: "Metal Synthesizer",
});
rt.type(4118, "/datum/robot_energy_storage/glass", "/datum/robot_energy_storage", {
	name: "Glass Synthesizer",
});
rt.type(4119, "/datum/robot_energy_storage/wire", "/datum/robot_energy_storage", {
	max_energy: 50,
	recharge_rate: 2,
	name: "Wire Synthesizer",
});
rt.type(4120, "/datum/robot_energy_storage/medical", "/datum/robot_energy_storage", {
	max_energy: 2500,
	recharge_rate: 250,
	name: "Medical Synthesizer",
});
rt.type(4121, "/datum/robot_energy_storage/beacon", "/datum/robot_energy_storage", {
	max_energy: 30,
	recharge_rate: 1,
	name: "Marker Beacon Storage",
});
rt.type(4837, "/mob/living/silicon/robot/syndicate/medical", "/mob/living/silicon/robot/syndicate", {
	playstyle_string: "<span class='userdanger'>You are a Syndicate medical cyborg!</span><br><b>You are armed with powerful medical tools to aid you in your mission: help the operatives secure the nuclear authentication disk. Your hypospray will produce Restorative Nanites, a wonder-drug that will heal most types of bodily damages, including clone and brain damage. It also produces morphine for offense. Your defibrillator paddles can revive operatives through their hardsuits, or can be used on harm intent to shock enemies! Your energy saw functions as a circular saw, but can be activated to deal more damage, and your operative pinpointer will find and locate fellow nuclear operatives. <i>Help the operatives secure the disk at all costs!</i></b>",
	icon_state: "syndi-medi",
	set_module: rt.typePath("/obj/item/weapon/robot_module/syndicate_medical"),
});
rt.type(4838, "/mob/living/silicon/robot/shell", "/mob/living/silicon/robot", {
	shell: 1,
});
