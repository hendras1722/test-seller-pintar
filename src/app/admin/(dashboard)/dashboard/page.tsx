import Version from '@/components/Version'

export default function Dashboard() {
  return (
    <div className="dark:text-white">
      <h1 className="font-bold mb-3">
        Thank you for clone my boilerplate next 15
      </h1>
      <div className="mt-5">
        <h4 className="my-5 font-semibold">Feature:</h4>
        <Version />
        {/*   <div className="ml-5"></div> */}
      </div>
    </div>
  )
}
