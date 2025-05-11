import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteDrive, fetchAllDrives } from '../../services/vaccinationDriveService';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Button, Typography } from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';

const VaccinationDriveList: React.FC = () => {
  const [drives, setDrives] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadDrives = async () => {
      try {
        const data = await fetchAllDrives();
        setDrives(data);
      } catch (error) {
        console.error('Failed to load drives');
      }
    };
    loadDrives();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this drive?')) {
      try {
        await deleteDrive(id);
        setDrives(prev => prev.filter(d => d.id !== id));
      } catch (error) {
        console.error('Delete failed');
      }
    }
  };
  const columns: GridColDef[] = [
   
    {
      field: 'vaccine_name',
      headerName: 'Vaccine Name',
      width: 200,
    },
    {
      field: 'drive_date',
      headerName: 'Drive Date',
      width: 120,
      renderCell: (params: any) => {
        const dob = new Date(params.row.drive_date).toLocaleDateString();
        return <span>{dob}</span>;
            }
    },
    {
      field: 'available_doses',
      headerName: 'Available Doses',
      width: 180,
    },
    {
      field: 'applicable_classes',
      headerName: 'Applicable Classes',
      width: 180,
      // renderCell: (params: any) => {
      //   const dob = new Date(params.row.dob).toLocaleDateString();
      //   return <span>{dob}</span>;
      //       }
      // valueFormatter: (params) => new Date(params.value).toLocaleDateString(),
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
          // onClick={() => handleEdit(params.row)}
          >
          <Edit />
        </Button>
        <Button
          variant="outlined"
          color="info"
          onClick={() => handleDelete(params?.row)}
          sx={{ml:2}}
          >
          <Delete />
        </Button>
          </>
      ),
    },
  ];

  const handleAddStudent = () => {
    navigate('/vaccination-drives/new')    
  }
  return (
    <div>
 <Typography sx={{ mt: '75px', mb:'20px'}}>Vaccination Drives</Typography>
      <Box>
        <Button onClick={()=>handleAddStudent()} variant="outlined" className='custom-input' sx={{mb:'13px'}}>
          <Add className='iconBtnCss' />
          Add Drive
        </Button>
      </Box>
      {drives.length === 0 ? (
        <p>No drives found</p>
      ) : (
        <DataGrid
        rows={drives}
        columns={columns}
        />
        // <table className="w-full table-auto border">
        //   <thead className="bg-gray-200">
        //     <tr>
        //       <th>Date</th>
        //       <th>Vaccine</th>
        //       <th>Classes</th>
        //       <th>Doses</th>
        //       <th>Actions</th>
        //     </tr>
        //   </thead>
        //   <tbody>
        //     {drives.map(d => (
        //       <tr key={d.id} className="text-center border-t">
        //         <td>{d.date}</td>
        //         <td>{d.vaccine_name}</td>
        //         <td>{d.applicable_classes}</td>
        //         <td>{d.available_doses}</td>
        //         <td>
        //           <button onClick={() => navigate(`/drives/edit/${d.id}`)} className="text-blue-600 mr-2">
        //             Edit
        //           </button>
        //           <button onClick={() => handleDelete(d.id)} className="text-red-600">
        //             Delete
        //           </button>
        //         </td>
        //       </tr>
        //     ))}
        //   </tbody>
        // </table>
      )}
    </div>
  );
};

export default VaccinationDriveList;
