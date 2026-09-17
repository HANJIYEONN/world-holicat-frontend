import { render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { LanguageProvider } from "@/i18n/LanguageProvider";
import BlogHomeContent from "./BlogHomeContent";

const fake = vi.hoisted(() => ({ fetchBlogPosts: vi.fn() }));

vi.mock("@/lib/blogApi", () => ({ fetchBlogPosts: fake.fetchBlogPosts }));

const posts = [1, 2, 3, 4].map((id) => ({
  id,
  title: `글 ${id}`,
  content: `본문 ${id}`,
  author_nickname: `고양이 ${id}`,
  is_author: false,
  view_count: id * 10,
  created_at: `2026-09-${18 - id}T12:00:00Z`,
  updated_at: `2026-09-${18 - id}T12:00:00Z`,
}));

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.setItem("locale", "ko");
  fake.fetchBlogPosts.mockResolvedValue(posts);
});

describe("블로그 메인 구성", () => {
  it("최신 글과 번호가 붙은 전체 목록, 나머지 최근 글을 함께 보여준다", async () => {
    render(
      <LanguageProvider>
        <BlogHomeContent />
      </LanguageProvider>,
    );

    expect(await screen.findByText("본문 1")).toBeInTheDocument();
    expect(screen.getAllByText("글 1")).toHaveLength(2);
    expect(screen.getAllByText("글 4")).toHaveLength(2);
    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("04")).toBeInTheDocument();

    const ranking = screen.getByRole("heading", { name: "인기 글 순위 🌰" }).closest("aside");
    expect(ranking).not.toBeNull();
    expect(within(ranking as HTMLElement).getAllByRole("link")[0]).toHaveTextContent("글 4");
  });
});
