import React, { createContext, useContext, useState, useEffect } from 'react';

interface Photo {
  id: string;
  name: string;
  uploadedAt: string;
  url: string;
}

interface Event {
  id: string;
  name: string;
  date: string;
  description: string;
  maxDuration: number;
  uploadLink: string;
  createdAt: string;
  photos: Photo[];
}

interface EventContextType {
  events: Event[];
  addEvent: (event: Event) => void;
  updateEvent: (eventId: string, updates: Partial<Event>) => void;
  deleteEvent: (eventId: string) => void;
  getEvent: (eventId: string) => Event | null;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    // Load events from localStorage on component mount
    const loadEvents = () => {
      const loadedEvents: Event[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('event_')) {
          try {
            const event = JSON.parse(localStorage.getItem(key) || '');
            loadedEvents.push(event);
          } catch (error) {
            console.error('Error loading event:', error);
          }
        }
      }
      setEvents(loadedEvents);
    };

    loadEvents();
  }, []);

  const addEvent = (event: Event) => {
    setEvents(prev => [...prev, event]);
    localStorage.setItem(`event_${event.id}`, JSON.stringify(event));
  };

  const updateEvent = (eventId: string, updates: Partial<Event>) => {
    setEvents(prev => 
      prev.map(event => 
        event.id === eventId ? { ...event, ...updates } : event
      )
    );
    
    const existingEvent = localStorage.getItem(`event_${eventId}`);
    if (existingEvent) {
      const event = JSON.parse(existingEvent);
      const updatedEvent = { ...event, ...updates };
      localStorage.setItem(`event_${eventId}`, JSON.stringify(updatedEvent));
    }
  };

  const deleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
    localStorage.removeItem(`event_${eventId}`);
  };

  const getEvent = (eventId: string): Event | null => {
    const event = events.find(e => e.id === eventId);
    if (event) return event;
    
    // Try to load from localStorage if not in state
    const storedEvent = localStorage.getItem(`event_${eventId}`);
    return storedEvent ? JSON.parse(storedEvent) : null;
  };

  return (
    <EventContext.Provider value={{
      events,
      addEvent,
      updateEvent,
      deleteEvent,
      getEvent
    }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEventContext = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEventContext must be used within an EventProvider');
  }
  return context;
};