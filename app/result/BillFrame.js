"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const ERROR_TEXT = {
  notfound: "We couldn't find a bill for this reference number. Please double-check it and try again.",
  invalid: "Please go back and enter a valid company and reference number.",
  error: "The bill service is unreachable right now. Please try again in a moment.",
};

const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14" />
  </svg>
);
const WaIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden>
    <path d="M12.02 2C6.6 2 2.2 6.4 2.2 11.82c0 1.9.5 3.66 1.46 5.25L2 22l5.06-1.6a9.78 9.78 0 0 0 4.96 1.35h.01c5.42 0 9.82-4.4 9.82-9.82C21.85 6.4 17.45 2 12.02 2Zm5.74 13.93c-.24.68-1.42 1.32-1.95 1.36-.5.05-1.13.07-1.82-.11-.42-.13-.96-.31-1.65-.6-2.9-1.25-4.79-4.17-4.94-4.36-.14-.19-1.18-1.57-1.18-3 0-1.43.75-2.13 1.02-2.42.27-.29.58-.36.78-.36.19 0 .39 0 .56.01.18.01.42-.07.66.5.24.58.83 2.01.9 2.16.07.14.12.31.02.5-.09.19-.14.31-.28.48-.14.17-.29.37-.42.5-.14.14-.28.29-.12.57.16.29.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.22 1.37.27.14.43.12.59-.07.16-.19.68-.79.86-1.07.18-.27.36-.22.61-.13.25.09 1.58.75 1.85.89.27.14.45.21.51.32.07.12.07.66-.17 1.34Z" />
  </svg>
);

export default function BillFrame({ src, disco = "bill", reference = "" }) {
  const ref = useRef(null);
  const roRef = useRef(null);
  const rafRef = useRef(0);
  const lastH = useRef(0);
  const lastWrapH = useRef(0);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [sharing, setSharing] = useState(false);

  // Fit the bill to the container WITHOUT a feedback loop: width is scaled if
  // needed, height comes from the bill's intrinsic .maincontent (not the
  // iframe-dependent body.scrollHeight), and writes are guarded against no-ops.
  const fit = useCallback(() => {
    const iframe = ref.current;
    if (!iframe) return;
    const wrap = iframe.parentElement;
    let doc;
    try {
      doc = iframe.contentWindow.document;
    } catch {
      return;
    }
    if (!doc || !doc.body) return;

    doc.documentElement.style.overflow = "hidden";
    doc.body.style.margin = "0";

    iframe.style.transform = "none";
    iframe.style.transformOrigin = "top left";
    iframe.style.width = "100%";

    const main = doc.querySelector(".maincontent");
    const natW = Math.max(main ? main.scrollWidth : 0, doc.body.scrollWidth, 920);
    const containerW = wrap.clientWidth;
    let scale = 1;
    if (natW > containerW + 1) {
      iframe.style.width = `${natW}px`;
      scale = containerW / natW;
    }

    // Intrinsic content height: the bottom of the bill content relative to the
    // document top. This does NOT grow when we grow the iframe.
    const contentH = main
      ? Math.ceil(main.getBoundingClientRect().bottom + 24)
      : doc.body.scrollHeight;

    if (Math.abs(contentH - lastH.current) > 2) {
      iframe.style.height = `${contentH}px`;
      lastH.current = contentH;
    }
    if (scale !== 1) iframe.style.transform = `scale(${scale})`;
    const wrapH = Math.ceil(contentH * scale);
    if (Math.abs(wrapH - lastWrapH.current) > 2) {
      wrap.style.height = `${wrapH}px`;
      lastWrapH.current = wrapH;
    }
  }, []);

  const scheduleFit = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(fit);
  }, [fit]);

  const onLoad = useCallback(() => {
    setLoading(false);
    let billStatus = null;
    try {
      billStatus = ref.current.contentDocument?.body?.dataset?.billStatus || null;
    } catch {}
    if (billStatus) {
      setStatus(billStatus);
      return;
    }
    setStatus(null);
    fit();
    setTimeout(fit, 300); // refit after images/barcode/QR settle
    setTimeout(fit, 1000);
    // Observe genuine content reflow (tab switch, late images) — NOT the iframe
    // viewport, so our own height writes can't re-trigger it.
    try {
      const win = ref.current.contentWindow;
      const main = win.document.querySelector(".maincontent");
      const RO = win.ResizeObserver || window.ResizeObserver;
      if (main && RO) {
        roRef.current = new RO(() => scheduleFit());
        roRef.current.observe(main);
      }
    } catch {}
  }, [fit, scheduleFit]);

  useEffect(() => {
    window.addEventListener("resize", scheduleFit);
    return () => {
      window.removeEventListener("resize", scheduleFit);
      cancelAnimationFrame(rafRef.current);
      if (roRef.current) roRef.current.disconnect();
    };
  }, [scheduleFit]);

  // Print-to-PDF dialog — only used as a fallback if direct download fails.
  const printFallback = useCallback(() => {
    const iframe = ref.current;
    let doc, win;
    try {
      win = iframe.contentWindow;
      doc = win.document;
    } catch {
      return;
    }
    if (!doc || !doc.body) return;
    const main = doc.querySelector(".maincontent");
    const natW = main ? main.scrollWidth : doc.body.scrollWidth;
    const natH = main ? Math.ceil(main.getBoundingClientRect().bottom + 24) : doc.body.scrollHeight;
    const s = Math.min(720 / natW, 980 / natH, 1);
    let style = doc.getElementById("print-fit-style");
    if (!style) {
      style = doc.createElement("style");
      style.id = "print-fit-style";
      doc.head.appendChild(style);
    }
    style.textContent = `@media print { @page { size: A4 portrait; margin: 8mm; }
      html, body { overflow: visible !important; margin: 0 !important; height: auto !important; }
      body { zoom: ${s}; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      #loader-container, .noprint, .tabs { display: none !important; } }`;
    win.focus();
    win.print();
  }, []);

  const fileName = `${String(disco).toUpperCase()}-bill-${reference || "copy"}.pdf`;

  // Build a single-page A4 PDF: rasterize the bill (JPEG keeps it small) and
  // place it centered on the page with margins (not edge-to-edge).
  const buildPdf = useCallback(async () => {
    const iframe = ref.current;
    let doc;
    try {
      doc = iframe.contentWindow.document;
    } catch {
      return null;
    }
    const node = doc.querySelector(".maincontent") || doc.body;
    const RATIO = 1.6; // crisp text without a giant file
    const { toJpeg } = await import("html-to-image");
    const dataUrl = await toJpeg(node, {
      backgroundColor: "#ffffff",
      quality: 0.82,
      pixelRatio: RATIO,
      cacheBust: true,
    });
    const img = new Image();
    img.src = dataUrl;
    await img.decode();
    const ar = img.naturalWidth / img.naturalHeight;

    const { jsPDF } = await import("jspdf");
    const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4", compress: true });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const margin = 22;
    const maxW = pageW - margin * 2;
    const maxH = pageH - margin * 2;
    let w = maxW;
    let h = w / ar;
    if (h > maxH) {
      h = maxH;
      w = h * ar;
    }
    pdf.addImage(dataUrl, "JPEG", (pageW - w) / 2, (pageH - h) / 2, w, h);
    return pdf;
  }, []);

  const downloadPdf = useCallback(async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      const pdf = await buildPdf();
      if (pdf) pdf.save(fileName);
      else printFallback();
    } catch {
      printFallback();
    } finally {
      setDownloading(false);
    }
  }, [buildPdf, downloading, fileName, printFallback]);

  // Share the actual PDF via the native share sheet (mobile -> WhatsApp etc.),
  // falling back to a wa.me link with the bill URL on desktop/unsupported.
  const shareWhatsApp = useCallback(async () => {
    if (sharing) return;
    const shareLink = () => {
      const url = typeof window !== "undefined" ? window.location.href : "";
      const text = `Here is my electricity bill. View it online: ${url}`;
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
    };
    if (typeof navigator === "undefined" || !navigator.canShare) {
      shareLink();
      return;
    }
    setSharing(true);
    try {
      const pdf = await buildPdf();
      const file = new File([pdf.output("blob")], fileName, { type: "application/pdf" });
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: "Electricity Bill", text: "My electricity bill" });
      } else {
        shareLink();
      }
    } catch (e) {
      if (e && e.name === "AbortError") return; // user dismissed the sheet
      shareLink();
    } finally {
      setSharing(false);
    }
  }, [buildPdf, fileName, sharing]);

  if (status) {
    return (
      <div className="error-box">
        <span className="ic">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#9b1c1c" strokeWidth="2">
            <circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16h.01" />
          </svg>
        </span>
        <div>
          <h3>{status === "notfound" ? "Bill not found" : status === "error" ? "Service unavailable" : "Invalid request"}</h3>
          <p>{ERROR_TEXT[status] || "Something went wrong. Please try again."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bill-card">
      <div className="bill-toolbar">
        <span className="tag"><span className="dot" /> Live bill</span>
        <div className="actions">
          <button className="btn btn-ghost" onClick={downloadPdf} disabled={downloading}>
            <DownloadIcon /> {downloading ? "Preparing…" : "Download PDF"}
          </button>
          <button className="btn btn-wa" onClick={shareWhatsApp} disabled={sharing}>
            <WaIcon /> {sharing ? "Preparing…" : "Share on WhatsApp"}
          </button>
        </div>
      </div>
      <div className="bill-frame">
        {loading && (
          <div className="loading">
            <span className="spinner" />
            <span>Loading your bill…</span>
          </div>
        )}
        <iframe ref={ref} title="Your bill" src={src} scrolling="no" onLoad={onLoad} />
      </div>
    </div>
  );
}
