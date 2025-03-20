import React, { useState, useEffect } from 'react';
import './VaccinationReminderPage.css';

const VaccinationReminderPage = () => {
  const [dogId, setDogId] = useState('');
  const [petName, setPetName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [vaccineName, setVaccineName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [vaccinationTime, setVaccinationTime] = useState('');
  const [reminders, setReminders] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Fetch reminders when dogId changes
  useEffect(() => {
    if (dogId) {
      fetchReminders(dogId);
    }
  }, [dogId]);

  // Handle adding a dog
  const handleAddDog = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const dogData = {
      name: petName,
      email,
      phone_number: phoneNumber,
      birth_date: birthDate,
    };
    console.log('Sending add dog request with data:', dogData);

    try {
      const response = await fetch('http://localhost:5001/api/dogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dogData),
      });
      console.log('Response status:', response.status);

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        let errorText = 'Failed to add dog.';
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorText = errorData.error || errorText;
        } else {
          errorText = await response.text();
        }
        throw new Error(errorText);
      }

      const data = await response.json();
      console.log('Response data:', data);
      setSuccessMessage('Dog added successfully!');
      setDogId(data.dog_id);
      setPetName('');
      setEmail('');
      setPhoneNumber('');
      setBirthDate('');
    } catch (err) {
      console.error('Add dog error:', err);
      setError(err.message);
    }
  };

  // Fetch reminders for a dog
  const fetchReminders = async (dogId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/vaccinations/${dogId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch reminders');
      }
      const data = await response.json();
      setReminders(data);
    } catch (err) {
      console.error('Fetch reminders error:', err);
      setError(err.message);
    }
  };

  // Handle setting a reminder
  const handleSetReminder = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const reminderData = {
      dog_id: dogId,
      vaccine_name: vaccineName,
      due_date: dueDate,
      vaccination_time: vaccinationTime,
    };
    console.log('Sending set reminder request with data:', reminderData);

    try {
      const response = await fetch('http://localhost:5001/api/vaccinations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reminderData),
      });
      console.log('Response status:', response.status);

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        let errorText = 'Failed to set reminder.';
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorText = errorData.error || errorText;
        } else {
          errorText = await response.text();
        }
        throw new Error(errorText);
      }

      const data = await response.json();
      console.log('Response data:', data);
      setSuccessMessage('Reminder set successfully!');
      fetchReminders(dogId); // Refresh reminders
      setVaccineName('');
      setDueDate('');
      setVaccinationTime('');
    } catch (err) {
      console.error('Set reminder error:', err);
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Pet Vaccination Reminder</h1>

      {/* Dog Addition Form */}
      <form onSubmit={handleAddDog}>
        <input
          type="text"
          value={petName}
          onChange={(e) => setPetName(e.target.value)}
          placeholder="Pet Name"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Phone Number"
          required
        />
        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          required
        />
        <button type="submit">Add Dog</button>
      </form>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Reminder Form (if dogId exists) */}
      {dogId && (
        <div>
          <h2>Set Vaccination Reminder for Dog ID: {dogId}</h2>
          <form onSubmit={handleSetReminder}>
            <input
              type="text"
              value={vaccineName}
              onChange={(e) => setVaccineName(e.target.value)}
              placeholder="Vaccine Name"
              required
            />
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
            <input
              type="time"
              value={vaccinationTime}
              onChange={(e) => setVaccinationTime(e.target.value)}
              required
            />
            <button type="submit">Set Reminder</button>
          </form>
        </div>
      )}

      {/* Display Reminders */}
      <h2>Vaccination Schedule</h2>
      {reminders.length > 0 ? (
        <ul>
          {reminders.map((reminder) => (
            <li key={reminder.id}>
              {reminder.due_date} at {reminder.vaccination_time} - {reminder.vaccine_name}
            </li>
          ))}
        </ul>
      ) : (
        <p>No reminders set.</p>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default VaccinationReminderPage;