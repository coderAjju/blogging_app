import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen ">
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-center mb-6 text-blue-600">About Us</h1>
        <p className="text-lg text-center mb-8">
          Welcome to <span className="font-semibold">Our Blog</span> – your go-to platform for insightful articles, 
          tutorials, and the latest trends in technology, lifestyle, and beyond. Our mission is to inspire, educate, 
          and engage readers from all walks of life.
        </p>
        <div className="flex flex-wrap justify-center gap-8">
          {/* Section 1 */}
          <div className=" shadow-lg rounded-lg p-6 max-w-sm text-center">
            <h2 className="text-2xl font-semibold mb-4 text-blue-500">Our Vision</h2>
            <p>
              We aim to create a community where knowledge sharing and thoughtful discussions thrive, 
              empowering readers to grow and explore new ideas.
            </p>
          </div>
          {/* Section 2 */}
          <div className=" shadow-lg rounded-lg p-6 max-w-sm text-center">
            <h2 className="text-2xl font-semibold mb-4 text-blue-500">Our Team</h2>
            <p>
              We are a group of passionate writers, tech enthusiasts, and creatives dedicated to delivering 
              quality content that informs and inspires.
            </p>
          </div>
          {/* Section 3 */}
          <div className=" shadow-lg rounded-lg p-6 max-w-sm text-center">
            <h2 className="text-2xl font-semibold mb-4 text-blue-500">Join Us</h2>
            <p>
              Got a story to share or expertise to showcase? Join our growing community of contributors and make 
              your voice heard.
            </p>
          </div>
        </div>
        <div className="mt-12 text-center">
          <h2 className="text-3xl font-bold text-blue-600">Get in Touch</h2>
          <p className="text-lg mt-4">
            Have questions, feedback, or just want to say hello? Reach out to us at{' '}
            <a href="mailto:info@ourblog.com" className="text-blue-500 underline">
              info@ourblog.com
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
