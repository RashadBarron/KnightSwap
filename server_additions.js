const favoriteRoutes = require("./routes/favorites");
const categoryRoutes = require("./routes/categories");

app.use("/api/favorites", favoriteRoutes);
app.use("/api/categories", categoryRoutes);
