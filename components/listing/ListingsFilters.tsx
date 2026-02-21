"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Filter } from "lucide-react";

interface ListingsFiltersProps {
    categoryOptions: string[];
    currentCategory?: string[];
    currentCondition?: string;
    currentYearsUsedMin?: number;
    currentYearsUsedMax?: number;
    currentSort?: string;
}

export function ListingsFilters({
    categoryOptions,
    currentCategory = [],
    currentCondition = "all",
    currentYearsUsedMin,
    currentYearsUsedMax,
    currentSort = "newest",
}: ListingsFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const setParams = (updates: Record<string, string | number | undefined | string[]>) => {
        const next = new URLSearchParams(searchParams.toString());
        Object.entries(updates).forEach(([key, value]) => {
            if (value === undefined || value === "" || value === "all") {
                next.delete(key);
            } else if (Array.isArray(value)) {
                next.delete(key);
                value.forEach((v) => next.append(key, v));
            } else {
                next.set(key, String(value));
            }
        });
        router.push(`/listings?${next.toString()}`);
    };

    const toggleCategory = (cat: string) => {
        const next = currentCategory.includes(cat)
            ? currentCategory.filter((c) => c !== cat)
            : [...currentCategory, cat];
        setParams({ category: next.length ? next : undefined });
    };

    return (
        <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 mb-3">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Filters</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                    <Label>Category</Label>
                    <div className="flex flex-wrap gap-2">
                        {categoryOptions.map((cat) => (
                            <Button
                                key={cat}
                                type="button"
                                variant={currentCategory.includes(cat) ? "default" : "outline"}
                                size="sm"
                                onClick={() => toggleCategory(cat)}
                            >
                                {cat}
                            </Button>
                        ))}
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Condition</Label>
                    <select
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        value={currentCondition}
                        onChange={(e) => setParams({ condition: e.target.value })}
                    >
                        <option value="all">All</option>
                        <option value="working">Working</option>
                        <option value="needs_repair">Needs repair</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <Label>Years used (min – max)</Label>
                    <div className="flex gap-2 items-center">
                        <Input
                            type="number"
                            min={0}
                            max={50}
                            placeholder="Min"
                            value={currentYearsUsedMin ?? ""}
                            onChange={(e) => {
                                const v = e.target.value ? Number(e.target.value) : undefined;
                                setParams({ yearsUsedMin: v, yearsUsedMax: currentYearsUsedMax });
                            }}
                        />
                        <span className="text-muted-foreground">–</span>
                        <Input
                            type="number"
                            min={0}
                            max={50}
                            placeholder="Max"
                            value={currentYearsUsedMax ?? ""}
                            onChange={(e) => {
                                const v = e.target.value ? Number(e.target.value) : undefined;
                                setParams({ yearsUsedMax: v, yearsUsedMin: currentYearsUsedMin });
                            }}
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Sort</Label>
                    <select
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        value={currentSort}
                        onChange={(e) => setParams({ sort: e.target.value })}
                    >
                        <option value="newest">Newest first</option>
                        <option value="oldest">Oldest first</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
