import DeleteConfirm from '@/components/common/DeleteConfirm';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { EllipsisVertical, Eye, MoveUpRight, Pencil, Trash, Loader2 } from 'lucide-react';
import { RecentActivity } from '@/services/dashboardService';

interface ActivitiesProps {
  activities: RecentActivity[];
  isLoading?: boolean;
}

const Activities = ({ activities, isLoading = false }: ActivitiesProps) => {
  // Helper function to get initials from name
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0)}${lastName?.charAt(0)}`.toUpperCase();
  };

  // Helper function to get badge variant based on status
  const getBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'submitted':
        return 'default';
      case 'waiting':
        return 'waiting';
      case 'approved':
        return 'success';
      case 'rejected':
        return 'destructive';
      default:
        return 'secondary';
    }
  };
  return (
    <div className="space-y- 2 col-span-full">
      <p className="text-lg font-semibold">Recent Activities</p>
      <div className="max-h-96 overflow-auto relative">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading activities...</span>
          </div>
        ) : activities.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            No recent activities found
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.map((activity, index) => (
                <TableRow key={activity._id + index + 'activity'}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarFallback>
                          {getInitials(activity.firstName, activity.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      <p className="text-base font-medium">
                        {activity.firstName} {activity.lastName}
                      </p>
                      <MoveUpRight className="size-4" />
                    </div>
                  </TableCell>
                  <TableCell>{activity.email}</TableCell>
                  <TableCell>{activity.phone}</TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(activity.status) as any}>
                      {activity.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Popover>
                      <PopoverTrigger>
                        <Button size="icon" variant="ghost">
                          <EllipsisVertical />
                          <span className="sr-only">action</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="max-w-fit" align="end">
                        <div className="flex items-center gap-2">
                          <Button size="icon">
                            <Eye />
                            <span className="sr-only">view</span>
                          </Button>
                          <Button size="icon" variant="outline">
                            <Pencil />
                            <span className="sr-only">edit</span>
                          </Button>
                          <DeleteConfirm>
                            <Button size="icon" variant="destructive">
                              <Trash />
                              <span className="sr-only">delete</span>
                            </Button>
                          </DeleteConfirm>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default Activities;
