import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, collection, addDoc, Timestamp } from "firebase/firestore";
import { clientApp } from "@/lib/firebase/index";

const db = getFirestore(clientApp);
const storage = getStorage(clientApp);

export async function uploadBugReport(bugText, bugImage) {
  let imageUrl = "";
  if (bugImage) {
    const imageRef = ref(storage, `bugReports/${Date.now()}_${bugImage.name}`);
    await uploadBytes(imageRef, bugImage);
    imageUrl = await getDownloadURL(imageRef);
  }
  await addDoc(collection(db, "bugReports"), {
    text: bugText,
    imageUrl,
    createdAt: Timestamp.now(),
  });
}
