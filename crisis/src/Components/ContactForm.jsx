import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { FaUser, FaTelegramPlane, FaRegEnvelope, FaFileAlt } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import "../css/contact.css";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    message: "",
    contact: "",
  });
  const [shakeAnimation, setShakeAnimation] = useState(false);
  const { name, subject, message, contact } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!name || !subject || !message || !contact) {
      setShakeAnimation(true);
      toast.error("Please fill in all fields");
      setTimeout(() => setShakeAnimation(false), 500);
      return;
    }

    try {
      // Replace these with your actual Telegram credentials
      const telegramToken = "7782839183:AAEI8CatufHmhO5gIYfZDy6FNiOuBqecwYA";
      const chatId = "5410077662";
      
      // Format the message for Telegram
      const telegramMessage = `
📝 New Contact Form Submission
      
👤 Name: ${name}
📋 Subject: ${subject}
💬 Message: ${message}
📞 Contact: ${contact}
      `;

      // Send to Telegram
      const response = await fetch(
        `https://api.telegram.org/bot${telegramToken}/sendMessage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: telegramMessage,
            parse_mode: "HTML",
          }),
        }
      );

      if (response.ok) {
        toast.success("Message sent successfully!");
        // Clear form after successful submission
        setFormData({
          name: "",
          subject: "",
          message: "",
          contact: "",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.description || "Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(error.message || "Failed to send message. Please try again later.");
    }
  };

  return (
    <div className="contact-form">
      <div className="form-container">
        <h2 className="form-title">Contact Support</h2>
        <form onSubmit={onSubmit} className={shakeAnimation ? "animate-shake" : ""}>
          <div className="relative">
            <FaUser className="icon" />
            <input
              type="text"
              name="name"
              value={name}
              onChange={onChange}
              placeholder="Your Name"
              className="input-field"
            />
          </div>

          <div className="relative">
            <FaRegEnvelope className="icon" />
            <input
              type="text"
              name="subject"
              value={subject}
              onChange={onChange}
              placeholder="Subject"
              className="input-field"
            />
          </div>

          <div className="relative">
            <FaFileAlt className="icon" />
            <textarea
              name="message"
              value={message}
              onChange={onChange}
              placeholder="Your Message"
              className="input-field"
              rows="4"
            />
          </div>

          <div className="relative">
            <FaTelegramPlane className="icon" />
            <input
              type="text"
              name="contact"
              value={contact}
              onChange={onChange}
              placeholder="Preferred Contact Info"
              className="input-field"
            />
          </div>

          <button type="submit" className="submit-button">
            Send Message
          </button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default ContactForm;