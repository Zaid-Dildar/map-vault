(async function () {
  console.log("🗺️ MapVault: Fully Automated Scraper");
  console.log("=====================================\\n");

  if (
    !location.hostname.includes("google.com") ||
    !location.pathname.startsWith("/maps")
  ) {
    return; // Abort instantly if not on Google Maps
  }

  const createOverlay = () => {
    const overlay = document.createElement("div");
    overlay.id = "mapvault-overlay";
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.9);
      color: white;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      backdrop-filter: blur(10px);
    `;

    const content = document.createElement("div");
    content.style.cssText = `
      text-align: center;
      max-width: 600px;
      padding: 40px;
    `;

    const title = document.createElement("h1");
    title.textContent = "🗺️ MapVault Scraper";
    title.style.cssText = `
      font-size: 2.5em;
      margin-bottom: 10px;
      color: #1a73e8;
    `;

    const subtitle = document.createElement("p");
    subtitle.textContent = "Scraping your saved places from Google Maps...";
    subtitle.style.cssText = `
      font-size: 1.2em;
      margin-bottom: 40px;
      opacity: 0.8;
    `;

    const progressContainer = document.createElement("div");
    progressContainer.style.cssText = `
      width: 100%;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      margin: 20px 0;
      overflow: hidden;
    `;

    const progressBar = document.createElement("div");
    progressBar.id = "mapvault-progress-bar";
    progressBar.style.cssText = `
      width: 0%;
      height: 12px;
      background: linear-gradient(90deg, #1a73e8, #0f9d58);
      border-radius: 20px;
      transition: width 0.5s ease;
    `;

    const progressText = document.createElement("div");
    progressText.id = "mapvault-progress-text";
    progressText.style.cssText = `
      font-size: 1.1em;
      margin: 15px 0;
      font-weight: 500;
    `;

    const currentPlace = document.createElement("div");
    currentPlace.id = "mapvault-current-place";
    currentPlace.style.cssText = `
      font-size: 1em;
      margin: 10px 0;
      opacity: 0.8;
      max-width: 500px;
      word-wrap: break-word;
    `;

    const statusText = document.createElement("div");
    statusText.id = "mapvault-status";
    statusText.style.cssText = `
      font-size: 0.9em;
      margin-top: 30px;
      opacity: 0.6;
      font-style: italic;
    `;

    progressContainer.appendChild(progressBar);
    content.appendChild(title);
    content.appendChild(subtitle);
    content.appendChild(progressText);
    content.appendChild(progressContainer);
    content.appendChild(currentPlace);
    content.appendChild(statusText);
    overlay.appendChild(content);

    document.body.appendChild(overlay);

    return {
      overlay,
      updateProgress: (current, total, placeName, status) => {
        const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
        progressBar.style.width = `${percentage}%`;
        progressText.textContent = `Progress: ${current}/${total} places (${percentage}%)`;
        currentPlace.textContent = placeName ? `Current: ${placeName}` : "";
        statusText.textContent = status || "Processing...";
      },
      complete: () => {
        title.textContent = "✅ Scraping Complete!";
        subtitle.textContent = `Successfully scraped ${results.length} places`;
        progressBar.style.background = "#0f9d58";
        progressBar.style.width = "100%";
        statusText.textContent = "Click the copy button to get your data";
        setTimeout(() => {
          overlay.style.background = "rgba(0, 0, 0, 0.95)";
          title.style.transform = "scale(1.05)";
          title.style.transition = "transform 0.3s ease";
        }, 500);
      },
      remove: () => {
        overlay.style.opacity = "0";
        overlay.style.transition = "opacity 0.5s ease";
        setTimeout(() => {
          if (overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
          }
        }, 500);
      },
    };
  };

  function waitForElement(selector, timeout = 10000) {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(selector);
      if (existing) return resolve(existing);

      const observer = new MutationObserver(() => {
        const element = document.querySelector(selector);
        if (element) {
          observer.disconnect();
          resolve(element);
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });

      setTimeout(() => {
        observer.disconnect();
        reject(new Error(`Timeout waiting for: ${selector}`));
      }, timeout);
    });
  }

  const wait = (ms) => new Promise((res) => setTimeout(res, ms));

  let results = [];
  let overlay;

  try {
    overlay = createOverlay();
    overlay.updateProgress(0, 0, "", "Initializing...");

    overlay.updateProgress(0, 0, "", "Opening Saved section...");
    const savedButton = await waitForElement(
      'button[jsaction*="navigationrail.saved"]'
    );
    savedButton.click();
    await wait(2000);

    overlay.updateProgress(0, 0, "", "Opening Saved places list...");
    await wait(1000);

    const listButtons = document.querySelectorAll("button.CsEnBe");
    let savedPlacesButton = null;

    for (const btn of listButtons) {
      const textEl = btn.querySelector(".Io6YTe.fontBodyLarge");
      if (textEl && textEl.textContent.trim() === "Saved places") {
        savedPlacesButton = btn;
        break;
      }
    }

    if (!savedPlacesButton) {
      throw new Error('Could not find "Saved places" list.');
    }

    savedPlacesButton.click();
    await wait(2000);

    overlay.updateProgress(0, 0, "", "Finding saved places...");
    const placeButtons = Array.from(
      document.querySelectorAll(".m6QErb.XiKgde button.SMP2wb")
    );

    if (placeButtons.length === 0) {
      throw new Error('No places found in your "Saved places" list.');
    }

    results = [];

    for (let i = 0; i < placeButtons.length; i++) {
      const placeNumber = i + 1;
      const totalPlaces = placeButtons.length;

      try {
        overlay.updateProgress(
          placeNumber,
          totalPlaces,
          "Loading place details...",
          "Opening place details..."
        );

        placeButtons[i].scrollIntoView({ behavior: "smooth", block: "center" });
        await wait(500);
        placeButtons[i].click();
        await wait(2500);

        const nameEl = document.querySelector(".DUwDvf");
        const name = nameEl
          ? nameEl.textContent.trim()
          : `Place ${placeNumber}`;

        overlay.updateProgress(
          placeNumber,
          totalPlaces,
          name,
          "Extracting information..."
        );

        const addrBtn = document.querySelector(
          "button[data-item-id='address']"
        );
        let address = null;
        if (addrBtn) {
          address = addrBtn
            .getAttribute("aria-label")
            ?.replace("Address: ", "")
            .trim();
        }

        const url = window.location.href;
        let shareUrl = null;
        const shareBtn = document.querySelector('button[aria-label="Share"]');

        if (shareBtn) {
          overlay.updateProgress(
            placeNumber,
            totalPlaces,
            name,
            "Getting share link..."
          );
          shareBtn.click();
          await wait(1500);

          const linkInput = document.querySelector("input.vrsrZe[readonly]");
          if (linkInput && linkInput.value) {
            shareUrl = linkInput.value;
          }

          const closeBtn = document.querySelector(
            "button.OyzoZb[aria-label='Close']"
          );
          if (closeBtn) {
            closeBtn.click();
          } else {
            document.dispatchEvent(
              new KeyboardEvent("keydown", {
                key: "Escape",
                code: "Escape",
                keyCode: 27,
                bubbles: true,
              })
            );
          }
          await wait(500);
        }

        const place = {
          name,
          url: shareUrl || url,
        };

        if (address) {
          place.address = address;
        }

        results.push(place);

        overlay.updateProgress(
          placeNumber,
          totalPlaces,
          name,
          "Closing details..."
        );
        const closeDetailBtn = document.querySelector(
          "button.VfPpkd-icon-LgbsSe"
        );
        if (closeDetailBtn) {
          closeDetailBtn.click();
          await wait(1000);
        }
      } catch (error) {
        overlay.updateProgress(
          placeNumber,
          totalPlaces,
          `Error: ${error.message}`,
          "Skipping..."
        );
        await wait(1000);
      }
    }

    overlay.complete();

    const createCopyButton = () => {
      const btn = document.createElement("button");
      btn.innerText = "📋 Copy Scraped Data";
      btn.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10001;
    padding: 12px 16px;
    background: #1a73e8;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    transition: all 0.3s ease;
  `;

      btn.onclick = async () => {
        try {
          const data = JSON.stringify(results, null, 2);
          await navigator.clipboard.writeText(data);

          btn.innerText = "✅ Copied!";
          btn.style.background = "#0f9d58";
          btn.style.transform = "scale(1.05)";

          setTimeout(() => {
            btn.style.opacity = "0";
            btn.style.transform = "scale(0.8)";
            overlay.remove();
            setTimeout(() => {
              if (btn.parentNode) {
                btn.parentNode.removeChild(btn);
              }
            }, 300);
          }, 2000);
        } catch {
          btn.innerText = "❌ Copy Failed";
          btn.style.background = "#d93025";
          console.log(
            "Copy this data manually:\\\\n",
            JSON.stringify(results, null, 2)
          );
        }
      };

      btn.onmouseenter = () => {
        if (!btn.innerText.includes("Copied")) {
          btn.style.background = "#1669d6";
          btn.style.transform = "translateY(-1px)";
        }
      };

      btn.onmouseleave = () => {
        if (!btn.innerText.includes("Copied")) {
          btn.style.background = "#1a73e8";
          btn.style.transform = "translateY(0)";
        }
      };

      document.body.appendChild(btn);
      return btn;
    };

    createCopyButton();
  } catch (error) {
    if (overlay) {
      overlay.updateProgress(0, 0, "", `Error: ${error.message}`);
      await wait(3000);
      overlay.remove();
    }
    alert(`❌ Error: ${error.message}`);
  }
})();
