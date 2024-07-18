import { FormControl, Input, InputGroup, InputLeftElement } from '@chakra-ui/react'
import axios from 'axios';
import React, { useRef } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import { FaSearch } from 'react-icons/fa';

interface Props{
  setLoading :  React.Dispatch<React.SetStateAction<boolean>>,
  setPatient: React.Dispatch<React.SetStateAction<string>>,
  setShowComponent: React.Dispatch<React.SetStateAction<boolean>>,
  setSearchVal : React.Dispatch<React.SetStateAction<string>>
}

const PatientNameSearch = ({setLoading, setPatient, setShowComponent, setSearchVal} : Props) => {
  interface Search {
    phone : Number
}
const {register, handleSubmit} = useForm<Search>();

const onSubmit: SubmitHandler<Search> = async (searchItem : any) => {
    setLoading(true)
    await axios.get(`${import.meta.env.VITE_NODE_URL}/api/patient/byPhone/${searchItem.phone}`, {withCredentials: true})
    .then(item => {
        const {data} = item;
        const fetchedData = data.patient.name;
        setSearchVal(searchItem.phone)
        setPatient(fetchedData)
        setShowComponent(true)
        setLoading(false)
    }).catch(err => {
        console.log('Error!!!', err)
        setLoading(false)
    })
}
const inputRef = useRef<HTMLButtonElement>(null);
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl w="100%" px={4} my={4}>
        <InputGroup>
          <InputLeftElement pointerEvents='none'>
          <FaSearch className="searchIcon"/>
          </InputLeftElement>
          <Input type='number' {...register('phone', {required: true})} placeholder='Search' onKeyDown={(e) => {
            if (e.key == "Enter") {
              e.preventDefault();
              inputRef.current?.click();
            };
          }}/>
          <button ref={inputRef} type="submit"></button>
        </InputGroup>
      </FormControl>
    </form>
  )
}

export default PatientNameSearch