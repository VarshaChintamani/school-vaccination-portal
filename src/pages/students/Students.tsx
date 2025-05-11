import React, { useEffect, useState } from 'react';
import { deleteStudent, getStudents } from '../../services/api';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import AddStudentForm from './AddStudentForm';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';

interface Student {
  id: number;
  full_name: string;
  class: number;
  roll_number: string;
  dob: string;
  gender: string;
}

const StudentsList: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null); // Store the selected student
  const [refresh, setRefresh] = useState(false);
  const refreshList = () => setRefresh(!refresh);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null); 

  console.log("studnets",students);
  const handleEdit = (student: Student) => {
    setSelectedStudent(student); // Set the selected student for editing
    navigate('/addStudent' ,{ state: student})
    // toggleDrawer(true)(); // Open the drawer
  };
  const handleDelete = (id: number) => {
    deleteStudent(id.toString())
      .then((response: any) => {
        if (response.ok) {
          console.log('Student deleted successfully');
          refreshList();
        } else {
          console.error('Failed to delete student');
        }
      })
      .catch((error: any) => {
        console.error('Error deleting student:', error);
      });
    setDialogOpen(false); // Close the dialog after delete
  };

  const handleOpenDialog = (student: Student) => {
    setStudentToDelete(student); // Store the student to delete
    setDialogOpen(true); // Open the dialog
  };

  const handleCloseDialog = () => {
    setDialogOpen(false); // Close the dialog
    setStudentToDelete(null); // Reset the student to delete
  };


  useEffect(() => {
    const fetchStudents = async () => {
      const data = await getStudents();
      setStudents(data);
    };
    fetchStudents();
  }, [refresh]);

  const columns: GridColDef[] = [
   
    {
      field: 'full_name',
      headerName: 'Full Name',
      width: 200,
    },
    {
      field: 'class',
      headerName: 'Class',
      width: 120,
    },
    {
      field: 'roll_number',
      headerName: 'Roll Number',
      width: 180,
    },
    {
      field: 'dob',
      headerName: 'Date of Birth',
      width: 180,
      renderCell: (params: any) => {
        const dob = new Date(params.row.dob).toLocaleDateString();
        return <span>{dob}</span>;
            }
      // valueFormatter: (params) => new Date(params.value).toLocaleDateString(),
    },
    {
      field: 'gender',
      headerName: 'Gender',
      width: 150,
    },
    {
      field: 'vacc_drive',
      headerName: 'Vaccination Drive',
      width: 150,

    },
    {
      field: 'vacc_status',
      headerName: 'Vaccination Status',
      width: 150,
    },
    {
      field: '',
      headerName: 'Actions',
      width: 200,
      renderCell: (params: any) => (
        <>
        <Button
          variant="outlined"
          color="info"
          onClick={() => handleEdit(params.row)}
          >
          <Edit />
        </Button>
        <Button
          variant="outlined"
          color="info"
          onClick={() => handleOpenDialog(params?.row)}
          sx={{ml:2}}
          >
          <Delete />
        </Button>
          </>
      ),
    },
  ];
  
console.log("refresh",refresh);


  const toggleDrawer = (open: boolean)  => {
    setOpen(!open);
  };

const navigate = useNavigate();

  const handleAddStudent = ()=>{
    navigate('/addStudent')
  }
console.log("selectedStudent",selectedStudent);

  return (
    <div>
      <Typography sx={{ mt:'75px', mb:'20px'}}>Students List</Typography>
      <Box>
        <Button onClick={()=>handleAddStudent()} variant="outlined" className='custom-input'>
          <Add className='iconBtnCss' />
          Add
        </Button>
      </Box>

      <Box sx={{mt: 2}}>
        <DataGrid
          rows={students}
          columns={columns}
        />
      </Box>
{open && 
      <AddStudentForm 
        open={open}
        toggleDrawer={toggleDrawer}
        studentData = {selectedStudent}
        refreshList={refreshList}
      />
}
<Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this student?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (studentToDelete) {
                handleDelete(studentToDelete.id); // Delete the student when confirmed
              }
            }}
            color="error"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default StudentsList;
