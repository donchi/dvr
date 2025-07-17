export function NewVisitorStep3(){

  // const passcode = document.getElementById("passcode");
  // passcode.addEventListener("input", function () {
  //   // Remove any non-digit characters
  //   this.value = this.value.replace(/\D/g, '');

  //   // Limit to 4 digits max
  //   if (this.value.length > 4) {
  //     this.value = this.value.slice(0, 4);
  //   }
  // });

  document.getElementById("step3-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const errorContainer_step3 = document.querySelector('#new-visitor-step3 .error-list');
  
    try {
      // Show loading state
      const submitBtn = e.target.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Processing...';
  
      const response = await fetch('/visitors/submit-step3', {
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
        errorContainer_step3.style.display = 'none';
        document.getElementById('new-visitor-step3').style.display = 'none';
        document.getElementById('new-visitor-step4').style.display = 'block';
      } else {
          console.log('error');
          const errorList = result.errors.map(err => `<li>${err}</li>`).join('');
          errorContainer_step3.style.display = 'block'
          errorContainer_step3.innerHTML = `<ul>${errorList}</ul>`;
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