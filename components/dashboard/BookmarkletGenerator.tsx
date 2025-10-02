import { useState } from "react";
import { Copy, Check, Bookmark, AlertCircle } from "lucide-react";

export default function BookmarkletGenerator() {
  const [copied, setCopied] = useState(false);

  // Get the correct domain based on environment
  const getScriptUrl = () => {
    if (typeof window === "undefined") return "";

    // Use current domain in production, localhost in development
    const baseUrl = window.location.origin;
    return `${baseUrl}/scraper.js`;
  };

  // Mini bookmarklet that loads the full script
  const bookmarklet = `javascript:(function(){var s=document.createElement('script');s.src='${getScriptUrl()}?t='+Date.now();document.body.appendChild(s);})();`;

  const handleCopyBookmarklet = () => {
    navigator.clipboard.writeText(bookmarklet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white space-y-4">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
          <Bookmark className="text-purple-600" size={20} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            One-Click Import Bookmarklet
          </h3>
          <p className="text-sm text-gray-600">
            Add this bookmark to instantly scrape your saved places whenever
            you&apos;re on Google Maps.
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
        <h4 className="font-semibold text-purple-900 mb-3">
          Two ways to install:
        </h4>

        {/* Method 1: Drag and Drop */}
        <div className="mb-4 pb-4 border-b border-purple-200">
          <p className="text-sm font-medium text-purple-800 mb-2">
            Method 1: Drag to Bookmarks Bar (Easiest)
          </p>
          <div className="max-md:flex-col flex items-center gap-3">
            <div
              dangerouslySetInnerHTML={{
                __html: `
      <a
        href="${bookmarklet}"
        draggable="true"
        class="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium cursor-move select-none"
        onclick="event.preventDefault();alert('📌 Drag this button to your bookmarks bar!\\n\\nMake sure your bookmarks bar is visible:\\n- Chrome/Edge: Ctrl+Shift+B\\n- Firefox: Ctrl+Shift+B\\n- Safari: Cmd+Shift+B');"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bookmark" aria-hidden="true"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path></svg>
         MapVault Import
      </a>
    `,
              }}
            />
            <span className="text-sm text-purple-700 font-medium">
              ← Drag me!
            </span>
          </div>
          <p className="text-xs text-purple-600 mt-2">
            Make sure your bookmarks bar is visible (Ctrl+Shift+B on Windows,
            Cmd+Shift+B on Mac)
          </p>
        </div>

        {/* Method 2: Copy and Paste */}
        <div>
          <p className="text-sm font-medium text-purple-800 mb-2">
            Method 2: Manual Copy & Paste
          </p>
          <ol className="list-decimal list-inside text-sm text-purple-700 space-y-1 mb-3">
            <li>Click &quot;Copy Bookmarklet&quot; below</li>
            <li>
              Right-click your bookmarks bar → &quot;Add page&quot; or &quot;Add
              bookmark&quot;
            </li>
            <li>
              Name:{" "}
              <code className="bg-purple-100 px-1 rounded text-xs">
                MapVault Import
              </code>
            </li>
            <li>URL: Paste the copied code</li>
            <li>Save</li>
          </ol>
          <button
            onClick={handleCopyBookmarklet}
            className="cursor-pointer w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
          >
            {copied ? (
              <>
                <Check size={16} />
                Copied! Now add it to bookmarks
              </>
            ) : (
              <>
                <Copy size={16} />
                Copy Bookmarklet
              </>
            )}
          </button>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <span>📖</span> How to use:
        </h4>
        <ol className="list-decimal list-inside text-sm text-blue-800 space-y-1.5">
          <li>
            Go to{" "}
            <a
              href="https://www.google.com/maps"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Google Maps
            </a>{" "}
            (stay logged in)
          </li>
          <li>
            Click the &quot;MapVault Import&quot; bookmark in your bookmarks bar
          </li>
          <li>Watch the automatic scraping (~30-60 seconds)</li>
          <li>Click the &quot;Copy Scraped Data&quot; button that appears</li>
          <li>Return to MapVault and upload the data</li>
        </ol>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
        <AlertCircle
          size={16}
          className="text-yellow-600 flex-shrink-0 mt-0.5"
        />
        <div className="text-xs text-yellow-800">
          <p className="font-medium mb-1">Important notes:</p>
          <ul className="list-disc list-inside space-y-0.5">
            <li>Only works on maps.google.com pages</li>
            <li>You must be logged into Google Maps</li>
            <li>
              Some browsers block bookmarklets - if it doesn&apos;t work, use
              the manual console method instead
            </li>
            <li>
              The scraper accesses your MapVault server to load the script
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
        <p className="text-xs text-gray-600">
          <strong>How it works:</strong> The bookmarklet injects a small script
          that loads the full scraper from your MapVault server. This keeps the
          bookmark small and allows us to update the scraper without you having
          to reinstall the bookmark.
        </p>
      </div>
    </div>
  );
}
