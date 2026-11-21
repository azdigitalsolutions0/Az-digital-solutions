const menuButton=document.querySelector(".menu-toggle");const nav=document.querySelector(".nav");if(menuButton&&nav){menuButton.addEventListener("click",()=>{const opened=nav.classList.toggle("open");menuButton.setAttribute("aria-expanded",String(opened));});nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");menuButton.setAttribute("aria-expanded","false");}));}
const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("visible");observer.unobserve(entry.target);}});},{threshold:.12});document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));
document.querySelectorAll("[data-service]").forEach(link=>link.addEventListener("click",()=>{const select=document.getElementById("serviceSelect");if(select)select.value=link.dataset.service;}));
document.getElementById("enquiryForm")?.addEventListener("submit",event=>{event.preventDefault();const form=new FormData(event.currentTarget);const name=form.get("name")||"";const phone=form.get("phone")||"";const service=form.get("service")||"";const message=form.get("message")||"";const body=`Hello AZ Digital Solutions,%0A%0AI would like to make an enquiry.%0A%0AName: ${encodeURIComponent(name)}%0APhone: ${encodeURIComponent(phone)}%0AService: ${encodeURIComponent(service)}%0ARequirement: ${encodeURIComponent(message)}%0A%0APlease guide me on the next steps.`;window.open(`https://wa.me/917564002394?text=${body}`,"_blank","noopener");});
document.getElementById("year").textContent=new Date().getFullYear();
// Visual portfolio category filtering.
document.querySelectorAll(".gallery-filter").forEach(button=>button.addEventListener("click",()=>{
 const filter=button.dataset.filter;
 document.querySelectorAll(".gallery-filter").forEach(b=>{
  const active=b===button;b.classList.toggle("active",active);b.setAttribute("aria-pressed",String(active));
 });
 document.querySelectorAll(".visual-project").forEach(card=>{
  card.classList.toggle("is-hidden",filter!=="all"&&card.dataset.cat!==filter);
 });
}));


/* AZ signature interactions: subtle pointer glow and accessible reveal fallbacks */
(() => {
  const cards = document.querySelectorAll(".division-card");
  if (window.matchMedia("(hover:hover) and (pointer:fine)").matches) {
    cards.forEach(card => {
      card.addEventListener("pointermove", event => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--pointer-x", `${event.clientX - rect.left}px`);
        card.style.setProperty("--pointer-y", `${event.clientY - rect.top}px`);
      });
    });
  }
  document.querySelectorAll('a[href="#contact"][data-service]').forEach(link => {
    link.addEventListener("click", () => {
      const select = document.getElementById("serviceSelect");
      if (select) {
        select.value = link.dataset.service;
        select.dispatchEvent(new Event("change", { bubbles: true }));
      }
    });
  });
})();
