import dotenv from 'dotenv'

dotenv.config()

export default {
  type: 'service_account',
  project_id: 'pastelle-skilltree',
  private_key_id: process.env.FIREBASE_PK_ID,
  private_key: process.env.FIREBASE_PK,
  client_email: 'firebase-adminsdk-ruviy@pastelle-skilltree.iam.gserviceaccount.com',
  client_id: '115342265788873947675',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url:
    'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-ruviy%40pastelle-skilltree.iam.gserviceaccount.com'
}
