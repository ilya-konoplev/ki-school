import "server-only";
import { cache } from "react";
import { isSupabaseConfigured } from "./auth";
import { reviews as defaultReviews, type Review } from "./content/reviews";
import { services as defaultServices, type Service } from "./content/services";
import { defaultTexts, type SiteTexts } from "./content/texts";
import { site } from "./content/site";
import { createClient } from "./supabase/server";

/**
 * Источник публичного контента: читает из Supabase, а если база не подключена
 * (или таблица недоступна) — отдаёт значения по умолчанию из кода.
 * Обёрнуто в React cache(), чтобы за один запрос обращаться к БД один раз.
 */

export const getServices = cache(async (): Promise<Service[]> => {
  if (!isSupabaseConfigured()) return defaultServices;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("services")
      .select("slug, title, summary, points, sort_order")
      .order("sort_order");
    if (error || !data) return defaultServices;
    return data.map((r) => ({
      slug: r.slug,
      title: r.title,
      summary: r.summary,
      points: Array.isArray(r.points) ? (r.points as string[]) : [],
    }));
  } catch {
    return defaultServices;
  }
});

export const getReviews = cache(async (): Promise<Review[]> => {
  if (!isSupabaseConfigured()) return defaultReviews;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("reviews")
      .select("id, author, meta, body, rating, sort_order")
      .order("sort_order");
    if (error || !data) return defaultReviews;
    return data.map((r) => ({
      id: r.id,
      author: r.author,
      meta: r.meta ?? undefined,
      text: r.body,
      rating: r.rating ?? undefined,
    }));
  } catch {
    return defaultReviews;
  }
});

export const getPublicExamDate = cache(async (): Promise<string> => {
  if (!isSupabaseConfigured()) return site.publicExamDate;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "public_exam_date")
      .maybeSingle();
    return typeof data?.value === "string" ? data.value : site.publicExamDate;
  } catch {
    return site.publicExamDate;
  }
});

export const getTexts = cache(async (): Promise<SiteTexts> => {
  if (!isSupabaseConfigured()) return defaultTexts;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "texts")
      .maybeSingle();
    const overrides =
      data?.value && typeof data.value === "object" && !Array.isArray(data.value)
        ? (data.value as Partial<SiteTexts>)
        : {};
    return { ...defaultTexts, ...overrides };
  } catch {
    return defaultTexts;
  }
});
