import PatientRecordForm from './PatientRecordForm';
import React, { useRef, useState } from 'react'
import PatientRecordTable from './PatientRecordTable';

interface Props{
    setLoading :  React.Dispatch<React.SetStateAction<boolean>>
}

const PatientRecordContent = ({setLoading} : Props) => {
    const [patientRecord, setPatientRecord] = useState([{
      _id: '', problem : '', subProblem : '', totalSession : 0, sessionCompleted : 0, totalAmount : 0, leftSession : 0, dueAmount : 0
  }])
  
  const problemRef = useRef<HTMLSelectElement>(null);
  const subProblemRef = useRef<HTMLSelectElement>(null);
  const sessionRef = useRef<HTMLInputElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <PatientRecordForm setLoading={setLoading} setPatientRecord={setPatientRecord} problemRef={problemRef} subProblemRef={subProblemRef} sessionRef={sessionRef} amountRef={amountRef}/>
      <PatientRecordTable setLoading={setLoading} setPatientRecord={setPatientRecord} patientRecord={patientRecord} problemRef={problemRef} subProblemRef={subProblemRef} sessionRef={sessionRef} amountRef={amountRef}/>
    </div>
  )
}

export default PatientRecordContent
