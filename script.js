const menuButton=document.querySelector(".menu-toggle");
const nav=document.querySelector(".nav");

if(menuButton&&nav){
  menuButton.addEventListener("click",()=>{
    const opened=nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded",String(opened));
    menuButton.setAttribute("aria-label",opened?"Close navigation":"Open navigation");
  });
  nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{
    nav.classList.remove("open");
    menuButton.setAttribute("aria-expanded","false");
    menuButton.setAttribute("aria-label","Open navigation");
  }));
}

// Reveal-on-scroll, with a graceful fallback for older browsers.
const revealItems=document.querySelectorAll(".reveal");
if("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches){
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },{threshold:.12});
  revealItems.forEach(el=>observer.observe(el));
}else{
  revealItems.forEach(el=>el.classList.add("visible"));
}

// Service department filters.
const filterButtons=document.querySelectorAll("[data-filter]");
const serviceCards=document.querySelectorAll(".service-card[data-department]");
const filterStatus=document.getElementById("filterStatus");
filterButtons.forEach(button=>button.addEventListener("click",()=>{
  const filter=button.dataset.filter;
  let visible=0;
  filterButtons.forEach(item=>{
    const active=item===button;
    item.classList.toggle("is-active",active);
    item.setAttribute("aria-pressed",String(active));
  });
  serviceCards.forEach(card=>{
    const show=filter==="all"||card.dataset.department===filter;
    card.classList.toggle("is-filtered-out",!show);
    if(show) visible++;
  });
  if(filterStatus) filterStatus.textContent=filter==="all"?"Showing all 11 services":`Showing ${visible} ${visible===1?"service":"services"}`;
}));

// Selecting a service card pre-fills the enquiry form.
document.querySelectorAll("[data-service]").forEach(link=>link.addEventListener("click",()=>{
  const select=document.getElementById("serviceSelect");
  if(select) select.value=link.dataset.service;
}));

// WhatsApp enquiry: the visitor reviews and sends the prefilled message.
document.getElementById("enquiryForm")?.addEventListener("submit",event=>{
  event.preventDefault();
  const form=new FormData(event.currentTarget);
  const name=form.get("name")||"";
  const phone=form.get("phone")||"";
  const service=form.get("service")||"";
  const message=form.get("message")||"";
  const textMessage=[
    "Hello AZ Digital Solutions,",
    "",
    "I would like to make an enquiry.",
    "",
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Service: ${service}`,
    `Requirement: ${message}`,
    "",
    "Please guide me on the next steps."
  ].join("\n");
  window.open(`https://wa.me/917564002394?text=${encodeURIComponent(textMessage)}`,"_blank","noopener");
});

// Scroll progress and back-to-top affordance.
const progress=document.getElementById("scrollProgress");
const backToTop=document.querySelector(".back-to-top");
let scrollTicking=false;
const updateScrollUI=()=>{
  const maxScroll=document.documentElement.scrollHeight-window.innerHeight;
  const progressValue=maxScroll>0?(window.scrollY/maxScroll)*100:0;
  if(progress) progress.style.width=`${Math.min(100,Math.max(0,progressValue))}%`;
  if(backToTop) backToTop.classList.toggle("visible",window.scrollY>650);
  scrollTicking=false;
};
window.addEventListener("scroll",()=>{
  if(!scrollTicking){
    window.requestAnimationFrame(updateScrollUI);
    scrollTicking=true;
  }
},{passive:true});
updateScrollUI();

const year=document.getElementById("year");
if(year) year.textContent=new Date().getFullYear();
