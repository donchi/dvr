import toProperCase from "../utilities/word_formatting.js";

// Handle image upload and preview
const photoUpload = document.getElementById('photoUpload');
const uploadBox = document.getElementById('uploadBox');
const uploadedPreview = document.getElementById('uploadedPreview');
const previewImage = document.getElementById('previewImage');
const clearUpload = document.getElementById('clearUpload');
const searchBtn = document.getElementById('searchBtn');
const resultsSection = document.getElementById('resultsSection');
const noResults = document.getElementById('noResults');

// Drag and drop functionality
uploadBox.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadBox.classList.add('dragover');
});

uploadBox.addEventListener('dragleave', () => {
    uploadBox.classList.remove('dragover');
});

uploadBox.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadBox.classList.remove('dragover');
    if (e.dataTransfer.files.length) {
        handleImageUpload(e.dataTransfer.files[0]);
    }
});

photoUpload.addEventListener('change', (e) => {
    if (e.target.files.length) {
        handleImageUpload(e.target.files[0]);
    }
});

function handleImageUpload(file) {
    if (file.type.match('image.*')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImage.src = e.target.result;
            uploadBox.style.display = 'none';
            uploadedPreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else {
        alert('Please upload an image file.');
    }
}

clearUpload.addEventListener('click', () => {
    photoUpload.value = '';
    uploadBox.style.display = 'flex';
    uploadedPreview.style.display = 'none';
    resultsSection.style.display = 'none';
    noResults.style.display = 'none';
});

searchBtn.addEventListener('click', async () => {
    const file = photoUpload.files[0];
    if (!file) {
        alert('Please upload an image first.');
        return;
    }

    searchBtn.disabled = true;
    searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Searching...';
    let htmlContent ='';

    const formData = new FormData();
    formData.append('photo', file);

    try {
        const response = await fetch('/api/recognize-face', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();

        // In your frontend success handler
        if (data.match) {
            data.matches.forEach((match, index) => {
                console.log(`Match ${index + 1}:`);
                console.log(`Confidence: ${Math.round(match.confidence * 100)}%`);
                console.log('match: ', match)
                // Append to the string instead of overwriting
                htmlContent += `
                    <div class="visitor-match">
                        <span>Match ${index + 1}: </span>
                        <div class="visitor-avatar ai_large">
                            <img src="../images/visitors/${match.visitors?.photo}" alt="Matched visitor">
                        </div>
                        <div class="visitor-info">
                            <h4>${toProperCase(match.visitors?.first_name)} ${toProperCase(match.visitors?.last_name)}<span class="confidence-badge">${Math.round(match.confidence * 100)}% match</span></h4>
                            <p><i class="fas fa-phone"></i> ${match.visitors?.phone_number}</p>
                            <p><a href="/admin/visitor_info?id=${match.visitors?.id}" target="_blank">View Visitor Info</a></p>
                        </div>
                    </div>    
                `;
            });
        } 
        else {
            resultsSection.style.display = 'none';
            noResults.style.display = 'block';
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Recognition failed. Please try again.");
    } finally {
        searchBtn.disabled = false;
        searchBtn.innerHTML = '<i class="fas fa-search"></i> Search Database';
        // Set the innerHTML once after the loop
        document.getElementById('match-result').innerHTML = htmlContent;
    }
});