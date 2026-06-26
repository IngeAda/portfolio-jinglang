// ===== mobile menu =====
const nav = document.getElementById('nav');
const burger = document.getElementById('burger');
burger?.addEventListener('click', () => nav.classList.toggle('open'));
nav?.querySelectorAll('.desktop-links a').forEach(a =>
  a.addEventListener('click', () => nav.classList.remove('open'))
);

// ===== adaptive nav + corner color per band =====
const corner = document.querySelector('.corner');
const bands = [...document.querySelectorAll('.band')].map(el => ({
  el, light: el.classList.contains('band--blue') || el.classList.contains('band--black')
}));
function bandAt(y){ for(const b of bands){ const r=b.el.getBoundingClientRect(); if(r.top<=y&&r.bottom>y) return b; } return null; }
function paintChrome(){
  const t=bandAt(28); if(t) nav.classList.toggle('light', t.light);
  const b=bandAt(window.innerHeight-30); if(b&&corner) corner.classList.toggle('light', b.light);
}
paintChrome();
addEventListener('scroll', paintChrome, {passive:true});
addEventListener('resize', paintChrome);

// ===== scroll reveal =====
const io = new IntersectionObserver((es)=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}})},{threshold:.1,rootMargin:'0px 0px -5% 0px'});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// ===== block meters =====
document.querySelectorAll('.cells').forEach(c=>{
  const on=+(c.dataset.on||0), total=+(c.dataset.total||5);
  for(let i=0;i<total;i++){ const d=document.createElement('span'); d.className='cell'+(i<on?' on':''); c.appendChild(d); }
});

// ===== hover-reveal project covers on 目录 rows =====
const hc=document.getElementById('hoverCover');
if(hc){
  const hcImg=document.getElementById('hcImg'), hcName=document.getElementById('hcName'), hcMeta=document.getElementById('hcMeta');
  let raf=null,tx=0,ty=0;
  const move=e=>{tx=e.clientX;ty=e.clientY;if(!raf)raf=requestAnimationFrame(()=>{hc.style.left=tx+'px';hc.style.top=Math.max(120,ty-40)+'px';raf=null;});};
  document.querySelectorAll('.idx-row').forEach(row=>{
    row.addEventListener('mouseenter',()=>{
      const cover=row.dataset.cover;
      if(cover){hcImg.style.background='#eef0f3';hcImg.style.backgroundImage=`url(${cover})`;hcImg.style.backgroundSize='cover';hcImg.style.backgroundPosition='center';hcImg.innerHTML='';}
      hcName.textContent=row.dataset.name||'';
      hcMeta.textContent=(row.querySelector('.meta')?.textContent||'').split('·')[0].trim();
      hc.classList.add('show'); addEventListener('mousemove',move);
    });
    row.addEventListener('mouseleave',()=>{hc.classList.remove('show');removeEventListener('mousemove',move);});
  });
}

// ===== project strip viewer (click a project -> vertical strip) =====
const pv=document.getElementById('pviewer');
if(pv){
  const stack=document.getElementById('pvStack');
  const pvNum=document.getElementById('pvNum'), pvTitle=document.getElementById('pvTitle'), pvEn=document.getElementById('pvEn');
  const imgURL=n=> (window.__IMG__ && window.__IMG__[n]) || ('images/boards_web/'+n);
  const vidURL=n=> (window.__VID__ && window.__VID__[n]) || ('images/'+n);
  function openProject(row){
    const list=(row.dataset.boards||'').split(',').filter(Boolean);
    const vid=row.dataset.video;
    pvNum.textContent=(row.querySelector('.num')?.textContent||'').trim();
    pvTitle.textContent=row.dataset.name||'';
    pvEn.textContent=row.dataset.en||'';
    let html='';
    html+=list.map(n=>`<img loading="lazy" src="${imgURL(n)}" alt="" />`).join('');
    if(vid) html+=`<video class="pv-vid" controls playsinline preload="metadata" src="${vidURL(vid)}"></video>`;
    html+='<div class="pv-end">— 完 · END —</div>';
    stack.innerHTML=html;
    pv.classList.add('open'); document.body.style.overflow='hidden'; stack.scrollTop=0;
  }
  const _close=()=>{}; // close handler defined below pauses video
  const close=()=>{ pv.classList.remove('open'); document.body.style.overflow=''; stack.innerHTML=''; };
  document.querySelectorAll('.idx-row').forEach(r=>r.addEventListener('click',()=>openProject(r)));
  // hero flow covers -> open matching project
  const byCover={}; document.querySelectorAll('.idx-row').forEach(r=>{ byCover[r.dataset.cover]=r; });
  document.querySelectorAll('.fc').forEach(f=>f.addEventListener('click',()=>{ const k=f.querySelector('img').getAttribute('src'); const r=byCover[k]; if(r) openProject(r); }));
  document.getElementById('pvClose').addEventListener('click',close);
  pv.addEventListener('click',e=>{ if(e.target===pv) close(); });
  addEventListener('keydown',e=>{ if(e.key==='Escape'&&pv.classList.contains('open')) close(); });
}
