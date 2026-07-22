/* Musical sound engine — Sa Re Ga Ma Pa (Indian sargam, just-intonation),
   walked strictly in Fibonacci order: every event advances to fib(n) mod 8
   in the scale, so the melody genuinely traces 1,1,2,3,5,8,13,21... instead
   of being scrambled by the data being visualized. Data still matters —
   it picks the OCTAVE (low / mid / high Sa-Re-Ga-Ma-Pa), not the note. */
const Sound = (()=>{
  let ctx=null, on=true, master=null, limiter=null;
  const SA=246.94; // B3 — sits low enough that the octave-up shift stays pleasant
  // Sa Re Ga Ma Pa Dha Ni Sa' — just-intonation ratios (8 steps, index 0..7)
  const RATIOS=[1, 9/8, 5/4, 4/3, 3/2, 5/3, 15/8, 2];
  const NAMES =['Sa','Re','Ga','Ma','Pa','Dha','Ni',"Sa'"];
  const SCALE_LEN=RATIOS.length;

  // ---- Fibonacci walk (the actual melody index) ----
  let fibPrev=1, fibCurr=1, fibStep=0;
  function nextFibScaleIndex(){
    const idx = fibCurr % SCALE_LEN;      // this call's position in Sa..Sa'
    const next = fibPrev + fibCurr;
    fibPrev = fibCurr; fibCurr = next; fibStep++;
    if(fibCurr > 50000){ fibPrev=1; fibCurr=1; fibStep=0; } // keep numbers small
    return idx;
  }
  function resetMelody(){ fibPrev=1; fibCurr=1; fibStep=0; }

  function freqFor(scaleIdx, octave){ return SA * RATIOS[scaleIdx] * octave; }

  // ---- Audio graph: every note -> limiter -> master gain -> speakers ----
  // The limiter (DynamicsCompressor with a hard knee near 0dB) is what lets us
  // push individual note volume way up without harsh digital clipping when
  // several notes overlap (e.g. a swap's two tones firing close together).
  function C(){
    if(!ctx){
      ctx = new (window.AudioContext||window.webkitAudioContext)();
      limiter = ctx.createDynamicsCompressor();
      limiter.threshold.setValueAtTime(-6, ctx.currentTime);
      limiter.knee.setValueAtTime(4, ctx.currentTime);
      limiter.ratio.setValueAtTime(16, ctx.currentTime);
      limiter.attack.setValueAtTime(0.002, ctx.currentTime);
      limiter.release.setValueAtTime(0.15, ctx.currentTime);
      master = ctx.createGain();
      master.gain.setValueAtTime(1.6, ctx.currentTime); // overall loudness boost
      limiter.connect(master); master.connect(ctx.destination);
    }
    // Browsers create/keep AudioContext SUSPENDED until a user gesture resumes
    // it — this is the #1 reason sound seems "too quiet" (it's actually barely
    // playing at all). Resume defensively on every tone.
    if(ctx.state === 'suspended'){ ctx.resume(); }
    return ctx;
  }

  function tone(freq,dur=0.22,type='sine',vol=0.4,delay=0){
    if(!on) return;
    try{
      const c=C(), t0=c.currentTime+delay;
      const osc=c.createOscillator(), gain=c.createGain();
      osc.type=type; osc.frequency.setValueAtTime(freq,t0);
      gain.gain.setValueAtTime(0,t0);
      gain.gain.linearRampToValueAtTime(vol,t0+0.015);
      gain.gain.exponentialRampToValueAtTime(0.001,t0+dur);
      osc.connect(gain); gain.connect(limiter);
      osc.start(t0); osc.stop(t0+dur+0.03);
      pulseWave();
    }catch(e){}
  }

  // data value only nudges the OCTAVE (1x, 1.5x "between", or 2x) — the
  // actual note sequence always follows the Fibonacci walk faithfully.
  function octaveFor(val,min,max){
    const t=(val-min)/((max-min)||1);
    return t<0.34 ? 1 : t<0.67 ? 1.5 : 2;
  }

  // ---- Volumes boosted roughly 2.5x across the board vs. the old version ----
  function compare(v,min,max){
    const idx=nextFibScaleIndex();
    tone(freqFor(idx, octaveFor(v,min,max)), 0.13, 'sine', 0.32);
  }
  function swap(a,b,min,max){
    const idx1=nextFibScaleIndex(); tone(freqFor(idx1,octaveFor(a,min,max)),0.15,'triangle',0.38);
    const idx2=nextFibScaleIndex(); tone(freqFor(idx2,octaveFor(b,min,max)),0.15,'triangle',0.38,0.09);
  }
  function place(){ const idx=nextFibScaleIndex(); tone(freqFor(idx,1.5),0.15,'triangle',0.36); }
  function reject(){ const idx=nextFibScaleIndex(); tone(freqFor(idx,0.75),0.18,'sawtooth',0.28); }
  function backtrack(){ const idx=nextFibScaleIndex(); tone(freqFor(idx,0.75),0.16,'sawtooth',0.28); tone(freqFor(Math.max(0,idx-1),0.75),0.16,'sawtooth',0.24,0.1); }
  function success(){
    // a real little Fibonacci-shaped flourish: Sa(1) Re(1) Ga(2) Pa(3) Dha(5) Sa'(8mod8=0->Sa oct2)
    const walk=[0,0,1,2,4,3];
    walk.forEach((si,i)=>tone(freqFor(si,i<4?1.5:2),0.3,'sine',0.42,i*0.11));
    resetMelody();
  }
  function click(){ tone(freqFor(0,1),0.06,'square',0.18); }
  function toggle(){ on=!on; return on; }
  function isOn(){ return on; }

  // Optional: call once from a top-level click handler (e.g. the sound button)
  // to force-unlock audio immediately, instead of waiting for the first note.
  function unlock(){ C(); }

  let waveBars=[];
  function bindWave(el){ waveBars=[...el.querySelectorAll('.wave-bar')]; }
  function pulseWave(){
    if(!waveBars.length) return;
    waveBars.forEach(b=>{ b.style.height=(3+Math.random()*20)+'px'; });
    clearTimeout(pulseWave._t);
    pulseWave._t=setTimeout(()=>waveBars.forEach(b=>b.style.height='3px'),180);
  }
  return {compare,swap,place,reject,backtrack,success,click,toggle,isOn,bindWave,resetMelody,unlock,NAMES};
})();
