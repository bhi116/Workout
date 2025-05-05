import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import dayjs from 'dayjs';

export default function Calendar() {

    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchTrainings = async () => {
        const res = await fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/trainings');
        const data = await res.json();

        const trainings = data._embedded.trainings;

        // haetaan asiakastiedot jokaiselle harjoitukselle
        const trainingEvents = await Promise.all(trainings.map(async (training) => {
            const customerUrl = training._links.customer.href;

            try {
                const customerRes = await fetch(customerUrl);
                const customerData = await customerRes.json();

                const start = dayjs(training.date);
                const end = start.add(training.duration, 'minute');

                return {
                    title: `${training.activity} / ${customerData.firstname} ${customerData.lastname}`,
                    start: start.toISOString(),
                    end: end.toISOString(),
                };
            } catch (error) {
                console.error('Virhe asiakkaan haussa:', error);
                return null;
            }
        }));

        // poistetaan null arvot
        setEvents(trainingEvents.filter(event => event !== null));
        };

        fetchTrainings();
    }, []);

    return (
        <div style={{ padding: '15px', fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif' }}>
            <h1>Calendar</h1>
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                    left: 'prev next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay',
                }}
                events={events}
                height="auto"
            />
        </div>
    );
}