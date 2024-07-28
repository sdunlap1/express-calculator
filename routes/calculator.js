const express = require('express');
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

module.exports = router;
