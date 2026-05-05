lucide.createIcons();

const refBtn=document.getElementById('refBtn');

document.getElementById('refBtn').addEventListener('click',()=>{
    const icon=refBtn.querySelector('svg');
    icon.classList.remove('spinning');
    void icon.offsetWidth;
    icon.classList.add('spinning');
    icon.addEventListener('animationend',()=>icon.classList.remove('spinning'),{once:true});
});