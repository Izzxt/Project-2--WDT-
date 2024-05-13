const form = document.getElementById('contact-us__form');
const fields = {
  name: document.getElementById('name'),
  email: document.getElementById('email'),
  message: document.getElementById('message')
};
const errorMessages = document.getElementsByClassName('error-message');

function handleField(field, index) {
  const formData = new FormData(form);
  const value = formData.get(field);

  if (!value) {
    fields[field].classList.add('shake');
    errorMessages[index].style.display = 'block';
    errorMessages[index].classList.add('slideIn');
  } else {
    fields[field].classList.remove('shake');
    errorMessages[index].style.display = 'none';
    errorMessages[index].classList.remove('slideIn');
  }
}

function validateForm() {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    Object.keys(fields).forEach((field, index) => {
      handleField(field, index);
    });

    setTimeout(() => {
      Object.values(fields).forEach(field => field.classList.remove('shake'));
    }, 1000);

  });
}

validateForm();