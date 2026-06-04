"use client";

import { useState } from "react";
import { DISCOS } from "../../lib/discos";

const PAGE_SIZE = 20;

const fmtTime = (ms) =>
  new Date(ms).toLocaleString("en-GB", {
    timeZone: "Asia/Karachi",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

const discoLabel = (code) =>
  DISCOS[code] ? DISCOS[code][0] : code === "auto" ? "Auto-detect" : code;

export default function RecentChecks({ events }) {
  const [page, setPage] = useState(0);
  const [expanded, setExpanded] = useState(null);

  if (!events.length) return <p className="adm-empty">No checks recorded yet.</p>;

  const totalPages = Math.ceil(events.length / PAGE_SIZE);
  const slice = events.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  function toggleRow(idx) {
    setExpanded((prev) => (prev === idx ? null : idx));
  }

  return (
    <div>
      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Company</th>
              <th>Reference</th>
              <th>City</th>
              <th>IP</th>
              <th>Page</th>
              <th>Outcome</th>
            </tr>
          </thead>
          <tbody>
            {slice.map((ev, i) => {
              const globalIdx = page * PAGE_SIZE + i;
              const isOpen = expanded === globalIdx;
              return (
                <>
                  <tr
                    key={globalIdx}
                    onClick={() => toggleRow(globalIdx)}
                    style={{ cursor: "pointer" }}
                    className={isOpen ? "adm-row-active" : undefined}
                  >
                    <td>{fmtTime(ev.t)}</td>
                    <td>{discoLabel(ev.disco)}</td>
                    <td><code>{ev.ref || "—"}</code></td>
                    <td>
                      {ev.city
                        ? `${ev.city}${ev.country ? ", " + ev.country : ""}`
                        : "—"}
                    </td>
                    <td>
                      <code>{ev.ip || "—"}</code>
                    </td>
                    <td>
                      <code>{ev.page}</code>
                    </td>
                    <td>
                      <span className={`adm-badge adm-badge-${ev.outcome}`}>
                        {ev.outcome}
                      </span>
                    </td>
                  </tr>
                  {isOpen && (
                    <tr key={`${globalIdx}-detail`} className="adm-detail-row">
                      <td colSpan={7}>
                        <div className="adm-detail">
                          <span><strong>Time:</strong> {fmtTime(ev.t)}</span>
                          <span><strong>Company:</strong> {discoLabel(ev.disco)} ({ev.disco})</span>
                          <span><strong>Reference:</strong> {ev.ref || "—"}</span>
                          <span><strong>Page:</strong> {ev.page}</span>
                          <span><strong>Outcome:</strong> {ev.outcome}</span>
                          <span><strong>IP:</strong> {ev.ip || "—"}</span>
                          <span><strong>City:</strong> {ev.city || "—"}</span>
                          <span><strong>Country:</strong> {ev.country || "—"}</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="adm-pagination">
          <button
            className="btn btn-ghost"
            onClick={() => { setPage((p) => p - 1); setExpanded(null); }}
            disabled={page === 0}
          >
            ← Prev
          </button>
          <span className="adm-page-info">
            Page {page + 1} of {totalPages} &nbsp;·&nbsp; {events.length} total
          </span>
          <button
            className="btn btn-ghost"
            onClick={() => { setPage((p) => p + 1); setExpanded(null); }}
            disabled={page >= totalPages - 1}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
