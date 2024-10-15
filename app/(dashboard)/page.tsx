import Calendar from "@/components/Calendar";
import { ContentLayout } from "@/components/admin-panel/content-layout";

export default function Home() {
    return (
        <ContentLayout title="Schedule">
            <Calendar />
        </ContentLayout>
    );
}
