lucide.createIcons();

const gameGrid=document.getElementById('gameGrid');
const st=document.getElementById('st');

let page=1;
let loading=false;
let exhausted=false;
const PAGE_SIZE=24;

(async ()=>{
    await Lumin.init({
        headless:true,
        onReady:()=>console.log('lumin ready'),
        onError:()=>console.error('lumin error',err)
    });
    await loadMore();
    if (!exhausted) await loadMore();
    const observer=new IntersectionObserver(async (entries)=>{
        if (entries[0].isIntersecting && !loading && !exhausted) {
            await loadMore();
        }
    },{threshold:0.1});
    observer.observe(st);
})();

const cardObserver=new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
        const img=entry.target.querySelector('img');
        if (entry.isIntersecting) {
            entry.target.style.visibility='visible';
            if (img&&img.dataset.src) {
                img.src=img.dataset.src;
                delete img.dataset.src;
            }
        } else {
            entry.target.style.visibility='hidden';
            if (img&&img.src) {
                img.dataset.src=img.src;
                img.src='';
            }
        }
    });
},{rootMargin:'200px'});

async function loadMore() {
    loading=true;
    const res=await Lumin.getGames({page,limit:PAGE_SIZE,q:currentQuery});
    if (!res.games.length||page>=res.pages) exhausted=true;
    const imgUrls=await Promise.all(
        res.games.map(g=>Lumin.getImageUrl(g.image_token))
    );
    res.games.forEach((game,i)=>{
        const card=document.createElement('div');
        card.className='game-card';
        card.innerHTML=`
        <img src="${imgUrls[i]}" alt="${game.name}" loading="lazy">
        <div class="game-card-nm">${game.name}</div>`;
        card.onclick=()=>launchGame(game.id);
        cardObserver.observe(card);
        gameGrid.insertBefore(card,st);
    });
    const loader=document.getElementById('gridLd');
    if (loader&&gameGrid.querySelectorAll('.game-card').length>0) {
        loader.remove();
    }
    page++;
    loading=false;
    syncGR();
}

function launchGame(id) {
    Lumin.loadGame(id);
    const wfp=setInterval(()=>{
        const flyout=document.querySelector('.lumin-player-flyout');
        if (flyout) {
            clearInterval(wfp);
            flyout.style.display='none';
            const closeBtn=document.createElement('button');
            closeBtn.id='customClose';
            closeBtn.innerHTML='<i data-lucide="x" width="18" height="18"></i>';
            closeBtn.style.cssText=`
            position: fixed;
            top: 14px;
            left: 14px;
            z-index: 9999999;
            width: 32px;
            height: 32px;
            background: #080808;
            border: 1px solid #2a2a2a;
            border-radius: 50%;
            color: #808080;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: background 0.2s ease, border-color 0.2s ease;`;
            closeBtn.addEventListener('mouseenter', () => {
                closeBtn.style.background = '#141414';
                closeBtn.style.borderColor = '#3a3a3a';
            });
            closeBtn.addEventListener('mouseleave', () => {
                closeBtn.style.background = '#080808';
                closeBtn.style.borderColor = '#2a2a2a';
            });
            closeBtn.addEventListener('click',()=>{
                const luminClose=document.querySelector('.lumin-player-close');
                if (luminClose) luminClose.click();
                closeBtn.remove();
            });
            document.body.appendChild(closeBtn);
            lucide.createIcons();
        }
    },100);
}

function syncGR() {
    const grid=document.getElementById('gameGrid');
    const colWidth=grid.querySelector('.game-card')?.offsetWidth;
    if (colWidth) grid.style.gridAutoRows=colWidth+'px';
}

let debounce;
let currentQuery='';
document.getElementById('searchInput').addEventListener('input',(e)=>{
    clearTimeout(debounce);
    debounce=setTimeout(()=>{
        currentQuery=e.target.value.trim();
        page=1;
        exhausted=false;
        gameGrid.querySelectorAll('.game-card').forEach(c=>c.remove());
        loadMore();
    },300);
});