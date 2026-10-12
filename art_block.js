/* ============ GENERATIVE ART ============ */
var PALS={
 forest:["#0E2417","#1F4B32","#5E7B58","#C6F23A"],
 sage:["#D3DCCB","#93A98E","#5B6F51","#F4F2EA"],
 champagne:["#EFE4C8","#BDA46C","#7C6B3F","#FFF8E6"],
 ink:["#060B08","#15241A","#2E4A38","#C6F23A"],
 olive:["#262B14","#69713F","#A9AE70","#EBE4BA"],
 mist:["#E1E6DD","#AEBCAE","#476650","#FFFFFF"],
 dusk:["#101811","#44563A","#C9B58A","#F6EAC9"]
};
function rng(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function hexA(h,a){var n=parseInt(h.slice(1),16);return "rgba("+(n>>16&255)+","+(n>>8&255)+","+(n&255)+","+a+")"}
function mix(a,b,t){var A=parseInt(a.slice(1),16),B=parseInt(b.slice(1),16);var r=Math.round((A>>16&255)*(1-t)+(B>>16&255)*t),g=Math.round((A>>8&255)*(1-t)+(B>>8&255)*t),l=Math.round((A&255)*(1-t)+(B&255)*t);return "#"+((1<<24)+(r<<16)+(g<<8)+l).toString(16).slice(1)}
function mkNoise(r){var t=[],i;for(i=0;i<512;i++)t.push(r());function s(x){var i=Math.floor(x),f=x-i;f=f*f*(3-2*f);return t[i&511]*(1-f)+t[(i+1)&511]*f}
 return function(x,oct){var v=0,a=.5,fr=1,n=oct||4,tot=0,k;for(k=0;k<n;k++){v+=a*s(x*fr+k*17.3+64);tot+=a;a*=.5;fr*=2}return v/tot}}
var grainTile=null;
function grain(){if(grainTile)return grainTile;var t=document.createElement("canvas");t.width=t.height=200;var x=t.getContext("2d"),d=x.createImageData(200,200),i,v;for(i=0;i<d.data.length;i+=4){v=Math.random()*255;d.data[i]=d.data[i+1]=d.data[i+2]=v;d.data[i+3]=255}x.putImageData(d,0,0);grainTile=t;return t}
function finish(c,W,H){
 var v=c.createRadialGradient(W/2,H/2,Math.min(W,H)*.35,W/2,H/2,Math.max(W,H)*.78);
 v.addColorStop(0,"rgba(0,0,0,0)");v.addColorStop(1,"rgba(0,0,0,.42)");c.fillStyle=v;c.fillRect(0,0,W,H);
 c.save();c.globalCompositeOperation="overlay";c.globalAlpha=.16;c.fillStyle=c.createPattern(grain(),"repeat");c.fillRect(0,0,W,H);c.restore();
}
function skyGlow(c,W,H,x,y,rad,col,a){var g=c.createRadialGradient(x,y,0,x,y,rad);g.addColorStop(0,hexA(col,a));g.addColorStop(.3,hexA(col,a*.4));g.addColorStop(1,hexA(col,0));c.fillStyle=g;c.fillRect(0,0,W,H)}
function motes(c,W,H,r,p,cx,cy,spread,n){c.save();c.globalCompositeOperation="lighter";for(var i=0;i<n;i++){var x=cx+(r()-.5)*spread*2,y=cy+(r()-.5)*spread*1.4,s=.8+r()*2.6;c.fillStyle=hexA(p[3],.15+r()*.5);c.beginPath();c.arc(x,y,s,0,7);c.fill()}c.restore()}

/* misty mountain ridges with sun, rays and pines */
function scapeRidges(c,W,H,p,r){
 var n=mkNoise(r),haze=mix(p[2],p[3],.55),L=7,i,k,x,j;
 var g=c.createLinearGradient(0,0,0,H*.62);g.addColorStop(0,p[0]);g.addColorStop(.55,mix(p[1],p[3],.18));g.addColorStop(1,mix(p[2],p[3],.6));
 c.fillStyle=g;c.fillRect(0,0,W,H);
 var sx=W*(.26+.48*r()),sy=H*(.34+.06*r());
 c.save();c.globalCompositeOperation="lighter";
 skyGlow(c,W,H,sx,sy,Math.max(W,H)*.75,p[3],.55);
 for(i=0;i<16;i++){var a=-Math.PI*(.05+.9*r()),w=.025+.05*r(),len=Math.max(W,H)*1.4;
  var rg=c.createRadialGradient(sx,sy,0,sx,sy,len);rg.addColorStop(0,hexA(p[3],.16));rg.addColorStop(1,hexA(p[3],0));
  c.fillStyle=rg;c.beginPath();c.moveTo(sx,sy);c.lineTo(sx+Math.cos(a-w)*len,sy+Math.sin(a-w)*len);c.lineTo(sx+Math.cos(a+w)*len,sy+Math.sin(a+w)*len);c.closePath();c.fill()}
 var R=Math.min(W,H)*.075,sg=c.createRadialGradient(sx,sy,0,sx,sy,R*1.6);
 sg.addColorStop(0,hexA("#FFFFFF",.95));sg.addColorStop(.45,hexA(p[3],.9));sg.addColorStop(1,hexA(p[3],0));
 c.fillStyle=sg;c.beginPath();c.arc(sx,sy,R*1.6,0,7);c.fill();
 c.restore();
 for(k=0;k<L;k++){
  var t=k/(L-1),base=H*(.5+.07*k+.03*t),amp=H*(.2-.1*t)*(.8+.4*r()),fr=1.6+k*.5,off=r()*50;
  c.beginPath();c.moveTo(0,H);
  for(x=0;x<=W;x+=6)c.lineTo(x,base-amp*n(x/W*fr+off,5));
  c.lineTo(W,H);c.closePath();c.fillStyle=mix(haze,p[0],Math.pow(t,.85)*.94);c.fill();
  var fg=c.createLinearGradient(0,base-amp*.2,0,base+H*.1);fg.addColorStop(0,hexA(haze,0));fg.addColorStop(1,hexA(haze,.38*(1-t)+.04));
  c.fillStyle=fg;c.fillRect(0,base-amp*.2,W,H*.3);
  if(k>=L-2){
   var d=k-(L-2),tc=mix(p[0],"#000000",.3+.2*d);c.fillStyle=tc;
   for(x=0;x<=W;x+=Math.max(6,W/70)*(.7+.6*r())){
    var yy=base-amp*n(x/W*fr+off,5),th=H*(.04+.05*r())*(1+d*.6),tw=th*.38;
    for(j=0;j<4;j++){var hh=th*(1-j*.2),ww=tw*(1-j*.18),yb=yy-j*th*.2;c.beginPath();c.moveTo(x-ww,yb);c.lineTo(x,yb-hh*.55);c.lineTo(x+ww,yb);c.closePath();c.fill()}
   }
  }
 }
 motes(c,W,H,r,p,sx,sy+H*.15,W*.4,60);
}

/* receding stone arcade lit from the far end */
function scapeCorridor(c,W,H,p,r){
 var N=7,i;
 var bg=c.createRadialGradient(W/2,H*.52,0,W/2,H*.52,W*.75);bg.addColorStop(0,p[3]);bg.addColorStop(.35,mix(p[3],p[2],.55));bg.addColorStop(1,p[0]);
 c.fillStyle=bg;c.fillRect(0,0,W,H);
 var hy=H*.56,fl=c.createLinearGradient(0,hy,0,H);fl.addColorStop(0,mix(p[2],p[3],.5));fl.addColorStop(1,p[0]);
 c.fillStyle=fl;c.fillRect(0,hy,W,H-hy);
 c.save();c.globalCompositeOperation="lighter";
 var st=c.createLinearGradient(0,hy,0,H);st.addColorStop(0,hexA(p[3],.5));st.addColorStop(1,hexA(p[3],0));c.fillStyle=st;
 c.beginPath();c.moveTo(W/2-W*.06,hy);c.lineTo(W/2+W*.06,hy);c.lineTo(W/2+W*.3,H);c.lineTo(W/2-W*.3,H);c.closePath();c.fill();c.restore();
 for(i=0;i<N;i++){
  var t=(i+1)/N,wi=W*(.15+.7*Math.pow(t,1.6)),x0=(W-wi)/2,x1=x0+wi,yf=i===N-1?H+4:H*(.56+.44*Math.pow(t,1.5)),yt=yf-wi*1.5,ar=wi/2;
  var col=mix(mix(p[2],p[3],.35),p[0],Math.pow(t,.9));
  var wg=c.createLinearGradient(0,0,W,0);wg.addColorStop(0,mix(col,p[0],.6));wg.addColorStop(.5,col);wg.addColorStop(1,mix(col,p[0],.6));
  c.beginPath();c.rect(0,0,W,yf);c.moveTo(x0,yf);c.lineTo(x0,yt+ar);c.arc(W/2,yt+ar,ar,Math.PI,0);c.lineTo(x1,yf);c.closePath();
  c.fillStyle=wg;c.fill("evenodd");
  c.beginPath();c.moveTo(x0,yf);c.lineTo(x0,yt+ar);c.arc(W/2,yt+ar,ar,Math.PI,0);c.lineTo(x1,yf);
  c.strokeStyle=hexA(p[3],.38*(1-t*.5));c.lineWidth=2+t*3;c.stroke();
 }
 c.save();c.globalCompositeOperation="lighter";skyGlow(c,W,H,W/2,H*.52,W*.5,p[3],.3);c.restore();
 motes(c,W,H,r,p,W/2,H*.5,W*.3,50);
}

/* soft translucent cells and bokeh */
function scapeCells(c,W,H,p,r){
 var i,g=c.createLinearGradient(0,0,W,H);g.addColorStop(0,p[0]);g.addColorStop(1,mix(p[0],p[1],.8));c.fillStyle=g;c.fillRect(0,0,W,H);
 skyGlow(c,W,H,W*(.3+.4*r()),H*(.3+.4*r()),Math.max(W,H)*.6,p[2],.55);
 c.save();c.globalCompositeOperation="lighter";
 for(i=0;i<70;i++){
  var rad=Math.min(W,H)*(.012+.07*r()*r()),x=r()*W,y=r()*H,col=r()>.35?p[3]:p[2];
  var q=c.createRadialGradient(x,y,0,x,y,rad);q.addColorStop(0,hexA(col,.05));q.addColorStop(.8,hexA(col,.12+.1*r()));q.addColorStop(.93,hexA(col,.4));q.addColorStop(1,hexA(col,0));
  c.fillStyle=q;c.beginPath();c.arc(x,y,rad,0,7);c.fill();
 }
 for(i=0;i<5;i++){
  var R2=Math.min(W,H)*(.1+.1*r()),cx=W*(.15+.7*r()),cy=H*(.15+.7*r());
  var cg=c.createRadialGradient(cx-R2*.3,cy-R2*.3,0,cx,cy,R2);cg.addColorStop(0,hexA(p[3],.18));cg.addColorStop(.85,hexA(p[2],.14));cg.addColorStop(1,hexA(p[3],.5));
  c.fillStyle=cg;c.beginPath();c.arc(cx,cy,R2,0,7);c.fill();
  c.strokeStyle=hexA(p[3],.5);c.lineWidth=2;c.stroke();
  var nu=c.createRadialGradient(cx+R2*.1,cy+R2*.05,0,cx+R2*.1,cy+R2*.05,R2*.35);nu.addColorStop(0,hexA(p[3],.55));nu.addColorStop(1,hexA(p[3],0));
  c.fillStyle=nu;c.beginPath();c.arc(cx+R2*.1,cy+R2*.05,R2*.35,0,7);c.fill();
 }
 c.restore();
}

/* layered silk or dunes */
function scapeSilk(c,W,H,p,r){
 var L=8,k,x,g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,mix(p[0],p[1],.4));g.addColorStop(1,p[0]);c.fillStyle=g;c.fillRect(0,0,W,H);
 skyGlow(c,W,H,W*(.55+.3*r()),H*.2,Math.max(W,H)*.7,p[3],.4);
 for(k=0;k<L;k++){
  var t=k/(L-1),base=H*(.28+.6*t),A=H*(.05+.05*r()),B=H*(.02+.02*r()),f1=1.2+r()*1.6,f2=3+r()*3,ph=r()*6;
  var top=base-A-B;
  var lg=c.createLinearGradient(0,top,0,H);lg.addColorStop(0,mix(p[3],p[2],.25+.5*t));lg.addColorStop(.35,mix(p[2],p[1],.3+.4*t));lg.addColorStop(1,mix(p[1],p[0],.5+.5*t));
  c.beginPath();c.moveTo(0,H);
  for(x=0;x<=W;x+=6)c.lineTo(x,base+Math.sin(x/W*f1*6.283+ph)*A+Math.sin(x/W*f2*6.283+ph*2)*B);
  c.lineTo(W,H);c.closePath();c.fillStyle=lg;c.fill();
  c.save();c.shadowColor=p[3];c.shadowBlur=16;c.strokeStyle=hexA(p[3],.5-.3*t);c.lineWidth=2;c.beginPath();
  for(x=0;x<=W;x+=6){var y=base+Math.sin(x/W*f1*6.283+ph)*A+Math.sin(x/W*f2*6.283+ph*2)*B;x?c.lineTo(x,y):c.moveTo(x,y)}
  c.stroke();c.restore();
 }
}

/* shaded planet with atmosphere */
function scapePlanet(c,W,H,p,r){
 var i,n=mkNoise(r),g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,p[0]);g.addColorStop(1,mix(p[0],p[1],.7));c.fillStyle=g;c.fillRect(0,0,W,H);
 c.save();c.globalCompositeOperation="lighter";for(i=0;i<160;i++){c.fillStyle=hexA(p[3],.1+r()*.5);c.beginPath();c.arc(r()*W,r()*H,r()*1.4+.3,0,7);c.fill()}c.restore();
 var cx=W*.5,cy=H*.52,R=Math.min(W,H)*.32;
 c.save();c.globalCompositeOperation="lighter";
 var at=c.createRadialGradient(cx,cy,R*.9,cx,cy,R*1.8);at.addColorStop(0,hexA(p[3],.5));at.addColorStop(.3,hexA(p[2],.2));at.addColorStop(1,hexA(p[2],0));c.fillStyle=at;c.fillRect(0,0,W,H);c.restore();
 var bd=c.createRadialGradient(cx-R*.4,cy-R*.45,R*.05,cx,cy,R*1.05);bd.addColorStop(0,p[3]);bd.addColorStop(.45,mix(p[2],p[3],.2));bd.addColorStop(1,p[0]);
 c.fillStyle=bd;c.beginPath();c.arc(cx,cy,R,0,7);c.fill();
 c.save();c.beginPath();c.arc(cx,cy,R,0,7);c.clip();
 for(i=0;i<14;i++){var by=cy-R+(i+.5)*R*2/14;c.beginPath();c.moveTo(cx-R,by);
  for(var x=-R;x<=R;x+=8)c.lineTo(cx+x,by+(n(x/R*1.5+i*3,3)-.5)*R*.16);
  c.strokeStyle=(i%2?"rgba(0,0,0,.14)":hexA(p[3],.1));c.lineWidth=R*.07;c.stroke()}
 var sh=c.createRadialGradient(cx-R*.55,cy-R*.6,R*.3,cx+R*.2,cy+R*.2,R*1.35);sh.addColorStop(0,"rgba(0,0,0,0)");sh.addColorStop(.7,"rgba(0,0,0,.45)");sh.addColorStop(1,"rgba(0,0,0,.85)");
 c.fillStyle=sh;c.fillRect(cx-R,cy-R,R*2,R*2);c.restore();
 c.save();c.globalCompositeOperation="lighter";c.strokeStyle=hexA(p[3],.6);c.lineWidth=2;c.shadowColor=p[3];c.shadowBlur=18;c.beginPath();c.arc(cx,cy,R,Math.PI*1.05,Math.PI*1.55);c.stroke();c.restore();
}

/* still lake with mirrored ridge and sun path */
function scapeLake(c,W,H,p,r){
 var n=mkNoise(r),hy=H*.55,x,i,sx=W*(.3+.4*r()),sy=H*.36;
 var sk=c.createLinearGradient(0,0,0,hy);sk.addColorStop(0,p[0]);sk.addColorStop(1,mix(p[2],p[3],.65));c.fillStyle=sk;c.fillRect(0,0,W,hy);
 c.save();c.globalCompositeOperation="lighter";skyGlow(c,W,H,sx,sy,Math.max(W,H)*.6,p[3],.5);
 var sg=c.createRadialGradient(sx,sy,0,sx,sy,Math.min(W,H)*.1);sg.addColorStop(0,hexA("#FFFFFF",.95));sg.addColorStop(.5,hexA(p[3],.8));sg.addColorStop(1,hexA(p[3],0));c.fillStyle=sg;c.beginPath();c.arc(sx,sy,Math.min(W,H)*.1,0,7);c.fill();c.restore();
 var fr=2.2,off=r()*40,amp=H*.16,rc=mix(p[1],p[0],.55);
 c.beginPath();c.moveTo(0,hy);for(x=0;x<=W;x+=6)c.lineTo(x,hy-amp*n(x/W*fr+off,5));c.lineTo(W,hy);c.closePath();c.fillStyle=rc;c.fill();
 var wg=c.createLinearGradient(0,hy,0,H);wg.addColorStop(0,mix(p[2],p[3],.45));wg.addColorStop(1,mix(p[1],p[0],.7));c.fillStyle=wg;c.fillRect(0,hy,W,H-hy);
 c.save();c.globalAlpha=.55;c.beginPath();c.moveTo(0,hy);for(x=0;x<=W;x+=6)c.lineTo(x,hy+amp*n(x/W*fr+off,5)*.9);c.lineTo(W,hy);c.closePath();c.fillStyle=rc;c.fill();c.restore();
 c.save();c.globalCompositeOperation="lighter";
 for(i=0;i<40;i++){var y=hy+8+i*(H-hy)/40,w=Math.min(W,H)*(.16*(1-i/48)+.02)*(.6+r()*.8),xx=sx+(r()-.5)*w*.5;c.fillStyle=hexA(p[3],.5*(1-i/44));c.fillRect(xx-w/2,y,w,1.5+i*.05)}
 for(i=0;i<70;i++){var yy=hy+r()*(H-hy),ww=W*(.05+.25*r()),xr=r()*W;c.fillStyle=hexA(p[3],.04+.08*r());c.fillRect(xr,yy,ww,1)}
 c.restore();
 var mg=c.createLinearGradient(0,hy-H*.06,0,hy+H*.06);mg.addColorStop(0,hexA(mix(p[2],p[3],.6),0));mg.addColorStop(.5,hexA(mix(p[2],p[3],.6),.45));mg.addColorStop(1,hexA(mix(p[2],p[3],.6),0));c.fillStyle=mg;c.fillRect(0,hy-H*.06,W,H*.12);
}

/* diagnostics lab: perspective grid and signal network */
function scapeLab(c,W,H,p,r){
 var hy=H*.55,i,g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,p[0]);g.addColorStop(.55,mix(p[0],p[1],.9));g.addColorStop(1,p[0]);c.fillStyle=g;c.fillRect(0,0,W,H);
 c.save();c.globalCompositeOperation="lighter";
 var hg=c.createRadialGradient(W/2,hy,0,W/2,hy,W*.6);hg.addColorStop(0,hexA(p[3],.5));hg.addColorStop(.4,hexA(p[2],.25));hg.addColorStop(1,hexA(p[2],0));
 c.save();c.translate(0,hy);c.scale(1,.45);c.translate(0,-hy);c.fillStyle=hg;c.fillRect(0,0,W,H*2);c.restore();
 c.lineWidth=1.4;
 for(i=-24;i<=24;i++){var xb=W/2+i*W*.09,lg=c.createLinearGradient(0,hy,0,H);lg.addColorStop(0,hexA(p[3],0));lg.addColorStop(1,hexA(p[3],.4));c.strokeStyle=lg;c.beginPath();c.moveTo(W/2+i*W*.006,hy);c.lineTo(xb,H);c.stroke()}
 for(i=1;i<=16;i++){var y=hy+(H-hy)*Math.pow(i/16,2.1);c.strokeStyle=hexA(p[3],.08+.3*i/16);c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke()}
 var pts=[];for(i=0;i<16;i++)pts.push([W*(.06+.88*r()),H*(.06+.4*r()),2+r()*4]);
 c.strokeStyle=hexA(p[3],.28);c.lineWidth=1.2;
 pts.forEach(function(a,ai){pts.forEach(function(b,bi){if(bi>ai&&Math.hypot(a[0]-b[0],a[1]-b[1])<W*.26){c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke()}})});
 pts.forEach(function(a){var q=c.createRadialGradient(a[0],a[1],0,a[0],a[1],a[2]*5);q.addColorStop(0,hexA(p[3],.95));q.addColorStop(.25,hexA(p[3],.5));q.addColorStop(1,hexA(p[3],0));c.fillStyle=q;c.beginPath();c.arc(a[0],a[1],a[2]*5,0,7);c.fill()});
 c.restore();
}
var SCAPES={dawn:scapeRidges,arch:scapeCorridor,rings:scapeCells,waves:scapeSilk,orb:scapePlanet,strata:scapeLake,grid:scapeLab};
function draw(cv){
 if(cv.dataset.done)return;cv.dataset.done="1";
 var W=cv.width=+cv.dataset.w||720,H=cv.height=+cv.dataset.h||900;
 var c=cv.getContext("2d"),p=PALS[cv.dataset.pal]||PALS.forest,r=rng(+cv.dataset.seed||1);
 (SCAPES[cv.dataset.art]||scapeRidges)(c,W,H,p,r);
 finish(c,W,H);
}
