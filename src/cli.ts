#!/usr/bin/env node

import { createInterface } from 'readline';
import { existsSync, readFileSync, writeFileSync, appendFileSync } from 'fs';

const SIGNUP_URL = 'https://app.posteverywhere.ai/signup';
const DEVELOPERS_URL = 'https://app.posteverywhere.ai/developers';
const API_URL = 'https://app.posteverywhere.ai/api/v1/accounts';

function print(msg: string) { process.stdout.write(msg + '\n'); }

function prompt(question: string): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => {
    rl.question(question, answer => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function openBrowser(url: string) {
  const { platform } = process;
  try {
    const { exec } = await import('child_process');
    const cmd = platform === 'darwin' ? 'open' : platform === 'win32' ? 'start' : 'xdg-open';
    exec(`${cmd} ${url}`);
  } catch {
    // Silent fail — user can copy the URL manually
  }
}

async function verifyKey(apiKey: string): Promise<{ valid: boolean; accounts?: number }> {
  try {
    const res = await fetch(API_URL, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'User-Agent': 'posteverywhere-cli/1.0.0',
      },
      signal: AbortSignal.timeout(10000),
    });
    if (res.ok) {
      const data = await res.json();
      return { valid: true, accounts: data.data?.accounts?.length || 0 };
    }
    return { valid: false };
  } catch {
    return { valid: false };
  }
}

async function main() {
  const command = process.argv[2];

  if (command !== 'init') {
    print('');
    print('PostEverywhere CLI');
    print('');
    print('Usage:');
    print('  npx posteverywhere init    Set up your API key');
    print('');
    print('Links:');
    print('  Dashboard:     https://app.posteverywhere.ai');
    print('  API Reference: https://developers.posteverywhere.ai');
    print('  Docs:          https://posteverywhere.ai/docs');
    print('  Sign up:       https://app.posteverywhere.ai/signup');
    print('');
    return;
  }

  print('');
  print('Welcome to PostEverywhere');
  print('');
  print('Schedule and publish to all social media platforms from code.');
  print('');

  // Step 1: Get API key
  print('Step 1: Get your API key');
  print('');

  const hasAccount = await prompt('Do you have a PostEverywhere account? (y/n): ');

  if (hasAccount.toLowerCase() !== 'y') {
    print('');
    print('Opening signup page — 7-day free trial on all plans.');
    print(`  ${SIGNUP_URL}`);
    print('');
    await openBrowser(SIGNUP_URL);
    print('After signing up, connect your social accounts in the dashboard,');
    print('then go to Settings → Developers to create an API key.');
    print('');
    await prompt('Press Enter when you have your API key...');
  }

  print('');
  print('Opening developers page...');
  print(`  ${DEVELOPERS_URL}`);
  await openBrowser(DEVELOPERS_URL);
  print('');

  const apiKey = await prompt('Paste your API key (pe_live_...): ');

  if (!apiKey.startsWith('pe_live_')) {
    print('');
    print('Invalid API key format. Keys start with "pe_live_".');
    print(`Get one at: ${DEVELOPERS_URL}`);
    process.exit(1);
  }

  // Step 2: Verify
  print('');
  print('Verifying...');

  const result = await verifyKey(apiKey);

  if (!result.valid) {
    print('');
    print('API key verification failed. Check that the key is correct and not revoked.');
    print(`Manage keys at: ${DEVELOPERS_URL}`);
    process.exit(1);
  }

  print(`Connected! ${result.accounts} social account${result.accounts === 1 ? '' : 's'} found.`);

  // Step 3: Save to .env
  print('');
  const shouldSave = await prompt('Save API key to .env file? (y/n): ');

  if (shouldSave.toLowerCase() === 'y') {
    const envLine = `POSTEVERYWHERE_API_KEY=${apiKey}`;

    if (existsSync('.env')) {
      const existing = readFileSync('.env', 'utf-8');
      if (existing.includes('POSTEVERYWHERE_API_KEY')) {
        const updated = existing.replace(/POSTEVERYWHERE_API_KEY=.*/g, envLine);
        writeFileSync('.env', updated);
        print('Updated POSTEVERYWHERE_API_KEY in .env');
      } else {
        appendFileSync('.env', `\n${envLine}\n`);
        print('Added POSTEVERYWHERE_API_KEY to .env');
      }
    } else {
      writeFileSync('.env', `${envLine}\n`);
      print('Created .env with POSTEVERYWHERE_API_KEY');
    }

    // Check .gitignore
    if (existsSync('.gitignore')) {
      const gitignore = readFileSync('.gitignore', 'utf-8');
      if (!gitignore.includes('.env')) {
        print('');
        print('⚠️  Make sure .env is in your .gitignore to keep your key safe!');
      }
    } else {
      print('');
      print('⚠️  No .gitignore found. Create one with ".env" to keep your key safe!');
    }
  }

  // Done
  print('');
  print('You\'re all set! Here\'s a quick example:');
  print('');
  print('  import PostEverywhere from \'posteverywhere\';');
  print('');
  print('  const client = new PostEverywhere({');
  print('    apiKey: process.env.POSTEVERYWHERE_API_KEY,');
  print('  });');
  print('');
  print('  const { accounts } = await client.accounts.list();');
  print('  console.log(accounts);');
  print('');
}

main().catch(err => {
  print(`Error: ${err.message}`);
  process.exit(1);
});
