// easymeet-frontend/src/app/event/[slug]/page.tsx

import { ScheduleGrid } from '@/components/ScheduleGrid';
import { getEventBySlug } from '@/lib/api';
import { notFound } from 'next/navigation';

// ARREGLO DEFINITIVO:
// Definimos el tipo 'Props' con el formato completo que Next.js espera
// para una página, incluyendo 'params' y 'searchParams'.
type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

// Usamos el tipo 'Props' en nuestra función de página.
export default async function EventPage({ params }: Props) {
  const event = await getEventBySlug(params.slug);

  if (!event) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{event.title}</h1>
        {event.description && <p className="mt-2 text-lg text-gray-500">{event.description}</p>}
        <p className="mt-2 text-sm text-gray-400">
          Horarios en la zona horaria: {event.timezone}
        </p>
      </header>
      
      <ScheduleGrid eventData={event} />
    </div>
  );
}