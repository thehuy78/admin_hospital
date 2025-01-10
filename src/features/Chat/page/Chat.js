import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { apiRequest } from '../../../shared/hook/ApiChat/ApiChatService';
import { listenForNotifications } from './firebaseConfig';
import { useAdminContext } from '../../../shared/hook/ContextToken';
import "../style/Chat.scss"
import { jwtDecode } from 'jwt-decode';


const WebSocketComponent = () => {
  const [messages, setMessages] = useState([]);
  const [client, setClient] = useState(null);
  const [user, setUser] = useState("")
  const { token } = useAdminContext()

  useEffect(() => {
    if (token) {
      var jwt = jwtDecode(token)
      setUser(jwt.sub)
    }
  }, [token]);
  const messagesEndRef = useRef(null);
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  useEffect(() => {
    if (token) {
      var tokenjwt = jwtDecode(token)
      console.log(tokenjwt);
      const sock = new SockJS('http://103.12.77.74:8082/ws'); // WebSocket URL
      const stompClient = new Client({
        webSocketFactory: () => sock,
        debug: (str) => { console.log(str); },
        onConnect: () => {
          stompClient.subscribe(`/topic/messages/${tokenjwt.sub}`, (message) => {
            fetchMessage()
            // const parsedMessage = JSON.parse(message.body); // Parse message JSON
            // setMessages((prevMessages) => [...prevMessages, parsedMessage]);
          });
        },
        onDisconnect: () => {
          console.log('Disconnected');
        },
      });

      stompClient.activate();
      setClient(stompClient);

      return () => {
        stompClient.deactivate();
      };
    }
  }, [token]);

  const sendMessage = (e) => {
    e.preventDefault()
    try {
      if (token) {
        var tokenjwt = jwtDecode(token)

        var mes = document.getElementById("message").value.trim()
        const message = {
          senderEmail: tokenjwt.sub,
          receiverEmail: "admin@gmail.com",
          content: mes,
          stompClients: tokenjwt.sub
        };
        if (client) {
          client.publish({
            destination: '/app/sendMessage',
            body: JSON.stringify(message), // Convert object to JSON
          });

        }
        e.target.reset()
      }
    } catch (error) {
      console.log(error);
    }

  };




  const fetchMessage = useCallback(async () => {
    try {
      if (token) {
        var tokenjwt = jwtDecode(token)
        var rs = await apiRequest("GET", `getMessage/${tokenjwt.sub}`)
        console.log(rs);
        setMessages(rs?.data?.data ? rs.data.data : [])
      }
    } catch (error) {

    }
  }, [token])

  useEffect(() => {
    fetchMessage()
  }, [fetchMessage]);


  // Hàm để cập nhật thời gian tin nhắn
  const updateMessageTimes = () => {
    setMessages(prevMessages => {
      return prevMessages.map(msg => ({
        ...msg,
        formattedTimestamp: formatDate(msg.timestamp), // Cập nhật lại thời gian
      }));
    });
  };

  // Cập nhật thời gian mỗi giây
  useEffect(() => {
    const intervalId = setInterval(updateMessageTimes, 10000);
    return () => clearInterval(intervalId); // Dọn dẹp khi component unmount
  }, []);

  return (
    <div className='chatPage'>
      <h1 className='title'>CHAT WITH ADMIN MEDCARE  </h1>
      <div className='form_message'>
        <div className='content'>
          {messages.slice().reverse().map((msg, index) => (
            <div className={msg.senderEmail === user ? "box_item_me" : "box_item_you"}>
              <div className={msg.senderEmail === user ? "me" : "you"}>
                <p className='send'> {msg.senderEmail === user ? "Tôi" : "From: " + msg.senderEmail}</p>
                <p className='contentMessage'>{msg.content}</p>
                <p className='time'>{msg.formattedTimestamp || formatDate(msg.timestamp)}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />

        </div>

        <form className='box_send_message' onSubmit={sendMessage}>
          <input className='input_mess' id='message' />
          <button type='submit'>Send Message</button>
        </form>
      </div>

    </div>
  );
};

export default WebSocketComponent;

const formatDate = (datetimeStr) => {
  const date = new Date(datetimeStr);
  const now = new Date();

  // Tính toán sự chênh lệch giữa ngày hiện tại và ngày truyền vào
  const diffInSeconds = Math.floor((now - date) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  // Nếu ngày truyền vào là ngày hiện tại
  if (diffInDays === 0) {
    if (diffInHours > 0) {
      return `${diffInHours} giờ trước`;
    }
    if (diffInMinutes > 0) {
      return `${diffInMinutes} phút trước`;
    }
    return `${diffInSeconds} giây trước`;
  }

  // Nếu ngày truyền vào trong tuần (vượt quá ngày hôm nay nhưng không quá 7 ngày)
  if (diffInDays <= 7) {
    return `${diffInDays} ngày trước`;
  }

  // Nếu ngày đã vượt quá 7 ngày, hiển thị theo định dạng ngày/tháng/năm
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  // Trả về theo định dạng ngày/tháng/năm giờ:phút
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

