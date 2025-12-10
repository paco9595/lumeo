import { Client } from "pg";
import fs from "fs";

const client = new Client({
  connectionString: "postgresql://postgres:Pacoeselrey9!!@db.fmjxrdhqiklcgglddpme.supabase.co:5432/postgres"
});

await client.connect();

// Traer todas las tablas y sus columnas
const resTables = await client.query(`
  SELECT table_name
  FROM information_schema.tables
  WHERE table_schema = 'public';
`);

let sqlDump = "";

for (const row of resTables.rows) {
  const tableName = row.table_name;

  const resColumns = await client.query(`
    SELECT column_name, data_type, is_nullable, column_default
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = $1;
  `, [tableName]);

  sqlDump += `-- Table: ${tableName}\n`;
  sqlDump += `CREATE TABLE ${tableName} (\n`;
  sqlDump += resColumns.rows.map(col =>
    `  ${col.column_name} ${col.data_type.toUpperCase()} ${col.is_nullable === 'NO' ? 'NOT NULL' : ''} ${col.column_default ? 'DEFAULT ' + col.column_default : ''}`
  ).join(",\n");
  sqlDump += `\n);\n\n`;
}

fs.writeFileSync("public_schema.sql", sqlDump);

console.log("Schema exportado a public_schema.sql");

await client.end();