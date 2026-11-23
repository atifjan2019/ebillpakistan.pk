"use client";

import { useCallback, useState } from "react";

// Print and PDF for the parsed bill.
//
// The old implementation rasterised an iframe with html-to-image and placed the
// bitmap in a PDF. That could not work on mobile Safari (cross-origin iframe
// document access) and produced a heavy, unsearchable file. Because we now hold
// the bill as data, the PDF is drawn as real text with jsPDF: a few KB, readable,
// selectable, and it works the same in mobile Safari and Chrome.
export default function BillActions({ bill, discoName, lines }) {
  const [busy, setBusy] = useState("");

  const fileName = `${String(discoName || "bill").replace(/\s+/g, "-")}-${bill.reference || "copy"}.pdf`;

  const buildPdf = useCallback(async () => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
    const M = 48;
    const W = doc.internal.pageSize.getWidth();
    let y = M;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(`${discoName} electricity bill`, M, y);
    y += 20;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(110);
    doc.text("Retrieved via ebillpakistan.pk — figures as issued by the official billing system.", M, y);
    doc.setTextColor(0);
    y += 24;

    const pair = (label, value) => {
      if (value === null || value === undefined || value === "") return;
      if (y > 780) { doc.addPage(); y = M; }
      doc.setFont("helvetica", "bold");
      doc.text(String(label), M, y);
      doc.setFont("helvetica", "normal");
      doc.text(String(value), M + 190, y, { maxWidth: W - M * 2 - 190 });
      y += 17;
    };

    pair("Reference No.", bill.reference);
    pair("Consumer name", bill.name);
    pair("Address", bill.address);
    pair("Tariff", bill.tariff);
    pair("Sanctioned load", bill.sanctionedLoad);
    pair("Billing month", bill.billMonth);
    pair("Units consumed", bill.unitsConsumed);
    pair("Due date", bill.dueDate);

    if (lines?.length) {
      y += 10;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Charges", M, y);
      y += 16;
      doc.setFontSize(10);
      for (const l of lines) {
        if (y > 780) { doc.addPage(); y = M; }
        doc.setFont("helvetica", "normal");
        doc.text(l.label, M, y);
        doc.text(`Rs ${Number(l.amount).toLocaleString("en-PK")}`, W - M, y, { align: "right" });
        y += 16;
      }
    }

    y += 8;
    doc.setDrawColor(200);
    doc.line(M, y, W - M, y);
    y += 20;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    if (bill.payableWithinDueDate !== null) {
      doc.text("Payable within due date", M, y);
      doc.text(`Rs ${Number(bill.payableWithinDueDate).toLocaleString("en-PK")}`, W - M, y, { align: "right" });
      y += 18;
    }
    if (bill.payableAfterDueDate !== null) {
      doc.setFontSize(11);
      doc.setTextColor(150, 30, 30);
      doc.text("Payable after due date", M, y);
      doc.text(`Rs ${Number(bill.payableAfterDueDate).toLocaleString("en-PK")}`, W - M, y, { align: "right" });
      doc.setTextColor(0);
    }
    return doc;
  }, [bill, discoName, lines]);

  const download = useCallback(async () => {
    if (busy) return;
    setBusy("pdf");
    try {
      const doc = await buildPdf();
      doc.save(fileName);
    } catch {
      window.print(); // last resort: the print dialog can still save a PDF
    } finally {
      setBusy("");
    }
  }, [buildPdf, busy, fileName]);

  const share = useCallback(async () => {
    if (busy) return;
    const link = () => {
      const text = `My ${discoName} electricity bill${
        bill.payableWithinDueDate !== null ? `: Rs ${Number(bill.payableWithinDueDate).toLocaleString("en-PK")}` : ""
      }${bill.dueDate ? `, due ${bill.dueDate}` : ""}`;
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
    };
    if (typeof navigator === "undefined" || !navigator.canShare) return link();
    setBusy("share");
    try {
      const doc = await buildPdf();
      const file = new File([doc.output("blob")], fileName, { type: "application/pdf" });
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: "Electricity bill" });
      } else link();
    } catch (e) {
      if (e?.name !== "AbortError") link();
    } finally {
      setBusy("");
    }
  }, [buildPdf, busy, bill, discoName, fileName]);

  return (
    <div className="bill-actions">
      <button type="button" className="btn btn-ghost" onClick={download} disabled={busy === "pdf"}>
        {busy === "pdf" ? "Preparing…" : "Download PDF"}
      </button>
      <button type="button" className="btn btn-ghost" onClick={() => window.print()}>
        Print
      </button>
      <button type="button" className="btn btn-wa" onClick={share} disabled={busy === "share"}>
        {busy === "share" ? "Preparing…" : "Share"}
      </button>
    </div>
  );
}
