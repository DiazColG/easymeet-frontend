// easymeet-frontend/src/components/ScheduleGrid.tsx
"use client";

import { useState, useMemo, useEffect } from 'react';
import { generateTimeSlots } from '@/lib/date-utils';
import { EventData } from '@/lib/types';
import { submitAvailability } from '@/lib/api';
import { useRouter } from 'next/navigation';

export function ScheduleGrid({ eventData }: { eventData: EventData }) {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [mySelection, setMySelection] = useState<Set<string>>(new Set());
  const [participantToken, setParticipantToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem(`token-${eventData.slug}`);
    if (token) {
      setParticipantToken(token);
      const me = eventData.participants.find(p => p.token === token);
      if (me) {
        setUserName(me.name);
        const initialSelection = new Set(me.availabilities.map(a => a.startTime));
        setMySelection(initialSelection);
      }
    }
  }, [eventData.slug, eventData.participants]);

  const timeSlotsByDay = useMemo(
    () => generateTimeSlots(eventData.startDate, eventData.endDate),
    [eventData.startDate, eventData.endDate]
  );
  
  const heatmap = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of eventData.participants) {
      for (const a of p.availabilities) {
        counts[a.startTime] = (counts[a.startTime] || 0) + 1;
      }
    }
    return counts;
  }, [eventData.participants]);
  
  const handleSlotClick = (isoSlot: string) => {
    setMySelection(prev => {
        const newSelection = new Set(prev);
        if (newSelection.has(isoSlot)) newSelection.delete(isoSlot);
        else newSelection.add(isoSlot);
        return newSelection;
    });
  };

  const handleSubmit = async () => {
    if (!userName) {
        alert("Por favor, ingresa tu nombre.");
        return;
    }
    setIsLoading(true);

    const availabilityPayload = Array.from(mySelection).map(slot => ({
        startTime: slot,
        endTime: new Date(new Date(slot).getTime() + 60 * 60 * 1000).toISOString(),
    }));
    
    try {
        const participant = await submitAvailability(
            eventData.slug, 
            { name: userName, availabilities: availabilityPayload }, 
            participantToken
        );
        localStorage.setItem(`token-${eventData.slug}`, participant.token);
        alert(participantToken ? 'Disponibilidad actualizada!' : 'Disponibilidad guardada!');
        router.refresh(); // Refresca los datos de la página
    } catch (error) {
        alert("Hubo un error al guardar. Intenta de nuevo.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {timeSlotsByDay.map(({ dateFormatted, slots }) => (
          <div key={dateFormatted}>
            <h3 className="font-bold text-center text-sm mb-2">{dateFormatted}</h3>
            <div className="space-y-1">
              {slots.map(({ iso, time }) => {
                const isSelected = mySelection.has(iso);
                const heatLevel = heatmap[iso] || 0;
                let bgColor = 'bg-gray-100 hover:bg-gray-300';
                if (heatLevel > 0) bgColor = `bg-green-200`;
                if (heatLevel > 2) bgColor = `bg-green-400`;
                if (heatLevel > 5) bgColor = `bg-green-600`;
                if (isSelected) bgColor = `bg-blue-500 text-white`;

                return (
                  <button
                    key={iso}
                    onClick={() => handleSlotClick(iso)}
                    className={`w-full p-2 text-xs rounded transition-colors text-black border ${bgColor}`}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
        
      <div className="mt-8 pt-6 border-t">
        <h3 className="text-xl font-bold">Tu Disponibilidad</h3>
        <p className="text-gray-600 mb-4">Ingresa tu nombre para guardar tus horarios.</p>
        <div className="flex items-center gap-4">
          <input
              type="text"
              placeholder="Tu Nombre"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="p-2 border rounded w-full max-w-xs text-black"
          />
          <button 
            onClick={handleSubmit}
            disabled={isLoading || !userName} 
            className="bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
          >
              {isLoading ? 'Guardando...' : (participantToken ? 'Actualizar Horarios' : 'Guardar Horarios')}
          </button>
        </div>
      </div>
    </div>
  );
}