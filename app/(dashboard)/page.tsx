import Calendar from "@/components/calendar";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import db from "@/lib/db";
import { auth } from "@/auth";
import { Prisma } from "@prisma/client";

export default async function Home() {
    const session = await auth();
    const userId = session?.user?.id;

    const appointments = await db.appointment.findMany({
        where: {
            user_id: userId,
        },
        include: {
            car: true,
        },
        orderBy: {
            date: Prisma.SortOrder.asc,
        },
    });

    return (
        <ContentLayout title="Schedule">
            <Calendar appointments={appointments} />
        </ContentLayout>
    );
}
