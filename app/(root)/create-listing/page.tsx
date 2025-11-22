import { CreateListingForm } from "@/components/listing/CreateListingForm";

export default function CreateListingPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50/50 dark:bg-gray-900 px-4 py-12">
            <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
            <CreateListingForm />
        </div>
    );
}