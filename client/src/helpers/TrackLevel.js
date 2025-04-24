import { doc, getDoc } from "firebase/firestore";
import { auth, firebaseDb } from "../config/firebase";

async function fetchGameData(uid) {
    const documents = ["game01", "game02", "game03"];
    let totalCount = 0;

    for (const docName of documents) {
        const docRef = doc(firebaseDb, docName, uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            totalCount += Array.isArray(data.gameData) ? data.gameData.length : 0; // Assuming 'items' is the array in the document
            // console.log(`Fetched data from ${docName} :`, totalCount);
        }
    }

    return totalCount;
}

function generateDynamicThresholds(totalCount) {
    const thresholds = [];
    let score = 20; // Initial threshold for level 1
    let increment = 20; // Initial increment for level progression

    while (score <= totalCount) {
        thresholds.push(score);
        score += increment;
        increment = Math.min(increment + 10, 100); // Gradually increase increment, capped at 100
    }

    return thresholds;
}

async function trackLevelProgression() {
    const totalScore = await fetchGameData(auth.currentUser.uid);

    let thresholds = generateDynamicThresholds(Math.max(totalScore, 20)); // Ensure at least level 1 threshold is generated

    // Ensure thresholds cover the user's totalScore
    while (totalScore > thresholds[thresholds.length - 1]) {
        const lastThreshold = thresholds[thresholds.length - 1];
        const increment = Math.min((thresholds.length + 1) * 10, 100); // Increment logic
        thresholds.push(lastThreshold + increment);
    }

    let levelNo = 1; // Default to level 1
    let maximumLevelScore = thresholds[0]; // Default to level 1 maximum score

    if (totalScore > 0) {
        for (let i = 0; i < thresholds.length; i++) {
            if (totalScore <= thresholds[i]) {
                levelNo = i + 1;
                maximumLevelScore = thresholds[i];
                break;
            }
        }
    }

    // console.log(`Level No: ${levelNo}, Maximum Level Score: ${maximumLevelScore}, Your Score: ${totalScore}`);
    return { levelNo, maximumLevelScore, yourScore: totalScore,percentage: Math.round((totalScore / maximumLevelScore) * 100) };
}

export { trackLevelProgression };
