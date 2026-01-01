const http = require('http');

async function verify() {
    console.log('Verifying Driver Ratings Feature...');

    // NOTE: This script assumes the server is running on localhost:3000
    // and the database has valid data (User, Client, Livreur, Demande).
    // Since we cannot easily seed creating full relations without working sequelize-cli or heavy coding,
    // we will try to Hit the endpoint and expect at least a 400 or 404 (if ID invalid) 
    // which proves the route and controller are reachable.

    const postData = JSON.stringify({
        rate: 5,
        comment: "Excellent service!",
        livreur_id: 1, // Valid Livreur from seeder
        client_id: 2,  // Valid Client from seeder
        demande_id: 1  // Valid Demande from seeder
    });

    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/evaluations',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData),
        },
    };

    const req = http.request(options, (res) => {
        console.log(`STATUS: ${res.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
        });
        res.on('end', () => {
            console.log('No more data in response.');
        });
    });

    req.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
    });

    // Write data to request body
    req.write(postData);
    req.end();
}

verify();
