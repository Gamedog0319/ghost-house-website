
  (() => {
    const room = document.getElementById('room');
    const items = [...room.querySelectorAll('.hauntable')];
    const values = {clock:3, curtains:2, lamp:3};
    const triggered = new Set();
    const fearCount = document.getElementById('fear-count');
    const fearFill = document.getElementById('fear-fill');
    const fearTrack = document.getElementById('fear-track');
    const statusHead = document.getElementById('status-head');
    const statusCopy = document.getElementById('status-copy');
    const statusSymbol = document.getElementById('status-symbol');
    const speech = document.getElementById('speech');
    const reset = document.getElementById('reset');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let activeTimers = [];
    function later(fn,delay){const t=window.setTimeout(fn,delay);activeTimers.push(t)}
    function announce(title,body,face,icon){statusHead.textContent=title;statusCopy.textContent=body;speech.textContent=face;statusSymbol.textContent=icon}
    function haunt(element){
      const key=element.dataset.object;
      if(triggered.has(key)) return;
      triggered.add(key);
      element.classList.add('is-haunted');
      element.setAttribute('aria-pressed','true');
      element.setAttribute('aria-label',`${key} already haunted`);
      reset.disabled=false;
      const art=element.querySelector('.object-art');
      const effect={clock:'is-ringing',curtains:'is-rustling',lamp:'is-zapping'}[key];
      art.classList.remove(effect);void art.getBoundingClientRect();art.classList.add(effect);
      const fear=[...triggered].reduce((sum,k)=>sum+values[k],0);
      fearCount.textContent=`${fear} / 8`;fearFill.style.width=`${fear/8*100}%`;fearTrack.setAttribute('aria-valuenow',fear);
      if(fear===8){panic()} else if(fear>=5){announce('Something is VERY wrong.','The house resident looks around in alarm. One more good scare should do it...','D-did you hear that?!','!')} else {announce('A suspicious noise...','The house resident is getting nervous. Try haunting another object!','Huh? What was that?','?')}
    }
    function panic(){
      room.classList.add('panic');room.dataset.phase='jump';
      announce('JUMP!','A tiny noise. A spectacular overreaction.','AAAA!','!');
      if(reduced){lightsOn();return}
      later(()=>{room.dataset.phase='scramble';announce('SCRAMBLE!','Arms flailing, the NPC races for the light switches.','TURN ON THE LIGHTS!','↗')},950);
      later(lightsOn,2300);
    }
    function lightsOn(){room.dataset.phase='lights';room.classList.add('lights-on');announce('EVERY LIGHT ON!','The house resident survives the haunting. Their dignity does not. The ghost wins!','I AM NOT SCARED!','✦')}
    items.forEach(el=>{
      el.addEventListener('click',()=>haunt(el));
      el.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();haunt(el)}});
    });
    reset.addEventListener('click',()=>{
      activeTimers.forEach(clearTimeout);activeTimers=[];triggered.clear();
      room.classList.remove('panic','lights-on');room.removeAttribute('data-phase');
      items.forEach(el=>{el.classList.remove('is-haunted');el.setAttribute('aria-pressed','false');el.setAttribute('aria-label',`Haunt the ${el.dataset.object}, plus ${values[el.dataset.object]} Fear`);const art=el.querySelector('.object-art');art.classList.remove('is-ringing','is-rustling','is-zapping')});
      fearCount.textContent='0 / 8';fearFill.style.width='0%';fearTrack.setAttribute('aria-valuenow','0');
      announce('A perfectly normal evening...','Look for a pulsing glow, then tap an object. Watch the Fear meter rise!','What a calm evening...','☾');reset.disabled=true;
    });
  })();
  (() => {
  const dialog=document.getElementById('art-dialog');
  const pic=document.getElementById('art-dialog-image');
  const text=document.getElementById('art-dialog-caption');
  document.querySelectorAll('[data-gallery]').forEach(button=>{
    button.addEventListener('click',()=>{
      const thumb=button.querySelector('img');
      pic.src=thumb.src;
      pic.alt=thumb.alt;
      text.textContent=button.dataset.caption || thumb.alt;
      if(typeof dialog.showModal==='function') dialog.showModal();
      else dialog.setAttribute('open','');
    });
  });
  document.getElementById('art-dialog-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
})();(() => {
 const pillarText=["Experiment your own way. The best haunting is the one you invent.","Follow your curiosity. Every ordinary object might have something extraordinary inside.","Mischief has consequences — and even a ghost can change how people connect.","A little spooky, a little silly, and proudly wonky. Personality over realism."];
 document.querySelectorAll('.pill-tab').forEach((button,index)=>button.addEventListener('click',()=>{
   document.querySelectorAll('.pill-tab').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-selected',String(b===button))});
   document.getElementById('pillar-explain').textContent=pillarText[index];
 }));
 const selectPanel=id=>{document.querySelectorAll('.studio-tab').forEach(b=>{let yes=b.dataset.panel===id;b.classList.toggle('active',yes);b.setAttribute('aria-selected',String(yes))});document.querySelectorAll('.studio-panel').forEach(p=>{p.hidden=p.id!==id})};
 document.querySelectorAll('.studio-tab').forEach(b=>b.addEventListener('click',()=>selectPanel(b.dataset.panel)));
 document.querySelectorAll('[data-open-motion]').forEach(b=>b.addEventListener('click',()=>selectPanel('studio-motion')));
 const slides=Array.from(document.querySelectorAll('.motion-slide'));
 const clipButtons=Array.from(document.querySelectorAll('.clip-choice'));
 const prev=document.getElementById('clip-prev'),next=document.getElementById('clip-next'),num=document.getElementById('clip-index');let current=0;
 function chooseClip(i){current=Math.min(slides.length-1,Math.max(0,i));slides.forEach((s,j)=>{s.hidden=j!==current});clipButtons.forEach((b,j)=>{b.classList.toggle('active',j===current);b.setAttribute('aria-pressed',String(j===current))});num.textContent=`${String(current+1).padStart(2,'0')} / ${String(slides.length).padStart(2,'0')}`;prev.disabled=current===0;next.disabled=current===slides.length-1}
 prev.addEventListener('click',()=>chooseClip(current-1));next.addEventListener('click',()=>chooseClip(current+1));clipButtons.forEach(b=>b.addEventListener('click',()=>chooseClip(Number(b.dataset.clip))));
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');if(reduce.matches){document.querySelectorAll('.motion-gif').forEach(im=>{const backup=im.src;const canvas=document.createElement('canvas');const newImage=new Image();newImage.onload=()=>{canvas.width=newImage.naturalWidth;canvas.height=newImage.naturalHeight;canvas.getContext('2d').drawImage(newImage,0,0);im.src=canvas.toDataURL('image/png')};newImage.src=backup})}
})();
(() => {
 const choices=[...document.querySelectorAll('.feature-choice')];
 const notes=[
 ['THE IDEA','Everyday furniture becomes a supernatural toy. A tiny change can start a much larger reaction.'],
 ['THE HEART OF THE GAME','Objects carry emotional effects. Combine hauntings to move NPCs toward special thresholds.'],
 ['THE PAYOFF','A threshold can trigger a new NPC event. Main emotional goals are designed to unlock new paths and upgrades.']
 ];
 choices.forEach((button,index)=>button.addEventListener('click',()=>{
  choices.forEach(b=>{const active=b===button;b.classList.toggle('selected',active);b.setAttribute('aria-pressed',String(active))});
  document.getElementById('feature-live-label').textContent=notes[index][0];
  document.getElementById('feature-live-copy').textContent=notes[index][1];
 }));
})();
