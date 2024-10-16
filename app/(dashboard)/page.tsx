import Calendar from "@/components/calendar";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import db from "@/lib/db";
import { auth } from "@/auth";

export default async function Home() {
    const session = await auth();
    const userId = session?.user?.id;

    const events = await db.appointment.findMany({
        where: {
            user_id: userId
        },
        include: {
            car: true
        }
    });

    return (
        <ContentLayout title="Schedule">
            <Calendar events={events}/>
        </ContentLayout>
    );
}
