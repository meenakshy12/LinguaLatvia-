import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, firebaseDb } from "../config/firebase";


export const saveToFirebaseGame02 = async (gameData) => {
    console.log("Saving game data to Firebase:", gameData);
    try{
        const docRef = doc(firebaseDb, "game02", auth.currentUser.uid); // Use the current user's UID as the document ID
        // console.log("Document reference:", docRef);

        // Fetch previous data from Firebase
        const previousDoc = await getDoc(docRef);
        const previousData = previousDoc.exists() ? previousDoc.data() : null;
        // console.log("Previous data from Firebase:", previousData);
        const gameD=previousData?.gameData || []; // Default to an empty array if no previous data
        // Merge previous and latest data, ensuring no duplicates
        const latestDataSet = new Set(gameData.map(item => JSON.stringify(item)));
        // console.log("Latest data set:", latestDataSet);
        const previousDataSet = new Set(gameD.map(item => JSON.stringify(item)));
        latestDataSet.forEach(item => previousDataSet.add(item));
        const combinedData = Array.from(previousDataSet).map(item => JSON.parse(item));
        // Limit to 10 items if necessary
        
        // console.log("Combined game data:", combinedData);
        // Save both previous and latest data
        await setDoc(docRef, {gameData:combinedData}, { merge: true });
        // console.log("Data in document:", { previousData, latestData });
        // console.log("Game data saved successfully!");
    } catch (error) {
        console.error("Error saving game data:", error);
    }
}