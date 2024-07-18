import React, { useEffect, useState } from 'react'
import {Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer, Button, PopoverTrigger} from '@chakra-ui/react'
import {Popover,PopoverContent,PopoverHeader,PopoverBody,PopoverArrow,PopoverCloseButton} from '@chakra-ui/react'
import axios from 'axios'
import { RiDeleteBin6Line } from 'react-icons/ri';

interface Props{
    setLoading :  React.Dispatch<React.SetStateAction<boolean>>,
    setPatientSubRecord: React.Dispatch<React.SetStateAction<{
        _id: string;
        patientRecord: string;
        session: number;
        leftSession: number;
        treatment: string;
        paidAmount: number;
        dueAmount : number;
    }[]>>,
    patientSubRecord: {
        _id: string;
        patientRecord: string;
        session: number;
        leftSession: number;
        treatment: string;
        paidAmount: number;
        dueAmount : number;
    }[],
    textareaRef: React.RefObject<HTMLTextAreaElement>,
    sessionRef: React.RefObject<HTMLInputElement>,
    amountRef: React.RefObject<HTMLInputElement>
}

const PatientSubRecordTable = ({setLoading, setPatientSubRecord, patientSubRecord, textareaRef, sessionRef, amountRef}: Props) => {
    let pathname = location.pathname;
    const frontHalf = pathname.split('/sub-record/')[0];
    const id = frontHalf.split('/patient/')[1];
    const [currentUser, setCurrentUser] = useState('');
    const getUser = async() => {
        setLoading(true);
        await axios.get(`${import.meta.env.VITE_NODE_URL}/api/user/getUser/${document.cookie}`, { withCredentials: true })
        .then((item:any) => {
          const {data} = item;
          const user =  data.user
          setCurrentUser(user.role);
          setLoading(false);
        }).catch(Error => {
          setLoading(false);
          console.log('Error', Error)
        })
      }
      const getPatientSubRecord = async() => {
        setLoading(true);
        await axios.get(`${import.meta.env.VITE_NODE_URL}/api/patient/sub/record/getOnePatientSubRecord/${id}`, { withCredentials: true })
        .then((item:any) => {
            const {data} = item;
            const fetchedData =  data.patientSubRecord
            setPatientSubRecord({...fetchedData})
            setLoading(false);
        }).catch(Error => {
            setLoading(false);
            console.log('Error', Error)
        })
    }

    useEffect(() => {
        getPatientSubRecord();
        getUser();
    }, []);
  return (
    <div>
      <p className='recordHeading margin'>All Records</p>
        <TableContainer className='recordsTable'>
            <Table variant='simple' size='sm' m={4}>
                <TableCaption>Records</TableCaption>
                <Thead>
                <Tr>
                    <Th>S.N</Th>
                    <Th>Treatment For</Th>
                    <Th>Session</Th>
                    {
                        currentUser == "superuser" && <>
                            <Th>Paid Amount</Th>
                            <Th>Update</Th>
                            <Th>Delete</Th>
                        </>
                    }
                </Tr>
                </Thead>
                <Tbody> 
                    {Object.entries(patientSubRecord).map(([key, item], i) => <Tr key={key}>
                        <Td key={i + 1}>{i + 1}</Td>
                        {
                        item.treatment != undefined && <Td className="messageTableBox" key={Date.now() + Math.random()}>{(item.treatment).substring(0, 10)} 
                        {
                            (item.treatment).length > 10 &&
                            <>
                                ....
                                <Popover placement='top-start'>
                                    <PopoverTrigger>
                                        <Button size="sm" colorScheme='blue' mx={2}>More</Button>                                    
                                    </PopoverTrigger>
                                    <PopoverContent className="popContent" w="fit-content">
                                        <PopoverHeader fontWeight='semibold'>Message</PopoverHeader>
                                        <PopoverArrow />
                                        <PopoverCloseButton />
                                        <PopoverBody className='popBody'>
                                            {item.treatment}
                                        </PopoverBody>
                                    </PopoverContent>
                                </Popover>
                            </>
                        }
                    </Td>
                    }
                        <Td key={Math.random()}>{item.session}</Td>
                        {
                        currentUser == "superuser" && <>
                            <Td>{item.paidAmount}</Td>
                            <Td>{
                                <Button colorScheme='green' size="sm" onClick={() => {
                                    if (textareaRef.current != null) textareaRef.current.value = item.treatment
                                    if (sessionRef.current != null) sessionRef.current.value = `${item.session}`
                                    if (amountRef.current != null) amountRef.current.value = `${item.paidAmount}`
                                    const addButton = document.querySelector(".addButton");
                                    const updateButton = document.querySelector(".updateButton");
                                    addButton?.classList.add('hidden');
                                    updateButton?.classList.remove('hidden');
                                    let idval = document.querySelector(".subRecordId");
                                    if (idval != undefined) idval.innerHTML = item._id
                                }}>Update</Button>
                                }</Td>
                            <Td><RiDeleteBin6Line className='deleteIcon' onClick={async () => {
                                setLoading(true);
                                await axios.delete(`${import.meta.env.VITE_NODE_URL}/api/patient/sub/record/delete/${item._id}/${id}`, { withCredentials : true})
                                .then((appointmentItem:any) => {
                                    const fetchedData = appointmentItem.data.patientSubRecord;
                                    setPatientSubRecord({...fetchedData})
                                    setLoading(false);
                                }).catch(Error => {
                                    console.log('Error', Error)
                                    setLoading(false);
                                })
                            }} /></Td>
                        </>
                    }
                    </Tr>
                    )}
                </Tbody>
                <Tfoot>
                <Tr>
                    <Th>S.N</Th>
                    <Th>Treatment For</Th>
                    <Th>Session</Th>
                    {
                        currentUser == "superuser" && <>
                            <Th>Paid Amount</Th>
                            <Th>Update</Th>
                            <Th>Delete</Th>
                        </>
                    }
                </Tr>
                </Tfoot>
            </Table>
        </TableContainer>
    </div>
  )
}

export default PatientSubRecordTable
