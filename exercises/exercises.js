import * as THREE from 'three';
const V=(x,y,z)=>new THREE.Vector3(x,y,z);
const N=(x,y,z)=>V(x,y,z).normalize();
const lerpN=(a,b,t)=>a.clone().lerp(b,t).normalize();
const tilt=h=>V(0,Math.cos(h),Math.sin(h));
const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
const X=V(1,0,0),Y=V(0,1,0),Z=V(0,0,1);
const pad=n=>(n<10?'0':'')+n;
function holdTL(secs,label){return (t,s)=>{const H=typeof secs==='function'?secs(s):secs;const C=H+4,n=Math.floor(t/C),u=t-n*C;
 if(u<1)return {a:ease(u),cue:'Get into position',rep:n,noRep:1};
 if(u<1+H){const left=Math.ceil(1+H-u);return {a:1,cue:label+' · 0:'+pad(left),rep:n,noRep:1};}
 if(u<2+H)return {a:1-ease(u-1-H),cue:'Rest',rep:n,noRep:1};
 return {a:0,cue:'Rest',rep:n,noRep:1};};}

function pushup(k,a,o){
 const top=k.m.arm+k.m.wr-0.03,Hs=top+(o.bottom-top)*a;let phi=k.mem.phi||0,D=1.4;
 for(let i=0;i<3;i++){
  k.frame(k.Q(X,Math.PI/2+phi));
  const d=V(0,-Math.sin(phi),Math.cos(phi));
  k.spine(d,d,d,d,N(0,-Math.sin(phi)-0.3,Math.cos(phi)));
  for(const sd of[1,-1]){const n=k.side(sd),ld=d.clone().negate();k.aim(n+'UpLeg',ld.clone().add(V(0.03*sd,0,0)));k.aim(n+'Leg',ld);k.aim(n+'Foot',N(0,-1,0.15));}
  k.place(k.mid('LeftToeBase','RightToeBase'),V(0,o.Ht,o.Zt));
  const sh=k.mid('LeftArm','RightArm');D=Math.hypot(sh.y-o.Ht,sh.z-o.Zt);
  if(i<2)phi=Math.asin(Math.max(-0.6,Math.min(0.6,(o.Ht-Hs)/D)));
 }
 k.mem.phi=phi;
 const hz=o.Zt+D*Math.cos(Math.asin(Math.max(-0.9,Math.min(0.9,(o.Ht-top)/D))));
 for(const sd of[1,-1]){const n=k.side(sd);k.arm(n,V(o.hx*sd,k.m.wr,hz+o.dz),o.bend(sd),V(0,-1,0));k.hand(n,'flat',V(0,-1,0),o.fdir(sd));}
}

export const EX={
 row:{name:'Bent-over dumbbell row',sub:'3 × 12 to 15 · 8 kg per hand',href:'bent-over-row.html'},

 ytw:{name:'Y, T, W raises',sub:'1 set each · 12 to 15 slow reps · 1 kg',reps:15,view:'q',dbSize:0.55,
  tips:'Face down, forehead near the floor · thumbs up · lift arms off the floor and squeeze 2 sec · don’t arch your neck',
  muscles:[['lowtrap','p'],['rhomb','p'],['reardelt','p'],['traps','s']],
  timeline(t){const C=4,T=t%(3*C),i=Math.floor(T/C),u=T-i*C,l=['Y','T','W'][i];let a,c;
   if(u<1){a=ease(u);c='Lift into '+l;}else if(u<3){a=1;c='Hold the '+l+' · squeeze 2 sec';}else{a=1-ease(u-3);c='Lower to the floor';}
   return {a,cue:c,letter:i,rep:Math.floor(t/(3*C))};},
  pose(k,a,s,st){
   k.frame(k.Q(X,Math.PI/2));
   k.spine(Z,N(0,0.02,1),N(0,0.04+0.06*a,1),N(0,0.02,1),N(0,-0.35,1));
   k.place(k.P('Hips'),V(0,0.11,-0.35));
   for(const sd of[1,-1]){const n=k.side(sd);k.aim(n+'UpLeg',N(0.05*sd,-0.06,-1));k.aim(n+'Leg',N(0.04*sd,-0.02,-1));k.aim(n+'Foot',N(0,-0.3,-0.95));
    const ly=-0.15+0.45*a;let up,fo;
    if(st.letter===0){up=fo=N(0.6*sd,ly,0.8);}
    else if(st.letter===1){up=fo=N(sd,ly,0.05);}
    else{up=N(0.8*sd,ly,-0.55);fo=N(0.45*sd,ly,0.85);}
    const palm=k.palmFromThumb(fo,Y,sd);
    k.aim(n+'Arm',up);k.aim(n+'ForeArm',fo,palm);const h=k.hand(n,'grip',palm);k.dbHand(sd>0?0:1,h);}
  }},

 sideplank:{name:'Side plank',sub:'Left down 3 × 30 to 40 sec · right down 2 × 20 to 30 sec',sides:true,view:'front',
  tips:'Elbow right under the shoulder · straight line from head to heels · hips up, don’t let them sag · breathe',
  muscles:[['obliques.W','p'],['glutemed.W','p'],['abs','s'],['frontdelt.W','s']],line:{a:'@Foot',b:'Head',w:[0,0,0.17]},
  timeline:holdTL(s=>s>0?35:25,'Hold'),
  pose(k,a,s){const w=k.side(s),o=k.side(-s),Hs=k.len[w+'Arm']+0.045,key='sp'+s;let th=k.mem[key]||0.2;
   for(let i=0;i<3;i++){
    k.frame(k.Q(Z,s*(th-Math.PI/2)));
    const bu=V(s*Math.cos(th),Math.sin(th),0),dn=V(s*Math.sin(th),-Math.cos(th),0);
    k.spine(bu,bu,bu,bu,bu);
    const ld=bu.clone().negate();k.aim(w+'UpLeg',ld);k.aim(w+'Leg',ld);
    const tl=ld.clone().add(dn.clone().multiplyScalar(0.11)).normalize();k.aim(o+'UpLeg',tl);k.aim(o+'Leg',tl);
    for(const n of[w,o])k.aim(n+'Foot',Z.clone().multiplyScalar(0.9).add(ld.clone().multiplyScalar(0.4)));
    k.place(k.P(w+'Arm'),V(0,Hs,0));
    const f=k.P(w+'Foot'),dd=f.distanceTo(k.P(w+'Arm'));
    if(i<2)th=th+Math.asin(Math.max(-0.5,Math.min(0.5,(f.y-0.055)/dd)));
   }
   k.mem[key]=th;
   k.aim(w+'Arm',V(0,-1,0));k.aim(w+'ForeArm',Z,V(0,-1,0));k.hand(w,'flat',V(0,-1,0),Z);
   k.aim(o+'Arm',Y);k.aim(o+'ForeArm',Y,Z);k.hand(o,'open',Z);
  }},

 declinepush:{name:'Decline push-ups',sub:'3 × 5 to 15 · feet on a chair',reps:12,view:'side',
  tips:'One straight line from heels to head · hands a bit wider than shoulders · elbows at about 45° · chest close to the floor',
  muscles:[['chest','p'],['frontdelt','p'],['triceps','s'],['abs','s']],line:{a:'LeftFoot',b:'Neck',o:0.12},
  tempo:[[2,0,1,'Lower your chest · 2 sec'],[0.4,1,1,'Chest just above the floor'],[1,1,0,'Push up · 1 sec'],[0.6,0,0,'Arms long · stay tight']],
  props(k){k.chair(0,-0.86,1);},
  pose(k,a){pushup(k,a,{Ht:0.49,Zt:-0.8,bottom:0.2,hx:0.21,dz:0.02,fdir:()=>Z,bend:sd=>N(0.55*sd,0.45,-0.7)});}},

 diamond:{name:'Diamond push-ups',sub:'3 × 5 to 15',reps:12,view:'side',
  tips:'Thumbs and index fingers touch under your chest · elbows brush your sides · body in one line',
  muscles:[['triceps','p'],['chest','s'],['frontdelt','s'],['abs','s']],line:{a:'LeftFoot',b:'Neck',o:0.12},
  tempo:[[2,0,1,'Lower · elbows back · 2 sec'],[0.3,1,1,'Chest to your hands'],[1,1,0,'Push up'],[0.6,0,0,'Arms long · stay tight']],
  pose(k,a){pushup(k,a,{Ht:0.03,Zt:-0.75,bottom:0.22,hx:0.06,dz:0.06,fdir:sd=>N(-0.7*sd,0,0.7),bend:sd=>N(0.25*sd,0.5,-0.85)});}},

 splitsquat:{name:'Split squats',sub:'3 × 8 to 15 per leg · 6 kg per hand',sides:true,reps:10,view:'side',
  tips:'Long stance · torso tall · back knee drops toward the floor · front shin stays upright',
  muscles:[['quads.W','p'],['glutes.W','p'],['hams.W','s'],['quads.O','s']],
  tempo:[[2,0,1,'Lower · 2 sec'],[0.4,1,1,'Back knee just above the floor'],[1,1,0,'Drive through the front heel'],[0.5,0,0,'Stand tall']],
  pose(k,a,s){const fr=k.side(s),bk=k.side(-s);
   k.spine(tilt(0.05+0.05*a),tilt(0.04),tilt(0.03),tilt(0.05),tilt(0.1));
   k.place(k.P('Hips'),V(0,0.9+(0.57-0.9)*a,0));
   k.leg(fr,V(0.1*s,k.m.ank,0.36),Z);k.aim(fr+'Foot',N(0,-0.45,0.9));
   k.leg(bk,V(-0.1*s,0.13,-0.42),Z);k.aim(bk+'Foot',N(0,-0.85,0.5));
   for(const sd of[1,-1]){const n=k.side(sd);k.aim(n+'Arm',N(0.1*sd,-1,0.02));k.aim(n+'ForeArm',N(0.06*sd,-1,0.04),V(-sd,0,0));k.dbHand(sd>0?0:1,k.hand(n,'grip',V(-sd,0,0)));}
  }},

 birddog:{name:'Bird dog',sub:'2 × 8 per side · 3 sec hold',alt:true,reps:8,view:'side',
  tips:'Hands under shoulders, knees under hips · reach long, not high · keep hips level · flat back',
  muscles:[['erectors','p'],['glutes.W','p'],['reardelt.O','s'],['abs','s']],line:{a:'Hips',b:'Neck',o:0.12},
  tempo:[[1.5,0,1,'Reach out long'],[3,1,1,'Hold 3 sec · hips level'],[1.5,1,0,'Back to all fours'],[0.5,0,0,'Switch sides']],
  pose(k,a,s){const Hh=k.len.LeftUpLeg+0.06,Hs=k.m.arm+k.m.wr-0.01;
   const be=Math.asin(Math.max(-0.5,Math.min(0.5,(Hs-Hh)/k.m.torso)));
   k.frame(k.Q(X,Math.PI/2-be));const d=V(0,Math.sin(be),Math.cos(be));
   k.spine(d,d,d,N(0,Math.sin(be)-0.1,Math.cos(be)),N(0,Math.sin(be)-0.35,Math.cos(be)));
   k.place(k.mid('LeftUpLeg','RightUpLeg'),V(0,Hh,-0.3));
   for(const sd of[1,-1]){const n=k.side(sd);
    const el=sd===s,ext=N(0.03*sd,0.04,-1);
    k.aim(n+'UpLeg',el?lerpN(V(0,-1,0),ext,a):V(0,-1,0));
    k.aim(n+'Leg',el?lerpN(N(0,-0.02,-1),ext,a):N(0,-0.02,-1));
    k.aim(n+'Foot',el?lerpN(N(0,-0.3,-0.95),N(0,-0.95,-0.3),a):N(0,-0.3,-0.95));
    const ea=sd===-s;
    const up=ea?lerpN(V(0,-1,0),N(0.05*sd,0.04,1),a):V(0,-1,0);
    const palm=ea?lerpN(V(0,-1,0),V(-sd,0,0),a):V(0,-1,0);
    k.aim(n+'Arm',up);k.aim(n+'ForeArm',up,palm);
    if(ea&&a>0.3)k.hand(n,'open',palm);else k.hand(n,'flat',V(0,-1,0),Z);}
  }},

 superman:{name:'Superman hold',sub:'2 × 30 to 40 sec',view:'side',
  tips:'Lift arms, chest and legs together · look at the floor · squeeze your glutes · a small lift is enough',
  muscles:[['erectors','p'],['glutes','p'],['hams','s'],['lowtrap','s'],['reardelt','s']],
  timeline:holdTL(35,'Hold'),
  pose(k,a){k.frame(k.Q(X,Math.PI/2));const l=0.3*a,dir=x=>N(0,Math.sin(x),Math.cos(x));
   k.spine(dir(0),dir(l*0.35),dir(l*0.9),dir(l*0.9),dir(l*0.9-0.3));
   k.place(k.P('Hips'),V(0,0.11,-0.2));
   for(const sd of[1,-1]){const n=k.side(sd),lf=0.2*a;
    k.aim(n+'UpLeg',N(0.05*sd,Math.sin(lf)-0.04,-Math.cos(lf)));k.aim(n+'Leg',N(0.04*sd,Math.sin(lf)-0.02,-Math.cos(lf)));k.aim(n+'Foot',N(0,-0.25,-0.97));
    const up=N(0.3*sd,-0.12+0.5*a+Math.sin(l),1),palm=k.palmFromThumb(up,Y,sd);
    k.aim(n+'Arm',up);k.aim(n+'ForeArm',up,palm);k.hand(n,'open',palm);}
  }},

 pullneg:{name:'Pull-up negatives',sub:'3 × 5 to 10 · 5 sec down',reps:5,view:'q',target:1.35,dist:4,
  tips:'Jump or step up so your chin is over the bar · lower slowly for 5 sec · shoulders down, don’t shrug · finish in a dead hang',
  muscles:[['lats','p'],['biceps','s'],['rhomb','s'],['lowtrap','s']],
  tempo:[[0.8,0,1,'Step up · chin over the bar'],[0.7,1,1,'Hold at the top'],[5,1,0,'Lower slowly · 5 sec'],[1,0,0,'Dead hang · reset']],
  props(k){const H=2.25;k.bar(V(-0.62,H,0.03),V(0.62,H,0.03),0.016);for(const x of[-0.66,0.66])k.box(0.08,H+0.3,0.12,x,(H+0.3)/2,0.03);k.box(1.4,0.1,0.12,0,H+0.35,0.03);},
  pose(k,a){const H=2.25,W=H-0.085,bot=W-k.m.arm+0.01,top=H-0.2,sh=bot+(top-bot)*a,lb=-0.05-0.1*a;
   k.spine(tilt(-0.04),tilt(lb*0.6),tilt(lb),tilt(lb+0.05),tilt(lb+0.1));
   k.place(k.mid('LeftArm','RightArm'),V(0,sh,-0.04-0.1*a));
   for(const sd of[1,-1]){const n=k.side(sd);k.aim(n+'UpLeg',N(0.03*sd,-1,0.12));k.aim(n+'Leg',N(0.02*sd,-1,-0.12));k.aim(n+'Foot',N(0,-0.75,0.66));
    k.arm(n,V(0.29*sd,W,0.005),N(0.8*sd,-0.2,-0.3),Z);k.hand(n,'grip',Z,Y);}
  }},

 onearmrow:{name:'One-arm dumbbell rows',sub:'3 × 8 to 15 per side · 8 to 12 kg · hand on a chair',sides:true,reps:12,view:'q',
  tips:'Flat back · pull your elbow toward your hip · don’t twist the torso · lower all the way down',
  muscles:[['lats.W','p'],['rhomb','p'],['reardelt.W','s'],['biceps.W','s']],line:{a:'Hips',b:'Neck',o:0.13},
  tempo:[[1,0,1,'Pull your elbow to your hip'],[1,1,1,'Squeeze · 1 sec'],[2,1,0,'Lower slowly · 2 sec'],[0.3,0,0,'Full stretch']],
  props(k,s){k.chair(-0.2*s,0.34,-1);},
  pose(k,a,s){const w=k.side(s),o=k.side(-s),hy=0.86,shY=0.47+k.m.wr+k.m.arm*0.95;
   const be=Math.asin(Math.max(-0.6,Math.min(0.6,(shY-hy)/k.m.hs))),h=Math.PI/2-be;
   k.spine(tilt(h-0.3),tilt(h-0.05),tilt(h),tilt(h-0.1),tilt(h-0.4));
   k.place(k.P('Hips'),V(0,hy,-0.28));
   k.leg(o,V(-0.12*s,k.m.ank,0.1),N(-0.1*s,0,1));k.aim(o+'Foot',N(-0.1*s,-0.4,0.9));
   k.leg(w,V(0.14*s,k.m.ank,-0.52),N(0.1*s,0,1));k.aim(w+'Foot',N(0.1*s,-0.4,0.9));
   const sp=k.P(o+'Arm');k.arm(o,V(sp.x-0.03*s,0.47+k.m.wr,sp.z+0.12),N(-0.3*s,0,-1),V(0,-1,0));k.hand(o,'flat',V(0,-1,0),Z);
   const ang=0.05+1.2*a;k.aim(w+'Arm',N(0.06*s,-Math.cos(ang),-Math.sin(ang)));
   const fa=N(0.03*s,-Math.cos(0.05+0.1*a),Math.sin(0.05+0.1*a));k.aim(w+'ForeArm',fa,V(-s,0,0));k.dbHand(0,k.hand(w,'grip',V(-s,0,0)));
  }},

 chairdips:{name:'Chair dips, feet raised',sub:'3 × 5 to 15 · 5 kg plate on your lap',reps:10,view:'side',
  tips:'Hands on the chair edge, fingers forward · lower until elbows reach 90° · elbows point back · skip if your elbow or shoulder hurts',
  muscles:[['triceps','p'],['frontdelt','s'],['chest','s']],
  tempo:[[2,0,1,'Lower · 2 sec'],[0.3,1,1,'Elbows at 90°'],[1,1,0,'Press up'],[0.6,0,0,'Arms long · shoulders down']],
  props(k){k.chair(0,-0.42,1);k.chair(0,0.8,-1);},
  pose(k,a){const W=0.47+0.035,top=W+k.m.arm-0.02,sh=top-0.27*a;
   k.spine(tilt(0.05),tilt(0.05),tilt(0.08+0.06*a),tilt(0.05),tilt(0.1));
   k.place(k.mid('LeftArm','RightArm'),V(0,sh,-0.2+0.02*a));
   for(const sd of[1,-1]){const n=k.side(sd);k.leg(n,V(0.1*sd,0.52,0.7),V(0,1,0.1));k.aim(n+'Foot',N(0.1*sd,0.75,0.65));
    k.arm(n,V(0.19*sd,W,-0.26),N(0.1*sd,0,-1),V(0,-1,0));k.hand(n,'flat',V(0,-1,0),N(0,-0.35,1));}
   const pL=k.P('LeftUpLeg').lerp(k.P('LeftLeg'),0.55),pR=k.P('RightUpLeg').lerp(k.P('RightLeg'),0.55);
   const td=k.P('LeftLeg').sub(k.P('LeftUpLeg')).normalize(),nm=td.clone().cross(X).normalize();
   if(nm.y<0)nm.negate();k.lapPlate(pL.add(pR).multiplyScalar(0.5).add(nm.clone().multiplyScalar(0.085)),nm);
  }},

 goblet:{name:'Goblet squats',sub:'3 × 10 to 15 · 10 to 12 kg · slow down',reps:12,view:'q',dbSize:1.15,
  tips:'Dumbbell close to your chest · sit down between your heels · knees track over your toes · chest up, back flat',
  muscles:[['quads','p'],['glutes','p'],['hams','s'],['abs','s']],
  tempo:[[2,0,1,'Sit down · 2 sec'],[0.4,1,1,'Hips below the knees if comfy'],[1.1,1,0,'Stand up · push the floor away'],[0.5,0,0,'Squeeze your glutes']],
  pose(k,a){const ln=0.08+0.42*a;
   k.spine(tilt(0.05+0.5*a),tilt(ln*0.9),tilt(ln),tilt(ln-0.1),tilt(ln-0.25));
   k.place(k.P('Hips'),V(0,0.92+(0.5-0.92)*a,-0.2*a));
   for(const sd of[1,-1]){const n=k.side(sd);k.leg(n,V(0.17*sd,k.m.ank,0.06),N(0.4*sd,0,1));k.aim(n+'Foot',N(0.25*sd,-0.4,0.9));}
   const tu=tilt(ln),tf=V(0,-Math.sin(ln),Math.cos(ln));
   const C=k.P('Spine2').add(tf.clone().multiplyScalar(0.22)).add(tu.clone().multiplyScalar(-0.02));
   for(const sd of[1,-1]){const n=k.side(sd),palm=N(-0.6*sd,0.8,0);
    k.arm(n,C.clone().add(V(0.06*sd,0,0)).add(tu.clone().multiplyScalar(-0.06)).add(tf.clone().multiplyScalar(-0.02)),N(0.2*sd,-1,-0.2),palm);
    k.hand(n,'open',palm,N(-0.3*sd,0.7,0.4));}
   k.db(0,C.clone().add(tu.clone().multiplyScalar(-0.07)),tu);
  }},

 deadbug:{name:'Weighted dead bug',sub:'2 × 8 per side · dumbbell held up',alt:true,reps:8,view:'side',dbSize:0.9,
  tips:'Lower back pressed into the floor · arms straight up holding the weight · straighten one leg slowly · breathe out as you reach',
  muscles:[['abs','p'],['obliques','s']],
  tempo:[[2,0,1,'Straighten the leg · breathe out'],[0.6,1,1,'Hover · back flat'],[1.5,1,0,'Bring it back'],[0.4,0,0,'Switch']],
  pose(k,a,s){k.frame(k.Q(X,-Math.PI/2));
   k.spine(N(0,0.02,-1),N(0,0.01,-1),V(0,0,-1),N(0,0.05,-1),N(0,0.1,-1));
   k.place(k.P('Hips'),V(0,0.11,0.3));
   const g=[];
   for(const sd of[1,-1]){const n=k.side(sd),el=sd===s,ext=N(0.05*sd,0.15,1);
    k.aim(n+'UpLeg',el?lerpN(V(0.05*sd,1,0),ext,a):V(0.05*sd,1,0));
    k.aim(n+'Leg',el?lerpN(N(0,0.02,1),ext,a):N(0,0.02,1));
    k.aim(n+'Foot',el?lerpN(N(0,0.2,1),N(0,0.5,0.85),a):N(0,0.2,1));
    const up=N(-0.02*sd,1,0);k.aim(n+'Arm',up);k.aim(n+'ForeArm',up,V(-sd,0,0));g.push(k.hand(n,'open',V(-sd,0,0),Y).g);}
   k.db(0,g[0].add(g[1]).multiplyScalar(0.5),X);
  }},

 glutebridge:{name:'Single-leg glute bridge',sub:'3 × 10 to 15 per leg',sides:true,reps:15,view:'side',
  tips:'Heel close to your butt · push through the heel · keep your hips level, don’t twist · squeeze at the top',
  muscles:[['glutes.W','p'],['hams.W','s'],['erectors','s']],
  tempo:[[1,0,1,'Drive your hips up'],[1,1,1,'Squeeze · 1 sec'],[1.5,1,0,'Lower slowly'],[0.4,0,0,'Tap and go']],
  pose(k,a,s){const w=k.side(s),o=k.side(-s);k.frame(k.Q(X,-Math.PI/2));
   const S=V(0,0.13,-0.32),H=V(0,0.12+0.28*a,0.12),d=S.clone().sub(H).normalize();
   k.spine(d,d,d,N(0,-0.05,-1),V(0,0,-1));
   k.place(k.P('Hips'),H);
   k.leg(w,V(0.11*s,k.m.ank,0.62),N(0,1,0.2));k.aim(w+'Foot',N(0,-0.35,0.94));
   const ex=d.clone().negate().add(V(0,0.25,0)).normalize();k.aim(o+'UpLeg',ex);k.aim(o+'Leg',ex);k.aim(o+'Foot',ex.clone().add(V(0,0.4,0)));
   for(const sd of[1,-1]){const n=k.side(sd);k.aim(n+'Arm',N(0.2*sd,-0.2,1));k.aim(n+'ForeArm',N(0.15*sd,-0.1,1),V(0,-1,0));k.hand(n,'flat',V(0,-1,0));}
  }}
};

export const DAYS=[
 ['Day A · Sunday',['ytw','sideplank','row','declinepush','splitsquat']],
 ['Day B · Tuesday',['birddog','superman','pullneg','onearmrow','chairdips','goblet']],
 ['Day C · Thursday',['ytw','deadbug','row','onearmrow','diamond','glutebridge']]
];
