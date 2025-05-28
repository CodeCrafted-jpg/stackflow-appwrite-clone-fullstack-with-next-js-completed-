import { databases, users } from "@/models/sever/config";
import { answerCollection, db, voteCollection, questionCollection } from "@/models/name";
import React from "react";
import Link from "next/link";
import ShimmerButton from "@/components/magicui/shimmer-button";
import QuestionCard from "@/components/QuestionCard";
import { UserPrefs } from "@/store/auth";
import Pagination from "@/components/Pagination";
import Search from "./Search";
import { Query } from "appwrite";

const Page = async ({
    searchParams,
}: {
    searchParams: { page?: string; tag?: string; search?: string };
}) => {
    // searchParams is already an object, no need to await it directly.
    // The values within searchParams might be promises in some cases,
    // but in this typical scenario, they are usually directly accessible.
    const page = searchParams.page || "1";
    const tag = searchParams.tag;
    const search = searchParams.search;

    const queries = [
        Query.orderDesc("$createdAt"),
        Query.offset((+page - 1) * 25),
        Query.limit(25),
    ];

    if (tag) queries.push(Query.equal("tags", tag));
    if (search)
        queries.push(
            Query.or([
                Query.search("title", search),
                Query.search("content", search),
            ])
        );

    const questions = await databases.listDocuments(db, questionCollection, queries);

    // Fetch additional data (author, answers, votes) concurrently using Promise.all
    questions.documents = await Promise.all(
        questions.documents.map(async (ques) => {
            try {
                const [author, answers, votes] = await Promise.all([
                    users.get<UserPrefs>(ques.authorId),
                    databases.listDocuments(db, answerCollection, [
                        Query.equal("questionId", ques.$id),
                        Query.limit(1), // for optimization
                    ]),
                    databases.listDocuments(db, voteCollection, [
                        Query.equal("type", "question"),
                        Query.equal("typeId", ques.$id),
                        Query.limit(1), // for optimization
                    ]),
                ]);

                return {
                    ...ques,
                    totalAnswers: answers.total,
                    totalVotes: votes.total,
                    author: {
                        $id: author.$id,
                        reputation: author.prefs.reputation,
                        name: author.name,
                    },
                };
            } catch (error) {
                console.error("Error fetching data for question:", ques.$id, error);
                // Handle the error appropriately, e.g., return a default object or rethrow
                return {
                    ...ques,
                    totalAnswers: 0,
                    totalVotes: 0,
                    author: {
                        $id: 'unknown',
                        reputation: 0,
                        name: 'Unknown User'
                    }
                }
            }
        })
    );
    return (
        <div className="container mx-auto px-4 pb-20 pt-36">
            <div className="mb-10 flex items-center justify-between">
                <h1 className="text-3xl font-bold">All Questions</h1>
                <Link href="/questions/ask">
                    <ShimmerButton className="pointer-events-none shadow-2xl">
                        <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
                            Ask a question
                        </span>
                    </ShimmerButton>
                </Link>
            </div>
            <div className="mb-4">
                <Search />
            </div>
            <div className="mb-4">
                <p>{questions.total} questions</p>
            </div>
            <div className="mb-4 max-w-3xl space-y-6">
                {questions.documents.map((ques) => (
                    <QuestionCard key={ques.$id} ques={ques} />
                ))}
            </div>
            <Pagination total={questions.total} limit={25} />
        </div>
    );
};

export default Page;
