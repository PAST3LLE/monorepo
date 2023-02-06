import firebaseAdmin from 'firebase-admin'
import { v4 as uuidv4 } from 'uuid'

import serviceAccount from './authentication.js'

export function createFirebaseAdmin() {
  const admin = firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount)
  })
  const storageRef = admin.storage().bucket(process.env.FIREBASE_BUCKET_NAME)

  return { admin, storageRef }
}

export async function uploadFile({ path, destination }, storageRef) {
  const ref = storageRef || createFirebaseAdmin().storageRef
  const storage = ref.upload(path, {
    public: true,
    destination,
    metadata: {
      metadata: {
        firebaseStorageDownloadTokens: uuidv4()
      }
    }
  })
  return storage
}
