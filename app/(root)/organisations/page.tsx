import { getAllOrganisationProfiles } from "@/lib/actions/organisationprofile.actions";
import { OrganisationCard } from "@/components/organisation/OrganisationCard";

export default async function OrganisationsPage() {
    const organisations = await getAllOrganisationProfiles();

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">E-Waste Collection Organisations</h1>
                <p className="text-gray-600">
                    Browse organisations that collect and recycle electronic waste
                </p>
            </div>

            {organisations && organisations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {organisations.map((organisation: OrganisationProfile) => (
                        <OrganisationCard key={organisation._id} organisation={organisation} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No organisations found yet.</p>
                </div>
            )}
        </div>
    );
}