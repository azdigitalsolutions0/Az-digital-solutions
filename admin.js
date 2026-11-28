(() => {
  const cfg = window.AZ_CONFIG || {};
  const $ = (s) => document.querySelector(s);
  const loginPanel = $("#login-panel"), dashboard = $("#dashboard");
  const loginMessage = $("#login-message"), dashMessage = $("#dashboard-message");
  $("#year").textContent = new Date().getFullYear();
  if (!cfg.supabaseUrl || !cfg.supabaseAnonKey || !window.supabase) {
    loginMessage.textContent = "Supabase configuration is missing. Check config.js.";
    loginMessage.className = "admin-message error";
    return;
  }
  const db = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey);
  let activeTab = "reviews";

  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const date = (v) => v ? new Date(v).toLocaleString("en-IN", {dateStyle:"medium",timeStyle:"short"}) : "—";
  const showError = (el, err) => { el.textContent = err?.message || "Something went wrong. Please try again."; el.className = "admin-message error"; };

  async function requireAdmin() {
    const {data:{session}} = await db.auth.getSession();
    if (!session) { loginPanel.hidden = false; dashboard.hidden = true; $("#logout").hidden = true; return false; }
    const {data, error} = await db.from("admin_users").select("user_id").eq("user_id", session.user.id).maybeSingle();
    if (error || !data) {
      await db.auth.signOut();
      loginPanel.hidden = false; dashboard.hidden = true;
      showError(loginMessage, error || new Error("This account is not authorised as an AZ administrator."));
      return false;
    }
    loginPanel.hidden = true; dashboard.hidden = false; $("#logout").hidden = false;
    await refreshAll(); return true;
  }

  async function refreshAll() {
    dashMessage.textContent = "";
    const [reviews, enquiries] = await Promise.all([
      db.from("reviews").select("id,name,city,service,rating,review,photo_url,is_visible,created_at").order("created_at",{ascending:false}).limit(300),
      db.from("enquiries").select("id,name,phone,email,service,message,created_at").order("created_at",{ascending:false}).limit(300)
    ]);
    if (reviews.error) showError(dashMessage, reviews.error);
    if (enquiries.error) showError(dashMessage, enquiries.error);
    const rs = reviews.data || [], es = enquiries.data || [];
    $("#stat-reviews").textContent = rs.length;
    $("#stat-visible").textContent = rs.filter(x=>x.is_visible).length;
    $("#stat-hidden").textContent = rs.filter(x=>!x.is_visible).length;
    $("#stat-enquiries").textContent = es.length;
    renderReviews(rs); renderEnquiries(es);
  }

  function renderReviews(rows) {
    const host = $("#reviews-list");
    if (!rows.length) { host.innerHTML = '<p class="admin-muted">No reviews found.</p>'; return; }
    host.innerHTML = rows.map(r => `<article class="admin-item">
      <div><strong>${esc(r.name)}</strong> · ${esc(r.city)} <span class="admin-muted">(${esc(r.service)})</span>
      <p>${"★".repeat(Number(r.rating)||0)}${"☆".repeat(5-(Number(r.rating)||0))}</p>
      <p>${esc(r.review)}</p>${r.photo_url ? `<a href="${esc(r.photo_url)}" target="_blank" rel="noopener"><img class="admin-photo" src="${esc(r.photo_url)}" alt="Customer photo"></a>` : ""}
      <small class="admin-muted">${date(r.created_at)} · ${r.is_visible ? "Published" : "Hidden"}</small></div>
      <div class="admin-actions"><button class="admin-action ${r.is_visible?"":"good"}" data-review-action="toggle" data-id="${esc(r.id)}">${r.is_visible?"Hide":"Publish"}</button><button class="admin-action danger" data-review-action="delete" data-id="${esc(r.id)}">Delete</button></div>
    </article>`).join("");
  }

  function renderEnquiries(rows) {
    const host = $("#enquiries-list");
    if (!rows.length) { host.innerHTML = '<p class="admin-muted">No enquiries found.</p>'; return; }
    host.innerHTML = rows.map(e => `<article class="admin-item"><div><strong>${esc(e.name)}</strong> · ${esc(e.service)}
      <p>Phone: <a href="tel:${esc(e.phone)}">${esc(e.phone)}</a>${e.email ? ` · Email: <a href="mailto:${esc(e.email)}">${esc(e.email)}</a>` : ""}</p>
      <p>${esc(e.message)}</p><small class="admin-muted">${date(e.created_at)}</small></div>
      <div class="admin-actions"><a class="admin-action good" href="https://wa.me/${esc(String(e.phone).replace(/\\D/g,""))}" target="_blank" rel="noopener">WhatsApp</a></div></article>`).join("");
  }

  $("#login-form").addEventListener("submit", async e => {
    e.preventDefault(); const f = new FormData(e.currentTarget);
    loginMessage.textContent = "Signing in…"; loginMessage.className = "admin-message";
    const {error} = await db.auth.signInWithPassword({email:String(f.get("email")).trim(),password:String(f.get("password"))});
    if (error) { showError(loginMessage,error); return; }
    await requireAdmin();
  });
  $("#logout").addEventListener("click", async () => { await db.auth.signOut(); await requireAdmin(); });
  $("#reviews-list").addEventListener("click", async e => {
    const b=e.target.closest("[data-review-action]"); if(!b) return;
    const id=b.dataset.id, action=b.dataset.reviewAction; b.disabled=true;
    if(action==="delete" && !confirm("Permanently delete this review?")) { b.disabled=false; return; }
    const result = action==="delete" ? await db.from("reviews").delete().eq("id",id) :
      await db.from("reviews").update({is_visible:b.textContent.trim()==="Hide"?false:true}).eq("id",id);
    if(result.error) showError(dashMessage,result.error); else { dashMessage.textContent=action==="delete"?"Review deleted.":"Review visibility updated.";dashMessage.className="admin-message success"; }
    await refreshAll();
  });
  document.querySelectorAll("[data-tab]").forEach(b=>b.addEventListener("click",()=>{
    activeTab=b.dataset.tab;
    document.querySelectorAll("[data-tab]").forEach(x=>x.classList.toggle("active",x===b));
    $("#reviews-panel").hidden=activeTab!=="reviews"; $("#enquiries-panel").hidden=activeTab!=="enquiries";
  }));
  $("#refresh-reviews").addEventListener("click",refreshAll);
  $("#refresh-enquiries").addEventListener("click",refreshAll);
  requireAdmin();
})();