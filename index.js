const express = require('express');
const app = express();
const calculatorRoutes = require('./routes/calculator');

app.use(express.json());
app.use('/mean', calculatorRoutes);
app.use('/median', calculatorRoutes);
app.use('/mode', calculatorRoutes);
app.use('/all', calculatorRoutes);

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ error: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
