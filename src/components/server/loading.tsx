import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-104px)]">
      <div className="flex items-center w-full">
        <Skeleton className="h-[30px] min-w-[650px] w-full mb-5 mr-2" />
        <Skeleton className="h-[30px] min-w-[300px]  mb-5" />
      </div>
      <Skeleton className="h-[500px] w-full " />
    </div>
  )
}
