// Types declared in code/game/turfs/simulated/floor that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";

rt.type(4531, "/turf/open/floor/plating/dirt", "/turf/open/floor/plating", {
	name: "dirt",
	desc: "Upon closer examination, it's still dirt.",
	icon: rt.rsc("icons/turf/floors.dmi"),
	icon_state: "dirt",
	baseturf: rt.typePath("/turf/open/chasm/straight_down/jungle"),
	initial_gas_mix: "o2=14;n2=23;TEMP=300",
	planetary_atmos: 1,
});
rt.type(4532, "/turf/open/floor/plating/dirt/dark", "/turf/open/floor/plating/dirt", {
	icon_state: "greenerdirt",
});
rt.type(4533, "/turf/open/floor/plating/airless", "/turf/open/floor/plating", {
	icon_state: "plating",
	initial_gas_mix: "TEMP=2.7",
});
rt.type(4534, "/turf/open/floor/plating/airless/astplate", "/turf/open/floor/plating/airless", {
	icon_state: "asteroidplating",
});
rt.type(4536, "/turf/open/floor/plating/abductor2", "/turf/open/floor/plating", {
	name: "alien plating",
	icon_state: "alienplating",
});
rt.type(4537, "/turf/open/floor/plating/astplate", "/turf/open/floor/plating", {
	icon_state: "asteroidplating",
});
rt.type(4544, "/turf/open/floor/plating/ice", "/turf/open/floor/plating", {
	name: "ice sheet",
	desc: "A sheet of solid ice. Looks slippery.",
	icon: rt.rsc("icons/turf/snow.dmi"),
	icon_state: "ice",
	temperature: 180,
	baseturf: rt.typePath("/turf/open/floor/plating/ice"),
	slowdown: 1,
	wet: 4,
});
rt.type(4545, "/turf/open/floor/plating/ice/colder", "/turf/open/floor/plating/ice", {
	temperature: 140,
});
rt.type(4546, "/turf/open/floor/plating/ice/temperate", "/turf/open/floor/plating/ice", {
	temperature: 255.37,
});
rt.type(4547, "/turf/open/floor/plating/snowed", "/turf/open/floor/plating", {
	name: "snowed-over plating",
	desc: "A section of plating covered in a light layer of snow.",
	icon: rt.rsc("icons/turf/snow.dmi"),
	icon_state: "snowplating",
	temperature: 180,
});
rt.type(4548, "/turf/open/floor/plating/snowed/colder", "/turf/open/floor/plating/snowed", {
	temperature: 140,
});
rt.type(4549, "/turf/open/floor/plating/snowed/temperatre", "/turf/open/floor/plating/snowed", {
	temperature: 255.37,
});
rt.type(4554, "/turf/open/floor/wood/cold", "/turf/open/floor/wood", {
	temperature: 255.37,
});
rt.type(4555, "/turf/open/floor/wood/airless", "/turf/open/floor/wood", {
	initial_gas_mix: "TEMP=2.7",
});
rt.type(4570, "/turf/open/floor/mineral/gold", "/turf/open/floor/mineral", {
	icons: null,
	name: "gold floor",
	icon_state: "gold",
	floor_tile: rt.typePath("/obj/item/stack/tile/mineral/gold"),
});
rt.type(4571, "/turf/open/floor/mineral/silver", "/turf/open/floor/mineral", {
	icons: null,
	name: "silver floor",
	icon_state: "silver",
	floor_tile: rt.typePath("/obj/item/stack/tile/mineral/silver"),
});
rt.type(4572, "/turf/open/floor/mineral/titanium", "/turf/open/floor/mineral", {
	icons: null,
	name: "shuttle floor",
	icon_state: "shuttlefloor3",
	floor_tile: rt.typePath("/obj/item/stack/tile/mineral/titanium"),
});
rt.type(4573, "/turf/open/floor/mineral/titanium/blue", "/turf/open/floor/mineral/titanium", {
	icons: null,
	icon_state: "shuttlefloor",
});
rt.type(4574, "/turf/open/floor/mineral/titanium/blue/airless", "/turf/open/floor/mineral/titanium/blue", {
	initial_gas_mix: "TEMP=2.7",
});
rt.type(4575, "/turf/open/floor/mineral/titanium/yellow", "/turf/open/floor/mineral/titanium", {
	icons: null,
	icon_state: "shuttlefloor2",
});
rt.type(4576, "/turf/open/floor/mineral/titanium/yellow/airless", "/turf/open/floor/mineral/titanium/yellow", {
	initial_gas_mix: "TEMP=2.7",
});
rt.type(4577, "/turf/open/floor/mineral/titanium/airless", "/turf/open/floor/mineral/titanium", {
	initial_gas_mix: "TEMP=2.7",
});
rt.type(4578, "/turf/open/floor/mineral/titanium/purple", "/turf/open/floor/mineral/titanium", {
	icons: null,
	icon_state: "shuttlefloor5",
});
rt.type(4579, "/turf/open/floor/mineral/titanium/purple/airless", "/turf/open/floor/mineral/titanium/purple", {
	initial_gas_mix: "TEMP=2.7",
});
rt.type(4580, "/turf/open/floor/mineral/plastitanium", "/turf/open/floor/mineral", {
	icons: null,
	name: "shuttle floor",
	icon_state: "shuttlefloor4",
	floor_tile: rt.typePath("/obj/item/stack/tile/mineral/plastitanium"),
});
rt.type(4581, "/turf/open/floor/mineral/plastitanium/airless", "/turf/open/floor/mineral/plastitanium", {
	initial_gas_mix: "TEMP=2.7",
});
rt.type(4582, "/turf/open/floor/mineral/plastitanium/brig", "/turf/open/floor/mineral/plastitanium", {
	name: "Brig floor",
});
rt.type(4584, "/turf/open/floor/mineral/bananium/airless", "/turf/open/floor/mineral/bananium", {
	initial_gas_mix: "TEMP=2.7",
});
rt.type(4585, "/turf/open/floor/mineral/diamond", "/turf/open/floor/mineral", {
	icons: null,
	name: "diamond floor",
	icon_state: "diamond",
	floor_tile: rt.typePath("/obj/item/stack/tile/mineral/diamond"),
});
rt.type(4591, "/turf/open/floor/circuit/off", "/turf/open/floor/circuit", {
	on: 0,
	icon_state: "bcircuitoff",
});
rt.type(4592, "/turf/open/floor/circuit/airless", "/turf/open/floor/circuit", {
	initial_gas_mix: "TEMP=2.7",
});
rt.type(4593, "/turf/open/floor/circuit/telecomms", "/turf/open/floor/circuit", {
	initial_gas_mix: "n2=100;TEMP=80",
});
rt.type(4594, "/turf/open/floor/circuit/green", "/turf/open/floor/circuit", {
	icon_normal: "gcircuit",
	icon_state: "gcircuit",
	light_color: "#64C864",
	floor_tile: rt.typePath("/obj/item/stack/tile/circuit/green"),
});
rt.type(4595, "/turf/open/floor/circuit/green/off", "/turf/open/floor/circuit/green", {
	on: 0,
	icon_state: "gcircuitoff",
});
rt.type(4596, "/turf/open/floor/circuit/green/anim", "/turf/open/floor/circuit/green", {
	icon_normal: "gcircuitanim",
	icon_state: "gcircuitanim",
	floor_tile: rt.typePath("/obj/item/stack/tile/circuit/green/anim"),
});
rt.type(4597, "/turf/open/floor/circuit/green/airless", "/turf/open/floor/circuit/green", {
	initial_gas_mix: "TEMP=2.7",
});
rt.type(4598, "/turf/open/floor/circuit/green/telecomms", "/turf/open/floor/circuit/green", {
	initial_gas_mix: "n2=100;TEMP=80",
});
rt.type(4599, "/turf/open/floor/circuit/red", "/turf/open/floor/circuit", {
	icon_normal: "rcircuit",
	icon_state: "rcircuit",
	light_color: "#FA644B",
	floor_tile: rt.typePath("/obj/item/stack/tile/circuit/red"),
});
rt.type(4600, "/turf/open/floor/circuit/red/off", "/turf/open/floor/circuit/red", {
	on: 0,
	icon_state: "rcircuitoff",
});
rt.type(4601, "/turf/open/floor/circuit/red/anim", "/turf/open/floor/circuit/red", {
	icon_normal: "rcircuitanim",
	icon_state: "rcircuitanim",
	floor_tile: rt.typePath("/obj/item/stack/tile/circuit/red/anim"),
});
rt.type(4602, "/turf/open/floor/circuit/red/airless", "/turf/open/floor/circuit/red", {
	initial_gas_mix: "TEMP=2.7",
});
rt.type(4603, "/turf/open/floor/circuit/red/telecomms", "/turf/open/floor/circuit/red", {
	initial_gas_mix: "n2=100;TEMP=80",
});
rt.type(4613, "/turf/open/floor/plasteel/airless", "/turf/open/floor/plasteel", {
	initial_gas_mix: "TEMP=2.7",
});
rt.type(4614, "/turf/open/floor/plasteel/airless/black", "/turf/open/floor/plasteel/airless", {
	icon_state: "dark",
});
rt.type(4615, "/turf/open/floor/plasteel/airless/white", "/turf/open/floor/plasteel/airless", {
	icon_state: "white",
});
rt.type(4616, "/turf/open/floor/plasteel/airless/asteroid", "/turf/open/floor/plasteel/airless", {
	icon_state: "asteroidfloor",
});
rt.type(4617, "/turf/open/floor/plasteel/airless/floorgrime", "/turf/open/floor/plasteel/airless", {
	icon_state: "floorgrime",
});
rt.type(4618, "/turf/open/floor/plasteel/airless/solarpanel", "/turf/open/floor/plasteel/airless", {
	icon_state: "solarpanel",
});
rt.type(4619, "/turf/open/floor/plasteel/airless/bar", "/turf/open/floor/plasteel/airless", {
	icon_state: "bar",
});
rt.type(4620, "/turf/open/floor/plasteel/airless/cafeteria", "/turf/open/floor/plasteel/airless", {
	icon_state: "cafeteria",
});
rt.type(4621, "/turf/open/floor/plasteel/black", "/turf/open/floor/plasteel", {
	icon_state: "dark",
});
rt.type(4622, "/turf/open/floor/plasteel/black/side", "/turf/open/floor/plasteel/black", {
	icon_state: "black",
});
rt.type(4623, "/turf/open/floor/plasteel/black/corner", "/turf/open/floor/plasteel/black", {
	icon_state: "blackcorner",
});
rt.type(4624, "/turf/open/floor/plasteel/white", "/turf/open/floor/plasteel", {
	icon_state: "white",
});
rt.type(4625, "/turf/open/floor/plasteel/white/side", "/turf/open/floor/plasteel/white", {
	icon_state: "whitehall",
});
rt.type(4626, "/turf/open/floor/plasteel/white/corner", "/turf/open/floor/plasteel/white", {
	icon_state: "whitecorner",
});
rt.type(4627, "/turf/open/floor/plasteel/brown", "/turf/open/floor/plasteel", {
	icon_state: "brown",
});
rt.type(4628, "/turf/open/floor/plasteel/brown/corner", "/turf/open/floor/plasteel/brown", {
	icon_state: "browncorner",
});
rt.type(4629, "/turf/open/floor/plasteel/darkbrown", "/turf/open/floor/plasteel", {
	icon_state: "darkbrownfull",
});
rt.type(4630, "/turf/open/floor/plasteel/darkbrown/side", "/turf/open/floor/plasteel/darkbrown", {
	icon_state: "darkbrown",
});
rt.type(4631, "/turf/open/floor/plasteel/darkbrown/corner", "/turf/open/floor/plasteel/darkbrown", {
	icon_state: "darkbrowncorners",
});
rt.type(4632, "/turf/open/floor/plasteel/green", "/turf/open/floor/plasteel", {
	icon_state: "greenfull",
});
rt.type(4633, "/turf/open/floor/plasteel/green/side", "/turf/open/floor/plasteel/green", {
	icon_state: "green",
});
rt.type(4634, "/turf/open/floor/plasteel/green/corner", "/turf/open/floor/plasteel/green", {
	icon_state: "greencorner",
});
rt.type(4635, "/turf/open/floor/plasteel/darkgreen", "/turf/open/floor/plasteel", {
	icon_state: "darkgreenfull",
});
rt.type(4636, "/turf/open/floor/plasteel/darkgreen/side", "/turf/open/floor/plasteel/darkgreen", {
	icon_state: "darkgreen",
});
rt.type(4637, "/turf/open/floor/plasteel/darkgreen/corner", "/turf/open/floor/plasteel/darkgreen", {
	icon_state: "darkgreencorners",
});
rt.type(4638, "/turf/open/floor/plasteel/whitegreen", "/turf/open/floor/plasteel", {
	icon_state: "whitegreenfull",
});
rt.type(4639, "/turf/open/floor/plasteel/whitegreen/side", "/turf/open/floor/plasteel/whitegreen", {
	icon_state: "whitegreen",
});
rt.type(4640, "/turf/open/floor/plasteel/whitegreen/corner", "/turf/open/floor/plasteel/whitegreen", {
	icon_state: "whitegreencorner",
});
rt.type(4641, "/turf/open/floor/plasteel/red", "/turf/open/floor/plasteel", {
	icon_state: "redfull",
});
rt.type(4642, "/turf/open/floor/plasteel/red/side", "/turf/open/floor/plasteel/red", {
	icon_state: "red",
});
rt.type(4643, "/turf/open/floor/plasteel/red/corner", "/turf/open/floor/plasteel/red", {
	icon_state: "redcorner",
});
rt.type(4644, "/turf/open/floor/plasteel/darkred", "/turf/open/floor/plasteel", {
	icon_state: "darkredfull",
});
rt.type(4645, "/turf/open/floor/plasteel/darkred/side", "/turf/open/floor/plasteel/darkred", {
	icon_state: "darkred",
});
rt.type(4646, "/turf/open/floor/plasteel/darkred/corner", "/turf/open/floor/plasteel/darkred", {
	icon_state: "darkredcorners",
});
rt.type(4647, "/turf/open/floor/plasteel/whitered", "/turf/open/floor/plasteel", {
	icon_state: "whiteredfull",
});
rt.type(4648, "/turf/open/floor/plasteel/whitered/side", "/turf/open/floor/plasteel/whitered", {
	icon_state: "whitered",
});
rt.type(4649, "/turf/open/floor/plasteel/whitered/corner", "/turf/open/floor/plasteel/whitered", {
	icon_state: "whiteredcorner",
});
rt.type(4650, "/turf/open/floor/plasteel/blue", "/turf/open/floor/plasteel", {
	icon_state: "bluefull",
});
rt.type(4651, "/turf/open/floor/plasteel/blue/side", "/turf/open/floor/plasteel/blue", {
	icon_state: "blue",
});
rt.type(4652, "/turf/open/floor/plasteel/blue/corner", "/turf/open/floor/plasteel/blue", {
	icon_state: "bluecorner",
});
rt.type(4653, "/turf/open/floor/plasteel/darkblue", "/turf/open/floor/plasteel", {
	icon_state: "darkbluefull",
});
rt.type(4654, "/turf/open/floor/plasteel/darkblue/side", "/turf/open/floor/plasteel/darkblue", {
	icon_state: "darkblue",
});
rt.type(4655, "/turf/open/floor/plasteel/darkblue/corner", "/turf/open/floor/plasteel/darkblue", {
	icon_state: "darkbluecorners",
});
rt.type(4656, "/turf/open/floor/plasteel/whiteblue", "/turf/open/floor/plasteel", {
	icon_state: "whitebluefull",
});
rt.type(4657, "/turf/open/floor/plasteel/whiteblue/side", "/turf/open/floor/plasteel/whiteblue", {
	icon_state: "whiteblue",
});
rt.type(4658, "/turf/open/floor/plasteel/whiteblue/corner", "/turf/open/floor/plasteel/whiteblue", {
	icon_state: "whitebluecorner",
});
rt.type(4659, "/turf/open/floor/plasteel/yellow", "/turf/open/floor/plasteel", {
	icon_state: "yellowfull",
});
rt.type(4660, "/turf/open/floor/plasteel/yellow/side", "/turf/open/floor/plasteel/yellow", {
	icon_state: "yellow",
});
rt.type(4661, "/turf/open/floor/plasteel/yellow/corner", "/turf/open/floor/plasteel/yellow", {
	icon_state: "yellowcorner",
});
rt.type(4662, "/turf/open/floor/plasteel/darkyellow", "/turf/open/floor/plasteel", {
	icon_state: "darkyellowfull",
});
rt.type(4663, "/turf/open/floor/plasteel/darkyellow/side", "/turf/open/floor/plasteel/darkyellow", {
	icon_state: "darkyellow",
});
rt.type(4664, "/turf/open/floor/plasteel/darkyellow/corner", "/turf/open/floor/plasteel/darkyellow", {
	icon_state: "darkyellowcorners",
});
rt.type(4665, "/turf/open/floor/plasteel/whiteyellow", "/turf/open/floor/plasteel", {
	icon_state: "whiteyellowfull",
});
rt.type(4666, "/turf/open/floor/plasteel/whiteyellow/side", "/turf/open/floor/plasteel/whiteyellow", {
	icon_state: "whiteyellow",
});
rt.type(4667, "/turf/open/floor/plasteel/whiteyellow/corner", "/turf/open/floor/plasteel/whiteyellow", {
	icon_state: "whiteyellowcorner",
});
rt.type(4668, "/turf/open/floor/plasteel/purple", "/turf/open/floor/plasteel", {
	icon_state: "purplefull",
});
rt.type(4669, "/turf/open/floor/plasteel/purple/side", "/turf/open/floor/plasteel/purple", {
	icon_state: "purple",
});
rt.type(4670, "/turf/open/floor/plasteel/purple/corner", "/turf/open/floor/plasteel/purple", {
	icon_state: "purplecorner",
});
rt.type(4671, "/turf/open/floor/plasteel/darkpurple", "/turf/open/floor/plasteel", {
	icon_state: "darkpurplefull",
});
rt.type(4672, "/turf/open/floor/plasteel/darkpurple/side", "/turf/open/floor/plasteel/darkpurple", {
	icon_state: "darkpurple",
});
rt.type(4673, "/turf/open/floor/plasteel/darkpurple/corner", "/turf/open/floor/plasteel/darkpurple", {
	icon_state: "darkpurplecorners",
});
rt.type(4674, "/turf/open/floor/plasteel/whitepurple", "/turf/open/floor/plasteel", {
	icon_state: "whitepurplefull",
});
rt.type(4675, "/turf/open/floor/plasteel/whitepurple/side", "/turf/open/floor/plasteel/whitepurple", {
	icon_state: "whitepurple",
});
rt.type(4676, "/turf/open/floor/plasteel/whitepurple/corner", "/turf/open/floor/plasteel/whitepurple", {
	icon_state: "whitepurplecorner",
});
rt.type(4677, "/turf/open/floor/plasteel/orange", "/turf/open/floor/plasteel", {
	icon_state: "orangefull",
});
rt.type(4678, "/turf/open/floor/plasteel/orange/side", "/turf/open/floor/plasteel/orange", {
	icon_state: "orange",
});
rt.type(4679, "/turf/open/floor/plasteel/orange/corner", "/turf/open/floor/plasteel/orange", {
	icon_state: "orangecorner",
});
rt.type(4680, "/turf/open/floor/plasteel/neutral", "/turf/open/floor/plasteel", {
	icon_state: "neutralfull",
});
rt.type(4681, "/turf/open/floor/plasteel/neutral/side", "/turf/open/floor/plasteel/neutral", {
	icon_state: "neutral",
});
rt.type(4682, "/turf/open/floor/plasteel/neutral/corner", "/turf/open/floor/plasteel/neutral", {
	icon_state: "neutralcorner",
});
rt.type(4683, "/turf/open/floor/plasteel/arrival", "/turf/open/floor/plasteel", {
	icon_state: "arrival",
});
rt.type(4684, "/turf/open/floor/plasteel/arrival/corner", "/turf/open/floor/plasteel/arrival", {
	icon_state: "arrivalcorner",
});
rt.type(4685, "/turf/open/floor/plasteel/caution", "/turf/open/floor/plasteel", {
	icon_state: "caution",
});
rt.type(4686, "/turf/open/floor/plasteel/caution/corner", "/turf/open/floor/plasteel/caution", {
	icon_state: "cautioncorner",
});
rt.type(4687, "/turf/open/floor/plasteel/escape", "/turf/open/floor/plasteel", {
	icon_state: "escape",
});
rt.type(4688, "/turf/open/floor/plasteel/escape/corner", "/turf/open/floor/plasteel/escape", {
	icon_state: "escapecorner",
});
rt.type(4689, "/turf/open/floor/plasteel/whitebot", "/turf/open/floor/plasteel", {
	icon_state: "whitebot",
});
rt.type(4690, "/turf/open/floor/plasteel/whitebot/delivery", "/turf/open/floor/plasteel/whitebot", {
	icon_state: "whitedelivery",
});
rt.type(4691, "/turf/open/floor/plasteel/redyellow", "/turf/open/floor/plasteel", {
	icon_state: "redyellowfull",
});
rt.type(4692, "/turf/open/floor/plasteel/redyellow/side", "/turf/open/floor/plasteel/redyellow", {
	icon_state: "redyellow",
});
rt.type(4693, "/turf/open/floor/plasteel/redblue", "/turf/open/floor/plasteel", {
	icon_state: "redbluefull",
});
rt.type(4694, "/turf/open/floor/plasteel/redblue/blueside", "/turf/open/floor/plasteel/redblue", {
	icon_state: "bluered",
});
rt.type(4695, "/turf/open/floor/plasteel/redblue/redside", "/turf/open/floor/plasteel/redblue", {
	icon_state: "redblue",
});
rt.type(4696, "/turf/open/floor/plasteel/redgreen", "/turf/open/floor/plasteel", {
	icon_state: "redgreenfull",
});
rt.type(4697, "/turf/open/floor/plasteel/redgreen/side", "/turf/open/floor/plasteel/redgreen", {
	icon_state: "redgreen",
});
rt.type(4698, "/turf/open/floor/plasteel/greenyellow", "/turf/open/floor/plasteel", {
	icon_state: "greenyellowfull",
});
rt.type(4699, "/turf/open/floor/plasteel/greenyellow/side", "/turf/open/floor/plasteel/greenyellow", {
	icon_state: "greenyellow",
});
rt.type(4700, "/turf/open/floor/plasteel/greenblue", "/turf/open/floor/plasteel", {
	icon_state: "greenbluefull",
});
rt.type(4701, "/turf/open/floor/plasteel/greenblue/side", "/turf/open/floor/plasteel/greenblue", {
	icon_state: "greenblue",
});
rt.type(4702, "/turf/open/floor/plasteel/blueyellow", "/turf/open/floor/plasteel", {
	icon_state: "blueyellowfull",
});
rt.type(4703, "/turf/open/floor/plasteel/blueyellow/side", "/turf/open/floor/plasteel/blueyellow", {
	icon_state: "blueyellow",
});
rt.type(4704, "/turf/open/floor/plasteel/warningline", "/turf/open/floor/plasteel", {
	icon_state: "warningline",
});
rt.type(4705, "/turf/open/floor/plasteel/warningline/corner", "/turf/open/floor/plasteel/warningline", {
	icon_state: "warninglinecorners",
});
rt.type(4706, "/turf/open/floor/plasteel/yellowsiding", "/turf/open/floor/plasteel", {
	icon_state: "yellowsiding",
});
rt.type(4707, "/turf/open/floor/plasteel/yellowsiding/corner", "/turf/open/floor/plasteel/yellowsiding", {
	icon_state: "yellowcornersiding",
});
rt.type(4708, "/turf/open/floor/plasteel/podhatch", "/turf/open/floor/plasteel", {
	icon_state: "podhatch",
});
rt.type(4709, "/turf/open/floor/plasteel/podhatch/corner", "/turf/open/floor/plasteel/podhatch", {
	icon_state: "podhatchcorner",
});
rt.type(4710, "/turf/open/floor/plasteel/loadingarea", "/turf/open/floor/plasteel", {
	icon_state: "loadingarea",
});
rt.type(4711, "/turf/open/floor/plasteel/loadingarea/dirty", "/turf/open/floor/plasteel/loadingarea", {
	icon_state: "loadingareadirty1",
});
rt.type(4712, "/turf/open/floor/plasteel/loadingarea/dirtydirty", "/turf/open/floor/plasteel/loadingarea", {
	icon_state: "loadingareadirty2",
});
rt.type(4713, "/turf/open/floor/plasteel/asteroid", "/turf/open/floor/plasteel", {
	icon_state: "asteroidfloor",
});
rt.type(4714, "/turf/open/floor/plasteel/recharge_floor", "/turf/open/floor/plasteel", {
	icon_state: "recharge_floor",
});
rt.type(4715, "/turf/open/floor/plasteel/recharge_floor/asteroid", "/turf/open/floor/plasteel/recharge_floor", {
	icon_state: "recharge_floor_asteroid",
});
rt.type(4716, "/turf/open/floor/plasteel/chapel", "/turf/open/floor/plasteel", {
	icon_state: "chapel",
});
rt.type(4717, "/turf/open/floor/plasteel/showroomfloor", "/turf/open/floor/plasteel", {
	icon_state: "showroomfloor",
});
rt.type(4718, "/turf/open/floor/plasteel/floorgrime", "/turf/open/floor/plasteel", {
	icon_state: "floorgrime",
});
rt.type(4719, "/turf/open/floor/plasteel/solarpanel", "/turf/open/floor/plasteel", {
	icon_state: "solarpanel",
});
rt.type(4720, "/turf/open/floor/plasteel/cmo", "/turf/open/floor/plasteel", {
	icon_state: "cmo",
});
rt.type(4721, "/turf/open/floor/plasteel/barber", "/turf/open/floor/plasteel", {
	icon_state: "barber",
});
rt.type(4722, "/turf/open/floor/plasteel/hydrofloor", "/turf/open/floor/plasteel", {
	icon_state: "hydrofloor",
});
rt.type(4723, "/turf/open/floor/plasteel/delivery", "/turf/open/floor/plasteel", {
	icon_state: "delivery",
});
rt.type(4724, "/turf/open/floor/plasteel/bot", "/turf/open/floor/plasteel", {
	icon_state: "bot",
});
rt.type(4725, "/turf/open/floor/plasteel/freezer", "/turf/open/floor/plasteel", {
	icon_state: "freezerfloor",
});
rt.type(4726, "/turf/open/floor/plasteel/bar", "/turf/open/floor/plasteel", {
	icon_state: "bar",
});
rt.type(4727, "/turf/open/floor/plasteel/grimy", "/turf/open/floor/plasteel", {
	icon_state: "grimy",
});
rt.type(4728, "/turf/open/floor/plasteel/cafeteria", "/turf/open/floor/plasteel", {
	icon_state: "cafeteria",
});
rt.type(4729, "/turf/open/floor/plasteel/vault", "/turf/open/floor/plasteel", {
	icon_state: "vault",
});
rt.type(4730, "/turf/open/floor/plasteel/cult", "/turf/open/floor/plasteel", {
	icon_state: "cult",
	name: "engraved floor",
});
rt.type(4731, "/turf/open/floor/plasteel/cult/airless", "/turf/open/floor/plasteel/cult", {
	initial_gas_mix: "TEMP=2.7",
});
rt.type(4732, "/turf/open/floor/plasteel/vaporwave", "/turf/open/floor/plasteel", {
	icon_state: "pinkblack",
});
rt.type(4733, "/turf/open/floor/plasteel/goonplaque", "/turf/open/floor/plasteel", {
	icon_state: "plaque",
	name: "Commemorative Plaque",
	desc: "\"This is a plaque in honour of our comrades on the G4407 Stations. Hopefully TG4407 model can live up to your fame and fortune.\" Scratched in beneath that is a crude image of a meteor and a spaceman. The spaceman is laughing. The meteor is exploding.",
});
rt.type(4734, "/turf/open/floor/plasteel/stage_bottom", "/turf/open/floor/plasteel", {
	icon_state: "stage_bottom",
});
rt.type(4735, "/turf/open/floor/plasteel/stage_left", "/turf/open/floor/plasteel", {
	icon_state: "stage_left",
});
rt.type(4736, "/turf/open/floor/plasteel/stage_bleft", "/turf/open/floor/plasteel", {
	icon_state: "stage_bleft",
});
rt.type(4737, "/turf/open/floor/plasteel/stairs", "/turf/open/floor/plasteel", {
	icon_state: "stairs",
});
rt.type(4738, "/turf/open/floor/plasteel/stairs/left", "/turf/open/floor/plasteel/stairs", {
	icon_state: "stairs-l",
});
rt.type(4739, "/turf/open/floor/plasteel/stairs/medium", "/turf/open/floor/plasteel/stairs", {
	icon_state: "stairs-m",
});
rt.type(4740, "/turf/open/floor/plasteel/stairs/right", "/turf/open/floor/plasteel/stairs", {
	icon_state: "stairs-r",
});
rt.type(4741, "/turf/open/floor/plasteel/stairs/old", "/turf/open/floor/plasteel/stairs", {
	icon_state: "stairs-old",
});
rt.type(4742, "/turf/open/floor/plasteel/brownold", "/turf/open/floor/plasteel", {
	icon_state: "brownold",
});
rt.type(4743, "/turf/open/floor/plasteel/brownold/corner", "/turf/open/floor/plasteel/brownold", {
	icon_state: "browncornerold",
});
rt.type(4744, "/turf/open/floor/plasteel/rockvault", "/turf/open/floor/plasteel", {
	icon_state: "rockvault",
});
rt.type(4745, "/turf/open/floor/plasteel/rockvault/alien", "/turf/open/floor/plasteel/rockvault", {
	icon_state: "alienvault",
});
rt.type(4746, "/turf/open/floor/plasteel/rockvault/sandstone", "/turf/open/floor/plasteel/rockvault", {
	icon_state: "sandstonevault",
});
rt.type(4747, "/turf/open/floor/plasteel/elevatorshaft", "/turf/open/floor/plasteel", {
	icon_state: "elevatorshaft",
});
rt.type(4748, "/turf/open/floor/plasteel/bluespace", "/turf/open/floor/plasteel", {
	icon_state: "bluespace",
});
rt.type(4749, "/turf/open/floor/plasteel/sepia", "/turf/open/floor/plasteel", {
	icon_state: "sepia",
});
rt.type(4750, "/turf/open/floor/plasteel/sandy", "/turf/open/floor/plasteel", {
	icon_state: "sandy",
	baseturf: rt.typePath("/turf/open/floor/plating/beach/sand"),
});
rt.type(4751, "/turf/open/floor/plasteel/sandeffect", "/turf/open/floor/plasteel", {
	icon_state: "sandeffect",
});
rt.type(4752, "/turf/open/floor/plasteel/sandeffect/warning", "/turf/open/floor/plasteel/sandeffect", {
	icon_state: "warningsandeffect",
});
rt.type(4753, "/turf/open/floor/plasteel/sandeffect/warning/corner", "/turf/open/floor/plasteel/sandeffect/warning", {
	icon_state: "warningsandeffectcorners",
});
rt.type(4754, "/turf/open/floor/plasteel/shuttle", "/turf/open/floor/plasteel", {});
rt.type(4755, "/turf/open/floor/plasteel/shuttle/red", "/turf/open/floor/plasteel/shuttle", {});
rt.type(4756, "/turf/open/floor/plasteel/shuttle/red/syndicate", "/turf/open/floor/plasteel/shuttle/red", {
	name: "floor",
});
rt.type(4758, "/turf/open/floor/engine/airless", "/turf/open/floor/engine", {
	initial_gas_mix: "TEMP=2.7",
});
rt.type(4759, "/turf/open/floor/engine/n2o", "/turf/open/floor/engine", {
	name: "n2o floor",
	initial_gas_mix: "n2o=6000;TEMP=293.15",
});
rt.type(4760, "/turf/open/floor/engine/co2", "/turf/open/floor/engine", {
	name: "co2 floor",
	initial_gas_mix: "co2=50000;TEMP=293.15",
});
rt.type(4761, "/turf/open/floor/engine/plasma", "/turf/open/floor/engine", {
	name: "plasma floor",
	initial_gas_mix: "plasma=70000;TEMP=293.15",
});
rt.type(4762, "/turf/open/floor/engine/o2", "/turf/open/floor/engine", {
	name: "o2 floor",
	initial_gas_mix: "o2=100000;TEMP=293.15",
});
rt.type(4763, "/turf/open/floor/engine/n2", "/turf/open/floor/engine", {
	name: "n2 floor",
	initial_gas_mix: "n2=100000;TEMP=293.15",
});
rt.type(4764, "/turf/open/floor/engine/air", "/turf/open/floor/engine", {
	name: "air floor",
	initial_gas_mix: "o2=2644;n2=10580;TEMP=293.15",
});
rt.type(4766, "/turf/open/floor/engine/cult/airless", "/turf/open/floor/engine/cult", {
	initial_gas_mix: "TEMP=2.7",
});
rt.type(4767, "/turf/open/floor/engine/vacuum", "/turf/open/floor/engine", {
	name: "vacuum floor",
	initial_gas_mix: "TEMP=2.7",
});
