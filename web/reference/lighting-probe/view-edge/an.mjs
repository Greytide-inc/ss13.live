import { score } from "./fit2.mjs";
const col = [];
score("current", 0, { box: 0, collect: col });
const t = {};
for (const c of col) { const k = `mode${c.mode} ${c.by ? "B" : "V"} dx=${c.dx} dy=${c.dy} ${c.c.o}`; t[k] = (t[k] ?? 0) + 1; }
console.log(Object.entries(t).sort().map(([k, v]) => `${v} ${k}`).join("\n"));
