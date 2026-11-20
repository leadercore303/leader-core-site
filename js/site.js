/* LeaderCore Home: slowly drifting low-poly background. Pauses automatically when the tab is hidden;
   shows a still picture when the visitor has "reduce motion" turned on. */
(function(){
  var y=document.getElementById('yr');if(y)y.textContent=new Date().getFullYear();
  var b=document.querySelector('.burger'),n=document.getElementById('nav');
  if(b&&n){b.addEventListener('click',function(){var o=n.classList.toggle('open');b.setAttribute('aria-expanded',o)});}

  /* forms: send to a Google Form (no email address is published on the site) */
  var cfg=window.LEADERCORE||{};
  [].forEach.call(document.querySelectorAll('form[data-form]'),function(f){
    f.addEventListener('submit',function(e){e.preventDefault();
      var t=f.querySelector('.thanks'),c=cfg[f.getAttribute('data-form')]||{},fl=c.fields||{};
      var names=Object.keys(fl),ok=!!c.action&&names.length>0&&names.every(function(k){return fl[k];});
      if(!ok){t.textContent='This form is not connected yet.';t.hidden=false;return;}
      if(!f.checkValidity()){f.reportValidity();return;}
      if(f.querySelector('[name=_gotcha]').value)return;
      var d=new URLSearchParams();names.forEach(function(k){d.append(fl[k],f.elements[k].value);});
      /* Google Forms sends no readable reply to other websites, so the request is sent and treated as done. */
      fetch(c.action,{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:d.toString()})
        .then(function(){t.textContent=f.getAttribute('data-form')==='book'?'Thank you! We will be in touch.':'Thank you!';t.hidden=false;f.reset();})
        .catch(function(){t.textContent='Something went wrong. Please try again.';t.hidden=false;});
    });
  });

  var cv=document.getElementById('poly');if(!cv||!cv.getContext)return;
  var cx=cv.getContext('2d');
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var STOPS=[[0,[250,188,56]],[.2,[246,142,48]],[.4,[230,88,64]],[.58,[170,104,140]],[.78,[74,122,176]],[1,[48,132,162]]];
  function ramp(d){d=Math.max(0,Math.min(1,d));for(var i=1;i<STOPS.length;i++){if(d<=STOPS[i][0]){var a=STOPS[i-1],b=STOPS[i],t=(d-a[0])/(b[0]-a[0]);return [a[1][0]+(b[1][0]-a[1][0])*t,a[1][1]+(b[1][1]-a[1][1])*t,a[1][2]+(b[1][2]-a[1][2])*t];}}return STOPS[STOPS.length-1][1];}
  function rnd(i){var s=Math.sin(i*127.1+311.7)*43758.5453;return s-Math.floor(s);}  /* repeatable pseudo-random, so the pattern never jumps */
  var W=0,H=0,dpr=1,cols=0,rows=0,cell=0,pts=[];
  function build(){
    var r=cv.getBoundingClientRect();W=Math.max(1,r.width);H=Math.max(1,r.height);dpr=Math.min(window.devicePixelRatio||1,2);
    cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);cx.setTransform(dpr,0,0,dpr,0,0);
    cell=Math.max(80,Math.min(130,W/11));cols=Math.ceil(W/cell)+2;rows=Math.ceil(H/cell)+2;pts=[];
    for(var j=0;j<rows;j++)for(var i=0;i<cols;i++){var k=j*cols+i;
      pts.push({x:(i-1)*cell+(rnd(k)-.5)*cell*.7,y:(j-1)*cell+(rnd(k+999)-.5)*cell*.7,ax:cell*(.10+.12*rnd(k+31)),ay:cell*(.10+.12*rnd(k+57)),sp:.25+.35*rnd(k+7),ph:rnd(k+3)*6.283});}
  }
  function P(i,j,t){var p=pts[j*cols+i];return [p.x+p.ax*Math.sin(t*p.sp+p.ph),p.y+p.ay*Math.cos(t*p.sp*.9+p.ph*1.3)];}
  function tri(a,b,c,k,t){
    var mx=(a[0]+b[0]+c[0])/3,my=(a[1]+b[1]+c[1])/3;
    var d=mx/W*.82+my/H*.18;
    var c0=ramp(d);
    var shade=(rnd(k)-.5)*.16+.07*Math.sin(d*7-t*.55+rnd(k+5)*3);   /* soft light wave drifting across the facets */
    /* shimmer: each facet glints now and then, and a bright band sweeps across the whole field */
    var gl=Math.sin(t*(.7+1.1*rnd(k+13))+rnd(k+17)*6.283);gl=gl>0?Math.pow(gl,12)*.30:0;
    var sw=(d-(((t*.11)%1.7)-.35))/.11;sw=Math.exp(-sw*sw)*.20;
    shade+=gl+sw;
    var r=c0[0],g=c0[1],bl=c0[2];
    if(shade>0){r+=(255-r)*shade;g+=(255-g)*shade;bl+=(255-bl)*shade;}else{var s=1+shade*.9;r*=s;g*=s;bl*=s;}
    var col='rgb('+(r|0)+','+(g|0)+','+(bl|0)+')';
    cx.fillStyle=col;cx.strokeStyle=col;cx.lineWidth=.6;
    cx.beginPath();cx.moveTo(a[0],a[1]);cx.lineTo(b[0],b[1]);cx.lineTo(c[0],c[1]);cx.closePath();cx.fill();cx.stroke();
  }
  function fade(){
    var tall=H>320,at=tall?.22:.12,ab=tall?.5:.32,et=tall?.2:.2,eb=tall?.32:.3,g=cx.createLinearGradient(0,0,0,H);
    g.addColorStop(0,'rgba(10,14,22,'+at+')');g.addColorStop(et,'rgba(10,14,22,0)');
    g.addColorStop(1-eb,'rgba(10,14,22,0)');g.addColorStop(1,'rgba(10,14,22,'+ab+')');
    cx.fillStyle=g;cx.fillRect(0,0,W,H);
  }
  function draw(t){
    var k=0;
    for(var j=0;j<rows-1;j++)for(var i=0;i<cols-1;i++){
      var a=P(i,j,t),b=P(i+1,j,t),c=P(i,j+1,t),d=P(i+1,j+1,t);
      if((i+j)%2===0){tri(a,b,d,k++,t);tri(a,d,c,k++,t);}else{tri(a,b,c,k++,t);tri(b,d,c,k++,t);}
    }
    fade();
  }
  var SLOW=.55,t0=performance.now(),raf=0;   /* 1 = original speed; lower = slower */
  function frame(now){draw((now-t0)/1000*SLOW);raf=requestAnimationFrame(frame);}
  function start(){build();draw(4);if(!reduce){cancelAnimationFrame(raf);raf=requestAnimationFrame(frame);}}
  var rt;window.addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(start,120);});
  start();
})();
