// Importing required modules
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../contexts/authContext";

// Creating a hook to perform LogIn operation
const useLogIn = () => {
	// Some states to handle LogIn
	const [ loading, setLoading ] = useState(false);

	// Some context variables to handle LogIn
	const { setAuthUser } = useAuthContext();

	// a function to handle LogIn
	const logIn = async (email: string, password: string) => {
		// Validating the inputs
		const success = handleInputValidation(email, password);
		if(!success){
			return;
		}
		// perform LogIn
		setLoading(true);
		try {
			// Send a response to server
			const res = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/users/login`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({email, password}),
				credentials: 'include'
		   }); 

			// get the response back from server
			const data = await res.json();
			if(data.error){
				toast.error(data.error);
				return;
			}
			
			// If LogIn goes successfull then update the localStorage with userData
			localStorage.setItem("authUserInfo", JSON.stringify(data));
			// Now update the context with that
			setAuthUser(data);

            // If response is ok then give a Toast
			if(res.ok){
				toast.success("LogIn successfull.");
			}
		} catch (error: any) {
			toast.error(error.message);
		} finally{
			setLoading(false);
		}
	};

	// return back some parameters -> loading state & LogIn()
	return { loading, logIn };
};

// Exporting the hook
export default useLogIn;



// A function to handle validations over inputs
const handleInputValidation = (email: string,password: string) => {
	// check for null values
	if(!email || !password){
		toast.error("All fields are required.");
		return false;
	};

	// If everything goes well then just return true
	return true;
};