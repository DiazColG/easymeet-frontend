// easymeet-frontend/src/app/event/[slug]/page.tsx

import { ScheduleGrid } from '@/components/ScheduleGrid';
import { getEventBySlug } from '@/lib/api';
import { notFound } from 'next/navigation';

// SOLUCIÓN DEFINITIVA PARA NEXT.JS 15.4.2 + VERCEL:
// Usar la estructura exacta que Vercel espera sin destructuring directo
interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Función de página que evita destructuring directo y usa props.params
export default async function EventPage(props: PageProps) {
  // Resolver la promesa usando props.params en lugar de destructuring
  const params = await props.params;
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