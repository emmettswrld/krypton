//beautification
lucide.createIcons();

const refBtn=document.getElementById('refBtn');

document.getElementById('refBtn').addEventListener('click',()=>{
    const icon=refBtn.querySelector('svg');
    icon.classList.remove('spinning');
    void icon.offsetWidth;
    icon.classList.add('spinning');
    icon.addEventListener('animationend',()=>icon.classList.remove('spinning'),{once:true});
});

const tl='krypton';
const mText=document.getElementById('mainTl');
[...tl].forEach((char,i)=>{
    const span=document.createElement('span');
    span.className='main-char';
    span.textContent=char;
    span.style.animationDelay=`${i*0.06}s`;
    mText.appendChild(span);
});

const taglines=[
    'skdingindinfpodinfoingv',
    'wow.',
    'bradar what is this?',
    'you got games on yo phone'
];

const tagEl=document.getElementById('tagline');
let tagIdx=0;

function showTag() {
    const inner=document.createElement('span');
    inner.className='tagline-inner';
    inner.textContent=taglines[tagIdx];
    tagEl.innerHTML='';
    tagEl.appendChild(inner);
    requestAnimationFrame(()=>{
        requestAnimationFrame(()=>inner.classList.add('visible'));
    });
    tagIdx=(tagIdx+1)%taglines.length;
}

showTag();
setInterval(()=>{
    const inner=tagEl.querySelector('.tagline-inner');
    inner.classList.add('exit');
    inner.addEventListener('transitionend',showTag,{once:true});
},3000);