// Types declared in interface that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../build/dist/src/translate/runtime.js";

rt.type(893, "/datum/verbs/menu/Icon/Size", "/datum/verbs/menu/Icon", {
	checkbox: 1,
	default: rt.procRef("/datum/verbs/menu/Icon/Size/verb/iconstretchtofit"),
});
rt.type(894, "/datum/verbs/menu/Icon/Scaling", "/datum/verbs/menu/Icon", {
	checkbox: 1,
	name: "Scaling Mode",
	default: rt.procRef("/datum/verbs/menu/Icon/Scaling/verb/NN"),
});
