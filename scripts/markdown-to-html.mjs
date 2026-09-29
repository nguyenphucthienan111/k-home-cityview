/**
 * markdown-to-html.mjs — Chuyển đổi Markdown bài viết thành HTML ngữ nghĩa
 * Dùng bởi generate-static-html.mjs để tạo DOM tĩnh 100% chuẩn SEO cho Googlebot
 */

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function renderInlineMarkdown(text) {
  if (!text) return "";
  return text
    // Links: [text](url)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-amber-600 hover:text-amber-700 underline font-medium">$1</a>')
    // Bold: **text**
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-slate-900">$1</strong>')
    // Italic: *text* (avoiding double asterisks)
    .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em class="italic text-slate-800">$1</em>')
    // Inline code: `text`
    .replace(/`([^`]+)`/g, '<code class="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>');
}

export function markdownToHtml(content, article = {}) {
  if (!content) return "";

  const lines = content.split("\n").filter(l => !l.startsWith("---RELATED---"));
  const htmlParts = [];
  let i = 0;

  while (i < lines.length) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (!line) {
      i++;
      continue;
    }

    // 1. ---VIDEO---url|caption
    if (line.startsWith("---VIDEO---")) {
      const parts = line.replace("---VIDEO---", "").trim().split("|").map(s => s.trim());
      const videoUrl = parts[0] || "";
      const caption = parts[1] || article.title || "";
      let embedSrc = videoUrl;

      if (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")) {
        const ytIdMatch = videoUrl.match(/(?:embed\/|v=|shorts\/|youtu\.be\/)([^?&/\s]+)/);
        if (ytIdMatch && ytIdMatch[1]) {
          embedSrc = `https://www.youtube.com/embed/${ytIdMatch[1]}`;
        }
      }

      htmlParts.push(`
        <figure class="my-6">
          <div class="relative w-full aspect-video rounded-2xl overflow-hidden shadow-xl bg-slate-900">
            ${videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")
              ? `<iframe src="${embedSrc}" title="${escapeHtml(caption)}" class="w-full h-full border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>`
              : `<video src="${videoUrl}" controls preload="metadata" class="w-full h-full object-cover"></video>`}
          </div>
          ${caption ? `<figcaption class="text-center text-xs text-slate-500 mt-2 italic">${escapeHtml(caption)}</figcaption>` : ""}
        </figure>
      `);
      i++;
      continue;
    }

    // 2. ---GALLERY---url1|alt1 | url2|alt2
    if (line.startsWith("---GALLERY---")) {
      const rawParts = line.replace("---GALLERY---", "").trim().split("|").map(s => s.trim());
      let caption = "";
      const parts = [...rawParts];
      if (parts.length > 0 && !parts[parts.length - 1].includes("://")) {
        caption = parts.pop() || "";
      }
      const galleryItems = parts.map(item => {
        const [url, ...altParts] = item.split("|").map(s => s.trim());
        return { url, alt: altParts.join("|") || caption || "Hình ảnh dự án" };
      });

      htmlParts.push(`
        <div class="my-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          ${galleryItems.slice(0, 4).map(item => `
            <figure class="overflow-hidden rounded-xl shadow-md border border-slate-100">
              <img src="${item.url}" alt="${escapeHtml(item.alt)}" class="w-full h-48 object-cover" loading="lazy" />
              ${item.alt ? `<figcaption class="p-2 text-xs text-slate-600 bg-slate-50 text-center">${escapeHtml(item.alt)}</figcaption>` : ""}
            </figure>
          `).join("")}
        </div>
      `);
      i++;
      continue;
    }

    // 3. ---PROJECT-CENTER---slug|label
    if (line.startsWith("---PROJECT-CENTER---")) {
      const [slug, label] = line.replace("---PROJECT-CENTER---", "").split("|");
      const projectSlug = slug?.trim() || "k-home-cityview-ho-nai";
      const projectLabel = label?.trim() || "Dự Án K-Home CityView";
      htmlParts.push(`
        <div class="my-8 flex justify-center">
          <a href="/${projectSlug}" class="inline-flex flex-col items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all text-center no-underline">
            <span class="text-xs font-bold uppercase tracking-wider text-amber-100">Khám Phá Dự Án Ngay</span>
            <span class="text-lg font-bold">${escapeHtml(projectLabel)}</span>
            <span class="text-xs text-amber-100">Bảng giá 2026 · Mặt bằng · Hướng dẫn hồ sơ &rarr;</span>
          </a>
        </div>
      `);
      i++;
      continue;
    }

    // 4. ---PROJECT-LINK---slug|label
    if (line.startsWith("---PROJECT-LINK---")) {
      const [slug, label] = line.replace("---PROJECT-LINK---", "").split("|");
      const projectSlug = slug?.trim() || "k-home-cityview-ho-nai";
      const projectLabel = label?.trim() || "Xem chi tiết dự án";
      htmlParts.push(`
        <div class="my-4">
          <a href="/${projectSlug}" class="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-xl hover:bg-amber-100 transition-colors no-underline">
            <span class="text-sm font-bold text-amber-900">${escapeHtml(projectLabel)}</span>
            <span class="text-amber-600 font-semibold">&rarr;</span>
          </a>
        </div>
      `);
      i++;
      continue;
    }

    // 5. Image: ![alt](url)
    const imgMatch = line.match(/^!\[(.*?)\]\((.*?)\)$/);
    if (imgMatch) {
      const alt = imgMatch[1] || article.title || "Hình ảnh dự án K-Home Đồng Nai";
      const src = imgMatch[2];
      htmlParts.push(`
        <figure class="my-6">
          <img src="${src}" alt="${escapeHtml(alt)}" class="w-full rounded-2xl shadow-md border border-slate-100 object-cover" loading="lazy" />
          ${alt ? `<figcaption class="text-center text-xs text-slate-500 mt-2 italic">${escapeHtml(alt)}</figcaption>` : ""}
        </figure>
      `);
      i++;
      continue;
    }

    // 6. Headings
    if (line.startsWith("## ")) {
      const text = line.slice(3).trim();
      htmlParts.push(`<h2 class="text-xl sm:text-2xl font-bold text-slate-900 mt-10 mb-4 pb-2 border-b-2 border-amber-200">${renderInlineMarkdown(text)}</h2>`);
      i++;
      continue;
    }
    if (line.startsWith("### ")) {
      const text = line.slice(4).trim();
      htmlParts.push(`<h3 class="text-lg sm:text-xl font-bold text-slate-800 mt-6 mb-3">${renderInlineMarkdown(text)}</h3>`);
      i++;
      continue;
    }
    if (line.startsWith("#### ")) {
      const text = line.slice(5).trim();
      htmlParts.push(`<h4 class="text-base sm:text-lg font-semibold text-slate-800 mt-4 mb-2">${renderInlineMarkdown(text)}</h4>`);
      i++;
      continue;
    }

    // 7. Blockquote / Callout (> [!NOTE], > [!TIP], > quote)
    if (line.startsWith(">")) {
      const quoteLines = [];
      let isTip = false;
      let isNote = false;

      while (i < lines.length && lines[i].trim().startsWith(">")) {
        let qLine = lines[i].trim().replace(/^>\s?/, "");
        if (qLine.startsWith("[!TIP]")) {
          isTip = true;
          qLine = qLine.replace("[!TIP]", "").trim();
        } else if (qLine.startsWith("[!NOTE]")) {
          isNote = true;
          qLine = qLine.replace("[!NOTE]", "").trim();
        }
        if (qLine) quoteLines.push(qLine);
        i++;
      }

      const qContent = quoteLines.map(renderInlineMarkdown).join("<br />");
      const borderClass = isTip ? "border-amber-500 bg-amber-50/70" : isNote ? "border-blue-500 bg-blue-50/70" : "border-slate-400 bg-slate-50";

      htmlParts.push(`
        <blockquote class="my-6 p-4 rounded-xl border-l-4 ${borderClass} text-slate-800 leading-relaxed">
          ${qContent}
        </blockquote>
      `);
      continue;
    }

    // 8. Markdown Table
    if (line.startsWith("|") && line.endsWith("|")) {
      const tableLines = [];
      while (i < lines.length && lines[i].trim().startsWith("|") && lines[i].trim().endsWith("|")) {
        tableLines.push(lines[i].trim());
        i++;
      }

      if (tableLines.length >= 2) {
        const headerRow = tableLines[0];
        const bodyRows = tableLines.slice(2); // skip separator row |---|---|

        const parseCells = row =>
          row
            .slice(1, -1)
            .split("|")
            .map(c => c.trim());

        const headers = parseCells(headerRow);

        htmlParts.push(`
          <div class="my-6 overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
            <table class="w-full text-left text-sm border-collapse">
              <thead class="bg-slate-100 text-slate-900 border-b border-slate-200">
                <tr>
                  ${headers.map(h => `<th class="p-3 font-semibold">${renderInlineMarkdown(h)}</th>`).join("")}
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                ${bodyRows.map(r => {
                  const cells = parseCells(r);
                  return `
                    <tr class="hover:bg-slate-50/60">
                      ${cells.map(c => `<td class="p-3 text-slate-700">${renderInlineMarkdown(c)}</td>`).join("")}
                    </tr>
                  `;
                }).join("")}
              </tbody>
            </table>
          </div>
        `);
      }
      continue;
    }

    // 9. Unordered list (- item, * item)
    if (line.match(/^[-*]\s+/)) {
      const items = [];
      while (i < lines.length && lines[i].trim().match(/^[-*]\s+/)) {
        const itemText = lines[i].trim().replace(/^[-*]\s+/, "");
        items.push(itemText);
        i++;
      }

      htmlParts.push(`
        <ul class="my-4 space-y-2 list-disc list-inside text-slate-700 leading-relaxed pl-2">
          ${items.map(it => `<li>${renderInlineMarkdown(it)}</li>`).join("")}
        </ul>
      `);
      continue;
    }

    // 10. Ordered list (1. item)
    if (line.match(/^\d+\.\s+/)) {
      const items = [];
      while (i < lines.length && lines[i].trim().match(/^\d+\.\s+/)) {
        const itemText = lines[i].trim().replace(/^\d+\.\s+/, "");
        items.push(itemText);
        i++;
      }

      htmlParts.push(`
        <ol class="my-4 space-y-2 list-decimal list-inside text-slate-700 leading-relaxed pl-2">
          ${items.map(it => `<li>${renderInlineMarkdown(it)}</li>`).join("")}
        </ol>
      `);
      continue;
    }

    // 11. Normal Paragraph
    htmlParts.push(`<p class="mb-4 text-slate-700 leading-relaxed">${renderInlineMarkdown(line)}</p>`);
    i++;
  }

  return htmlParts.join("\n");
}
