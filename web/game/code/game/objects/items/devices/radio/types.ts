// Types declared in code/game/objects/items/devices/radio that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";

rt.type(9171, "/obj/item/device/radio/headset/syndicate/alt/leader", "/obj/item/device/radio/headset/syndicate/alt", {
	name: "team leader headset",
	command: 1,
});
rt.type(9186, "/obj/item/device/radio/headset/heads", "/obj/item/device/radio/headset", {
	command: 1,
});
rt.type(9203, "/obj/item/device/radio/mech", "/obj/item/device/radio", {});
rt.type(9206, "/obj/item/device/radio/intercom/unscrewed", "/obj/item/device/radio/intercom", {
	unfastened: 1,
});
rt.type(9209, "/obj/item/device/radio/off", "/obj/item/device/radio", {
	listening: 0,
	dog_fashion: rt.typePath("/datum/dog_fashion/back"),
});
rt.type(9336, "/obj/item/device/encryptionkey/binary", "/obj/item/device/encryptionkey", {
	translate_binary: 1,
	name: "binary translator key",
	desc: "An encryption key for a radio headset.  To access the binary channel, use :b.",
	icon_state: "bin_cypherkey",
	origin_tech: "syndicate=3;engineering=4;bluespace=3",
});
rt.type(9344, "/obj/item/device/encryptionkey/heads", "/obj/item/device/encryptionkey", {});
