import style from 'styled-components';
import { Button } from '@chakra-ui/react'
import { MdLogin } from "react-icons/md";
import { FaLock, FaLockOpen } from "react-icons/fa6";

const FlexDiv = style.div`
    display : flex;
    width : 100%;
    height : 60vh;
    flex-direction : column;
    align-items : center;
    justify-content : center;
`

const InfoDiv = style.p`
    font-size : 30px;
    color: #4A5568;
`

interface Props{
    content: String,
    btnInfo: String,
    navigateToComponent : () => void
}

const UnAuthorized = ({content, btnInfo, navigateToComponent} : Props) => {

  return (
    <FlexDiv>
        <InfoDiv>
            {content}
        </InfoDiv>
        {
            btnInfo == "Appointment" ? <FaLockOpen className="enlargeIcon"/> : <FaLock className="enlargeIcon"/>
        }
        <Button onClick={navigateToComponent} rightIcon={<MdLogin />} colorScheme='blue' my="4">
            {btnInfo}
        </Button>
    </FlexDiv>
  )
}

export default UnAuthorized
