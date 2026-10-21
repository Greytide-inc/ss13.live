// Types declared in code/modules/mob/living/brain that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";

rt.type(526, "/datum/emote/brain/alarm", "/datum/emote/brain", {
	key: "alarm",
	message: "sounds an alarm.",
	emote_type: 2,
});
rt.type(527, "/datum/emote/brain/alert", "/datum/emote/brain", {
	key: "alert",
	message: "lets out a distressed noise.",
	emote_type: 2,
});
rt.type(528, "/datum/emote/brain/flash", "/datum/emote/brain", {
	key: "flash",
	message: "blinks their lights.",
});
rt.type(529, "/datum/emote/brain/notice", "/datum/emote/brain", {
	key: "notice",
	message: "plays a loud tone.",
	emote_type: 2,
});
rt.type(530, "/datum/emote/brain/whistle", "/datum/emote/brain", {
	key: "whistle",
	key_third_person: "whistles",
	message: "whistles.",
	emote_type: 2,
});
rt.type(9463, "/obj/item/organ/brain/changeling_brain", "/obj/item/organ/brain", {
	decoy_override: 1,
	vital: 0,
});
rt.type(9464, "/obj/item/organ/brain/alien", "/obj/item/organ/brain", {
	name: "alien brain",
	desc: "We barely understand the brains of terrestial animals. Who knows what we may find in the brain of such an advanced species?",
	icon_state: "brain-x",
	origin_tech: "biotech=6",
});
