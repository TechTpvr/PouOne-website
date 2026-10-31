(function(){
  "use strict";
  var d=document,root=d.documentElement,cfg=window.POUONE_CONFIG||{},P=window.POUONE_PRODUCTS||{};
  root.classList.add("js");
  var $=function(s,c){return(c||d).querySelector(s)};

  /* تم تیره/روشن */
  var KEY="pouone-theme",saved=null;
  try{saved=localStorage.getItem(KEY)}catch(e){}
  function setTheme(t){root.setAttribute("data-theme",t);var m=$('meta[name="theme-color"]');if(m)m.content=t==="light"?"#f5f7fb":"#06080f"}
  setTheme(saved||(matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"));
  $("#theme").addEventListener("click",function(){
    var t=root.getAttribute("data-theme")==="light"?"dark":"light";setTheme(t);try{localStorage.setItem(KEY,t)}catch(e){}
  });

  /* نوار ناوبری */
  var nav=$("#nav");
  function onScroll(){nav.classList.toggle("is-stuck",scrollY>8)}
  addEventListener("scroll",onScroll,{passive:true});onScroll();

  /* نمایش با اسکرول */
  var els=d.querySelectorAll(".reveal");
  els.forEach(function(el,i){el.style.setProperty("--d",(i%4)*.08+"s")});
  if("IntersectionObserver" in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}})},{threshold:.15});
    els.forEach(function(el){io.observe(el)});
  }else els.forEach(function(el){el.classList.add("in")});

  /* افکت نور و شیب کارت‌ها */
  if(matchMedia("(hover:hover)").matches)d.querySelectorAll(".card").forEach(function(c){
    c.addEventListener("pointermove",function(e){
      var r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
      c.style.setProperty("--mx",x*100+"%");c.style.setProperty("--my",y*100+"%");
      c.style.setProperty("--rx",((.5-y)*6).toFixed(2)+"deg");c.style.setProperty("--ry",((x-.5)*6).toFixed(2)+"deg");
    });
    c.addEventListener("pointerleave",function(){c.style.setProperty("--rx","0deg");c.style.setProperty("--ry","0deg")});
  });

  /* پنجره محصول */
  var modal=$("#modal");
  function safe(u){return typeof u==="string"&&(/^https:\/\//i.test(u)||/^[\w\-./]+$/.test(u))}
  function open(id,card){
    var p=P[id];if(!p)return;
    $("#m-logo").src=$(".card__logo",card).src;
    $("#m-title").textContent=p.name;
    $("#m-tag").textContent=$(".card__desc",card).textContent;
    $("#m-desc").textContent=p.description;
    var ul=$("#m-uses");ul.textContent="";
    p.uses.forEach(function(t){var li=d.createElement("li");li.textContent=t;ul.appendChild(li)});
    var box=$("#m-actions");box.textContent="";
    var dl=(cfg.downloads||{})[id]||{};
    [["android","دانلود نسخه اندروید"],["windows","دانلود نسخه ویندوز"]].forEach(function(o,i){
      var a=d.createElement("a"),u=dl[o[0]];a.className="btn"+(i?"":" btn--primary");
      if(safe(u)){a.href=u;a.textContent=o[1];a.setAttribute("download","")}
      else{a.textContent=o[1].replace("دانلود","به‌زودی:");a.setAttribute("aria-disabled","true")}
      box.appendChild(a);
    });
    modal.showModal();
  }
  d.querySelectorAll(".card").forEach(function(c){c.addEventListener("click",function(){open(c.dataset.product,c)})});
  $("#m-close").addEventListener("click",function(){modal.close()});
  modal.addEventListener("click",function(e){if(e.target===modal)modal.close()});

  /* اطلاعات تماس */
  var c=cfg.contact||{},list=$("#contact-list"),n=0;
  [["email","ایمیل",function(v){return"mailto:"+v}],["telegram","تلگرام",function(v){return"https://t.me/"+v}],
   ["instagram","اینستاگرام",function(v){return"https://instagram.com/"+v}],["phone","تلفن",function(v){return"tel:"+v.replace(/\s/g,"")}]
  ].forEach(function(r){
    var v=(c[r[0]]||"").trim();if(!v)return;n++;
    var row=d.createElement("div"),dt=d.createElement("dt"),dd=d.createElement("dd"),a=d.createElement("a");
    dt.textContent=r[1];a.textContent=v;a.href=r[2](v);a.lang="en";a.dir="ltr";
    dd.appendChild(a);row.appendChild(dt);row.appendChild(dd);list.appendChild(row);
  });
  if(!n)$("#contact-empty").hidden=false;
  $("#year").textContent=new Date().getFullYear();
})();
