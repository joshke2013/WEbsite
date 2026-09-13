const frame = document.querySelector("#browserFrame");
const address = document.querySelector("#address");
const home = document.querySelector("#home");
const homeInput = document.querySelector("#homeInput");
const tabTitle = document.querySelector("#tabTitle");
const statusEl = document.querySelector("#status");

const connection = new BareMux.BareMuxConnection("/baremux/worker.js");

let navHistory = [];
let navIndex = -1;

function normalize(value) {
  const text = value.trim();
  if (!text) return "";
  if (/^https?:\/\//i.test(text)) return text;
  if (/^[a-z0-9.-]+\.[a-z]{2,}(\/.*)?$/i.test(text)) return "https://" + text;
  return "https://www.google.com/search?q=" + encodeURIComponent(text);
}

function titleFor(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "") || "New Tab";
  } catch {
    return "New Tab";
  }
}

async function ensureProxy() {
  await registerSW();

  const wispUrl =
    (location.protocol === "https:" ? "wss://" : "ws://") +
    location.host +
    "/wisp/";

  if ((await connection.getTransport()) !== "/epoxy/index.mjs") {
    await connection.setTransport("/epoxy/index.mjs", [{ wisp: wispUrl }]);
  }
}

async function navigate(raw, addHistory = true) {
  const target = normalize(raw);
  if (!target) return showHome();

  statusEl.textContent = "Connecting…";
  try {
    await ensureProxy();

    home.hidden = true;
    frame.hidden = false;
    frame.src = __uv$config.prefix + __uv$config.encodeUrl(target);
    address.value = target;
    tabTitle.textContent = titleFor(target);

    if (addHistory) {
      navHistory = navHistory.slice(0, navIndex + 1);
      navHistory.push(target);
      navIndex = navHistory.length - 1;
    }
    statusEl.textContent = "";
  } catch (err) {
    statusEl.textContent = err?.message || String(err);
  }
}

function showHome() {
  frame.hidden = true;
  home.hidden = false;
  frame.src = "about:blank";
  address.value = "";
  tabTitle.textContent = "New Tab";
  statusEl.textContent = "";
}

address.addEventListener("keydown", e => {
  if (e.key === "Enter") navigate(address.value);
});

document.querySelector("#homeForm").addEventListener("submit", e => {
  e.preventDefault();
  navigate(homeInput.value);
});

document.querySelector("#homeBtn").addEventListener("click", showHome);

document.querySelector("#reloadBtn").addEventListener("click", () => {
  if (!frame.hidden && frame.src) frame.src = frame.src;
});

document.querySelector("#backBtn").addEventListener("click", () => {
  if (navIndex > 0) {
    navIndex -= 1;
    navigate(navHistory[navIndex], false);
  }
});

document.querySelector("#forwardBtn").addEventListener("click", () => {
  if (navIndex < navHistory.length - 1) {
    navIndex += 1;
    navigate(navHistory[navIndex], false);
  }
});

showHome();
