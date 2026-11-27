// Show a plain message instead of Firefox's error frame when offline.
if (!navigator.onLine) {
  document.getElementById("page").hidden = true;
  document.getElementById("offline").hidden = false;
}
