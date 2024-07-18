import { Button, FormControl, FormLabel, HStack, Input, Select, Stack, VStack } from '@chakra-ui/react'
import style from 'styled-components';
import PatientNameTable from './PatientNameTable';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { SiTicktick } from "react-icons/si";

const FlexDiv = style.div`
    display: flex;
    width : 100%;
    justify-content : space-evenly;
    color : #4A5568;
`

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
  setLoading :  React.Dispatch<React.SetStateAction<boolean>>
}

interface Patient {
    name : String,
    email : String,
    phone : Number,
    age : Number,
    address : String,
    gender : String,
    totalSession : Number,
    sessionCompleted : Number,
    problem : String,
    subProblem : String,
    totalAmount : Number
}

const PatientForm = ({setLoading} : Props) => {
    const {register, handleSubmit, formState : {errors}} = useForm<Patient>()
    const problems = ["Teeth / Mouth checkup", "Scaling", "Teeth Polishing", "Filling", "RCT", "Crowning / Bridge", "Add Full Set Teeth", "Teeth Extraction", "Surgery Case", "Braces Binding", "Teeth Implant", "Other"]
    const scaling = ["Mild", "Moderete", "Severe"];
    const filling = ["Anterior Tooth / Cosmetic Restoration" , "Posterior Tooth", "Children's Filling"]
    const rct = ["Post And Core", "Pulpectomy" ];
    const crowning = ["Metal", "Metal Ceramic (PFM)", "EMax", "Zirconia"]
    const [subProblem, setSubProblem] = useState("");
    const [logError, setLogError] = useState('');
    const navigate = useNavigate();
    
    const onSubmit: SubmitHandler<Patient> = async (data) => {
        setLoading(true);
        let subValue;
        if (subProblem == "Scaling" || subProblem == "Filling" || subProblem == "RCT" || subProblem == "Crowning / Bridge"){
            subValue = data.subProblem
        }else{
            subValue = "None"
        }
        await axios.post(`${import.meta.env.VITE_NODE_URL}/api/patient/`,{
            name : data.name,
            email : data.email,
            phone : data.phone,
            age : data.age,
            address : data.address,
            gender : data.gender,
            totalSession : data.totalSession,
            sessionCompleted : data.sessionCompleted,
            problem : data.problem,
            subProblem : subValue,
            totalAmount : data.totalAmount,
            createdAt: Date.now()
        }, { withCredentials: true })
        .then(() => {
            let successModal = document.querySelector(".successModal");
            successModal?.classList.remove("hidden");
            setTimeout(() => {
                successModal?.classList.add("hidden");
                navigate(`/patient-record/${data.phone}`)
            },900)
            setLoading(false);
            
        }).catch(Error => {
            console.log('Error', Error)
            setLogError(Error.response.data.message)
            setLoading(false);
        })
    }

  return (
    <FlexDiv>
        <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl w="100%" px={4}>
                <HStack my={4}>
                    <FormLabel>Name</FormLabel>
                    <VStack>
                        <Input type='text' placeholder='Patient Name' {...register('name', {required: true})}/>
                        {
                            errors.name && <ErrorMsg>Patient name is required.</ErrorMsg>
                        }
                    </VStack>
                    <FormLabel>Email</FormLabel>
                    <VStack>
                        <Input type='email' placeholder='Patient Email' {...register('email', {required: true})} />
                        {
                            logError.includes('Patient with this email') ? <ErrorMsg>Patient already exists with this email!</ErrorMsg> : ""
                        }
                    </VStack>
                </HStack>
                <HStack my={4}>
                    <FormLabel>Age</FormLabel>
                    <VStack>
                        <Input type='number' placeholder='Patient Age' {...register('age', {required: true})} />
                        {
                            errors.age && <ErrorMsg>Patient age is required.</ErrorMsg>
                        }
                    </VStack>
                    <FormLabel>Phone</FormLabel>
                    <VStack>
                        <Input type='number'placeholder='Patient Phone' {...register('phone', {required: true})} />
                        {
                            errors.phone && <ErrorMsg>Patient number is required.</ErrorMsg>
                        }
                        {
                            logError.includes('Patient with this phone number') ? <ErrorMsg>Patient already exists with this phone number!</ErrorMsg> : ""
                        }
                    </VStack>
                </HStack>
                <HStack my={4}>
                    <FormLabel>Address</FormLabel>
                    <VStack>
                        <Input type='text' placeholder='Patient Address' {...register('address', {required: true})} />
                        {
                            errors.address && <ErrorMsg>Patient address is required.</ErrorMsg>
                        }
                    </VStack>
                    <FormLabel>Gender</FormLabel>
                    <VStack>
                        <Stack spacing={3}>
                            <Select placeholder='Select option' {...register('gender', {required: true})}>
                                <option value='Male'>Male</option>
                                <option value='Female'>Female</option>
                                <option value='Other'>Other</option>
                            </Select>
                        </Stack>
                        {
                            errors.gender && <ErrorMsg>Patient Gender is required.</ErrorMsg>
                        }
                    </VStack>
                </HStack>
                <HStack my={4}>
                    <FormLabel>Session</FormLabel>
                    <VStack>
                        <Input type='number' placeholder='Total Session' {...register('totalSession', {required: true})} />
                        {
                            errors.totalSession && <ErrorMsg>Total Session is required.</ErrorMsg>
                        }
                    </VStack>
                    <FormLabel>Amount</FormLabel>
                    <VStack>
                        <Input type='number' placeholder='Total Amount' {...register('totalAmount', {required: true})} />
                        {
                            errors.totalAmount && <ErrorMsg>Total Amount is required.</ErrorMsg>
                        }
                    </VStack>
                </HStack>
                <HStack>
                    <FormLabel>Problem</FormLabel>
                    <Stack spacing={3}>
                        <Select placeholder='Select option' {...register('problem', {required: true})}>
                            {problems.map(item => <option key={item} onClick={() => {
                                setSubProblem(item);
                            }}>{item}</option>)}
                        </Select>
                    </Stack>
                    {
                        errors.problem && <ErrorMsg>Patient problem is required.</ErrorMsg>
                    }
                    {subProblem == "Scaling" || subProblem == "Filling" || subProblem == "RCT" || subProblem == "Crowning / Bridge" ?
                    <><FormLabel>{subProblem}</FormLabel><Stack spacing={3}>
                              <Select placeholder='Select option' {...register('subProblem', { required: true })}>
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
                <Button type="submit" colorScheme='blue' my={4}>Add</Button>
            </FormControl>
        </form>
        <PatientNameTable setLoading = {setLoading} />
        <Modal className = "successModal hidden">
            <ModalBody>
                <p>Patient has been added.</p>
                <SiTicktick className="tick" />
                <ModalButton onClick={() => {
                    let successModal = document.querySelector(".successModal");
                    successModal?.classList.add("hidden");
                }}>Close</ModalButton>
            </ModalBody>
        </Modal>
    </FlexDiv>
  )
}

export default PatientForm
