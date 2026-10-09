// Server components (no client JS): the author avatar + the byline line shown on
// blog post pages and blog index cards. The avatar degrades to an initials
// monogram until a real headshot is dropped in public/images/authors/.
import { initialsOf } from "../lib/authors";
import { formatDate } from "../lib/articles";

export function AuthorAvatar({ author, size = 40 }) {
  // fontSize is set here, not in CSS: an em-relative size inherits from whatever
  // tiny context the avatar sits in (a 12.5px byline gave 5px initials).
  const style = { width: size, height: size, fontSize: Math.round(size * 0.4) };
  if (author.photo) {
    return (
      <img
        className="author-avatar"
        src={author.photo}
        alt={author.name}
        width={size}
        height={size}
        style={style}
        loading="lazy"
      />
    );
  }
  return (
    <span className="author-avatar author-avatar--mono" style={style} aria-hidden="true">
      {initialsOf(author.name)}
    </span>
  );
}

// Full byline for an article page: one block with the avatar on the left and
// two lines beside it (who wrote it; when, and how long it takes to read).
export function Byline({ author, publishedDate, lastUpdated, words }) {
  const updated = lastUpdated && lastUpdated !== publishedDate ? lastUpdated : null;
  const minutes = words ? Math.max(1, Math.round(words / 220)) : null;
  return (
    <div className="byline">
      <a className="byline-who" href={`/author/${author.slug}`} rel="author" aria-label={`About ${author.name}`}>
        <AuthorAvatar author={author} size={48} />
      </a>
      <div className="byline-text">
        <p className="byline-line">
          <a className="byline-name" href={`/author/${author.slug}`} rel="author">{author.name}</a>
          <span className="byline-sep">·</span>
          <span className="byline-role">{author.role}</span>
        </p>
        <p className="byline-dates">
          <time dateTime={publishedDate}>{formatDate(publishedDate)}</time>
          {updated && (
            <>
              <span className="byline-sep">·</span>
              Updated <time dateTime={updated}>{formatDate(updated)}</time>
            </>
          )}
          {minutes && (
            <>
              <span className="byline-sep">·</span>
              {minutes} min read
            </>
          )}
        </p>
      </div>
    </div>
  );
}

// Compact byline for blog index cards. `linked` renders the name as a link to
// the author page — only safe where the byline is NOT nested inside another <a>
// (the blog cards put the link on the heading instead of wrapping the card).
export function BylineCompact({ author, publishedDate, lastUpdated, linked = false }) {
  const updated = lastUpdated && lastUpdated !== publishedDate ? lastUpdated : null;
  return (
    <span className="byline-compact">
      {/* 34px, not 24: the monogram is sized at 40% of the avatar, and a smaller
          circle produced initials below the 14px legibility floor. */}
      <AuthorAvatar author={author} size={34} />
      {linked ? (
        <a className="byline-name" href={`/author/${author.slug}`} rel="author">{author.name}</a>
      ) : (
        <span className="byline-name">{author.name}</span>
      )}
      <span className="byline-sep">·</span>
      <span>{formatDate(publishedDate)}</span>
      {updated && (
        <>
          <span className="byline-sep">·</span>
          <span>Updated {formatDate(updated)}</span>
        </>
      )}
    </span>
  );
}
