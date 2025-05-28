// This line explicitly tells Next.js to run this page in the Node.js runtime.
// This is crucial when you are using server-side libraries like 'node-appwrite'
// that rely on Node.js specific APIs (e.g., 'process').
export const runtime = 'nodejs';

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


const Page = async ({ params }: PageProps) => {

  const question = await databases.getDocument(db, questionCollection, params.quesId);

 
  return <EditQues question={question} />;
};

export default Page;