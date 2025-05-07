import { doc, getDoc } from "firebase/firestore";
import { auth, firebaseDb } from "../config/firebase";

async function fetchGameData(uid, databaseName) {
    let totalCount = 0;

    const docRef = doc(firebaseDb, databaseName, uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        totalCount += Array.isArray(data.gameData) ? data.gameData.length : 0; // Assuming 'gameData' is the array in the document
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

async function trackLevelProgression(databaseName="game01") {
    const totalScore = await fetchGameData(auth.currentUser.uid, databaseName);

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

    return { levelNo, maximumLevelScore, yourScore: totalScore, percentage: Math.round((totalScore / maximumLevelScore) * 100) };
}

export { trackLevelProgression };
