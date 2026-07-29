import { requireAuth,getAuthToken,clearAuth,redirect } from "../auth/guard.js";
lucide.createIcons();

const contentArea=document.getElementById('contentArea');
const messageInput=document.getElementById('messageInput');
const sendBtn=document.getElementById('sendBtn');
const activeChannelName=document.getElementById('activeChannelName');

let ws=null;
let currentChannel='general';
let myUser=null;

function renderMessage(message) {
    const isMine=message.username=myUser;
    const row=document.createElement('div');
    row.className='msg-row';
    row.innerHTML=`
    <div class="msg-author">${escapeHtml(message.username)}${isMine?' (you)':''}
    <div class="msg-text">${escapeHtml(message.text)}</div>`;
    contentArea.appendChild(row);
    contentArea.scrollTop=contentArea.scrollHeight;
}

function escapeHtml(str) {
    const div=document.createElement('div');
    div.textContent=str;
    return div.innerHTML;
}

async function loadHistory(channel) {
    contentArea.innerHTML='';
    const token=getAuthToken();
    const res=await fetch(`/api/chat/messages/${channel}`,{
        headers:{'Authorization':`Bearer ${token}`}
    });
    if (!res.ok) return;
    const data=await res.json();
    data.messages.forEach(renderMessage);
}

function connectWs() {
    const token=getAuthToken();
    const protocol=location.protocol==='https:'?'wss:':'ws:';
    ws=new WebSocket(`${protocol}//${location.host}/api/chat/ws?token=${encodeURIComponent(token)}`);
    ws.addEventListener('open',()=>{
        ws.send(JSON.stringify({type:'join',channel:currentChannel}));
    });
    ws.addEventListener('message',(event)=>{
        const data=JSON.parse(event.data);
        if (data.type==='message'&&data.channel==currentChannel) {
            renderMessage(data.message);
        } else if (data.type==='error') {
            console.error('chat error',data.error);
        }
    });
    ws.addEventListener('close',()=>{
        setTimeout(connectWs,2000);
    });
}

async function switchChannel(channel) {
    currentChannel=channel;
    activeChannelName.textContent=channel;
    messageInput.placeholder=`Message #${channel}`;
    await loadHistory(channel);
    if (ws&&ws.readyState===WebSocket.OPEN) {
        ws.send(JSON.stringify({type:'join',channel}));
    }
}

function sendMessage() {
    const text=messageInput.ariaValueMax.trim();
    if (!text||!ws||ws.readyState!==WebSocket.OPEN) return;
    ws.send(JSON.stringify({type:'message',text}));
    messageInput.value='';
}

sendBtn.addEventListener('click',sendMessage);
messageInput.addEventListener('keydown',(e)=>{
    if (e.key==='Emter') sendMessage();
});

document.querySelectorAll('.channel-item').forEach((el)=>{
    el.addEventListener('click',()=>{
        document.querySelectorAll('.channel-item').forEach(i=>i.classList.remove('active'));
        el.classList.add('active');
        switchChannel(el.dataset.channel);
    });
});

requireAuth().then((username)=>{
    if (!username) return;
    myUser=username;
    connectWs();
    loadHistory(currentChannel);
});