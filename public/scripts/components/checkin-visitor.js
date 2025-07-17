export function CheckInVisitor(){

  document.getElementById("checkin-visitor-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const errorContainer = document.querySelector('.error-list');
    const successContainer = document.querySelector('.success-container');
    document.querySelector('[data-nav="today_visitors"]').classList.add('active');

    // change text content on check in
    const dependants = document.getElementById('dependants').value;
    const tagNo = document.getElementById('tag-no').value;
    const other_destinations = document.getElementById('other-destinations').value;
    const remark = document.getElementById('remark').value;
  
    try {
      // Show loading state
      const submitBtn = e.target.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Checking In...';
  
      const response = await fetch('/admin/checkin-visitor', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        body: new URLSearchParams(formData)
      });
  
      const result = await response.json();
      console.log('result', result);
  
      // Reset button state
      submitBtn.disabled = false;
      submitBtn.innerHTML = "<i class='fas fa-right-to-bracket'></i> Check In";

      if (result.success) {
        errorContainer.style.display = 'none';
        successContainer.style.display = 'block';
        successContainer.innerHTML = 'Visitor Checked In Successfully. Print the Visitor Slip';
        // disable form fields and remove button
        document.getElementById('official-section').style.display = 'block';
        document.getElementById('official-form-section').style.display = 'none';
        document.getElementById('visitor-status').innerHTML = "Checked In";
        document.getElementById('visitor-status').classList.add('active');

        document.getElementById('dependants-value').textContent = dependants;
        document.getElementById('tag-no-value').textContent = tagNo;
        document.getElementById('other-destinations-value').textContent = other_destinations.toUpperCase();
        document.getElementById('remark-value').textContent = remark;
        document.getElementById('check-in-out-info').style.display = 'block'
        document.getElementById('check-in-out-info').innerHTML = `
          <div class="section-header">
            <h3><i class="fas fa-building"></i> Check In/Out Information</h3>
          </div>
          
          <div class="visiting-details">
            <div class="error-list-checkout"></div>
            <div class="detail-row">
              <span class="detail-label"><i class="fas fa-right-to-bracket"></i> Check In:</span>
              <span class="detail-value">${ new Date(result?.check_in).toLocaleString()}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label"><i class="fas fa-right-from-bracket"></i> Check Out:</span>
              <span class="detail-value"></span>
            </div>
            <div class="detail-row">
              <span class="detail-label"><i class="fas fa-clock"></i> Time Spent:</span>
              <span class="detail-value">
               
              </span>
            </div>
          </div>
        `;

      } else {   
        if (errorContainer) {
          const errorList = result.errors.map(err => `<li>${err}</li>`).join('');
          errorContainer.style.display = 'block';
          errorContainer.innerHTML = `<ul>${errorList}</ul>`;
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
        submitBtn.innerHTML = "<i class='fas fa-right-to-bracket'></i> Check In";
      }
    }
  });
}