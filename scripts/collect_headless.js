const fs = require('fs');
const { chromium } = require('playwright');
(async () => {
  const url = 'https://stumarto-web-production.up.railway.app/';
  const outJson = 'headless-logs.json';
  const outScreenshot = 'headless-screenshot.png';
  const logs = [];
  const browser = await chromium.launch();
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
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
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
