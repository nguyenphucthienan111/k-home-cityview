import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

interface Article {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string;
  image: string;
  projectSlugs: string[];
}

interface RelatedArticlesProps {
  projectSlug: string; // e.g., "k-home-cityview-ho-nai"
  limit?: number; // Default 6
  title?: string; // Default "Tin Tức Liên Quan"
  onNavigate?: (path: string) => void;
}

export default function RelatedArticles({
  projectSlug,
  limit = 6,
  title = "Tin Tức Liên Quan",
  onNavigate,
}: RelatedArticlesProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedArticles = async () => {
      try {
        const response = await fetch("/api/news");
        if (!response.ok) throw new Error("Failed to fetch news");

        const allArticles: Article[] = await response.json();

        // Filter articles that mention the current project
        // Articles should have projectSlugs array or title/description should contain project name
        const projectNameMap: Record<string, string[]> = {
          "k-home-cityview-ho-nai": [
            "CityView",
            "Hố Nai",
            "Biên Hòa",
            "cityview",
          ],
          "k-home-midtown-trang-bom": ["Midtown", "Trảng Bom", "midtown"],
          "k-home-avenue-nhon-trach": [
            "Avenue",
            "Nhơn Trạch",
            "avenue",
            "Long Thành",
          ],
        };

        const keywords = projectNameMap[projectSlug] || [];

        const related = allArticles.filter((article) => {
          // Skip null or undefined articles
          if (!article) return false;

          // Check if article has projectSlugs array that includes current project
          if (
            article.projectSlugs &&
            Array.isArray(article.projectSlugs) &&
            article.projectSlugs.includes(projectSlug)
          ) {
            return true;
          }

          // Fallback: check if title or description contains project keywords
          const content = (
            (article.title || "") +
            " " +
            (article.description || "") +
            " " +
            (article.category || "")
          ).toLowerCase();
          return keywords.some((kw) => content.includes(kw.toLowerCase()));
        });

        // Sort by date descending (newest first)
        related.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        // Limit results
        setArticles(related.slice(0, limit));
      } catch (error) {
        console.error("Error fetching related articles:", error);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedArticles();
  }, [projectSlug, limit]);

  if (loading) {
    return (
      <div className="py-12 px-4 md:px-8 lg:px-16 bg-slate-50">
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  // Don't show section if no related articles found
  if (articles.length === 0) {
    return null;
  }

  return (
    <section className="py-16 px-4 md:px-8 lg:px-16 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">
            {title}
          </h2>
          <p className="text-slate-600 text-base md:text-lg">
            Cập nhật tin tức mới nhất và thông tin chi tiết về dự án này
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard
              key={article.slug}
              article={article}
              onNavigate={onNavigate}
            />
          ))}
        </div>

        {/* View More Link */}
        <div className="text-center mt-12">
          <a
            href="/tin-tuc"
            onClick={(e) => {
              if (onNavigate) {
                e.preventDefault();
                onNavigate("/tin-tuc");
              }
            }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Xem Tất Cả Tin Tức
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

interface ArticleCardProps {
  article: Article;
  onNavigate?: (path: string) => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onNavigate }) => {
  const handleClick = () => {
    if (onNavigate) {
      onNavigate(`/tin-tuc/${article.slug}`);
    } else {
      window.location.href = `/tin-tuc/${article.slug}`;
    }
  };

  // Format date: "17 Tháng 8, 2026"
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const monthNames = [
        "Tháng 1",
        "Tháng 2",
        "Tháng 3",
        "Tháng 4",
        "Tháng 5",
        "Tháng 6",
        "Tháng 7",
        "Tháng 8",
        "Tháng 9",
        "Tháng 10",
        "Tháng 11",
        "Tháng 12",
      ];
      return `${day} ${monthNames[month - 1]}, ${year}`;
    } catch {
      return dateString;
    }
  };

  return (
    <a
      href={`/tin-tuc/${article.slug}`}
      onClick={(e) => {
        e.preventDefault();
        handleClick();
      }}
      className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col cursor-pointer hover:scale-[1.02]"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-slate-200">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          loading="lazy"
        />
        {article.category && (
          <div className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            {article.category}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-5 flex flex-col gap-3">
        {/* Title */}
        <h3 className="text-lg font-bold text-slate-800 line-clamp-2 group-hover:text-amber-600 transition-colors">
          {article.title}
        </h3>

        {/* Description */}
        <p className="text-slate-600 text-sm line-clamp-2 flex-1">
          {article.description}
        </p>

        {/* Meta (Date + Link) */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <span className="text-xs text-slate-500 font-medium">
            {formatDate(article.date)}
          </span>
          <ArrowRight className="w-4 h-4 text-amber-500 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </a>
  );
};
