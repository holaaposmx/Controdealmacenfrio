import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { MoreHorizontal, Eye, Truck, AlertCircle } from "lucide-react";

interface Order {
  id: string;
  customer: string;
  status: "pending" | "processing" | "shipped" | "urgent";
  items: number;
  date: string;
}

interface PendingOrdersListProps {
  orders?: Order[];
  onViewOrder?: (orderId: string) => void;
  onProcessOrder?: (orderId: string) => void;
}

const PendingOrdersList = ({
  orders = [
    {
      id: "ORD-2023-1234",
      customer: "Acme Corporation",
      status: "pending",
      items: 12,
      date: "2023-06-15",
    },
    {
      id: "ORD-2023-1235",
      customer: "TechSolutions Inc.",
      status: "urgent",
      items: 5,
      date: "2023-06-14",
    },
    {
      id: "ORD-2023-1236",
      customer: "Global Logistics",
      status: "processing",
      items: 8,
      date: "2023-06-13",
    },
    {
      id: "ORD-2023-1237",
      customer: "Retail Partners",
      status: "pending",
      items: 20,
      date: "2023-06-12",
    },
    {
      id: "ORD-2023-1238",
      customer: "Supply Chain Co.",
      status: "shipped",
      items: 3,
      date: "2023-06-11",
    },
  ],
  onViewOrder = () => {},
  onProcessOrder = () => {},
}: PendingOrdersListProps) => {
  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "processing":
        return <Badge variant="default">Processing</Badge>;
      case "shipped":
        return <Badge variant="outline">Shipped</Badge>;
      case "urgent":
        return <Badge variant="destructive">Urgent</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div className="w-full h-full bg-white rounded-xl shadow-md p-4 overflow-hidden flex flex-col border border-blue-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Pedidos Pendientes</h2>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </div>

      <div className="overflow-auto flex-grow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{getStatusBadge(order.status)}</TableCell>
                <TableCell>{order.items}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onViewOrder(order.id)}
                      title="View Order Details"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onProcessOrder(order.id)}
                      title="Process Order"
                    >
                      <Truck className="h-4 w-4" />
                    </Button>
                    {order.status === "urgent" && (
                      <AlertCircle className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PendingOrdersList;
