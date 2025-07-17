export function NewVisitorStep2(){
  document.getElementById("step2-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const errorContainer_step2 = document.querySelector('#new-visitor-step2 .error-list');
    const successContainer = document.querySelector('#new-visitor-step2 .success-container');
    const resendBtn = document.querySelector('#resend-code-btn');
    const verification_input = document.querySelector('#verification-input');
  
    try {
      // Show loading state
      const submitBtn = e.target.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Verifying...';
  
      const response = await fetch('/visitors/submit-step2', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        body: new URLSearchParams(formData)
      });
  
      const result = await response.json();
  
      // Reset button state
      submitBtn.disabled = false;
      submitBtn.textContent = 'Verify';
  
      if (result.success) {
        submitBtn.textContent = 'Next'; // change btn to next
        errorContainer_step2.style.display = 'none'; // remove error div
        successContainer.style.display = 'block'; // show success div
        successContainer.innerHTML = "&#10004; Phone Number Verified";
        resendBtn.style.display = 'none'; // remove resend btn
        verification_input.style.display = 'none'; // remove input field
  
        submitBtn.addEventListener('click',(e)=>{
          e.preventDefault();
          document.getElementById('new-visitor-step2').style.display = 'none';
          document.getElementById('new-visitor-step3').style.display = 'block';
        })
        
      } else {
        // Display errors - now looking in the correct place
        if (errorContainer_step2) {
          const errorList = result.errors.map(err => `<li>${err}</li>`).join('');
          errorContainer_step2.style.display = 'block'
          errorContainer_step2.innerHTML = `<ul>${errorList}</ul>`;
        } else {
          console.error('Error container not found');
        }
      }
    } catch (err) {
      console.error("AJAX error:", err);
      // Reset button if error occurs
      const submitBtn = e.target.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Next';
      }
    }
  });
  
}