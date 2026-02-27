(function(){
'use strict';

if(typeof lucide!=='undefined') lucide.createIcons();

var hasPointer = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
if(hasPointer){
  var cEl = document.getElementById('cur');
  var rEl = document.getElementById('cur-r');
  var mx=-300,my=-300,rx=-300,ry=-300,pending=false;
  document.addEventListener('mousemove',function(e){
    mx=e.clientX; my=e.clientY;
    if(!pending){
      pending=true;
      requestAnimationFrame(function(){
        cEl.style.transform='translate3d('+(mx-4)+'px,'+(my-4)+'px,0)';
        pending=false;
      });
    }
  });
  (function loop(){
    rx+=(mx-rx)*.11; ry+=(my-ry)*.11;
    rEl.style.transform='translate3d('+(rx-16)+'px,'+(ry-16)+'px,0)';
    requestAnimationFrame(loop);
  })();
  document.querySelectorAll('a,button,.card,.ct-item,.pj-link').forEach(function(el){
    el.addEventListener('mouseenter',function(){ cEl.style.width=cEl.style.height='18px'; rEl.style.width=rEl.style.height='52px'; rEl.style.opacity='.2'; });
    el.addEventListener('mouseleave',function(){ cEl.style.width=cEl.style.height='8px';  rEl.style.width=rEl.style.height='32px'; rEl.style.opacity='.5'; });
  });
}

var htmlEl = document.documentElement;
var iSun = document.getElementById('iSun');
var iMoon= document.getElementById('iMoon');
function setTheme(dark){
  htmlEl.classList.toggle('dark',dark);
  iSun.style.display = dark?'none':'block';
  iMoon.style.display= dark?'block':'none';
  localStorage.setItem('sa-theme',dark?'dark':'light');
}
var saved = localStorage.getItem('sa-theme');
setTheme(saved==='dark'||(saved===null&&window.matchMedia('(prefers-color-scheme:dark)').matches));
document.getElementById('themeBtn').addEventListener('click',function(){
  setTheme(!htmlEl.classList.contains('dark'));
});

var navEl = document.getElementById('nav');
window.addEventListener('scroll',function(){
  navEl.classList.toggle('stuck',window.scrollY>40);
},{passive:true});
navEl.classList.toggle('stuck',window.scrollY>40);

var lnks = document.querySelectorAll('.n-lnk[href^="#"]');
function setActive(id){
  lnks.forEach(function(l){
    l.classList.toggle('on', l.getAttribute('href')==='#'+id);
  });
}
var secEls = document.querySelectorAll('section[id]');
var secObs = new IntersectionObserver(function(entries){
  entries.forEach(function(e){ if(e.isIntersecting) setActive(e.target.id); });
},{threshold:0.3,rootMargin:'-10% 0px -50% 0px'});
secEls.forEach(function(s){secObs.observe(s);});

var mob    = document.getElementById('mob-menu');
var hbg    = document.getElementById('hbgBtn');
var iMenuI = document.getElementById('iMenu');
var iCloseI= document.getElementById('iClose');
var isOpen = false;

function openMob(){
  isOpen=true;
  mob.classList.add('open');
  mob.setAttribute('aria-hidden','false');
  hbg.setAttribute('aria-expanded','true');
  iMenuI.style.display='none';
  iCloseI.style.display='block';
  document.body.style.overflow='hidden';
}
window.closeMob=function(){
  isOpen=false;
  mob.classList.remove('open');
  mob.setAttribute('aria-hidden','true');
  hbg.setAttribute('aria-expanded','false');
  iMenuI.style.display='block';
  iCloseI.style.display='none';
  document.body.style.overflow='';
};
hbg.addEventListener('click',function(){
  isOpen ? closeMob() : openMob();
});
document.addEventListener('keydown',function(e){
  if(e.key==='Escape'&&isOpen) closeMob();
});

var rvEls = document.querySelectorAll('.rv');
var rvObs = new IntersectionObserver(function(entries){
  entries.forEach(function(e){
    if(e.isIntersecting){
      e.target.classList.add('in');
      rvObs.unobserve(e.target);
    }
  });
},{threshold:0.08,rootMargin:'0px 0px -20px 0px'});
(window.requestIdleCallback||setTimeout)(function(){
  rvEls.forEach(function(el){rvObs.observe(el);});
});

var barEls = document.querySelectorAll('.sk-fill');
var barObs = new IntersectionObserver(function(entries){
  entries.forEach(function(e){
    if(e.isIntersecting){
      e.target.style.width=e.target.getAttribute('data-w')+'%';
      barObs.unobserve(e.target);
    }
  });
},{threshold:0.3});
barEls.forEach(function(b){barObs.observe(b);});

var ctForm = document.getElementById('ctForm');
var fMsg   = document.getElementById('fMsg');
var fBtn   = document.getElementById('fBtnTxt');
if (ctForm) {
  ctForm.addEventListener('submit',function(e){
    e.preventDefault();
    var em = document.getElementById('fe').value.trim();
    var ms = document.getElementById('fm').value.trim();
    if(!em||!ms){
      fMsg.textContent='Please fill in your email and message.';
      fMsg.style.cssText='display:block;color:#e05555;';
      setTimeout(function(){fMsg.style.display='none';},4000);
      return;
    }
    fBtn.textContent='Sending…';
    setTimeout(function(){
      fBtn.textContent='Send Message';
      ctForm.reset();
      fMsg.textContent='✓ Message sent! I\'ll get back to you soon.';
      fMsg.style.cssText='display:block;color:var(--a);';
      setTimeout(function(){fMsg.style.display='none';},5000);
    },1800);
  });
}

document.querySelectorAll('a[href^="#"]').forEach(function(a){
  a.addEventListener('click',function(e){
    var t=document.querySelector(a.getAttribute('href'));
    if(!t) return;
    e.preventDefault();
    if(isOpen) closeMob();
    setTimeout(function(){
      var top = t.getBoundingClientRect().top + window.scrollY - 64;
      window.scrollTo({top:top,behavior:'smooth'});
    }, isOpen ? 320 : 0);
  });
});

})();
