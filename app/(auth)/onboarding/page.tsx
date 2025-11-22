import { SelectType } from "@/components/onboarding/SelectType";

export default function OnboardingPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4">
            <SelectType />
        </div>
    );
}