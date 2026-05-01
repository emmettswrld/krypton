//beautification
lucide.createIcons();

VANTA.DOTS({
    el: '#home',
    color: 0x1e3a5f,
    color2: 0x93c5fd,
    backgroundColor: 0x101214,
    size: 3.5,
    spacing: 28,
    showLines: false,
});

//functionality
//event handling for navbar
document.getElementById('navbar').addEventListener('click',e=>{
    const btn=e.target.closest('.nb-btn');
    if (!btn) return;
    document.querySelectorAll('.nb-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
});

document.querySelectorAll('.nb-btn').forEach(btn=>{
    btn.addEventListener('mousedown',()=>btn.classList.add('pressing'));
    btn.addEventListener('mouseup',()=>btn.classList.remove('pressing'));
    btn.addEventListener('mouseleave',()=>btn.classList.remove('pressing'));
});

//tagline carousel thing
const strings=[
    'skidnginsng',
    'adoitnvportuinworeiutnpcoewiurvtnpwe',
    'idk'
];

let index=0;
const el=document.querySelector('.tagline');

function nextP(){
    el.classList.add('slide-out');
    setTimeout(()=>{
        index=(index+1)%strings.length;
        el.textContent=strings[index];
        el.classList.remove('slide-out');
        el.classList.add('slide-in');
        requestAnimationFrame(()=>{
            requestAnimationFrame(()=>{
                el.classList.remove('slide-in');
            });
        });
    },400);
}

el.textContent=strings[0];
setInterval(nextP,3000);

//text caret
const searchEl=document.getElementById('search');
const oCaret=document.getElementById('ocaret');

let realX=0;
let currentX=0;
let animating=false;

function getCaretX() {
    const sel=window.getSelection();
    if (!sel||sel.rangeCount===0) return null;
    const range=sel.getRangeAt(0).cloneRange();
    range.collapse(true);
    const rect= range.getClientRects()[0];
    if (!rect) {
        const wrap=searchEl.getBoundingClientRect();
        return wrap.left+38;
    }
    return rect.left;
}

function updateCaret() {
    const x=getCaretX();
    if (x!==null) realX=x;
}

function lerp(a,b,t) { //lol larp rofl rofl
    return a + (b-a)*t;
}

function animateCaret() {
    if (!animating) return;
    currentX=lerp(currentX,realX,0.18);
    const wrapRect=searchEl.getBoundingClientRect();
    oCaret.style.left=(currentX-wrapRect.left)+'px';
    if (Math.abs(currentX-realX)>0.5) {
        requestAnimationFrame(animateCaret);
    }
}

searchEl.addEventListener('focus',()=>{
    oCaret.style.opacity='1';
    animating=true;
    requestAnimationFrame(()=>{
        updateCaret();
        currentX=realX;
        oCaret.style.left=(currentX-searchEl.getBoundingClientRect().left)+'px';
        animateCaret();
    });
});

searchEl.addEventListener('blur',()=>{
    oCaret.style.opacity='0';
    animating=false;
});

searchEl.addEventListener('mouseup',()=>{
    updateCaret();
    currentX=realX;
});

searchEl.addEventListener('input',()=>{
    updateCaret();
    requestAnimationFrame(animateCaret);
});

searchEl.classList.add('empty');

searchEl.addEventListener('input',()=>{
    if (searchEl.textContent.length>0) {
        searchEl.classList.remove('empty');
    } else {
        searchEl.classList.add('empty');
        searchEl.innerHTML='';
    }
    updateCaret();
    requestAnimationFrame(animateCaret);
});

const searchBtn=document.querySelector('.search-btn');
searchBtn.classList.add('disabled');

searchEl.addEventListener('input',()=>{
    if (searchEl.textContent.length>0) {
        searchBtn.classList.remove('disabled');
    } else {
        searchBtn.classList.add('disabled');
    }
});

//control pnl handling
const ctrlBtn=document.getElementById('ctrlBtn');
const ctrlPanel=document.createElement('div');
ctrlPanel.className='ctrl-panel';
ctrlPanel.innerHTML=`
<div class="ctrl-panel-cont">
    <div class="qs-grid">
        <button class="qs-tile active">
            <i data-lucide="a-large-small"></i>
            <div class="qs-text">
                <span class="qs-label">test</span>
                <span class="qs-sub">test text</span>
            </div>
        </button>

        <button class="qs-tile">
            <i data-lucide="a-large-small"></i>
            <div class="qs-text">
                <span class="qs-label">test</span>
                <span class="qs-sub">test inactive</span>
            </div>
        </button>
    </div>
</div>`;
document.body.appendChild(ctrlPanel);
lucide.createIcons();

ctrlBtn.addEventListener('click',(e)=>{
    e.stopPropagation();
    ctrlPanel.classList.toggle('open');
    ctrlBtn.classList.toggle('active');
});

document.addEventListener('click',(e)=>{
    if (!ctrlPanel.contains(e.target)&&!ctrlBtn.contains(e.target)&&ctrlPanel.classList.contains('open')) {
        ctrlPanel.classList.remove('open');
        ctrlBtn.classList.remove('active');
    }
});