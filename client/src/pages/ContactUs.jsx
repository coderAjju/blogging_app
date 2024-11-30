import { Textarea, TextInput } from 'flowbite-react';
import React from 'react';
import { useForm } from 'react-hook-form';

const ContactUs = () => {
  const {register,reset,handleSubmit,formState:{errors}} = useForm();
  const submitform = (data) => {
    reset();
  }
  return (
    <div className="min-h-screen  flex items-center justify-center p-6">
      <div className="shadow-md rounded-lg max-w-3xl w-full p-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">Contact Us</h1>
        <p className=" text-center mb-8">
          Have questions or feedback? We'd love to hear from you!
        </p>
        <form onSubmit={handleSubmit(submitform)}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium ">
              Name
            </label>
            <TextInput
              type="text"
              id="name"
              name="name"
              required
              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your name"
              {
                ...register("name",{required:true,message:"Name is required"})
              }
            />
           
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium ">
              Email
            </label>
            <TextInput
              type="email"
              id="email"
              name="email"
              required
              className="mt-1 block w-full  border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
              {
                ...register("email",{required:true,pattern:/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,message:"Enter a valid email"})
              }
            />
        
          </div>
          <div className="mb-4">
            <label htmlFor="subject" className="block text-sm font-medium ">
              Subject
            </label>
            <TextInput
              type="text"
              id="subject"
              name="subject"
              required
              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter the subject"
              {...register("subject",{required:true,message:"Subject is required"})}
            />
           
          </div>
          <div className="mb-4">
            <label htmlFor="message" className="block text-sm font-medium ">
              Message
            </label>
            <Textarea
              id="message"
              name="message"
              rows="4"
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Write your message here..."
            
            ></Textarea>
            {
              errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
            }
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
