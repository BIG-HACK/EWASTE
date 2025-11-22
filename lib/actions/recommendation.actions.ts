"use server";

import OpenAI from "openai";
import { getAllOrganisationProfiles } from "./organisationprofile.actions";
import { dummyOrganisations } from "@/constants";

export async function getRecommendedOrganisations(listing: {
    title: string;
    description: string;
    tags?: string[];
}) {
    try {
        // 1. Fetch all organisations
        // Use dummy data as requested by user preference or if DB is empty
        // let organisations = await getAllOrganisationProfiles();
        let organisations = dummyOrganisations;

        if (!organisations || organisations.length === 0) {
            organisations = dummyOrganisations;
        }

        // 2. Check for OpenAI API Key
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            console.warn("OPENAI_API_KEY is not set. Using keyword matching fallback.");

            // Keyword matching algorithm
            const searchTerms = [
                ...listing.title.toLowerCase().split(/\s+/),
                ...listing.description.toLowerCase().split(/\s+/),
                ...(listing.tags || []).map(t => t.toLowerCase())
            ].filter(t => t.length > 2); // Ignore short words

            const scoredOrgs = organisations.map((org: any) => {
                let score = 0;
                const orgText = [
                    org.name,
                    org.description,
                    ...(org.needs || []),
                    ...(org.tags || [])
                ].join(" ").toLowerCase();

                searchTerms.forEach(term => {
                    if (orgText.includes(term)) score += 1;
                });

                return { org, score };
            });

            // Sort by score descending
            scoredOrgs.sort((a: any, b: any) => b.score - a.score);

            // Return top 3
            return JSON.parse(JSON.stringify(scoredOrgs.slice(0, 3).map((item: any) => item.org)));
        }

        const openai = new OpenAI({ apiKey });

        // 3. Construct the prompt
        const listingContext = `
            Title: ${listing.title}
            Description: ${listing.description}
            Tags: ${listing.tags?.join(", ") || "None"}
        `;

        const orgsContext = organisations.map((org: any) => `
            ID: ${org._id}
            Name: ${org.name}
            Description: ${org.description}
            Needs: ${org.needs?.join(", ") || "General e-waste"}
        `).join("\n");

        const prompt = `
            You are an expert at matching e-waste donors with the right NGOs.
            
            Listing Details:
            ${listingContext}

            Available NGOs:
            ${orgsContext}

            Task:
            Identify the top 3 NGOs that are the best match for this listing. 
            Consider the NGO's specific needs and their description.
            
            Return ONLY a valid JSON array of the top 3 NGO IDs, ordered by relevance.
            Example: ["org_id_1", "org_id_2", "org_id_3"]
        `;

        // 4. Call OpenAI
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a helpful matching assistant that outputs only JSON." },
                { role: "user", content: prompt }
            ],
            temperature: 0.1,
        });

        const content = response.choices[0].message.content;
        if (!content) throw new Error("No content from OpenAI");

        // 5. Parse response
        // Robust parsing to find JSON array within text
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        const jsonString = jsonMatch ? jsonMatch[0] : content;

        let recommendedIds: string[] = [];
        try {
            recommendedIds = JSON.parse(jsonString);
        } catch (e) {
            console.error("Failed to parse JSON from LLM:", content);
            throw new Error("Invalid JSON format from LLM");
        }

        if (!Array.isArray(recommendedIds)) throw new Error("Invalid response format: not an array");

        // 6. Map IDs back to full objects
        const recommendedOrgs = recommendedIds
            .map((id: string) => organisations.find((org: any) => org._id === id))
            .filter(Boolean);

        return JSON.parse(JSON.stringify(recommendedOrgs));

    } catch (error) {
        console.error("Error getting recommendations:", error);

        // Fallback: Use keyword matching if LLM fails
        console.log("Falling back to keyword matching...");
        const searchTerms = [
            ...listing.title.toLowerCase().split(/\s+/),
            ...listing.description.toLowerCase().split(/\s+/),
            ...(listing.tags || []).map(t => t.toLowerCase())
        ].filter(t => t.length > 2);

        const scoredOrgs = dummyOrganisations.map((org: any) => {
            let score = 0;
            const orgText = [
                org.name,
                org.description,
                ...(org.needs || []),
                ...(org.tags || [])
            ].join(" ").toLowerCase();

            searchTerms.forEach(term => {
                if (orgText.includes(term)) score += 1;
            });

            return { org, score };
        });

        scoredOrgs.sort((a: any, b: any) => b.score - a.score);
        return JSON.parse(JSON.stringify(scoredOrgs.slice(0, 3).map((item: any) => item.org)));
    }
}

