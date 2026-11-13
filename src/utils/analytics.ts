/**
 * Tiện ích đo lường chuyển đổi và hành vi người dùng (Google Analytics 4 & Custom Events)
 * Website: k-homedongnai.com.vn
 */

export function trackEvent(eventName: string, params: Record<string, any> = {}) {
  if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
    try {
      (window as any).gtag("event", eventName, params);
    } catch (e) {
      console.warn("Analytics error:", e);
    }
  }
}

/**
 * Ghi nhận sự kiện tạo khách hàng tiềm năng thành công (High Value Conversion)
 */
export function trackLeadConversion(source: string, details?: Record<string, any>) {
  trackEvent("generate_lead", {
    event_category: "Lead Generation",
    event_label: source,
    value: 1,
    ...details,
  });

  // Sự kiện chuẩn contact của Google
  trackEvent("contact", {
    method: source,
    ...details,
  });
}

/**
 * Ghi nhận khi khách bấm gọi Hotline
 */
export function trackPhoneClick(phone: string = "0937587438", location?: string) {
  trackEvent("click_phone", {
    event_category: "Call Action",
    event_label: `Phone: ${phone}${location ? ` - ${location}` : ""}`,
    value: 1,
  });
}

/**
 * Ghi nhận khi khách bấm Chat Zalo
 */
export function trackZaloClick(location?: string) {
  trackEvent("click_zalo", {
    event_category: "Chat Action",
    event_label: `Zalo Chat${location ? ` - ${location}` : ""}`,
    value: 1,
  });
}

/**
 * Ghi nhận khi khách bấm Messenger
 */
export function trackMessengerClick(location?: string) {
  trackEvent("click_messenger", {
    event_category: "Chat Action",
    event_label: `Messenger Chat${location ? ` - ${location}` : ""}`,
    value: 1,
  });
}

/**
 * Ghi nhận khi khách bấm tải bộ hồ sơ mẫu đơn NOXH (Lead Magnet)
 */
export function trackDownloadDoc(docName: string) {
  trackEvent("download_document", {
    event_category: "Lead Magnet",
    event_label: docName,
  });
}

/**
 * Ghi nhận khi khách hoàn thành trắc nghiệm điều kiện NOXH
 */
export function trackQuizCompleted(result: string, score?: string) {
  trackEvent("quiz_completed", {
    event_category: "Eligibility Quiz",
    event_label: result,
    result_detail: score,
  });
}

/**
 * Ghi nhận khi khách chia sẻ bài viết lên mạng xã hội
 */
export function trackSocialShare(network: "facebook" | "zalo" | "copy_link", title: string) {
  trackEvent("share", {
    method: network,
    content_type: "article",
    item_id: title,
  });
}
