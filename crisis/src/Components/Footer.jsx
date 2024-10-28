import React, { useState } from "react";
import ContactForm from "./ContactForm";

const Footer = () => {
  const [showContactForm, setShowContactForm] = useState(false);

  return (
    <div className="relative">
      {showContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative w-full max-w-2xl mx-4">
            <button
              onClick={() => setShowContactForm(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 z-50"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <ContactForm />
          </div>
        </div>
      )}
      
      <footer className="bg-gray-800 text-white p-8">
        <div className="container w-full flex justify-between">
          <div className="ml-10 w-1/3">
            <ul>
              <li className="text-sm py-1">
                <a href="#">National Disaster Management Authority (NDMA)</a>
              </li>
              <li className="text-sm py-1">
                <a href="#">National Disaster Response Force (NDRF)</a>
              </li>
              <li className="text-sm py-1">
                <a href="#">National Institute for Disaster Management (NIDM)</a>
              </li>
              <li className="text-sm py-1">
                <a href="#">Disaster Management Division, MHA</a>
              </li>
              <li className="text-sm py-1">
                <a href="#">National Platform for Disaster Risk Reduction (NPDRR)</a>
              </li>
            </ul>
          </div>
          <div className="container ml-20 mt-4 w-1/3 text-sm">
            <p className="text-gray-300">
              Developed By
              <br />
              Hari Prasad M
              <br />
              Coimbatore Institute of Technology,
              <br />
              TamilNadu
              <br />
              cbe-004
              <br />
              Reserved for Government of India.
            </p>
          </div>
          <div className="container ml-20 mt-4 w-1/3 text-sm">
            <p className="text-gray-300 mt-2">
              Reach us at
              <br />
              <button
                onClick={() => setShowContactForm(true)}
                className="text-white underline hover:text-blue-300 transition duration-300"
              >
                Contact Support
              </button>
            </p>
            <p className="text-gray-400 mt-2">
              Privacy Policy
              <br />
              Terms & Conditions
              <br />
              National Disaster Management Authority (NDMA)
              <br />
              2024 Government of India
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
