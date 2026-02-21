import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { getOrganisationRegistrationByClerkId } from "@/lib/actions/organisation-registration.actions";
import { getOrganisationProfileByClerkId } from "@/lib/actions/organisationprofile.actions";
import { OrganisationRegistrationForm } from "@/components/organisation/OrganisationRegistrationForm";

export default async function OrganisationRegisterPage() {
    const user = await currentUser();
    const userType = user?.publicMetadata?.userType as string | undefined;

    if (!user) redirect("/sign-in");
    if (userType !== "organisation") redirect("/");

    const registration = await getOrganisationRegistrationByClerkId(user.id);
    const profile = await getOrganisationProfileByClerkId(user.id);

    // Already has profile → go to dashboard
    if (profile) redirect("/dashboard");
    // Confirmed but no profile yet → go to profile setup
    if (registration?.status === "confirmed") redirect("/organisation-profile");
    // Rejected
    if (registration?.status === "rejected") {
        return (
            <div className="container mx-auto flex min-h-[80vh] items-center justify-center px-4 py-12">
                <div className="w-full max-w-xl rounded-lg border border-red-200 bg-red-50 p-8 text-center">
                    <p className="font-medium text-red-900">Your organisation registration was not approved.</p>
                    <p className="mt-2 text-sm text-red-800">Contact us if you have questions.</p>
                </div>
            </div>
        );
    }
    // Pending: show "we'll confirm in 3 days" message (handled inside form after submit, or show same message if already pending)
    if (registration?.status === "pending") {
        return (
            <div className="container mx-auto flex min-h-[80vh] items-center justify-center px-4 py-12">
                <div className="w-full max-w-xl rounded-lg border-2 border-indigo-200 bg-indigo-50/50 p-8 text-center">
                    <p className="text-lg font-medium text-indigo-900">
                        Your registration has been submitted.
                    </p>
                    <p className="mt-2 text-indigo-800">
                        We will confirm your identity within <strong>3 business days</strong>. We’ll
                        contact you once you’re approved to set up your organisation profile.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto flex min-h-[80vh] items-center justify-center px-4 py-12">
            <OrganisationRegistrationForm />
        </div>
    );
}
