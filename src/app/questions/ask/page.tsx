"use client";

import QuestionForm from "@/components/QuestionForm";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import React from "react";


const Ask = () => {
    const { user } = useAuthStore();
    const router = useRouter();

    React.useEffect(() => {
        if (!user) {
            router.push("/login");
            
        }
    }, [user, router]);

    return (
        <div className="container mx-auto px-4 py-20">
            <h1 className="text-4xl font-bold mb-6">Ask a Question</h1>
            <QuestionForm />
        </div>
    );
};

export default Ask;
