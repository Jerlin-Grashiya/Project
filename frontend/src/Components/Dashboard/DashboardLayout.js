import React, { useState } from 'react';
import Dashboard from './Dashboard';
import MyCourse from './MyCourse';
import Logout from '../Login/Logout';
import '../Stylesheet/Dashboard.css';
import Assessment from './Assessment';
import FinalExam from './FinalMarking';
import Composite from './Composite';

export default function DashboardLayout() {
  const [activeNavItem, setActiveNavItem] = useState("Dashboard");
  const [showDashboardForm, setShowDashboardForm] = useState(true);
  const [showMyCourseForm, setShowMyCourseForm] = useState(false);
  const [showAssessmentForm, setShowAssessmentForm] = useState(false);
  const [showFinalForm, setShowFinalForm] = useState(false);
  const [showCompositeForm, setShowCompositeForm] = useState(false);
  const [showLogoutForm, setShowLogoutForm] = useState(false);

  const toggleDashboard = () => {
    setActiveNavItem("Dashboard");
    setShowDashboardForm(true);
    setShowMyCourseForm(false);
    setShowAssessmentForm(false);
    setShowFinalForm(false);
    setShowCompositeForm(false);
    setShowLogoutForm(false);
  };

  const toggleMyCoursesForm = () => {
    setActiveNavItem("MyCourse");
    setShowDashboardForm(false);
    setShowMyCourseForm(!showMyCourseForm);
    setShowAssessmentForm(false);
    setShowFinalForm(false);
    setShowCompositeForm(false);
    setShowLogoutForm(false);
  };

  const toggleAssessmentForm = () => {
    setActiveNavItem("Assessment");
    setShowDashboardForm(false);
    setShowMyCourseForm(false);
    setShowAssessmentForm(!showAssessmentForm);
    setShowFinalForm(false);
    setShowCompositeForm(false);
    setShowLogoutForm(false);
  };

  const toggleFinalMarksForm = () => {
    setActiveNavItem("Final");
    setShowDashboardForm(false);
    setShowMyCourseForm(false);
    setShowAssessmentForm(false);
    setShowFinalForm(!showFinalForm);
    setShowCompositeForm(false);
    setShowLogoutForm(false);
  };

  const toggleCompositeForm = () => {
    setActiveNavItem("Composite");
    setShowDashboardForm(false);
    setShowMyCourseForm(false);
    setShowAssessmentForm(false);
    setShowFinalForm(false);
    setShowCompositeForm(!showCompositeForm);
    setShowLogoutForm(false);
  };

  const toggleLogoutForm = () => {
    setActiveNavItem("Logout");
    setShowDashboardForm(false);
    setShowMyCourseForm(false);
    setShowAssessmentForm(false);
    setShowFinalForm(false);
    setShowCompositeForm(false);
    setShowLogoutForm(!showLogoutForm);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-form">
        <div className="navbar">
          <h1>SRMS</h1>
          <ul>
            <li className={activeNavItem === "Dashboard" ? 'active' : ''} onClick={toggleDashboard}>Dashboard</li>
            <li className={activeNavItem === "MyCourse" ? 'active' : ''} onClick={toggleMyCoursesForm}>Add my courses</li>
            <li className={activeNavItem === "Assessment" ? 'active' : ''} onClick={toggleAssessmentForm}>Assessment</li>
            <li className={activeNavItem === "Final" ? 'active' : ''} onClick={toggleFinalMarksForm}>Final</li>
            <li className={activeNavItem === "Composite" ? 'active' : ''} onClick={toggleCompositeForm}>Composite Sheet</li>
            <li className={activeNavItem === "Logout" ? 'active' : ''} onClick={toggleLogoutForm}>Logout</li>
          </ul>
        </div>
        <div className='content'>
          {showDashboardForm && <Dashboard />}
          {showMyCourseForm && <MyCourse />}
          {showAssessmentForm && <Assessment />}
          {showFinalForm && <FinalExam />}
          {showCompositeForm && <Composite />}
          {showLogoutForm && <div className="overlay"><Logout /></div>}
        </div>
      </div>
    </div>
  );
}
