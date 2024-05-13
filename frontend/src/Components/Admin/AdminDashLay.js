import React, { useState } from 'react';
import Batch from './AddBatch';
import AddStudent from './AddStudent';
import AddCourse from './AddCourse';
import Dashboard from './AdminDashboard';
import Logout from '../Login/Logout';
import '../Stylesheet/Dashboard.css';

export default function AdminDashLay() {
  const [activeNavItem, setActiveNavItem] = useState("Dashboard");
  const [showAddBatchForm, setShowAddBatchForm] = useState(false);
  const [showAddStudentForm, setShowAddStudentForm] = useState(false);
  const [showAddCourseForm, setShowAddCourseForm] = useState(false);
  const [showDashboardForm, setShowDashboardForm] = useState(true);
  const [showLogoutForm, setShowLogoutForm] = useState(false);

  const toggleDashboard = () => {
    setActiveNavItem("Dashboard");
    setShowDashboardForm(true);
    setShowAddCourseForm(false);
    setShowAddBatchForm(false);
    setShowAddStudentForm(false);
    setShowLogoutForm(false);
  };

  const toggleAddBatchForm = () => {
    setActiveNavItem("Batch");
    setShowAddBatchForm(!showAddBatchForm);
    setShowAddStudentForm(false);
    setShowAddCourseForm(false);
    setShowDashboardForm(false);
    setShowLogoutForm(false);
  };

  const toggleAddStudentForm = () => {
    setActiveNavItem("AddStudent");
    setShowAddCourseForm(false);
    setShowAddBatchForm(false);
    setShowAddStudentForm(!showAddStudentForm);
    setShowDashboardForm(false);
    setShowLogoutForm(false);
  };

  const toggleAddCourseForm = () => {
    setActiveNavItem("AddCourse");
    setShowAddCourseForm(!showAddCourseForm);
    setShowAddBatchForm(false);
    setShowAddStudentForm(false);
    setShowDashboardForm(false);
    setShowLogoutForm(false);
  };

  const toggleLogoutForm = () => {
    setActiveNavItem("Logout");
    setShowAddCourseForm(false);
    setShowAddBatchForm(false);
    setShowAddStudentForm(false);
    setShowDashboardForm(false);
    setShowLogoutForm(!showLogoutForm);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-form">
        <div className="navbar">
          <h1>SRMS</h1>
          <ul>
            <li className={activeNavItem === "Dashboard" ? 'active' : ''} onClick={toggleDashboard}>Dashboard</li>
            <li className={activeNavItem === "Batch" ? 'active' : ''} onClick={toggleAddBatchForm}>Batch</li>
            <li className={activeNavItem === "AddStudent" ? 'active' : ''} onClick={toggleAddStudentForm}>Add Student</li>
            <li className={activeNavItem === "AddCourse" ? 'active' : ''} onClick={toggleAddCourseForm}>Add Course</li>
            <li className={activeNavItem === "Logout" ? 'active' : ''} onClick={toggleLogoutForm}>Logout</li>
          </ul>
        </div>
        <div className='content'>
          {showDashboardForm && <Dashboard />}
          {showAddStudentForm && <AddStudent />}
          {showAddBatchForm && <Batch />}
          {showAddCourseForm && <AddCourse />}
          {showLogoutForm && <div className="overlay"><Logout /></div>}
        </div>
      </div>
    </div>
  );
}
