export function ShowVerificationCode(){
    const buttons = document.querySelectorAll('.btn[data-row]');
  
  function toggleCodeVisibility(button) {
    const row = button.closest('tr');
    const codeSpan = row.querySelector('span[data-row]');
    
    if (!codeSpan) return;
    
    const actualCode = codeSpan.dataset.row;
    const isMasked = codeSpan.textContent.includes('*');
    
    codeSpan.textContent = isMasked ? actualCode : actualCode.toString().replace(/./g, '*');
    button.innerHTML = isMasked 
      ? '<i class="fas fa-eye"></i>' 
      : '<i class="fas fa-eye-slash"></i>';
  }

  buttons.forEach(button => {
    button.addEventListener('click', () => toggleCodeVisibility(button));
  });
}