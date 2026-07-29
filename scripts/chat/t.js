import { requireAuth } from "../auth/guard.js";
lucide.createIcons();

requireAuth().then((username)=>{
    if (!username) return;
});