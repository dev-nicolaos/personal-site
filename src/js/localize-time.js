Array.from(document.getElementsByTagName("time")).forEach(timeEl => {
  timeEl.textContent = new Date(timeEl.textContent).toLocaleDateString(undefined, {
    dateStyle: "long",
    timeZone: "UTC"
  });
});
