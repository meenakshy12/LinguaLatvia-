import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, firebaseDb } from "../config/firebase";


export const saveToFirebaseGame01 = async (latestData) => {
    // console.log("Saving to Firebase:", { latestData });
    try {
        const docRef = doc(firebaseDb, "game01", auth.currentUser.uid); // Use the current user's UID as the document ID
        // console.log("Document reference:", docRef);

        // Fetch previous data from Firebase
        const previousDoc = await getDoc(docRef);
        const previousData = previousDoc.exists() ? previousDoc.data() : null;
        // console.log("Previous data from Firebase:", previousData);
        const gameD=previousData?.gameData || []; // Default to an empty array if no previous data
        // Merge previous and latest data, ensuring no duplicates
        const latestDataSet = new Set(latestData.map(item => JSON.stringify(item)));
        const previousDataSet = new Set(gameD.map(item => JSON.stringify(item)));
        latestDataSet.forEach(item => previousDataSet.add(item));
        const combinedData = Array.from(previousDataSet).map(item => JSON.parse(item));
        // Limit to 10 items if necessary
        
        // console.log("Combined game data:", combinedData);
        // Save both previous and latest data
        await setDoc(docRef, {gameData:combinedData}, { merge: true });
        console.log("Data in document:", { previousData, latestData });
        // console.log("Game data saved successfully!");
    } catch (error) {
        console.error("Error saving game data:", error);
    }
};


export const getFromFirebaseGame01 = async () => {
    try {
        const docRef = doc(firebaseDb, "game01", auth.currentUser.uid); // Use the current user's UID as the document ID
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            // console.log("Document data:", docSnap.data());
            return docSnap.data().gameData || []; // Return gameData or an empty array if not found
        } else {
            console.log("No such document!");
            return []; // Return an empty array if no document found
        }
    } catch (error) {
        console.error("Error fetching game data:", error);
        return []; // Return an empty array in case of error
    }
};
   



