"use client";

import { databases } from "@/models/client/config";
import { db, voteCollection } from "@/models/name";
import { useAuthStore } from "@/store/auth";
import { cn } from "@/lib/utils";
import { IconCaretUpFilled, IconCaretDownFilled } from "@tabler/icons-react";
import { Models, Query } from "appwrite";
import { useRouter } from "next/navigation";
import React from "react";

type VoteType = "question" | "answer";

interface VoteButtonsProps {
    type: VoteType;
    id: string;
    upvotes: Models.DocumentList<Models.Document>;
    downvotes: Models.DocumentList<Models.Document>;
    className?: string;
}

interface VoteResponse {
    data: {
        voteResult: number;
        document: Models.Document;
    };
    message?: string;
}

const VoteButtons: React.FC<VoteButtonsProps> = ({
    type,
    id,
    upvotes,
    downvotes,
    className,
}) => {
    const [votedDocument, setVotedDocument] = React.useState<Models.Document | null | undefined>();
    const [voteResult, setVoteResult] = React.useState<number>(upvotes.total - downvotes.total);

    const { user } = useAuthStore();
    const router = useRouter();

    React.useEffect(() => {
        const fetchVote = async () => {
            if (!user) return;

            try {
                const response = await databases.listDocuments(db, voteCollection, [
                    Query.equal("type", type),
                    Query.equal("typeId", id),
                    Query.equal("votedById", user.$id),
                ]);
                setVotedDocument(response.documents[0] || null);
            } catch (err) {
                console.error("Failed to fetch vote", err);
                setVotedDocument(null);
            }
        };

        fetchVote();
    }, [user, id, type]);

    const handleVote = async (voteStatus: "upvoted" | "downvoted") => {
        if (!user) {
            router.push("/login");
            return;
        }

        if (votedDocument === undefined) return;

        try {
            const response = await fetch("/api/vote", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    votedById: user.$id,
                    voteStatus,
                    type,
                    typeId: id,
                }),
            });

            const data: VoteResponse = await response.json();

            if (!response.ok) throw new Error(data.message || "Failed to process vote");

            setVoteResult(data.data.voteResult);
            setVotedDocument(data.data.document);
        } catch (error: unknown) {
            const err = error as { message?: string };
            window.alert(err?.message || "Something went wrong");
        }
    };

    return (
        <div className={cn("flex shrink-0 flex-col items-center justify-start gap-y-4", className)}>
            <button
                className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border p-1 duration-200 hover:bg-white/10",
                    votedDocument?.voteStatus === "upvoted"
                        ? "border-orange-500 text-orange-500"
                        : "border-white/30"
                )}
                onClick={() => handleVote("upvoted")}
            >
                <IconCaretUpFilled />
            </button>

            <span>{voteResult}</span>

            <button
                className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border p-1 duration-200 hover:bg-white/10",
                    votedDocument?.voteStatus === "downvoted"
                        ? "border-orange-500 text-orange-500"
                        : "border-white/30"
                )}
                onClick={() => handleVote("downvoted")}
            >
                <IconCaretDownFilled />
            </button>
        </div>
    );
};

export default VoteButtons;
