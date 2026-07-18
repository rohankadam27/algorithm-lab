/* Musical sound engine — Sa Re Ga Ma Pa (Indian sargam, just-intonation),
   walked strictly in Fibonacci order: every event advances to fib(n) mod 8
   in the scale, so the melody genuinely traces 1,1,2,3,5,8,13,21... instead
   of being scrambled by the data being visualized. Data still matters —
   it picks the OCTAVE (low / mid / high Sa-Re-Ga-Ma-Pa), not the note. */
const Sound = (()=>{
  let ctx=null, on=true;
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

  function C(){ if(!ctx) ctx = new (window.AudioContext||window.webkitAudioContext)(); return ctx; }
  function tone(freq,dur=0.2,type='sine',vol=0.16,delay=0){
    if(!on) return;
    try{
      const c=C(), t0=c.currentTime+delay;
      const osc=c.createOscillator(), gain=c.createGain();
      osc.type=type; osc.frequency.setValueAtTime(freq,t0);
      gain.gain.setValueAtTime(0,t0);
      gain.gain.linearRampToValueAtTime(vol,t0+0.015);
      gain.gain.exponentialRampToValueAtTime(0.001,t0+dur);
      osc.connect(gain); gain.connect(c.destination);
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

  function compare(v,min,max){
    const idx=nextFibScaleIndex();
    tone(freqFor(idx, octaveFor(v,min,max)), 0.11, 'sine', 0.13);
  }
  function swap(a,b,min,max){
    const idx1=nextFibScaleIndex(); tone(freqFor(idx1,octaveFor(a,min,max)),0.13,'triangle',0.16);
    const idx2=nextFibScaleIndex(); tone(freqFor(idx2,octaveFor(b,min,max)),0.13,'triangle',0.16,0.09);
  }
  function place(){ const idx=nextFibScaleIndex(); tone(freqFor(idx,1.5),0.13,'triangle',0.15); }
  function reject(){ const idx=nextFibScaleIndex(); tone(freqFor(idx,0.75),0.16,'sawtooth',0.1); }
  function backtrack(){ const idx=nextFibScaleIndex(); tone(freqFor(idx,0.75),0.14,'sawtooth',0.1); tone(freqFor(Math.max(0,idx-1),0.75),0.14,'sawtooth',0.09,0.1); }
  function success(){
    // a real little Fibonacci-shaped flourish: Sa(1) Re(1) Ga(2) Pa(3) Dha(5) Sa'(8mod8=0->Sa oct2)
    const walk=[0,0,1,2,4,3];
    walk.forEach((si,i)=>tone(freqFor(si,i<4?1.5:2),0.26,'sine',0.18,i*0.11));
    resetMelody();
  }
  function click(){ tone(freqFor(0,1),0.05,'square',0.07); }
  function toggle(){ on=!on; return on; }
  function isOn(){ return on; }

  let waveBars=[];
  function bindWave(el){ waveBars=[...el.querySelectorAll('.wave-bar')]; }
  function pulseWave(){
    if(!waveBars.length) return;
    waveBars.forEach(b=>{ b.style.height=(3+Math.random()*20)+'px'; });
    clearTimeout(pulseWave._t);
    pulseWave._t=setTimeout(()=>waveBars.forEach(b=>b.style.height='3px'),180);
  }
  return {compare,swap,place,reject,backtrack,success,click,toggle,isOn,bindWave,resetMelody,NAMES};
})();
