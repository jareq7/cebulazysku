// @author Claude Code (claude-opus-4-6) | 2026-03-17

// GA4 Recommended + Custom event names
export const AnalyticsEvents = {
  // GA4 Recommended
  PAGE_VIEW: "page_view",
  SIGN_UP: "sign_up",
  LOGIN: "login",
  VIEW_ITEM: "view_item",
  VIEW_ITEM_LIST: "view_item_list",
  SELECT_ITEM: "select_item",
  BEGIN_CHECKOUT: "begin_checkout",
  GENERATE_LEAD: "generate_lead",
  SHARE: "share",
  SEARCH: "search",

  // Custom — affiliate
  AFFILIATE_CLICK: "affiliate_click",

  // Custom — tracker
  TRACKER_START: "tracker_start",
  TRACKER_STOP: "tracker_stop",
  CONDITION_COMPLETE: "condition_complete",
  PAYOUT_RECEIVED: "payout_received",

  // Custom — gamification
  ACHIEVEMENT_UNLOCK: "achievement_unlock",
  STREAK_MILESTONE: "streak_milestone",

  // Custom — engagement
  BLOG_READ: "blog_read",
  NEWSLETTER_SIGNUP: "newsletter_signup",
  PUSH_SUBSCRIBE: "push_subscribe",
  COOKIE_CONSENT: "cookie_consent",

  // Custom — CTA & A/B
  CTA_CLICK: "cta_click",
  HERO_VARIANT_VIEW: "hero_variant_view",
  HERO_CTA_CLICK: "hero_cta_click",
  CALCULATOR_INTERACTION: "calculator_interaction",
  CALCULATOR_RESULT: "calculator_result",
} as const;

export type AnalyticsEvent = (typeof AnalyticsEvents)[keyof typeof AnalyticsEvents];

// GA4 item structure (for e-commerce-like events)
export interface GA4Item {
  item_id: string;
  item_name: string;
  item_category?: string;
  price?: number;
  currency?: string;
  item_list_name?: string;
  index?: number;
}

// Event parameter types
export interface ViewItemParams {
  item_id: string;
  item_name: string;
  item_category: string;
  price: number;
  currency: string;
  items: GA4Item[];
}

export interface ViewItemListParams {
  item_list_name: string;
  items: GA4Item[];
}

export interface SelectItemParams {
  item_id: string;
  item_name: string;
  item_list_name: string;
  index?: number;
}

export interface AffiliateClickParams {
  offer_id: string;
  bank_name: string;
  reward: number;
  source_page: string;
  user_logged_in: boolean;
}

export interface TrackerParams {
  offer_id: string;
  bank_name: string;
  days_tracked?: number;
}

export interface ConditionCompleteParams {
  offer_id: string;
  condition_type: string;
  condition_label: string;
}

export interface PayoutReceivedParams {
  offer_id: string;
  bank_name: string;
  value: number;
}

export interface AchievementParams {
  achievement_id: string;
  achievement_name: string;
  category: string;
}

export interface BlogReadParams {
  article_id: string;
  article_title: string;
  read_time?: number;
}

export interface ConsentParams {
  analytics: "granted" | "denied";
  ads: "granted" | "denied";
  personalization: "granted" | "denied";
}
