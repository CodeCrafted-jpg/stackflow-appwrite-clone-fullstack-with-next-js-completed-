import { db, questionCollection } from "@/models/name";
import { databases } from "@/models/sever/config";
import React from "react";
import EditQues from "./EditQues";

// Define the expected props for this specific page component.
// This interface clearly outlines the structure of the 'params' object
// that Next.js will provide for this dynamic route.
interface PageProps {
  params: {
    quesId: string; // The dynamic segment for the question ID
    quesName: string; // The dynamic segment for the question name (slug)
  };
  // If this page also accepted search parameters (e.g., /edit?foo=bar),
  // you would add them here:
  // searchParams?: { [key: string]: string | string[] | undefined };
}

// The Page component is an async Server Component.
// It receives the 'params' object from Next.js, which contains the dynamic route segments.
const Page = async ({ params }: PageProps) => {
  // Fetch the question document from your Appwrite database using the quesId from params.
  // This operation runs entirely on the server.
  const question = await databases.getDocument(db, questionCollection, params.quesId);

  // Render the client component 'EditQues', passing the fetched 'question' data as a prop.
  // 'EditQues' is marked with "use client"; at the top of its file.
  return <EditQues question={question} />;
};

export default Page;