import { Link } from '@tanstack/react-router'
import { createFileRoute } from '@tanstack/react-router'
import {
  Calendar,
  Users,
  DollarSign,
  TrendingDown,
  Plus,
  UserPlus,
  CalendarDays,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'

export const Route = createFileRoute('/_dashboard/admin/')({
  component: AdminHomePage,
})

const stats = [
  {
    title: "Today's Appointments",
    value: '--',
    icon: Calendar,
    description: 'Scheduled for today',
  },
  {
    title: 'Active Masters',
    value: '--',
    icon: Users,
    description: 'Currently active',
  },
  {
    title: 'Revenue (MTD)',
    value: '--',
    icon: DollarSign,
    description: 'Month to date',
  },
  {
    title: 'Cancellation Rate',
    value: '--',
    icon: TrendingDown,
    description: 'Last 30 days',
  },
]

function AdminHomePage() {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">{today}</p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/calendar">
            <Button variant="outline" size="sm">
              <Plus className="mr-1 h-4 w-4" />
              New Appointment
            </Button>
          </Link>
          <Link to="/admin/masters/new">
            <Button variant="outline" size="sm">
              <UserPlus className="mr-1 h-4 w-4" />
              Add Master
            </Button>
          </Link>
          <Link to="/admin/calendar">
            <Button size="sm">
              <CalendarDays className="mr-1 h-4 w-4" />
              View Calendar
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-md border p-3"
                >
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                </div>
              ))}
              <p className="pt-2 text-center text-sm text-muted-foreground">
                Appointment data will load when the backend is connected
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                {
                  action: 'New booking',
                  detail: 'Appointment created via WhatsApp',
                  time: 'Just now',
                },
                {
                  action: 'Master invited',
                  detail: 'Invitation sent to new master',
                  time: '5 min ago',
                },
                {
                  action: 'Appointment completed',
                  detail: 'Service delivered successfully',
                  time: '1 hour ago',
                },
                {
                  action: 'Settings updated',
                  detail: 'Working hours modified',
                  time: '2 hours ago',
                },
              ].map((activity, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-md border p-3"
                >
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.detail}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {activity.time}
                  </Badge>
                </div>
              ))}
              <p className="pt-2 text-center text-sm text-muted-foreground">
                Activity feed will be populated with real data
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
