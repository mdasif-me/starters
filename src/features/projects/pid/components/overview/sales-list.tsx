import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/base-avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const data = [
  {
    no: '01',
    name: 'Rakatul I.',
    icon: '',
    package: 'Royal',
    amount: '100000',
  },
]

export default function SalesList() {
  return (
    <div>
      <h1 className="text-sm font-medium">Request Sales Approval</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-4">No</TableHead>
            <TableHead>Client Profile</TableHead>
            <TableHead>Package</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((sub) => (
            <TableRow key={sub.no} className="bg-muted">
              <TableCell className="font-medium">{sub.no}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Avatar className="size-8">
                    <AvatarImage
                      className={'bg-white rounded-full'}
                      src={sub.icon}
                      alt={sub.name}
                    />
                    <AvatarFallback className={'bg-white rounded-full'}>
                      {sub.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="font-medium text-foreground">{sub.name}</div>
                </div>
              </TableCell>
              <TableCell>{sub.package}</TableCell>
              <TableCell>{sub.amount}</TableCell>
              <TableCell className="text-right">
                <button className="gradient-btn text-white rounded-2xl!">
                  View
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
