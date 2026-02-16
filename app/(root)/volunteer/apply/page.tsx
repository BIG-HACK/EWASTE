import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { getVolunteerByClerkId } from "@/lib/actions/volunteer.actions";
import { VolunteerApplicationForm } from "@/components/volunteer/VolunteerApplicationForm";

export default async function VolunteerApplyPage() {
    const user = await currentUser();
    const userType = user?.publicMetadata?.userType as string | undefined;

    if (!user) redirect("/sign-in");
    if (userType !== "volunteer") redirect("/");

    const volunteer = await getVolunteerByClerkId(user.id);

    return (
        <div className="container mx-auto flex min-h-[80vh] items-center justify-center px-4 py-12">
            <div className="w-full max-w-xl">
                {volunteer ? (
                    volunteer.status === "pending" ? (
                        <div className="rounded-lg border-2 border-amber-200 bg-amber-50/50 p-8 text-center">
                            <p className="text-lg font-medium text-amber-900">
                                Your application has been submitted.
                            </p>
                            <p className="mt-2 text-amber-800">
                                Your account will be verified within <strong>3–5 business days</strong>.
                                We’ll contact you once you’re approved to start picking up e-waste.
                            </p>
                        </div>
                    ) : volunteer.status === "rejected" ? (
                        <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center">
                            <p className="font-medium text-red-900">Your application was not approved.</p>
                            <p className="mt-2 text-sm text-red-800">Contact us if you have questions.</p>
                        </div>
                    ) : (
                        <p className="text-center text-muted-foreground">You’re already approved. Head to your dashboard.</p>
                    )
                ) : (
                    <VolunteerApplicationForm />
                )}
            </div>
        </div>
    );
}
