import { getPublicListings } from "@/lib/actions/listing.actions";
import { PublicTechnologyCard } from "@/components/listing/PublicTechnologyCard";
import { ListingsFilters } from "@/components/listing/ListingsFilters";

const CATEGORY_OPTIONS = [
    "Laptops",
    "Monitors",
    "Phones & Tablets",
    "Desktops & Components",
    "Cables & Accessories",
];

export default async function PublicListingsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const params = await searchParams;
    const category = params.category;
    const condition = params.condition as "working" | "needs_repair" | "all" | undefined;
    const yearsUsedMin = params.yearsUsedMin != null ? Number(params.yearsUsedMin) : undefined;
    const yearsUsedMax = params.yearsUsedMax != null ? Number(params.yearsUsedMax) : undefined;
    const sort = (params.sort as "newest" | "oldest") || "newest";

    const categories = category
        ? Array.isArray(category)
            ? category
            : [category]
        : undefined;

    const listings = await getPublicListings({
        category: categories,
        condition: condition || "all",
        yearsUsedMin: Number.isFinite(yearsUsedMin) ? yearsUsedMin : undefined,
        yearsUsedMax: Number.isFinite(yearsUsedMax) ? yearsUsedMax : undefined,
        sort,
    });

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Used technology listings</h1>
                <p className="text-muted-foreground">
                    Browse donated e-waste items. Click a card to see full details.
                </p>
            </div>

            <ListingsFilters
                categoryOptions={CATEGORY_OPTIONS}
                currentCategory={categories}
                currentCondition={condition}
                currentYearsUsedMin={yearsUsedMin}
                currentYearsUsedMax={yearsUsedMax}
                currentSort={sort}
            />

            {listings.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6">
                    {listings.map((listing: Listing) => (
                        <PublicTechnologyCard key={listing._id} listing={listing} />
                    ))}
                </div>
            ) : (
                <div className="rounded-xl border border-dashed bg-muted/30 p-12 text-center mt-6">
                    <p className="font-medium">No listings match your filters</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Try adjusting the filters or check back later for new donations.
                    </p>
                </div>
            )}
        </div>
    );
}
