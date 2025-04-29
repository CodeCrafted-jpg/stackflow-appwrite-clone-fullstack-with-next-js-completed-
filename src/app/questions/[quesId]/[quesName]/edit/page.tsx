// src/app/questions/[quesId]/[quesName]/edit/page.tsx

import { db, questionCollection } from "@/models/name";
import { databases } from "@/models/sever/config";
import React from "react";
import EditQues from "./EditQues";

export default async function EditPage({
  params,
}: {
  params: { quesId: string; quesName: string };
}) {
  const question = await databases.getDocument(db, questionCollection, params.quesId);
  return <EditQues question={question} />;
}
