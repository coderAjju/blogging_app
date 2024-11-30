import { Button } from "flowbite-react"


const CallToAction = () => {


  return (
        <div className="  mt-5 flex flex-col gap-5 sm:flex-row p-3 py-5 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center">
    <div className="flex justify-center flex-1 flex-col">
            <h2 className="text-2xl">Want to learn Next js by building fun and engaging projects?</h2>
            <p className="text-gray-500 my-2">Check our nexjs projects website and start building you own projects </p>
            <Button className=" rounded-tl-xl rounded-bl-none" gradientDuoTone="purpleToBlue">Nextjs project website</Button>
        </div>
        <div className="md:p-7 sm:w-1/2">
            <img className="w-full h-full object-cover" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQntgDWhCNA0GmplBCGSyDq01DeaOirjcF1mQ&s" alt=""  />
        </div>
    </div>
  )
}

export default CallToAction