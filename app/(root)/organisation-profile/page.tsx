import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getOrganisationProfileByClerkId } from "@/lib/actions/organisationprofile.actions";
import { getOrganisationRegistrationByClerkId } from "@/lib/actions/organisation-registration.actions";
import { CreateOrganisationProfileForm } from "@/components/organisation/CreateOrganisationProfileForm";
import { EditOrganisationProfileForm } from "@/components/organisation/EditOrganisationProfileForm";

export default async function OrganisationProfilePage() {
    const user = await currentUser();

    if (!user) redirect("/sign-in");

    const userType = user.publicMetadata?.userType as string | undefined;
    const registration =
        userType === "organisation" ? await getOrganisationRegistrationByClerkId(user.id) : null;
    if (userType === "organisation") {
        if (!registration) redirect("/organisation/register");
        if (registration.status === "pending" || registration.status === "rejected")
            redirect("/organisation/register");
    }

    const profile = await getOrganisationProfileByClerkId(user.id);

    const initialData =
        !profile && registration?.status === "confirmed"
            ? {
                  name: registration.name,
                  email: registration.email,
                  phone: registration.phone,
                  description: registration.aboutOrg,
              }
            : undefined;

    return (
        <div className="flex min-h-screen items-center justify-center bg-white dark:bg-gray-900 px-4 py-12">
            {profile ? (
                <EditOrganisationProfileForm profile={profile} />
            ) : (
                <CreateOrganisationProfileForm initialData={initialData} />
            )}
        </div>
    );
}