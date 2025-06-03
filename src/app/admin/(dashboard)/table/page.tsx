'use client'
import { TableComponent } from '@/components/table'

interface ItemType {
  name: string
  category: string
  price: string
  created_at: Date
  actions?: string
}

export default function User() {
  const fields = [
    {
      label: 'Name',
      key: 'name', // TypeScript will ensure this matches a key in ItemType
      width: 'lg:w-[430px] w-[80px]',
    },
    {
      label: 'Kategory',
      key: 'category',
      width: 'lg:w-[130px] w-[50px]',
    },
    {
      label: 'Price',
      key: 'price',
      width: 'lg:w-[330px] w-[80px]',
    },
    {
      label: 'created_at',
      key: 'created_at',
      width: 'lg:w-[330px] w-[80px]',
      render: (item: ItemType) => (
        <div>Pukul at {new Date(item.created_at).toLocaleString()}</div>
      ),
    },
    {
      label: 'Actions',
      key: 'actions',
      width: 'lg:w-[330px] w-[80px]',
    },
  ]

  const items: ItemType[] = [
    {
      name: 'John Doe',
      category: 'Electronics',
      price: '$99.99',
      created_at: new Date(),
    },
  ]

  return (
    <TableComponent
      fields={fields}
      items={items}
      footerContent={
        <div className="text-right font-bold">Total Rows: {items.length}</div>
      }
    />
  )
}
