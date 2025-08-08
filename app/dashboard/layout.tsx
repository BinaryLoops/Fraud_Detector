import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardLayout } from '@/components/dashboard-layout'

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return <DashboardLayout user={user}>{children}</DashboardLayout>
}
