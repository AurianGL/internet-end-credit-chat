import * as functions from 'firebase-functions';
import admin from 'firebase-admin';

admin.initializeApp();

const db = admin.firestore();

exports.detectEvilUsers = functions.firestore
	.document('messages/{msgId')
	.onCreate(async (doc, ctx) => {
    const {text, uid} = doc.data();

    if (text.includes('hello world')) {
      const cleaned = text.toUpperCase()
      await doc.ref.update({text: `I am banned ${cleaned}`})
      await db.collection('banned').doc(uid).set({})
    }
  });
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
