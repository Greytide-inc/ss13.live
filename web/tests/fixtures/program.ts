// program.ts - the fixture program: the standard types and procs, then each section's fixture file.
import { rt } from "./lib.js";
import "./std.js";
import "./std-procs.js";
import "./sched.js";
import "./savefile.js";
import "./snapshot.js";
import "./restart.js";
import "./screen.js";
import "./los.js";
import "./ws.js";
import "./image.js";
import "./popup.js";
import "./topic.js";

rt.maps(["fixture/map.dmm"]);
