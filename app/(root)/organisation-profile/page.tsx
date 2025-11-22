import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getOrganisationProfileByClerkId } from "@/lib/actions/organisationprofile.actions";
import { CreateOrganisationProfileForm } from "@/components/organisation/CreateOrganisationProfileForm";
import { EditOrganisationProfileForm } from "@/components/organisation/EditOrganisationProfileForm";

export default async function OrganisationProfilePage() {
    const user = await currentUser();

    if (!user) {
        redirect("/sign-in");
    }

    // Check if organisation profile exists
    const profile = await getOrganisationProfileByClerkId(user.id);

    return (
        <div className="flex min-h-screen items-center justify-center bg-white dark:bg-gray-900 px-4 py-12">
            {profile ? (
                <EditOrganisationProfileForm profile={profile} />
            ) : (
                <CreateOrganisationProfileForm />
            )}
        </div>
    );
}