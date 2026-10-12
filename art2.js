/* ============ GENERATIVE ARCHITECTURAL IMAGERY ============ */
var PALS={
 forest:["#0C211C","#173D35","#6F8D80","#D8C9A2"],
 charcoal:["#101312","#202322","#5D6561","#CDBD90"],
 ivory:["#CFCABD","#BFC6BA","#A8B5A8","#FFFFFF"],
 sage:["#51675C","#7E9486","#C4CEC3","#FFF8E6"],
 stone:["#2A2E2C","#6B6F66","#CFC9B8","#F7F5F0"],
 warm:["#1A1814","#4A4232","#B8A477","#F4E8C8"]
};
function rng(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function hexA(h,a){var n=parseInt(h.slice(1),16);return "rgba("+(n>>16&255)+","+(n>>8&255)+","+(n&255)+","+a+")"}
function mix(a,b,t){var A=parseInt(a.slice(1),16),B=parseInt(b.slice(1),16);var r=Math.round((A>>16&255)*(1-t)+(B>>16&255)*t),g=Math.round((A>>8&255)*(1-t)+(B>>8&255)*t),l=Math.round((A&255)*(1-t)+(B&255)*t);return "#"+((1<<24)+(r<<16)+(g<<8)+l).toString(16).slice(1)}
function lerp(a,b,t){return a+(b-a)*t}
var grainTile=null;
function grain(){if(grainTile)return grainTile;var t=document.createElement("canvas");t.width=t.height=200;var x=t.getContext("2d"),d=x.createImageData(200,200),i,v;for(i=0;i<d.data.length;i+=4){v=Math.random()*255;d.data[i]=d.data[i+1]=d.data[i+2]=v;d.data[i+3]=255}x.putImageData(d,0,0);grainTile=t;return t}
function finish(c,W,H,vig){
 var v=c.createRadialGradient(W/2,H/2,Math.min(W,H)*.4,W/2,H/2,Math.max(W,H)*.8);
 v.addColorStop(0,"rgba(0,0,0,0)");v.addColorStop(1,"rgba(0,0,0,"+(vig==null?.34:vig)+")");c.fillStyle=v;c.fillRect(0,0,W,H);
 c.save();c.globalCompositeOperation="overlay";c.globalAlpha=.13;c.fillStyle=c.createPattern(grain(),"repeat");c.fillRect(0,0,W,H);c.restore();
}
function glow(c,W,H,x,y,rad,col,a){var g=c.createRadialGradient(x,y,0,x,y,rad);g.addColorStop(0,hexA(col,a));g.addColorStop(.35,hexA(col,a*.4));g.addColorStop(1,hexA(col,0));c.fillStyle=g;c.fillRect(0,0,W,H)}
function rr(c,x,y,w,h,r){r=Math.max(0,Math.min(r,w/2,h/2));c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()}
function poly(c,pts){c.beginPath();pts.forEach(function(q,i){i?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1])});c.closePath()}
function sil(c,cx,cy,s,col){c.fillStyle=col;c.beginPath();c.arc(cx,cy-s*.62,s*.2,0,7);c.fill();c.beginPath();c.moveTo(cx-s*.42,cy);c.quadraticCurveTo(cx-s*.4,cy-s*.36,cx,cy-s*.38);c.quadraticCurveTo(cx+s*.4,cy-s*.36,cx+s*.42,cy);c.closePath();c.fill()}

/* grid of video tiles (virtual proceeding) */
function tilesPanel(c,x,y,w,h,p,r,cols,rows){
 var gap=Math.min(w,h)*.025,tw=(w-gap*(cols+1))/cols,th=(h-gap*(rows+1))/rows,i,j,act=Math.floor(r()*cols*rows);
 for(j=0;j<rows;j++)for(i=0;i<cols;i++){
  var tx=x+gap+i*(tw+gap),ty=y+gap+j*(th+gap),g=c.createLinearGradient(0,ty,0,ty+th);
  g.addColorStop(0,mix(p[1],p[2],.2+.35*r()));g.addColorStop(1,mix(p[0],p[1],.5));
  rr(c,tx,ty,tw,th,Math.min(tw,th)*.07);c.fillStyle=g;c.fill();
  c.save();rr(c,tx,ty,tw,th,Math.min(tw,th)*.07);c.clip();sil(c,tx+tw/2+(r()-.5)*tw*.1,ty+th*1.02,Math.min(tw,th*1.3)*.95,hexA(p[0],.6));c.restore();
  rr(c,tx+tw*.05,ty+th*.82,tw*.34,th*.09,th*.045);c.fillStyle="rgba(255,255,255,.35)";c.fill();
  if(j*cols+i===act){rr(c,tx,ty,tw,th,Math.min(tw,th)*.07);c.strokeStyle=p[3];c.lineWidth=Math.max(2,Math.min(tw,th)*.02);c.stroke()}
 }
}

/* one-point perspective interiors: hearing room, boardroom, video room, evidence room, lounge, breakout */
function sceneRoom(c,W,H,p,r,v){
 var cfg={hearing:["window",1,1],board:["window",1,1],vc:["tiles",1,1],evidence:["doc",1,1],lounge:["window",0,0],breakout:["window",1,0]}[v]||["window",1,1];
 var back=cfg[0],table=cfg[1],chairs=cfg[2],i,t,g;
 var ix0=W*(.27+.07*r()),ix1=W-ix0,iy0=H*(.24+.08*r()),iy1=H*(.6+.06*r());
 g=c.createLinearGradient(0,0,0,iy0);g.addColorStop(0,p[0]);g.addColorStop(1,mix(p[1],p[2],.35));
 poly(c,[[0,0],[W,0],[ix1,iy0],[ix0,iy0]]);c.fillStyle=g;c.fill();
 g=c.createLinearGradient(0,0,ix0,0);g.addColorStop(0,mix(p[0],p[1],.4));g.addColorStop(1,mix(p[1],p[2],.5));
 poly(c,[[0,0],[ix0,iy0],[ix0,iy1],[0,H]]);c.fillStyle=g;c.fill();
 g=c.createLinearGradient(W,0,ix1,0);g.addColorStop(0,mix(p[0],p[1],.4));g.addColorStop(1,mix(p[1],p[2],.5));
 poly(c,[[W,0],[ix1,iy0],[ix1,iy1],[W,H]]);c.fillStyle=g;c.fill();
 g=c.createLinearGradient(0,iy1,0,H);g.addColorStop(0,mix(p[1],p[2],.25));g.addColorStop(1,p[0]);
 poly(c,[[0,H],[W,H],[ix1,iy1],[ix0,iy1]]);c.fillStyle=g;c.fill();
 c.fillStyle=mix(p[1],p[2],.55);c.fillRect(ix0,iy0,ix1-ix0,iy1-iy0);
 var bx0=lerp(ix0,ix1,.1),bx1=lerp(ix0,ix1,.9),by0=lerp(iy0,iy1,.12),by1=lerp(iy0,iy1,.9);
 if(back==="window"){
  g=c.createLinearGradient(0,by0,0,by1);g.addColorStop(0,mix(p[3],"#FFFFFF",.55));g.addColorStop(1,p[3]);
  c.fillStyle=g;c.fillRect(bx0,by0,bx1-bx0,by1-by0);
  c.fillStyle=hexA(p[1],.55);
  for(i=0;i<9;i++){var bw=(bx1-bx0)*(.06+.07*r()),bh=(by1-by0)*(.1+.3*r()),bx=bx0+(bx1-bx0)*(i/9)+r()*4;c.fillRect(bx,by1-bh,bw,bh)}
  c.strokeStyle=hexA(p[0],.55);c.lineWidth=Math.max(2,W*.003);
  for(i=1;i<5;i++){var mx=lerp(bx0,bx1,i/5);c.beginPath();c.moveTo(mx,by0);c.lineTo(mx,by1);c.stroke()}
  c.beginPath();c.moveTo(bx0,lerp(by0,by1,.35));c.lineTo(bx1,lerp(by0,by1,.35));c.stroke();
 }else if(back==="tiles"){
  rr(c,bx0,by0,bx1-bx0,by1-by0,W*.006);c.fillStyle=mix(p[0],"#000000",.4);c.fill();
  tilesPanel(c,bx0,by0,bx1-bx0,by1-by0,p,r,3,2);
 }else{
  rr(c,bx0,by0,bx1-bx0,by1-by0,W*.006);c.fillStyle=mix(p[3],"#FFFFFF",.75);c.fill();
  var pw=bx1-bx0,ph=by1-by0;
  c.fillStyle=hexA(p[0],.55);c.fillRect(bx0+pw*.08,by0+ph*.1,pw*.4,ph*.06);
  for(i=0;i<9;i++){c.fillStyle=hexA(p[0],.22);c.fillRect(bx0+pw*.08,by0+ph*(.24+i*.075),pw*(.5+.38*r()),ph*.03)}
  c.fillStyle=hexA(p[2],.55);c.fillRect(bx0+pw*.08,by0+ph*(.24+3*.075)-ph*.01,pw*.7,ph*.05);
 }
 for(i=1;i<=5;i++){
  var d=i/6,xl=lerp(0,ix0,d),xr=lerp(W,ix1,d);
  c.strokeStyle="rgba(255,255,255,.07)";c.lineWidth=1.5;
  c.beginPath();c.moveTo(xl,lerp(0,iy0,d));c.lineTo(xl,lerp(H,iy1,d));c.stroke();
  c.beginPath();c.moveTo(xr,lerp(0,iy0,d));c.lineTo(xr,lerp(H,iy1,d));c.stroke();
 }
 c.save();c.globalCompositeOperation="lighter";
 [.3,.5,.7].forEach(function(f){
  var nx=W*f,fx=lerp(ix0,ix1,f),wn=W*.02,wf=W*.004,sg=c.createLinearGradient(nx,0,fx,iy0);
  sg.addColorStop(0,hexA(p[3],0));sg.addColorStop(1,hexA(p[3],.85));
  poly(c,[[nx-wn,0],[nx+wn,0],[fx+wf,iy0],[fx-wf,iy0]]);c.fillStyle=sg;c.fill();
  [.45,.7,.9].forEach(function(tt){var gx=lerp(nx,fx,tt),gy=lerp(0,iy0,tt);var q=c.createRadialGradient(gx,gy,0,gx,gy,W*.035*(1.2-tt));q.addColorStop(0,hexA(p[3],.5));q.addColorStop(1,hexA(p[3],0));c.fillStyle=q;c.beginPath();c.arc(gx,gy,W*.035,0,7);c.fill()});
 });
 glow(c,W,H,(bx0+bx1)/2,(by0+by1)/2,W*.45,p[3],.38);
 var rs=c.createLinearGradient(0,iy1,0,H);rs.addColorStop(0,hexA(p[3],.28));rs.addColorStop(1,hexA(p[3],0));
 poly(c,[[lerp(bx0,bx1,.4),iy1],[lerp(bx0,bx1,.6),iy1],[W*.64,H],[W*.36,H]]);c.fillStyle=rs;c.fill();
 c.restore();
 var yF=iy1+(H-iy1)*.05,yN=H*1.02,tfL=lerp(ix0,ix1,.2),tfR=lerp(ix0,ix1,.8),tnL=W*.1,tnR=W*.9;
 if(!table){
  var sc=mix(p[1],p[2],.2);
  [[W*.08,H*.74,W*.3,H*.15],[W*.62,H*.74,W*.3,H*.15]].forEach(function(s){
   var sg2=c.createLinearGradient(0,s[1],0,s[1]+s[3]);sg2.addColorStop(0,mix(sc,p[3],.2));sg2.addColorStop(1,mix(p[0],p[1],.4));
   rr(c,s[0],s[1],s[2],s[3],s[3]*.3);c.fillStyle=sg2;c.fill();
   rr(c,s[0],s[1]-s[3]*.35,s[2],s[3]*.5,s[3]*.25);c.fillStyle=mix(sc,p[3],.12);c.fill();
  });
  c.save();c.globalCompositeOperation="lighter";c.fillStyle=hexA(p[3],.12);c.beginPath();c.ellipse(W/2,H*.86,W*.22,H*.05,0,0,7);c.fill();c.restore();
 }else{
  var tl=chairs?tnL:lerp(tnL,tfL,.25),tr2=chairs?tnR:lerp(tnR,tfR,.25);
  g=c.createLinearGradient(0,yF,0,yN);g.addColorStop(0,mix(p[2],p[3],.4));g.addColorStop(.5,mix(p[1],p[2],.2));g.addColorStop(1,mix(p[0],p[1],.5));
  poly(c,[[tfL,yF],[tfR,yF],[tr2,yN],[tl,yN]]);c.fillStyle=g;c.fill();
  c.strokeStyle=hexA(p[3],.65);c.lineWidth=2;c.beginPath();c.moveTo(tfL,yF);c.lineTo(tfR,yF);c.stroke();
  c.save();c.globalCompositeOperation="lighter";var tg=c.createLinearGradient(0,yF,0,yN);tg.addColorStop(0,hexA(p[3],.35));tg.addColorStop(1,hexA(p[3],0));
  poly(c,[[W*.47,yF],[W*.53,yF],[W*.66,yN],[W*.34,yN]]);c.fillStyle=tg;c.fill();c.restore();
  if(chairs){
   [.1,.24,.4,.58,.8].forEach(function(tt){
    var y=lerp(yF,yN,tt),w=lerp(W*.03,W*.15,tt),xl=lerp(tfL,tnL,tt)-w*.62,xr=lerp(tfR,tnR,tt)+w*.62;
    [xl,xr].forEach(function(cx,k){
     var cg=c.createLinearGradient(cx-w/2,0,cx+w/2,0);cg.addColorStop(k?1:0,mix(p[0],p[1],.7));cg.addColorStop(k?0:1,mix(p[0],p[1],.3));
     rr(c,cx-w/2,y-w*1.5,w,w*1.5,w*.3);c.fillStyle=cg;c.fill();
     c.strokeStyle=hexA(p[3],.25);c.lineWidth=1.5;c.stroke();
    });
   });
  }
 }
}

/* glass and stone building facades */
function sceneFacade(c,W,H,p,r){
 var i,j,g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,mix(p[1],p[2],.5));g.addColorStop(.7,mix(p[2],p[3],.55));g.addColorStop(1,mix(p[2],p[3],.8));
 c.fillStyle=g;c.fillRect(0,0,W,H);
 c.save();c.globalCompositeOperation="lighter";glow(c,W,H,W*(.25+.5*r()),H*.62,Math.max(W,H)*.7,p[3],.5);c.restore();
 var hz=H*.86;
 for(i=0;i<9;i++){var bw=W*(.07+.08*r()),bx=r()*W,bh=H*(.22+.3*r());c.fillStyle=mix(mix(p[1],p[2],.5),mix(p[2],p[3],.5),.55);c.fillRect(bx,hz-bh,bw,bh)}
 var xs=[.04,.27,.5,.72].map(function(f){return W*(f+(r()-.5)*.03)});
 xs.forEach(function(bx,k){
  var bw=W*(.17+.08*r()),bh=H*(.42+.3*r()),top=hz-bh,col=mix(p[0],p[1],.25+.5*r());
  var bg=c.createLinearGradient(bx,0,bx+bw,0);bg.addColorStop(0,mix(col,"#000000",.2));bg.addColorStop(1,mix(col,p[2],.25));
  c.fillStyle=bg;c.fillRect(bx,top,bw,bh);
  var cw=Math.max(7,W*.017),ch=cw*1.6,cols=Math.floor((bw-cw)/(cw*1.35)),rows=Math.floor((bh-ch)/(ch*1.3));
  for(j=0;j<rows;j++)for(i=0;i<cols;i++){
   var lit=r()<.22;c.fillStyle=lit?hexA(p[3],.85):hexA(mix(p[2],p[3],.4),.22+.1*r());
   c.fillRect(bx+cw*.5+i*cw*1.35,top+ch*.5+j*ch*1.3,cw,ch);
  }
  c.save();c.globalCompositeOperation="lighter";var rg=c.createLinearGradient(bx,top,bx+bw,top+bh);rg.addColorStop(0,hexA(p[3],.16));rg.addColorStop(.5,hexA(p[3],0));c.fillStyle=rg;c.fillRect(bx,top,bw,bh);c.restore();
 });
 var fg=c.createLinearGradient(0,hz,0,H);fg.addColorStop(0,mix(p[0],p[1],.5));fg.addColorStop(1,p[0]);c.fillStyle=fg;c.fillRect(0,hz,W,H-hz);
 c.save();c.globalCompositeOperation="lighter";var rf=c.createLinearGradient(0,hz,0,H);rf.addColorStop(0,hexA(p[3],.28));rf.addColorStop(1,hexA(p[3],0));c.fillStyle=rf;c.fillRect(0,hz,W,H-hz);c.restore();
}

/* video-call wall */
function sceneTiles(c,W,H,p,r){
 var g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,p[0]);g.addColorStop(1,mix(p[0],p[1],.6));c.fillStyle=g;c.fillRect(0,0,W,H);
 glow(c,W,H,W*.5,H*.4,Math.max(W,H)*.6,p[2],.25);
 tilesPanel(c,W*.04,H*.07,W*.92,H*.86,p,r,3,2);
}

/* neutral portrait placeholder: soft backdrop with a silhouette */
function scenePortrait(c,W,H,p,r){
 var g=c.createRadialGradient(W*.5,H*.38,0,W*.5,H*.45,Math.max(W,H)*.8);g.addColorStop(0,mix(p[2],p[3],.25));g.addColorStop(1,p[0]);c.fillStyle=g;c.fillRect(0,0,W,H);
 var cx=W*(.5+(r()-.5)*.06),hy=H*.4,hr=W*.17;
 var bd=c.createLinearGradient(0,H*.6,0,H);bd.addColorStop(0,mix(p[1],p[0],.2));bd.addColorStop(1,mix(p[0],"#000000",.3));
 c.fillStyle=bd;c.beginPath();c.moveTo(W*.04,H);c.quadraticCurveTo(W*.06,H*.68,cx,H*.64);c.quadraticCurveTo(W*.94,H*.68,W*.96,H);c.closePath();c.fill();
 c.fillStyle=mix(p[2],p[3],.3);c.fillRect(cx-hr*.32,hy+hr*.7,hr*.64,hr*.9);
 var hg=c.createRadialGradient(cx-hr*.3,hy-hr*.3,hr*.1,cx,hy,hr*1.1);hg.addColorStop(0,mix(p[3],p[2],.35));hg.addColorStop(1,mix(p[2],p[1],.45));
 c.fillStyle=hg;c.beginPath();c.ellipse(cx,hy,hr*.85,hr,0,0,7);c.fill();
 c.save();c.globalCompositeOperation="lighter";c.strokeStyle=hexA(p[3],.4);c.lineWidth=3;c.beginPath();c.arc(cx,hy,hr*.95,Math.PI*1.15,Math.PI*1.6);c.stroke();c.restore();
}
var SCAPES={
 hearing:function(c,W,H,p,r){sceneRoom(c,W,H,p,r,"hearing")},
 board:function(c,W,H,p,r){sceneRoom(c,W,H,p,r,"board")},
 vc:function(c,W,H,p,r){sceneRoom(c,W,H,p,r,"vc")},
 evidence:function(c,W,H,p,r){sceneRoom(c,W,H,p,r,"evidence")},
 lounge:function(c,W,H,p,r){sceneRoom(c,W,H,p,r,"lounge")},
 breakout:function(c,W,H,p,r){sceneRoom(c,W,H,p,r,"breakout")},
 facade:sceneFacade,tiles:sceneTiles,portrait:scenePortrait
};
function draw(cv){
 if(cv.dataset.done)return;cv.dataset.done="1";
 var W=cv.width=+cv.dataset.w||800,H=cv.height=+cv.dataset.h||600;
 var c=cv.getContext("2d"),p=PALS[cv.dataset.pal]||PALS.forest,r=rng(+cv.dataset.seed||1);
 (SCAPES[cv.dataset.art]||SCAPES.hearing)(c,W,H,p,r);
 finish(c,W,H,cv.dataset.art==="portrait"?.25:.34);
}
