import { initializeApp } from 'firebase/app'
import { FirebaseStorage } from 'firebase/storage'
import { getStorage } from 'firebase/storage'
import { atom, useAtom } from 'jotai'

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  storageBucket: process.env.REACT_APP_FIREBASE_BUCKET_NAME,
  apiKey: process.env.REACT_APP_FIREBASE_PK,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_URL,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app)

interface FirebaseStorageState {
  firebaseStorage: FirebaseStorage
}
export const firebaseStorageAtom = atom<FirebaseStorageState>({
  firebaseStorage: storage,
})
firebaseStorageAtom.debugLabel = 'FIREBASE ATOM'

export const firebaseStorageRead = atom((get) => get(firebaseStorageAtom))

export const useFirebaseStorageAtomRead = () => useAtom(firebaseStorageRead)
export const useFirebaseStorageAtom = () => useAtom(firebaseStorageAtom)
