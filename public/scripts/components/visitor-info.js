import toProperCase from "../utilities/word_formatting.js";

export function GetVisitDetails(){
    // Get the modal and buttons
    const modal = document.getElementById('detailsModal');
    const closeBtn = document.querySelector('.close');
    const viewButtons = document.querySelectorAll('.view-details');
    if(!modal || !closeBtn || !viewButtons) return
    
    // Add click event to all view buttons
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const visitId = this.getAttribute('data-visit-id');
            openModal(visitId);
        });
    });
    
    // Close modal when clicking X
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
      if(event.target === modal){
        modal.style.display = 'none';
      }
    });
      // Close dialog with Escape key
      document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.style.display === 'block') {
        modal.style.display = 'none';
      }
    });

 // Function to open modal with details
function openModal(visitId) {
    fetch(`/api/visitor-details/${visitId}`)
        .then(async response => {
            const data = await response.json();
            const visit= data.data;
            const modalContent = document.getElementById('modalContent');
            modalContent.innerHTML = `
                <div class="detail-row">
                    <div class="detail-label">Date Visited:</div>
                    <div class="detail-value">${new Date(visit.created_at).toLocaleDateString([],{ weekday: 'short', month: 'numeric', day: 'numeric', year: 'numeric'})}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Check In:</div>
                    <div class="detail-value">${new Date(visit.check_in).toLocaleTimeString([],{ hour: 'numeric', minute: '2-digit', hour12: true})}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Check Out:</div>
                    <div class="detail-value">${new Date(visit.check_out).toLocaleTimeString([],{ hour: 'numeric', minute: '2-digit', hour12: true})}</div>
                </div>
                                <div class="detail-row">
                    <div class="detail-label">Tag No:</div>
                    <div class="detail-value">${visit.tag_no}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Purpose Visit:</div>
                    <div class="detail-value">${toProperCase(visit.purpose_of_visit)}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Destination:</div>
                    <div class="detail-value">${toProperCase(visit.department)}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Person to see:</div>
                    <div class="detail-value">${toProperCase(visit.person_to_see)}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Had Appointment:</div>
                    <div class="detail-value">${visit.has_appointment?"Yes":"No"}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Other Destination:</div>
                    <div class="detail-value">${toProperCase(visit.other_destinations)}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Dependants:</div>
                    <div class="detail-value">${visit.dependants}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Remarks:</div>
                    <div class="detail-value">${visit.remark}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Checked in by:</div>
                    <div class="detail-value">${visit.user_admin_id}</div>
                </div>
            `;
                modal.style.display = 'block';
        });
}

}