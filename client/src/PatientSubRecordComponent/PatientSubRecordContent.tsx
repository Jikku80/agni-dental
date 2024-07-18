import React, { useRef, useState } from 'react'
import PatientSubRecordForm from './PatientSubRecordForm';
import PatientSubRecordTable from './PatientSubRecordTable';

interface Props{
    setLoading :  React.Dispatch<React.SetStateAction<boolean>>
}

const PatientSubRecordContent = ({setLoading} : Props) => {
  const [patientSubRecord, setPatientSubRecord] = useState([{
    _id:'', patientRecord : '', session : 0, leftSession: 0, treatment : '', paidAmount : 0, dueAmount: 0
  }])

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const sessionRef = useRef<HTMLInputElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);
    
  return (
    <div>
      <PatientSubRecordForm setLoading={setLoading} setPatientSubRecord={setPatientSubRecord} textareaRef={textareaRef} sessionRef={sessionRef} amountRef={amountRef}/>
      <PatientSubRecordTable setLoading={setLoading} setPatientSubRecord={setPatientSubRecord} patientSubRecord={patientSubRecord} textareaRef={textareaRef} sessionRef={sessionRef} amountRef={amountRef} />
    </div>
  )
}

export default PatientSubRecordContent
