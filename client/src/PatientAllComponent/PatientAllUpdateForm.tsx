import { useState } from 'react'
import { Button, FormControl, FormLabel, HStack, Input, Select, Stack, VStack } from '@chakra-ui/react'
import style from 'styled-components';
import axios from 'axios';

const ErrorMsg = style.p`
    color : crimson;
    font-size: 12px;
`

interface Props{
    nameRef: React.RefObject<HTMLInputElement>,
    genderRef: React.RefObject<HTMLSelectElement>,
    emailRef: React.RefObject<HTMLInputElement>,
    phoneRef: React.RefObject<HTMLInputElement>,
    addressRef: React.RefObject<HTMLInputElement>,
    ageRef: React.RefObject<HTMLInputElement>,
    setLoading :  React.Dispatch<React.SetStateAction<boolean>>,
    setAllPatient: React.Dispatch<React.SetStateAction<{
        _id: string;
        name: string;
        email: string;
        age: number;
        gender: string;
        address: string;
        phone: string;
    }[]>>
}

const PatientAllUpdateForm = ({nameRef, genderRef, emailRef, phoneRef, addressRef, ageRef, setLoading, setAllPatient} : Props) => {
    const[error, setError] = useState('');
  return (
    <div>
      <form className='updateForm hidden'>
            <FormControl w="100%" px={4}>
                <HStack my={4}>
                    <FormLabel>Name</FormLabel>
                    <VStack>
                        <Input type='text' placeholder='Patient Name' ref={nameRef}/>
                        {
                            error == "name-error" && <ErrorMsg>Patient name is required.</ErrorMsg>
                        }
                    </VStack>
                    <FormLabel>Email</FormLabel>
                    <VStack>
                        <Input type='email' placeholder='Patient Email' ref={emailRef} />
                    </VStack>
                </HStack>
                <HStack my={4}>
                    <FormLabel>Age</FormLabel>
                    <VStack>
                        <Input type='number' placeholder='Patient Age' ref={ageRef} />
                        {
                            error == "age-error" && <ErrorMsg>Patient age is required.</ErrorMsg>
                        }
                    </VStack>
                    <FormLabel>Phone</FormLabel>
                    <VStack>
                        <Input type='number'placeholder='Patient Phone' ref={phoneRef}/>
                        {
                            error == "phone-error" && <ErrorMsg>Patient number is required.</ErrorMsg>
                        }
                    </VStack>
                </HStack>
                <HStack my={4}>
                    <FormLabel>Address</FormLabel>
                    <VStack>
                        <Input type='text' placeholder='Patient Address' ref={addressRef} />
                        {
                            error == "address-error" && <ErrorMsg>Patient address is required.</ErrorMsg>
                        }
                    </VStack>
                    <FormLabel>Gender</FormLabel>
                    <VStack>
                        <Stack spacing={3}>
                            <Select placeholder='Select option' ref={genderRef}>
                                <option value='Male'>Male</option>
                                <option value='Female'>Female</option>
                                <option value='Other'>Other</option>
                            </Select>
                        </Stack>
                        {
                            error == "gender-error" && <ErrorMsg>Patient Gender is required.</ErrorMsg>
                        }
                    </VStack>
                </HStack>
                <p className="patientId hidden"></p>
                <Button colorScheme='green' my={4} onClick={async() => {
                    setLoading(true);
                    let idval = document.querySelector(".patientId")?.innerHTML;
                    await axios.patch(`${import.meta.env.VITE_NODE_URL}/api/patient/updatePatient/${idval}`, {
                        name : nameRef.current?.value,
                        email : emailRef.current?.value,
                        phone : phoneRef.current?.value,
                        age : ageRef.current?.value,
                        address : addressRef.current?.value,
                        gender : genderRef.current?.value
                    }, { withCredentials : true})
                    .then((item) => {
                        if (item.status == 200){
                            const fetchedData = item.data.patient;
                            setAllPatient({...fetchedData});
                            if (nameRef.current != null) nameRef.current.value = ""
                            if (emailRef.current != null) emailRef.current.value = ""
                            if (phoneRef.current != null) phoneRef.current.value = ""
                            if (ageRef.current != null) ageRef.current.value = ""
                            if (addressRef.current != null) addressRef.current.value = ""
                            if (genderRef.current != null) genderRef.current.value = ""

                            const updateButton = document.querySelector(".updateForm");
                            updateButton?.classList.add('hidden');
                        }
                        setLoading(false);
                    }).catch(Error => {
                        console.log('Error', Error)
                        let data = Error.response.data;
                        if (Error.response.status == 400){
                            let msg =(data.message).toLowerCase();
                            if (msg.includes('name')) setError('name-error');
                            if (msg.includes('phone')) setError('phone-error');
                            if (msg.includes('age')) setError('age-error');
                            if (msg.includes('address')) setError('adress-error');
                            if (msg.includes('gender')) setError('gender-error');
                        }
                        setLoading(false);
                    })
                }}>Update</Button>
            </FormControl>
        </form>
    </div>
  )
}

export default PatientAllUpdateForm
