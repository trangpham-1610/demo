import http from 'k6/http';
import { check} from 'k6';

export let options = {
    vus: 5, 
    duration: '3m', 
};

const registerUrl = 'https://test-api.k6.io/user/register/'; // URL Register
const loginUrl = 'https://test-api.k6.io/auth/token/login/'; // URL Login
const createCrocodileUrl = 'https://test-api.k6.io/my/crocodiles/'; // URL create Crocodile
const deleteCrocodileUrl = 'https://test-api.k6.io/my/crocodiles/{id}'; // URL delete Crocodile

export default function () {
//   Step 1: Register 1 account
    const payload = JSON.stringify({
        username: "trangptt",
        firstname: "Trang",
        lastname: "Pham",
        email: "trangptt@yopmail.com",
        password: "Trang@12345",
        
    });

    const headers = {
        'Content-Type': 'application/json',
    };

    const response = http.post(registerUrl, payload, { headers: headers });

    // Check response
    check(response, {
        'status is 201': (r) => r.status === 200, 
        'response time is < 200ms': (r) => r.timings.duration < 200,
    })
//   Step 2: Login bằng account vừa tạo
const loginPayload = JSON.stringify({
    username: 'trangptt',
    password: 'Trang@12345',
});

const loginHeaders = {
    'Content-Type': 'application/json',
};

const loginResponse = http.post(loginUrl, loginPayload, { headers: loginHeaders });

// Check response
check(loginResponse, {
    'login status is 200': (r) => r.status === 200, 
})

// Lấy token từ phản hồi đăng nhập
const token = loginResponse.json().access;

// Step 3: Create a new crocodile
const createCrocodilePayload = JSON.stringify({
    name: 'test',
    size: 'S'
});

const createCrocodileHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`, 
};

const createCrocodileResponse = http.post(createCrocodileUrl, createCrocodilePayload, { headers: createCrocodileHeaders });

// check response
check(createCrocodileResponse, {
    'create crocodile status is 200': (r) => r.status === 200,
});

// Get id
const crocodileId = createCrocodileResponse.json().id;

//Step 4: Remove your crocodile.
const deleteCrocodileResponse = http.del(`${deleteCrocodileUrl}${crocodileId}/`, null, { headers: createCrocodileHeaders });

// Check response
check(deleteCrocodileResponse, {
    'delete crocodile status is 200': (r) => r.status === 200, 
});
}
