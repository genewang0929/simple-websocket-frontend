import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import axios, { Axios } from "axios";
import MessageBoard from "./MessageBoard";
import CookieParser from "./CookieParser";
import { useNavigate } from "react-router-dom"

const Login = () => {
  const emailRef = useRef()
  const passwordRef = useRef()
  const [loading, setLoading] = useState(false)
  const [loginStatus, setLoginStatus] = useState(false)
  const navigate = useNavigate() 
  

  const login = (e) => {
    e.preventDefault()

    setLoading(true)
    axios.post("http://localhost:8080/verification/login", {
      "email" : emailRef.current.value,         //allen3325940072@gmail.com, genewang7@gmail.com
      "password" : passwordRef.current.value    //1234
    }).then((response) => {
      if (!response.data)
        setLoginStatus(false)
      else {
        document.cookie = "token=" + response.data.token
        let cookieParser_token = new CookieParser(document.cookie)
        setLoginStatus(true)
        navigate('/messageBoard', {state: emailRef.current.value})
      }
    }).catch((err) => {
      console.log(err)
    })
    setLoading(false)
  }

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Log In</h2>
          <Form onSubmit={login}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" ref={passwordRef} required />
            </Form.Group>
            <Button disabled={loading} className="w-100" type="submit">
              Log In
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </>
  )
}

export default Login