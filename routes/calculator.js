const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

function parseNumbers(numsStr) {
    let nums = numsStr.split(',').map(n => {
        let num = Number(n);
        if (isNaN(num)) {
            throw new Error(`${n} is not a number.`);
        }
        return num;
    });
    return nums;
}

function calculateMean(nums) {
    return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function calculateMedian(nums) {
    nums.sort((a, b) => a - b);
    let mid = Math.floor(nums.length / 2);
    return nums.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
}

function calculateMode(nums) {
    let freqMap = {};
    nums.forEach(n => (freqMap[n] = (freqMap[n] || 0) + 1));
    let maxCount = Math.max(...Object.values(freqMap));
    let modes = Object.keys(freqMap).filter(k => freqMap[k] === maxCount);
    return modes.length === 1 ? Number(modes[0]) : modes.map(Number);
}

router.get('/', (req, res, next) => {
    const numsStr = req.query.nums;
    if (!numsStr) {
        return res.status(400).json({ error: 'nums are required.' });
    }

    try {
        let nums = parseNumbers(numsStr);
        let operation = req.baseUrl.split('/').pop();
        let result;

        if (operation === 'mean') {
            result = calculateMean(nums);
        } else if (operation === 'median') {
            result = calculateMedian(nums);
        } else if (operation === 'mode') {
            result = calculateMode(nums);
        }

        return res.json({ operation, value: result });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
});

router.get('/all', (req, res, next) => {
    const numsStr = req.query.nums;
    const save = req.query.save === 'true';

    if (!numsStr) {
        return res.status(400).json({ error: 'nums are required.' });
    }

    try {
        let nums = parseNumbers(numsStr);
        let mean = calculateMean(nums);
        let median = calculateMedian(nums);
        let mode = calculateMode(nums);

        let response = { operation: 'all', mean, median, mode };

        if (save) {
            let timestamp = new Date().toISOString();
            let dataToSave = { ...response, timestamp };
            fs.writeFileSync(path.join(__dirname, '../results.json'), JSON.stringify(dataToSave, null, 2));
        }

        return res.json(response);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
});

module.exports = router;
