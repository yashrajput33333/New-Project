import React from 'react'
import {useDispatch} from 'react-redux'
import {logout} from '../../store/authSlice'
import { Navigate, useNavigate } from 'react-router-dom'




 function LogoutBtn() {
   const navigate = useNavigate()
   const dispatch = useDispatch()
   const logoutHandler = async () => {

      // fetch('/api/v1/users/logout', {
      //     method: 'POST',
      //     credentials: 'include' 
      // })
      // .then(response => response.json())
      // .then(data => {
      //     console.log(data.message);
      //     navigate("/login")
      //     dispatch(logout())
      // })
      // .catch(error => console.error('Error:', error));
      
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/users/logout`, {
              method: 'POST',
              credentials: 'include' 
          })
        navigate("/login")
        dispatch(logout())
      } catch (error) {
        console.log("Error: " + error)
      }

    }
  return (
    <button
    className='inline-bock px-6 py-2 duration-200 hover:bg-blue-100 rounded-full'
    onClick={logoutHandler}
    >Logout</button>
  )
}

export default LogoutBtn