import React from 'react';
import { Link, router } from '@inertiajs/react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { EventContentArg, EventClickArg } from '@fullcalendar/core';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getStatusColor } from '@/utils/colors';

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

const Calendar: React.FC<CalendarProps> = ({ posts }) => {
    const handleEventClick = (clickInfo: EventClickArg) => {
        const postId = clickInfo.event.id;
        router.visit(route('posts.show', postId));
    };

    const events = posts.map(post => ({
        id: post.id.toString(),
        title: post.title,
        start: post.scheduled_time,
        backgroundColor: getStatusColor(post.status),
        className: 'cursor-pointer hover:opacity-90 transition-opacity',
        extendedProps: {
            content: post.content,
            status: post.status,
            platforms: post.platforms,
        },
    }));

    const renderEventContent = (eventInfo: EventContentArg) => {
        const platforms = eventInfo.event.extendedProps.platforms as Platform[];
        return (
            <div className="flex flex-col gap-0.5 p-1 min-w-0 max-w-full">
                <div className="font-semibold truncate text-xs sm:text-sm">
                    {eventInfo.event.title}
                </div>
                <div className="flex items-center gap-0.5">
                    <span className="px-1.5 py-0.5 text-[10px] sm:text-xs rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 whitespace-nowrap">
                        {platforms[0].name}
                        {platforms.length > 1 && (
                            <span className="ml-0.5 font-medium">+{platforms.length - 1}</span>
                        )}
                    </span>
                </div>
            </div>
        );
    };

    return (
        <Card className="overflow-hidden">
            <CardHeader>
                <CardTitle>Scheduled Posts Calendar</CardTitle>
            </CardHeader>
            <CardContent className="p-4 lg:p-8">
                <div className="overflow-x-auto">
                    <div className="min-h-[700px] w-full">
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
                            eventClick={handleEventClick}
                            height="auto"
                            eventTimeFormat={{
                                hour: '2-digit',
                                minute: '2-digit',
                                meridiem: false,
                            }}
                            slotMinTime="00:00:00"
                            slotMaxTime="24:00:00"
                            dayMaxEvents={3}
                            moreLinkClick="popover"
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default Calendar; 