export default function DetailArticle() {
  const data = [
    {
      id: '04fb7996-f320-4616-802a-f6d5e29b6c93',
      userId: 'dee2e709-189f-41f6-a87d-f682b292e640',
      categoryId: '1c526098-d855-40b0-868e-dbf248ca4ec3',
      title: 'The Impact of Digital Transformation on Global Economies',
      content:
        '<p>In the 21st century, digital transformation has become a driving force behind economic growth, reshaping industries, and altering the way businesses operate. From artificial intelligence (AI) to blockchain and e-commerce, technological advancements are revolutionizing economies worldwide. This article explores how digital transformation is influencing global economic trends, the challenges it presents, and the opportunities it creates.  </p><br><p><strong>1. Boosting Productivity and Efficiency</strong> </p><br><p>Digital technologies enhance productivity by automating processes, reducing operational costs, and improving efficiency. Businesses leveraging cloud computing, big data analytics, and AI can make data-driven decisions, optimize supply chains, and deliver personalized customer experiences. For instance, manufacturing firms using the Internet of Things (IoT) can predict equipment failures, minimizing downtime and increasing output.  </p><br><p><strong>2. The Rise of the Digital Economy</strong></p><br><p>E-commerce, fintech, and gig economies are expanding rapidly. Platforms like Amazon, Alibaba, and Shopify have transformed retail, while digital payment systems such as PayPal and mobile wallets facilitate seamless transactions. The gig economy, powered by apps like Uber and Upwork, provides flexible employment opportunities, contributing to GDP growth in many countries.  </p><br><p><strong>3. Job Market Evolution</strong></p><br><p>While digitalization creates new job opportunities in tech-driven sectors, it also disrupts traditional roles. Automation and AI may replace repetitive jobs, requiring workers to upskill. Governments and businesses must invest in education and training programs to prepare the workforce for a digital future.  </p><br><p><strong>4. Challenges: Inequality and Cybersecurity Risks</strong></p><br><p>The digital divide between technologically advanced and developing nations could widen economic inequality. Additionally, cyber threats pose risks to businesses and financial systems. Strong regulatory frameworks and cybersecurity measures are essential to protect data and maintain trust in digital economies.  </p><br><p><strong>5. Future Outlook </strong></p><br><p>Countries embracing digital innovation will likely gain a competitive edge. Policymakers should promote digital infrastructure, foster innovation, and ensure inclusive growth. The integration of 5G, AI, and green technology will further shape economic landscapes in the coming decades.  </p><br><p><strong>Conclusion</strong></p><br><p>Digital transformation is a double-edged sword—offering immense economic potential while presenting challenges. By adopting adaptive policies and investing in technology, nations can harness its benefits for sustainable development. The future economy will be defined by those who can innovate and adapt to the digital age.</p><br>',
      imageUrl:
        'https://s3.sellerpintar.com/articles/articles/1748840269006-images (2).jpg',
      createdAt: '2025-06-02T04:57:49.094Z',
      updatedAt: '2025-06-04T06:30:41.908Z',
      category: {
        id: '1c526098-d855-40b0-868e-dbf248ca4ec3',
        userId: '3c8831bf-b7b7-48ab-b487-dc6764243c36',
        name: 'Economy',
        createdAt: '2025-06-02T04:48:37.104Z',
        updatedAt: '2025-06-02T04:59:24.465Z',
      },
      user: {
        id: 'dee2e709-189f-41f6-a87d-f682b292e640',
        username: 'Saya adalah admin',
      },
    },
  ]
  return (
    <div id="article" className="lg:px-96 px-8 lg:py-20 py-10 min-h-screen">
      <h1>Judul Artikel</h1>
      <div>
        Domain - <span>tanggal</span>
      </div>
      <div>Name Publisher</div>
      <div className="mt-5">
        <img src={data[0].imageUrl} width={1600} className="rounded" />
      </div>
      <p className="mt-5 text-[16px]">
        Hlwelwikenwqir qwr jwqop rjqwoprj jmwqopjrm qwopr jmqwpom jropqwm
        rjmpoqwjmr poqwim jrpoiwmq jer
      </p>
      <div className="p-1 border border-gray-300 w-fit rounded-lg text-[12px] mt-5">
        Cateogry
      </div>
      <div className=" bg-gray-200 p-4 rounded mt-10">
        <h4>Article cateogry lainnya:</h4>

        <div className="grid grid-cols-3 grid-rows-1 gap-5 mt-5">
          <div>
            <img src={data[0].imageUrl} width={1600} className="rounded" />
            <h6 className="mt-2">Judul Artikel</h6>
          </div>
          <div>
            <img src={data[0].imageUrl} width={1600} className="rounded" />
            <h6 className="mt-2">Judul Artikel</h6>
          </div>
          <div>
            <img src={data[0].imageUrl} width={1600} className="rounded" />
            <h6 className="mt-2">Judul Artikel</h6>
          </div>
        </div>
      </div>
    </div>
  )
}
