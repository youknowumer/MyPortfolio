#!/usr/bin/env node
/* Data & asset integrity check — fails CI if the structured data and the page drift apart. */
import { readFileSync, existsSync } from 'node:fs';
import vm from 'node:vm';
const root = new URL('..', import.meta.url).pathname;
const html = readFileSync(root + 'index.html', 'utf8');
const ctx = { window: {} }; vm.runInNewContext(readFileSync(root + 'js/data.js', 'utf8'), ctx);
const D = ctx.window.PORTFOLIO, errs = [];
const ok = (c, m) => { if (!c) errs.push(m); };
const count = re => (html.match(re) || []).length;

ok(D.experience.length === count(/class="exp-card"/g), 'experience count differs from index.html');
ok(D.certifications.length === count(/class="cert-card[ "]/g), 'certification count differs from index.html');
D.experience.forEach(e => {
  ok(e.company && e.role, `experience missing company/role: ${JSON.stringify(e.company)}`);
  ok(/^\d{4}-\d{2}$/.test(e.start || ''), `bad start date for ${e.company}`);
  ok(e.current || /^\d{4}-\d{2}$/.test(e.end || ''), `bad end date for ${e.company}`);
  ok(e.current || e.end >= e.start, `end before start for ${e.company}`);
  ok(e.highlights.length > 0, `no highlights for ${e.company}`);
});
D.certifications.forEach(c => {
  ok(c.name && c.provider, `cert missing name/provider: ${c.name}`);
  ok(/^\d{4}-\d{2}$/.test(c.issued || ''), `cert "${c.name}" has no parseable date`);
  ok(['tech', 'design', 'erp', 'mgmt'].includes(c.category), `cert "${c.name}" has unknown category`);
});
Object.entries(D.skills).forEach(([d, list]) => list.forEach(s => ok(s.score > 0 && s.score <= 100, `skill ${d}/${s.name} score out of range`)));
for (const f of html.match(/(?:src|href)="(?!https?:|#|mailto:|tel:|data:)[^"]+"/g) || []) {
  const p = f.replace(/^(src|href)="/, '').replace(/["#?].*$/, '');
  if (p && !existsSync(root + p)) errs.push('missing local asset: ' + p);
}
if (errs.length) { console.error('✗ ' + errs.length + ' problem(s):\n - ' + errs.join('\n - ')); process.exit(1); }
console.log(`✓ data valid — ${D.experience.length} roles, ${D.certifications.length} certs, ${Object.values(D.skills).flat().length} skills, assets resolve`);
