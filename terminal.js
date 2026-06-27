/* vp@research — interactive terminal portfolio (EN default · IT) */
(() => {
  const screen = document.getElementById('screen');
  const form   = document.getElementById('form');
  const input  = document.getElementById('cmd');
  const caret  = document.getElementById('caret');
  const hints  = document.getElementById('hints');
  const term   = document.getElementById('term');
  const langUI = document.getElementById('lang');
  /* owner override: motion stays on even if the OS requests reduced motion */
  const reduce = false;

  let lang = 'en';

  /* ---------- ambient: faint indigo data-stream ---------- */
  (function ambient(){
    const cv = document.getElementById('amb'); if (!cv || reduce) return;
    const g = cv.getContext('2d'); const G = 14;
    let cols, drops, w, h;
    const glyphs = '0123456789ABCDEF/<>{}#$x';
    function size(){ w=cv.width=innerWidth; h=cv.height=innerHeight;
      cols=Math.ceil(w/G); drops=Array.from({length:cols},()=>Math.random()*-60); }
    size(); addEventListener('resize', size);
    let last=0;
    (function frame(t){
      if (t-last > 55){ last=t;
        g.fillStyle='rgba(10,10,15,.24)'; g.fillRect(0,0,w,h);
        g.font='12px "IBM Plex Mono", monospace';
        for (let i=0;i<cols;i++){
          const ch = glyphs[(Math.random()*glyphs.length)|0];
          const py = drops[i]*G;
          g.fillStyle = Math.random()>.95 ? 'rgba(199,201,214,.9)' : 'rgba(99,102,241,.6)';
          g.fillText(ch, i*G, py);
          if (py>h && Math.random()>.975) drops[i]=0; else drops[i]+=0.5;
        }
      }
      requestAnimationFrame(frame);
    })(0);
  })();

  const BANNER =
` ██╗   ██╗██████╗
 ██║   ██║██╔══██╗
 ██║   ██║██████╔╝
 ╚██╗ ██╔╝██╔═══╝
  ╚████╔╝ ██║
   ╚═══╝  ╚═╝     `;

  /* ---------- output helpers ---------- */
  const el = (cls, html) => { const d = document.createElement('div'); if (cls) d.className = cls; d.innerHTML = html; return d; };
  const out = (html, cls='line') => { screen.appendChild(el(cls, html)); scroll(); };
  const block = (html) => { screen.appendChild(el('line block', html)); scroll(); };
  const scroll = () => { screen.scrollTop = screen.scrollHeight; };
  const escape = s => String(s).replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));

  /* ---------- i18n content (embargo-safe) ---------- */
  const T = {
    en: {
      whoami:
`<span class="c-bright">Valentino Paulon</span> — security researcher &amp; engineer
<span class="c-muted">// privilege escalation · cloud-agent security · source-level vuln research</span>

I find <span class="c-amber">real, exploitable, novel</span> bugs and report them responsibly.
Published CVEs to prove it. I also build AI products and ship full-stack software.

<span class="c-olive">●</span> available for work — type <span class="c-amber2">contact</span>`,
      research:
`<span class="c-muted"># selected public work — more under coordinated disclosure</span>

<span class="tag">CVE</span> <span class="c-bright">CVE-2026-11837</span> — ansible.posix LPE (symlink-following chown)
   reported &amp; credited by Red Hat
   <a href="https://access.redhat.com/security/cve/CVE-2026-11837" target="_blank" rel="noopener">access.redhat.com</a> · <a href="https://github.com/M8seven/cve-2026-11837-ansible-posix-authorized-key" target="_blank" rel="noopener">writeup</a>

<span class="tag embargo">0DAY</span> <span class="c-bright">cloud-agent privilege escalation</span> — multiple
   additional CVEs &amp; 0-days in widely-used cloud agents / infra tooling,
   <span class="c-muted">under coordinated disclosure; published as fixes ship</span>

<span class="tag doi">DOI</span> <span class="c-bright">Captive Portal Security Analysis</span> — weak MAC-based auth
   <a href="https://doi.org/10.5281/zenodo.19061528" target="_blank" rel="noopener">10.5281/zenodo.19061528</a>

<span class="tag doi">DOI</span> <span class="c-bright">Cross-Provider Fact Mesh</span> — multi-LLM claim verification
   <a href="https://doi.org/10.5281/zenodo.19061105" target="_blank" rel="noopener">10.5281/zenodo.19061105</a>

<span class="c-muted">try:</span> <span class="c-amber2">cve</span> <span class="c-muted">for the full advisory</span>`,
      cve:
`<span class="c-amber">CVE-2026-11837</span>  <span class="c-muted">— published · credit: Valentino Paulon</span>
<dl class="kv">
  <dt>component</dt><dd>ansible.posix · authorized_key</dd>
  <dt>class</dt><dd>local privilege escalation (CWE-59)</dd>
  <dt>root cause</dt><dd>symlink-following chown on ~/.ssh/authorized_keys</dd>
  <dt>sibling of</dt><dd>CVE-2024-9902 (ansible-core user module)</dd>
  <dt>vendor</dt><dd>Red Hat — credit accepted</dd>
  <dt>record</dt><dd><a href="https://access.redhat.com/security/cve/CVE-2026-11837" target="_blank" rel="noopener">access.redhat.com</a></dd>
</dl>`,
      services:
`<span class="c-amber">// SECURITY</span>
  · code security review — Go / Python / C / C++
  · cloud &amp; infrastructure assessment
  · targeted 0-day research on your product
  · variant-analysis on recent patches

<span class="c-amber">// ENGINEERING — IT SUPPORT</span>
  · full-stack &amp; mobile development
  · AI / LLM integration
  · technical architecture &amp; review
  · automation &amp; tooling

<span class="c-muted">remote-first · project-based ·</span> type <span class="c-amber2">contact</span>`,
      method:
`<span class="c-muted"># how I work</span>

I don't run a scanner and forward output. I read code and find the
logic and memory bugs tools miss — the kind that get CVE numbers.

Every finding ships with exact <span class="c-bright">file:line</span>, quoted code, a realistic
attacker model, a working PoC, and a concrete fix.

<span class="c-olive">verified two ways before reporting → 0 false positives submitted.</span>`,
      contact:
`<span class="c-bright">Let's find what others missed.</span>

  email   <a href="mailto:valentino.paulon88@gmail.com">valentino.paulon88@gmail.com</a>
  github  <a href="https://github.com/M8seven" target="_blank" rel="noopener">github.com/M8seven</a>

<span class="c-muted">remote-first · security review · cloud assessment · vuln research · engineering</span>`,
      help:
`<span class="c-muted">available commands</span>
  <span class="c-amber2">whoami</span>     who I am
  <span class="c-amber2">research</span>   published CVEs &amp; papers
  <span class="c-amber2">cve</span>        full advisory for CVE-2026-11837
  <span class="c-amber2">services</span>   what I do
  <span class="c-amber2">method</span>     how I work
  <span class="c-amber2">contact</span>    get in touch
  <span class="c-amber2">lang</span>       switch language — <span class="c-muted">lang en | lang it</span>
  <span class="c-amber2">ls</span> / <span class="c-amber2">cat</span>   browse files · <span class="c-muted">e.g. cat cve-2026-11837.md</span>
  <span class="c-amber2">clear</span>      clear the screen
<span class="c-muted">tip: Tab completes · ↑/↓ history · or click a suggestion below</span>`,
      intro:`<span class="c-bright">Valentino Paulon</span> · security researcher &amp; engineer
<span class="c-muted">type</span> <span class="c-amber2">help</span> <span class="c-muted">or click a command below ·</span> <span class="c-amber2">lang it</span> <span class="c-muted">for Italian</span>`,
      nofile:f=>`<span class="c-rust">cat: ${escape(f)}: no such file</span> <span class="c-muted">(try ls)</span>`,
      nocat:`<span class="c-rust">cat: missing file — try</span> ls`,
      notfound:n=>`<span class="c-rust">${escape(n)}: command not found</span> <span class="c-muted">— type</span> <span class="c-amber2">help</span>`,
      langset:l=>`<span class="c-muted">language →</span> <span class="c-olive">${l}</span>`,
    },
    it: {
      whoami:
`<span class="c-bright">Valentino Paulon</span> — ricercatore di sicurezza e ingegnere
<span class="c-muted">// privilege escalation · sicurezza cloud-agent · vuln research sul codice</span>

Trovo bug <span class="c-amber">reali, sfruttabili, nuovi</span> e li segnalo responsabilmente.
CVE pubbliche a dimostrarlo. Costruisco anche prodotti AI e software full-stack.

<span class="c-olive">●</span> disponibile per lavoro — scrivi <span class="c-amber2">contact</span>`,
      research:
`<span class="c-muted"># lavoro pubblico selezionato — altro sotto coordinated disclosure</span>

<span class="tag">CVE</span> <span class="c-bright">CVE-2026-11837</span> — LPE in ansible.posix (chown che segue symlink)
   segnalata e accreditata da Red Hat
   <a href="https://access.redhat.com/security/cve/CVE-2026-11837" target="_blank" rel="noopener">access.redhat.com</a> · <a href="https://github.com/M8seven/cve-2026-11837-ansible-posix-authorized-key" target="_blank" rel="noopener">writeup</a>

<span class="tag embargo">0DAY</span> <span class="c-bright">privilege escalation in cloud-agent</span> — multipli
   CVE e 0-day aggiuntivi in cloud agent e tooling infra molto diffusi,
   <span class="c-muted">sotto coordinated disclosure; pubblicati quando escono i fix</span>

<span class="tag doi">DOI</span> <span class="c-bright">Captive Portal Security Analysis</span> — auth MAC debole
   <a href="https://doi.org/10.5281/zenodo.19061528" target="_blank" rel="noopener">10.5281/zenodo.19061528</a>

<span class="tag doi">DOI</span> <span class="c-bright">Cross-Provider Fact Mesh</span> — verifica claim multi-LLM
   <a href="https://doi.org/10.5281/zenodo.19061105" target="_blank" rel="noopener">10.5281/zenodo.19061105</a>

<span class="c-muted">prova:</span> <span class="c-amber2">cve</span> <span class="c-muted">per l'advisory completo</span>`,
      cve:
`<span class="c-amber">CVE-2026-11837</span>  <span class="c-muted">— pubblicata · credit: Valentino Paulon</span>
<dl class="kv">
  <dt>componente</dt><dd>ansible.posix · authorized_key</dd>
  <dt>classe</dt><dd>local privilege escalation (CWE-59)</dd>
  <dt>causa</dt><dd>chown che segue symlink su ~/.ssh/authorized_keys</dd>
  <dt>sibling di</dt><dd>CVE-2024-9902 (modulo user di ansible-core)</dd>
  <dt>vendor</dt><dd>Red Hat — credit accettato</dd>
  <dt>record</dt><dd><a href="https://access.redhat.com/security/cve/CVE-2026-11837" target="_blank" rel="noopener">access.redhat.com</a></dd>
</dl>`,
      services:
`<span class="c-amber">// SICUREZZA</span>
  · code review di sicurezza — Go / Python / C / C++
  · assessment cloud e infrastruttura
  · ricerca 0-day mirata sul tuo prodotto
  · variant-analysis sulle patch recenti

<span class="c-amber">// INGEGNERIA — ASSISTENZA IT</span>
  · sviluppo full-stack e mobile
  · integrazione AI / LLM
  · architettura tecnica e review
  · automazione e tooling

<span class="c-muted">da remoto · a progetto ·</span> scrivi <span class="c-amber2">contact</span>`,
      method:
`<span class="c-muted"># come lavoro</span>

Non lancio uno scanner e inoltro l'output. Leggo il codice e trovo i bug
di logica e memoria che i tool si perdono — quelli che prendono una CVE.

Ogni finding arriva con <span class="c-bright">file:line</span> esatto, codice citato, un modello
d'attacco realistico, un PoC funzionante e un fix concreto.

<span class="c-olive">verificato due volte prima di segnalare → 0 falsi positivi inviati.</span>`,
      contact:
`<span class="c-bright">Troviamo ciò che gli altri si sono persi.</span>

  email   <a href="mailto:valentino.paulon88@gmail.com">valentino.paulon88@gmail.com</a>
  github  <a href="https://github.com/M8seven" target="_blank" rel="noopener">github.com/M8seven</a>

<span class="c-muted">da remoto · security review · assessment cloud · vuln research · ingegneria</span>`,
      help:
`<span class="c-muted">comandi disponibili</span>
  <span class="c-amber2">whoami</span>     chi sono
  <span class="c-amber2">research</span>   CVE e paper pubblicati
  <span class="c-amber2">cve</span>        advisory completo per CVE-2026-11837
  <span class="c-amber2">services</span>   cosa offro
  <span class="c-amber2">method</span>     come lavoro
  <span class="c-amber2">contact</span>    contatti
  <span class="c-amber2">lang</span>       cambia lingua — <span class="c-muted">lang en | lang it</span>
  <span class="c-amber2">ls</span> / <span class="c-amber2">cat</span>   sfoglia i file · <span class="c-muted">es. cat cve-2026-11837.md</span>
  <span class="c-amber2">clear</span>      pulisci lo schermo
<span class="c-muted">suggerimento: Tab completa · ↑/↓ cronologia · o clicca un comando sotto</span>`,
      intro:`<span class="c-bright">Valentino Paulon</span> · ricercatore di sicurezza e ingegnere
<span class="c-muted">scrivi</span> <span class="c-amber2">help</span> <span class="c-muted">o clicca un comando qui sotto ·</span> <span class="c-amber2">lang en</span> <span class="c-muted">for English</span>`,
      nofile:f=>`<span class="c-rust">cat: ${escape(f)}: file inesistente</span> <span class="c-muted">(prova ls)</span>`,
      nocat:`<span class="c-rust">cat: manca il file — prova</span> ls`,
      notfound:n=>`<span class="c-rust">${escape(n)}: comando non trovato</span> <span class="c-muted">— scrivi</span> <span class="c-amber2">help</span>`,
      langset:l=>`<span class="c-muted">lingua →</span> <span class="c-olive">${l}</span>`,
    },
  };
  const t = k => T[lang][k];

  const FILE_KEYS = { 'about.txt':'whoami','services.txt':'services','contact.txt':'contact','method.txt':'method','cve-2026-11837.md':'cve' };

  /* ---------- commands ---------- */
  const COMMANDS = {
    help(){ block(t('help')); },
    whoami(){ block(t('whoami')); }, about(){ block(t('whoami')); },
    research(){ block(t('research')); },
    cve(){ block(t('cve')); },
    services(){ block(t('services')); },
    method(){ block(t('method')); },
    contact(){ block(t('contact')); },
    banner(){ out(`<pre class="banner">${BANNER}</pre>`); },
    ls(){ block(`<span class="c-olive">${Object.keys(FILE_KEYS).join('   ')}</span>`); },
    cat(args){ const f=args[0];
      if (!f) return out(t('nocat'));
      if (FILE_KEYS[f]) return block(t(FILE_KEYS[f]));
      out(t('nofile')(f)); },
    lang(args){ const l=(args[0]||'').toLowerCase();
      if (l==='en'||l==='it'){ setLang(l, true); }
      else out(`<span class="c-muted">lang:</span> <span class="c-olive">${lang}</span> <span class="c-muted">· usage: lang en | lang it</span>`); },
    id(){ out(`<span class="c-muted">uid=0(root) gid=0(root)</span> <span class="c-amber">— privilege escalation is the job</span>`); },
    sudo(){ out(`<span class="c-rust">visitor is not in the sudoers file.</span> <span class="c-muted">This incident will be reported. ;)</span>`); },
    exploit(){ block(
`<span class="c-muted">running exploit chain…</span>
  [*] enumerating symlinks            <span class="c-olive">ok</span>
  [*] racing chown(2)                 <span class="c-olive">ok</span>
  [+] root shell                      <span class="c-amber">got it</span>
<span class="c-muted">…responsibly disclosed, of course. type</span> <span class="c-amber2">research</span>`); },
    date(){ out(`<span class="c-muted">${new Date().toString()}</span>`); },
    clear(){ screen.innerHTML=''; },
  };
  const NAMES = Object.keys(COMMANDS);
  const COMPLETIONS = [...NAMES, ...Object.keys(FILE_KEYS)];

  function run(raw){
    const line = raw.trim();
    out(`<span class="cmd-echo"><span class="ps">visitor@vp</span><span class="pp">:~</span>$ ${escape(line)}</span>`);
    if (!line) return;
    const [name, ...args] = line.split(/\s+/);
    const fn = COMMANDS[name.toLowerCase()];
    if (fn) fn(args); else out(t('notfound')(name));
  }

  /* ---------- language ---------- */
  function setLang(l, announce){
    lang = l; document.documentElement.lang = l;
    [...langUI.querySelectorAll('button')].forEach(b => b.classList.toggle('on', b.dataset.l===l));
    if (announce){
      screen.innerHTML='';
      out(`<pre class="banner">${BANNER}</pre>`);
      out(t('langset')(l));
      block(t('intro'));
      input.focus(); placeCaret();
    }
  }
  langUI.querySelectorAll('button').forEach(b => b.addEventListener('click', () => setLang(b.dataset.l, true)));

  /* ---------- history ---------- */
  const hist = []; let hi = -1;

  /* ---------- caret tracking ---------- */
  const meas = document.createElement('canvas').getContext('2d');
  function placeCaret(){
    const cs = getComputedStyle(input); meas.font = `${cs.fontSize} ${cs.fontFamily}`;
    const w = meas.measureText(input.value.slice(0, input.selectionStart || 0)).width;
    caret.style.left = (input.offsetLeft + w) + 'px';
  }
  ['input','keyup','click','focus'].forEach(e => input.addEventListener(e, placeCaret));
  input.addEventListener('focus', () => caret.classList.add('show'));
  input.addEventListener('blur',  () => caret.classList.remove('show'));

  /* ---------- suggested chips ---------- */
  ['whoami','research','cve','services','method','contact'].forEach(cmd => {
    const b = document.createElement('button');
    b.innerHTML = `<span class="k">▸</span>${cmd}`;
    b.addEventListener('click', () => { input.focus(); typeAndRun(cmd); });
    hints.appendChild(b);
  });
  function typeAndRun(cmd){
    if (reduce){ run(cmd); resetInput(); return; }
    let i=0; input.value=''; placeCaret();
    const iv=setInterval(()=>{ input.value=cmd.slice(0,++i); placeCaret();
      if (i>=cmd.length){ clearInterval(iv); setTimeout(()=>{ run(cmd); resetInput(); }, 130); } }, 32);
  }
  const resetInput = () => { input.value=''; placeCaret(); };

  /* ---------- input handling ---------- */
  form.addEventListener('submit', e => { e.preventDefault();
    const v=input.value; if (v.trim()){ hist.push(v); hi=hist.length; } run(v); resetInput(); });
  input.addEventListener('keydown', e => {
    if (e.key==='ArrowUp'){ e.preventDefault(); if (hi>0){ input.value=hist[--hi]; placeCaret(); } }
    else if (e.key==='ArrowDown'){ e.preventDefault(); if (hi<hist.length-1){ input.value=hist[++hi]; } else { hi=hist.length; input.value=''; } placeCaret(); }
    else if (e.key==='Tab'){ e.preventDefault();
      const parts=input.value.split(/\s+/); const frag=parts[parts.length-1];
      const pool = (parts[0]==='cat' && parts.length>1) ? Object.keys(FILE_KEYS) : COMPLETIONS;
      const hit=pool.filter(c=>c.startsWith(frag));
      if (hit.length===1){ parts[parts.length-1]=hit[0]; input.value=parts.join(' '); placeCaret(); }
      else if (hit.length>1){ out(`<span class="c-muted">${hit.join('   ')}</span>`); }
    }
  });
  document.addEventListener('click', e => { if (!e.target.closest('a,button')) input.focus(); });

  /* clock */
  const clock=document.getElementById('clock');
  const tick=()=>{ clock.textContent=new Date().toTimeString().slice(0,8); };
  tick(); setInterval(tick,1000);

  /* ---------- boot ---------- */
  const BOOT = [
    ['vp-research — secure session','c-muted'],
    ['[0.00] init','ok'],['[0.21] mod variant-analysis.ko','ok'],
    ['[0.39] mount /research (ro)','ok'],['[0.60] arm cve-2026-11837 (symlink→chown)','armed'],
    ['[0.84] escalating privileges','root'],['[1.10] session ready','ok'],
  ];
  const STAT = { ok:'<span class="c-olive">ok</span>', armed:'<span class="c-amber2">armed</span>', root:'<span class="c-amber">root</span>' };
  function bootLine([txt,st]){ const pad='.'.repeat(Math.max(2,44-txt.length));
    out(st in STAT ? `<span class="c-muted">${txt}</span> <span class="c-muted">${pad}</span> ${STAT[st]}` : `<span class="${st}">${txt}</span>`); }
  function finish(){
    screen.innerHTML='';
    out(`<pre class="banner">${BANNER}</pre>`);
    block(t('intro')); input.focus(); placeCaret();
  }
  let booted=false;
  function boot(){ if (booted) return; booted=true;
    if (reduce){ BOOT.forEach(bootLine); setTimeout(finish,200); return; }
    let i=0; (function step(){ if (i<BOOT.length){ bootLine(BOOT[i++]); setTimeout(step,150+Math.random()*120); } else setTimeout(finish,360); })();
  }
  const skip=()=>{ if (!screen.querySelector('.banner')) finish(); };
  addEventListener('keydown', e => { if (!screen.querySelector('.banner')){ e.preventDefault(); skip(); } });
  screen.addEventListener('click', skip);

  boot();
})();
