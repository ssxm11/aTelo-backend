// src/utils/intentions.ts
export function shouldShowIntention(goal: any): boolean {
  if (!goal.intention?.enabled) return false;

  const last = goal.intention.lastShownAt;
  if (!last) return true;

  const now = new Date();
  const diff = now.getTime() - new Date(last).getTime();

  const DAY = 1000 * 60 * 60 * 24;

  if (goal.intention.recurrence === 'daily') {
    return diff >= DAY;
  }

  if (goal.intention.recurrence === 'weekly') {
    return diff >= DAY * 7;
  }

  return false;
}
