import {Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer} from '@chakra-ui/react'
import PatientNameSearch from './PatientNameSearch'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

interface Props{
    setLoading :  React.Dispatch<React.SetStateAction<boolean>>,
  }

const PatientNameTable = ({setLoading} : Props) => {
    const navigate = useNavigate();
    const [showComponent, setShowComponent] = useState(false);
    const [patient, setPatient] = useState('')
    const [searchVal, setSearchVal] = useState('')
  return (
    <div>
        <PatientNameSearch setLoading={setLoading} setPatient={setPatient} setShowComponent = {setShowComponent} setSearchVal={setSearchVal}/>
        <TableContainer  className="tableBody">
            <Table variant='simple'>
                <TableCaption>Patients</TableCaption>
                <Thead>
                <Tr>
                    <Th>S.N</Th>
                    <Th>Patient Name</Th>
                </Tr>
                </Thead>
                <Tbody> 
                    {
                        showComponent == true ? <Tr>
                            <Td>1</Td>
                            <Td className="tdLink" onClick={() => {
                                navigate(`/patient-record/${searchVal}`)
                            }}>{patient}</Td>
                        </Tr>
                    : <Tr>
                            <Td>1</Td>
                            <Td>Ramlal</Td>
                        </Tr>
                    }
                
                </Tbody>
                <Tfoot>
                <Tr>
                    <Th>S.N</Th>
                    <Th>Patient Name</Th>
                </Tr>
                </Tfoot>
            </Table>
        </TableContainer>
    </div>
  )
}

export default PatientNameTable
