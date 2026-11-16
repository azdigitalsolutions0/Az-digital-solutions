const menuButton=document.querySelector(".menu-toggle");const nav=document.querySelector(".nav");if(menuButton&&nav){menuButton.addEventListener("click",()=>{const opened=nav.classList.toggle("open");menuButton.setAttribute("aria-expanded",String(opened));});nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");menuButton.setAttribute("aria-expanded","false");}));}
const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("visible");observer.unobserve(entry.target);}});},{threshold:.12});document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));
document.querySelectorAll("[data-service]").forEach(link=>link.addEventListener("click",()=>{const select=document.getElementById("serviceSelect");if(select)select.value=link.dataset.service;}));
document.getElementById("enquiryForm")?.addEventListener("submit",event=>{event.preventDefault();const form=new FormData(event.currentTarget);const name=form.get("name")||"";const phone=form.get("phone")||"";const service=form.get("service")||"";const message=form.get("message")||"";const body=`Hello AZ Digital Solutions,%0A%0AI would like to make an enquiry.%0A%0AName: ${encodeURIComponent(name)}%0APhone: ${encodeURIComponent(phone)}%0AService: ${encodeURIComponent(service)}%0ARequirement: ${encodeURIComponent(message)}%0A%0APlease guide me on the next steps.`;window.open(`https://wa.me/917564002394?text=${body}`,"_blank","noopener");});
document.getElementById("year").textContent=new Date().getFullYear();
// Portfolio concept filters (60 original CSS-rendered showcase previews).
const projectFilters=document.querySelectorAll("[data-project-filter]");
const projectCards=document.querySelectorAll(".project-card[data-project-category]");
projectFilters.forEach(button=>button.addEventListener("click",()=>{
  const selected=button.dataset.projectFilter;
  projectFilters.forEach(item=>{
    const active=item===button;
    item.classList.toggle("active",active);
    item.setAttribute("aria-pressed",String(active));
  });
  projectCards.forEach(card=>{
    const show=selected==="all"||card.dataset.projectCategory===selected;
    card.classList.toggle("is-hidden",!show);
  });
}));
