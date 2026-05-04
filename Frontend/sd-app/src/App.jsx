import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import Login from "./components/login/login.jsx";
import Signup from "./components/signup/signup.jsx";
import ForgotPassword from "./components/forgotpassword/forgotpassword.jsx";
import ResetPassword from "./components/resetpassword/resetpassword.jsx";
import MainScreen from "./components/mainscreen/mainscreen.jsx";
import History from "./components/history/History.jsx";
import TeamPage from "./components/team/TeamPage.jsx";
import "./App.css";

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path="/"               element={<Login />}          />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password"  element={<ResetPassword />}  />
            <Route path="/signup"          element={<Signup />}         />
            <Route path="/main"            element={<MainScreen />}     />
            <Route path="/history"         element={<History />}        />
            <Route path="/team"            element={<TeamPage />}       />
          </Routes>
        </div>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
