import { FC } from 'react'

interface Props {
  className?: string
  itemClass?: string
  categories: {
    name: string
    handle: string
    color: string
  }[]
}

/** Category badges hidden — clean card design */
const CategoryBadgeList: FC<Props> = () => {
  return null
}

export default CategoryBadgeList
