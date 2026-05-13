const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const dataPath = path.join(__dirname, 'data.json');

// Helper to read data
const readData = () => {
  try {
    const data = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return { reservations: [], nextId: 1 };
  }
};

// Helper to write data
const writeData = (data) => {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

// Table configurations
const getTableCapacity = (tableNumber) => {
  const num = parseInt(tableNumber);
  if (num >= 1 && num <= 3) return 2;
  if (num >= 4 && num <= 6) return 4;
  if (num >= 7 && num <= 9) return 6;
  if (num === 10) return 10;
  return 0;
};

// Validate time
const isValidTime = (timeStr) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  if (isNaN(hours) || isNaN(minutes)) return false;
  
  // Morning/Lunch: 09:00 -> 12:59
  if (hours >= 9 && hours < 13) return true;
  // Afternoon/Dinner: 14:00 -> 22:59
  if (hours >= 14 && hours < 23) return true;
  
  // Special Ftour Slots: 18:30, 19:00, 19:30, 20:00
  const isFtour = (hours === 18 && minutes === 30) || 
                  (hours === 19 && (minutes === 0 || minutes === 30)) || 
                  (hours === 20 && minutes === 0);
  if (isFtour) return true;

  return false;
};

// 1. GET /reservations
app.get('/reservations', (req, res) => {
  const data = readData();
  res.json(data.reservations);
});

// 2. POST /reservations
app.post('/reservations', (req, res) => {
  console.log("Received reservation request:", req.body);
  const { nom, prenom, telephone, date, heure, persons, table, experience } = req.body;
  
  // Validate nom, prenom (letters only)
  const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;
  if (!nom || !nameRegex.test(nom)) {
    return res.status(400).json({ error: "Nom doit contenir uniquement des lettres." });
  }
  if (!prenom || !nameRegex.test(prenom)) {
    return res.status(400).json({ error: "Prénom doit contenir uniquement des lettres." });
  }

  // Validate telephone (exactly 10 digits)
  if (!telephone || !/^\d{10}$/.test(telephone)) {
    return res.status(400).json({ error: "Le téléphone doit contenir exactement 10 chiffres." });
  }

  // Validate date (DD/MM/YY or DD/MM/YYYY)
  if (!date || !/^\d{2}\/\d{2}\/(\d{2}|\d{4})$/.test(date)) {
    return res.status(400).json({ error: "La date doit être au format JJ/MM/AA ou JJ/MM/AAAA." });
  }

  // Normalize to JJ/MM/AA for data consistency
  let normalizedDate = date;
  if (date.length === 10) { // JJ/MM/AAAA
    const parts = date.split('/');
    normalizedDate = `${parts[0]}/${parts[1]}/${parts[2].slice(-2)}`;
  }


  // Validate time (HH:MM and within limits)
  if (!heure || !/^\d{2}:\d{2}$/.test(heure) || !isValidTime(heure)) {
    return res.status(400).json({ error: "L'heure doit être entre 09:00-12:59 ou 14:00-22:59." });
  }

  // Validate persons
  const numPersons = parseInt(persons);
  if (isNaN(numPersons) || numPersons <= 0) {
    return res.status(400).json({ error: "Le nombre de personnes doit être supérieur à 0." });
  }

  // Validate table
  const tableNum = parseInt(table);
  const capacity = getTableCapacity(tableNum);
  if (capacity === 0) {
    return res.status(400).json({ error: "Numéro de table invalide (doit être entre 1 et 10)." });
  }
  if (numPersons > capacity) {
    return res.status(400).json({ error: `La table ${tableNum} ne peut accueillir que ${capacity} personnes maximum.` });
  }

  const data = readData();

  // Prevent double booking
  const isBooked = data.reservations.some(r => r.table == tableNum && r.date === normalizedDate && r.heure === heure);
  if (isBooked) {
    return res.status(400).json({ error: "La table est déjà réservée à cette date et cette heure." });
  }

  // Add reservation
  const newReservation = {
    id: data.nextId++,
    nom,
    prenom,
    telephone,
    date: normalizedDate,
    heure,
    persons: numPersons,
    table: tableNum,
    experience: experience || 'Standard',
    isRamadan: req.body.isRamadan || false,
    groupType: req.body.groupType || 'None',
    specialRequests: req.body.specialRequests || []
  };

  data.reservations.push(newReservation);
  writeData(data);

  res.status(201).json(newReservation);
});

// 3. DELETE /reservations/:id
app.delete('/reservations/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const data = readData();
  
  const initialLength = data.reservations.length;
  data.reservations = data.reservations.filter(r => r.id !== id);
  
  if (data.reservations.length === initialLength) {
    return res.status(404).json({ error: "Réservation introuvable." });
  }

  writeData(data);
  res.json({ message: "Réservation supprimée avec succès." });
});

// 4. GET /search
app.get('/search', (req, res) => {
  const { type, query, qDate, qTime } = req.query;
  const data = readData();
  let results = [];

  if (type === 'id') {
    const id = parseInt(query);
    results = data.reservations.filter(r => r.id === id);
  } else if (type === 'name') {
    const q = (query || '').toLowerCase();
    results = data.reservations.filter(r => 
      r.nom.toLowerCase().includes(q) || r.prenom.toLowerCase().includes(q)
    );
  } else if (type === 'datetime') {
    results = data.reservations.filter(r => {
      let match = true;
      if (qDate) match = match && r.date === qDate;
      if (qTime) match = match && r.heure === qTime;
      return match;
    });
  } else {
    results = data.reservations; // fallback
  }

  res.json(results);
});

// 5. GET /available-tables
app.get('/available-tables', (req, res) => {
  const { date, time } = req.query;
  
  if (!date || !time) {
    return res.status(400).json({ error: "Date et heure requises." });
  }

  // Normalize date to JJ/MM/AA
  let normalizedDate = date;
  if (date.includes('/') && date.length === 10) {
    const parts = date.split('/');
    normalizedDate = `${parts[0]}/${parts[1]}/${parts[2].slice(-2)}`;
  } else if (date.includes('-')) {
    const parts = date.split('-');
    if (parts.length === 3) {
      normalizedDate = `${parts[2]}/${parts[1]}/${parts[0].slice(-2)}`;
    }
  }

  const data = readData();
  
  // Find all tables booked exactly at this date and time
  const bookedTables = data.reservations
    .filter(r => r.date === normalizedDate && r.heure === time)
    .map(r => r.table);


  const tables = [];
  for (let i = 1; i <= 10; i++) {
    tables.push({
      table: i,
      capacity: getTableCapacity(i),
      available: !bookedTables.includes(i)
    });
  }

  res.json(tables);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
