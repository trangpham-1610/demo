import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Trend, Counter } from 'k6/metrics';

// Khai báo các metric
let responseTimeTrend = new Trend('response_time_trend');
let userCreationCount = new Counter('user_creation_count');
let userUpdateCount = new Counter('user_update_count');
let userDeletionCount = new Counter('user_deletion_count');
let successfulRequestsRate = new Counter('successful_requests_rate');

export let options = {
    vus: 10, 
    duration: '30s', 
};

export default function () {
    const token = 'b5a0d135d0bc38242fcf2c8fbdf73356a40b67f294d06e8b5b64f260adbb0adc'; 

//List User   
    group('List Users', function () {
        let res = http.get('https://gorest.co.in/public/v2/users', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        // Ghi nhận thời gian phản hồi
        responseTimeTrend.add(res.timings.duration);
        
        // Kiểm tra phản hồi
        check(res, {
            'status is 200': (r) => r.status === 200,
        });

        // Ghi nhận tỷ lệ thành công
        if (res.status === 200) {
            successfulRequestsRate.add(1);
        }
    });

//Create User
    group('Create User', function () {
        let payload = JSON.stringify({
            name: "Trang Pham",
            gender: "female",
            email: "trangpham@yopmail.com",
            status: "active"
        });

        let res = http.post('https://gorest.co.in/public/v2/users', payload, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        // Ghi nhận thời gian phản hồi
        responseTimeTrend.add(res.timings.duration);

        // Kiểm tra phản hồi
        check(res, {
            'status is 200': (r) => r.status === 200,
        });

        // Ghi nhận số lượng người dùng đã tạo
        if (res.status === 200) {
            userCreationCount.add(1);
            successfulRequestsRate.add(1);
        }
    });

//Update User
    group('Update User', function () {
        let userId = '7447657'; 
        let payload = JSON.stringify({
            name: "Agasti Singh update",
            email: "singh_agasti1@bins.test",
            gender: "female",
            status: "active"
        });

        let res = http.patch(`https://gorest.co.in/public/v2/users/${userId}`, payload, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        // Ghi nhận thời gian phản hồi
        responseTimeTrend.add(res.timings.duration);

        // Kiểm tra phản hồi
        check(res, {
            'status is 200': (r) => r.status === 200,
        });

        // Ghi nhận số lượng người dùng đã cập nhật
        if (res.status === 200) {
            userUpdateCount.add(1);
            successfulRequestsRate.add(1);
        }
    });

//Delete User
    group('Delete User', function () {
        let userId = '7447656'; 

        let res = http.del(`https://gorest.co.in/public/v2/users/${userId}`, null, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        // Ghi nhận thời gian phản hồi
        responseTimeTrend.add(res.timings.duration);

        // Kiểm tra phản hồi
        check(res, {
            'status is 200': (r) => r.status === 200,
        });

        // Ghi nhận số lượng người dùng đã xóa
        if (res.status === 200) {
            userDeletionCount.add(1);
            successfulRequestsRate.add(1);
        }
    });  
}
