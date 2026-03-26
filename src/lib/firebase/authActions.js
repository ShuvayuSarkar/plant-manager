import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    getAuth, GoogleAuthProvider,
    signOut,
    sendPasswordResetEmail,
    signInWithPopup

} from "firebase/auth";
import { clientApp } from ".";

const auth = getAuth(clientApp);

export async function setSession(idToken) {
    return await fetch('/api/createSession', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
    });
}

export async function getSignup(email, password) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const idToken = await userCredential.user.getIdToken();
        const response = await setSession(idToken);

        if (!response.ok) {
            const text = await response.text();
            throw new Error("Failed to set session cookie: " + text);
        }

    } catch (error) {
        console.log(error);
    }
}


export async function getLogin(email, password) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await userCredential.user.getIdToken();
    const response = await setSession(idToken);

    if (!response.ok) {
        const text = await response.text();
        throw new Error("Failed to set session cookie: " + text);
    }

}

export async function getGoogleSignIn() {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const idToken = await userCredential.user.getIdToken();

    const response = await setSession(idToken);
    if (!response.ok) {
        const text = await response.text();
        throw new Error("Failed to set session cookie: " + text);
    }
}

export async function logout() {
    await signOut(auth)
    await fetch('/api/sessionLogout', {
        method: 'POST',
    });
}

export async function resetPassword() {
    await sendPasswordResetEmail(auth, email)
}
