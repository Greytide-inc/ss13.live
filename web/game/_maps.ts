// The compile-time maps: loaded in this order before world/New(), each file's z-levels after the last one's
// (step 4; src/vm/dmm.ts reads them). In the DM source this was _maps/basemap.dm, #included by tgstation.dme.
// The station itself (z2) is a blank placeholder here: SSmapping loads the real one at runtime
// (code/modules/mapping/reader.dm), picked by config/maps.txt or data/next_map.json.
import * as rt from "../build/dist/src/translate/runtime.js";

rt.maps([
	"_maps/map_files/generic/Centcomm.dmm", // z1
	"_maps/map_files/generic/SpaceStation.dmm", // z2
	"_maps/map_files/generic/Space.dmm", // z3
	"_maps/map_files/generic/SpaceDock.dmm", // z4
	"_maps/map_files/Mining/Lavaland.dmm", // z5
]);
