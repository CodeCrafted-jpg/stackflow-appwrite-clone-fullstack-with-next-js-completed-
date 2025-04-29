import { db } from "../name";
import createAnswerCollection from "./answer.collection";
import createCommentCollection from "./comment.collection";
import createQuestionCollection from "./question.collection";
import createVoteCollection from "./vote.collection";

import { databases } from "./config";

export default async function getOrCreateDB() {
  try {
    await databases.get(db);
    console.log("Database connection");
  } catch (error) {
    // Log the error to the console
    console.error("Error connecting to the database:", error);
    try {
      await databases.create(db, db);
      console.log("Database created");

      // Create collections
      await Promise.all([
        createQuestionCollection(),
        createAnswerCollection(),
        createCommentCollection(),
        createVoteCollection(),
      ]);
      console.log("Collection created");
      console.log("Database connected");
    } catch (error) {
      // Log the error during database or collection creation
      console.error("Error creating databases or collection:", error);
    }
  }

  return databases;
}
