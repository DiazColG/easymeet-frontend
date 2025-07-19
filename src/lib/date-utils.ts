// easymeet-frontend/src/lib/date-utils.ts
import { eachDayOfInterval, eachHourOfInterval, format } from 'date-fns';
import { es } from 'date-fns/locale';

// Genera todos los slots de 1 hora para un rango de días.
export function generateTimeSlots(startDate: string, endDate: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);
  
    const days = eachDayOfInterval({ start, end });
    const slotsByDay = [];
  
    for (const day of days) {
      const dayStart = new Date(day.setHours(0, 0, 0, 0));
      const dayEnd = new Date(day.setHours(23, 0, 0, 0));
      
      const daySlots = eachHourOfInterval({ start: dayStart, end: dayEnd })
        .map(slotDate => ({
            iso: slotDate.toISOString(),
            time: format(slotDate, 'HH:mm'),
        }));

      slotsByDay.push({
          dateFormatted: format(day, 'eeee dd', { locale: es }),
          slots: daySlots,
      });
    }
    return slotsByDay;
}