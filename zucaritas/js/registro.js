document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    const childrenInput = document.getElementById('children');
    const childrenAgesDiv = document.getElementById('childrenAges');
    const childrenAgesInputs = document.getElementById('childrenAgesInputs');

    // Handle children ages inputs
    childrenInput.addEventListener('change', function() {
        const numberOfChildren = parseInt(this.value) || 0;
        
        if (numberOfChildren > 0) {
            childrenAgesDiv.classList.remove('d-none');
            childrenAgesInputs.innerHTML = '';
            
            for (let i = 0; i < numberOfChildren; i++) {
                const div = document.createElement('div');
                div.className = 'mb-3';
                div.innerHTML = `
                    <label class="form-label">Hijo ${i + 1}</label>
                    <input type="number" class="form-control" name="childAge${i}" required min="0" max="17">
                `;
                childrenAgesInputs.appendChild(div);
            }
        } else {
            childrenAgesDiv.classList.add('d-none');
            childrenAgesInputs.innerHTML = '';
        }
    });

    // Form validation
    form.addEventListener('submit', function(event) {
        if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            // Store user data in localStorage
            const userData = {
                fullName: document.getElementById('fullName').value,
                email: document.getElementById('email').value,
                department: document.getElementById('department').value,
                age: document.getElementById('age').value,
                children: document.getElementById('children').value,
                childrenAges: Array.from(childrenAgesInputs.querySelectorAll('input')).map(input => input.value)
            };
            localStorage.setItem('userData', JSON.stringify(userData));
        }

        form.classList.add('was-validated');
    });
});
