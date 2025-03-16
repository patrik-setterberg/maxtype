import { getPayload } from 'payload'
import config from '@payload-config'

// Components
import DynamicForm, { FormProps } from '@/components/ui/DynamicForm'

type Args = {
  params: Promise<{ slug?: string }>
}

const Page = async ({ params: paramsPromise }: Args) => {
  const { slug } = await paramsPromise

  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  const doc = result.docs[0]

  return (
    <div>
      {/* <h1>{slug}</h1> */} {/* Kanske en show title checkbox? */}
      {doc?.blocks?.map((block, index) => {
        switch (block.blockType) {
          case 'formBlock':
            return <DynamicForm key={index} {...(block as FormProps)} />
          default:
            return null
        }
      })}
    </div>
  )
}

export default Page
