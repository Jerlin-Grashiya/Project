import Login from "./Components/Login/Login";
import SignUp from "./Components/Login/SignUp";
import ForgotPassword from "./Components/Login/ForgotPassword";
import ResetPassword from "./Components/Login/ResetPassword";
import {BrowserRouter ,Routes ,Route} from 'react-router-dom';
import AdminDashLay from "./Components/Admin/AdminDashLay";
import DashboardLayout from "./Components/Dashboard/DashboardLayout";
import AddStudent from "./Components/Admin/AddStudent";
import AddCourse from "./Components/Admin/AddCourse";
import MyCourse from "./Components/Dashboard/MyCourse";
import Home from "./Components/Login/Home";


function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
          <Route path='/' element={<Home/>}></Route>
          <Route path='/signup' element={<SignUp/>}></Route>
          <Route path='/login' element={<Login/>}></Route>
          <Route path='/admindashlay' element={<AdminDashLay/>}></Route>
          <Route path='/dashboardlayout' element={<DashboardLayout/>}></Route>
          <Route path='/forgotPassword' element={<ForgotPassword/>}></Route>
          <Route path='/resetPassword/:token' element={<ResetPassword/>}></Route>
          <Route path='/addStudent' element={<AddStudent/>}></Route>
          <Route path='/addCourse' element={<AddCourse/>}></Route>
          <Route path="/myCourse" element={<MyCourse/>}></Route>
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
