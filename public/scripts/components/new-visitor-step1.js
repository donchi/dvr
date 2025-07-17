export function NewVisitorStep1(){
  document.getElementById("step1-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const errorContainer_step1 = document.querySelector('#new-visitor-step1 .error-list');
  
    try {
      // Show loading state
      const submitBtn = e.target.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Processing...';
  
      const response = await fetch('/visitors/submit-step1', {
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
      submitBtn.textContent = 'Next';
  
      if (result.success) {
        errorContainer_step1.style.display = 'none';
        document.getElementById('new-visitor-step1').style.display = 'none';
        const step2 = document.getElementById('new-visitor-step2');
        step2.style.display = 'block';
  
        // Update phone number display
        const phoneDisplay = step2.querySelector('strong');
        if (phoneDisplay) {
          phoneDisplay.textContent = result.cleanedPhone;
        }
      } else {
        // Display errors - now looking in the correct place
       
        if (errorContainer_step1) {
          const errorList = result.errors.map(err => `<li>${err}</li>`).join('');
          errorContainer_step1.style.display = 'block'
          errorContainer_step1.innerHTML = `<ul>${errorList}</ul>`;
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