// easymeet-frontend/src/app/page.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

async function createEvent(title: string) {
  const payload = {
    title: title,
    description: "Reunión para planificar los próximos pasos.",
    startDate: new Date().toISOString(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
    timezone: "America/Argentina/Buenos_Aires"
  };

  // Usamos la variable de entorno para la URL de la API
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  const res = await fetch(`${apiUrl}/api/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    console.error("Error del backend:", errorBody);
    throw new Error('Falló al crear el evento. Revisa la consola del backend.');
  }
  return res.json();
}

export default function HomePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [createdEvent, setCreatedEvent] = useState<{ slug: string; title: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    
    setIsLoading(true);
    
    try {
      const newEvent = await createEvent(title);
      setCreatedEvent(newEvent); 
    } catch (error) {
      alert((error as Error).message); 
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!createdEvent) return;
    const eventUrl = `${window.location.origin}/event/${createdEvent.slug}`;
    navigator.clipboard.writeText(eventUrl);
    alert('¡Link copiado!');
  };

  if (createdEvent) {
    return (
      <main className="container mx-auto p-8 text-center">
        <h1 className="text-3xl font-bold mb-4">¡Evento {createdEvent.title} Creado!</h1>
        <p className="text-lg text-gray-600 mb-6">Comparte este enlace con tus invitados.</p>
        <div className="flex justify-center items-center gap-2 bg-gray-100 p-4 rounded-lg max-w-lg mx-auto">
          <span className="text-gray-800 font-mono break-all">
            {`${window.location.origin}/event/${createdEvent.slug}`}
          </span>
          <button 
            onClick={copyToClipboard}
            className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 whitespace-nowrap"
          >
            Copiar Link
          </button>
        </div>
        <button
          onClick={() => router.push(`/event/${createdEvent.slug}`)}
          className="mt-8 text-blue-600 hover:underline"
        >
          Ir a la página del evento →
        </button>
      </main>
    );
  }

  return (
    <main className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-4">Crea tu EasyMeet</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <input
          type="text"
          placeholder="Título del Evento"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded text-black"
          required
        />
        <button 
          type="submit" 
          disabled={isLoading} 
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isLoading ? 'Creando...' : 'Crear Evento y Obtener Link'}
        </button>
      </form>
    </main>
  );
}