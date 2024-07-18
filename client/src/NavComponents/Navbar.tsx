
import { HStack } from '@chakra-ui/react'
import style from 'styled-components'
import { Image } from '@chakra-ui/react'
import logo from '../../public/logo.png';
import { FaArrowRight } from "react-icons/fa6";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbod = style.div`
  display : flex;
  width : '100%';
  justify-content : space-around;
  align-items : center;
`

const Anchor = style.a`
  text-decoration : none;
  cursor: pointer;

  color: #4A5568;
  &:hover{
    color: #3182ce;
  }
`

const BookButton = style.button`
  border-radius : 1rem;
  padding: .5%;
  display : flex;
  align-items: center;
  justify-content: space-between;
  width: 10%;
  font-weight: bolder;
  color: #4A5568;

  &:hover{
    background-color : #3182ce;
    border-color : #3182ce;
    color : white;
  }
`

const Navbar = () => {
  const navValues = ['HOME', 'SERVICES', 'SPECIALIST', 'BLOG', 'CONTACT US']

  const [isActive, setIsActive] = useState(-1);

  const navigate = useNavigate();

  return (
    <div>
      <Navbod>
        <Image src={logo} w="20%" />
        <HStack w="50%" justifyContent="space-around">
          {navValues.map((item, index) => <Anchor key={item} className={isActive == index ? "acitveColor" : ""} onClick={() => {
            setIsActive(index)
            if (item == "HOME") navigate('/')
            if (item == "SERVICES") navigate('/services')
            if (item == "SPECIALIST") navigate('/specialist')
            if (item == "BLOG") navigate('/blog')
            if (item == "CONTACT US") navigate('/contact-us')
            
          }}>{item}</Anchor>)}
        </HStack>
        <BookButton>Book Now <FaArrowRight /></BookButton>
      </Navbod>
    </div>
  )
}

export default Navbar
