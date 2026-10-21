// Types declared in code/modules/reagents/chemistry that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";

rt.type(3536, "/datum/reagent/drug", "/datum/reagent", {
	name: "Drug",
	id: "drug",
	metabolization_rate: 0.2,
	taste_description: "bitterness",
});
rt.type(3539, "/datum/reagent/drug/menthol", "/datum/reagent/drug", {
	name: "Menthol",
	id: "menthol",
	description: "Tastes naturally minty, and imparts a very mild numbing sensation.",
	taste_description: "mint",
	reagent_state: 2,
	color: "#80AF9C",
});
rt.type(3600, "/datum/reagent/liquidgibs", "/datum/reagent", {
	name: "Liquid gibs",
	id: "liquidgibs",
	color: "#FF9966",
	description: "You don't even want to think about what's in here.",
	taste_description: "gross iron",
	shot_glass_icon_state: "shotglassred",
});
rt.type(3629, "/datum/reagent/copper", "/datum/reagent", {
	name: "Copper",
	id: "copper",
	description: "A highly ductile metal. Things made out of copper aren't very durable, but it makes a decent material for electrical wiring.",
	reagent_state: 1,
	color: "#6E3B08",
	taste_description: "metal",
});
rt.type(3631, "/datum/reagent/hydrogen", "/datum/reagent", {
	name: "Hydrogen",
	id: "hydrogen",
	description: "A colorless, odorless, nonmetallic, tasteless, highly combustible diatomic gas.",
	reagent_state: 3,
	color: "#808080",
	taste_mult: 0,
});
rt.type(3632, "/datum/reagent/potassium", "/datum/reagent", {
	name: "Potassium",
	id: "potassium",
	description: "A soft, low-melting solid that can easily be cut with a knife. Reacts violently with water.",
	reagent_state: 1,
	color: "#A0A0A0",
	taste_description: "sweetness",
});
rt.type(3634, "/datum/reagent/sulfur", "/datum/reagent", {
	name: "Sulfur",
	id: "sulfur",
	description: "A sickly yellow solid mostly known for its nasty smell. It's actually much more helpful than it looks in biochemisty.",
	reagent_state: 1,
	color: "#BF8C00",
	taste_description: "rotten eggs",
});
rt.type(3638, "/datum/reagent/sodium", "/datum/reagent", {
	name: "Sodium",
	id: "sodium",
	description: "A soft silver metal that can easily be cut with a knife. It's not salt just yet, so refrain from putting in on your chips.",
	reagent_state: 1,
	color: "#808080",
	taste_description: "salty metal",
});
rt.type(3639, "/datum/reagent/phosphorus", "/datum/reagent", {
	name: "Phosphorus",
	id: "phosphorus",
	description: "A ruddy red powder that burns readily. Though it comes in many colors, the general theme is always the same.",
	reagent_state: 1,
	color: "#832828",
	taste_description: "vinegar",
});
rt.type(3641, "/datum/reagent/glycerol", "/datum/reagent", {
	name: "Glycerol",
	id: "glycerol",
	description: "Glycerol is a simple polyol compound. Glycerol is sweet-tasting and of low toxicity.",
	color: "#808080",
	taste_description: "sweetness",
});
rt.type(3647, "/datum/reagent/gold", "/datum/reagent", {
	name: "Gold",
	id: "gold",
	description: "Gold is a dense, soft, shiny metal and the most malleable and ductile metal known.",
	reagent_state: 1,
	color: "#F7C430",
	taste_description: "expensive metal",
});
rt.type(3654, "/datum/reagent/aluminium", "/datum/reagent", {
	name: "Aluminium",
	id: "aluminium",
	description: "A silvery white and ductile member of the boron group of chemical elements.",
	reagent_state: 1,
	color: "#A8A8A8",
	taste_description: "metal",
});
rt.type(3655, "/datum/reagent/silicon", "/datum/reagent", {
	name: "Silicon",
	id: "silicon",
	description: "A tetravalent metalloid, silicon is less reactive than its chemical analog carbon.",
	reagent_state: 1,
	color: "#A8A8A8",
	taste_mult: 0,
});
rt.type(3661, "/datum/reagent/fluorosurfactant", "/datum/reagent", {
	name: "Fluorosurfactant",
	id: "fluorosurfactant",
	description: "A perfluoronated sulfonic acid that forms a foam when mixed with water.",
	color: "#9E6B38",
	taste_description: "metal",
});
rt.type(3662, "/datum/reagent/foaming_agent", "/datum/reagent", {
	name: "Foaming agent",
	id: "foaming_agent",
	description: "A agent that yields metallic foam when mixed with light metal and a strong acid.",
	reagent_state: 1,
	color: "#664B63",
	taste_description: "metal",
});
rt.type(3663, "/datum/reagent/ammonia", "/datum/reagent", {
	name: "Ammonia",
	id: "ammonia",
	description: "A caustic substance commonly used in fertilizer or household cleaners.",
	reagent_state: 3,
	color: "#404030",
	taste_description: "mordant",
});
rt.type(3664, "/datum/reagent/diethylamine", "/datum/reagent", {
	name: "Diethylamine",
	id: "diethylamine",
	description: "A secondary amine, mildly corrosive.",
	color: "#604030",
	taste_description: "iron",
});
rt.type(3682, "/datum/reagent/oil", "/datum/reagent", {
	name: "Oil",
	id: "oil",
	description: "Burns in a small smoky fire, mostly used to get Ash.",
	reagent_state: 2,
	color: "#C8A5DC",
	taste_description: "oil",
});
rt.type(3684, "/datum/reagent/iodine", "/datum/reagent", {
	name: "Iodine",
	id: "iodine",
	description: "Commonly added to table salt as a nutrient. On its own it tastes far less pleasing.",
	reagent_state: 2,
	color: "#C8A5DC",
	taste_description: "metal",
});
rt.type(3686, "/datum/reagent/bromine", "/datum/reagent", {
	name: "Bromine",
	id: "bromine",
	description: "A brownish liquid that's highly reactive. Useful for stopping free radicals, but not intended for human consumption.",
	reagent_state: 2,
	color: "#C8A5DC",
	taste_description: "chemicals",
});
rt.type(3687, "/datum/reagent/phenol", "/datum/reagent", {
	name: "Phenol",
	id: "phenol",
	description: "An aromatic ring of carbon with a hydroxyl group. A useful precursor to some medicines, but has no healing properties on its own.",
	reagent_state: 2,
	color: "#C8A5DC",
	taste_description: "acid",
});
rt.type(3688, "/datum/reagent/ash", "/datum/reagent", {
	name: "Ash",
	id: "ash",
	description: "Supposedly phoenixes rise from these, but you've never seen it.",
	reagent_state: 2,
	color: "#C8A5DC",
	taste_description: "ash",
});
rt.type(3689, "/datum/reagent/acetone", "/datum/reagent", {
	name: "Acetone",
	id: "acetone",
	description: "A slick, slightly carcinogenic liquid. Has a multitude of mundane uses in everyday life.",
	reagent_state: 2,
	color: "#C8A5DC",
	taste_description: "acid",
});
rt.type(3693, "/datum/reagent/saltpetre", "/datum/reagent", {
	name: "Saltpetre",
	id: "saltpetre",
	description: "Volatile. Controversial. Third Thing.",
	reagent_state: 2,
	color: "#60A584",
	taste_description: "cool salt",
});
rt.type(3694, "/datum/reagent/lye", "/datum/reagent", {
	name: "Lye",
	id: "lye",
	description: "Also known as sodium hydroxide. As a profession making this is somewhat underwhelming.",
	reagent_state: 2,
	color: "#FFFFD6",
	taste_description: "acid",
});
rt.type(3753, "/datum/reagent/plastic_polymers", "/datum/reagent", {
	name: "plastic polymers",
	id: "plastic_polymers",
	description: "the petroleum based components of plastic.",
	color: "#f7eded",
	taste_description: "plastic",
});
rt.type(3759, "/datum/reagent/nitroglycerin", "/datum/reagent", {
	name: "Nitroglycerin",
	id: "nitroglycerin",
	description: "Nitroglycerin is a heavy, colorless, oily, explosive liquid obtained by nitrating glycerol.",
	color: "#808080",
	taste_description: "oil",
});
rt.type(3760, "/datum/reagent/stabilizing_agent", "/datum/reagent", {
	name: "Stabilizing Agent",
	id: "stabilizing_agent",
	description: "Keeps unstable chemicals stable. This does not work on everything.",
	reagent_state: 2,
	color: "#FFFF00",
	taste_description: "metal",
});
rt.type(3762, "/datum/reagent/sorium", "/datum/reagent", {
	name: "Sorium",
	id: "sorium",
	description: "Sends everything flying from the detonation point.",
	reagent_state: 2,
	color: "#5A64C8",
	taste_description: "air and bitterness",
});
rt.type(3763, "/datum/reagent/liquid_dark_matter", "/datum/reagent", {
	name: "Liquid Dark Matter",
	id: "liquid_dark_matter",
	description: "Sucks everything into the detonation point.",
	reagent_state: 2,
	color: "#210021",
	taste_description: "compressed bitterness",
});
rt.type(3765, "/datum/reagent/flash_powder", "/datum/reagent", {
	name: "Flash Powder",
	id: "flash_powder",
	description: "Makes a very bright flash.",
	reagent_state: 2,
	color: "#C8C8C8",
	taste_description: "salt",
});
rt.type(3766, "/datum/reagent/smoke_powder", "/datum/reagent", {
	name: "Smoke Powder",
	id: "smoke_powder",
	description: "Makes a large cloud of smoke that can carry reagents.",
	reagent_state: 2,
	color: "#C8C8C8",
	taste_description: "smoke",
});
rt.type(3767, "/datum/reagent/sonic_powder", "/datum/reagent", {
	name: "Sonic Powder",
	id: "sonic_powder",
	description: "Makes a deafening noise.",
	reagent_state: 2,
	color: "#C8C8C8",
	taste_description: "loud noises",
});
