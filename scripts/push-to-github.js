/**
 * Push to GitHub Script
 * Repository: https://github.com/piyushsalunkhe06-code/WTL-Project-TY.git
 */

const git = require('isomorphic-git');
const http = require('isomorphic-git/http/node');
const fs = require('fs');
const path = require('path');

async function push() {
  const token = process.env.GITHUB_TOKEN || process.argv[2];
  
  if (!token) {
    console.error('ERROR: No GitHub token provided.');
    console.log('Usage: node scripts/push-to-github.js <YOUR_GITHUB_PERSONAL_ACCESS_TOKEN>');
    console.log('Or set the GITHUB_TOKEN environment variable.');
    process.exit(1);
  }

  const dir = path.resolve(__dirname, '..');
  console.log('Repository Directory:', dir);
  console.log('Target Remote: https://github.com/piyushsalunkhe06-code/WTL-Project-TY.git');
  console.log('Branch: main');
  console.log('Authenticating with GitHub...');

  try {
    const pushResult = await git.push({
      fs,
      http,
      dir,
      remote: 'origin',
      ref: 'main',
      force: true,
      onAuth: () => ({
        username: token.startsWith('ghp_') || token.startsWith('github_pat_') ? 'token' : 'piyushsalunkhe06-code',
        password: token
      }),
      onProgress: (progress) => {
        if (progress.total) {
          const pct = Math.round((progress.loaded / progress.total) * 100);
          console.log(`[${progress.phase}] ${pct}% (${progress.loaded}/${progress.total})`);
        } else {
          console.log(`[${progress.phase}] ${progress.loaded}`);
        }
      }
    });

    console.log('Push succeeded!');
    console.log('Remote response:', JSON.stringify(pushResult, null, 2));
    console.log('View repository: https://github.com/piyushsalunkhe06-code/WTL-Project-TY');
  } catch (err) {
    console.error('Push failed with error:', err.message);
    if (err.data && err.data.response) {
      console.error('Server response:', err.data.response);
    }
    process.exit(1);
  }
}

push();
