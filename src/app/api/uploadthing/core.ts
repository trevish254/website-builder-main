import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { currentUser } from '@clerk/nextjs/server'

const f = createUploadthing()

const authenticateUser = async () => {
  try {
    const user = await currentUser()
    
    // If you throw, the user will not be able to upload
    if (!user) {
      console.log('⚠️ No authenticated user found for file upload')
      throw new Error('Unauthorized - Please sign in to upload files')
    }
    
    console.log('✅ User authenticated for upload:', user.id)
    
    // Whatever is returned here is accessible in onUploadComplete as `metadata`
    return user
  } catch (error) {
    console.error('❌ Authentication error:', error)
    throw new Error('Authentication failed')
  }
}

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  subaccountLogo: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(authenticateUser)
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('✅ Subaccount logo uploaded:', file.url)
    }),
  avatar: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(authenticateUser)
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('✅ Avatar uploaded:', file.url)
    }),
  agencyLogo: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(authenticateUser)
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('✅ Agency logo uploaded:', file.url)
    }),
  media: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(authenticateUser)
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('✅ Media uploaded:', file.url)
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
