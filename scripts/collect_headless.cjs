const fs = require('fs');
const playwright = require('playwright');
(async () => {
  const url = process.argv[2] || 'https://stumarto-web-production.up.railway.app/';
  const outJson = 'headless-logs.json';
  const outScreenshot = 'headless-screenshot.png';
  const logs = [];
  const browser = await playwright.chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', msg => {
    try { logs.push({type: 'console', level: msg.type(), text: msg.text(), location: msg.location()}); } catch(e){}
  });
  page.on('pageerror', err => logs.push({type: 'pageerror', message: err.message, stack: err.stack}));
  page.on('requestfailed', req => logs.push({type: 'requestfailed', url: req.url(), failure: req.failure() && req.failure().errorText}));
  page.on('response', resp => {
    try { logs.push({type: 'response', url: resp.url(), status: resp.status()}); } catch(e){}
  });

  try {
    // Go to login route directly to exercise login flow
    const loginUrl = url.replace(/\/$/, '') + '#/login';
    await page.goto(loginUrl, { waitUntil: 'networkidle', timeout: 30000 });
    // Try to fill and submit login form with demo admin creds
    try {
      // Select inputs by type since there are no name attributes
      await page.fill('form input[type="email"]', 'admin@stumarto.com');
      await page.fill('form input[type="password"]', 'admin123');
      // capture network events for the login POST
      const reqs = [];
      page.on('request', r => { if (r.method() === 'POST' && r.url().includes('/api/auth/login')) reqs.push({url: r.url(), postData: r.postData()}); });
      page.on('response', async resp => { if (resp.request().method() === 'POST' && resp.request().url().includes('/api/auth/login')) { logs.push({type:'login-response', url: resp.url(), status: resp.status(), body: await resp.text()}); }});
      const [dialog] = await Promise.all([
        page.waitForEvent('dialog').catch(()=>null),
        page.click('button:has-text("Sign In")').catch(()=>page.click('button:has-text("SIGN IN")'))
      ]);
      if (dialog) logs.push({type:'dialog', message: dialog.message()});
    } catch (formErr) {
      logs.push({type: 'form-error', message: String(formErr)});
    }
  } catch (e) {
    logs.push({type: 'goto-error', message: e.message});
  }

  try {
    await page.screenshot({ path: outScreenshot, fullPage: true });
  } catch (e) { logs.push({type: 'screenshot-error', message: e.message}); }

  fs.writeFileSync(outJson, JSON.stringify(logs, null, 2));
  await browser.close();
  console.log('Headless capture complete —', outJson, outScreenshot);
})();
