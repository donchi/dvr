export function ReturningVisitorStep2(){
  const form = document.getElementById("returning-visitor-step2-form");
  const agency = 'NIGERIA CUSTOMS SERVICE' // DEFENCE;
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const errorContainer_step2 = document.querySelector('#returning-visitor-step2 .error-list');
  
    try {
      // Show loading state
      const submitBtn = e.target.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Checking In...';
  
      const response = await fetch('/visitors/returning-visitor-submit-step2', {
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
      submitBtn.textContent = 'Check In';
  
      if (result.success) {
        errorContainer_step2.style.display = 'none';
        document.getElementById('returning-visitor-step2').style.display = 'none';
        document.getElementById('returning-visitor-step3').style.display = 'block';
        const checkin_message = document.getElementById('checkin-message');
        
        checkin_message.innerHTML = `
          <div class="visitor-avatar">
          <img src="/images/visitors/${result?.photo}" alt="Visitor Photo">
          </div>
          <h1>Please hold ${result?.title_rank} ${result?.first_name} while we check you in...</h1>
          <span id="status-indicator" class="status-badge inactive">Processing...</span>
          <h3>${agency} HEADQUARTERS</h3>
        `;

          // polling
      const visitId = result.visit_id;
     // const status_indicator = document.getElementById('status-indicator');
      console.log('visit id', visitId);
      let checkInterval;

      function checkStatus() {
        fetch(`/visitors/status/${visitId}`)
          .then(response => response.json())
          .then(data => {
            console.log('data', data)
            if (data.success) {
                  checkin_message.innerHTML = `
                  <div class="visitor-avatar">
                  <img src="/images/visitors/${result?.photo}" alt="Visitor Photo">
                  </div>
                  <h1>Please hold ${result?.title_rank} ${result?.first_name} while we check you in...</h1>
                  <span id="status-indicator" class="status-badge pending">${data.status.toUpperCase()}...</span>
                  <h3>${agency} HEADQUARTERS</h3>
                `;
              
              if (data.status === 'checked in') {
                  checkin_message.innerHTML = `
                  <div class="visitor-avatar">
                  <img src="/images/visitors/${result?.photo}" alt="Visitor Photo">
                  </div>
                  <h1>Please hold ${result?.title_rank} ${result?.first_name} while we check you in...</h1>
                  <span id="status-indicator" class="status-badge active">${data.status.toUpperCase()}...</span> <h5>Redirecting to home</h5>
                  <h3>${agency} HEADQUARTERS</h3>
                `;
               
                clearInterval(checkInterval);
                setTimeout(() => {
                  window.location.href = '/visitors'; // Change this to your success URL
                }, 10000);
              }
            }
          })
        .catch(error => console.error('Error:', error));
        }
          // run function
          checkInterval = setInterval(checkStatus, 5000);
          checkStatus();

      } else {
        // Display errors - now looking in the correct place
        if (errorContainer_step2) {
          const errorList = result.errors.map(err => `<li>${err}</li>`).join('');
          errorContainer_step2.style.display = 'block';
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
        submitBtn.textContent = 'Check In';
      }
    }
  });
  
}