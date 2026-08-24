export const BASE_API = "https://coochbehar-travels.onrender.com";
const VISITOR = "@cobtravels/visitor_id";
const storage = window.localStorage;

let accessToken = null;
let refreshPromise = null;
let onUnauthorizedCallback = null;

export function setOnUnauthorized(cb) {
  onUnauthorizedCallback = cb;
}

export function getAccessToken() {
  return accessToken;
}

export function clearTokens() {
  accessToken = null;
}

export function visitorId() {
  let id = storage.getItem(VISITOR);
  if (!id) {
    id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    storage.setItem(VISITOR, id);
  }
  return id;
}

async function authVisitorId() {
  let id = storage.getItem(VISITOR_SERVER_ID);
  if (!id) id = await identifyVisitor();
  return id || undefined;
}

function extractToken(x) {
  return (
    x?.data?.access_token ||
    x?.access_token ||
    x?.data?.token ||
    x?.token ||
    x?.data?.accessToken ||
    x?.accessToken ||
    null
  );
}

export function saveTokens(x) {
  const token = extractToken(x);
  if (token) {
    accessToken = token;
  }
  return { access: accessToken };
}

export async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = fetch(`${BASE_API}/api/v1/sessions/refresh`, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("AUTH_SESSION_INVALID");
        }
        const body = await response.json().catch(() => ({}));
        const token = extractToken(body);
        if (!token) {
          throw new Error("AUTH_TOKEN_MISSING");
        }
        accessToken = token;
        return token;
      })
      .catch((err) => {
        clearTokens();
        if (onUnauthorizedCallback) {
          onUnauthorizedCallback();
        }
        throw err;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

export async function refreshSession() {
  try {
    const token = await refreshAccessToken();
    return Boolean(token);
  } catch {
    return false;
  }
}

async function request(path, options = {}, isRetry = false) {
  const isAuthSessionReq =
    path.includes("/sessions/refresh") ||
    path.includes("/sessions/logout") ||
    path.includes("/auth/otp") ||
    path.includes("/auth/google");

  let res = await fetch(BASE_API + path, {
    ...options,
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(options.headers || {}),
    },
  });

  // Handle 401 unauthorized once with single serialized refresh promise
  if (res.status === 401 && !isAuthSessionReq && !isRetry) {
    try {
      await refreshAccessToken();
      return await request(path, options, true);
    } catch {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.message || "Unauthorized");
    }
  }

  if (res.status === 401 && !isAuthSessionReq && isRetry) {
    clearTokens();
    if (onUnauthorizedCallback) {
      onUnauthorizedCallback();
    }
  }

  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.message || `Request failed (${res.status})`);
  return body;
}

export async function requestOtp(identifier) {
  return request("/api/v1/auth/otp/request", {
    method: "POST",
    body: JSON.stringify({ identifier, purpose: "LOGIN", visitor_id: await authVisitorId() }),
  });
}

export async function verifyOtp(identifier, otp, name = "") {
  const r = await request("/api/v1/auth/otp/verify", {
    method: "POST",
    body: JSON.stringify({ identifier, otp, name, purpose: "LOGIN", visitor_id: await authVisitorId() }),
  });
  saveTokens(r);
  return r;
}

export async function loginGoogle(id_token) {
  const r = await request("/api/v1/auth/google", {
    method: "POST",
    body: JSON.stringify({ id_token, visitor_id: await authVisitorId() }),
  });
  saveTokens(r);
  return r;
}

export async function logout(all = false) {
  const endpoint = `/api/v1/sessions/${all ? "logout-all" : "logout"}`;
  try {
    await fetch(BASE_API + endpoint, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
    });
  } catch (err) {
    console.warn("Logout request error:", err);
  } finally {
    clearTokens();
    if (onUnauthorizedCallback) {
      onUnauthorizedCallback();
    }
  }
}
export function fetchMe(){return request("/api/v1/auth/me",{},true);}
export function updateMe(data){return request("/api/v1/auth/me",{method:"PATCH",body:JSON.stringify(data)},true);}
export function fetchSessions(){return request("/api/v1/sessions/",{},true);}
export function deleteSession(id){return request(`/api/v1/sessions/${encodeURIComponent(id)}`,{method:"DELETE"},true);}
export async function uploadFile(file){
  if(!file) throw new Error("Please choose a file to upload");
  const token=getAccessToken();
  const form=new FormData();
  form.append("file",file);
  const res=await fetch(`${BASE_API}/api/v1/public/files/upload`,{method:"POST",body:form,credentials:"include",headers:{Accept:"application/json",...(token?{Authorization:`Bearer ${token}`}:{})}});
  const body=await res.json().catch(()=>({}));
  if(!res.ok||body?.success===false) throw new Error(body.message||`File upload failed (${res.status})`);
  return body;
}
const VISITOR_SERVER_ID="@cobtravels/visitor_server_id", VISITOR_SESSION_ID="@cobtravels/visitor_session_id";
function clientFingerprint(){let value=storage.getItem("@cobtravels/fingerprint");if(!value){value=`web-${Date.now()}-${Math.random().toString(36).slice(2,14)}`;storage.setItem("@cobtravels/fingerprint",value)}return value;}
function clientDetails(){const ua=navigator.userAgent||"";const browser=/Edg\//.test(ua)?"Edge":/Chrome\//.test(ua)?"Chrome":/Firefox\//.test(ua)?"Firefox":/Safari\//.test(ua)?"Safari":"Other";const os=/Windows/.test(ua)?"Windows":/Mac OS/.test(ua)?"macOS":/Android/.test(ua)?"Android":/iPhone|iPad/.test(ua)?"iOS":"Other";return {browser,os,device:/Mobi|Android|iPhone|iPad/.test(ua)?"mobile":"desktop"};}
export async function identifyVisitor(customerId=""){try{const d=clientDetails();const payload={fingerprint:clientFingerprint(),ip_address:"",country:"",state:"",city:"",browser:d.browser,os:d.os,device:d.device};if(customerId)payload.customer_id=customerId;const r=await request("/api/v1/visitors/identify",{method:"POST",body:JSON.stringify(payload)});const id=r?.data?.visitor?.id||r?.data?.visitor?.visitor_id;if(id)storage.setItem(VISITOR_SERVER_ID,id);return id||storage.getItem(VISITOR_SERVER_ID)||null;}catch{return null;}}
export async function startVisitorSession(landingPage=window.location.pathname){const visitor=storage.getItem(VISITOR_SERVER_ID);if(!visitor)return null;try{const r=await request("/api/v1/visitors/sessions/start",{method:"POST",body:JSON.stringify({visitor_id:visitor,landing_page:landingPage,referrer:document.referrer||"",utm_source:"",utm_medium:"",utm_campaign:"",utm_term:""})});const id=r?.data?.id;if(id)storage.setItem(VISITOR_SESSION_ID,id);return id||null;}catch{return null;}}
export async function heartbeatVisitorSession(currentPage=window.location.pathname,pageViewsDelta=1){const id=storage.getItem(VISITOR_SESSION_ID);if(!id)return null;try{const r=await request(`/api/v1/visitors/sessions/${encodeURIComponent(id)}/heartbeat`,{method:"POST",body:JSON.stringify({current_page:currentPage,page_views_delta:pageViewsDelta})});return r?.data||null;}catch{return null;}}
export async function endVisitorSession(exitPage=window.location.pathname){const id=storage.getItem(VISITOR_SESSION_ID);if(!id)return null;storage.removeItem(VISITOR_SESSION_ID);try{const r=await request(`/api/v1/visitors/sessions/${encodeURIComponent(id)}/end`,{method:"POST",body:JSON.stringify({exit_page:exitPage}),keepalive:true});return r?.data||null;}catch{return null;}}
export async function trackVisitorEvent(eventName,page=window.location.pathname,eventMetadata={}){const visitor=storage.getItem(VISITOR_SERVER_ID);const session=storage.getItem(VISITOR_SESSION_ID);if(!visitor||!session)return null;try{const r=await request("/api/v1/visitors/events",{method:"POST",body:JSON.stringify({visitor_id:visitor,session_id:session,event_name:eventName,page,event_metadata:eventMetadata}),keepalive:true});return r?.data||null;}catch{return null;}}
export async function trackVisitorEventsBatch(events=[]){if(!events.length)return null;try{const r=await request("/api/v1/visitors/events/batch",{method:"POST",body:JSON.stringify({events}),keepalive:true});return r?.data||null;}catch{return null;}}
function variant(v,i=0){return {...v,id:v.id||`variant-${i}`,slug:v.slug||`variant-${i}`,cover_image:v.banner?.image||"",duration:`${v.duration_nights||0}N | ${v.duration_days||0}D`,starting_price:Number(v.price||0),dates:v.departure_dates||[],gallery:(v.gallery||[]).filter(x=>x?.url).map(x=>({...x,url:x.url})),route:v.route||[],is_default:i===0};}
function summary(x){return {...x,id:x.slug||x.id,code:x.tour_code,title:x.title,image:x.banner?.image||"",video:x.banner?.video||"",season_name:x.season_name||"",badge:x.badge||"",destination:x.destination||"",price:x.price==null?null:Number(x.price),duration:x.duration||"",route:x.route||[],accent:"#f2c14e"};}
export async function fetchPackages(filters={}){const query=new URLSearchParams();Object.entries(filters).forEach(([key,value])=>{if(value!==undefined&&value!==null&&value!=="")query.set(key,String(value));});const r=await request("/api/v1/tour-packages"+(query.toString()?"?"+query.toString():""));const raw=r.data;const items=Array.isArray(raw)?raw:(raw?.items||raw?.results||raw?.packages||[]);return {items:items.map(summary),total:Number(raw?.total??raw?.count??items.length),page:Number(raw?.page??filters.page??1),page_size:Number(raw?.page_size??filters.page_size??20),pages:Number(raw?.pages??Math.ceil(Number(raw?.total??raw?.count??items.length)/Number(raw?.page_size??filters.page_size??20)))||1};}
export async function fetchPackage(slug){const r=await request(`/api/v1/tour-packages/${encodeURIComponent(slug)}`);const d=r.data;if(!d)throw new Error("Tour package was not found");return {...d,id:d.id,code:d.tour_code,image:d.default_variant?.banner?.image||"",price:Number(d.default_variant?.price||0),duration:`${d.default_variant?.duration_nights||0}N | ${d.default_variant?.duration_days||0}D`,seasons:[d.default_variant,...(d.other_variants||[])].filter(Boolean).map(variant),gallery:(d.default_variant?.gallery||[]).filter(x=>x?.url),route:d.default_variant?.route||[]};}
export async function fetchVariant(slug,variantSlug){const r=await request(`/api/v1/tour-packages/${encodeURIComponent(slug)}/variants/${encodeURIComponent(variantSlug)}`);return variant(r.data.variant);}
