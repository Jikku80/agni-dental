import axios from 'axios';
import React, { useRef } from 'react'
import {Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer, Button, PopoverTrigger} from '@chakra-ui/react'
import {Popover,PopoverContent,PopoverHeader,PopoverBody,PopoverArrow,PopoverCloseButton} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom';
import { RiDeleteBin6Line } from 'react-icons/ri';
import PatientAllUpdateForm from './PatientAllUpdateForm';

interface Props{
    setLoading :  React.Dispatch<React.SetStateAction<boolean>>,
    setAllPatient: React.Dispatch<React.SetStateAction<{
        _id: string;
        name: string;
        email: string;
        age: number;
        gender: string;
        address: string;
        phone: string;
    }[]>>,
    allPatient: {
        _id: string;
        name: string;
        email: string;
        age: number;
        gender: string;
        address: string;
        phone: string;
    }[],
    showComponent : boolean  
}

const PatientAllTable = ({setLoading, setAllPatient, allPatient, showComponent} : Props) => {
    const navigate = useNavigate();
    const nameRef = useRef<HTMLInputElement>(null);
    const genderRef = useRef<HTMLSelectElement>(null);
    const ageRef = useRef<HTMLInputElement>(null);
    const addressRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const phoneRef = useRef<HTMLInputElement>(null);

  return (
    <div>
        <PatientAllUpdateForm nameRef={nameRef} genderRef={genderRef} emailRef={emailRef} phoneRef={phoneRef} addressRef={addressRef} ageRef={ageRef} setLoading={setLoading} setAllPatient={setAllPatient}/>
        <TableContainer mx={4}>
            <Table variant='simple'>
                {
                    showComponent == true && <TableCaption>{Object.keys(allPatient).length} Patients</TableCaption>
                }
                <Thead>
                <Tr>
                    <Th>S.N</Th>
                    <Th>Patient Name</Th>
                    <Th>Email</Th>
                    <Th>Phone</Th>
                    <Th>Age</Th>
                    <Th>Gender</Th>
                    <Th>Address</Th>
                    <Th>Update</Th>
                    <Th>Delete</Th>
                </Tr>
                </Thead>
                <Tbody> 
                    {showComponent == true && Object.entries(allPatient).map(([key, item], i) => <Tr key = {key + Math.random()}>
                            <Td key={i + 1}>{i + 1}</Td>
                            <Td className="tdLink" key={item.name} onClick={() => {
                                navigate(`/patient-record/${item.phone}`)
                            }}>{item.name}</Td>
                            <Td key={item.email}>
                            {
                            (item.email) &&
                            <>
                                <Popover placement='top-start' key={item.phone + item.name}>
                                    <PopoverTrigger>
                                        <Button size="sm" key={item.phone + item.email} colorScheme='blue' mx={2}>Show</Button>                                    
                                    </PopoverTrigger>
                                    <PopoverContent className="popContent" w="fit-content">
                                        <PopoverHeader fontWeight='semibold'>Email</PopoverHeader>
                                        <PopoverArrow />
                                        <PopoverCloseButton />
                                        <PopoverBody className='popBody' key={item.email + item.name}>
                                            {item.email}
                                        </PopoverBody>
                                    </PopoverContent>
                                </Popover>
                            </>
                        }
                            </Td>
                            <Td key={item.phone}>{item.phone}</Td>
                            <Td key={item.name + Math.random()}>{item.age}</Td>
                            <Td key={item.phone + Math.random() + i}>{item.gender}</Td>
                            <Td key={item.email + Math.random() + i}>
                            {
                            (item.address) &&
                            <>
                                <Popover placement='top-start'>
                                    <PopoverTrigger>
                                        <Button size="sm" colorScheme='blue' mx={2}>Read</Button>                                    
                                    </PopoverTrigger>
                                    <PopoverContent className="popContent" w="fit-content">
                                        <PopoverHeader fontWeight='semibold'>Address</PopoverHeader>
                                        <PopoverArrow />
                                        <PopoverCloseButton />
                                        <PopoverBody className='popBody'>
                                            {item.address}
                                        </PopoverBody>
                                    </PopoverContent>
                                </Popover>
                            </>
                        }
                            </Td>
                            <Td>
                                <Button colorScheme='green' size="sm" onClick={() => {
                                    if (nameRef.current != null) nameRef.current.value = item.name
                                    if (emailRef.current != null) emailRef.current.value = item.email
                                    if (ageRef.current != null) ageRef.current.value = `${item.age}`
                                    if (addressRef.current != null) addressRef.current.value = item.address
                                    if (genderRef.current != null) genderRef.current.value = item.gender
                                    if (phoneRef.current != null) phoneRef.current.value = item.phone
                                    const patientId = document.querySelector(".patientId");
                                    if (patientId != undefined) patientId.innerHTML = item._id;
                                    const updateForm = document.querySelector(".updateForm");
                                    updateForm?.classList.remove("hidden");
                                }}>Update</Button>
                            </Td>
                            <Td>
                                <RiDeleteBin6Line className='deleteIcon' onClick={async () => {
                                    setLoading(true);
                                    await axios.delete(`${import.meta.env.VITE_NODE_URL}/api/patient/deletePatient/${item._id}`, { withCredentials : true})
                                    .then((item) => {
                                        if (item.status == 200){
                                            const fetchedData = item.data.patient;
                                            setAllPatient({...fetchedData});
                                        }
                                        setLoading(false);
                                    }).catch(Error => {
                                        console.log('Error', Error);
                                        setLoading(false);
                                    })
                                }}/>
                            </Td>
                        </Tr>
                    )}
                </Tbody>
                <Tfoot>
                <Tr>
                    <Th>S.N</Th>
                    <Th>Patient Name</Th>
                    <Th>Email</Th>
                    <Th>Phone</Th>
                    <Th>Age</Th>
                    <Th>Gender</Th>
                    <Th>Address</Th>
                    <Th>Update</Th>
                    <Th>Delete</Th>
                </Tr>
                </Tfoot>
            </Table>
        </TableContainer>
    </div>
  )
}

export default PatientAllTable
