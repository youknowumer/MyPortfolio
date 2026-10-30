import sys, os
from xml.sax.saxutils import escape
OUT = sys.argv[1]
os.makedirs(OUT, exist_ok=True)

FONT = "-apple-system,BlinkMacSystemFont,'SF Pro Display','Segoe UI',Inter,'Helvetica Neue',Arial,sans-serif"
MONO = "'SF Mono','JetBrains Mono',Consolas,Menlo,'Courier New',monospace"
GOLD, BLUE, PURPLE, BG = "#FFB84D", "#38BDF8", "#A78BFA", "#070A12"
EASE = "cubic-bezier(.22,.8,.24,1)"

def svg(w, h, body, name, desc, css=""):
    s = f'''<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}" role="img" aria-label="{escape(desc)}">
<title>{escape(desc)}</title>
<style>
text{{font-family:{FONT}}}
.mono{{font-family:{MONO}}}
@keyframes rise{{from{{opacity:0;transform:translateY(22px)}}to{{opacity:1;transform:translateY(0)}}}}
@keyframes fade{{from{{opacity:0}}to{{opacity:1}}}}
@keyframes float{{0%,100%{{transform:translateY(0)}}50%{{transform:translateY(-7px)}}}}
@keyframes pulse{{0%,100%{{opacity:.55;transform:scale(1)}}50%{{opacity:1;transform:scale(1.35)}}}}
@keyframes blink{{0%,45%{{opacity:1}}50%,95%{{opacity:0}}100%{{opacity:1}}}}
{css}
@media (prefers-reduced-motion:reduce){{*{{animation:none!important}}}}
</style>
{body}
</svg>'''
    open(os.path.join(OUT, name), "w", encoding="utf-8").write(s)
    print(name, len(s)//1024, "KB")

def glass_defs(p):
    return f'''
<linearGradient id="{p}gf" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".20"/><stop offset=".5" stop-color="#fff" stop-opacity=".06"/><stop offset="1" stop-color="#fff" stop-opacity=".12"/></linearGradient>
<linearGradient id="{p}gs" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".85"/><stop offset=".35" stop-color="#fff" stop-opacity=".10"/><stop offset=".65" stop-color="#fff" stop-opacity=".05"/><stop offset="1" stop-color="#fff" stop-opacity=".50"/></linearGradient>
<linearGradient id="{p}spec" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".30"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<linearGradient id="{p}sw" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".28"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<linearGradient id="{p}acc" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="{GOLD}"/><stop offset=".55" stop-color="{BLUE}"/><stop offset="1" stop-color="{PURPLE}"/></linearGradient>'''

def orbs(p, blur=70, scale=1.0, op=1.0, w=1200, h=460):
    return f'''<g filter="url(#{p}blur)" opacity="{op}">
<circle class="o1" cx="{w*.2}" cy="{h*.35}" r="{150*scale}" fill="{GOLD}" opacity=".62"/>
<circle class="o2" cx="{w*.78}" cy="{h*.72}" r="{170*scale}" fill="{BLUE}" opacity=".55"/>
<circle class="o3" cx="{w*.52}" cy="{h*.12}" r="{135*scale}" fill="{PURPLE}" opacity=".55"/></g>'''

ORB_CSS = '''
@keyframes d1{0%,100%{transform:translate(0,0)}50%{transform:translate(90px,50px)}}
@keyframes d2{0%,100%{transform:translate(0,0)}50%{transform:translate(-110px,-40px)}}
@keyframes d3{0%,100%{transform:translate(0,0)}50%{transform:translate(60px,70px)}}
.o1{animation:d1 14s ease-in-out infinite}.o2{animation:d2 17s ease-in-out infinite}.o3{animation:d3 19s ease-in-out infinite}
'''

# ───────────────────────── HERO ─────────────────────────
def hero():
    W, H = 1200, 460
    px, py, pw, ph, r = 90, 62, 1020, 336, 46
    body = f'''<defs>{glass_defs("h")}
<filter id="hblur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="70"/></filter>
<filter id="hblur2" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="46"/></filter>
<filter id="hglow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="5"/></filter>
<filter id="hshadow" x="-20%" y="-30%" width="140%" height="170%"><feGaussianBlur stdDeviation="26"/></filter>
<clipPath id="hclip"><rect x="{px}" y="{py}" width="{pw}" height="{ph}" rx="{r}"/></clipPath>
<clipPath id="hbg"><rect width="{W}" height="{H}" rx="34"/></clipPath>
<pattern id="hdots" width="26" height="26" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1.1" fill="#fff" opacity=".10"/></pattern>
<radialGradient id="hvig" cx=".5" cy=".5" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></radialGradient>
<linearGradient id="hname" gradientUnits="userSpaceOnUse" x1="200" y1="0" x2="1000" y2="0">
<stop offset="0" stop-color="#fff"/><stop offset=".35" stop-color="#FFE3B3"/><stop offset=".7" stop-color="#BFE9FF"/><stop offset="1" stop-color="#fff"/>
<animateTransform attributeName="gradientTransform" type="translate" values="-500 0;500 0;-500 0" dur="9s" repeatCount="indefinite" calcMode="spline" keyTimes="0;.5;1" keySplines=".45 0 .55 1;.45 0 .55 1"/></linearGradient>
<radialGradient id="hbub" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff" stop-opacity=".85"/><stop offset=".35" stop-color="#fff" stop-opacity=".12"/><stop offset="1" stop-color="#fff" stop-opacity=".02"/></radialGradient>
</defs>
<g clip-path="url(#hbg)">
<rect width="{W}" height="{H}" fill="{BG}"/>
{orbs("h", 70, 1, 1, W, H)}
<rect width="{W}" height="{H}" fill="url(#hdots)"/>
<rect width="{W}" height="{H}" fill="url(#hvig)"/>
</g>
<rect x="1" y="1" width="{W-2}" height="{H-2}" rx="33" fill="none" stroke="url(#hgs)" stroke-opacity=".5"/>

<g class="panel">
 <rect x="{px+10}" y="{py+34}" width="{pw-20}" height="{ph}" rx="{r}" fill="#000" opacity=".55" filter="url(#hshadow)"/>
 <g clip-path="url(#hclip)">
  <rect x="{px}" y="{py}" width="{pw}" height="{ph}" fill="#0A0F1C"/>
  <g class="refract">{orbs("h", 46, 1.25, 1, W, H).replace('filter="url(#hblur)"','filter="url(#hblur2)"')}</g>
  <rect x="{px}" y="{py}" width="{pw}" height="{ph}" fill="url(#hgf)"/>
  <ellipse cx="{px+pw/2}" cy="{py-70}" rx="{pw*.62}" ry="{ph*.5}" fill="url(#hspec)"/>
  <rect class="sweep" x="-380" y="{py-40}" width="260" height="{ph+80}" fill="url(#hsw)" transform="skewX(-18)"/>
 </g>
 <rect x="{px}" y="{py}" width="{pw}" height="{ph}" rx="{r}" fill="none" stroke="url(#hgs)" stroke-width="1.6"/>
 <rect x="{px+4}" y="{py+4}" width="{pw-8}" height="{ph-8}" rx="{r-4}" fill="none" stroke="#fff" stroke-opacity=".07"/>
 <rect class="orbit" x="{px}" y="{py}" width="{pw}" height="{ph}" rx="{r}" fill="none" stroke="url(#hacc)" stroke-width="3" pathLength="1000" stroke-dasharray="110 890" stroke-linecap="round" filter="url(#hglow)"/>
 <rect class="orbit" x="{px}" y="{py}" width="{pw}" height="{ph}" rx="{r}" fill="none" stroke="#fff" stroke-opacity=".9" stroke-width="1.4" pathLength="1000" stroke-dasharray="70 930" stroke-linecap="round"/>

 <g style="animation:rise 1s {EASE} .15s both">
  <rect x="{W/2-150}" y="{py+34}" width="300" height="38" rx="19" fill="#fff" fill-opacity=".09" stroke="#fff" stroke-opacity=".28"/>
  <circle class="dot" cx="{W/2-122}" cy="{py+53}" r="4.5" fill="{GOLD}" style="transform-origin:{W/2-122}px {py+53}px"/>
  <text x="{W/2+8}" y="{py+58}" text-anchor="middle" font-size="13" font-weight="600" letter-spacing="3" fill="#E2E8F0">PORTFOLIO · LAHORE, PK</text>
 </g>
 <text x="{W/2}" y="{py+148}" text-anchor="middle" font-size="68" font-weight="800" letter-spacing="-1.5" fill="url(#hname)" style="animation:rise 1.1s {EASE} .35s both">Muhammad Umer Faheem</text>
 <text x="{W/2}" y="{py+196}" text-anchor="middle" font-size="25" font-weight="500" fill="#CBD5E1" style="animation:rise 1.1s {EASE} .55s both">ERP Management Trainee Officer  <tspan fill="{GOLD}">·</tspan>  BI Specialist</text>
 <rect x="{W/2-60}" y="{py+222}" width="120" height="3" rx="1.5" fill="url(#hacc)" style="animation:fade 1.2s ease .9s both"/>
 <g style="animation:rise 1s {EASE} .8s both">
  {chips(W/2, py+262, ["Frontend Development","Business Intelligence","Odoo ERP"], [GOLD,BLUE,PURPLE], "h")}
 </g>
</g>

<g class="bubbles">
 <circle class="b1" cx="150" cy="420" r="16" fill="url(#hbub)" stroke="#fff" stroke-opacity=".35"/>
 <circle class="b2" cx="1030" cy="430" r="11" fill="url(#hbub)" stroke="#fff" stroke-opacity=".35"/>
 <circle class="b3" cx="620" cy="440" r="8" fill="url(#hbub)" stroke="#fff" stroke-opacity=".35"/>
 <circle class="b4" cx="1110" cy="400" r="20" fill="url(#hbub)" stroke="#fff" stroke-opacity=".35"/>
 <circle class="b5" cx="70" cy="300" r="9" fill="url(#hbub)" stroke="#fff" stroke-opacity=".35"/>
</g>'''
    css = ORB_CSS + f'''
.panel{{animation:float 9s ease-in-out infinite}}
.refract{{animation:refr 16s ease-in-out infinite}}
@keyframes refr{{0%,100%{{transform:translate(0,0) scale(1)}}50%{{transform:translate(-60px,24px) scale(1.06)}}}}
.sweep{{animation:sweep 9s cubic-bezier(.5,0,.2,1) infinite}}
@keyframes sweep{{0%{{transform:skewX(-18deg) translateX(0)}}45%,100%{{transform:skewX(-18deg) translateX(1900px)}}}}
.orbit{{animation:orbit 10s linear infinite}}
@keyframes orbit{{from{{stroke-dashoffset:0}}to{{stroke-dashoffset:-1000}}}}
.dot{{animation:pulse 2.4s ease-in-out infinite}}
@keyframes bub{{0%{{transform:translateY(0);opacity:0}}12%{{opacity:1}}85%{{opacity:.9}}100%{{transform:translateY(-330px);opacity:0}}}}
.b1{{animation:bub 11s ease-in infinite}}.b2{{animation:bub 13s ease-in 2s infinite}}.b3{{animation:bub 9s ease-in 4s infinite}}.b4{{animation:bub 15s ease-in 1s infinite}}.b5{{animation:bub 12s ease-in 6s infinite}}
'''
    svg(W, H, body, "hero.svg", "Muhammad Umer Faheem — ERP Management Trainee Officer and BI Specialist, animated liquid glass banner", css)

def chips(cx, y, labels, colors, p):
    ws = [len(l)*10.6+62 for l in labels]
    gap = 18
    total = sum(ws)+gap*(len(ws)-1)
    x = cx-total/2
    out = ""
    for l, c, w in zip(labels, colors, ws):
        out += f'''<g><rect x="{x:.1f}" y="{y}" width="{w:.1f}" height="44" rx="22" fill="url(#{p}gf)" stroke="url(#{p}gs)" stroke-width="1.2"/>
<path d="M{x+22:.1f} {y+2} H{x+w-22:.1f}" stroke="#fff" stroke-opacity=".5" stroke-width="1" stroke-linecap="round"/>
<circle cx="{x+24:.1f}" cy="{y+22}" r="5" fill="{c}"/><circle cx="{x+24:.1f}" cy="{y+22}" r="10" fill="{c}" opacity=".25"/>
<text x="{x+42:.1f}" y="{y+28}" font-size="16" font-weight="600" fill="#F1F5F9">{escape(l)}</text></g>'''
        x += w+gap
    return out

# ───────────────────────── TYPING ─────────────────────────
def typing():
    W, H = 1000, 96
    phrases = ["Frontend Developer", "Business Intelligence Enthusiast", "Odoo ERP · SAP · Power BI", "Liquid Glass Interfaces", "Data → Insight → Experience"]
    n = len(phrases); cw = 14.4; x0 = 84
    pw, ph = 860, 64; px = (W-pw)/2; py = 16
    clips, texts, carets = "", "", ""
    for i, t in enumerate(phrases):
        full = len(t)*cw+4
        a, b = i/n, (i+1)/n
        seg = (b-a)
        kt = [0, a, a+seg*.40, a+seg*.80, b-seg*.001, 1]
        vals = [0, 0, full, full, 0, 0]
        # build unique ascending keyTimes
        pts = []
        for k, v in zip(kt, vals):
            if pts and k <= pts[-1][0]: k = pts[-1][0] + 1e-4
            pts.append((min(k, 1.0), v))
        if pts[-1][0] < 1: pts.append((1.0, 0))
        pts[-1] = (1.0, pts[-1][1])
        # dedupe monotonic
        clean = []
        for k, v in pts:
            if clean and k <= clean[-1][0]: continue
            clean.append((k, v))
        ks = ";".join(f"{k:.4f}" for k, _ in clean)
        spl = ";".join(".4 0 .2 1" for _ in range(len(clean)-1))
        def anim(attr, add=0):
            vs = ";".join(f"{v+add:.1f}" for _, v in clean)
            return f'<animate attributeName="{attr}" values="{vs}" keyTimes="{ks}" calcMode="spline" keySplines="{spl}" dur="{n*4.2}s" repeatCount="indefinite"/>'
        clips += f'<clipPath id="tc{i}"><rect x="{x0}" y="{py}" height="{ph}" width="0">{anim("width")}</rect></clipPath>'
        texts += f'<text class="mono" x="{x0}" y="{py+41}" font-size="24" font-weight="600" fill="#F8FAFC" clip-path="url(#tc{i})">{escape(t)}</text>'
        carets += f'<rect y="{py+19}" width="3" height="28" rx="1.5" fill="url(#tacc)" x="{x0}">{anim("x")}</rect>'
    body = f'''<defs>{glass_defs("t")}{clips}
<filter id="tblur" x="-50%" y="-100%" width="200%" height="300%"><feGaussianBlur stdDeviation="30"/></filter>
<clipPath id="tpanel"><rect x="{px}" y="{py}" width="{pw}" height="{ph}" rx="32"/></clipPath>
<linearGradient id="tacc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{GOLD}"/><stop offset="1" stop-color="{BLUE}"/></linearGradient></defs>
<g class="panel" style="animation:rise 1s {EASE} .1s both">
<g clip-path="url(#tpanel)"><rect x="{px}" y="{py}" width="{pw}" height="{ph}" fill="#0A0F1C"/>
<g filter="url(#tblur)"><circle class="o1" cx="{px+120}" cy="{py+30}" r="60" fill="{GOLD}" opacity=".6"/><circle class="o2" cx="{px+pw-140}" cy="{py+40}" r="70" fill="{BLUE}" opacity=".55"/><circle class="o3" cx="{px+pw/2}" cy="{py+10}" r="50" fill="{PURPLE}" opacity=".5"/></g>
<rect x="{px}" y="{py}" width="{pw}" height="{ph}" fill="url(#tgf)"/><rect x="{px}" y="{py}" width="{pw}" height="{ph/2}" fill="url(#tspec)"/>
<rect class="sweep" x="-300" y="{py-10}" width="160" height="{ph+20}" fill="url(#tsw)" transform="skewX(-18)"/></g>
<rect x="{px}" y="{py}" width="{pw}" height="{ph}" rx="32" fill="none" stroke="url(#tgs)" stroke-width="1.4"/>
<text class="mono" x="{px+34}" y="{py+41}" font-size="24" font-weight="700" fill="{GOLD}">›</text>
{texts}{carets.replace('<rect ', '<rect style="animation:blink 1s steps(1) infinite" ')}
</g>'''
    css = ORB_CSS.replace("90px,50px", "60px,10px").replace("-110px,-40px", "-70px,-8px").replace("60px,70px", "40px,14px") + '''
.sweep{animation:sw 7s cubic-bezier(.5,0,.2,1) infinite}
@keyframes sw{0%{transform:skewX(-18deg) translateX(0)}50%,100%{transform:skewX(-18deg) translateX(1500px)}}'''
    svg(W, H, body, "typing.svg", "Rotating roles: Frontend Developer, Business Intelligence Enthusiast, Odoo ERP, SAP and Power BI", css)

# ───────────────────────── SECTION HEADERS ─────────────────────────
def header(name, title, kicker, accent):
    W, H = 1200, 88
    p = "s"
    body = f'''<defs>{glass_defs(p)}
<filter id="sblur" x="-50%" y="-100%" width="200%" height="300%"><feGaussianBlur stdDeviation="28"/></filter>
<clipPath id="sc"><rect x="6" y="10" width="{W-12}" height="68" rx="34"/></clipPath></defs>
<g style="animation:rise .9s {EASE} both">
<g clip-path="url(#sc)"><rect x="6" y="10" width="{W-12}" height="68" fill="#0A0F1C"/>
<g filter="url(#sblur)"><circle class="o1" cx="140" cy="44" r="60" fill="{accent}" opacity=".7"/><circle class="o2" cx="{W-200}" cy="50" r="70" fill="{PURPLE if accent!=PURPLE else BLUE}" opacity=".45"/><circle class="o3" cx="{W/2}" cy="20" r="45" fill="{BLUE if accent!=BLUE else GOLD}" opacity=".35"/></g>
<rect x="6" y="10" width="{W-12}" height="68" fill="url(#{p}gf)"/><rect x="6" y="10" width="{W-12}" height="34" fill="url(#{p}spec)"/>
<rect class="sweep" x="-300" y="0" width="200" height="{H}" fill="url(#{p}sw)" transform="skewX(-18)"/></g>
<rect x="6" y="10" width="{W-12}" height="68" rx="34" fill="none" stroke="url(#{p}gs)" stroke-width="1.4"/>
<circle cx="52" cy="44" r="7" fill="{accent}"/><circle class="dot" cx="52" cy="44" r="14" fill="{accent}" opacity=".35" style="transform-origin:52px 44px"/>
<text x="84" y="55" font-size="31" font-weight="750" letter-spacing="-.4" fill="#fff">{escape(title)}</text>
<text x="{W-48}" y="50" text-anchor="end" font-size="13" font-weight="600" letter-spacing="3.2" fill="#CBD5E1" opacity=".85">{escape(kicker.upper())}</text>
</g>'''
    css = ORB_CSS.replace("90px,50px", "70px,6px").replace("-110px,-40px", "-90px,-6px").replace("60px,70px", "30px,10px") + '''
.sweep{animation:sw 8s cubic-bezier(.5,0,.2,1) infinite}
@keyframes sw{0%{transform:skewX(-18deg) translateX(0)}55%,100%{transform:skewX(-18deg) translateX(1600px)}}
.dot{animation:pulse 2.4s ease-in-out infinite}'''
    svg(W, H, body, name, f"Section: {title}", css)

# ───────────────────────── FEATURE CARDS ─────────────────────────
def cards():
    W, H = 1200, 330
    data = [
        (GOLD, "Frontend Craft", ["Figma specs turned into responsive", "HTML, CSS and JavaScript on live", "client projects."], "code"),
        (BLUE, "Business Intelligence", ["Power BI reporting and Oracle SQL", "that turn raw operations data into", "decisions."], "bars"),
        (PURPLE, "ERP & Systems", ["Odoo implementation and", "customisation across textile, apparel", "and retail operations."], "hub"),
    ]
    cw, ch, gap = 360, 250, 30
    x0 = (W - (3*cw + 2*gap))/2
    defs, g = "", ""
    for i, (c, t, lines, icon) in enumerate(data):
        x = x0 + i*(cw+gap); y = 40
        defs += f'<clipPath id="cc{i}"><rect x="{x}" y="{y}" width="{cw}" height="{ch}" rx="36"/></clipPath>'
        if icon == "code":
            ic = f'<text class="mono" x="{x+60}" y="{y+84}" text-anchor="middle" font-size="26" font-weight="800" fill="{c}">&lt;/&gt;</text>'
        elif icon == "bars":
            ic = "".join(f'<rect class="bar" x="{x+44+j*14}" y="{y+100-hh}" width="9" height="{hh}" rx="3" fill="{c}" style="animation-delay:{j*.25}s;transform-origin:{x+48.5+j*14}px {y+100}px"/>' for j, hh in enumerate([22, 38, 30, 50]))
        else:
            cx_, cy_ = x+60, y+72
            ic = f'<g class="spin" style="transform-origin:{cx_}px {cy_}px">' + "".join(f'<line x1="{cx_}" y1="{cy_}" x2="{cx_+26*__import__("math").cos(a):.1f}" y2="{cy_+26*__import__("math").sin(a):.1f}" stroke="{c}" stroke-opacity=".6"/><circle cx="{cx_+26*__import__("math").cos(a):.1f}" cy="{cy_+26*__import__("math").sin(a):.1f}" r="4.5" fill="{c}"/>' for a in [k*3.14159/2+.78 for k in range(4)]) + f'</g><circle cx="{cx_}" cy="{cy_}" r="8" fill="{c}"/>'
        tl = "".join(f'<text x="{x+36}" y="{y+170+k*24}" font-size="16" fill="#CBD5E1">{escape(l)}</text>' for k, l in enumerate(lines))
        g += f'''<g style="animation:rise .9s {EASE} {i*.18+.1}s both"><g style="animation:float 7s ease-in-out {i*1.4}s infinite">
<ellipse cx="{x+cw/2}" cy="{y+ch+10}" rx="{cw/2-30}" ry="10" fill="{c}" opacity=".18" filter="url(#cblur)"/>
<g clip-path="url(#cc{i})"><rect x="{x}" y="{y}" width="{cw}" height="{ch}" fill="#0A0F1C"/>
<circle class="o{i+1}" cx="{x+70}" cy="{y+40}" r="90" fill="{c}" opacity=".5" filter="url(#cblur)"/>
<rect x="{x}" y="{y}" width="{cw}" height="{ch}" fill="url(#cgf)"/><rect x="{x}" y="{y}" width="{cw}" height="{ch*.45}" fill="url(#cspec)"/>
<rect class="sweep" x="-260" y="{y-20}" width="150" height="{ch+40}" fill="url(#csw)" transform="skewX(-18)" style="animation-delay:{i*1.2}s"/></g>
<rect x="{x}" y="{y}" width="{cw}" height="{ch}" rx="36" fill="none" stroke="url(#cgs)" stroke-width="1.4"/>
<circle cx="{x+60}" cy="{y+72}" r="40" fill="#fff" fill-opacity=".07" stroke="#fff" stroke-opacity=".3"/>
{ic}
<text x="{x+36}" y="{y+142}" font-size="23" font-weight="750" fill="#fff">{escape(t)}</text>{tl}</g></g>'''
    body = f'<defs>{glass_defs("c")}<filter id="cblur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="30"/></filter>{defs}</defs>{g}'
    css = ORB_CSS.replace("90px,50px", "50px,30px") + '''
.sweep{animation:sw 8s cubic-bezier(.5,0,.2,1) infinite}
@keyframes sw{0%{transform:skewX(-18deg) translateX(0)}50%,100%{transform:skewX(-18deg) translateX(700px)}}
@keyframes bar{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.55)}}.bar{animation:bar 2.8s ease-in-out infinite}
@keyframes spin{to{transform:rotate(360deg)}}.spin{animation:spin 18s linear infinite}'''
    svg(W, H, body, "cards.svg", "Three focus areas: frontend craft, business intelligence, ERP and systems", css)

# ───────────────────────── STACK MARQUEE ─────────────────────────
def stack():
    W, H = 1200, 220
    rows = [
        ([("HTML5", GOLD), ("CSS3", BLUE), ("JavaScript", GOLD), ("Figma", PURPLE), ("Git", BLUE), ("GitHub", PURPLE), ("VS Code", BLUE), ("Jira Scrum", GOLD)], 1),
        ([("Odoo ERP", GOLD), ("SAP", BLUE), ("Oracle SQL", PURPLE), ("Python", GOLD), ("Power BI", BLUE), ("CVAT", PURPLE), ("YOLO · COCO", GOLD), ("Data QA", BLUE)], -1),
    ]
    g, css_rows = "", ""
    for ri, (items, direction) in enumerate(rows):
        y = 28 + ri*84
        x = 0; one = ""
        for label, c in items:
            w = len(label)*10.8+66
            one += f'''<g><rect x="{x:.1f}" y="{y}" width="{w:.1f}" height="56" rx="28" fill="url(#kgf)" stroke="url(#kgs)" stroke-width="1.2"/>
<rect x="{x+4:.1f}" y="{y+3}" width="{w-8:.1f}" height="24" rx="12" fill="url(#kspec)"/>
<circle cx="{x+30:.1f}" cy="{y+28}" r="6" fill="{c}"/><circle cx="{x+30:.1f}" cy="{y+28}" r="12" fill="{c}" opacity=".22"/>
<text x="{x+50:.1f}" y="{y+35}" font-size="20" font-weight="650" fill="#F1F5F9">{escape(label)}</text></g>'''
            x += w + 18
        total = x
        g += f'<g class="row{ri}">{one}<g transform="translate({total:.1f} 0)">{one}</g></g>'
        a, b = (0, -total) if direction == 1 else (-total, 0)
        css_rows += f'@keyframes m{ri}{{from{{transform:translateX({a:.1f}px)}}to{{transform:translateX({b:.1f}px)}}}}.row{ri}{{animation:m{ri} {total/46:.1f}s linear infinite}}\n'
    body = f'''<defs>{glass_defs("k")}
<linearGradient id="kmf" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000"/><stop offset=".12" stop-color="#fff"/><stop offset=".88" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient>
<mask id="kmask"><rect width="{W}" height="{H}" fill="url(#kmf)"/></mask>
<filter id="kblur" x="-50%" y="-100%" width="200%" height="300%"><feGaussianBlur stdDeviation="40"/></filter></defs>
<rect x="0" y="0" width="{W}" height="{H}" rx="34" fill="{BG}"/>
<g filter="url(#kblur)" opacity=".8"><circle class="o1" cx="250" cy="70" r="70" fill="{GOLD}" opacity=".55"/><circle class="o2" cx="900" cy="150" r="80" fill="{BLUE}" opacity=".5"/><circle class="o3" cx="600" cy="110" r="60" fill="{PURPLE}" opacity=".45"/></g>
<g mask="url(#kmask)">{g}</g>
<rect x="1" y="1" width="{W-2}" height="{H-2}" rx="33" fill="none" stroke="url(#kgs)" stroke-opacity=".5"/>'''
    svg(W, H, body, "stack.svg", "Technology and tools marquee: HTML, CSS, JavaScript, Figma, Odoo, SAP, Oracle SQL, Python, Power BI", ORB_CSS + css_rows)

# ───────────────────────── SKILLS ─────────────────────────
def skills():
    W, H = 1200, 430
    data = [("Frontend Development", 88, GOLD), ("UI / UX Design", 82, PURPLE), ("Power BI", 85, BLUE), ("SQL / Oracle", 80, BLUE), ("ERP Systems", 78, GOLD)]
    tx, tw = 340, 700
    defs, g = "", ""
    for i, (lbl, v, c) in enumerate(data):
        y = 112 + i*54
        fw = tw*v/100
        c2 = {GOLD: "#FF8A3D", BLUE: "#6366F1", PURPLE: "#EC6BD1"}[c]
        defs += f'<linearGradient id="f{i}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="{c2}"/><stop offset="1" stop-color="{c}"/></linearGradient><clipPath id="fc{i}"><rect x="{tx}" y="{y}" width="{fw}" height="16" rx="8"/></clipPath>'
        d = .5 + i*.18
        g += f'''<text x="64" y="{y+14}" font-size="19" font-weight="600" fill="#E2E8F0" style="animation:fade .8s ease {d}s both">{lbl}</text>
<rect x="{tx}" y="{y}" width="{tw}" height="16" rx="8" fill="#fff" fill-opacity=".07" stroke="#fff" stroke-opacity=".14"/>
<g class="grow" style="transform-origin:{tx}px 0px;animation-delay:{d}s"><g clip-path="url(#fc{i})">
<rect x="{tx}" y="{y}" width="{fw}" height="16" fill="url(#f{i})"/><rect x="{tx}" y="{y}" width="{fw}" height="7" fill="#fff" opacity=".35"/>
<rect class="shim" x="{tx-120}" y="{y}" width="110" height="16" fill="url(#ksw)" transform="skewX(-20)" style="animation-delay:{d+1.2}s"/></g></g>
<g class="bead" style="--w:{fw}px;animation-delay:{d}s"><circle cx="{tx}" cy="{y+8}" r="15" fill="{c}" opacity=".3" filter="url(#kglow)"/><circle cx="{tx}" cy="{y+8}" r="11" fill="url(#kbead)" stroke="#fff" stroke-opacity=".7"/></g>
<text x="{tx+tw+36}" y="{y+14}" font-size="19" font-weight="750" fill="#fff" style="animation:fade .8s ease {d+1.1}s both">{v}%</text>'''
    body = f'''<defs>{glass_defs("k")}{defs}
<filter id="kblur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="60"/></filter>
<filter id="kglow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="5"/></filter>
<radialGradient id="kbead" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff"/><stop offset=".45" stop-color="#fff" stop-opacity=".45"/><stop offset="1" stop-color="#fff" stop-opacity=".12"/></radialGradient>
<clipPath id="kp"><rect x="30" y="20" width="{W-60}" height="{H-40}" rx="44"/></clipPath></defs>
<g style="animation:rise 1s {EASE} both"><g style="animation:float 10s ease-in-out infinite">
<g clip-path="url(#kp)"><rect x="30" y="20" width="{W-60}" height="{H-40}" fill="#0A0F1C"/>
<g filter="url(#kblur)"><circle class="o1" cx="200" cy="120" r="140" fill="{GOLD}" opacity=".5"/><circle class="o2" cx="1000" cy="330" r="150" fill="{BLUE}" opacity=".45"/><circle class="o3" cx="650" cy="60" r="110" fill="{PURPLE}" opacity=".4"/></g>
<rect x="30" y="20" width="{W-60}" height="{H-40}" fill="url(#kgf)"/><rect x="30" y="20" width="{W-60}" height="150" fill="url(#kspec)"/>
<rect class="sweep" x="-300" y="0" width="240" height="{H}" fill="url(#ksw)" transform="skewX(-18)"/></g>
<rect x="30" y="20" width="{W-60}" height="{H-40}" rx="44" fill="none" stroke="url(#kgs)" stroke-width="1.5"/>
<text x="64" y="76" font-size="13" font-weight="700" letter-spacing="3.5" fill="{GOLD}">SKILLS AT A GLANCE</text>
{g}</g></g>'''
    css = ORB_CSS + f'''
@keyframes grow{{from{{transform:scaleX(0)}}to{{transform:scaleX(1)}}}}.grow{{animation:grow 1.7s {EASE} both}}
@keyframes bead{{from{{transform:translateX(0)}}to{{transform:translateX(var(--w))}}}}.bead{{animation:bead 1.7s {EASE} both}}
.shim{{animation:shim 4.5s cubic-bezier(.5,0,.2,1) infinite}}
@keyframes shim{{0%{{transform:skewX(-20deg) translateX(0)}}60%,100%{{transform:skewX(-20deg) translateX(900px)}}}}
.sweep{{animation:sw 10s cubic-bezier(.5,0,.2,1) infinite}}
@keyframes sw{{0%{{transform:skewX(-18deg) translateX(0)}}50%,100%{{transform:skewX(-18deg) translateX(1800px)}}}}'''
    svg(W, H, body, "skills.svg", "Skill levels: Frontend 88, UI/UX 82, Power BI 85, SQL/Oracle 80, ERP 78 percent", css)

# ───────────────────────── FOOTER ─────────────────────────
def footer():
    W, H = 1200, 300
    def wave(y, amp, off):
        a = f"M0 {y} Q150 {y-amp} 300 {y} T600 {y} T900 {y} T1200 {y} T1500 {y} V{H} H0 Z"
        b = f"M0 {y} Q150 {y+amp} 300 {y} T600 {y} T900 {y} T1200 {y} T1500 {y} V{H} H0 Z"
        return a, b
    layers = ""
    for i, (y, amp, c, op, dur) in enumerate([(205, 38, GOLD, .22, 9), (225, 30, BLUE, .24, 11), (245, 24, PURPLE, .30, 13)]):
        a, b = wave(y, amp, 0)
        layers += f'<path d="{a}" fill="{c}" opacity="{op}"><animate attributeName="d" values="{a};{b};{a}" dur="{dur}s" repeatCount="indefinite" calcMode="spline" keyTimes="0;.5;1" keySplines=".45 0 .55 1;.45 0 .55 1"/></path>'
        layers += f'<path d="{a}" fill="none" stroke="{c}" stroke-width="1.5" opacity=".8"><animate attributeName="d" values="{a};{b};{a}" dur="{dur}s" repeatCount="indefinite" calcMode="spline" keyTimes="0;.5;1" keySplines=".45 0 .55 1;.45 0 .55 1"/></path>'
    body = f'''<defs>{glass_defs("f")}
<filter id="fblur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="60"/></filter>
<clipPath id="fbg"><rect width="{W}" height="{H}" rx="34"/></clipPath>
<clipPath id="fp"><rect x="260" y="50" width="680" height="120" rx="40"/></clipPath></defs>
<g clip-path="url(#fbg)"><rect width="{W}" height="{H}" fill="{BG}"/>
<g filter="url(#fblur)"><circle class="o1" cx="260" cy="90" r="130" fill="{GOLD}" opacity=".45"/><circle class="o2" cx="940" cy="120" r="140" fill="{BLUE}" opacity=".4"/><circle class="o3" cx="600" cy="40" r="100" fill="{PURPLE}" opacity=".4"/></g>
{layers}</g>
<g style="animation:rise 1s {EASE} both"><g style="animation:float 9s ease-in-out infinite">
<g clip-path="url(#fp)"><rect x="260" y="50" width="680" height="120" fill="#0A0F1C" fill-opacity=".55"/><rect x="260" y="50" width="680" height="120" fill="url(#fgf)"/><rect x="260" y="50" width="680" height="55" fill="url(#fspec)"/>
<rect class="sweep" x="-200" y="40" width="140" height="140" fill="url(#fsw)" transform="skewX(-18)"/></g>
<rect x="260" y="50" width="680" height="120" rx="40" fill="none" stroke="url(#fgs)" stroke-width="1.4"/>
<text x="600" y="102" text-anchor="middle" font-size="30" font-weight="750" fill="#fff">Let’s build something remarkable.</text>
<text x="600" y="136" text-anchor="middle" font-size="17" fill="#CBD5E1">Open to collaboration · Lahore, Pakistan</text></g></g>
<rect x="1" y="1" width="{W-2}" height="{H-2}" rx="33" fill="none" stroke="url(#fgs)" stroke-opacity=".45"/>'''
    css = ORB_CSS + '''
.sweep{animation:sw 8s cubic-bezier(.5,0,.2,1) infinite}
@keyframes sw{0%{transform:skewX(-18deg) translateX(0)}50%,100%{transform:skewX(-18deg) translateX(1300px)}}'''
    svg(W, H, body, "footer.svg", "Footer banner with animated liquid waves: Let's build something remarkable", css)

hero(); typing(); cards(); stack(); skills(); footer()
for n, t, k, a in [("h-overview.svg", "Overview", "The project", GOLD), ("h-features.svg", "Features", "What it does", BLUE),
                   ("h-stack.svg", "Tech Stack", "Built with", PURPLE), ("h-sections.svg", "Main Sections", "What’s inside", GOLD),
                   ("h-structure.svg", "Project Structure", "How it’s organised", BLUE), ("h-design.svg", "Design System", "Look & feel", PURPLE),
                   ("h-license.svg", "License", "All rights reserved", GOLD)]:
    header(n, t, k, a)
