"use client";

import { useAuthStore } from "@/store/auth";
import slugify from "@/utils/slugify";
import { IconEdit } from "@tabler/icons-react";
import Link from "next/link";
import React from "react";
import { Tooltip } from "react-tooltip";

const EditQuestion = ({
    questionId,
    questionTitle,
    authorId,
}: {
    questionId: string;
    questionTitle: string;
    authorId: string;
}) => {
    const { user } = useAuthStore();
    const isAuthor = user?.$id === authorId;

    if (isAuthor) {
        return (
            <Link
                href={`/questions/${questionId}/${slugify(questionTitle)}/edit`}
                aria-label="Edit question"
                className="flex h-10 w-10 items-center justify-center rounded-full border p-1 duration-200 hover:bg-white/10"
            >
                <IconEdit className="h-4 w-4" />
            </Link>
        );
    }

    return (
        <div
            data-tooltip-id="edit-tooltip"
            data-tooltip-content="Only the author can edit"
            className="flex h-10 w-10 items-center justify-center rounded-full border p-1 opacity-50 cursor-not-allowed"
        >
            <IconEdit className="h-4 w-4" />
            <Tooltip id="edit-tooltip" />
        </div>
    );
};

export default EditQuestion;
