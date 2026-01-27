import { IIntention } from '../models/Intention';

export function shouldShowIntention(intention: IIntention) {
  if (!intention.enabled) return false;

  const now = new Date();

  if (!intention.lastShownAt) return true;

  const last = new Date(intention.lastShownAt);

  if (intention.recurrence === 'daily') {
    return (
      now.toDateString() !== last.toDateString()
    );
  }

  if (intention.recurrence === 'weekly') {
    const diff =
      now.getTime() - last.getTime();

    const days = diff / (1000 * 60 * 60 * 24);

    return days >= 7;
  }

  return false;
}
