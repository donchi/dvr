export function CheckOutDialogBox() {

  const checkOutBtn = document.getElementById('check-out-btn');
  const dialog = document.getElementById('checkout-dialog');
  const noBtn = document.getElementById('dialog-no');
  const yesBtn = document.getElementById('dialog-yes');
  const checkOutForm = document.getElementById("checkout-form")
  
  if (!checkOutBtn || !dialog || !noBtn || !yesBtn || !checkOutForm) return;

    // Open dialog when Check Out button is clicked
    checkOutBtn.addEventListener('click', function() {
      checkOutForm.addEventListener('submit', (e)=> {
        e.preventDefault();
      })
      dialog.classList.add('active');
    });
    
    // Close dialog when No button is clicked
    noBtn.addEventListener('click', function() {
      dialog.classList.remove('active');
    });
    
    // Handle Check Out when Yes button is clicked
    yesBtn.addEventListener('click', function() {
      dialog.classList.remove('active');
        
      checkOutForm.submit( async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const errorContainer = document.querySelector('.error-list-checkout');
  
    try {
      // Show loading state
      yesBtn.disabled = true;
      yesBtn.textContent = 'Checking Out...';
  
      const response = await fetch('/admin/checkout-visitor', {
        method: 'POST',
        body: new URLSearchParams(formData),
         headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      });
  
      const result = await response.json();
      console.log('result', result);
      
      if (result.success) {
        errorContainer.style.display = 'none';
        document.getElementById('checkout-dialog').style.display = 'none';
        document.getElementById('checkout-value').textContent = result.visitor?.check_out;
       // document.getElementById('hourspent-value').textContent = result?.hourspent;
        document.getElementById('print-slip-btn').style.display = 'none';
        document.getElementById('check-out-btn').style.display = 'none';
        document.getElementById('visitor-status').textContent = result.visitor?.status;

        // stop user from resubmiting the form
        if (window.history.replaceState) {
          window.history.replaceState(null, null, window.location.href);
        }

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
      if (yesBtn) {
        yesBtn.disabled = false;
        yesBtn.textContent = 'Check Out';
      }
    }
  });
    });
    
    // Close dialog when clicking outside the dialog box
    dialog.addEventListener('click', function(e) {
      if (e.target === dialog) {
        dialog.classList.remove('active');
      }
    });
    
    // Close dialog with Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && dialog.classList.contains('active')) {
        dialog.classList.remove('active');
      }
    });
}