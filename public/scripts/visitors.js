import { initializeWebcamCapture } from "./components/capture-photo.js";

import { NewVisitorStep1 } from "./components/new-visitor-step1.js";
import { NewVisitorStep2 } from "./components/new-visitor-step2.js";
import { NewVisitorStep3 } from "./components/new-visitor-step3.js";
import { NewVisitorStep4 } from "./components/new-visitor-step4.js";

import { ReturningVisitorStep1 } from "./components/returning-visitor-step1.js";
import { ReturningVisitorStep2 } from "./components/returning-visitor-step2.js";


// Initial Setup
document.addEventListener("DOMContentLoaded", () => {
  const new_visitor_btn = document.getElementById('new_visitor_btn');
  const returning_visitor_btn = document.getElementById('returning_visitor_btn');
  const home_btn = document.getElementById('home-btn');

  home_btn?.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '/visitors'
  })

  new_visitor_btn?.addEventListener('click', () => {
    document.getElementById('visitors-home').style.display = 'none'
    document.getElementById('new-visitor-step1').style.display = 'block'
    document.getElementById('home-btn').style.display = 'block'
  })

  returning_visitor_btn?.addEventListener('click', () => {
    document.getElementById('visitors-home').style.display = 'none'
    document.getElementById('returning-visitor-step1').style.display = 'block'
    document.getElementById('forgot-passcode-btn').style.display = 'inline-block'
    document.getElementById('home-btn').style.display = 'block'

  });

  document.querySelectorAll('.back-btn-new-visitor').forEach(button => {
      button.addEventListener('click', ()=>{
        const step = parseInt(button.getAttribute('data-step'));  
        prev_step_new(step);
      })
  });

  document.querySelectorAll('.back-btn-returning-visitor').forEach(button => {
    button.addEventListener('click', ()=>{
      const step = parseInt(button.getAttribute('data-step'));  
      prev_step_returning(step);
    })
  });


  function prev_step_new(step) {
    // new visitors back button 
        if (step === 0) {
          // Return to visitor type selection
          document.getElementById('visitors-home').style.display = 'block'
          document.getElementById('new-visitor-step1').style.display = 'none'
        } else {
          // Go back to previous step
          document.getElementById(`new-visitor-step${step + 1}`).style.display = 'none'
          document.getElementById(`new-visitor-step${step}`).style.display = 'block'
        }
  }


// Handle New Visitor Step 1 Contact Details
NewVisitorStep1();

// Handle New Visitor Step 2 - Phone Verification
NewVisitorStep2();

// Handle New Visitor Step 3 - Passcode
NewVisitorStep3();

// Handle New Visitor Step 4 - Visiting Details
NewVisitorStep4();

// Handle New Visitor Step 5 - Capture Photo
initializeWebcamCapture();


// Handle Returning Visitor Step 1 Contact Details
ReturningVisitorStep1();

// Handle New Visitor Step 2 - Visit Details Check In
ReturningVisitorStep2();


})

function prev_step_returning(step){
  if (step === 0) {
    // Return to visitor type selection
    document.getElementById('visitors-home').style.display = 'block'
    document.getElementById('returning-visitor-step1').style.display = 'none'
  } else {
    // Go back to previous step
    document.getElementById(`returning-visitor-step${step + 1}`).style.display = 'none'
    document.getElementById(`returning-visitor-step${step}`).style.display = 'block'
  }
}