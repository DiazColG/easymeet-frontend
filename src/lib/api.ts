// easymeet-frontend/src/lib/api.ts
import { EventData, Participant } from './types';

const API_BASE_URL = 'http://localhost:3001';

// 👇 ESTA ES LA FUNCIÓN QUE PROBABLEMENTE FALTABA
export async function getEventBySlug(slug: string): Promise<EventData | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/events/${slug}`);
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Fallo al buscar el evento:", error);
    return null;
  }
}

type AvailabilityPayload = {
  startTime: string;
  endTime: string;
};

type ParticipantPayload = {
  name: string;
  availabilities: AvailabilityPayload[];
};

export async function submitAvailability(
  slug: string,
  payload: ParticipantPayload,
  token: string | null
): Promise<Participant> {
    const url = token 
      ? `${API_BASE_URL}/api/events/${slug}/participants/${token}`
      : `${API_BASE_URL}/api/events/${slug}/participants`;
      
    const method = token ? 'PUT' : 'POST';

    const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if(!res.ok) {
        throw new Error('Falló al guardar la disponibilidad');
    }
    return res.json();
}