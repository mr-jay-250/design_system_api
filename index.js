const express = require("express");
const cors = require("cors");
const routes = require("./routes/routes");

const app = express();
app.use(express.json());
app.use(cors());
app.use("/", routes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
