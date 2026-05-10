//beautification
lucide.createIcons();

const refBtn=document.getElementById('refBtn');

document.getElementById('refBtn').addEventListener('click',()=>{
    const icon=refBtn.querySelector('svg');
    icon.classList.remove('spinning');
    void icon.offsetWidth;
    icon.classList.add('spinning');
    icon.addEventListener('animationend',()=>icon.classList.remove('spinning'),{once:true});
    const frame=document.getElementById('browserFrame');
    if (frame.style.display!=='none') {
        const loader=document.getElementById('bloader');
        frame.classList.remove('loaded');
        loader.classList.add('active');
        const currentUrl=frame.dataset.currentUrl;
        if (currentUrl) {
            frame.src=scramjet.encodeUrl(currentUrl);
        } else {
            frame.src=frame.src;
        }
        frame.onload=()=>{
            loader.classList.remove('active');
            frame.classList.add('loaded');
            startURLP(frame);
        }
    }
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

const tooltip=document.createElement('div');
tooltip.className='sb-tooltip';
document.body.appendChild(tooltip);
let tooltipT=null;
document.querySelectorAll('.sb-btn').forEach(btn=>{
    btn.addEventListener('mouseenter',()=>{
        const title=btn.getAttribute('title');
        if (!title) return;
        btn.setAttribute('data-title',title);
        btn.removeAttribute('title');
        const rect=btn.getBoundingClientRect();
        tooltip.classList.remove('visible');
        tooltip.textContent=title;
        tooltip.style.top=(rect.top+rect.height/2)+'px';
        tooltip.style.left=(rect.right+15)+'px';
        clearTimeout(tooltipT);
        tooltipT=setTimeout(()=>{
            tooltip.classList.add('visible');
        },10);
    });
    btn.addEventListener('mouseleave',()=>{
        clearTimeout(tooltipT);
        tooltip.classList.remove('visible');
        const title=btn.getAttribute('data-title');
        if (title) btn.setAttribute('title',title);
    });
});

//scram
const connection = new BareMux.BareMuxConnection("/browse/baremux/worker.js");
connection.setTransport("/browse/libcurl/index.mjs",[{websocket:"wss://wisp.classroom.lat/"}]);

const {ScramjetController} = $scramjetLoadController();
const scramjet=new ScramjetController({
    files:{
        all:"/browse/scram/scramjet.all.js",
        wasm:"/browse/scram/scramjet.wasm.wasm",
        sync:"/browse/scram/scramjet.sync.js"
    },
    prefix:"/browse/go/"
});
scramjet.init();

//browsing
function nav(input) {
    let url=input.trim();
    if (!url) return;
    const frame=document.getElementById('browserFrame');
    const home=document.querySelector('.main');
    const loader=document.getElementById('bloader');

    if (!url.includes(".")) {
        url="https://duckduckgo.com/?q="+encodeURIComponent(url);
    } else if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url="https://"+url;
    }

    home.style.display='none';
    frame.classList.remove('loaded');
    frame.style.display='block';
    loader.classList.add('active');

    frame.src=scramjet.encodeUrl(url);
    const activeTab=document.querySelector('.tab.active');
    const tabId=activeTab.dataset.tabId;
    tabs[tabId]={url,frame};
    activeTab.querySelector('.tab-tl').textContent=new URL(url).hostname;
    setUrl(url);
    frame.onload=()=>{
        loader.classList.remove('active');
        frame.classList.add('loaded');
        startURLP(frame);
    };
}

function setUrl(url) {
    urlInput.value=url;
    urlDisplay.innerHTML=formatUrl(url);
    urlDisplay.style.display='block';
    urlInput.style.display='none';
}

let urlPollInt=null;
let lastHref='';

function startURLP(frame) {
    if (urlPollInt) clearInterval(urlPollInt);
    lastHref='';
    let firstPoll=true;
    urlPollInt=setInterval(()=>{
        try {
            const href=frame.contentWindow.location.href;
            if (href && href!==lastHref && href!=='about:blank') {
                const oldDecoded=(()=>{try{return scramjet.decodeUrl(lastHref);}catch(e){return lastHref;}})();
                const newDecoded=(()=>{try{return scramjet.decodeUrl(href);}catch(e){return href;}})();
                const oldPath=(()=>{try{return new URL(oldDecoded).pathname;}catch(e){return oldDecoded;}})();
                const newPath=(()=>{try{return new URL(newDecoded).pathname;}catch(e){return newDecoded;}})();
                const oldHost=(()=>{try{return new URL(oldDecoded).hostname;}catch(e){return '';}})();
                const newHost=(()=>{try{return new URL(newDecoded).hostname;}catch(e){return '';}})();
                const isNewPage=!firstPoll&&(newHost!==oldHost||newPath!==oldPath);
                lastHref=href;
                firstPoll=false;
                if (isNewPage) {
                    const loader=document.getElementById('bloader');
                    if (urlPollInt) clearInterval(urlPollInt);
                    frame.classList.remove('loaded');
                    loader.classList.add('active');
                    setTimeout(()=>{
                        loader.classList.remove('active');
                        frame.classList.add('loaded');
                    },1500);
                }
            }
            const decoded=scramjet.decodeUrl(href);
            if (decoded&&decoded!==urlInput.value) {
                setUrl(decoded);
                frame.dataset.currentUrl=decoded;
                const activeTab=document.querySelector('.tab.active');
                if (activeTab) {
                    try {
                        activeTab.querySelector('.tab-tl').textContent=new URL(decoded).hostname;
                        tabs[activeTab.dataset.tabId].url=decoded;
                    } catch(e){}
                }
            }
        } catch(e){}
    },300);
}

document.querySelector(".url-input").addEventListener("keydown",e=>{
    if (e.key==='Enter') nav(e.target.value);
});

document.querySelector(".main-search-input").addEventListener("keydown",e=>{
    if (e.key==='Enter') nav(e.target.value);
});

//url formatting
const urlInput=document.querySelector('.url-input');
const urlContainer=document.querySelector('.url-intainer');
const urlDisplay=document.createElement('div');
urlDisplay.className='url-display';
urlDisplay.style.display='none';
urlContainer.appendChild(urlDisplay);

urlDisplay.addEventListener('click',()=>{
    urlDisplay.style.display='none';
    urlInput.style.display='block';
    urlInput.focus();
    urlInput.select();
});

urlInput.addEventListener('blur',()=>{
    if (urlInput.value) {
        urlDisplay.innerHTML=formatUrl(urlInput.value);
        urlDisplay.style.display='block';
        urlInput.style.display='none';
    }
});

function formatUrl(url) {
    try {
        const urlObj=new URL(url);
        return `<span class="url-proto">${urlObj.protocol}//</span><span class="url-domain">${urlObj.hostname}</span><span class="url-path">${urlObj.pathname}${urlObj.search}${urlObj.hash}</span>`;
    } catch (e) {
        return `<span class="url-domain">${url}</span>`;
    }
}

//btn handling
document.getElementById('backBtn').addEventListener('click',()=>{
    try {
        document.getElementById('browserFrame').contentWindow.history.back();
    } catch (e) {}
});

document.getElementById('fwBtn').addEventListener('click',()=>{
    try {
        document.getElementById('browserFrame').contentWindow.history.forward();
    } catch (e) {}
});

//tab handling
let tabs={};
let tabCount=1;

tabs[1] = {
    url:'',
    frame:null
};

function createTab(url=null) {
    tabCount++;
    const tabBar=document.getElementById('tabBar');
    const ntBtn=document.getElementById('ntBtn');
    document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
    const tab=document.createElement('div');
    tab.className='tab active';
    tab.dataset.tabId=tabCount;
    tab.innerHTML=`
    <div class="tab-fav"><i data-lucide="globe"></i></div>
    <span class="tab-tl">New Tab</span>
    <div class="tab-cl"><i data-lucide="x"></i></div>`;
    tabBar.insertBefore(tab,ntBtn);
    lucide.createIcons();
    tabs[tabCount]={url:'',frame:null};
    addTabListeners(tab);
    swTab(tabCount);
    if (url) nav(url);
}

function swTab(tabId) {
    document.querySelectorAll('.bframe').forEach(f=>f.style.display='none');
    if (urlPollInt) clearInterval(urlPollInt);
    const tab=tabs[tabId];
    const home=document.querySelector('.main');
    if (tab.frame) {
        tab.frame.style.display='block';
        home.style.display='none';
        setUrl(tab.url);
        startURLP(tab.frame);
    } else {
        home.style.display='';
        urlInput.value='';
        urlDisplay.style.display='none';
        urlInput.style.display='block';
    }
}

function closeTab(tabId) {
    if (document.querySelectorAll('.tab').length<=1) return;
    const tab=document.querySelector(`.tab[data-tab-id="${tabId}"]`);
    const wasActive=tab.classList.contains('active');
    tab.style.transition='min-width 0.2s ease, max-width 0.2s ease, opacity 0.2s ease, padding 0.2s ease';
    tab.style.minWidth='0';
    tab.style.maxWidth='0';
    tab.style.opacity='0';
    tab.style.padding='0';
    tab.style.overflow='hidden';
    setTimeout(()=>{
        if (tabs[tabId]?.frame) tabs[tabId].frame.remove();
        delete tabs[tabId];
        tab.remove();
        if (wasActive) {
            const rem=document.querySelector('.tab');
            if (rem) {
                rem.classList.add('active');
                swTab(rem.dataset.tabId);
            }
        }
    },200);
}

function addTabListeners(tab) {
    tab.addEventListener('click',(e)=>{
        if (e.target.closest('.tab-cl')) {
            closeTab(tab.dataset.tabId);
        } else {
            document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
            tab.classList.add('active');
            swTab(tab.dataset.tabId);
        }
    });
}

document.getElementById('ntBtn').addEventListener('click',()=>createTab());
addTabListeners(document.querySelector('.tab[data-tab-id="1"]'));