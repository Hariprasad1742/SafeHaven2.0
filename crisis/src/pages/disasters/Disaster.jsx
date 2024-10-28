import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Footer from "../../Components/Footer.jsx";
import Header from "../../Components/Header.jsx";
import voluntee from "../../assets/images/Volunte.png";
import box from "../../assets/images/box.png";

////////////////////////////////////////////////////////Image Modal/////////////////////
const ImageModal = ({ isOpen, onClose, id, getDisasterById }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState(null);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5000000) { // 5MB limit
      setError("File size is too large. Please select an image under 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result);
      setError(null);
    };
    reader.onerror = () => {
      setError("Error reading file. Please try again.");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImage) {
      setError("Please select an image first");
      return;
    }

    try {
      const res = await axios.post(`http://localhost:3001/addImage/${id}`, {
        img: selectedImage
      });
      console.log("Upload response:", res.data);
      await getDisasterById(id);
      onClose();
    } catch (err) {
      console.error("Error uploading image:", err);
      setError(err.response?.data?.message || "Error uploading image. Please try again.");
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="mb-4">
                    <label htmlFor="file-upload" className="block text-gray-700 text-sm font-bold mb-2">
                      Upload Image:
                    </label>
                    <input
                      type="file"
                      id="file-upload"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                    {selectedImage && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-600 mb-2">Preview:</p>
                        <img 
                          src={selectedImage} 
                          alt="Preview" 
                          className="max-h-48 max-w-full object-contain"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={!selectedImage}
                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${
                      !selectedImage 
                        ? 'bg-gray-300 cursor-not-allowed' 
                        : 'bg-blue-500 hover:bg-blue-700'
                    } text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm`}
                  >
                    Add Image
                  </button>
                  <button
                    onClick={onClose}
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

///////////////////////////////////////Comment Modal////////////////////////
const CommentModal = ({ isOpen, onClose, id, fetchComments }) => {
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");

  const createComment = async (disasterId, name, comment) => {
    try {
      const response = await axios.post("http://localhost:3001/comments", {
        disasterId,
        name,
        comment,
      });
      console.log(response.data);
      fetchComments(id);
    } catch (error) {
      console.error("Error creating comment:", error);
      return null;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createComment(id, name, comment);
    setName("");
    setComment("");
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add Comment</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
                  Name:
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="comment" className="block text-gray-700 font-bold mb-2">
                  Comment:
                </label>
                <textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:bg-blue-600"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="ml-2 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

//============================================UpdateModal ================================
const UpdateModal = ({ isOpen, onClose, disaster, getDisasterById }) => {
  const [casualties, setCasualties] = useState(disaster.casualties);
  const [affectedPopulation, setAffectedPopulation] = useState(disaster.affectedPopulation);
  const [severity, setSeverity] = useState(disaster.severity);

  const updateDisasterFields = async (id, fieldsToUpdate) => {
    try {
      const response = await axios.put(
        `http://localhost:3001/updateFields/${id}`,
        fieldsToUpdate
      );
      return response.data;
    } catch (error) {
      console.error("Error updating disaster fields:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fieldsToUpdate = {
      casualties,
      affectedPopulation,
      severity,
    };

    try {
      await updateDisasterFields(disaster._id, fieldsToUpdate);
      await getDisasterById(disaster._id);
      onClose();
    } catch (error) {
      console.error("Error updating disaster fields:", error);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="mb-4">
                    <label htmlFor="casualties" className="block text-gray-700 text-sm font-bold mb-2">
                      Update Casualties:
                    </label>
                    <input
                      type="number"
                      id="casualties"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder={disaster.casualties}
                      min={disaster.casualties}
                      value={casualties}
                      onChange={(e) => setCasualties(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="affectedPopulation" className="block text-gray-700 text-sm font-bold mb-2">
                      Update Affected Population:
                    </label>
                    <input
                      type="number"
                      id="affectedPopulation"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder={disaster.affectedPopulation}
                      min={disaster.affectedPopulation}
                      value={affectedPopulation}
                      onChange={(e) => setAffectedPopulation(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="severity" className="block text-gray-700 text-sm font-bold mb-2">
                      Update Severity:
                    </label>
                    <input
                      type="text"
                      id="severity"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder={disaster.severity}
                      value={severity}
                      onChange={(e) => setSeverity(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Update
                  </button>
                  <button
                    onClick={onClose}
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

///////////////////////////////////////////Disaster Page///////////////
const DisasterDetails = () => {
  const [disaster, setDisaster] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);

  const openUpdateModal = () => {
    setUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setUpdateModalOpen(false);
  };

  const copenModal = () => {
    setIsModalOpen(true);
  };

  const ccloseModal = () => {
    setIsModalOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const getDisasterById = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3001/getDisaster/${id}`);
      setDisaster(response.data);
      setLoading(false);
      return response.data;
    } catch (error) {
      console.error('Error fetching disaster:', error);
      setError(error.message);
      setLoading(false);
      return null;
    }
  };

  const fetchComments = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3001/comments/${id}`);
      setComments(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching comments:", error);
      return null;
    }
  };

  useEffect(() => {
    getDisasterById(id);
    fetchComments(id);
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="max-w-full mx-auto bg-white dark:bg-zinc-800 shadow-lg rounded-lg overflow-hidden">
      <Header />
      <div className="px-4 py-2 ">
        <h2 className="text-3xl font-bold text-center bg-sky-500 mt-2 h-20 py-5 rounded">
          {disaster.crisisType} in {disaster.location}
        </h2>
        <div className="flex items-center justify-center mt-4">
          <div className="w-64 h-64 overflow-hidden rounded-lg shadow-lg">
            {disaster.uploadedPhotos && disaster.uploadedPhotos.length > 0 ? (
              <img
                src={disaster.uploadedPhotos[0]}
                alt={`${disaster.crisisType} image`}
                className="w-full h-full object-cover rounded-lg shadow-lg mr-2"
              />
            ) : (
              <img
                src="default_image_url_here"
                alt="Default image"
                className="w-full h-full object-cover rounded-lg shadow-lg mr-2"
              />
            )}
          </div>
        </div>
        <div className="mt-4 mx-10">
          <p className="text-center">{disaster.description}.</p>
        </div>
        <div className="mt-4 mx-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-sky-400 text-center dark:bg-zinc-700 p-4 rounded-lg shadow">
            <h3 className="font-bold text-white text-xl">Casualties</h3>
            <p className="text-center text-bold text-4xl">{disaster.casualties}</p>
            <button 
              onClick={openUpdateModal}
              className="mt-2 bg-white text-sky-600 px-4 py-2 rounded hover:bg-sky-50"
            >
              Update Status
            </button>
          </div>
          <div className="bg-sky-400 text-center dark:bg-zinc-700 p-4 rounded-lg shadow">
            <h3 className="font-bold text-center text-white text-xl">Affected People</h3>
            <p className="text-center text-bold text-4xl">{disaster.affectedPopulation}</p>
            <button 
              onClick={openUpdateModal}
              className="mt-2 bg-white text-sky-600 px-4 py-2 rounded hover:bg-sky-50"
            >
              Update Status
            </button>
          </div>
          <div className="bg-sky-400 text-center dark:bg-zinc-700 p-4 rounded-lg shadow">
            <h3 className="font-bold text-center text-white text-xl">Severity</h3>
            <p className="text-center text-bold text-4xl">{disaster.severity}</p>
            <button 
              onClick={openUpdateModal}
              className="mt-2 bg-white text-sky-600 px-4 py-2 rounded hover:bg-sky-50"
            >
              Update Status
            </button>
          </div>
        </div>
        
        <div className="bg-zinc-200 dark:bg-zinc-700 my-2 p-4 rounded-lg shadow mx-10 text-xl">
          <h3 className="font-bold">Additional Details:</h3>
          <p>{disaster.additionalNotes}</p>
        </div>
        <div className="bg-zinc-200 dark:bg-zinc-700 p-4 my-2 rounded-lg shadow mx-10 text-xl">
          <h3 className="font-bold">Emergency Responses:</h3>
          <p>{disaster.emergencyResponse}</p>
        </div>
        <div className="mt-4 w-fit grid grid-cols-1 md:grid-cols-2 gap-4 items-center mx-10">
          <div className="px-4 py-2 flex items-center bg-sky-300 rounded">
            <div>
              <h3 className="text-4xl mb-2 font-bold text-center text-white">Donate</h3>
              <p className="text-xl font-semibold text-gray-600 text-center mx-2">
                "Remember that the happiest people are not those getting more,
                but those giving more." ― H. Jackson Brown Jr.
              </p>
            </div>
            <div className="ml-auto">
              <img
                src={box}
                alt="donate"
                className="w-full h-full object-cover p-3 rounded-lg shadow-lg bg-white"
              />
            </div>
          </div>
          <Link to="/volunteer">
            <div className="px-4 py-2 flex items-center bg-sky-300 rounded">
              <div>
                <h3 className="text-4xl mb-2 font-bold text-center text-white">Come and Help</h3>
                <p className="text-xl font-semibold text-gray-600 text-center mx-2">
                  "Volunteers don't get paid, not because they're worthless, but
                  because they're priceless." – Sherry Anderson
                </p>
              </div>
              <div className="ml-auto">
                <img
                  src={voluntee}
                  alt="help"
                  className="w-full h-full object-cover p-3 rounded-lg shadow-lg bg-white"
                />
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-4 mx-10">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-center text-3xl">Images</h3>
            <button
              onClick={openModal}
              className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded"
            >
              + Add Image
            </button>
          </div>
          <ImageModal
            isOpen={isOpen}
            onClose={closeModal}
            id={id}
            getDisasterById={getDisasterById}
          />
          <div className="flex items-center border-4 border-sky-600 mt-2 overflow-x-auto">
            {disaster.uploadedPhotos?.map((image, index) => (
              <img
                key={`${image}-${index}`}
                src={image}
                alt={`Disaster image ${index + 1}`}
                className="w-1/5 h-35 object-cover border-3 rounded-lg mx-3 my-3 p-2 rounded-lg shadow-xl mr-2"
              />
            ))}
          </div>
        </div>

        <div className="mt-4 mx-10">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-3xl text-center">Comments</h3>
            <button
              onClick={copenModal}
              className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded"
            >
              Add Comment
            </button>
          </div>
          <CommentModal
            isOpen={isModalOpen}
            onClose={ccloseModal}
            id={id}
            fetchComments={fetchComments}
          />
          <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow-md">
            <ul>
              {comments.map((comment, i) => (
                <li
                  key={comment._id}
                  className="border-b border-zinc-200 dark:border-zinc-600 py-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-zinc-600 dark:text-zinc-400">#{i + 1}</span>
                      <span className="font-bold ml-2">{comment.name}</span>
                    </div>
                    <span className="text-zinc-500 dark:text-zinc-400">
                      {comment.timestamp}
                    </span>
                  </div>
                  <p className="text-zinc-700 dark:text-zinc-300 mt-2">{comment.comment}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <UpdateModal
        isOpen={isUpdateModalOpen}
        onClose={closeUpdateModal}
        disaster={disaster}
        getDisasterById={getDisasterById}
      />
      <Footer />
    </div>
  );
};

export default DisasterDetails;
