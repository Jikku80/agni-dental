import { Button } from '@chakra-ui/react'
import axios from 'axios'
import React from 'react'
import { MdLogin } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import style from 'styled-components';

const FlexDiv = style.div`
    display : flex;
    background-color : #edf2f7;
    justify-content : space-around;
    padding : 10px;
    align-items: center;
`

interface Props{
    setEntity: React.Dispatch<React.SetStateAction<{
        _id: string;
        name: string;
        role: string;
        createdAt: string;
      }>>,
    setLoading :  React.Dispatch<React.SetStateAction<boolean>>,
    goToLink : string
}

const SubNav = ({setLoading, setEntity, goToLink} : Props) => {
    const navigate = useNavigate();
    const signOut = async() => {
        setLoading(true);
        await axios.get(`${import.meta.env.VITE_NODE_URL}/api/user/logout`)
        .then(item => {
          const {data} = item;
          const newDate = new Date(data.expiry)
          document.cookie  = `jwt=loggedout; expires=${newDate}; SameSite=None; Secure;`
          setEntity({
            _id : '',
            name: '',
            role : '',
            createdAt : ''
          })
          setLoading(false);
          navigate('/login')
        }).catch(err => {
          console.log('Error!!!!', err)
          setLoading(false);
        })
      }
  return (
    <FlexDiv>
        <Button color="#4A5568" onClick={() => navigate(`/${goToLink}`)}>Back</Button>
        <Button color="#4A5568" onClick={() => navigate('/appointment')}>Appointment</Button>
        <Button color="#4A5568" className="customColor" onClick={signOut} rightIcon={<MdLogin />} colorScheme='gray'>
            Signout
        </Button>
    </FlexDiv>
  )
}

export default SubNav
