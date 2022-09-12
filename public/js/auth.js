const miFormulario = document.querySelector('form');

var url = ( window.location.hostname.includes('localhost') )
                    ? 'http://localhost:3000/api/auth/'
                    : 'https://restserver-edgar.herokuapp.com/api/auth/';

miFormulario.addEventListener('submit', ev => {
    ev.preventDefault();
    const formData = {};

    for(let el of miFormulario.elements) {
        if (el.name.length > 0)
            formData[el.name] = el.value;
    }

    //console.log(formData);
    fetch(url + 'login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(resp => resp.json())
    .then(({msg, token}) => {
        if (msg) {
            return console.error(msg);
        }

        localStorage.setItem('token', token);
        window.location = 'chat.html';
    })
    .catch(console.log);

});

// Funcionamiento anterior de google api authentication
function handleCredentialResponse(response) {
    
    // Google Token: ID_TOKEN
    //console.log('id_token', response.credential);

    const body = {id_token: response.credential};
    
    fetch(url + 'google', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
    .then(resp => resp.json())
    .then(({msg, token}) => {
        if (msg) {
            return console.error(msg);
        }

        localStorage.setItem('token', token);
        window.location = 'chat.html';
    })
    .catch(console.log);
}

const button = document.getElementById('g_id_signout');
button.onclick = async() => {
    console.log(google.accounts.id);
    google.accounts.id.disableAutoSelect();

    google.accounts.id.revoke(localStorage.getItem('email'), done => {
        localStorage.clear();
        location.reload();
    });
}