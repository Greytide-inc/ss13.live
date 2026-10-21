// Types declared in code/game/machinery/telecomms/machines that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";

rt.type(10709, "/obj/machinery/telecomms/relay/preset", "/obj/machinery/telecomms/relay", {
	network: "tcommsat",
});
rt.type(10723, "/obj/machinery/telecomms/broadcaster/preset_left/birdstation", "/obj/machinery/telecomms/broadcaster/preset_left", {
	name: "Broadcaster",
});
rt.type(10726, "/obj/machinery/telecomms/hub/preset", "/obj/machinery/telecomms/hub", {
	id: "Hub",
	network: "tcommsat",
	autolinkers: null,
});
rt.type(10729, "/obj/machinery/telecomms/processor/preset_one/birdstation", "/obj/machinery/telecomms/processor/preset_one", {
	name: "Processor",
});
