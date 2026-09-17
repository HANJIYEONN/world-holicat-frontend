"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/i18n/LanguageProvider";
import { fetchBlogPosts, type BlogPost } from "@/lib/blogApi";

export default function BlogHomeContent() {
  const { locale, t } = useLanguage();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchBlogPosts()
      .then((loaded) => {
        if (!cancelled) setPosts(loaded);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function writtenAt(iso: string) {
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(iso));
  }

  if (loading) {
    return <p className="py-16 text-center text-sm text-[#806044]">{t.blog.loading}</p>;
  }

  if (failed) {
    return (
      <div className="mt-10 rounded-lg border border-[#b89678] bg-[#f8f2e9] p-10 text-center">
        <p className="text-[#806044]">{t.blog.loadFailed}</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="mt-10 rounded-lg border border-[#b89678] bg-[#f8f2e9] p-10 text-center">
        <p className="text-[#806044]">{t.blog.empty}</p>
      </div>
    );
  }

  const [featured, ...rest] = posts;
  const recent = rest.slice(0, 3);
  const popularPosts = [...posts].sort(
    (left, right) => right.view_count - left.view_count || right.id - left.id,
  );

  return (
    <>
      <div className="mt-6 flex items-center gap-3 text-sm text-[#806044]">
        <span className="h-px w-8 bg-[#9a7558]" aria-hidden="true" />
        <span>{t.blog.postCount(posts.length)}</span>
      </div>

      <section className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.75fr)]">
        <Link
          href={`/blog/${featured.id}`}
          className="blog-wood-card group flex min-h-96 flex-col rounded-lg border border-[#b89678] p-7 shadow-[0_3px_10px_rgba(55,34,24,0.12)] transition duration-200 hover:-translate-y-1 hover:border-[#76513b] hover:shadow-[0_9px_20px_rgba(55,34,24,0.20)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#76513b]"
        >
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#8a6248]">
            {t.blog.featuredPost}
          </span>
          <h2 className="mt-5 text-2xl font-bold leading-snug text-[#3f2b22] transition group-hover:text-[#2f1c15]">
            {featured.title}
          </h2>
          <p className="mt-3 text-xs text-[#8a674b]">
            {writtenAt(featured.created_at)} · {featured.author_nickname}
          </p>
          <p className="mt-7 line-clamp-7 whitespace-pre-wrap break-words text-sm leading-7 text-[#654a38]">
            {featured.content}
          </p>
          <span className="mt-auto pt-7 text-sm font-bold text-[#65432f]">{t.blog.readMore} →</span>
        </Link>

        <aside className="rounded-lg bg-[#4b3328] p-6 text-[#f8f2e9] shadow-[0_4px_14px_rgba(35,20,14,0.20)]">
          <div className="flex items-center justify-between gap-3 border-b border-[#80634f] pb-4">
            <h2 className="font-bold">{t.blog.popularPosts} 🌰</h2>
            <span className="text-xs text-[#d8c1aa]">{posts.length}</span>
          </div>
          <ol className="mt-2 divide-y divide-[#6d5040]">
            {popularPosts.slice(0, 7).map((post, index) => (
              <li key={post.id}>
                <Link
                  href={`/blog/${post.id}`}
                  className="group grid grid-cols-[2rem_1fr] gap-2 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d8b48f]"
                >
                  <span className="font-mono text-xs text-[#bd9d82]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="line-clamp-1 block text-sm font-semibold group-hover:text-[#e5bd92]">
                      {post.title}
                    </span>
                    <span className="mt-1 block text-[11px] text-[#bd9d82]">
                      {writtenAt(post.created_at)} · {t.blog.views(post.view_count)}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
          <Link
            href="/blog/posts"
            className="mt-4 block border-t border-[#80634f] pt-4 text-right text-sm font-bold text-[#e5bd92] hover:text-white"
          >
            {t.blog.viewAll} →
          </Link>
        </aside>
      </section>

      {recent.length > 0 && (
        <section className="mt-12">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-bold">{t.blog.recentPosts}</h2>
            <Link href="/blog/posts" className="text-sm font-semibold text-[#6b412c] hover:underline">
              {t.blog.viewAll} →
            </Link>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {recent.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.id}`}
                className="blog-wood-card block min-h-56 rounded-lg border border-[#b89678] p-5 shadow-[0_2px_5px_rgba(55,34,24,0.10)] transition duration-200 hover:-translate-y-1 hover:border-[#76513b] hover:shadow-[0_8px_18px_rgba(55,34,24,0.20)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#76513b]"
              >
                <h3 className="line-clamp-2 font-bold leading-6 text-[#3f2b22]">{post.title}</h3>
                <p className="mt-2 text-xs text-[#8a674b]">
                  {writtenAt(post.created_at)} · {post.author_nickname}
                </p>
                <p className="mt-4 line-clamp-4 whitespace-pre-wrap break-words text-sm leading-6 text-[#654a38]">
                  {post.content}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
