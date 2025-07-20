// easymeet-frontend/src/app/event/[slug]/page.tsx

import { ScheduleGrid } from '@/components/ScheduleGrid';
import { getEventBySlug } from '@/lib/api';
import { notFound } from 'next/navigation';

// ARREGLO DEFINITIVO PARA NEXT.JS 15.4.2:
// En Next.js 15, los params son ahora promesas por defecto
interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Función de página que maneja params como promesa
export default async function EventPage({ params }: PageProps) {
  // Esperamos a que se resuelva la promesa de params
  const resolvedParams = await params;
  const event = await getEventBySlug(resolvedParams.slug);

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