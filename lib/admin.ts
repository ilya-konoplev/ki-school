import "server-only";
import { createClient } from "./supabase/server";

/** Данные для админки. Читаются под сессией админа (RLS пускает админа ко всему). */

export type AdminStudent = {
  id: string;
  fullName: string;
  examDate: string | null;
};

export type AdminParent = {
  id: string;
  username: string;
  fullName: string | null;
  createdAt: string;
  students: AdminStudent[];
};

export async function listParents(): Promise<AdminParent[]> {
  const supabase = await createClient();
  const [{ data: profiles }, { data: students }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, username, full_name, created_at")
      .eq("is_admin", false)
      .order("created_at"),
    supabase
      .from("students")
      .select("id, parent_id, full_name, exam_date")
      .order("created_at"),
  ]);

  return (profiles ?? []).map((p) => ({
    id: p.id,
    username: p.username,
    fullName: p.full_name,
    createdAt: p.created_at,
    students: (students ?? [])
      .filter((s) => s.parent_id === p.id)
      .map((s) => ({ id: s.id, fullName: s.full_name, examDate: s.exam_date })),
  }));
}

export type StudentDetails = {
  id: string;
  fullName: string;
  examDate: string | null;
  parent: { id: string; username: string; fullName: string | null } | null;
  lessons: { id: string; scheduledAt: string; note: string | null }[];
  comments: { id: string; body: string; createdAt: string }[];
  progress: { subject: string; topicSlug: string; completedOn: string }[];
};

export async function getStudentDetails(
  id: string,
): Promise<StudentDetails | null> {
  const supabase = await createClient();
  const { data: student } = await supabase
    .from("students")
    .select("id, parent_id, full_name, exam_date")
    .eq("id", id)
    .maybeSingle();
  if (!student) return null;

  const [{ data: parent }, { data: lessons }, { data: comments }, { data: progress }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("id, username, full_name")
        .eq("id", student.parent_id)
        .maybeSingle(),
      supabase
        .from("lessons")
        .select("id, scheduled_at, note")
        .eq("student_id", id)
        .order("scheduled_at", { ascending: false }),
      supabase
        .from("comments")
        .select("id, body, created_at")
        .eq("student_id", id)
        .order("created_at", { ascending: false }),
      supabase
        .from("progress")
        .select("subject, topic_slug, completed_on")
        .eq("student_id", id),
    ]);

  return {
    id: student.id,
    fullName: student.full_name,
    examDate: student.exam_date,
    parent: parent
      ? { id: parent.id, username: parent.username, fullName: parent.full_name }
      : null,
    lessons: (lessons ?? []).map((l) => ({
      id: l.id,
      scheduledAt: l.scheduled_at,
      note: l.note,
    })),
    comments: (comments ?? []).map((c) => ({
      id: c.id,
      body: c.body,
      createdAt: c.created_at,
    })),
    progress: (progress ?? []).map((p) => ({
      subject: p.subject,
      topicSlug: p.topic_slug,
      completedOn: p.completed_on,
    })),
  };
}

export type ContactRequest = {
  id: string;
  name: string;
  contact: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export async function listRequests(): Promise<ContactRequest[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("contact_requests")
    .select("id, name, contact, message, is_read, created_at")
    .order("created_at", { ascending: false });
  return (data ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    contact: r.contact,
    message: r.message,
    isRead: r.is_read,
    createdAt: r.created_at,
  }));
}

export type AdminService = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  points: string[];
  sortOrder: number;
};

export async function listServicesAdmin(): Promise<AdminService[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("services")
    .select("id, slug, title, summary, points, sort_order")
    .order("sort_order");
  return (data ?? []).map((s) => ({
    id: s.id,
    slug: s.slug,
    title: s.title,
    summary: s.summary,
    points: Array.isArray(s.points) ? (s.points as string[]) : [],
    sortOrder: s.sort_order,
  }));
}

export type AdminReview = {
  id: string;
  author: string;
  meta: string | null;
  body: string;
  rating: number | null;
  sortOrder: number;
};

export async function listReviewsAdmin(): Promise<AdminReview[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("reviews")
    .select("id, author, meta, body, rating, sort_order")
    .order("sort_order");
  return (data ?? []).map((r) => ({
    id: r.id,
    author: r.author,
    meta: r.meta,
    body: r.body,
    rating: r.rating,
    sortOrder: r.sort_order,
  }));
}

export async function adminStats(): Promise<{
  parents: number;
  students: number;
  unreadRequests: number;
}> {
  const supabase = await createClient();
  const [parents, students, unread] = await Promise.all([
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("is_admin", false),
    supabase.from("students").select("id", { count: "exact", head: true }),
    supabase
      .from("contact_requests")
      .select("id", { count: "exact", head: true })
      .eq("is_read", false),
  ]);
  return {
    parents: parents.count ?? 0,
    students: students.count ?? 0,
    unreadRequests: unread.count ?? 0,
  };
}
