import { getConversations } from '@/actions/messages'
import { InboxClient } from '@/components/InboxClient'

export default async function MessagesPage() {
  const conversations = await getConversations()

  return <InboxClient initialConversations={conversations} />
}
