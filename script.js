var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Mobile menu (Escape closes and returns focus)
var burger=document.getElementById('burger'),links=document.getElementById('navLinks');
function closeMenu(){links.classList.remove('open');burger.setAttribute('aria-expanded','false');burger.setAttribute('aria-label','Open menu');}
if(burger){
  burger.addEventListener('click',function(){var o=links.classList.toggle('open');burger.setAttribute('aria-expanded',o);burger.setAttribute('aria-label',o?'Close menu':'Open menu');});
  links.querySelectorAll('a').forEach(function(a){a.addEventListener('click',closeMenu);});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&links.classList.contains('open')){closeMenu();burger.focus();}});
}

// Nav shadow on scroll
var nav=document.getElementById('nav');
function onScroll(){if(nav)nav.classList.toggle('scrolled',window.scrollY>10);}
window.addEventListener('scroll',onScroll,{passive:true});onScroll();

// Hero: one permanent photo (no slideshow), so this only runs if slides are added later
var slides=document.querySelectorAll('#heroSlides img'),dots=document.querySelectorAll('#dots span'),toggle=document.getElementById('slideToggle'),cur=0,timer=null,paused=false;
function next(){
  slides[cur].classList.remove('active');if(dots[cur])dots[cur].classList.remove('on');
  cur=(cur+1)%slides.length;
  slides[cur].classList.add('active');if(dots[cur])dots[cur].classList.add('on');
}
function start(){if(!timer&&slides.length>1)timer=setInterval(next,6000);}
function stop(){clearInterval(timer);timer=null;}
function setPaused(p){
  paused=p;
  if(toggle){toggle.setAttribute('aria-pressed',p);toggle.setAttribute('aria-label',p?'Play slideshow':'Pause slideshow');}
  if(p)stop();else start();
}
if(slides.length){
  if(reduce)setPaused(true);else start();
  if(toggle)toggle.addEventListener('click',function(){setPaused(!paused);});
}

// Count-up
function countUp(el){
  var end=+el.getAttribute('data-count');
  if(reduce){el.textContent=end;return;}
  var t0=null;
  function step(t){if(!t0)t0=t;var p=Math.min((t-t0)/1400,1);el.textContent=Math.round(end*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(step);}
  el.textContent='0';requestAnimationFrame(step);
}

// Springy pop-in reveals, staggered within each parent
var targets=document.querySelectorAll('.pop');
if('IntersectionObserver' in window&&!reduce){
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(!e.isIntersecting)return;
      var el=e.target,sibs=Array.prototype.filter.call(el.parentElement.children,function(c){return c.classList.contains('pop');});
      el.style.transitionDelay=(Math.max(0,sibs.indexOf(el))*0.08)+'s';
      el.classList.add('in');
      el.addEventListener('transitionend',function(){el.style.transitionDelay='';},{once:true});
      el.querySelectorAll('[data-count]').forEach(countUp);
      io.unobserve(el);
    });
  },{threshold:.12,rootMargin:'0px 0px -40px 0px'});
  targets.forEach(function(el){io.observe(el);});
}else{
  targets.forEach(function(el){el.classList.add('in');});
}

// Click-to-play Facebook videos (iframe only loads when tapped)
document.querySelectorAll('.video-cover').forEach(function(btn){
  btn.addEventListener('click',function(){
    var f=document.createElement('iframe');
    f.src='https://www.facebook.com/plugins/video.php?href='+encodeURIComponent(btn.getAttribute('data-video'))+'&show_text=false&width=560&autoplay=true';
    f.title=btn.getAttribute('data-title');
    f.setAttribute('allow','autoplay; encrypted-media; picture-in-picture; web-share');
    f.setAttribute('allowfullscreen','');
    f.setAttribute('scrolling','no');
    btn.replaceWith(f);
  });
});

// Gmail compose links (email built in JS so Cloudflare can't rewrite it)
document.querySelectorAll('a[data-gmail]').forEach(function(a){var to=a.getAttribute('data-user')+'@'+a.getAttribute('data-domain');a.href='https://mail.google.com/mail/?view=cm&fs=1&to='+encodeURIComponent(to)+'&su='+(a.getAttribute('data-su')||'')+'&body='+(a.getAttribute('data-body')||'');a.target='_blank';a.rel='noopener';});
var et=document.getElementById('emailText');if(et)et.textContent='vali.booth'+'@'+'gmail.com';

var yr=document.getElementById('year');if(yr)yr.textContent=new Date().getFullYear();
