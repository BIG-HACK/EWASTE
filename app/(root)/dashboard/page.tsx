import { UserListings } from "@/components/listing/userListings";
import { OrganisationMatches } from "@/components/organisation/OrganisationMatches";
import { currentUser } from "@clerk/nextjs/server";

export default async function Dashboard() {
    const user = await currentUser();
    const userType = user?.publicMetadata?.userType as string | undefined;

    if (userType === 'organisation') {
        return <OrganisationMatches />;
    }

    return <UserListings />;
}
