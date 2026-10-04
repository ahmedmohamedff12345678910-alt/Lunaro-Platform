import { app } from "./app.js"; import { env } from "./config/env.js"; import { connectDatabase,disconnectDatabase } from "./config/db.js";
async function start(){await connectDatabase();const server=app.listen(env.PORT,()=>console.log(`Lunaro API listening on ${env.PORT}`));const shutdown=async()=>{server.close(async()=>{await disconnectDatabase();process.exit(0);});};process.on("SIGINT",shutdown);process.on("SIGTERM",shutdown);}
start().catch(error=>{console.error("Failed to start Lunaro API",error);process.exit(1)});
