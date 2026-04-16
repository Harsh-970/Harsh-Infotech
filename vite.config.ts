import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { promises as fs } from 'fs';
import path from 'path';
import { defineConfig, loadEnv, type Plugin } from 'vite';

const AUTH_LOG_FILE = path.resolve(__dirname, 'data', 'login_information.csv');

const sanitizeCsv = (value: string) => `"${value.replace(/"/g, '""').replace(/\r?\n/g, ' ').trim()}"`;

const parseCsvLine = (line: string) => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];

    if (char === '"') {
      const nextChar = line[index + 1];
      if (inQuotes && nextChar === '"') {
        current += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
      continue;
    }

    current += char;
  }

  result.push(current);
  return result.map((value) => value.trim());
};

type AuthLogRecord = {
  email: string;
  companyName: string;
  jobRole: string;
  loginMethod: string;
};

const authLogPlugin = (): Plugin => ({
  name: 'auth-log-plugin',
  configureServer(server) {
    server.middlewares.use('/api/auth-log', (req, res, next) => {
      if (req.method !== 'POST') {
        next();
        return;
      }

      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });

      req.on('end', async () => {
        try {
          const parsed = JSON.parse(body) as { email?: string; companyName?: string; jobRole?: string; loginMethod?: string; };
          const email = typeof parsed.email === 'string' ? parsed.email.trim() : '';
          const companyName = typeof parsed.companyName === 'string' ? parsed.companyName.trim() : '';
          const jobRole = typeof parsed.jobRole === 'string' ? parsed.jobRole.trim() : '';
          const loginMethod = typeof parsed.loginMethod === 'string' ? parsed.loginMethod.trim() : '';

          if (!email || !companyName || !loginMethod) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok: false, message: 'Invalid auth record payload.' }));
            return;
          }

          await fs.mkdir(path.dirname(AUTH_LOG_FILE), { recursive: true });

          try {
            await fs.access(AUTH_LOG_FILE);
          } catch {
            await fs.writeFile(AUTH_LOG_FILE, 'email,company_name,job_role,login_method\n', 'utf8');
          }

          const existing = await fs.readFile(AUTH_LOG_FILE, 'utf8');
          const lines = existing.split(/\r?\n/).filter((line) => line.trim().length > 0);
          const header = lines[0] ?? 'email,company_name,job_role,login_method';

          const records: AuthLogRecord[] = lines.slice(1).map((line) => {
            const columns = parseCsvLine(line);
            return {
              email: columns[0] ?? '',
              companyName: columns[1] ?? '',
              jobRole: columns[2] ?? '',
              loginMethod: columns[3] ?? '',
            };
          });

          const normalizedEmail = email.toLowerCase();
          const index = records.findIndex((record) => record.email.toLowerCase() === normalizedEmail);
          const nextRecord: AuthLogRecord = { email, companyName, jobRole, loginMethod };

          if (index >= 0) {
            records[index] = nextRecord;
          } else {
            records.push(nextRecord);
          }

          const serializedRecords = records.map((record) => (
            `${sanitizeCsv(record.email)},${sanitizeCsv(record.companyName)},${sanitizeCsv(record.jobRole)},${sanitizeCsv(record.loginMethod)}`
          ));

          await fs.writeFile(AUTH_LOG_FILE, `${header}\n${serializedRecords.join('\n')}\n`, 'utf8');

          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ ok: true }));
        } catch {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ ok: false, message: 'Unable to write auth record.' }));
        }
      });
    });
  },
});

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss(), authLogPlugin()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          about: path.resolve(__dirname, 'about.html'),
          services: path.resolve(__dirname, 'services.html'),
          moreServices: path.resolve(__dirname, 'more-services.html'),
          products: path.resolve(__dirname, 'products.html')
        }
      }
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
