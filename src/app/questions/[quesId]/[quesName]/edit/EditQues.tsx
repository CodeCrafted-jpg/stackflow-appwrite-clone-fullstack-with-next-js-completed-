"use client";

import QuestionForm from "@/components/QuestionForm";
import { useAuthStore } from "@/store/auth";
import slugify from "@/utils/slugify";
import { Models } from "appwrite";
import { useRouter } from "next/navigation";
import React from "react";

const EditQues = ({ question }: { question: Models.Document }) => {
    const { user } = useAuthStore();
    const router = useRouter();

    // The useEffect hook should include all values from the component's scope
    // that it uses. This ensures the effect re-runs if those values change.
    React.useEffect(() => {
        // Redirect if the current user is not the author of the question
        if (question.authorId !== user?.$id) {
            router.push(`/questions/${question.$id}/${slugify(question.title)}`);
        }
    }, [
        question.authorId, // Dependency: check if authorId changes
        question.$id,       // Dependency: used in the redirect path
        question.title,     // Dependency: used in the redirect path
        user?.$id,          // Dependency: check if the user's ID changes (e.g., login/logout)
        router              // Dependency: the router object itself
    ]);

    // This is an immediate check that runs on initial render.
    // The useEffect handles cases where 'user' state might change after initial render.
    if (user?.$id !== question.authorId) {
        return null; // Don't render anything if the user isn't authorized
    }

    return (
        <div className="block pb-20 pt-32">
            <div className="container mx-auto px-4">
                <h1 className="mb-10 mt-4 text-2xl">Edit your public question</h1>

                <div className="flex flex-wrap md:flex-row-reverse">
                    <div className="w-full md:w-1/3"></div> {/* This div seems empty, consider removing if not used */}
                    <div className="w-full md:w-2/3">
                        <QuestionForm question={question} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditQues;