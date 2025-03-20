import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import './PetFirstAidGuide.css';

const PetFirstAidGuide = () => {
  const navigate = useNavigate();
  const [activeTip, setActiveTip] = useState(null);
  const [kitItems, setKitItems] = useState({
    gauze: false,
    bandages: false,
    saline: false,
    antiseptic: false,
    tweezers: false,
    thermometer: false,
    muzzle: false,
    contacts: false,
    medication: false,
  });

  const firstAidTips = [
    {
      id: 1,
      title: 'Choking',
      description: [
        'Stay calm and gently restrain your pet.',
        'Open their mouth and check for visible obstructions (e.g., a toy or bone).',
        'If you can see the object, carefully remove it with your fingers or tweezers—do not push it further.',
        'If you can’t remove it, perform a modified Heimlich maneuver (consult a vet for proper technique).',
        'Contact your vet or emergency services immediately, even if cleared.',
      ],
    },
    {
      id: 2,
      title: 'Cuts or Bleeding',
      description: [
        'Apply gentle pressure with a clean cloth or bandage to stop bleeding.',
        'Clean the wound with saline solution or clean water—avoid alcohol or hydrogen peroxide.',
        'Wrap the wound with a bandage if possible, but not too tightly.',
        'Monitor for signs of infection (redness, swelling) and contact your vet.',
        'Elevate the injured area if safe to do so.',
      ],
    },
    {
      id: 3,
      title: 'Heatstroke',
      description: [
        'Move your pet to a cool, shaded area immediately.',
        'Offer small amounts of cool (not cold) water to drink.',
        'Wet their body with cool water, focusing on the head, neck, and underbelly.',
        'Use a fan to help cool them down, but avoid ice-cold water or ice packs.',
        'Contact your vet as soon as possible—heatstroke can be life-threatening.',
        'Watch for symptoms like excessive panting or collapse.',
      ],
    },
    {
      id: 4,
      title: 'Poisoning',
      description: [
        'If you suspect your pet ingested something toxic, do not induce vomiting unless instructed by a vet.',
        'Identify the substance if possible (e.g., chocolate, antifreeze, plants).',
        'Call your vet or a pet poison control hotline immediately (e.g., ASPCA: (888) 426-4435).',
        'Keep the packaging of the substance for reference if available.',
        'Note the time of ingestion and any symptoms.',
      ],
    },
    {
      id: 5,
      title: 'Fractures or Broken Bones',
      description: [
        'Keep your pet as still and calm as possible to prevent further injury.',
        'Do not attempt to realign the bone—stabilize the area with a makeshift splint (e.g., rolled magazine or board).',
        'Use a towel or blanket to gently secure the limb, avoiding tight pressure.',
        'Transport your pet to a vet immediately, supporting their body.',
        'Avoid letting them walk or move excessively.',
      ],
    },
    {
      id: 6,
      title: 'Seizures',
      description: [
        'Clear the area around your pet to prevent injury during the seizure.',
        'Time the seizure—contact a vet if it lasts longer than 2-3 minutes or if multiple occur.',
        'Do not restrain your pet or put your hands near their mouth.',
        'Keep them cool and calm after the seizure ends.',
        'Seek veterinary attention to determine the cause (e.g., epilepsy, toxins).',
      ],
    },
  ];

  const firstAidChecklist = [
    'Gauze and non-stick bandages',
    'Adhesive tape for bandages',
    'Sterile saline solution',
    'Antiseptic wipes or spray',
    'Tweezers and scissors',
    'Digital thermometer (rectal, pet-specific)',
    'Muzzle (to prevent biting if your pet is in pain)',
    'Emergency contact numbers (vet, poison control)',
    'Pet-specific medication (if prescribed)',
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => !currentUser && navigate('/signin'));
    return () => unsubscribe();
  }, [navigate]);

  const handleKitToggle = (item) => setKitItems((prev) => ({ ...prev, [item]: !prev[item] }));
  const handlePrint = () => {
    const printContent = `<h2>Pet First Aid Kit Checklist</h2><ul>${firstAidChecklist.map((item) => `<li>${item}</li>`).join('')}</ul>`;
    window.open('', '', 'height=600,width=800').document.write(`<html><head><title>Pet First Aid Kit Checklist</title></head><body onload="window.print();">${printContent}</body></html>`);
  };

  return (
    <div className="pet-first-aid-container">
      <h1>Pet First Aid Guide</h1>
      <p>Quick tips to help your pet in an emergency. Always contact your vet for professional advice.</p>
      <div className="search-bar"><input type="text" placeholder="Search first aid tips..." onChange={(e) => setActiveTip(e.target.value.toLowerCase())} /></div>
      <section className="first-aid-tips">
        <h2>First Aid Tips</h2>
        {firstAidTips.filter((tip) => tip.title.toLowerCase().includes(activeTip || '') || tip.description.some((step) => step.toLowerCase().includes(activeTip || ''))).map((tip) => (
          <div key={tip.id} className={`tip-item ${activeTip === tip.title.toLowerCase() ? 'active' : ''}`}>
            <h3 onClick={() => setActiveTip(activeTip === tip.title.toLowerCase() ? null : tip.title.toLowerCase())}>
              {tip.title} <span className="accordion-toggle">{activeTip === tip.title.toLowerCase() ? '▲' : '▼'}</span>
            </h3>
            {activeTip === tip.title.toLowerCase() && <ul className="tip-details">{tip.description.map((step, index) => <li key={index}>{step}</li>)}</ul>}
          </div>
        ))}
      </section>
      <section className="first-aid-checklist">
        <h2>Pet First Aid Kit Checklist</h2>
        <p>Keep these items on hand for emergencies:</p>
        <button onClick={handlePrint} className="print-button">Print Checklist</button>
        <ul>
          {firstAidChecklist.map((item, index) => {
            const key = Object.keys(kitItems)[index];
            return (
              <li key={index} className={kitItems[key] ? 'checked' : ''}>
                <input type="checkbox" id={key} checked={kitItems[key]} onChange={() => handleKitToggle(key)} />
                <label htmlFor={key}>{item}</label>
              </li>
            );
          })}
        </ul>
        <p className="kit-status">{Object.values(kitItems).filter(Boolean).length} / {firstAidChecklist.length} items checked!</p>
      </section>
      <div className="disclaimer">
        <p><strong>Disclaimer:</strong> This guide is for informational purposes only and does not replace professional veterinary care. Always consult your vet in an emergency.</p>
      </div>
    </div>
  );
};

export default PetFirstAidGuide;