(() => {
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const year = $("#year"); if (year) year.textContent = new Date().getFullYear();

  const toggle = $(".menu-toggle"), nav = $(".main-nav");
  if (toggle && nav) toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.textContent = open ? "×" : "☰";
  });

  const reveal = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("visible"); reveal.unobserve(e.target); }
  }), {threshold:.12});
  $$(".reveal").forEach(el => reveal.observe(el));

  const search = $("#service-search");
  if (search) search.addEventListener("input", () => {
    const q = search.value.trim().toLowerCase(); let shown=0;
    $$(".service-row").forEach(row => { const match = row.textContent.toLowerCase().includes(q); row.hidden=!match; if(match) shown++; });
    const empty=$("#no-services"); if(empty) empty.hidden=shown!==0;
  });

  const config = window.AZ_CONFIG || {};
  const configured = config.supabaseUrl && config.supabaseAnonKey &&
    !config.supabaseUrl.startsWith("PASTE_") && !config.supabaseAnonKey.startsWith("PASTE_");
  let db = null;
  if (configured && window.supabase) db = window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey);

  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const starText = n => "★".repeat(Number(n)||0) + "☆".repeat(5-(Number(n)||0));
  const reviewCard = r => `<article class="review-card"><div class="review-stars" aria-label="${Number(r.rating)} out of 5 stars">${starText(r.rating)}</div><p>${esc(r.review)}</p>${r.photo_url ? `<img class="review-photo" src="${esc(r.photo_url)}" alt="Customer shared photo" loading="lazy">` : ""}<div class="review-author"><span class="avatar">${esc((r.name||"C").trim().charAt(0).toUpperCase())}</span><span><b>${esc(r.name)}</b><small>${esc(r.city)} · ${esc(r.service)}</small></span></div></article>`;
  async function loadReviews() {
    const targets = [$("#all-reviews"), $("#home-reviews")].filter(Boolean);
    if (!targets.length) return;
    if (!db) { targets.forEach(t => t.innerHTML = `<div class="empty-state">Customer reviews will appear here once the Supabase project is connected.</div>`); return; }
    const {data,error} = await db.from("reviews").select("id,name,city,service,rating,review,photo_url,created_at").eq("is_visible",true).order("created_at",{ascending:false}).limit(60);
    if (error) { targets.forEach(t => t.innerHTML = `<div class="empty-state">Reviews are temporarily unavailable. Please try again later.</div>`); return; }
    const rows=data||[];
    const summary=$("#review-summary");
    if(summary) summary.innerHTML = `<strong>${rows.length ? (rows.reduce((a,r)=>a+Number(r.rating),0)/rows.length).toFixed(1) : "—"} <span class="gold">★</span></strong><span>${rows.length} published review${rows.length===1?"":"s"}</span>`;
    targets.forEach(t => {
      if (!rows.length) { t.innerHTML=`<div class="empty-state">No reviews yet. Be the first to share your genuine experience.</div>`; return; }
      const chosen=t.id==="home-reviews" ? rows.slice(0,3) : rows;
      t.innerHTML=chosen.map(reviewCard).join("");
    });
  }
  loadReviews();

  const ratingButtons=$$(".star-picker button"), ratingValue=$("#rating-value"), ratingHint=$("#rating-hint");
  ratingButtons.forEach(btn=>btn.addEventListener("click",()=>{
    const n=Number(btn.dataset.star); if(ratingValue) ratingValue.value=n;
    ratingButtons.forEach(b=>{const active=Number(b.dataset.star)<=n;b.textContent=active?"★":"☆";b.classList.toggle("selected",active);});
    if(ratingHint) ratingHint.textContent=`${n} out of 5 stars selected`;
  }));

  async function photoUpload(file) {
    if (!file || !file.name) return null;
    if (!["image/jpeg","image/png","image/webp"].includes(file.type)) throw new Error("Please choose a JPG, PNG or WebP image.");
    if (file.size > 2*1024*1024) throw new Error("Photo must be 2 MB or smaller.");
    const ext = file.type==="image/png"?"png":file.type==="image/webp"?"webp":"jpg";
    const path = `${crypto.randomUUID()}.${ext}`;
    const {error}=await db.storage.from(config.reviewPhotoBucket||"review-photos").upload(path,file,{contentType:file.type,upsert:false});
    if(error) throw error;
    const {data}=db.storage.from(config.reviewPhotoBucket||"review-photos").getPublicUrl(path);
    return data.publicUrl;
  }

  const reviewForm=$("#review-form");
  if(reviewForm) reviewForm.addEventListener("submit",async e=>{
    e.preventDefault(); const msg=$("#review-message"), button=$(".submit-btn",reviewForm);
    const f=new FormData(reviewForm);
    if(f.get("website")) return;
    if(!db){msg.textContent="Review publishing is not active yet. The site owner must connect the AZ Supabase project first.";msg.className="form-message error";return;}
    if(!f.get("rating")){msg.textContent="Please select a star rating.";msg.className="form-message error";return;}
    button.disabled=true;button.textContent="Publishing…";msg.textContent="";
    try {
      const photo=await photoUpload(f.get("photo"));
      const payload={name:String(f.get("name")).trim(),city:String(f.get("city")).trim(),service:String(f.get("service")),rating:Number(f.get("rating")),review:String(f.get("review")).trim(),photo_url:photo};
      const {error}=await db.from("reviews").insert(payload);
      if(error) throw error;
      reviewForm.reset();ratingButtons.forEach(b=>{b.textContent="☆";b.classList.remove("selected");});ratingValue.value="";ratingHint.textContent="Tap to select 1–5 stars";
      msg.textContent="Thank you! Your review has been published.";msg.className="form-message success";await loadReviews();
    } catch(err) {msg.textContent=err.message||"Could not publish your review. Please try again.";msg.className="form-message error";}
    finally {button.disabled=false;button.textContent="Publish my review ↗";}
  });

  const enquiry=$("#enquiry-form");
  if(enquiry) enquiry.addEventListener("submit",async e=>{
    e.preventDefault(); const msg=$("#enquiry-message"),button=$(".submit-btn",enquiry),f=new FormData(enquiry);
    if(!db){const text=`Hello AZ Digital Solutions, my name is ${f.get("name")}. Phone: ${f.get("phone")}. Service: ${f.get("service")}. Requirement: ${f.get("message")}`;window.open("https://wa.me/917564002394?text="+encodeURIComponent(text),"_blank","noopener");msg.textContent="Supabase is not connected. Your enquiry has been prepared in WhatsApp.";msg.className="form-message success";return;}
    button.disabled=true;button.textContent="Sending…";
    try {
      const payload={name:String(f.get("name")).trim(),phone:String(f.get("phone")).trim(),email:String(f.get("email")||"").trim()||null,service:String(f.get("service")),message:String(f.get("message")).trim()};
      const {error}=await db.from("enquiries").insert(payload);if(error)throw error;
      enquiry.reset();msg.textContent="Thank you! Your enquiry has been received.";msg.className="form-message success";
    } catch(err){msg.textContent=err.message||"Could not send enquiry. Please use WhatsApp.";msg.className="form-message error";}
    finally{button.disabled=false;button.textContent="Send enquiry ↗";}
  });
})();
