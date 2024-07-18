import { Progress } from '@chakra-ui/react'
import style from 'styled-components';

const BelowNav = style.div`
    width : 100vw;
    background-color : white;
`

const Loading = () => {
  return (
    <BelowNav >
      <Progress m={2} size='xs' isIndeterminate />
    </BelowNav>
  )
}

export default Loading
