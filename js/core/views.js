/* Live view counter — uses the free, no-signup CounterAPI v1 REST endpoint
   (https://counterapi.dev) to persist a real cross-visitor count, then
   animates it counting up (ease-out) instead of just snapping to a number. */
const Views = (()=>{
  // CHANGE THIS to something unique to your repo (e.g. include your GitHub
  // username) before deploying — namespaces on the free tier are public,
  // so a generic name could get bumped by someone else's test traffic.
  const NAMESPACE = 'algolab-yourusername-daa-visualizer';
  const COUNTER_NAME = 'pageviews';
  const API = `https://api.counterapi.dev/v1/${NAMESPACE}/${COUNTER_NAME}/up`;

  function animateCount(el, from, to, duration=1400){
    if(to<=from){ el.textContent=to.toLocaleString(); return; }
    const start=performance.now();
    function tick(now){
      const t=Math.min(1,(now-start)/duration);
      const eased=1-Math.pow(1-t,3); // ease-out cubic — fast start, gentle settle
      const val=Math.round(from+(to-from)*eased);
      el.textContent=val.toLocaleString();
      if(t<1) requestAnimationFrame(tick);
      else el.closest('.views-badge')?.classList.add('views-pulse');
    }
    requestAnimationFrame(tick);
  }

  async function init(elId){
    const el=document.getElementById(elId);
    if(!el) return;
    el.textContent='\u00B7\u00B7\u00B7';
    try{
      const res=await fetch(API);
      if(!res.ok) throw new Error('bad response '+res.status);
      const data=await res.json();
      const count = data.count ?? data.value ?? (data.data && data.data.up_count) ?? 0;
      animateCount(el, 0, count);
    }catch(e){
      el.textContent='\u2014';
      console.warn('View counter unavailable:', e.message);
    }
  }
  return {init};
})();
