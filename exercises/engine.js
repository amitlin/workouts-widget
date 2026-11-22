import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
export {THREE};
const V=(x,y,z)=>new THREE.Vector3(x,y,z);
const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
const FING=['Index','Middle','Ring','Pinky'];
const MUS={
 lats:{b:'Spine1',o:[0.1,0.04,-0.07],s:[0.06,0.13,0.035],m:1},
 rhomb:{b:'Spine2',o:[0,0.04,-0.1],s:[0.09,0.07,0.03]},
 lowtrap:{b:'Spine1',o:[0,0.1,-0.1],s:[0.07,0.06,0.03]},
 traps:{b:'Neck',o:[0,-0.03,-0.05],s:[0.12,0.04,0.04]},
 reardelt:{b:'LeftArm',o:[0.02,0.01,-0.055],s:[0.045,0.05,0.035],m:1},
 frontdelt:{b:'LeftArm',o:[0.02,0.01,0.055],s:[0.045,0.05,0.035],m:1},
 chest:{b:'Spine2',o:[0.08,0,0.1],s:[0.075,0.06,0.03],m:1},
 triceps:{b:'LeftArm',o:[0.14,0,-0.04],s:[0.1,0.035,0.035],m:1},
 biceps:{b:'LeftArm',o:[0.14,0,0.04],s:[0.1,0.035,0.035],m:1},
 abs:{b:'Spine',o:[0,0.08,0.1],s:[0.07,0.12,0.03]},
 obliques:{b:'Spine',o:[0.1,0.06,0.04],s:[0.04,0.1,0.05],m:1},
 erectors:{b:'Spine',o:[0.04,0.06,-0.09],s:[0.025,0.12,0.03],m:1},
 glutes:{b:'Hips',o:[0.08,-0.06,-0.1],s:[0.075,0.08,0.045],m:1},
 glutemed:{b:'Hips',o:[0.13,0,-0.04],s:[0.04,0.06,0.05],m:1},
 quads:{b:'LeftUpLeg',o:[0,-0.2,0.06],s:[0.06,0.16,0.04],m:1},
 hams:{b:'LeftUpLeg',o:[0,-0.2,-0.06],s:[0.055,0.16,0.04],m:1}
};
const VIEWS={q:[0.62,0.38,0.62],side:[1,0.14,0.001],front:[0.001,0.2,1],back:[0.001,0.32,-1],top:[0.01,1,0.14]};
const css='*{box-sizing:border-box;margin:0;padding:0}html,body{height:100%;overflow:hidden;background:#0d0f12;color:#f2f2f7;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text",Helvetica,Arial,sans-serif}canvas{display:block;touch-action:none}#hud{position:fixed;left:0;right:0;top:0;padding:14px 16px;pointer-events:none;background:linear-gradient(#0d0f12ee,#0d0f1200)}#hud h1{font-size:18px;font-weight:700}#hud p{font-size:13px;color:#9aa0a6;margin-top:2px}#all{position:fixed;right:14px;top:14px;color:#30d158;font:600 13px -apple-system,Helvetica,sans-serif;text-decoration:none}#cue{position:fixed;left:50%;top:76px;transform:translateX(-50%);padding:8px 14px;border-radius:20px;background:#ffffff14;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);font-size:15px;font-weight:600;white-space:nowrap;pointer-events:none}#bar{position:fixed;left:0;right:0;bottom:0;padding:10px 10px calc(14px + env(safe-area-inset-bottom));background:linear-gradient(#0d0f1200,#0d0f12f0 40%)}.row{display:flex;gap:6px;justify-content:center;flex-wrap:wrap;margin-top:6px}button{appearance:none;border:0;border-radius:18px;padding:8px 13px;font:600 13px -apple-system,Helvetica,Arial,sans-serif;background:#ffffff1a;color:#f2f2f7}button.on{background:#30d158;color:#08130b}#tips{font-size:12px;color:#9aa0a6;text-align:center;margin-top:8px;line-height:1.35}'+
 '.list{padding:22px 18px 40px;overflow:auto;height:100%}.list h1{font-size:24px;margin-bottom:6px}.list p{color:#9aa0a6;font-size:14px;margin-bottom:14px}.list h2{font-size:13px;color:#8e8e93;text-transform:uppercase;letter-spacing:.05em;margin:20px 0 6px}.list a{display:block;background:#1c1f24;border-radius:12px;padding:13px 14px;margin-bottom:8px;color:#f2f2f7;text-decoration:none;font-size:16px;font-weight:600}.list a span{display:block;color:#9aa0a6;font-size:13px;font-weight:400;margin-top:2px}';

function listPage(EX,DAYS){
 const d=document.createElement('div');d.className='list';
 let h='<h1>Exercise demos</h1><p>Tap one to see it in 3D. Drag to rotate, pinch to zoom.</p>';
 for(const [day,items] of DAYS){h+='<h2>'+day+'</h2>';for(const id of items){const e=EX[id];const href=e.href||('#'+id);h+='<a href="'+href+'">'+e.name+'<span>'+e.sub+'</span></a>';}}
 d.innerHTML=h;document.body.appendChild(d);document.body.style.overflow='auto';document.documentElement.style.overflow='auto';
}

export function start(EX,DAYS){
 const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
 const TEST=location.search.indexOf('test')>=0;const id=(location.hash||'').slice(1);let ex=TEST?EX.ytw:EX[id];
 addEventListener('hashchange',()=>location.reload());
 if(!ex||ex.href){listPage(EX,DAYS);return;}
 document.title=ex.name+' · 3D';
 const ui=document.createElement('div');
 ui.innerHTML='<div id="hud"><h1></h1><p></p></div><a id="all" href="#">All exercises</a><div id="cue">Loading 3D model…</div><div id="bar"><div class="row" id="views"></div><div class="row" id="ctl"></div><div id="tips"></div></div>';
 document.body.appendChild(ui);
 ui.querySelector('h1').textContent=ex.name;ui.querySelector('#hud p').textContent=ex.sub+' · drag to rotate';ui.querySelector('#tips').textContent=ex.tips;
 const cue=ui.querySelector('#cue');
 const views=ui.querySelector('#views'),ctl=ui.querySelector('#ctl');
 const mk=(p,txt,on)=>{const b=document.createElement('button');b.textContent=txt;if(on)b.classList.add('on');p.appendChild(b);return b;};
 let curView=ex.view||'q';
 const vb={};for(const [k,l] of [['q','3/4'],['side','Side'],['front','Front'],['back','Back'],['top','Top']]){vb[k]=mk(views,l,k===curView);vb[k].onclick=()=>{for(const x in vb)vb[x].classList.remove('on');vb[k].classList.add('on');goView(k);};}
 const play=mk(ctl,'Pause',true),slow=mk(ctl,'Slow-mo'),mus=mk(ctl,'Muscles',true);
 const gdb=ex.line?mk(ctl,'Body line',true):null;
 let side=1;const sdb=ex.sides?mk(ctl,'Left side',true):null;
 let playing=true,speed=1;
 play.onclick=()=>{playing=!playing;play.textContent=playing?'Pause':'Play';play.classList.toggle('on',playing);};
 slow.onclick=()=>{speed=speed===1?0.35:1;slow.classList.toggle('on',speed!==1);};
 mus.onclick=()=>mus.classList.toggle('on');
 if(gdb)gdb.onclick=()=>gdb.classList.toggle('on');
 if(sdb)sdb.onclick=()=>{side=-side;sdb.textContent=side>0?'Left side':'Right side';clockT=0;buildProps();buildGlows();};

 const renderer=TEST?{setPixelRatio(){},setSize(){},shadowMap:{},domElement:document.createElement('div'),render(){}}:new THREE.WebGLRenderer({antialias:true});
 renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(innerWidth,innerHeight);
 renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
 renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
 document.body.insertBefore(renderer.domElement,ui);
 const scene=new THREE.Scene();scene.background=new THREE.Color(0x0d0f12);scene.fog=new THREE.Fog(0x0d0f12,6,14);
 if(!TEST)scene.environment=new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(),0.04).texture;
 const camera=new THREE.PerspectiveCamera(38,innerWidth/innerHeight,0.05,50);
 const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.minDistance=1.2;controls.maxDistance=8;controls.maxPolarAngle=Math.PI*0.495;
 const key=new THREE.DirectionalLight(0xffffff,2.4);key.position.set(3,5,2.5);key.castShadow=true;key.shadow.mapSize.set(2048,2048);
 Object.assign(key.shadow.camera,{left:-2.5,right:2.5,top:2.5,bottom:-2.5,near:0.5,far:12});key.shadow.radius=4;key.shadow.bias=-0.0004;scene.add(key);
 const rim=new THREE.DirectionalLight(0x7fb4ff,1.6);rim.position.set(-3,2.5,-3);scene.add(rim);
 scene.add(new THREE.HemisphereLight(0xbfd4ff,0x1a1410,0.4));
 const floor=new THREE.Mesh(new THREE.CircleGeometry(4,96),new THREE.MeshStandardMaterial({color:0x1a1d22,roughness:0.85}));floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;scene.add(floor);
 const grid=new THREE.GridHelper(8,32,0x2a2f36,0x20242a);grid.position.y=0.001;grid.material.transparent=true;grid.material.opacity=0.5;scene.add(grid);
 const iron=new THREE.MeshStandardMaterial({color:0x1b1d20,roughness:0.35,metalness:0.85}),chrome=new THREE.MeshStandardMaterial({color:0xcfd3d8,roughness:0.15,metalness:1});
 const wood=new THREE.MeshStandardMaterial({color:0x6b5440,roughness:0.7}),steel=new THREE.MeshStandardMaterial({color:0x8a9099,roughness:0.3,metalness:0.8});
 const red=new THREE.MeshBasicMaterial({color:0xff3b30,transparent:true,opacity:0,depthWrite:false});
 const orange=new THREE.MeshBasicMaterial({color:0xff9f0a,transparent:true,opacity:0,depthWrite:false});
 const guide=new THREE.Mesh(new THREE.CylinderGeometry(0.006,0.006,1,8),new THREE.MeshBasicMaterial({color:0x30d158}));guide.visible=false;scene.add(guide);

 const F=V(0,0,1),U=V(0,1,0),X=V(1,0,0);
 const R=new THREE.Quaternion(),Ri=new THREE.Quaternion();
 const B={},rest={},len={},m={},mem={};let model=null;
 const P=n=>B[n].getWorldPosition(V(0,0,0));
 const mid=(a,b)=>P(a).add(P(b)).multiplyScalar(0.5);
 const tq=new THREE.Quaternion(),pq=new THREE.Quaternion(),q2=new THREE.Quaternion();
 function frame(q){R.copy(q);Ri.copy(q).invert();}
 function aim(n,d,palm){const r=rest[n],b=B[n];if(!r||!b||!d)return;
  const dn=d.clone().normalize();const db=dn.clone().applyQuaternion(Ri);
  tq.setFromUnitVectors(r.dir,db).multiply(r.q).premultiply(R);
  if(palm){const cur=r.pl.clone().applyQuaternion(tq),want=palm.clone();
   cur.sub(dn.clone().multiplyScalar(cur.dot(dn)));want.sub(dn.clone().multiplyScalar(want.dot(dn)));
   if(cur.lengthSq()>1e-6&&want.lengthSq()>1e-6){cur.normalize();want.normalize();
    q2.setFromAxisAngle(dn,Math.atan2(dn.dot(cur.clone().cross(want)),cur.dot(want)));tq.premultiply(q2);}}
  b.parent.getWorldQuaternion(pq);b.quaternion.copy(pq.invert().multiply(tq));b.updateMatrixWorld(true);}
 function ik(a,b,target,bend,palm){const pa=P(a);const v=target.clone().sub(pa);let d=v.length();const L1=len[a],L2=len[b];
  const vn=v.normalize();d=Math.min(Math.max(d,Math.abs(L1-L2)+1e-3),L1+L2-1e-4);
  let bp=bend.clone().sub(vn.clone().multiplyScalar(bend.dot(vn)));if(bp.lengthSq()<1e-8)bp=V(0,1,0);bp.normalize();
  const al=Math.acos(Math.min(1,Math.max(-1,(L1*L1+d*d-L2*L2)/(2*L1*d))));
  aim(a,vn.clone().multiplyScalar(Math.cos(al)).add(bp.multiplyScalar(Math.sin(al))));
  aim(b,target.clone().sub(P(b)),palm);}
 function arm(k,target,bend,palm){ik(k+'Arm',k+'ForeArm',target,bend,palm);}
 function leg(k,target,bend){ik(k+'UpLeg',k+'Leg',target,bend);}
 function hand(k,mode,palm,dir){const s=k==='Left'?1:-1;
  const f=(dir?dir.clone():P(k+'Hand').sub(P(k+'ForeArm'))).normalize();
  let p=palm?palm.clone():V(-s,0,0);p.sub(f.clone().multiplyScalar(p.dot(f)));if(p.lengthSq()<1e-6)p=V(0,-1,0);p.normalize();
  aim(k+'Hand',f,p);
  const th=s>0?p.clone().cross(f):f.clone().cross(p);
  const C=(a,b,c)=>f.clone().multiplyScalar(a).add(p.clone().multiplyScalar(b)).add(th.clone().multiplyScalar(c));
  let c1,c2,c3,t1,t2;
  if(mode==='grip'){c1=C(.45,.89,0);c2=C(-.55,.83,0);c3=C(-.95,.3,0);t1=C(.4,.6,.5);t2=C(.7,.6,0);}
  else if(mode==='flat'){c1=C(1,.05,0);c2=C(1,.08,0);c3=C(1,.1,0);t1=C(.7,.05,.7);t2=C(.95,0,.3);}
  else{c1=C(.9,.3,0);c2=C(.75,.65,0);c3=C(.5,.85,0);t1=C(.6,.25,.6);t2=C(.9,.3,.1);}
  for(const fn of FING){aim(k+'Hand'+fn+'1',c1);aim(k+'Hand'+fn+'2',c2);aim(k+'Hand'+fn+'3',c3);}
  aim(k+'HandThumb1',t1);aim(k+'HandThumb2',t2);aim(k+'HandThumb3',t2);
  const g=(B[k+'HandMiddle1']?P(k+'HandMiddle1'):P(k+'Hand').add(f.clone().multiplyScalar(0.09))).add(p.clone().multiplyScalar(0.024)).add(f.clone().multiplyScalar(0.012));
  return {f,p,th,g};}
 function palmFromThumb(f,th,s){f=f.clone().normalize();return s>0?f.clone().cross(th).normalize():th.clone().cross(f).normalize();}
 function spine(d0,d1,d2,dn,dh){aim('Hips',d0);aim('Spine',d1);aim('Spine1',d2||d1);aim('Spine2',d2||d1);aim('Neck',dn||d2||d1);aim('Head',dh||dn||d2||d1);}
 function place(cur,target){model.position.add(target.clone().sub(cur));model.updateMatrixWorld(true);}
 // props
 const propG=new THREE.Group();scene.add(propG);
 function box(w,h,d,x,y,z,mat){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat||wood);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;propG.add(o);return o;}
 function bar(a,b,r,mat){const o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,a.distanceTo(b),20),mat||steel);o.position.copy(a).lerp(b,0.5);o.quaternion.setFromUnitVectors(U,b.clone().sub(a).normalize());o.castShadow=true;propG.add(o);return o;}
 function chair(x,z,face,h){h=h||0.45;box(0.42,0.04,0.42,x,h,z);for(const dx of[-0.18,0.18])for(const dz of[-0.18,0.18])box(0.03,h,0.03,x+dx,h/2,z+dz,steel);box(0.42,0.42,0.03,x,h+0.23,z-0.195*face);}
 function buildProps(){while(propG.children.length)propG.remove(propG.children[0]);if(ex.props)ex.props(K,side);}
 const DBS=[];
 function dumbbell(sz){const g=new THREE.Group();const h=new THREE.Mesh(new THREE.CylinderGeometry(0.016,0.016,0.17,20),chrome);g.add(h);
  for(const y of[-0.115,0.115]){const p=new THREE.Mesh(new THREE.CylinderGeometry(0.07,0.07,0.05,40),iron);p.position.y=y;g.add(p);}g.scale.setScalar(sz||1);g.traverse(o=>o.castShadow=true);scene.add(g);return g;}
 function db(i,pos,axis){if(!DBS[i])DBS[i]=dumbbell(ex.dbSize);DBS[i].position.copy(pos);DBS[i].quaternion.setFromUnitVectors(U,axis.clone().normalize());}
 function dbHand(i,h){db(i,h.g,h.th);}
 let plate=null;
 function lapPlate(pos,normal){if(!plate){plate=new THREE.Mesh(new THREE.CylinderGeometry(0.11,0.11,0.025,40),iron);plate.castShadow=true;scene.add(plate);}plate.position.copy(pos);plate.quaternion.setFromUnitVectors(U,normal.clone().normalize());}
 const K={V,P,mid,aim,ik,arm,leg,hand,spine,place,frame,box,bar,chair,db,dbHand,lapPlate,palmFromThumb,len,m,mem,B,
  Q:(ax,an)=>new THREE.Quaternion().setFromAxisAngle(ax,an),N:(x,y,z)=>V(x,y,z).normalize(),
  side:s=>s>0?'Left':'Right',X,U,F,dark:iron,steel,wood};
 // muscles
 const glows=[];
 function addGlow(name,lvl,side0){const d=MUS[name];if(!d)return;
  const sides=d.m?(side0===0?[1,-1]:[side0]):[0];
  for(const s of sides){let b=d.b;if(s<0)b=b.replace('Left','Right');
   const o=V(d.o[0]*(s<0?-1:1),d.o[1],d.o[2]);
   const mesh=new THREE.Mesh(new THREE.SphereGeometry(1,24,16),lvl==='p'?red:orange);mesh.scale.set(d.s[0],d.s[1],d.s[2]);mesh.renderOrder=2;scene.add(mesh);
   glows.push({mesh,b,o,base:lvl});}}
 function buildGlows(){for(const g of glows)scene.remove(g.mesh);glows.length=0;
  for(const [n,l] of ex.muscles||[]){const [nm,sd]=n.split('.');let s0=0;if(sd==='L')s0=1;if(sd==='R')s0=-1;if(sd==='W')s0=side;if(sd==='O')s0=-side;addGlow(nm,l,s0);}}
 const D=new THREE.Quaternion();
 function updGlows(e){const on=mus.classList.contains('on');red.opacity=on?0.15+0.5*e:0;orange.opacity=on?0.1+0.3*e:0;
  for(const g of glows){const b=B[g.b],r=rest[g.b]||{q0:null};if(!b)continue;b.getWorldQuaternion(D);D.multiply(r.q0inv);
   g.mesh.position.copy(P(g.b)).add(g.o.clone().applyQuaternion(D));g.mesh.quaternion.copy(D);}}
 function updLine(s){if(!ex.line||!gdb){return;}guide.visible=gdb.classList.contains('on');if(!guide.visible)return;
  const nm=x=>x.replace('@',s>0?'Left':'Right');const a=P(nm(ex.line.a)),b=P(nm(ex.line.b));
  let off;if(ex.line.w)off=V(...ex.line.w);else{const dir=b.clone().sub(a).normalize();off=dir.cross(X.clone().applyQuaternion(R)).normalize().multiplyScalar(ex.line.o||0.12);}
  a.add(off);b.add(off);guide.position.copy(a).lerp(b,0.5);guide.scale.y=a.distanceTo(b);guide.quaternion.setFromUnitVectors(U,b.clone().sub(a).normalize());}

 function stateAt(t,s){if(ex.timeline)return ex.timeline(t,s);
  const tp=ex.tempo,cyc=tp.reduce((q,p)=>q+p[0],0),n=Math.floor(t/cyc);let u=t-n*cyc;
  for(const p of tp){if(u<p[0]){const f=p[0]?u/p[0]:1;return {a:p[1]+(p[2]-p[1])*ease(f),cue:p[3],rep:n};}u-=p[0];}
  return {a:tp[0][1],cue:tp[0][3],rep:n};}
 let ready=false,clockT=0,last=performance.now(),tw=null,target=V(0,0.8,0),dist=ex.dist||3.4;
 function goView(k,instant){curView=k;const d=V(...VIEWS[k]).normalize().multiplyScalar(dist);const to=target.clone().add(d);
  if(instant){camera.position.copy(to);}else tw={from:camera.position.clone(),to,t:0};}
 controls.target.copy(target);camera.position.set(2.4,1.6,2.4);
 new GLTFLoader().load('https://cdn.jsdelivr.net/gh/mrdoob/three.js@r160/examples/models/gltf/Xbot.glb',g=>{
  model=g.scene;scene.add(model);
  model.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;o.frustumCulled=false;}
   if(o.isBone){B[o.name.replace(/^mixamorig:?/,'').replace(/[^A-Za-z0-9_]/g,'')]=o;}});
  model.updateMatrixWorld(true);
  const pairs=[['Hips','Spine'],['Spine','Spine1'],['Spine1','Spine2'],['Spine2','Neck'],['Neck','Head'],['Head','HeadTop_End']];
  for(const s of['Left','Right']){pairs.push([s+'UpLeg',s+'Leg'],[s+'Leg',s+'Foot'],[s+'Foot',s+'ToeBase'],[s+'Arm',s+'ForeArm'],[s+'ForeArm',s+'Hand'],[s+'Hand',s+'HandMiddle1']);
   for(const f of FING.concat(['Thumb']))for(let i=1;i<4;i++)pairs.push([s+'Hand'+f+i,s+'Hand'+f+(i+1)]);}
  for(const [n,c] of pairs){if(!B[n]||!B[c])continue;const q=B[n].getWorldQuaternion(new THREE.Quaternion());
   rest[n]={dir:P(c).sub(P(n)).normalize(),q,pl:V(0,-1,0).applyQuaternion(q.clone().invert())};len[n]=P(n).distanceTo(P(c));}
  for(const n in B){const q=B[n].getWorldQuaternion(new THREE.Quaternion());rest[n]=rest[n]||{};rest[n].q0inv=q.clone().invert();}
  const ground=Math.min(P('LeftToeBase').y,P('RightToeBase').y)-0.02;
  m.ank=P('LeftFoot').y-ground;m.arm=len.LeftArm+len.LeftForeArm;m.leg=len.LeftUpLeg+len.LeftLeg;
  m.hs=P('Hips').distanceTo(mid('LeftArm','RightArm'));m.torso=mid('LeftUpLeg','RightUpLeg').distanceTo(mid('LeftArm','RightArm'));
  m.wr=0.035;
  if(TEST){runTests();return;}
  buildProps();buildGlows();
  const s0=stateAt(0,1);ex.pose(K,s0.a,1,s0);model.updateMatrixWorld(true);
  if(ex.target!==undefined)target=V(0,ex.target,ex.targetZ||0);else{const bb=new THREE.Box3();for(const n of['Hips','Head','LeftFoot','RightFoot','LeftHand','RightHand'])bb.expandByPoint(P(n));bb.getCenter(target);target.x=0;}
  controls.target.copy(target);goView(curView,true);ready=true;
 },undefined,e=>{cue.textContent='Could not load the 3D model';console.error(e);});
 function runTests(){const out={};const r3=v=>[+v.x.toFixed(3),+v.y.toFixed(3),+v.z.toFixed(3)];
  const only=(new URLSearchParams(location.search).get('test')||'').split(',').filter(x=>EX[x]);for(const id2 in EX){const e=EX[id2];if(e.href)continue;if(only.length&&only.indexOf(id2)<0)continue;ex=e;for(const kk in mem)delete mem[kk];out[id2]={};
   try{buildProps();}catch(err){out[id2].propErr=String(err);}
   const sides=(e.sides||e.alt)?[1,-1]:[1];const lets=id2==='ytw'?[0,1,2]:[0];
   for(const sd of sides)for(const lt of lets)for(const a of[0,0.5,1]){const key=sd+'/'+lt+'/'+a;
    try{frame(new THREE.Quaternion());model.position.set(0,0,0);e.pose(K,a,sd,{a,letter:lt,rep:0});model.updateMatrixWorld(true);
     let lo=9,lb='',nan=false;for(const n in B){const p=P(n);if(isNaN(p.x+p.y+p.z))nan=true;if(p.y<lo){lo=p.y;lb=n;}}
     const o={lo:[lb,+lo.toFixed(3)],nan};for(const n of['Hips','Head','LeftArm','LeftHand','RightHand','LeftLeg','RightLeg','LeftFoot','RightFoot','LeftToeBase','RightToeBase'])o[n]=r3(P(n));
     out[id2][key]=o;}catch(err){out[id2][key]={err:String(err)+' '+(err.stack||'').slice(0,200)};}}}
  document.body.innerHTML='<pre id="out" style="color:#fff;white-space:pre-wrap;font-size:10px">'+JSON.stringify(out)+'</pre>';document.body.style.overflow='auto';}
 addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});
 function loop(now){const dt=Math.min(0.05,(now-last)/1000);last=now;
  if(ready){if(playing)clockT+=dt*speed;const s0=stateAt(clockT,side);const s=ex.alt?((s0.rep%2===0)?1:-1):side;
   frame(new THREE.Quaternion());ex.pose(K,s0.a,s,s0);model.updateMatrixWorld(true);
   updGlows(s0.e!==undefined?s0.e:s0.a);updLine(s);
   let txt=s0.cue;if(ex.alt)txt+=' · '+(s>0?'left leg':'right leg');
   if(!s0.noRep&&ex.reps)txt+=' · rep '+((s0.rep%ex.reps)+1)+'/'+ex.reps;
   if(cue.textContent!==txt)cue.textContent=txt;cue.style.color=s0.a>0.95?'#30d158':'#f2f2f7';}
  if(tw){tw.t=Math.min(1,tw.t+dt*1.6);camera.position.lerpVectors(tw.from,tw.to,ease(tw.t));if(tw.t>=1)tw=null;}
  controls.update();renderer.render(scene,camera);requestAnimationFrame(loop);}
 requestAnimationFrame(loop);
}
