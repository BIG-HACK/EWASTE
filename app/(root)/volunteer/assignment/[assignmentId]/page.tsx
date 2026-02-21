import { redirect, notFound } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { getAssignmentById } from "@/lib/actions/volunteer.actions";
import { VolunteerAssignmentDetail } from "@/components/volunteer/VolunteerAssignmentDetail";

export default async function VolunteerAssignmentPage({
    params,
}: {
    params: Promise<{ assignmentId: string }>;
}) {
    const user = await currentUser();
    const userType = user?.publicMetadata?.userType as string | undefined;
    const { assignmentId } = await params;

    if (!user || userType !== "volunteer") redirect("/sign-in");
    const assignment = await getAssignmentById(assignmentId);
    if (!assignment || (assignment as any).volunteerId !== user.id) notFound();

    return <VolunteerAssignmentDetail assignmentId={assignmentId} initialAssignment={assignment} />;
}
