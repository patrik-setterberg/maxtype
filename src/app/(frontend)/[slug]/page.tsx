import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import config from '@payload-config'

// Components
import BlockRenderer from '@/components/ui/BlockRenderer'

type Args = {
  params: Promise<{ slug?: string }>
}

const Page = async ({ params: paramsPromise }: Args) => {
  const { slug } = await paramsPromise

  // Handle missing slug
  if (!slug) {
    notFound()
  }

  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1
  })

  // Handle no results
  if (!result.docs.length) {
    notFound()
  }

  const page = result.docs[0]

  return (
    <div>
      {page.title && <h1>{page.title}</h1>}
      {page.blocks?.map((block, index) => (
        <BlockRenderer key={block.id || index} block={block} />
      ))}
    </div>
  )
}

export default Page
