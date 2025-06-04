'use client'

import ArrayMap from '@/components/ArrayMap'
import PaginationComponents from '@/components/client/PaginationComponents'
import { Else, ElseIf, If } from '@/components/if'
import { useBreakpoints } from '@/configs/useMediaQuery'

export default function List({ data }: { data: any }) {
  const breakpoints = {
    xs: 0,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
  }
  const { md } = useBreakpoints(breakpoints)

  function transformData(data) {
    const hasil = []
    let i = 0 // Index untuk iterasi data asli

    while (i < data.length) {
      // Untuk index genap di 'hasil' (0, 2, 4, ...), ambil 1 item
      if (hasil.length % 2 === 0) {
        const subArray = []
        if (data[i]) {
          // Pastikan item ada
          subArray.push(data[i])
        }
        hasil.push(subArray)
        i += 1 // Maju 1 langkah di data asli
      }
      // Untuk index ganjil di 'hasil' (1, 3, 5, ...), ambil 2 item
      else {
        const subArray = []
        if (data[i]) {
          // Pastikan item pertama ada
          subArray.push(data[i])
        }
        if (data[i + 1]) {
          // Pastikan item kedua ada
          subArray.push(data[i + 1])
        }
        hasil.push(subArray)
        i += 2 // Maju 2 langkah di data asli
      }
    }
    return hasil
  }
  return (
    <If condition={md}>
      <div className="rounded mt-8 lg:px-[263px] py-3">
        <ArrayMap
          of={transformData(data)}
          render={(item, index) => (
            <div key={index} className="mt-5">
              <If condition={!!(item.length === 1)}>
                <div className="flex gap-3 items-start">
                  <img
                    src={data[0].imageUrl}
                    className="rounded"
                    alt="photo_article"
                  />
                  <div>
                    <h4 className="mt-2 font-bold">{data[0].title}</h4>
                    <p className="text-[16px] mt-3 font-normal">
                      {data[0].content.replace(/<[^>]+>/g, '').slice(0, 200)}
                    </p>
                    <div className="mt-5">
                      <h6>Publisher</h6>
                      <h6>tanggal</h6>
                    </div>
                  </div>
                </div>
                <hr className="mt-5" />
                <Else>
                  <div className="grid grid-cols-2 place-items-center grid-rows-1 gap-4 mt-5">
                    <div>
                      <img
                        src={data[0].imageUrl}
                        className="rounded"
                        width={500}
                        height={300}
                        alt="photo_article"
                      />
                      <p className="text-[16px] mt-5 font-normal">
                        {data[0].content.replace(/<[^>]+>/g, '').slice(0, 200)}
                      </p>
                      <div className="mt-5">
                        <h6>Publisher</h6>
                        <h6>tanggal</h6>
                      </div>
                    </div>
                    <div>
                      <img
                        src={data[0].imageUrl}
                        className="rounded"
                        width={500}
                        height={300}
                        alt="photo_article"
                      />
                      <p className="text-[16px] mt-5 font-normal">
                        {data[0].content.replace(/<[^>]+>/g, '').slice(0, 200)}
                      </p>
                      <div className="mt-5">
                        <h6>Publisher</h6>
                        <h6>tanggal</h6>
                      </div>
                    </div>
                    <hr className="mt-5" />
                  </div>
                  <hr className="mt-5" />
                </Else>
              </If>
            </div>
          )}
        />

        <div className="mt-5">
          <PaginationComponents page={1} pageSize={10} totalCount={2} />
        </div>
      </div>

      <Else key={'artcile'}>
        <div className="rounded mt-8 px-4">
          <div>
            <img
              src={data[0].imageUrl}
              className="rounded"
              alt="photo_article"
            />
            <h4 className="mt-2 font-bold">{data[0].title}</h4>
            <p className="text-[16px] mt-3 font-normal">
              {data[0].content.replace(/<[^>]+>/g, '').slice(0, 200)}
            </p>
            <div className="mt-5">
              <h6>Publisher</h6>
              <h6>tanggal</h6>
            </div>
            <div className="mt-3">
              <hr />
            </div>
          </div>
          <div className="mt-5">
            <PaginationComponents page={1} pageSize={10} totalCount={2} />
          </div>
        </div>
      </Else>
    </If>
  )
}
