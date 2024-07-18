import { Button, FormControl, FormLabel, HStack, Input, Select, Stack, VStack } from '@chakra-ui/react';
import axios from 'axios';
import React, { useState } from 'react'
import style from 'styled-components';
import { SiTicktick } from "react-icons/si";

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
    setPatientRecord: React.Dispatch<React.SetStateAction<{
        _id: string;
        problem: string;
        subProblem: string;
        totalSession: number;
        sessionCompleted: number;
        totalAmount: number;
        dueAmount: number;
        leftSession: number;
    }[]>>,
    problemRef: React.RefObject<HTMLSelectElement>,
    subProblemRef: React.RefObject<HTMLSelectElement>,
    sessionRef: React.RefObject<HTMLInputElement>,
    amountRef: React.RefObject<HTMLInputElement>
} 

const PatientRecordForm = ({setLoading, setPatientRecord, problemRef, subProblemRef, sessionRef, amountRef} : Props) => {
    const problems = ["Teeth / Mouth checkup", "Scaling", "Teeth Polishing", "Filling", "RCT", "Crowning / Bridge", "Add Full Set Teeth", "Teeth Extraction", "Surgery Case", "Braces Binding", "Teeth Implant", "Other"]
    const scaling = ["Mild", "Moderete", "Severe"];
    const filling = ["Anterior Tooth / Cosmetic Restoration" , "Posterior Tooth", "Children's Filling"]
    const rct = ["Post And Core", "Pulpectomy" ];
    const crowning = ["Metal", "Metal Ceramic (PFM)", "EMax", "Zirconia"]
    const [subProblem, setSubProblem] = useState("");
    const [error, setError] = useState("");
    let pathname = location.pathname;
    const num = pathname.split('/patient-record/')[1];
  return (
    <div>
        <form>
            <FormControl w="80%" m={4}>
                <p className='recordHeading'>Add To Records</p>
                <HStack>
                    <FormLabel>Problem</FormLabel>
                    <Stack spacing={3}>
                        <Select placeholder='Select option' ref={problemRef} required>
                            {problems.map(item => <option key={item} onClick={() => {
                                setSubProblem(item);
                            }}>{item}</option>)}
                        </Select>
                    </Stack>
                    {
                        error == "problem-error" && <ErrorMsg>Patient problem is required.</ErrorMsg>
                    }
                    {subProblem == "Scaling" || subProblem == "Filling" || subProblem == "RCT" || subProblem == "Crowning / Bridge" ?
                    <><FormLabel>{subProblem}</FormLabel><Stack spacing={3}>
                                <Select placeholder='Select option' ref={subProblemRef}>
                                    {subProblem == "Scaling" ? scaling.map(item => <option key={item}>{item}</option>)
                                        : subProblem == "Filling" ? filling.map(item => <option key={item}>{item}</option>)
                                            : subProblem == "RCT" ? rct.map(item => <option key={item}>{item}</option>)
                                                : subProblem == "Crowning / Bridge" ? crowning.map(item => <option key={item}>{item}</option>)
                                                    : ""}
                                </Select>
                            </Stack></>
                    : ""
                    }
                </HStack>
                <HStack my={4}>
                    <FormLabel>Session</FormLabel>
                    <VStack>
                        <Input type='number' placeholder='Total Session' ref={sessionRef} required/>
                        {
                            error == "session-error" && <ErrorMsg>Total Session is required.</ErrorMsg>
                        }
                    </VStack>
                    <FormLabel>Amount</FormLabel>
                    <VStack>
                        <Input type='number' placeholder='Total Amount' ref={amountRef} required/>
                        {
                            error == "amount-error" && <ErrorMsg>Total Amount is required.</ErrorMsg>
                        }
                    </VStack>
                </HStack>
                <Button colorScheme='blue' className='addButton' onClick={async () => {
                    setLoading(true);
                    let subValue;
                    if (subProblem == "Scaling" || subProblem == "Filling" || subProblem == "RCT" || subProblem == "Crowning / Bridge"){
                        subValue = subProblemRef.current?.value;
                    }else{
                        subValue = "None"
                    }
                    
                    await axios.post(`${import.meta.env.VITE_NODE_URL}/api/patient/record/createRecord/${num}`,{
                        problem : problemRef.current?.value,
                        subProblem : subValue,
                        totalSession : sessionRef.current?.value,
                        totalAmount : amountRef.current?.value,
                        createdAt: Date.now()
                    }, { withCredentials: true })
                    .then((item:any) => {
                        const {data} = item;
                        const fetchedData =  data.patientRecord
                        setPatientRecord({...fetchedData})
                        if (problemRef.current != null) problemRef.current.value = ""
                        if (subProblemRef.current != null) subProblemRef.current.value = ""
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
                            if (msg.includes('totalsession')) setError('session-error');
                            if (msg.includes('problem')) setError('problem-error');
                            if (msg.includes('total amount')) setError('amount-error');
                        }
                        setLoading(false);
                    })
                }}>Add</Button>
                <p className='recordId hidden'></p>
                <Button colorScheme='green' className='updateButton hidden' onClick={async() => {
                    setLoading(true);
                    let idval = document.querySelector(".recordId")?.innerHTML;
                    let subValue;
                    if (subProblem == "Scaling" || subProblem == "Filling" || subProblem == "RCT" || subProblem == "Crowning / Bridge"){
                        subValue = subProblemRef.current?.value;
                    }else{
                        subValue = "None"
                    }
                    await axios.patch(`${import.meta.env.VITE_NODE_URL}/api/patient/record/updateRecord/${idval}/${num}`, {
                        problem : problemRef.current?.value,
                        subProblem : subValue,
                        session : sessionRef.current?.value,
                        totalAmount : amountRef.current?.value
                    }, { withCredentials : true})
                    .then((item) => {
                        if (item.status == 200){
                            const fetchedData = item.data.patientRecord;
                            setPatientRecord({...fetchedData});
                            if (problemRef.current != null) problemRef.current.value = ""
                            if (subProblemRef.current != null) subProblemRef.current.value = ""
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
                            if (msg.includes('totalsession')) setError('session-error');
                            if (msg.includes('problem')) setError('problem-error');
                            if (msg.includes('total amount')) setError('amount-error');
                        }
                        setLoading(false);
                    })
                }
                }>Update</Button>
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

export default PatientRecordForm
