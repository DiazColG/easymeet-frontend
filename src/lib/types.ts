// easymeet-frontend/src/lib/types.ts
export interface Availability {
  id: string;
  startTime: string;
  endTime: string;
}

export interface Participant {
  id: string;
  name: string;
  token: string;
  availabilities: Availability[];
}

export interface EventData {
  id: string;
  slug: string;
  title: string;
  description?: string;
  timezone: string;
  startDate: string;
  endDate: string;
  participants: Participant[];
}