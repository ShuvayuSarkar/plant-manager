import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, setDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, query, where, orderBy, limit, arrayUnion } from 'firebase/firestore';
import { clientApp } from '..';

export const db = getFirestore(clientApp);
export const auth = getAuth(clientApp);


function getCurrentUserAsync() {
    return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe(); // Unsubscribe` immediately after first call
            if (user) {
                resolve(user);
            } else {
                reject(new Error("No user is currently logged in"));
            }
        });
    });
}


async function getCurrentUserId() {
    const user = await getCurrentUserAsync();
    return user.uid;
}

async function createUserData(collectionName, data) {
    try {
        const userId = await getCurrentUserId();
        const docRef = await addDoc(collection(db, collectionName), {
            trades: data,
            userId: userId,
            created_at: new Date(),
            updated_at: new Date()
        });
        return { id: docRef.id, userId };
    } catch (error) {
        console.error("Error creating user data: ", error);
        throw error;
    }
}

async function getUserData(collectionName) {
    try {
        const userId = await getCurrentUserId();
        const q = query(
            collection(db, collectionName),
            where("userId", "==", userId)
        );

        const querySnapshot = await getDocs(q);
        const userDocuments = [];

        querySnapshot.forEach((doc) => {
            userDocuments.push({ id: doc.id, ...doc.data() });
        });

        return userDocuments;
    } catch (error) {
        console.error("Error getting user data: ", error);
        throw error;
    }
}

async function getUserDocumentById(collectionName, documentId) {
    try {
        const userId = await getCurrentUserId();
        const docRef = doc(db, collectionName, documentId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();

            // Check if document belongs to current user
            if (data.userId === userId) {
                return { id: docSnap.id, ...data };
            } else {
                throw new Error('Access denied: Document does not belong to current user');
            }
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error getting user document: ", error);
        throw error;
    }
}

async function getUserDataWithFilter(collectionName, field, operator, value, orderByField = null, limitCount = null) {
    try {
        const userId = await getCurrentUserId();
        let q = query(
            collection(db, collectionName),
            where("userId", "==", userId),
            where(field, operator, value)
        );

        if (orderByField) {
            q = query(q, orderBy(orderByField));
        }

        if (limitCount) {
            q = query(q, limit(limitCount));
        }

        const querySnapshot = await getDocs(q);
        const userDocuments = [];

        querySnapshot.forEach((doc) => {
            userDocuments.push({ id: doc.id, ...doc.data() });
        });

        return userDocuments;
    } catch (error) {
        console.error("Error getting filtered user data: ", error);
        throw error;
    }
}

async function updateUserDocument(collectionName, documentId, updateData) {
    try {
        const userId = await getCurrentUserId();
        const docRef = doc(db, collectionName, documentId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            throw new Error("Document does not exist");
        }

        const data = docSnap.data();
        if (data.userId !== userId) {
            throw new Error("Access denied: Document does not belong to current user");
        }

        await updateDoc(docRef, {
            ...updateData,
            updated_at: new Date(),
        });

        console.log("✅ Document updated successfully");
        return { id: documentId, ...updateData };
    } catch (error) {
        console.error("Error updating user document: ", error);
        throw error;
    }
}


async function deleteUserDocument(collectionName, documentId) {
    try {
        const userId = await getCurrentUserId();
        const docRef = doc(db, collectionName, documentId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            throw new Error('Document does not exist');
        }

        const data = docSnap.data();
        if (data.userId !== userId) {
            throw new Error('Access denied: Document does not belong to current user');
        }

        // Delete the document
        await deleteDoc(docRef);
        console.log("Document deleted successfully");
        return { id: documentId, deleted: true };
    } catch (error) {
        console.error("Error deleting user document: ", error);
        throw error;
    }
}

async function getUserRecentDocuments(collectionName, limitCount = 10) {
    try {
        const userId = await getCurrentUserId();
        const q = query(
            collection(db, collectionName),
            where("userId", "==", userId),
            orderBy("createdAt", "desc"),
            limit(limitCount)
        );

        const querySnapshot = await getDocs(q);
        const recentDocuments = [];

        querySnapshot.forEach((doc) => {
            recentDocuments.push({ id: doc.id, ...doc.data() });
        });

        return recentDocuments;
    } catch (error) {
        console.error("Error getting recent user documents: ", error);
        throw error;
    }
}

async function getUserDocumentCount(collectionName) {
    try {
        const userDocs = await getUserData(collectionName);
        return userDocs.length;
    } catch (error) {
        console.error("Error counting user documents: ", error);
        throw error;
    }
}


async function searchUserDocuments(collectionName, searchField, searchValue) {
    try {
        const userId = await getCurrentUserId();
        const q = query(
            collection(db, collectionName),
            where("userId", "==", userId),
            where(searchField, ">=", searchValue),
            where(searchField, "<=", searchValue + '\uf8ff')
        );

        const querySnapshot = await getDocs(q);
        const searchResults = [];

        querySnapshot.forEach((doc) => {
            searchResults.push({ id: doc.id, ...doc.data() });
        });

        return searchResults;
    } catch (error) {
        console.error("Error searching user documents: ", error);
        throw error;
    }
}

// AUTH STATE LISTENER - Listen for auth state changes
function onUserAuthStateChange(callback) {
    return onAuthStateChanged(auth, (user) => {
        callback(user);
    });
}



export async function saveCredentials(data) {
    const userId = await getCurrentUserId();
    const docRef = doc(db, "credentials", userId);

    const snapshot = await getDoc(docRef);
    const now = new Date();

    if (!snapshot.exists()) {
        // First-time creation
        await setDoc(docRef, {
            userId,
            credential: [data],
            created_at: now,
            updated_at: now,
        });
    } else {
        const docData = snapshot.data();
        const credentials = docData.credential || [];

        // Find existing credential by broker
        const existingIndex = credentials.findIndex(
            (c) => c.broker === data.broker
        );

        if (existingIndex !== -1) {
            // Replace existing credential
            credentials[existingIndex] = data;
        } else {
            // Append new broker credential
            credentials.push(data);
        }

        await updateDoc(docRef, {
            credential: credentials,
            updated_at: now,
        });
    }

    return { id: userId };
}

export async function getUserCredentials() {
    const userId = await getCurrentUserId();
    const q = query(collection(db, "credentials"), where("userId", "==", userId));
    const snapshot = await getDocs(q);
    const credentials = snapshot.docs.map(doc => doc.data());
    return credentials[0].credential || [];
}


// STRATEGY MANAGEMENT FUNCTIONS
export async function createStrategy(strategyData) {
    try {
        console.log('🔥 Creating strategy with data:', strategyData);
        const userId = await getCurrentUserId();
        console.log('🔥 Current user ID:', userId);
        
        const docRef = await addDoc(collection(db, "strategies"), {
            name: strategyData.name,
            entry: strategyData.entry || [], // array of strings
            exit: strategyData.exit || [], // array of strings
            additionalNotes: {
                entry: strategyData.additionalNotes?.entry || "",
                exit: strategyData.additionalNotes?.exit || ""
            },
            trades: {}, // empty map for trades
            userId: userId,
            user_id: userId, // keeping both for compatibility
            created_at: new Date(),
            updated_at: new Date()
        });
        console.log("✅ Strategy created successfully with ID:", docRef.id);
        const result = { id: docRef.id, userId };
        console.log("✅ Returning result:", result);
        return result;
    } catch (error) {
        console.error("❌ Error creating strategy: ", error);
        throw error;
    }
}

export async function getUserStrategies() {
    try {
        console.log('🔥 Getting user strategies...');
        const userId = await getCurrentUserId();
        console.log('🔥 Current user ID:', userId);

        // First try with ordering
        let q;
        try {
            q = query(
                collection(db, "strategies"),
                where("userId", "==", userId),
                orderBy("created_at", "desc")
            );
            console.log('🔥 Query created with ordering');
        } catch (indexError) {
            // If ordering fails due to missing index, query without ordering
            console.log("🔥 Ordering not available, querying without order");
            q = query(
                collection(db, "strategies"),
                where("userId", "==", userId)
            );
        }

        const querySnapshot = await getDocs(q);
        console.log('🔥 Query snapshot received, docs count:', querySnapshot.size);
        const strategies = [];

        querySnapshot.forEach((doc) => {
            const strategyData = { id: doc.id, ...doc.data() };
            console.log('🔥 Found strategy:', strategyData.name, 'with ID:', doc.id);
            strategies.push(strategyData);
        });

        // Sort manually if we couldn't order in query
        strategies.sort((a, b) => {
            const aDate = a.created_at?.toDate?.() || new Date(a.created_at) || new Date();
            const bDate = b.created_at?.toDate?.() || new Date(b.created_at) || new Date();
            return bDate - aDate;
        });

        console.log("✅ Retrieved strategies:", strategies.length);
        console.log("✅ Strategies data:", strategies);
        return strategies;
    } catch (error) {
        console.error("❌ Error getting user strategies: ", error);
        // Return empty array instead of throwing to prevent UI errors
        return [];
    }
}

export async function updateStrategy(strategyId, updateData) {
    try {
        const userId = await getCurrentUserId();
        const docRef = doc(db, "strategies", strategyId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            throw new Error("Strategy does not exist");
        }

        const data = docSnap.data();
        if (data.userId !== userId) {
            throw new Error("Access denied: Strategy does not belong to current user");
        }

        await updateDoc(docRef, {
            ...updateData,
            updated_at: new Date(),
        });

        console.log("✅ Strategy updated successfully");
        return { id: strategyId, ...updateData };
    } catch (error) {
        console.error("Error updating strategy: ", error);
        throw error;
    }
}

export async function deleteStrategy(strategyId) {
    try {
        const userId = await getCurrentUserId();
        const docRef = doc(db, "strategies", strategyId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            throw new Error('Strategy does not exist');
        }

        const data = docSnap.data();
        if (data.userId !== userId) {
            throw new Error('Access denied: Strategy does not belong to current user');
        }

        await deleteDoc(docRef);
        console.log("Strategy deleted successfully");
        return { id: strategyId, deleted: true };
    } catch (error) {
        console.error("Error deleting strategy: ", error);
        throw error;
    }
}


// EMOTION MANAGEMENT FUNCTIONS
export async function createEmotion(emotionData) {
    try {
        const userId = await getCurrentUserId();
        const docRef = await addDoc(collection(db, "emotions"), {
            name: emotionData.name,
            description: emotionData.description || "",
            icon: emotionData.icon || "smile", // default icon
            color: emotionData.color || "text-gray-600", // default color
            triggers: emotionData.triggers || [], // array of strings
            strategies: emotionData.strategies || [], // coping strategies
            additionalNotes: emotionData.additionalNotes || "",
            trades: {}, // empty map for trades
            userId: userId,
            user_id: userId, // keeping both for compatibility
            created_at: new Date(),
            updated_at: new Date()
        });
        console.log("✅ Emotion created successfully with ID:", docRef.id);
        return { id: docRef.id, userId };
    } catch (error) {
        console.error("Error creating emotion: ", error);
        throw error;
    }
}

export async function getUserEmotions() {
    try {
        const userId = await getCurrentUserId();

        // First try with ordering
        let q;
        try {
            q = query(
                collection(db, "emotions"),
                where("userId", "==", userId),
                orderBy("created_at", "desc")
            );
        } catch (indexError) {
            // If ordering fails due to missing index, query without ordering
            console.log("Ordering not available, querying without order");
            q = query(
                collection(db, "emotions"),
                where("userId", "==", userId)
            );
        }

        const querySnapshot = await getDocs(q);
        const emotions = [];

        querySnapshot.forEach((doc) => {
            emotions.push({ id: doc.id, ...doc.data() });
        });

        // Sort manually if we couldn't order in query
        emotions.sort((a, b) => {
            const aDate = a.created_at?.toDate?.() || new Date(a.created_at) || new Date();
            const bDate = b.created_at?.toDate?.() || new Date(b.created_at) || new Date();
            return bDate - aDate;
        });

        console.log("✅ Retrieved emotions:", emotions.length);
        return emotions;
    } catch (error) {
        console.error("Error getting user emotions: ", error);
        // Return empty array instead of throwing to prevent UI errors
        return [];
    }
}

export async function updateEmotion(emotionId, updateData) {
    try {
        const userId = await getCurrentUserId();
        const docRef = doc(db, "emotions", emotionId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            throw new Error("Emotion does not exist");
        }

        const data = docSnap.data();
        if (data.userId !== userId) {
            throw new Error("Access denied: Emotion does not belong to current user");
        }

        await updateDoc(docRef, {
            ...updateData,
            updated_at: new Date(),
        });

        console.log("✅ Emotion updated successfully");
        return { id: emotionId, ...updateData };
    } catch (error) {
        console.error("Error updating emotion: ", error);
        throw error;
    }
}

export async function deleteEmotion(emotionId) {
    try {
        const userId = await getCurrentUserId();
        const docRef = doc(db, "emotions", emotionId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            throw new Error('Emotion does not exist');
        }

        const data = docSnap.data();
        if (data.userId !== userId) {
            throw new Error('Access denied: Emotion does not belong to current user');
        }

        await deleteDoc(docRef);
        console.log("Emotion deleted successfully");
        return { id: emotionId, deleted: true };
    } catch (error) {
        console.error("Error deleting emotion: ", error);
        throw error;
    }
}


export {
    createUserData,
    getUserData,
    getUserDocumentById,
    getUserDataWithFilter,
    updateUserDocument,
    deleteUserDocument,
    getUserRecentDocuments,
    getUserDocumentCount,
    searchUserDocuments,
    onUserAuthStateChange,
    getCurrentUserId,
    createStrategy,
    getUserStrategies,
    updateStrategy,
    deleteStrategy,
    createEmotion,
    getUserEmotions,
    updateEmotion,
    deleteEmotion
};
