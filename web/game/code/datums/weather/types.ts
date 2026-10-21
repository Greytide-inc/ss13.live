// Types declared in code/datums/weather that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../build/dist/src/translate/runtime.js";

rt.type(1055, "/datum/weather/ash_storm/emberfall", "/datum/weather/ash_storm", {
	name: "emberfall",
	desc: "A passing ash storm blankets the area in harmless embers.",
	weather_message: "<span class='notice'>Gentle embers waft down around you like grotesque snow. The storm seems to have passed you by...</span>",
	weather_sound: rt.rsc("sound/lavaland/ash_storm_windup.ogg"),
	weather_overlay: "light_ash",
	end_message: "<span class='notice'>The emberfall slows, stops. Another layer of hardened soot to the basalt beneath your feet.</span>",
	aesthetic: 1,
	probability: 10,
});
