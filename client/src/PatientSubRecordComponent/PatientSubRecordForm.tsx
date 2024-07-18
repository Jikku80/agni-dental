import { Button, FormControl, FormLabel, HStack, Input, Textarea, VStack } from '@chakra-ui/react';
import axios from 'axios';
import style from 'styled-components';
import { SiTicktick } from "react-icons/si";
import { useState } from 'react';

const ErrorMsg = style.p`
    color : crimson;
    font-size: 12px;
`

const Modal = style.div`
    height : 100vh;
    width : 100vw;
    position : fixed;
    top : 0;
    display : flex;
    justify-content : center;
    align-items : center;
    background-color: #0003;;
`

const ModalBody = style.div`
    background-color : white;
    color : #4A5568;
    padding : 2%;
    border-radius : 10px;
    display: flex;
    flex-direction : column;
    justify-content : center;
    align-items : center;
`

const ModalButton = style.button`
    background-color : #eaeaea;
    color : #4A5568;
    border-radius : 10px;
    padding : 2%;
    margin-top : 2%;
    width: fit-content;

    &:hover{
    background-color : #bfbfbf;
    }
`

interface Props{
    setLoading :  React.Dispatch<React.SetStateAction<boolean>>,
    setPatientSubRecord: React.Dispatch<React.SetStateAction<{
        _id: string,
        patientRecord: string;
        session: number;
        leftSession: number;
        treatment: string;
        paidAmount: number;
        dueAmount : number;
    }[]>>,
    textareaRef: React.RefObject<HTMLTextAreaElement>,
    sessionRef: React.RefObject<HTMLInputElement>,
    amountRef: React.RefObject<HTMLInputElement>
}

const PatientSubRecordForm = ({setLoading, setPatientSubRecord, textareaRef, sessionRef, amountRef} : Props) => {
    let pathname = location.pathname;
    const frontHalf = pathname.split('/sub-record/')[0];
    const id = frontHalf.split('/patient/')[1];
    const [error, setError] = useState("");
  return (
    <div>
      <form>
            <p className='subRecordHead'>Add To Todays Records</p>
            <FormControl w="50%" m={4}>
                <HStack>
                    <FormLabel>Treatment</FormLabel>
                    <VStack w="100%">
                        <Textarea className='treatmentInput' w="100%" resize="none" placeholder="Treatment done of this in todays session...." ref={textareaRef} required/>
                        {
                            error == "treatment-error" && <ErrorMsg>Treatment must be Provided!</ErrorMsg>
                        }
                    </VStack>
                </HStack>
                <HStack my={4}>
                    <FormLabel>Session</FormLabel>
                    <VStack>
                        <Input type='number' placeholder='Session' ref={sessionRef} required/>
                        {
                            error == "session-error" && <ErrorMsg>Session must be Provided!</ErrorMsg>
                        }
                    </VStack>
                    <FormLabel>Amount</FormLabel>
                    <VStack>
                        <Input type='number' placeholder='Paid Amount' ref={amountRef} required/>
                        {
                            error == "amount-error" && <ErrorMsg>Paid Amount must be Provided!</ErrorMsg>
                        }
                    </VStack>
                </HStack>
                <Button className='addButton' colorScheme='blue' onClick={async () => {
                    setLoading(true);
                    await axios.post(`${import.meta.env.VITE_NODE_URL}/api/patient/sub/record/create-sub-record/${id}`,{
                        patientRecord : id,
                        session : sessionRef.current?.value,
                        treatment : textareaRef.current?.value,
                        paidAmount : amountRef.current?.value,
                        createdAt: Date.now()
                    }, { withCredentials: true })
                    .then((item:any) => {
                        const {data} = item;
                        const fetchedData =  data.patientSubRecord
                        setPatientSubRecord({...fetchedData})
                        if (textareaRef.current != null) textareaRef.current.value = ""
                        if (sessionRef.current != null) sessionRef.current.value = ""
                        if (amountRef.current != null) amountRef.current.value = ""
                        let successModal = document.querySelector(".successModal");
                        successModal?.classList.remove("hidden");
                        setTimeout(() => {
                            successModal?.classList.add("hidden");
                        },900)
                        setLoading(false);
                        
                    }).catch(Error => {
                        console.log('Error', Error)
                        let data = Error.response.data;
                        if (Error.response.status == 400){
                            let msg =(data.message).toLowerCase();
                            if (msg.includes('session')) setError('session-error');
                            if (msg.includes('treatment')) setError('treatment-error');
                            if (msg.includes('paid amount')) setError('amount-error');
                        }
                        setLoading(false);
                    })
                }} >Add</Button>
                <p className='subRecordId hidden'></p>
                <Button className='updateButton hidden' colorScheme='green' onClick={async () => {
                    setLoading(true);
                    let idval = document.querySelector(".subRecordId")?.innerHTML;
                    await axios.patch(`${import.meta.env.VITE_NODE_URL}/api/patient/sub/record/update/${idval}/${id}`, {
                        treatment : textareaRef.current?.value,
                        session : sessionRef.current?.value,
                        paidAmount : amountRef.current?.value
                    }, { withCredentials : true})
                    .then((item) => {
                        if (item.status == 200){
                            const fetchedData = item.data.patientSubRecord;
                            setPatientSubRecord({...fetchedData});
                            if (textareaRef.current != null) textareaRef.current.value = ""
                            if (sessionRef.current != null) sessionRef.current.value = ""
                            if (amountRef.current != null) amountRef.current.value = ""
                            const addButton = document.querySelector(".addButton");
                            const updateButton = document.querySelector(".updateButton");
                            addButton?.classList.remove('hidden');
                            updateButton?.classList.add('hidden');
                        }
                        setLoading(false);
                    }).catch(Error => {
                        console.log('Error', Error)
                        let data = Error.response.data;
                        if (Error.response.status == 400){
                            let msg =(data.message).toLowerCase();
                            if (msg.includes('session')) setError('session-error');
                            if (msg.includes('treatment')) setError('treatment-error');
                            if (msg.includes('paid amount')) setError('amount-error');
                        }
                        setLoading(false);
                    })
                }}>Update</Button>
            </FormControl>
        </form>
        <Modal className = "successModal hidden">
            <ModalBody>
                <p>Patient Record has been added.</p>
                <SiTicktick className="tick" />
                <ModalButton onClick={() => {
                    let successModal = document.querySelector(".successModal");
                    successModal?.classList.add("hidden");
                }}>Close</ModalButton>
            </ModalBody>
        </Modal>
    </div>
  )
}

export default PatientSubRecordForm
