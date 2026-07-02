lucide.createIcons();

const chatBtn=document.getElementById('chatBtn');
const chatDr=document.getElementById('chatDr');
const chatChv=document.getElementById('chatChv');
const overlay=document.getElementById('overlay');
const ncBtn=document.getElementById('ncBtn');

chatBtn.addEventListener('click',()=>{
    chatDr.classList.toggle('open');
    chatChv.classList.toggle('open');
    overlay.classList.toggle('active');
});

overlay.addEventListener('click',()=>{
    chatDr.classList.remove('open');
    chatChv.classList.remove('open');
    overlay.classList.remove('active');
});

document.querySelectorAll('.chat-opt').forEach(opt=>{
    opt.addEventListener('click',()=>{
        document.querySelectorAll('.chat-opt').forEach(o=>o.classList.remove('active'));
        opt.classList.add('active');
        document.getElementById('chatLabel').textContent=opt.querySelector('span').textContent;
        chatDr.classList.remove('open');
        chatChv.classList.remove('open');
        overlay.classList.remove('active');
    });
});

ncBtn.addEventListener('click',()=>{
    console.log('nc pressed');
    chatDr.classList.remove('open');
    chatChv.classList.remove('open');
    overlay.classList.remove('active');
});

// ai functionality
const GEMINI_MODEL="gemini-3.5-flash";
const textInput=document.getElementById('textInput');
const contentArea=document.getElementById('contentArea');

async function askGemini(prompt) {
    const res=await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
        {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'x-goog-api-key':GEMINI_API_KEY
            },
            body:JSON.stringify({
                contents:[{parts:[{text:prompt}]}]
            })
        }
    );
    if (!res.ok) {
        const err=await res.text();
        throw new Error(`gemini error ${res.status}: ${err}`);
    }
    const data=await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text??"(no response)";
}

function appendMsg(role,text) {
    const msg=document.createElement('div');
    msg.className=`msg msg-${role}`;
    msg.textContent=text;
    contentArea.appendChild(msg);
    contentArea.scrollTop=contentArea.scrollHeight;
}

async function handleSend() {
    const prompt=textInput.value.trim();
    if (!prompt) return;
    const grid=document.querySelector('.example-grid');
    if (grid) grid.remove();
    contentArea.classList.add('chat-mode');
    appendMsg('user',prompt);
    textInput.value='';
    sendBtn.disabled=true;
    appendMsg('ai','Thinking...');
    const thinkingEl=contentArea.lastElementChild;
    try {
        const reply=await askGemini(prompt);
        thinkingEl.textContent=reply;
    } catch (err) {
        thinkingEl.textContent='Uh oh, something went wrong: '+err.message;
        thinkingEl.classList.add('msg-error');
    } finally {
        sendBtn.disabled=false;
    }
}

sendBtn.addEventListener('click',handleSend);
textInput.addEventListener('keydown',(e)=>{
    if (e.key==='Enter') handleSend();
});