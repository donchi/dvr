export function ReturningVisitorStep1(){
  document.getElementById("returning-visitor-step1-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const errorContainer_step1 = document.querySelector('#returning-visitor-step1 .error-list');
  
    try {
      // Show loading state
      const submitBtn = e.target.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Logging...';
  
      const response = await fetch('/visitors/returning-visitor-submit-step1', {
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
      submitBtn.textContent = 'Login';
  
      if (result.success) {
        errorContainer_step1.style.display = 'none';
        document.getElementById('returning-visitor-step1').style.display = 'none';
        document.getElementById('returning-visitor-step2').style.display = 'block';
        document.getElementById('forgot-passcode-btn').style.display = 'none';
        document.getElementById('home-btn').style.display = 'none';
        document.getElementById('sidenav').style.display = 'block';
        document.getElementById('welcome-back').innerHTML = `Welcome back ${result.loginResult.title_rank} ${result.loginResult.first_name} ${result.loginResult.last_name} `;

      } else {
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
        submitBtn.textContent = 'Login';
      }
    }
  });
}