import React, { useEffect, useState } from "react"
import { Card, Button, Alert } from "react-bootstrap"
import { useCookies } from "react-cookie"
import { useLocation, useNavigate } from "react-router-dom"
import SockJS from "sockjs-client"
import { over } from "stompjs"
import { format } from 'date-fns'

const MessageBoard = (props) => {
  let stompClient
  let noteID = "629c24609e3e584beaed7cdf"
  let bell = ["genewang7@gmail.com"]
  let receiver = "allen3325940072@gmail.com"
  const [token, removeToken] = useCookies(["token"])
  const navigate = useNavigate() 
  const location = useLocation()

  useEffect(() => {
    connect()
  }, [])

  const connect = () => {
    // postID = (location.state === 'genewang7@gmail.com') ? 12345 : 67890

    let sock = new SockJS('http://localhost:8080/our-websocket')
    stompClient = over(sock)
    stompClient.connect({}, onConnected, (err) => {
      console.log(err)})
  }

  const onConnected = (frame) => {
    stompClient.subscribe(`/topic/group-messages/${noteID}`, (message) => {
      // showMessage(message) 
    })
    for (let i in bell) {   //訂閱"他人"地址，接收"他人"發送的訊息
      stompClient.subscribe(`/topic/bell-messages/${bell[i]}`, (message) => {   //拿user 後端轉bell
        // showMessage(message) 
      })
    }
    stompClient.subscribe('/user/topic/private-messages', (message) => {
      // showMessage(message) 
    })
  }

  const sendGroupMessage = (msg) => {
    let messageObj = {
      'message': msg,
      'type': 'post',
      'userObj': {
        'userObjEmail': location.state,
        'userObjName': 'gene'
      },
      'id': noteID,
      // 'receiverEmail': receiver
    }

    stompClient.send(`/ws/group-messages/${noteID}`, {}, JSON.stringify(messageObj))
  }

  const sendGroupMessageForManager = (msg) => {
    let messageObj = {
      'message': msg,
      'type': 'post',
      'userObj': {
        'userObjEmail': location.state,
        'userObjName': 'gene'
      },
      'id': noteID,
      // 'receiverEmail': receiver
    }

    stompClient.send(`/ws/group-messages-manager/${noteID}`, {}, JSON.stringify(messageObj))
  }

  const sendBellMessage = (msg) => {  //地址指向"自己"，由"自己"發送訊息
    let messageObj = {
      'message': msg,
      'type': 'post',
      'userObj': {
        'userObjEmail': location.state,
        'userObjName': 'gene'
      },
      // 'id': noteID,
      'receiverEmail': receiver
    }

    stompClient.send(`/ws/bell-messages/${location.state}`, {}, JSON.stringify(messageObj))
  }

  const sendPrivateMessage = (msg) => {
    let messageObj = {
      'message': msg,
      'type': 'post',
      'userObj': {
        'userObjEmail': location.state,
        'userObjName': 'gene'
      },
      // 'id': noteID,
      'receiverEmail': receiver
    }

    stompClient.send("/ws/private-messages", {}, JSON.stringify(messageObj))
  }

  const logout = () => {
    removeToken('token')
    navigate('/')
  }

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Profile</h2>
          <strong>Email:</strong> {location.state}
          <Button className="btn btn-primary w-100 mt-3" onClick={() => {sendGroupMessage('group message')}}>
            Send Group Message
          </Button>
          <Button className="btn btn-primary w-100 mt-3" onClick={() => {sendGroupMessageForManager('group message for manager')}}>
            Send Group Message For Manager
          </Button>
          <Button className="btn btn-primary w-100 mt-3" onClick={() => {sendBellMessage('bell message')}}>
            Send Bell Message
          </Button>
          <Button className="btn btn-primary w-100 mt-3" onClick={() => {sendPrivateMessage('private message')}}>
            Send Private Message
          </Button>
        </Card.Body>
      </Card>
      <Button className="btn btn-secondary w-100 mt-3" onClick={logout}>
        Logout
      </Button>
    </>
  )
}

export default MessageBoard