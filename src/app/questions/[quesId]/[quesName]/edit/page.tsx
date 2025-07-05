// app/questions/[quesId]/[quesName]/edit/page.tsx

export const runtime = 'nodejs';

import { db, questionCollection } from "@/models/name";
import { databases } from "@/models/sever/config";
import EditQues from "./EditQues";

interface PageProps {
  params: {
    quesId: string;
    quesName: string;
  };
}

export default async function Page({ params }: PageProps) {
  const question = await databases.getDocument(db, questionCollection, params.quesId);
  return <EditQues question={question} />;
}
