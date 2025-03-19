import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { EventContentArg } from '@fullcalendar/core';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

interface Platform {
    id: number;
    name: string;
    active: boolean;
}

interface Post {
    id: number;
    title: string;
    content: string;
    status: 'draft' | 'scheduled' | 'published';
    scheduled_time: string;
    platforms: Platform[];
}

interface CalendarProps {
    posts: Post[];
}

const getEventColor = (status: Post['status']) => {
    switch (status) {
        case 'draft':
            return '#6b7280'; // gray-500
        case 'scheduled':
            return '#3b82f6'; // blue-500
        case 'published':
            return '#10b981'; // emerald-500
        default:
            return '#6b7280';
    }
};

const Calendar: React.FC<CalendarProps> = ({ posts }) => {
    const events = posts.map(post => ({
        id: post.id.toString(),
        title: post.title,
        start: post.scheduled_time,
        backgroundColor: getEventColor(post.status),
        extendedProps: {
            content: post.content,
            status: post.status,
            platforms: post.platforms,
        },
    }));

    const renderEventContent = (eventInfo: EventContentArg) => {
        const platforms = eventInfo.event.extendedProps.platforms as Platform[];
        return (
            <div className="flex flex-col gap-1 p-1">
                <div className="font-semibold">{eventInfo.event.title}</div>
                <div className="text-xs flex gap-1">
                    {platforms.map(platform => (
                        <span
                            key={platform.id}
                            className="px-1.5 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        >
                            {platform.name}
                        </span>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Scheduled Posts Calendar</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="">
                    <div className="h-[600px]">
                        <FullCalendar
                            plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
                            initialView="dayGridMonth"
                            headerToolbar={{
                                left: 'prev,next today',
                                center: 'title',
                                right: 'dayGridMonth,timeGridWeek,listWeek'
                            }}
                            events={events}
                            eventContent={renderEventContent}
                            height="auto"
                            eventTimeFormat={{
                                hour: '2-digit',
                                minute: '2-digit',
                                meridiem: false,
                            }}
                            slotMinTime="00:00:00"
                            slotMaxTime="24:00:00"
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default Calendar; 