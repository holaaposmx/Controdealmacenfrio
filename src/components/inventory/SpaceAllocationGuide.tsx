import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Thermometer,
  ClipboardCheck,
  Users,
  Clock,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";

const SpaceAllocationGuide = () => {
  const procedures = [
    {
      activity: "Product Reception",
      role: "Warehouse Operator",
      description:
        "Confirm that the product arrives with complete documentation (transit guide, remission, certificates). Verify weight, quantity, lot, and expiration date. Check product temperature before entry: Fresh (Conservation): 0°C to 4°C, Frozen: -18°C or less. If the product does not meet standards, inform quality and operations to determine acceptance or rejection.",
      considerations:
        "Transfer occurs when production has a pallet, quarter, or channel ready, maintaining the cold chain.",
      icon: <ClipboardCheck className="h-5 w-5 text-blue-600" />,
    },
    {
      activity: "Warehouse Space Assignment",
      role: "Warehouse Operator",
      description:
        "Determine which warehouse the product should go to according to its classification: Conservation: Fresh products for short storage. Frozen: Products with longer storage time. Apply FIFO methodology (First In, First Out): Position older batches at the front to facilitate their exit. Avoid accumulation of products close to expiration. Record the assigned location in the inventory system (racks, pallets, chambers). Label and code the product with location information, lot, and entry date.",
      considerations:
        "During storage. Specifically on Mondays in coordination with the quality department.",
      icon: <Users className="h-5 w-5 text-green-600" />,
    },
    {
      activity: "Temperature and Warehouse Condition Control",
      role: "Quality Control",
      description:
        "Monitor temperatures in both areas and record hourly in log. Verify there is no frost or moisture accumulation in frozen products. Perform daily inspections to detect damaged products or anomalies. Inform maintenance if there are temperature variations.",
      considerations: "Every hour from Monday to Saturday.",
      icon: <Thermometer className="h-5 w-5 text-red-600" />,
    },
    {
      activity: "Product Relocation and Space Optimization",
      role: "Quality Control",
      description:
        "Relocate products if there are changes in demand or available space. Rotate merchandise to maintain correct flow according to FIFO. Maximize space in high seasons, ensuring access to best-selling products.",
      considerations: "",
      icon: <RotateCcw className="h-5 w-5 text-purple-600" />,
    },
    {
      activity: "Warehouse Monitoring and Audit",
      role: "Inventory Manager",
      description:
        "Conduct monthly audits to verify inventories and spaces. Check that all pallets and products are correctly labeled. Validate that temperature records are consistent. Generate reports to improve distribution and storage capacity.",
      considerations: "Monthly.",
      icon: <AlertTriangle className="h-5 w-5 text-amber-600" />,
    },
  ];

  return (
    <Card className="w-full bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          Space Allocation Guidelines
        </CardTitle>
        <CardDescription>
          Standard procedures for warehouse space management and product
          allocation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Activity</TableHead>
                <TableHead className="w-[150px]">Responsible</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[200px]">
                  General Considerations
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {procedures.map((procedure, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {procedure.icon}
                      <span>{procedure.activity}</span>
                    </div>
                  </TableCell>
                  <TableCell>{procedure.role}</TableCell>
                  <TableCell className="text-sm">
                    {procedure.description}
                  </TableCell>
                  <TableCell className="text-sm">
                    {procedure.considerations}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Thermometer className="h-5 w-5 text-blue-600" />
              Temperature Requirements
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="font-medium min-w-[120px]">Conservation:</span>
                <span>
                  0°C to 4°C for fresh products with short storage time
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-medium min-w-[120px]">Frozen:</span>
                <span>-18°C or less for products with longer storage time</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-600" />
              FIFO Methodology
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="font-medium min-w-[120px]">Principle:</span>
                <span>
                  First In, First Out - older products must be dispatched first
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-medium min-w-[120px]">
                  Implementation:
                </span>
                <span>
                  Position older batches at the front for easier access and
                  dispatch
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-medium min-w-[120px]">Monitoring:</span>
                <span>
                  Regular checks to prevent accumulation of products close to
                  expiration
                </span>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SpaceAllocationGuide;
