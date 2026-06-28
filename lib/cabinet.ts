import "server-only";
import {
  flatTopics,
  subjects,
  type SubjectKey,
} from "./content/materials";
import { createClient } from "./supabase/server";

export type Child = { id: string; fullName: string };

export type SubjectProgress = {
  key: SubjectKey;
  title: string;
  total: number;
  done: number;
  percent: number;
  /** slug темы → дата прохождения (ISO date) */
  completed: Record<string, string>;
};

export type Dashboard = {
  student: { id: string; fullName: string; examDate: string | null };
  nextLesson: { scheduledAt: string; note: string | null } | null;
  subjects: SubjectProgress[];
  comments: { id: string; body: string; createdAt: string }[];
};

/** Список детей родителя (RLS отдаёт только своих). */
export async function getChildren(parentId: string): Promise<Child[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("students")
    .select("id, full_name")
    .eq("parent_id", parentId)
    .order("created_at");
  return (data ?? []).map((s) => ({ id: s.id, fullName: s.full_name }));
}

const SUBJECT_KEYS: SubjectKey[] = ["physics", "math"];

/** Полные данные кабинета по одному ученику. */
export async function getDashboard(studentId: string): Promise<Dashboard | null> {
  const supabase = await createClient();

  const { data: student } = await supabase
    .from("students")
    .select("id, full_name, exam_date")
    .eq("id", studentId)
    .maybeSingle();
  if (!student) return null;

  const [{ data: progressRows }, { data: lesson }, { data: comments }] =
    await Promise.all([
      supabase
        .from("progress")
        .select("subject, topic_slug, completed_on")
        .eq("student_id", studentId),
      supabase
        .from("lessons")
        .select("scheduled_at, note")
        .eq("student_id", studentId)
        .gte("scheduled_at", new Date().toISOString())
        .order("scheduled_at")
        .limit(1)
        .maybeSingle(),
      supabase
        .from("comments")
        .select("id, body, created_at")
        .eq("student_id", studentId)
        .order("created_at", { ascending: false }),
    ]);

  const subjectProgress: SubjectProgress[] = SUBJECT_KEYS.map((key) => {
    const subject = subjects[key];
    const total = flatTopics(subject).length;
    const completed: Record<string, string> = {};
    for (const row of progressRows ?? []) {
      if (row.subject === key) completed[row.topic_slug] = row.completed_on;
    }
    const done = Object.keys(completed).length;
    return {
      key,
      title: subject.title,
      total,
      done,
      percent: total ? Math.round((done / total) * 100) : 0,
      completed,
    };
  });

  return {
    student: {
      id: student.id,
      fullName: student.full_name,
      examDate: student.exam_date,
    },
    nextLesson: lesson
      ? { scheduledAt: lesson.scheduled_at, note: lesson.note }
      : null,
    subjects: subjectProgress,
    comments: (comments ?? []).map((c) => ({
      id: c.id,
      body: c.body,
      createdAt: c.created_at,
    })),
  };
}

export type ChildSummary = {
  id: string;
  fullName: string;
  subjects: {
    key: SubjectKey;
    title: string;
    done: number;
    total: number;
    percent: number;
  }[];
};

/**
 * Краткая сводка прогресса всех детей родителя – для блока на главной (п.6).
 * Минимум запросов: студенты + строки прогресса одним заходом.
 */
export async function getChildrenSummary(
  parentId: string,
): Promise<ChildSummary[]> {
  const supabase = await createClient();

  const { data: students } = await supabase
    .from("students")
    .select("id, full_name")
    .eq("parent_id", parentId)
    .order("created_at");
  if (!students || students.length === 0) return [];

  const ids = students.map((s) => s.id);
  const { data: progress } = await supabase
    .from("progress")
    .select("student_id, subject")
    .in("student_id", ids);

  return students.map((s) => ({
    id: s.id,
    fullName: s.full_name,
    subjects: SUBJECT_KEYS.map((key) => {
      const total = flatTopics(subjects[key]).length;
      const done = (progress ?? []).filter(
        (p) => p.student_id === s.id && p.subject === key,
      ).length;
      return {
        key,
        title: subjects[key].title,
        done,
        total,
        percent: total ? Math.round((done / total) * 100) : 0,
      };
    }),
  }));
}
