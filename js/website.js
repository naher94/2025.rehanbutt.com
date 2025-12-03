document.querySelectorAll("section.website details").forEach(details => {
    details.addEventListener("toggle", () => {
      const section = details.closest("section.website");
      const allDetails = section.querySelectorAll("details");
      const shouldOpen = details.open;

      allDetails.forEach(d => d.open = shouldOpen);
    });
  });