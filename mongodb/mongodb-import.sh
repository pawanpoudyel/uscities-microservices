npm install mongodb csv-parse yargs
node mongodb-import.js --mongourl "mongodb+srv://pawan:Password123@messengerdb.mkvqoiw.mongodb.net/?appName=MessengerDB" \
--database uscities-microservices --collection uscities --file uscities.csv --format csv
