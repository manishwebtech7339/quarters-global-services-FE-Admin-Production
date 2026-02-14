'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TransactionDataType } from '@/services/transactionService';
import { formatCurrency } from '@/lib/formatCurrency';
import { ReactNode } from 'react';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';

interface Props {
  children: ReactNode;
  transaction: TransactionDataType | null;
}

function PaymentDetailsModal({ children, transaction }: Props) {
  if (!transaction) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Transaction Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-2 text-sm">
          <div className="flex justify-between">
            <span className="font-medium text-muted-foreground">Payment ID</span>
            <span>{transaction._id}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium text-muted-foreground">Name</span>
            <div>
              <span>{transaction.user.firstName}</span> <span>{transaction.user.lastName}</span>
            </div>
          </div>

          <div className="flex justify-between">
            <span className="font-medium text-muted-foreground">Email</span>
            <span>{transaction.user.email}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium text-muted-foreground">Amount</span>
            <span>{formatCurrency({ amount: transaction.amount || '0' })}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium text-muted-foreground">Payment Type</span>
            <span>{transaction.paymentType}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium text-muted-foreground">Payment Method</span>
            <span>{transaction.paymentMode}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium text-muted-foreground">Date </span>
            <span>{format(new Date(transaction.updatedAt), 'dd-MM-yyyy')}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium text-muted-foreground">Time</span>
            <span>{format(new Date(transaction.updatedAt), 'hh:mm a')}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium text-muted-foreground">Payment Status</span>
            <Badge
              variant={transaction.paymentStatus === 'Pending' ? 'secondary' : 'default'}
              className="capitalize"
            >
              {transaction.paymentStatus}
            </Badge>
          </div>
        </div>

        <Separator />
        <div className="space-y-4">
          <p>Applications</p>

          {transaction.applicationServices.map((e) => (
            <Card key={e._id} className="py-2">
              <CardContent className="spz-2">
                <div className="flex justify-between">
                  <span className="font-medium text-muted-foreground">Service</span>
                  <span>{e.application.serviceFields.service}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-muted-foreground">Service Category</span>
                  <span>{e.application.serviceFields.serviceType}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default PaymentDetailsModal;
