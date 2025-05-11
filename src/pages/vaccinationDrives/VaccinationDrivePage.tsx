import React from 'react';
import { Routes, Route } from 'react-router-dom';
import VaccinationDriveForm from './VaccinationDriveForm';
import VaccinationDriveList from './VaccinationDriveList';

const VaccinationDrivePage: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<VaccinationDriveList />} />
      <Route path="/new" element={<VaccinationDriveForm />} />
      <Route path="/edit/:id" element={<VaccinationDriveForm />} />
    </Routes>
  );
};

export default VaccinationDrivePage;
