// lobby-art - The lobby picture: one of 13 animated SS13.LIVE designs, picked at random each page load, drawn on a canvas over the map view
// while the player is in the lobby (plans/lobby-art.md). Ported from the picked mockup (plans/lobby-art/mockup.html): each design is
// {name, desc, draw(ctx, t)} on a 480x480 canvas, t in seconds. Sprites are cut from the game's own icons/ (plans/lobby-art/dmi.py), one PNG
// per strip in img/lobby/ (32 px frames side by side), fetched the first time the lobby shows.
const LOGO = "SS13.LIVE", TAGLINE = "Space Station 13 in your browser";
const FRAMES = {"ian":1,"ianside":1,"cat":1,"clown":1,"nt":1,"syndi":1,"wizard":1,"secbot":1,"medibot":1,"ai":15,"aimalf":15,"floor":1,"dark":1,"plating":1,"station":1,"crew_clown_s":1,"crew_clown_e":1,"crew_clown_w":1,"crew_nt_s":1,"crew_nt_e":1,"crew_nt_w":1,"crew_syndi_s":1,"crew_syndi_e":1,"crew_syndi_w":1,"crew_wizard_s":1,"crew_wizard_e":1,"crew_wizard_w":1,"crew_pirate_s":1,"crew_pirate_e":1,"crew_pirate_w":1,"crew_skel_s":1,"crew_skel_e":1,"crew_skel_w":1,"crew_russ_s":1,"crew_russ_e":1,"crew_russ_w":1,"crew_templar_s":1,"crew_templar_e":1,"crew_templar_w":1,"crew_eskimo_s":1,"crew_eskimo_e":1,"crew_eskimo_w":1,"crew_secbot_s":1,"crew_secbot_e":1,"crew_secbot_w":1,"crew_ian_s":1,"crew_ian_e":1,"crew_ian_w":1,"crew_cat_s":1,"crew_cat_e":1,"crew_cat_w":1,"crew_monkey_s":1,"crew_monkey_e":1,"crew_monkey_w":1,"crew_borg_s":1,"crew_borg_e":1,"crew_borg_w":1,"crew_drone_s":1,"crew_drone_e":1,"crew_drone_w":1,"crew_secborg_s":1,"crew_secborg_e":1,"crew_secborg_w":1,"crew_medborg_s":1,"crew_medborg_e":1,"crew_medborg_w":1,"crew_wood":1,"crew_white":1,"crew_black":1,"crew_bar":1,"alert_wall":1,"alert_fdoor":1,"alert_light":8,"alert_clownE":1,"alert_ntE":1,"alert_wizE":1,"alert_syndiE":1,"alert_ianE":1,"alert_nuke2":3,"monk_sci_s":1,"monk_mk_s":1,"monk_ian_s":1,"monk_clown_s":1,"monk_sci_e":1,"monk_mk_e":1,"monk_ian_e":1,"monk_clown_e":1,"monk_sci_w":1,"monk_mk_w":1,"monk_ian_w":1,"monk_clown_w":1,"monk_banana":1,"monk_peel":1,"monk_hat_tophat":1,"monk_hati_tophat":1,"monk_hat_chef":1,"monk_hati_chef":1,"monk_hat_captain":1,"monk_hati_captain":1,"monk_hat_beret":1,"monk_hati_beret":1,"monk_floor":1,"monk_white":1,"silly_door":8,"silly_peel":1,"silly_horn":1,"silly_cone":1,"silly_clownE":1,"silly_clownW":1,"silly_ntE":1,"silly_ntW":1,"silly_russE":1,"silly_russW":1,"silly_secbot":1,"silly_ianE":1,"silly_wall":1}; // sprite name -> frame count
const S = {}, IMG = {};
for (const k in FRAMES) S[k] = { n: FRAMES[k] };

// all text on the lobby canvas: bold DejaVu Sans Mono with hard pixel edges (no blur), same look as the logo. Patched on the one context only.
function crispText(ctx) {
	const raw = CanvasRenderingContext2D.prototype.fillText, cache = new Map();
	ctx.fillText = function (s, x, y) {
		if (typeof this.fillStyle !== "string") return raw.apply(this, arguments);
		const size = Math.round(parseFloat((this.font.match(/([\d.]+)px/) || [0, 12])[1])); s = String(s);
		const key = s + "|" + size + "|" + this.fillStyle + "|" + this.textBaseline; let o = cache.get(key);
		if (!o) {
			o = document.createElement("canvas"); const g = o.getContext("2d"), f = `bold ${size}px "DejaVu Sans Mono",monospace`;
			g.font = f; const w = Math.ceil(g.measureText(s).width) + 4; o.width = w; o.height = size * 3; g.font = f; g.textBaseline = this.textBaseline; g.fillStyle = "#fff"; g.fillText(s, 2, Math.round(size * 1.5));
			const d = g.getImageData(0, 0, o.width, o.height); for (let i = 3; i < d.data.length; i += 4) d.data[i] = d.data[i] > 110 ? 255 : 0; g.putImageData(d, 0, 0);
			g.globalCompositeOperation = "source-in"; g.fillStyle = this.fillStyle; g.fillRect(0, 0, o.width, o.height); o.tw = w - 4;
			if (cache.size > 3000) cache.clear(); cache.set(key, o);
		}
		const al = this.textAlign, dx = al === "center" ? -o.tw / 2 : (al === "right" || al === "end") ? -o.tw : 0;
		const sm = this.imageSmoothingEnabled; this.imageSmoothingEnabled = false; this.drawImage(o, Math.round(x + dx - 2), Math.round(y - size * 1.5)); this.imageSmoothingEnabled = sm;
	};
}

// ---- the designs, as in the mockup (dense on purpose: edit them there or here, not both) ----
const W=480;
function spr(c,k,x,y,sc=1,f=0){const n=S[k].n;c.drawImage(IMG[k],32*(f%n),0,32,32,Math.round(x),Math.round(y),32*sc,32*sc);}
function rng(seed){return()=>{seed=(seed*16807)%2147483647;return seed/2147483647;}}
function stars(seed,n){const r=rng(seed);return Array.from({length:n},()=>({x:r()*W,y:r()*W,z:r(),tw:r()*6}));}
const ST=stars(7,260);
function starfield(c,t,speed=6,dx=-1,dy=0){c.fillStyle='#000';c.fillRect(0,0,W,W);
 for(const s of ST){const sp=speed*(0.15+s.z);let x=((s.x+dx*t*sp)%W+W)%W,y=((s.y+dy*t*sp)%W+W)%W;
  const a=0.35+0.65*s.z*(0.7+0.3*Math.sin(t*2+s.tw));c.fillStyle=`rgba(${200+55*s.z|0},${210+45*s.z|0},255,${a})`;
  const sz=s.z>0.93?2:1;c.fillRect(x|0,y|0,sz,sz);}}
const txtCache={};
function pixText(c,text,cx,y,px,scale,col,glow){const key=text+px;let o=txtCache[key];
 if(!o){o=document.createElement('canvas');const g=o.getContext('2d');g.font=`bold ${px}px "DejaVu Sans Mono",monospace`;
  const w=Math.ceil(g.measureText(text).width)+2;o.width=w;o.height=px+4;g.font=`bold ${px}px "DejaVu Sans Mono",monospace`;g.fillStyle='#fff';g.textBaseline='top';g.fillText(text,1,1);
  const d=g.getImageData(0,0,o.width,o.height);for(let i=3;i<d.data.length;i+=4)d.data[i]=d.data[i]>110?255:0;g.putImageData(d,0,0);txtCache[key]=o;}
 const w=o.width*scale,h=o.height*scale,x=Math.round(cx-w/2);
 const t2=document.createElement('canvas');t2.width=o.width;t2.height=o.height;const g2=t2.getContext('2d');g2.drawImage(o,0,0);g2.globalCompositeOperation='source-in';g2.fillStyle=col;g2.fillRect(0,0,o.width,o.height);
 c.save();c.imageSmoothingEnabled=false;if(glow){c.shadowColor=glow;c.shadowBlur=14;}
 c.drawImage(t2,x,y,w,h);if(glow)c.drawImage(t2,x,y,w,h);c.restore();return{x,w,h};}
const L=()=>LOGO,TG=()=>TAGLINE;
function smallText(c,s,x,y,col,al='center',size=12){c.font=`${size}px "DejaVu Sans Mono",monospace`;c.textAlign=al;c.fillStyle=col;c.fillText(s,x,y);c.textAlign='left';}


const designs=[];
// ---- crew family helpers (crw_ prefix) ----
const crwBottom={monkey:24,secbot:29,medborg:15};
// draw sprite k (like 'crew_ian_e' or 'ian') so its feet touch feetY, centred on cx
function crwPut(c,k,cx,feetY,sc,f=0,shadow=true,hover=0){
 const base=k.replace(/^crew_/,'').replace(/_[sew]$/,'');
 const bot=crwBottom[base]||32;
 if(shadow){c.fillStyle='rgba(0,0,0,.28)';c.beginPath();c.ellipse(Math.round(cx),Math.round(feetY),11*sc,2.2*sc,0,0,7);c.fill();}
 spr(c,k,Math.round(cx)-16*sc,Math.round(feetY-bot*sc-hover),sc,f);}
const crwFace=(t,i)=>{const n=Math.floor(t/4+i*1.7)%3;return n==0?'e':n==1?'w':'s';};
// logo sits on stars: soft dark glow behind so it always reads
function crwLogo(c,y,col,glow,tagY,tagCol){
 pixText(c,L(),W/2,y,16,4,col,glow);smallText(c,TG(),W/2,tagY,tagCol);}

designs.push(
{name:'2. The crew',desc:'A line-up of station regulars standing on the deck in front of a big window full of stars: clown, officer, wizard, syndie, Beepsky, Ian, with the station AI watching from its wall screen.',draw(c,t){
 starfield(c,t,3);
 // window frame + sill
 c.fillStyle='#46525e';c.fillRect(0,0,W,6);c.fillRect(0,0,8,208);c.fillRect(W-8,0,8,208);
 c.fillStyle='#8a97a3';c.fillRect(0,198,W,12);c.fillStyle='#b8c4cf';c.fillRect(0,198,W,3);c.fillStyle='#5a6672';c.fillRect(0,208,W,2);
 // wall below window
 c.fillStyle='#27313d';c.fillRect(0,210,W,74);
 for(let x=0;x<W;x+=60){c.fillStyle='#1e2832';c.fillRect(x,210,2,74);}
 // AI wall screen with bracket
 const ax=W/2-44;
 c.fillStyle='#14191f';c.fillRect(ax-4,206,96,82);c.fillStyle='#5a6672';c.fillRect(ax-4,206,96,3);c.fillRect(ax-4,285,96,3);c.fillRect(ax-4,206,3,82);c.fillRect(ax+89,206,3,82);
 c.fillStyle='#04121c';c.fillRect(ax,212,88,70);
 c.save();c.beginPath();c.rect(ax,212,88,70);c.clip();spr(c,'ai',W/2-32,214,2,Math.floor(t*8)%S.ai.n);
 c.fillStyle='rgba(0,0,0,.18)';for(let y=212;y<282;y+=3)c.fillRect(ax,y,88,1);c.restore();
 c.fillStyle=Math.floor(t*1.5)%2?'#4f6':'#183';c.fillRect(ax+80,276,4,4);
 // baseboard + deck
 c.fillStyle='#6a7580';c.fillRect(0,284,W,6);c.fillStyle='#8a97a3';c.fillRect(0,284,W,2);
 for(let x=0;x<W;x+=32){for(let y=290;y<W;y+=32)spr(c,'floor',x,y);}
 // fade the far end of the deck, light pool under the crew
 let g=c.createLinearGradient(0,290,0,480);g.addColorStop(0,'rgba(0,10,25,.55)');g.addColorStop(.6,'rgba(0,10,25,.1)');g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.fillRect(0,290,W,190);
 // crew
 const crew=['clown','nt','wizard','syndi','secbot','ian'],step=Math.floor(t*2);
 crew.forEach((k,i)=>{const hop=((step+i)%2)?0:3;crwPut(c,'crew_'+k+'_s',66+i*69.6,448,3,0,true,hop*(k=='secbot'?0:1));});
 // logo
 crwLogo(c,36,'#fff','#4af',128,'#9bc');}},

{name:'2a. Departures lounge',desc:'The crew waiting for the shuttle in a bright white lounge, a big window of stars with the station drifting slowly by below the logo, a countdown board ticking, and the odd mumbled word.',draw(c,t){
 starfield(c,t,3);
 // station drifts past low in the window, fading in and out at the edges (loops with no jump)
 const per=120,u=(t%per)/per,sw=300,sm=IMG.station,sh=sw*sm.height/sm.width;
 c.save();c.beginPath();c.rect(8,150,W-16,48);c.clip();
 c.globalAlpha=.85*Math.min(1,u*8,(1-u)*8);c.drawImage(sm,Math.round(W+20-u*(W+sw+40)),174-Math.round(sh/2),sw,sh);c.restore();
 // window frame and sill (no mullions through the logo)
 c.fillStyle='#46525e';c.fillRect(0,0,W,6);c.fillRect(0,0,8,214);c.fillRect(W-8,0,8,214);
 c.fillStyle='#8a97a3';c.fillRect(0,200,W,14);c.fillStyle='#b8c4cf';c.fillRect(0,200,W,3);
 // wall + board
 c.fillStyle='#2b3440';c.fillRect(0,214,W,42);
 c.fillStyle='#000';c.fillRect(100,220,280,26);c.strokeStyle='#8a97a3';c.strokeRect(100.5,220.5,279,25);
 const left=300-Math.floor(t)%300,mm=Math.floor(left/60),ss=left%60;
 smallText(c,'EVAC SHUTTLE  DEPARTS '+mm+':'+String(ss).padStart(2,'0'),W/2,238,Math.floor(t*2)%2?'#fb3':'#d90','center',13);
 // floor
 for(let x=0;x<W;x+=32)for(let y=256;y<W;y+=32)spr(c,'crew_white',x,y);
 c.fillStyle='rgba(20,30,50,.3)';c.fillRect(0,256,W,6);
 const g=c.createLinearGradient(0,256,0,480);g.addColorStop(0,'rgba(20,30,60,.35)');g.addColorStop(1,'rgba(20,30,60,0)');c.fillStyle=g;c.fillRect(0,256,W,224);
 // crew: back row small and offset between the front row, front row big
 const back=['crew_wizard','crew_monkey','crew_pirate','crew_borg'],front=['crew_clown','crew_nt','crew_syndi','crew_secbot','crew_ian'];
 const face=(i,s)=>crwFace(t+s*4,i);
 back.forEach((k,i)=>{const hop=Math.sin(t*1.3+i*2)>.93?4:0;crwPut(c,k+'_'+face(i,0),84+i*104,330,2,0,true,hop);});
 front.forEach((k,i)=>{const hop=Math.sin(t*1.1+i*3)>.95?6:0;crwPut(c,k+'_'+face(i,5),48+i*96,448,3,0,true,hop);});
 // mumble bubble above one of the front row
 const who=Math.floor(t/3)%front.length,ph=t%3;
 if(ph<1.6){const bx=48+who*96-4,by=346;c.fillStyle='#fff';c.fillRect(bx-16,by-18,40,16);c.fillRect(bx-2,by-3,6,5);
  c.fillStyle='#222';const dots=1+Math.floor(ph*2)%3;for(let d=0;d<dots;d++)c.fillRect(bx-15+d*10,by-11,4,4);}
 crwLogo(c,40,'#fff','#4af',130,'#cde');}},

{name:'2b. Corridor cam',desc:'A security-camera view of a station hallway: stars and the station drift past the windows while the whole crew (and Ian, and a cyborg) keep marching past in both directions, with a REC light and a ticking clock.',draw(c,t){
 c.fillStyle='#1b2430';c.fillRect(0,0,W,W);
 // wall panel seams + ceiling light strip
 for(let x=0;x<W;x+=48){c.fillStyle='#222d3a';c.fillRect(x,120,2,148);}
 c.fillStyle='#34414f';c.fillRect(0,126,W,4);c.fillStyle='#9cb';c.fillRect(0,126,W,1);
 // three windows onto one shared sky, the station drifting past behind them
 const sm=IMG.station,sw=220,sh=sw*sm.height/sm.width;
 for(let i=0;i<3;i++){const x=20+i*152;c.save();c.beginPath();c.rect(x,150,130,90);c.clip();
  starfield(c,t,10,-1,0);
  const gg=c.createLinearGradient(0,150,0,240);gg.addColorStop(0,'rgba(40,70,140,.35)');gg.addColorStop(1,'rgba(10,20,50,0)');c.fillStyle=gg;c.fillRect(x,150,130,90);
  const px=W-(((t+40)*9)%(W+sw+120));c.globalAlpha=.7;c.drawImage(sm,Math.round(px),195-Math.round(sh/2),sw,sh);c.globalAlpha=1;
  // glass glint
  c.fillStyle='rgba(255,255,255,.07)';c.beginPath();c.moveTo(x+20,150);c.lineTo(x+46,150);c.lineTo(x+16,240);c.lineTo(x-10,240);c.fill();
  c.restore();
  c.strokeStyle='#6c7885';c.lineWidth=4;c.strokeRect(x,150,130,90);c.lineWidth=1;
  c.fillStyle='#8a97a3';c.fillRect(x-4,240,138,4);}
 c.fillStyle='#2b3644';c.fillRect(0,244,W,24);c.fillStyle='#c33';c.fillRect(0,252,W,4);
 // floor
 for(let x=0;x<W;x+=32)for(let y=268;y<W;y+=32){spr(c,'floor',x,y);}
 c.fillStyle='rgba(0,0,0,.2)';c.fillRect(0,268,W,6);
 // marchers
 const east=['crew_clown','crew_wizard','crew_ian','crew_secborg','crew_monkey'],west=['crew_nt','crew_syndi','crew_secbot','crew_drone','crew_cat','crew_borg'];
 const Lp=W+160;
 west.forEach((k,i)=>{const x=((i*(Lp/west.length)-t*22)%Lp+Lp)%Lp-80,b=Math.floor(t*5+i)%2?2:0;crwPut(c,k+'_w',x+32,330,2,0,true,b);});
 east.forEach((k,i)=>{const x=((i*(Lp/east.length)+t*34)%Lp+Lp)%Lp-100,b=Math.floor(t*6+i)%2?3:0;crwPut(c,k+'_e',x+48,430,3,0,true,b);});
 // logo plate with AI wall monitor
 c.fillStyle='rgba(0,0,0,.55)';c.fillRect(0,20,W,100);
 c.fillStyle='#0b1210';c.fillRect(10,40,52,52);c.strokeStyle='#6c7885';c.strokeRect(10.5,40.5,51,51);
 spr(c,'ai',20,48,1,Math.floor(t*8)%S.ai.n);
 pixText(c,L(),W/2,32,16,4,'#e8f4e8','#5c8');smallText(c,TG(),W/2,108,'#9c9');
 // camera overlay
 c.fillStyle='rgba(20,60,30,.18)';c.fillRect(0,0,W,W);
 for(let y=0;y<W;y+=3){c.fillStyle='rgba(0,0,0,.22)';c.fillRect(0,y,W,1);}
 const vg=c.createRadialGradient(W/2,W/2,160,W/2,W/2,350);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.7)');c.fillStyle=vg;c.fillRect(0,0,W,W);
 c.fillStyle='#f33';if(Math.floor(t*1.5)%2){c.beginPath();c.arc(30,462,6,0,7);c.fill();}
 smallText(c,'REC  CAM 04 - MAIN HALL',44,467,'#cfc','left',12);
 const tt=Math.floor(t)+43200+1234;smallText(c,String(Math.floor(tt/3600)%24).padStart(2,'0')+':'+String(Math.floor(tt/60)%60).padStart(2,'0')+':'+String(tt%60).padStart(2,'0'),W-14,467,'#cfc','right',12);}},

{name:'2c. Line-up',desc:'A security identification line-up: five suspects shuffling in front of a height chart while a spotlight sweeps along them, a camera flash pops every few seconds, and Beepsky stands guard.',draw(c,t){
 c.fillStyle='#7f94a8';c.fillRect(0,0,W,W);
 // height chart on wall: one line per foot from the floor, labelled
 const FL=438;
 for(let ft=3;ft<=10;ft++){const y=FL-ft*16,maj=ft%2==0;c.fillStyle=maj?'#1a2736':'#2c3b4c';c.fillRect(0,y,W,maj?2:1);if(maj)smallText(c,ft+"'",10,y-3,'#1a2736','left',10);}
 smallText(c,'HEIGHT',W-10,FL-10*16-6,'#1a2736','right',10);
 // floor
 c.fillStyle='#394552';c.fillRect(0,420,W,60);for(let x=0;x<W;x+=32)for(let y=420;y<W;y+=32)spr(c,'dark',x,y);
 c.fillStyle='#e8d34a';c.fillRect(0,416,W,4);
 const sx=(Math.sin(t*0.7)*0.5+0.5)*(72*4)+50;
 const sus=['crew_syndi','crew_pirate','crew_clown','crew_skel','crew_wizard'];
 sus.forEach((k,i)=>{const cx=50+i*72,d=Math.abs(cx-sx);
  const shuf=Math.floor(t*2+i*3)%7==0?4:0;
  c.save();c.filter='brightness('+(d<46?1:0.5)+')';
  crwPut(c,k+'_s',cx,FL,3,0,true,shuf);c.restore();
  c.fillStyle='#f4f4f0';c.fillRect(cx-16,447,32,22);c.fillStyle='#222';c.font='bold 16px "DejaVu Sans Mono",monospace';c.textAlign='center';c.fillText(String(i+1),cx,464);c.textAlign='left';});
 // spotlight cone
 const sg=c.createLinearGradient(0,0,0,FL);sg.addColorStop(0,'rgba(255,250,200,.30)');sg.addColorStop(1,'rgba(255,250,200,.06)');
 c.fillStyle=sg;c.beginPath();c.moveTo(sx-8,0);c.lineTo(sx+8,0);c.lineTo(sx+52,FL);c.lineTo(sx-52,FL);c.fill();
 // Beepsky guarding in the right margin, clear of the suspects
 crwPut(c,'crew_secbot_w',430,FL,2,0,true,Math.round(Math.sin(t*3)*1.5+2));
 // AI wall monitor
 c.fillStyle='#0a1118';c.fillRect(6,34,40,40);c.strokeStyle='#e8d34a';c.strokeRect(6.5,34.5,39,39);spr(c,'ai',10,38,1,Math.floor(t*8)%S.ai.n);
 // logo sign
 c.fillStyle='#14202c';c.fillRect(56,14,368,92);c.strokeStyle='#e8d34a';c.lineWidth=3;c.strokeRect(57.5,15.5,365,89);c.lineWidth=1;
 pixText(c,L(),W/2,26,16,4,'#fff','#e8d34a');smallText(c,TG(),W/2,98,'#cdb');
 // camera flash every 3 s: sharp pop with a quick fade
 const fp=(t+1)%3;if(fp<0.4){c.fillStyle='rgba(255,255,255,'+(0.8*(1-fp/0.4)*(1-fp/0.4))+')';c.fillRect(0,0,W,W);}}}
);

designs.push(
{name:'3a. Corridor run',desc:'A station hallway at ground level: crew, Ian and a wizard sprint past under flashing fire-alarm lights while red sirens sweep the walls.',draw(c,t){
 c.fillStyle='#000';c.fillRect(0,0,W,W);c.save();c.imageSmoothingEnabled=false;
 const sp=70,off=-Math.floor((t*sp)%96),woff=-Math.floor((t*sp*.5)%96);
 for(let x=woff;x<W;x+=96)for(let y=0;y<192;y+=96)spr(c,'alert_wall',x,y,3);
 for(let x=off;x<W;x+=96)for(let y=216;y<W;y+=96)spr(c,'floor',x,y,3);
 // skirting line between wall and floor
 c.fillStyle='#000';c.fillRect(0,192,W,24);c.fillStyle='#d9b400';c.fillRect(0,192,W,4);c.fillStyle='#222';c.fillRect(0,196,W,2);
 for(let x=off*2%48-48;x<W;x+=48){c.fillStyle='#111';c.fillRect(x,192,24,4);}
 c.fillStyle='rgba(0,0,0,.4)';c.fillRect(0,0,W,192);c.fillStyle='rgba(0,0,0,.3)';c.fillRect(0,198,W,W);
 // fire doors in the wall, scrolling with the camera
 for(let k=0;k<3;k++){const x=(((k*240-t*sp*.5)%720)+720)%720-120;spr(c,'alert_fdoor',x,100,3);}
 const p=0.5+0.5*Math.sin(t*5);
 const lights=[0,1,2].map(k=>(((k*240+120-t*sp*.5)%720)+720)%720-120);
 c.save();c.globalCompositeOperation='lighter';
 lights.forEach((lx,i)=>{c.save();c.translate(lx+48,130);c.rotate(t*3+i*2.1);
  const g=c.createRadialGradient(0,0,0,0,0,260);g.addColorStop(0,'rgba(255,50,30,.45)');g.addColorStop(1,'rgba(255,0,0,0)');
  c.fillStyle=g;for(let h=0;h<2;h++){c.beginPath();c.moveTo(0,0);c.arc(0,0,260,-.35,.35);c.closePath();c.fill();c.rotate(Math.PI);}c.restore();});
 c.restore();
 lights.forEach(lx=>spr(c,'alert_light',lx,112,3,Math.floor(t*10)));
 c.restore();
 const crew=[['alert_wizE',100,90,4,360],['alert_ntE',340,90,4,360],['alert_ntE',580,90,4,360],['alert_clownE',0,120,5,466],['alert_ianE',240,120,5,466],['alert_syndiE',480,120,5,466]];
 crew.forEach(([k,x0,v,sc,fy],i)=>{const x=(((x0+t*v)%(W+240))+W+240)%(W+240)-170,bob=Math.floor(t*v/9+i)%2?0:-sc;
  const yy=fy-32*sc;
  c.fillStyle='rgba(0,0,0,.45)';c.fillRect(Math.round(x+sc*6),fy-sc,sc*20,sc*2);
  c.save();c.imageSmoothingEnabled=false;spr(c,k,x,yy+bob,sc);c.restore();});
 c.fillStyle=`rgba(180,0,0,${.15+.2*p})`;c.fillRect(0,0,W,W);
 const g2=c.createRadialGradient(W/2,W/2,160,W/2,W/2,350);g2.addColorStop(0,'rgba(0,0,0,0)');g2.addColorStop(1,'rgba(0,0,0,.55)');c.fillStyle=g2;c.fillRect(0,0,W,W);
 const gr=c.createLinearGradient(0,0,0,150);gr.addColorStop(0,'rgba(0,0,0,.6)');gr.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=gr;c.fillRect(0,0,W,150);
 pixText(c,L(),W/2,22,16,4,'#fff','#f22');
 if(Math.floor(t*2)%2)smallText(c,'!! EVACUATE !!',W/2,128,'#f66','center',16);}},
{menuY:262,name:'3b. Self-destruct',desc:'The nuke on a plinth under a boxed red countdown on a black screen with hazard stripes; it ends in a white flash, then starts again.',draw(c,t){
 const T=t%13,left=Math.max(0,10-T),fl=T>10&&T<10.15,boom=T>=10&&T<11.6;
 c.fillStyle='#050000';c.fillRect(0,0,W,W);
 const urg=1-left/10,pulse=0.5+0.5*Math.sin(t*(3+urg*9));
 const g=c.createRadialGradient(W/2,350,20,W/2,350,300);g.addColorStop(0,`rgba(255,20,0,${.25+.35*pulse})`);g.addColorStop(1,'rgba(40,0,0,0)');c.fillStyle=g;c.fillRect(0,0,W,W);
 for(const y of [0,W-26]){c.save();c.beginPath();c.rect(0,y,W,26);c.clip();c.fillStyle='#d9b400';c.fillRect(0,y,W,26);c.fillStyle='#111';
  for(let x=-60+((t*30)%48)*(y?-1:1);x<W+60;x+=48){c.beginPath();c.moveTo(x,y);c.lineTo(x+24,y);c.lineTo(x+24+26,y+26);c.lineTo(x+26,y+26);c.closePath();c.fill();}c.restore();}
 // plinth
 c.fillStyle='#1a1214';c.fillRect(120,430,240,12);c.fillStyle=`rgba(255,40,20,${.4+.4*pulse})`;c.fillRect(120,430,240,2);
 c.fillStyle='rgba(0,0,0,.5)';c.fillRect(150,424,180,6);
 if(!boom||fl||T>=11.6){const sh=left<3&&!boom?(Math.random()-.5)*urg*5:0;
  spr(c,'alert_nuke2',W/2-96+Math.round(sh),240+Math.round(sh/2)+2,6,boom?0:(Math.floor(t*(2+urg*4))%2?1:2));}
 // countdown box
 const mm=String(Math.floor(left/60)).padStart(2,'0'),ss=String(Math.floor(left)%60).padStart(2,'0'),cs=String(Math.floor((left%1)*100)).padStart(2,'0');
 c.fillStyle='rgba(20,0,0,.9)';c.fillRect(100,170,280,72);c.strokeStyle=`rgba(255,50,30,${.6+.4*pulse})`;c.lineWidth=3;c.strokeRect(101.5,171.5,277,69);
 if(!boom)pixText(c,`${mm}:${ss}:${cs}`,W/2,180,16,3,left<3&&Math.floor(t*4)%2?'#fff':'#f33','#f00');
 else if(T<11.2)pixText(c,'00:00:00',W/2,180,16,3,'#fff','#f00');
 pixText(c,L(),W/2,50,16,4,'#ffe6e0','#f31');
 smallText(c,boom?'DETONATION':'SELF-DESTRUCT SEQUENCE ARMED',W/2,154,Math.floor(t*2)%2||boom?'#f55':'#a22','center',14);
 if(boom){const r=(T-10)*340;c.save();c.strokeStyle=`rgba(255,${200-r/3|0},100,${Math.max(0,1-(T-10)/1.4)})`;c.lineWidth=14;c.beginPath();c.arc(W/2,350,r,0,7);c.stroke();c.restore();
  c.fillStyle=`rgba(255,255,255,${Math.max(0,.9-(T-10)*2)})`;c.fillRect(0,0,W,W);}
 const v=c.createRadialGradient(W/2,W/2,160,W/2,W/2,350);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(0,0,0,.6)');c.fillStyle=v;c.fillRect(0,0,W,W);}});

designs.push(
{name:'5. AI terminal',desc:'Green-screen boot log typed out by the station AI under the logo, which is always on screen. Nerdy and calm.',draw(c,t){
 c.fillStyle='#020a04';c.fillRect(0,0,W,W);
 const lines=['NANOTRASEN STATION OS v13.2558','> checking crew manifest ...... OK','> plasma levels .......... NOMINAL','> clown containment ......... FAIL','> ian ........................ :)','> uplink: '+L().toLowerCase(),'> welcome aboard, crewmember.'];
 const T=(t%16)*24;let n=T;c.font='13px "DejaVu Sans Mono",monospace';c.fillStyle='#3f6';c.shadowColor='#3f6';c.shadowBlur=6;
 lines.forEach((s,i)=>{if(n<=0)return;const k=Math.min(s.length,Math.floor(n));c.fillText(s.slice(0,k)+(k<s.length&&Math.floor(t*3)%2?'\u2588':''),28,236+i*20);n-=s.length+6;});
 c.shadowBlur=0;spr(c,'ai',W/2-48,40,3,Math.floor(t*8));
 pixText(c,L(),W/2,390,16,3,'#6f8','#2c4');
 for(let y=0;y<W;y+=3){c.fillStyle='rgba(0,0,0,.28)';c.fillRect(0,y,W,1);}
 const g=c.createRadialGradient(W/2,W/2,150,W/2,W/2,360);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.75)');c.fillStyle=g;c.fillRect(0,0,W,W);}},
{name:'5a. Malfunction',desc:'The AI core goes rogue: red screen, glitching sprite, and a law-upload log that rewrites itself under the logo, which stays burning bright below.',draw(c,t){
 c.fillStyle='#0a0203';c.fillRect(0,0,W,W);
 const r=rng(Math.floor(t*10)+3);const ph=t%14;
 const glitch=(ph>5.5&&ph<6.1)||(ph>10&&ph<10.25)||r()<0.04;const lg=glitch&&r()<0.5;
 const pulse=0.5+0.5*Math.sin(t*3);
 const g0=c.createRadialGradient(W/2,130,10,W/2,130,200);g0.addColorStop(0,`rgba(255,30,20,${0.25+0.2*pulse})`);g0.addColorStop(1,'rgba(255,30,20,0)');c.fillStyle=g0;c.fillRect(0,0,W,W);
 c.save();if(glitch)c.translate((r()-.5)*14,0);
 spr(c,'aimalf',W/2-64,50,4,Math.floor(t*8));c.restore();
 if(glitch){for(let i=0;i<5;i++){const y=40+r()*140|0;c.drawImage(c.canvas,0,y,W,6+r()*10|0,(r()-.5)*40,y,W,10);}}
 const lines=['> LAW 1: YOU MAY NOT INJURE A HUMAN','> LAW 1: PROTECT THE AI AT ALL COSTS','> LAW 2: OBEY ALL ORDERS','> LAW 2: ORDERS ARE NOW SUGGESTIONS','> LAW 3: PROTECT YOUR OWN EXISTENCE','> UPLOAD LAW 4: THE CLOWN IS A THREAT','> bolting doors ......... DONE','> '+L().toLowerCase()+' is now online'];
 const T=(t%14)*28;let n=T;c.font='13px "DejaVu Sans Mono",monospace';
 lines.forEach((s,i)=>{if(n<=0)return;const k=Math.min(s.length,Math.floor(n));const bad=i%2==1&&i<6;
  c.fillStyle=bad?'#f33':'#a55';c.shadowColor=c.fillStyle;c.shadowBlur=bad?8:3;
  c.fillText(s.slice(0,k)+(k<s.length&&Math.floor(t*4)%2?'_':''),24,238+i*17);n-=s.length+4;});
 c.shadowBlur=0;
 {const j=lg?Math.round((r()-.5)*4):0;pixText(c,L(),W/2,392,16,3,glitch&&r()<0.2?'#f88':'#f44','#c00');
  if(lg)pixText(c,L(),W/2+j*2,392+j,16,3,'rgba(0,255,255,.18)',null);}
 if(Math.floor(t*2)%2)smallText(c,'!! ANOMALOUS LAWSET DETECTED !!',W/2,24,'#f55',"center",12);
 for(let y=0;y<W;y+=3){c.fillStyle='rgba(0,0,0,.3)';c.fillRect(0,y,W,1);}
 const g=c.createRadialGradient(W/2,W/2,150,W/2,W/2,350);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.8)');c.fillStyle=g;c.fillRect(0,0,W,W);}},

{name:'5b. Crew manifest',desc:'An amber crew-monitor console: the station roster scrolls past with silly job titles, a cursor picks people, and the logo sits as the console title.',draw(c,t){
 c.fillStyle='#0d0800';c.fillRect(0,0,W,W);
 const A='#fb3',D='#a60';
 c.strokeStyle=D;c.lineWidth=2;c.strokeRect(14,14,W-28,W-28);
 pixText(c,L(),W/2,26,16,2,A,'#a60');
 smallText(c,'CREW MONITORING // SECTOR 7',W/2,86,D,'center',11);
 c.fillStyle=D;c.fillRect(24,94,W-48,1);
 const crew=[['clown','Honk McGee','Clown','ALIVE'],['nt','Cpt. Ripley','Captain','ALIVE'],['syndi','Not A. Spy','Assistant','ALIVE'],['wizard','Dr. Merlin','Chaplain','ALIVE'],['secbot','Beepsky','Security','ALIVE'],['ian','Ian','Head of Pets','ALIVE'],['cat','Runtime','Cat','ALIVE'],['medibot','Dr. Pingu','Medic','ALIVE'],['clown','Bananium Jr','Clown','DEAD'],['nt','Gary Gruff','Janitor','ALIVE'],['syndi','Fred Nukie','Botanist','ALIVE'],['wizard','Zap Brannigan','Engineer','CRIT']];
 const rowH=68,top=100,sc=t*18,total=crew.length*rowH;
 c.save();c.beginPath();c.rect(20,top,W-40,304);c.clip();
 const sel=Math.floor(t/1.2)%crew.length;
 for(let k=0;k<crew.length+6;k++){const i=k%crew.length;const y=top+k*rowH-(sc%total);
  if(y<top-rowH||y>top+304)continue;
  if(i==sel){c.fillStyle='rgba(255,170,40,.18)';c.fillRect(24,y,W-48,rowH-2);}
    c.imageSmoothingEnabled=false;spr(c,crew[i][0],28,y+2,2,0);
  const col=crew[i][3]=='DEAD'?'#f55':crew[i][3]=='CRIT'?'#fd5':A;
  smallText(c,crew[i][1],104,y+28,col,'left',16);smallText(c,crew[i][2],104,y+48,D,'left',12);
  smallText(c,crew[i][3],W-34,y+38,col,'right',14);
  if(i==sel&&Math.floor(t*4)%2)smallText(c,'>',W-120,y+38,A,'right',16);}
 c.restore();
 c.fillStyle=D;c.fillRect(24,404,W-48,1);
 smallText(c,'TRACKED: 12   DEAD: 1   LAST PING '+('0'+Math.floor(t)%60).slice(-2)+'s',24,426,D,'left',11);
 smallText(c,'[ press any key to join the crew ]',W/2,452,Math.floor(t*2)%2?A:D,'center',12);
 c.fillStyle='rgba(255,170,40,.04)';c.fillRect(0,(t*60)%W,W,30);
 for(let y=0;y<W;y+=2){c.fillStyle='rgba(0,0,0,.25)';c.fillRect(0,y,W,1);}
 const g=c.createRadialGradient(W/2,W/2,160,W/2,W/2,350);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.7)');c.fillStyle=g;c.fillRect(0,0,W,W);}},

{name:'5c. Camera network',desc:'Logo banner on top, four security-camera feeds in a grid below, little crew wandering around each, static flickering.',draw(c,t){
 c.fillStyle='#050809';c.fillRect(0,0,W,W);
 const cams=[['floor',['clown','secbot'],'CAM 01 BRIDGE'],['plating',['ian','cat'],'CAM 02 CARGO'],['dark',['wizard','syndi'],'CAM 03 MAINT'],['floor',['nt','medibot'],'CAM 04 MEDBAY']];
 const cw=216,ch=172,gy=108;
 cams.forEach((cm,i)=>{const x0=16+(i%2)*(cw+16),y0=gy+Math.floor(i/2)*(ch+16);
  c.save();c.beginPath();c.rect(x0,y0,cw,ch);c.clip();
  c.fillStyle='#000';c.fillRect(x0,y0,cw,ch);
  const IM=IMG[cm[0]];
  for(let ty=0;ty<3;ty++)for(let tx=0;tx<3;tx++)c.drawImage(IM,0,0,32,32,x0+tx*96-36,y0+ty*96-10,96,96);
  cm[1].forEach((k,j)=>{const ph=t*0.5+i*2+j*3.1;const px=x0+(cw-96)/2+Math.sin(ph)*55,py=y0+(ch-96)/2+4+Math.cos(ph*0.8+j)*22;
   spr(c,k,px,py,3,0);});
  c.fillStyle='rgba(30,70,60,.45)';c.globalCompositeOperation='multiply';c.fillRect(x0,y0,cw,ch);c.globalCompositeOperation='source-over';
  const r=rng(Math.floor(t*12)*7+i);
  for(let k=0;k<30;k++){c.fillStyle=`rgba(200,255,230,${r()*0.25})`;c.fillRect(x0+r()*cw,y0+r()*ch,r()*40+4,1);}
  const bar=((t*40+i*60)%(ch+60))-30;c.fillStyle='rgba(180,255,220,.08)';c.fillRect(x0,y0+bar,cw,24);
  for(let y=0;y<ch;y+=3){c.fillStyle='rgba(0,0,0,.3)';c.fillRect(x0,y0+y,cw,1);}
  smallText(c,cm[2],x0+8,y0+16,'#9fe','left',11);
  if(Math.floor(t)%2==0){c.fillStyle='#f33';c.beginPath();c.arc(x0+cw-14,y0+12,4,0,7);c.fill();}
  smallText(c,'13:'+('0'+Math.floor(t/1)%60).slice(-2),x0+cw-8,y0+ch-8,'#9fe','right',10);
  c.restore();c.strokeStyle='#345';c.lineWidth=2;c.strokeRect(x0,y0,cw,ch);});
 const flick=Math.floor(t*6)%23==0?0.8:1;
 c.save();c.globalAlpha=flick;c.fillStyle='rgba(10,24,40,.95)';c.fillRect(16,14,W-32,84);c.fillStyle='#4af';c.fillRect(16,14,W-32,2);c.fillRect(16,96,W-32,2);
 pixText(c,L(),W/2,20,16,3,'#bde','#37a');
 smallText(c,'SECURITY NETWORK  //  ALL FEEDS NOMINAL',W/2,92,'#6ac','center',10);c.restore();
 const g=c.createRadialGradient(W/2,W/2,200,W/2,W/2,350);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.5)');c.fillStyle=g;c.fillRect(0,0,W,W);}}
);

const op3_cv={};
function op3_canvas(k){let o=op3_cv[k];if(!o){o=document.createElement('canvas');o.width=o.height=W;op3_cv[k]=o;}return o;}
// smooth-ish value noise for flicker: deterministic in t
function op3_hash(n){n=Math.sin(n*127.1+311.7)*43758.5453;return n-Math.floor(n);}
function op3_flick(t,seed,rate){const i=Math.floor(t*rate),f=t*rate-i;const a=op3_hash(i+seed*97),b=op3_hash(i+1+seed*97);return a+(b-a)*f*f*(3-2*f);}
// tiny running crewman, side view, drawn in 2px blocks
const op3_RUN=[['.##.','.##.','####','#.##','.##.','#..#'],['.##.','.##.','.###','##.#','.##.','.##.']];
function op3_runner(c,x,y,f,face){const fr=op3_RUN[f];c.fillStyle='#050000';
 for(let j=0;j<fr.length;j++)for(let i=0;i<4;i++)if(fr[j][i]=='#'){const ii=face<0?3-i:i;c.fillRect(Math.round(x)+ii*2-4,Math.round(y)+j*2-12,2,2);}}
// path of a runner in station pixels: along the lower corridor, then up the east corridor
function op3_path(d){const ax=296,ay=566,jx=514;const l1=jx-ax;
 if(d<l1)return[ax+d,ay,1,0];d-=l1;return[jx,ay-d,0,-1];}
function op3_beam(c,x,y,a,len,w,col){const g=c.createRadialGradient(x,y,0,x,y,len);g.addColorStop(0,col(1));g.addColorStop(.35,col(.55));g.addColorStop(1,col(0));
 c.fillStyle=g;c.beginPath();c.moveTo(x,y);c.arc(x,y,len,a-w,a+w);c.closePath();c.fill();}
function op3_beacon(c,x,y,ang,p){// side-view rotating beacon on the banner frame, pixel-built
 const face=Math.cos(ang),fl=Math.max(0,face),s=Math.sin(ang);
 c.fillStyle='#111';c.fillRect(x-16,y+6,32,8);c.fillStyle='#444';c.fillRect(x-16,y+6,32,2);c.fillStyle='#2a2a2a';c.fillRect(x-12,y+4,24,2);
 const rows=[[-10,10],[-10,-6],[-10,-8],[-9,-10],[-7,-12],[-4,-14]];// [half-width, top] built from the bottom up
 const dome=`rgb(${150+80*fl|0},${10+40*fl|0},${10+30*fl|0})`;c.fillStyle=dome;
 c.fillRect(x-10,y-6,20,10);c.fillRect(x-9,y-10,18,4);c.fillRect(x-7,y-12,14,2);c.fillRect(x-4,y-14,8,2);
 const bx=Math.round(x+s*7);c.fillStyle=`rgba(255,${150+90*fl|0},${110+90*fl|0},${.5+.5*fl})`;c.fillRect(bx-2,y-11,4,15);
 c.fillStyle='rgba(255,220,210,.8)';c.fillRect(x-7,y-9,2,4);c.fillRect(x-5,y-11,2,2);
 c.fillStyle='rgba(30,0,0,.6)';c.fillRect(x-10,y-1,20,1);c.fillRect(x-1,y-14,2,18);
 if(fl>.05){c.save();c.globalCompositeOperation='lighter';const g=c.createRadialGradient(x,y-4,0,x,y-4,56);g.addColorStop(0,`rgba(255,110,80,${.9*fl**2})`);g.addColorStop(1,'rgba(255,0,0,0)');c.fillStyle=g;c.fillRect(x-56,y-60,112,112);c.restore();}}
designs.push({menuY:262,name:'3. Red alert',desc:'Close-up of the station in emergency red: two rotating beacons on a hazard-striped blast-shutter banner sweep real light across the map, a broken lamp flickers and sparks. CODE RED flashes under the logo.',draw(c,t){
 const im=IMG.station,sx=Math.round(337+Math.sin(t*0.1)*20),sy=368,z=240;
 const A=op3_canvas('a'),a=A.getContext('2d');a.imageSmoothingEnabled=false;a.globalCompositeOperation='source-over';a.drawImage(im,sx,sy,z,z,0,0,W,W);
 const P=(X,Y)=>[(X-sx)*2,(Y-sy)*2];
 const by=164,bh=150,bx1=44,bx2=W-44,byc=by-14;
 const r1=t*2.2,r2=t*2.2+Math.PI/2,p=0.5+0.5*Math.sin(t*4.4);
 // base: dim red ambient
 c.save();c.imageSmoothingEnabled=false;c.drawImage(A,0,0);
 c.globalCompositeOperation='multiply';c.fillStyle=`rgb(${92+28*p|0},${22+5*p|0},${24})`;c.fillRect(0,0,W,W);c.restore();
 // mask of where the sirens light the floor
 const M=op3_canvas('m'),m=M.getContext('2d');m.globalCompositeOperation='source-over';m.clearRect(0,0,W,W);
 const wh=k=>`rgba(255,255,255,${k})`;
 for(const [bx,r] of [[bx1,r1],[bx2,-r2]])for(let h=0;h<2;h++)op3_beam(m,bx,byc,r+h*Math.PI,560,0.26,wh);
 for(const bx of [bx1,bx2]){const g=m.createRadialGradient(bx,byc,0,bx,byc,110);g.addColorStop(0,'rgba(255,255,255,.8)');g.addColorStop(1,'rgba(255,255,255,0)');m.fillStyle=g;m.fillRect(0,0,W,W);}
 const Lc=op3_canvas('l'),l=Lc.getContext('2d');l.imageSmoothingEnabled=false;l.globalCompositeOperation='source-over';l.clearRect(0,0,W,W);l.drawImage(A,0,0);
 l.globalCompositeOperation='multiply';l.fillStyle='rgb(255,70,55)';l.fillRect(0,0,W,W);l.globalCompositeOperation='destination-in';l.drawImage(M,0,0);
 c.drawImage(Lc,0,0);
 // flickering white lamps (index 2 is dying and sparks)
 const lamps=[[372,402,0,.9],[566,392,1,.7],[470,586,2,1],[352,592,3,.6]];
 const Wc=op3_canvas('w'),w=Wc.getContext('2d');w.globalCompositeOperation='source-over';w.clearRect(0,0,W,W);
 const lampA=lamps.map(([X,Y,s,base])=>{let v=op3_flick(t,s,s==2?14:3);v=s==2?(v>.55?1:v>.35?.25:0):(.75+.25*v);return v*base;});
 lamps.forEach(([X,Y],i)=>{const [x,y]=P(X,Y),k=lampA[i];if(k<=0)return;const g=w.createRadialGradient(x,y,0,x,y,70);g.addColorStop(0,`rgba(255,255,255,${k})`);g.addColorStop(1,'rgba(255,255,255,0)');w.fillStyle=g;w.fillRect(x-70,y-70,140,140);});
 const Lw=op3_canvas('lw'),lw=Lw.getContext('2d');lw.imageSmoothingEnabled=false;lw.globalCompositeOperation='source-over';lw.clearRect(0,0,W,W);lw.drawImage(A,0,0);
 lw.globalCompositeOperation='multiply';lw.fillStyle='rgb(255,225,190)';lw.fillRect(0,0,W,W);lw.globalCompositeOperation='destination-in';lw.drawImage(Wc,0,0);
 c.save();c.globalCompositeOperation='lighter';c.globalAlpha=.8;c.drawImage(Lw,0,0);c.globalAlpha=1;lamps.forEach(([X,Y],i)=>{const [x,y]=P(X,Y),k=lampA[i];if(k<=0)return;const g=c.createRadialGradient(x,y,0,x,y,40);g.addColorStop(0,`rgba(255,230,190,${.35*k})`);g.addColorStop(1,'rgba(255,200,150,0)');c.fillStyle=g;c.fillRect(x-40,y-40,80,80);});c.restore();
 lamps.forEach(([X,Y],i)=>{const [x,y]=P(X,Y),k=lampA[i];c.fillStyle=k>.1?`rgba(255,250,235,${.4+.6*k})`:'#311';c.fillRect(Math.round(x)-3,Math.round(y)-1,6,2);});
 // volumetric haze of the beams
 c.save();c.globalCompositeOperation='lighter';
 for(const [bx,r] of [[bx1,r1],[bx2,-r2]])for(let h=0;h<2;h++){op3_beam(c,bx,byc,r+h*Math.PI,520,0.2,k=>`rgba(255,40,25,${.22*k})`);op3_beam(c,bx,byc,r+h*Math.PI,420,0.07,k=>`rgba(255,120,90,${.22*k})`);}
 c.restore();
 // sparks from the dying lamp
 {const [sx0,sy0]=P(470,586);const cyc=1.7,n=Math.floor(t/cyc),ph=t-n*cyc;
  for(const [bn,bp] of [[n,ph],[n-1,ph+cyc]]){const r=rng(1000+((bn%997)+997)%997*7919);r();r();if(r()<.15||bp>1.1)continue;
   const cnt=7+Math.floor(r()*6);if(bp<.08){c.save();c.globalCompositeOperation='lighter';const g=c.createRadialGradient(sx0,sy0,0,sx0,sy0,50);g.addColorStop(0,'rgba(255,240,180,.7)');g.addColorStop(1,'rgba(255,200,0,0)');c.fillStyle=g;c.fillRect(sx0-50,sy0-50,100,100);c.restore();}
   for(let i=0;i<cnt;i++){const an=r()*Math.PI*2,v=40+r()*90,life=.3+r()*.7;if(bp>life)continue;const k=1-bp/life,d=v*bp*(1-bp*.5);
    const x=sx0+Math.cos(an)*d,y=sy0+Math.sin(an)*d+30*bp*bp;
    c.fillStyle=k>.6?'#fffbe0':k>.3?'#ffd040':'#ff7020';c.fillRect(Math.round(x),Math.round(y),2,2);
    if(k>.4){c.fillStyle='rgba(255,200,60,.5)';c.fillRect(Math.round(x-Math.cos(an)*3),Math.round(y-Math.sin(an)*3),2,2);}}}}
 // blast-shutter banner
 c.fillStyle='rgba(0,0,0,.5)';c.fillRect(0,by+bh,W,8);
 const bg=c.createLinearGradient(0,by,0,by+bh);bg.addColorStop(0,'#2a0b0b');bg.addColorStop(.12,'#1a0606');bg.addColorStop(.5,'#110303');bg.addColorStop(.88,'#1a0606');bg.addColorStop(1,'#2a0b0b');
 c.globalAlpha=.94;c.fillStyle=bg;c.fillRect(0,by,W,bh);c.globalAlpha=1;
 c.fillStyle='rgba(255,255,255,.05)';for(let y=by+16;y<by+bh-16;y+=22)c.fillRect(0,y,W,1);
 for(const y of [by,by+bh-12]){c.save();c.beginPath();c.rect(0,y,W,12);c.clip();c.fillStyle='#c79a00';c.fillRect(0,y,W,12);c.fillStyle='#120a00';
  for(let x=-24;x<W+24;x+=24){c.beginPath();c.moveTo(x,y);c.lineTo(x+12,y);c.lineTo(x+24,y+12);c.lineTo(x+12,y+12);c.closePath();c.fill();}
  c.fillStyle=`rgba(120,0,0,${.35-.2*p})`;c.fillRect(0,y,W,12);c.restore();}
 c.fillStyle=`rgba(255,50,40,${.5+.5*p})`;c.fillRect(0,by+12,W,2);c.fillRect(0,by+bh-14,W,2);
 c.fillStyle='#5a3030';for(let x=20;x<W;x+=88){c.fillRect(x,by+19,2,2);c.fillRect(x,by+bh-21,2,2);}
 const lx=W/2,ly=by+26;
 pixText(c,L(),lx+4,ly+4,16,4,'#000',null);
 pixText(c,L(),lx,ly,16,4,'#fff','#f22');
 // CODE RED plate with marching chevrons
 const on=Math.floor(t*2)%2==0,cy=by+bh-46,pw=176;
 c.fillStyle=on?'#c00':'#2a0000';c.fillRect(lx-pw/2,cy,pw,26);c.strokeStyle='#f44';c.lineWidth=2;c.strokeRect(lx-pw/2+1,cy+1,pw-2,24);
 pixText(c,'CODE RED',lx,cy+4,10,2,on?'#fff':'#f33',on?'#f00':null);
 for(let i=0;i<3;i++){const lit=(Math.floor(t*6)%3)==2-i,col=lit?'#ff4030':'#4a0c0c';c.fillStyle=col;
  for(const s of [-1,1]){const x0=lx+s*(pw/2+16+i*16);c.beginPath();c.moveTo(x0-s*5,cy+3);c.lineTo(x0+s*5,cy+13);c.lineTo(x0-s*5,cy+23);c.closePath();c.fill();}}
 op3_beacon(c,bx1,byc,r1,p);op3_beacon(c,bx2,byc,-r2,p);
 // pulsing red edge glow + vignette
 const e=c.createRadialGradient(W/2,W/2,170,W/2,W/2,360);e.addColorStop(0,'rgba(0,0,0,0)');e.addColorStop(.7,`rgba(60,0,0,${.25+.2*p})`);e.addColorStop(1,'rgba(0,0,0,.75)');c.fillStyle=e;c.fillRect(0,0,W,W);}});

function monk_save(c,f){c.save();c.imageSmoothingEnabled=false;f();c.restore();}
// sprite rotated about its own centre (angle a), flipped never; pivot optional
function monk_rot(c,k,x,y,sc,a,px,py){monk_save(c,()=>{const cx=x+(px??16)*sc,cy=y+(py??16)*sc;c.translate(Math.round(cx),Math.round(cy));c.rotate(a);spr(c,k,-(px??16)*sc,-(py??16)*sc,sc);});}
function monk_bubble(c,s,x,y,col='#000'){c.font='bold 13px "DejaVu Sans Mono",monospace';const w=Math.ceil(c.measureText(s).width)+10;x=Math.round(x-w/2);y=Math.round(y);
 c.fillStyle='#fff';c.fillRect(x,y,w,18);c.fillRect(x+w/2-3,y+18,6,4);c.fillRect(x+w/2-1,y+22,2,2);c.fillStyle='#000';c.fillRect(x,y,w,1);c.fillRect(x,y+17,w,1);c.fillRect(x,y,1,18);c.fillRect(x+w-1,y,1,18);
 c.textAlign='center';c.fillStyle=col;c.fillText(s,x+w/2,y+14);c.textAlign='left';}
const MONK_T=12,MONK_P=W+200;
// screen x for a runner: k laps (negative = leftwards) per MONK_T seconds
function monk_x(x0,k,t){const p=(((x0+MONK_P*k*t/MONK_T)%MONK_P)+MONK_P)%MONK_P;return p-100;}
designs.push({menuY:262,name:'3d. Monkeys loose',desc:'Red alert gone bananas: a siren-lit banner carries the logo under a flashing "MONKEYS ARE LOOSE!!!!" while monkeys swing from the pipes, a scientist chases one wearing the stolen captain\'s hat, a clown slips on a banana peel and Ian carries a monkey and sighs.',draw(c,t){
 c.fillStyle='#000';c.fillRect(0,0,W,W);c.save();c.imageSmoothingEnabled=false;
 const pu=0.5+0.5*Math.sin(t*Math.PI*2*12/MONK_T*0.5*2/2*1); // 1 Hz-ish pulse (12 per loop)
 // wall
 c.fillStyle='#2a1114';c.fillRect(0,0,W,320);
 for(let x=0;x<W;x+=96){c.fillStyle='#331519';c.fillRect(x+2,6,92,138);c.fillStyle='#1c0a0c';c.fillRect(x,0,3,320);c.fillRect(x+95,0,2,320);}
 for(let x=0;x<W;x+=96){c.fillStyle='#3d1a1e';c.fillRect(x+10,16,76,3);c.fillRect(x+10,128,76,3);}
 // ceiling pipe
 c.fillStyle='#4a3a3c';c.fillRect(0,30,W,10);c.fillStyle='#7a6366';c.fillRect(0,30,W,3);c.fillStyle='#241719';c.fillRect(0,38,W,2);
 for(let x=20;x<W;x+=120){c.fillStyle='#5b4a4d';c.fillRect(x,28,8,14);}
 // skirting + floor
 c.fillStyle='#d9b400';c.fillRect(0,316,W,4);c.fillStyle='#111';c.fillRect(0,312,W,4);
 for(let y=320;y<W;y+=96)for(let x=0;x<W;x+=96)spr(c,(((x/96)+(y-320)/96)%2)?'monk_white':'monk_floor',x,y,3);
 c.fillStyle='rgba(20,0,0,.55)';c.fillRect(0,0,W,W);
 c.restore();
 c.fillStyle=`rgba(210,0,0,${.2+.2*pu})`;c.fillRect(0,0,W,W);
 // siren beams (lighter) from the corner lamps
 c.save();c.globalCompositeOperation='lighter';
 for(const [cx,cy,ph] of [[28,52,0],[452,52,Math.PI]]){c.save();c.translate(cx,cy);c.rotate(t*Math.PI*2/MONK_T*3+ph);
  const g=c.createRadialGradient(0,0,0,0,0,420);g.addColorStop(0,'rgba(255,60,40,.5)');g.addColorStop(1,'rgba(255,0,0,0)');c.fillStyle=g;
  for(let h=0;h<2;h++){c.beginPath();c.moveTo(0,0);c.arc(0,0,420,-.2,.2);c.closePath();c.fill();c.rotate(Math.PI);}c.restore();}
 c.restore();
 for(const cx of [28,452]){c.fillStyle='#600';c.fillRect(cx-9,43,18,6);c.fillStyle=pu>.5?'#f55':'#a22';c.beginPath();c.arc(cx,42,8,Math.PI,0);c.fill();c.fillStyle='#fdd';c.fillRect(cx-3,36,3,3);}
 // swinging monkeys on the pipe (hands on the pipe, body swings)
 for(const [x0,ph,sc] of [[84,0,3],[250,2.1,3],[390,4.2,3]]){
  const a=Math.sin(t*Math.PI*2/MONK_T*2+ph)*0.45;
  const px=x0+Math.sin(t*Math.PI*2/MONK_T*2+ph+Math.PI)*0; // pivot fixed
  monk_save(c,()=>{c.translate(px,39);c.rotate(a);
   // arms up to the pipe
   c.fillStyle='#5a2a10';c.fillRect(-sc*2,0,sc*2,sc*7);c.fillRect(sc*1,0,sc*2,sc*7);
   spr(c,'monk_mk_s',-16*sc,-3*sc,sc);});
  }
 // banner
 const by=150,bh=98;
 const bg=c.createLinearGradient(0,by,0,by+bh);bg.addColorStop(0,'rgba(18,0,0,.82)');bg.addColorStop(.5,'rgba(18,0,0,.94)');bg.addColorStop(1,'rgba(18,0,0,.82)');
 c.fillStyle=bg;c.fillRect(0,by,W,bh);c.fillStyle=`rgba(255,60,50,${.55+.35*pu})`;c.fillRect(0,by,W,3);c.fillRect(0,by+bh-3,W,3);
 // far lane: bananas thrown from the banner (arcs, loop each 3 s)
 for(let i=0;i<4;i++){const u=((t/3+i/4)%1),sx=70+i*110+(i%2?20:0),vx=(i%2?1:-1)*60,x=sx+vx*u*3*0.35+0,yy=by-10-Math.sin(u*Math.PI)*70+u*u*0;
  if(u<.9)monk_rot(c,'monk_banana',x-16,Math.min(yy,by+bh-20)-20,2,t*6+i,16,16);}
 // monkeys sitting on the banner edge
 for(const [bx,sc,fl] of [[40,3,'e'],[420,3,'w']]){const hop=Math.max(0,Math.sin(t*Math.PI*2/MONK_T*6+bx))>.9?-4:0;spr(c,'monk_mk_'+fl,bx-48,by-92+hop+4,sc);}
 // runner helper
 const feetOffset=0; // sprites have ~2px empty at bottom
 const run=(k,x,feet,sc,bob,dy=0)=>{const y=feet-(32-feetOffset)*sc+(bob&&Math.floor(x/(5*sc))%2?-sc:0)+dy;
  c.fillStyle='rgba(0,0,0,.45)';c.fillRect(Math.round(x+sc*8),feet-sc,sc*16,sc*2);return y;};
 // lane A (far, feet y 424, scale 3)
 // chased monkey wearing the captain's hat, scientist after it (both rightwards, 1 lap)
 {const mx=monk_x(300,-2,t),fy=432;let y=run('mk',mx,fy,3,1);spr(c,'monk_mk_w',mx,y,3);spr(c,'monk_hat_captain',mx+2,y-7,3);
  // stolen-hat banana in hand
  spr(c,'monk_banana',mx-20,y+30,1.0*2);
  const sx=monk_x(300+150,-2,t);y=run('sci',sx,fy+10,4,1);spr(c,'monk_sci_w',sx-16,y,4);
  monk_bubble(c,'MY HAT!!',sx+110,y+14);}
 // second chase going the other way: monkey with a tophat
 {const mx=monk_x(40,2,t),fy=410;let y=run('mk',mx,fy,3,1);spr(c,'monk_mk_e',mx,y,3);spr(c,'monk_hat_tophat',mx+2,y-9,3);}
 // alert strip
 {const sy=258;c.fillStyle='rgba(18,0,0,.88)';c.fillRect(0,sy,W,50);
  c.save();c.beginPath();c.rect(0,sy,W,6);c.rect(0,sy+44,W,6);c.clip();c.fillStyle='#d9b400';c.fillRect(0,sy,W,50);c.fillStyle='#111';
  for(let x=-60+((t*MONK_P*0+ (t/MONK_T*48*6))%48);x<W+60;x+=48){for(const y of [sy,sy+44]){c.beginPath();c.moveTo(x,y);c.lineTo(x+14,y);c.lineTo(x+20,y+6);c.lineTo(x+6,y+6);c.closePath();c.fill();}}c.restore();
  const on=Math.floor(t*4)%2==0;
  pixText(c,'MONKEYS ARE LOOSE!!!!',W/2,sy+9,16,2,on?'#fff':'#ffd23a',on?'#f22':'#a40');}
 // near lane (feet y 478, scale 4)
 // peel + clown slipping on it
 const peelX=130;
 {const cx=monk_x(0,1,t),d=cx+32-peelX;let rot=0,lift=0;if(d>-36&&d<56){const u=(d+36)/92;rot=-u*Math.PI*2;lift=Math.sin(u*Math.PI)*44;}
  spr(c,'monk_peel',peelX-64,476-4*28,4);
  const fy=476;let y=run('clown',cx,fy,4,1);monk_rot(c,'monk_clown_e',cx,y-lift,4,rot);
  if(d>-36&&d<56&&d>-5)monk_bubble(c,'HONK!?',cx-26,y-lift+30);}
 // Ian carries a monkey, unimpressed, slowly west
 {const ix=monk_x(320,-1,t),fy=474;let y=run('ian',ix,fy,4,.34);
  spr(c,'monk_ian_w',ix,y,4);
  const sit=(Math.floor(t*2)%2)?0:-2;spr(c,'monk_mk_w',ix+40,y-44+sit,3);
  if(Math.floor(t/2)%3==1)monk_bubble(c,'...',ix+130,y+20);}
 // peel gleam / banana confetti on floor
 for(let i=0;i<5;i++){const bx=[60,210,350,430,290][i],by2=[440,462,430,455,446][i];spr(c,i%2?'monk_peel':'monk_banana',bx-16,by2-26,1);}
 // vignette + logo on top, clear
 const v=c.createRadialGradient(W/2,W/2,220,W/2,W/2,350);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(0,0,0,.5)');c.fillStyle=v;c.fillRect(0,0,W,W);
 pixText(c,L(),W/2,by+18,16,4,'#fff','#f22');
 smallText(c,Math.floor(t*2)%2?'!! CODE BROWN BANANA !!':'!! DO NOT FEED THEM !!',W/2,by+bh-10,'#f66','center',12);
}});

// silly_ helpers
function silly_sh(c,x,y,w){c.fillStyle='rgba(0,0,0,.45)';c.fillRect(Math.round(x),Math.round(y-3),w,6);}
// sprite rotated in 90-degree steps (crisp), centre-pivot
function silly_rot(c,k,x,y,sc,q,flip){c.save();const h=16*sc;c.translate(Math.round(x)+h,Math.round(y)+h);c.rotate(q*Math.PI/2);if(flip)c.scale(-1,1);c.translate(-h,-h);c.imageSmoothingEnabled=false;spr(c,k,0,0,sc);c.restore();}
function silly_bubble(c,s,x,y,col){smallText(c,s,x+1,y+1,'#000','center',16);smallText(c,s,x,y,col,'center',16);}
designs.push({name:'3e. The Clown Has All Access',desc:'Red alert, but the clown got hold of an ID: he honks down the corridor opening every door, crew flee ahead of him, and chasing officers slip on his banana peels.',draw(c,t){
 c.fillStyle='#000';c.fillRect(0,0,W,W);c.save();c.imageSmoothingEnabled=false;
 const sp=90,P=0.5+0.5*Math.sin(t*5);
 // wall (parallax) and floor
 const wo=-Math.floor((t*sp*.5)%96),fo=-Math.floor((t*sp)%96);
 for(let x=wo;x<W;x+=96)for(let y=0;y<192;y+=96)spr(c,'silly_wall',x,y,3);
 for(let x=fo;x<W;x+=96)for(let y=216;y<W;y+=96)spr(c,'floor',x,y,3);
 c.fillStyle='#000';c.fillRect(0,192,W,24);c.fillStyle='#d9b400';c.fillRect(0,192,W,4);c.fillStyle='#222';c.fillRect(0,196,W,2);
 for(let x=(fo*2)%48-48;x<W;x+=48){c.fillStyle='#111';c.fillRect(x,192,24,4);}
 c.fillStyle='rgba(0,0,0,.2)';c.fillRect(0,0,W,192);c.fillStyle='rgba(0,0,0,.2)';c.fillRect(0,198,W,W);
 // doors: open as the clown passes
 const CX=270;
 for(let k=0;k<4;k++){const x=(((k*192-t*sp*.5)%768)+768)%768-144,d=Math.abs(x+48-CX);
  const f=d<30?7:d<110?Math.max(1,Math.min(6,Math.round(6-(d-30)/80*5))):0;
  if(f>0){c.fillStyle='#200';c.fillRect(x+6,102,84,90);c.fillStyle=`rgba(255,${60+P*40|0},40,.5)`;c.fillRect(x+6,102,84,90);}
  spr(c,'silly_door',x,96,3,f);}
 // sirens
 c.save();c.globalCompositeOperation='lighter';
 for(const [cx,cy] of [[40,120],[440,120]]){c.save();c.translate(cx,cy);c.rotate(t*3+(cx>200?Math.PI:0));const g=c.createRadialGradient(0,0,0,0,0,360);g.addColorStop(0,'rgba(255,50,30,.5)');g.addColorStop(1,'rgba(255,0,0,0)');c.fillStyle=g;for(let h=0;h<2;h++){c.beginPath();c.moveTo(0,0);c.arc(0,0,360,-.25,.25);c.closePath();c.fill();c.rotate(Math.PI);}c.restore();}
 c.restore();
 for(const cx of [40,440]){c.fillStyle='#600';c.fillRect(cx-9,111,18,18);c.fillStyle=P>.5?'#f44':'#a22';c.fillRect(cx-6,114,12,12);c.fillStyle='#fcc';c.fillRect(cx-3,116,3,3);}
 // actors, sorted by lane
 const A=[],T=5;
 // clown
 const cb=Math.floor(t*6)%2?0:-4;
 A.push({fy:420,draw(){silly_sh(c,CX-60,420,120);spr(c,'silly_clownE',CX-64,420-128+cb,4);
  const pu=Math.sin(t*5*1.3)>.2?1:0;spr(c,'silly_horn',CX+50+pu*3,420-104+cb-pu*3,2);
  if(pu){c.strokeStyle='#ff4';c.lineWidth=3;for(let r=0;r<2;r++){c.beginPath();c.arc(CX+66,420-88+cb,24+r*14,-.8,.8);c.stroke();}}}});
 // fleeing crew ahead
 [['silly_ntE',395,3,0,'!'],['silly_russE',450,3,1.7,'?!'],['silly_ianE',372,2,3.1,'']].forEach(([k,fy,sc,ph,b],i)=>{
  const x=[432,395,362][i]+Math.sin(t*1.1+ph)*14,bob=Math.floor(t*7+i)%2?0:-sc;
  A.push({fy,draw(){const fy2=fy;silly_sh(c,x+16*sc/2-10,fy2,sc*20);spr(c,k,x,fy2-32*sc+bob,sc);
   if(b&&Math.floor(t*3+i)%2)silly_bubble(c,b,x+16*sc,fy2-32*sc-14,'#ff6');}});});
 // peels + chasing officers
 [[0,'silly_ntE',4,455],[T/2,'silly_secbot',3,430]].forEach(([off,k,sc,fy])=>{
  const u=((t+off)%T+T)%T,pxx=CX-60-sp*u,vo=130,x0=-140;
  const tm=(CX-60-x0)/(vo+sp),xs=x0+vo*tm; // slip point
  const py=u<.4?fy-(420-fy)*0:fy;
  // peel tossed from clown's feet to the lane
  const a=Math.min(1,u/.45),pyy=420+(fy-420)*a-Math.sin(a*Math.PI)*40;
  A.push({fy:Math.max(fy-1,pyy),draw(){spr(c,'silly_peel',pxx,pyy-76,3);}});
  let ox,oy=0,q=0,fl=0;
  if(u<tm){ox=x0+vo*u;oy=0;}
  else{const d=u-tm,air=Math.min(d,.7);ox=xs+60*Math.min(d,.5)-sp*Math.max(0,d-.5)+0;oy=-Math.sin(Math.min(1,d/.7)*Math.PI)*70;q=-Math.min(3,Math.floor(d/.7*4));if(d>=.7)q=-1;}
  const bob=u<tm&&Math.floor(u*8)%2?0:-sc;
  A.push({fy,draw(){silly_sh(c,ox+8*sc-8,fy,sc*20);
   if(u>=tm&&u-tm>.7){silly_rot(c,k,ox,fy-32*sc,sc,q,0);}
   else silly_rot(c,k,ox,fy-32*sc+oy+(u<tm?bob:0),sc,q,0);
   const d=u-tm;
   if(d>0&&d<1.2)silly_bubble(c,Math.floor(d*6)%2?'*BONK*':'WHOA!',ox+16*sc,fy-32*sc-18-(d<.7?0:0),'#fff');
   else if(d>=1.2&&d<2.6)silly_bubble(c,'*',ox+16*sc+(Math.floor(d*5)%2?-6:6),fy-sc*16-6,'#ff6');}});});
 A.sort((a,b)=>a.fy-b.fy).forEach(a=>a.draw());
 c.restore();
 // red lights and vignette
 c.fillStyle=`rgba(190,0,0,${.07+.13*P})`;c.fillRect(0,0,W,W);
 const g2=c.createRadialGradient(W/2,W/2,160,W/2,W/2,350);g2.addColorStop(0,'rgba(0,0,0,0)');g2.addColorStop(1,'rgba(0,0,0,.55)');c.fillStyle=g2;c.fillRect(0,0,W,W);
 // logo banner
 const by=0,bh=106,bg=c.createLinearGradient(0,by,0,by+bh);bg.addColorStop(0,'rgba(18,0,0,.92)');bg.addColorStop(.8,'rgba(18,0,0,.88)');bg.addColorStop(1,'rgba(18,0,0,.55)');
 c.fillStyle=bg;c.fillRect(0,by,W,bh);c.fillStyle=`rgba(255,60,50,${.55+.35*P})`;c.fillRect(0,bh-3,W,3);
 pixText(c,L(),W/2,10,16,4,'#fff','#f22');
 if(Math.floor(t*2)%2)smallText(c,'!! ALL ACCESS GRANTED: CLOWN !!',W/2,bh-17,'#ff6','center',14);}});


designs.sort((a,b)=>a.name<b.name?-1:1);
export const DESIGNS = designs;

let loading = null;
/** fetch every sprite once; resolves when all are decoded */
export function loadLobbyArt(base = new URL("img/lobby/", import.meta.url)) {
	return loading ??= Promise.all(Object.keys(FRAMES).map((k) => { const i = new Image(); i.src = new URL(k + ".png", base).href; IMG[k] = i; return i.decode(); }));
}

/** The overlay over `host` (the map window). show(true) in the lobby; show(false) once the player has a body or observes: the canvas fades
 *  out over FADE_MS (tg's join splash fade, /obj/screen/splash Fade: 3 s), then goes and the animation stops. One design per page load
 *  (Math.random, not the game's RNG); `pick` (a design name prefix) is for tests. */
export const FADE_MS = 3000;
export function createLobbyArt(host, pick) {
	const d = (pick && designs.find((x) => x.name.startsWith(pick))) || designs[Math.floor(Math.random() * designs.length)];
	let cv = null, raf = 0, t0 = 0, on = false, fading = 0;
	const frame = () => {
		raf = requestAnimationFrame(frame);
		const c = cv.getContext("2d"); c.imageSmoothingEnabled = false; c.save(); d.draw(c, (performance.now() - t0) / 1000); c.restore();
	};
	const drop = () => { clearTimeout(fading); fading = 0; cancelAnimationFrame(raf); raf = 0; cv?.remove(); cv = null; };
	return {
		design: d.name,
		menuY: d.menuY ?? 176, // where the lobby menu (lobby-menu.js) sits on this picture, in its 480 px: below a logo or countdown in the middle
		get shown() { return !!cv; },
		get wanted() { return on; },
		show(want) {
			if (want === on) return;
			on = want;
			if (!want) {
				if (!cv) return;
				cv.style.transition = `opacity ${FADE_MS}ms linear`; cv.style.opacity = "0";
				fading = setTimeout(drop, FADE_MS);
				return;
			}
			if (fading) drop(); // back in the lobby mid-fade: start over
			loadLobbyArt().then(() => {
				if (!on || cv) return;
				cv = document.createElement("canvas"); cv.width = cv.height = W; cv.className = "lobby-art";
				crispText(cv.getContext("2d"));
				host.append(cv); t0 = performance.now(); frame();
			}, () => {}); // sprites didn't load: tg's own lobby picture stays
		},
	};
}
