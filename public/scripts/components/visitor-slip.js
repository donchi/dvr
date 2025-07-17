export function PrintVisitorSlip(){
  const printBtn = document.getElementById('print-slip-btn');
  if (!printBtn) return;
  printBtn.addEventListener('click', function() {
    
    // Set current date and time in compact format
    const now = new Date();
    const checkinTime = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth()+1).padStart(2, '0')}/${now.getFullYear().toString().slice(-2)} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    document.getElementById('slip-checkin').textContent = checkinTime;


    // Update slip with form data
    const dependants = document.getElementById('dependants-value').textContent;
    document.getElementById('slip-dependants').textContent = dependants;
    
    const tagNo = document.getElementById('tag-no-value').textContent;
    document.getElementById('slip-tag').textContent = tagNo;
    
    const other_destinations = document.getElementById('other-destinations-value').textContent;
    document.getElementById('slip-other-destinations').textContent = other_destinations;

    // Generate QR code with minimal visitor data
    const qrData = `V:JohnDoe,P:08012345678,T:${tagNo || 'NA'},D:${checkinTime}`;
    document.querySelector('.receipt .slip-qr img').src = 
      `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(qrData)}`;
    
    // Show the slip and print
    const slip = document.getElementById('visitor-slip');
    slip.style.display = 'block';
    window.print();
    slip.style.display = 'none';
  });
}