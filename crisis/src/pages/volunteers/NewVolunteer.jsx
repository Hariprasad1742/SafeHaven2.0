import { Dialog, Transition } from "@headlessui/react";
import axios from "axios";
import React, { Fragment, useReducer, useState, useEffect } from "react";

const initialState = {
  name: "",
  email: "",
  phone: "",
  profession: "",
  age: "",
  address: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "RESET":
      return initialState;
    default:
      return state;
  }
};

const NewVolunteer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const [state, dispatch] = useReducer(reducer, initialState);
  const [volunteers, setVolunteers] = useState([]);

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const fetchVolunteers = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/volunteers");
      setVolunteers(response.data);
    } catch (err) {
      console.error("Error fetching volunteers:", err);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setError("");
    dispatch({ type: "RESET" });
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch({ type: "SET_FIELD", field: name, value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!state.name || !state.email || !state.phone) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      console.log("Sending volunteer data:", state);
      const response = await axios.post("http://localhost:3001/api/volunteers", state, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log("Volunteer added:", response.data);
      closeModal();
      fetchVolunteers(); // Refresh the list of volunteers
    } catch (err) {
      console.error("Error adding volunteer:", err);
      if (err.response) {
        console.error("Response data:", err.response.data);
        console.error("Response status:", err.response.status);
        console.error("Response headers:", err.response.headers);
        setError(`Failed to add volunteer. Server responded with: ${err.response.data.error || err.response.statusText}`);
      } else if (err.request) {
        console.error("No response received:", err.request);
        setError("Failed to add volunteer. No response received from the server. Please try again.");
      } else {
        console.error("Error details:", err.message);
        setError(`Failed to add volunteer. ${err.message}`);
      }
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="rounded-md bg-blue-500 ml-20 mt-4 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
      >
        Register as Volunteer
      </button>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Volunteer Registration
                  </Dialog.Title>
                  <div className="mt-2">
                    <form onSubmit={handleSubmit}>
                      {error && (
                        <p className="text-red-500 text-sm mb-4">{error}</p>
                      )}
                      <input
                        type="text"
                        name="name"
                        placeholder="Enter your Name..."
                        value={state.name}
                        onChange={handleChange}
                        required
                        className="w-full border rounded-md py-2 px-3 my-4 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 focus:shadow-outline-blue"
                      />
                      <input
                        type="email"
                        name="email"
                        value={state.email}
                        onChange={handleChange}
                        placeholder="JohnDoe@example.com"
                        required
                        className="w-full border rounded-md py-2 px-3 my-4 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 focus:shadow-outline-blue"
                      />
                      <input
                        type="tel"
                        name="phone"
                        value={state.phone}
                        onChange={handleChange}
                        placeholder="+91XXXXXXXXXX"
                        required
                        className="w-full border rounded-md py-2 px-3 my-4 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 focus:shadow-outline-blue"
                      />
                      <input
                        type="number"
                        name="age"
                        min="18"
                        value={state.age}
                        onChange={handleChange}
                        placeholder="Enter age..."
                        className="w-full border rounded-md py-2 px-3 my-4 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 focus:shadow-outline-blue"
                      />
                      <input
                        name="address"
                        value={state.address}
                        onChange={handleChange}
                        placeholder="Enter Your City..."
                        className="w-full border rounded-md py-2 px-3 my-4 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 focus:shadow-outline-blue"
                      />
                      <input
                        type="text"
                        name="profession"
                        value={state.profession}
                        onChange={handleChange}
                        placeholder="Enter Profession..."
                        className="w-full border rounded-md py-2 px-3 my-4 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 focus:shadow-outline-blue"
                      />
                      <button
                        type="submit"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 mr-2 text-sm font-medium text-white hover:bg-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      >
                        Submit
                      </button>
                      <button
                        type="button"
                        onClick={closeModal}
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      >
                        Cancel
                      </button>
                    </form>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Display Volunteers */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Registered Volunteers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {volunteers.map((volunteer) => (
            <div key={volunteer._id} className="bg-white shadow-md rounded-lg p-4">
              <h3 className="text-lg font-semibold">{volunteer.name}</h3>
              <p>Email: {volunteer.email}</p>
              <p>Phone: {volunteer.phone}</p>
              <p>Profession: {volunteer.profession}</p>
              <p>Age: {volunteer.age}</p>
              <p>Address: {volunteer.address}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default NewVolunteer;
