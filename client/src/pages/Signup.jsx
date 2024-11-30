
import {Link, useNavigate} from "react-router-dom";
import {Button, Label ,TextInput} from 'flowbite-react'
import { useForm } from "react-hook-form";
import useAuthStore from "../zustant/useAuthStore";
import OAuth from "../component/OAuth";
const Signup = () => {
  const navigate = useNavigate();
  const {register,handleSubmit,reset,formState:{errors}} = useForm();
  const {signup} = useAuthStore();
  const submitForm = async (data) => {
    let isCompelted = await signup(data);
    if(isCompelted)
    reset();
    navigate("/signin");
  }


  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col sm:flex-row sm:items-center gap-5">
        {/* left */}
        <div className="flex-1">
            <Link to="/" className="text-4xl font-bold">
             {/* logo */}
             Blog App
            </Link>
            <p className="text-sm mt-5">
              This is a demo project, You can sign up with your email and password or with Google.
            </p>
        </div>

        {/* right */}
        <div className="flex-1">
          <form onSubmit={handleSubmit(submitForm)} className="flex flex-col gap-4">
          <div>
            <Label>Username:</Label>
            <TextInput type="text" placeholder="username" id="username"
            {...register("username",{required:"Username is required"})}
            />
            {
              errors.username && (
                <p className="text-red-500 text-sm">{errors.username.message}</p>
              )
            }
          </div>
          <div>
            <Label>Email:</Label>
            <TextInput type="email" placeholder="email" id="email"
              {...register("email",{required:"Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Enter a valid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div>
            <Label>Password:</Label>
            <TextInput type="text" placeholder="password" id="password"
            {
              ...register("password",{required:"Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters long",
                },
              })
            }
            />
            {
              errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )
            }
          </div>
          <Button color="purple" outline type="submit" >Sign Up</Button>
          {/* <OAuth />  this component is disabled because the google authentication is not working properly*/}
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Already have an account? {" "}
              <Link to="/signin" className="text-purple-500">Sign In</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup