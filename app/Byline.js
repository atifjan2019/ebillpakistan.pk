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

// Full byline for an article page: avatar, linked name, role, and both dates.
export function Byline({ author, publishedDate, lastUpdated }) {
  const updated = lastUpdated && lastUpdated !== publishedDate ? lastUpdated : null;
  return (
    <div className="byline">
      <a className="byline-who" href={`/author/${author.slug}`} rel="author">
        <AuthorAvatar author={author} size={44} />
        <span>
          <span className="byline-name">{author.name}</span>
          <span className="byline-role">{author.role}</span>
        </span>
      </a>
      <p className="byline-dates">
        Published <time dateTime={publishedDate}>{formatDate(publishedDate)}</time>
        {updated && (
          <>
            {" · "}Last updated <time dateTime={updated}>{formatDate(updated)}</time>
          </>
        )}
      </p>
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
