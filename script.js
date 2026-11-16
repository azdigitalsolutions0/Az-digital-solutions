const menuButton=document.querySelector(".menu-toggle");
const nav=document.querySelector(".nav");
if(menuButton&&nav){menuButton.addEventListener("click",()=>{const opened=nav.classList.toggle("open");menuButton.setAttribute("aria-expanded",String(opened));menuButton.setAttribute("aria-label",opened?"Close navigation":"Open navigation");});nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");menuButton.setAttribute("aria-expanded","false");}));}
const revealItems=document.querySelectorAll(".reveal");
if("IntersectionObserver" in window&&!window.matchMedia("(prefers-reduced-motion: reduce)").matches){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("visible");observer.unobserve(entry.target);}}),{threshold:.12});revealItems.forEach(el=>observer.observe(el));}else{revealItems.forEach(el=>el.classList.add("visible"));}
// Portfolio category filtering
const projectFilters=document.querySelectorAll("[data-project-filter]");
const projectCards=document.querySelectorAll("[data-project-type]");
projectFilters.forEach(button=>button.addEventListener("click",()=>{const type=button.dataset.projectFilter;projectFilters.forEach(b=>{const active=b===button;b.classList.toggle("active",active);b.setAttribute("aria-pressed",String(active));});projectCards.forEach(card=>card.classList.toggle("is-hidden",type!=="all"&&card.dataset.projectType!==type));}));
// Service selection shortcuts
 document.querySelectorAll("[data-service]").forEach(link=>link.addEventListener("click",()=>{const select=document.getElementById("serviceSelect");if(select)select.value=link.dataset.service;}));
// WhatsApp enquiry form: visitor reviews and sends the prefilled message.
document.getElementById("enquiryForm")?.addEventListener("submit",event=>{event.preventDefault();const form=new FormData(event.currentTarget);const name=form.get("name")||"";const phone=form.get("phone")||"";const service=form.get("service")||"";const message=form.get("message")||"";const text=["Hello AZ Digital Solutions,","","I would like to make an enquiry.","",`Name: ${name}`,`Phone: ${phone}`,`Service: ${service}`,`Requirement: ${message}`,"","Please guide me on the next steps."].join("\n");window.open(`https://wa.me/917564002394?text=${encodeURIComponent(text)}`,"_blank","noopener");});
const progress=document.getElementById("scrollProgress");const topButton=document.querySelector(".back-to-top");let ticking=false;
function updateScroll(){const max=document.documentElement.scrollHeight-window.innerHeight;const percent=max>0?window.scrollY/max*100:0;if(progress)progress.style.width=`${Math.max(0,Math.min(100,percent))}%`;if(topButton)topButton.classList.toggle("visible",window.scrollY>600);ticking=false;}
window.addEventListener("scroll",()=>{if(!ticking){requestAnimationFrame(updateScroll);ticking=true;}},{passive:true});updateScroll();
const year=document.getElementById("year");if(year)year.textContent=new Date().getFullYear();
