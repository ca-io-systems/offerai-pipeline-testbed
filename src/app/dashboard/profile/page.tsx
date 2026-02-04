import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import ProfileForm from './ProfileForm'
import AccountSettings from './AccountSettings'

export default async function EditProfilePage() {
  // For demo, use the first user (Sarah) as the logged-in user
  // In a real app, this would come from the session
  const [user] = await db.select().from(users).where(eq(users.id, 1)).limit(1)

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-[#767676] text-center">User not found. Please run the seed script.</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-[#484848] mb-8">Edit Profile</h1>

      <ProfileForm user={user} />

      <div className="mt-12 pt-8 border-t border-[#EBEBEB]">
        <AccountSettings userId={user.id} />
      </div>
    </div>
  )
}
