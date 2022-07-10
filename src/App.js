import Login from './component/Login'
import { Container } from "react-bootstrap"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import MessageBoard from './component/MessageBoard';

const App = () => {
  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="w-100" style={{ maxWidth: "400px" }}>
        {/* <Login /> */}
        <Router>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route exact path="/messageBoard" element={<MessageBoard />} />
            </Routes>
        </Router>
      </div>
    </Container>
  );
}

export default App;
