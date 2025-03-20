import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import petNameRoutes from "./routes/petNames.js";
import petAlertRoutes from "./routes/petAlerts.js";
import vaccinationReminderRoutes from "./routes/vaccinationReminder.js";
import { v2 as cloudinary } from "cloudinary";
import petfinderRoutes from "./routes/petfinder.js";
import Vaccination from "./models/Vaccination.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Email Setup (Nodemailer)
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'johannkenneth8@gmail.com',
//     pass: process.env.GMAIL_APP_PASSWORD,
//   },
// });

// Email-to-SMS Gateway Mapping for Indian Carriers
// Note: These are examples and may not work for all carriers/numbers. Test with your specific number.
const emailToSmsGateways = {
  airtel: 'sms.airtel.in', // Airtel
  jio: 'sms.jio.com',     // Jio (may not work; Jio support is limited)
  vodafone: 'sms.vodafone.in', // Vodafone Idea (may not work; support varies)
  // Add more carriers as needed
};

// Function to determine the gateway email address for a phone number
const getSmsGatewayEmail = (phoneNumber) => {
  // For testing, assume the number is on Airtel (you can modify this based on your carrier)
  // In a real system, you'd need to know the user's carrier or ask them to select it
  const number = phoneNumber.replace('+91', ''); // Remove +91 for the gateway
  const carrier = 'airtel'; // Hardcoded for testing; replace with actual carrier detection
  const gateway = emailToSmsGateways[carrier];
  return gateway ? `${number}@${gateway}` : null;
};

// Schedule Notifications
// cron.schedule('* * * * *', async () => {
//   try {
//     const now = new Date();
//     const currentDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
//     const currentTime = now.toTimeString().slice(0, 5); // HH:MM

//     const dueVaccinations = await Vaccination.find({
//       due_date: currentDate,
//       due_time: currentTime,
//       status: 'pending',
//     }).populate('dog_id');

//     for (const vaccination of dueVaccinations) {
//       const dog = vaccination.dog_id;

//       // Send Email Notification
//       const emailOptions = {
//         from: 'johannkenneth8@gmail.com',
//         to: dog.owner_email,
//         subject: `Vaccination Reminder for ${dog.name}`,
//         text: `Hello,\n\nThis is a reminder that your dog ${dog.name} is due for a ${vaccination.vaccine_name} vaccination on ${vaccination.due_date} at ${vaccination.due_time}.\n\nBest regards,\nPetVerse Team`,
//       };
//       transporter.sendMail(emailOptions, (error, info) => {
//         if (error) {
//           console.error('Error sending email:', error);
//         } else {
//           console.log('Email sent:', info.response);
//         }
//       });

//       // Send SMS via Email-to-SMS Gateway
//       const smsGatewayEmail = getSmsGatewayEmail(dog.phone_number);
//       if (smsGatewayEmail) {
//         const smsOptions = {
//           from: 'johannkenneth8@gmail.com',
//           to: smsGatewayEmail,
//           subject: '', // Subject is often ignored by gateways
//           text: `Reminder: Your dog ${dog.name} is due for a ${vaccination.vaccine_name} vaccination on ${vaccination.due_date} at ${vaccination.due_time}.`,
//         };
//         transporter.sendMail(smsOptions, (error, info) => {
//           if (error) {
//             console.error('Error sending SMS via email-to-SMS gateway:', error);
//           } else {
//             console.log('SMS sent via email-to-SMS gateway:', info.response);
//           }
//         });
//       } else {
//         console.log(`No email-to-SMS gateway found for ${dog.phone_number}. Skipping SMS.`);
//       }

//       // Update status to 'notified'
//       vaccination.status = 'notified';
//       await vaccination.save();
//     }
//   } catch (error) {
//     console.error('Error in cron job:', error);
//   }
// });

// Define API Routes

app.use("/api/pet-names", petNameRoutes);
app.use("/api/pet-alerts", petAlertRoutes);
app.use("/api/petfinder", petfinderRoutes);
app.use("/api/vaccination-reminder", vaccinationReminderRoutes);

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));