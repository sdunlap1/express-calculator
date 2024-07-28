const request = require('supertest');
const express = require('express');
const calculatorRoutes = require('../routes/calculator');

const app = express();
app.use(express.json());
app.use('/mean', calculatorRoutes);
app.use('/median', calculatorRoutes);
app.use('/mode', calculatorRoutes);

describe('Calculator Routes', () => {
    test('mean route calculates mean', async () => {
        const response = await request(app).get('/mean?nums=1,2,3,4');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ operation: 'mean', value: 2.5 });
    });

    test('median route calculates median', async () => {
        const response = await request(app).get('/median?nums=1,3,3,6,7,8,9');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ operation: 'median', value: 6 });
    });

    test('mode route calculates mode', async () => {
        const response = await request(app).get('/mode?nums=1,2,2,3,3,3,4');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ operation: 'mode', value: 3 });
    });

    test('handles NaN error', async () => {
        const response = await request(app).get('/mean?nums=1,2,foo,4');
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'foo is not a number.' });
    });

    test('handles empty input error', async () => {
        const response = await request(app).get('/mean');
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'nums are required.' });
    });
});
