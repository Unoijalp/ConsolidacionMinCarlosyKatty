// 1) Pega aquí la URL de tu aplicación web de Apps Script (termina en /exec)
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz22PPhS3P1Tg1WFnXCDL_2ZNKH-0ifNwJjF5ZMPmTLOvCiBfMhjRTeaGm5wcHoWFfm3w/exec";

const form = document.getElementById("form");
const btn = document.getElementById("btn");
const btnTxt = document.getElementById("btnTxt");
const toast = document.getElementById("toast");
const done = document.getElementById("done");

const check = el => {
  const ok = el.value.trim() !== "" && el.checkValidity();
  el.closest(".field").classList.toggle("bad", !ok);
  return ok;
};
form.querySelectorAll("input,textarea").forEach(el =>
  el.addEventListener("input", () => el.closest(".field").classList.contains("bad") && check(el)));

form.addEventListener("submit", async e => {
  e.preventDefault();
  toast.textContent = "";
  const els = [...form.querySelectorAll("input,textarea")];
  const valid = els.map(check).every(Boolean);
  if (!valid) { form.querySelector(".bad input,.bad textarea")?.focus(); return; }
  if (SCRIPT_URL.startsWith("PEGA_")) { toast.textContent = "Falta configurar la URL de Apps Script en el código."; return; }

  btn.disabled = true; btn.classList.add("loading"); btnTxt.textContent = "Guardando…";
  try {
    const body = new URLSearchParams(Object.fromEntries(els.map(el => [el.name, el.value.trim()])));
    // no-cors: Apps Script no devuelve cabeceras CORS; la petición se envía igual.
    await fetch(SCRIPT_URL, { method: "POST", mode: "no-cors", body });
    done.classList.add("show");
    form.reset();
  } catch (err) {
    toast.textContent = "No se pudo guardar. Revisa tu conexión e inténtalo de nuevo.";
  } finally {
    btn.disabled = false; btn.classList.remove("loading"); btnTxt.textContent = "Guardar registro";
  }
});

document.getElementById("again").addEventListener("click", () => {
  done.classList.remove("show");
  document.getElementById("encuestador").focus();
});
