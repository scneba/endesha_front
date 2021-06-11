import "./App.scss";
import "./fontAwesomeSetup.js";
import { Container, Row, Col } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { UserContext } from "./components/login/userContext";
import SideNav from "./components/nav/sidenav";
import TopNav from "./components/nav/topbar";
import Permissions from "./components/admin/permissions";
import RolesList from "./components/admin/roles";
import RolePermissionsList from "./components/admin/role_permission_list";
import UserRoleList from "./components/admin/user_role_list";
import UserList from "./components/admin/users";
import Categories from "./components/admin/categories";
import Questions from "./components/admin/questions";
import LoginPage from "./components/login/loginPage";
import { getCurrentUser } from "./services/auth";
require("dotenv").config();

function App() {
  const [userLoaded, setUserLoaded] = useState(false);
  const [user, setUser] = useState(null);
  useEffect(() => {
    if (!userLoaded) {
      async function getLoggedInUser() {
        try {
          let userData = await getCurrentUser();
          setUser(userData.data.data);
        } catch (err) {
          console.log(err);
        }
        setUserLoaded(true);
      }

      getLoggedInUser();
    }
  });

  return (
    <UserContext.Provider value={user}>
      <Router>
        <TopNav setUser={setUser} />
        <ToastContainer />
        <Container as={Row} fluid>
          <SideNav />
          <Col>
            <Switch>
              <Route exact path="/admin/permissions">
                <Permissions></Permissions>
              </Route>
              <Route exact path="/admin/roles">
                <RolesList />
              </Route>
              <Route path="/admin/roles/:id">
                <RolePermissionsList />
              </Route>
              <Route path="/admin/users/:id">
                <UserRoleList />
              </Route>
              <Route exact path="/admin/users">
                <UserList />
              </Route>
              <Route exact path="/admin/categories">
                <Categories />
              </Route>
              <Route exact path="/admin/questions">
                <Questions />
              </Route>
              <Route exact path="/login">
                <LoginPage setUser={setUser} />
              </Route>
            </Switch>
          </Col>
        </Container>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
