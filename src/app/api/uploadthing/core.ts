import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { getUser } from '@/lib/supabase/server'

const f = createUploadthing()

const authenticateUser = async () => {
  try {
    const user = await getUser()
    // If you throw, the user will not be able to upload
    if (!user) throw new Error('Unauthorized')
    // Whatever is returned here is accessible in onUploadComplete as `metadata`
    return { user }
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
      console.log('Upload complete for userId:', metadata?.user?.id)
      console.log('file url', file.url)
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
  productImage: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(authenticateUser)
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('✅ Product image uploaded:', file.url)
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
