"""Build round 5 previews: preview A with decision 20's changes, in 3 title/description fixes.

Copied from build.py (round 4); the shared top still comes from round3-preview-a.html.
"""
import os, re, sys, html

PUB = "/Users/geovponce/Developer/personalWebsite/public"
SP = os.path.dirname(os.path.abspath(__file__))
SNAP = os.path.join(SP, "round3-preview-a.html")

if False:  # never re-snapshot (plan, round 4 note)
    open(SNAP, "w").write(open(os.path.join(PUB, "preview-a.html")).read())
src = open(SNAP).read().split("\n")
L = lambda a, b: "\n".join(src[a - 1:b])  # 1-indexed inclusive

HEAD_FONTS = L(7, 9)
HERO_STYLE = L(10, 29)
BASE_STYLE = L(30, 127)
GAP_STRIP = L(150, 178)
LOSS_JS = L(347, 394)
MAN_JS = L(396, 445)
HERO = L(130, 146)  # 146 is </header>; without it main and the footer sat inside the header

# ---- decision 16: drop the email button, icon row left, LinkedIn first, then GitHub ----
GH_SVG = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .3a12 12 0 0 0-3.8 23.38c.6.12.83-.26.83-.57L9 21.07c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.08-.74.09-.73.09-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18a4.65 4.65 0 0 1 1.23 3.22c0 4.61-2.8 5.63-5.48 5.92.42.36.81 1.1.81 2.22l-.01 3.29c0 .32.21.69.82.57A12 12 0 0 0 12 .3"/></svg>'
LI_A = re.search(r'<a class="gh-li".*?</a>', HERO).group(0)
GH_A = f'<a class="gh-li gh-gh" href="https://github.com/godfreyponce" target="_blank" rel="noopener noreferrer" aria-label="GitHub">{GH_SVG}</a>'
HERO_STYLE = HERO_STYLE.replace("</style>", ".gh-gh:hover{color:#1c1917}\n</style>")
BIO2 = re.search(r'<p><a href="#soccer">.*?</p>', HERO).group(0)
ACT = re.search(r'<div class="gh-act">.*?</div>', HERO, re.S).group(0)
MAIL = "poncegodfrey@gmail.com"

def hero(act_extra="", bio2=None):
    h = HERO.replace(ACT, f'<div class="gh-act">\n        {LI_A}\n        {GH_A}{act_extra}\n      </div>')
    if bio2:
        h = h.replace(BIO2, bio2)
    return h

# ---- content, from components/sections/Timeline.tsx and Education.tsx ----
T = lambda label, f: (label, f)
STACK = {
    "jonsson": [T("WordPress", "logos/wordpress.svg"), T("HTML", "logos/html5.svg"), T("CSS", "logos/css.svg"),
                T("JavaScript", "logos/javascript.svg"), T("Jira", "logos/jira.svg"),
                T("Dreamweaver", "logos/dreamweaver.svg"), T("Silktide", "logos/silktide.svg")],
    "wayfair": [T("Python", "logos/python.svg"), T("Google Gemini", "logos/googlegemini.svg"),
                T("Tableau", "logos/tableau.svg"), T("n8n", "logos/n8n.svg"), T("JavaScript", "logos/javascript.svg")],
    "apple": [T("Tableau", "logos/tableau.svg"), T("iOS/macOS", "logos/apple.svg"), T("Keynote", "logos/keynote.svg")],
}
JOBS = [
    dict(k="jonsson", org="Jonsson School of Engineering &amp; Computer Science (UT Dallas)", short="Jonsson School, UT Dallas",
         url="https://engineering.utdallas.edu", logo="utdjonsson_logo.jpeg", role="Web Specialist",
         start="August 2025", end="Present", s="Aug 2025",
         pts=["Managed the technical lifecycle of 20+ departmental and lab websites, implementing high performance responsive frameworks that enhanced the university's digital accessibility.",
              "Coordinated high priority site migrations and asset management using Jira, ensuring seamless delivery of large scale university updates."]),
    dict(k="handshake", org="Handshake AI", short="Handshake AI", url="https://joinhandshake.com", logo="team_handshake_logo.jpeg",
         role="AI Data Researcher, Contract", start="November 2025", end="January 2026", s="Nov 2025", e="Jan 2026",
         pts=["Conducting RLHF to fine-tune multimodal AI models, focusing on alignment, safety, and reasoning logic.",
              "Providing structured feedback on edge cases to engineering teams to support the data centric AI lifecycle."]),
    dict(k="wayfair", org="Wayfair", short="Wayfair", url="https://www.wayfair.com", logo="wayfair_logo.jpeg",
         role="AI Agent Developer, Externship", start="October 2025", end="December 2025", s="Oct 2025", e="Dec 2025",
         pts=["Developing AI agents with Google Gemini 2.5 to automate competitor trend analysis and data scraping.",
              "Building live dashboards to visualize real time market insights extracted from diverse data streams."]),
    dict(k="apple", org="Apple", short="Apple", url="https://www.apple.com", logo="apple_logo.jpeg", role="Technical Advisor",
         start="May 2025", end="August 2025", s="May 2025", e="Aug 2025",
         pts=["Resolved complex iOS/macOS technical issues with a 96% success rate using advanced diagnostics.",
              "Provided user-focused support while relaying critical technical feedback to internal engineering teams."]),
    dict(k="gdsc", org="Google Developer Student Club (GDSC)", short="Google Developer Student Club", url="https://gdg.community.dev",
         logo="gdsc_logo.png", role="Community &amp; Events Officer", start="Fall 2024", end="Present", s="Fall 2024",
         pts=["Spearheaded a social media strategy boosting engagement by 850% and gaining 150k+ video views."]),
]
EDU = dict(org="The University of Texas at Dallas", url="https://www.utdallas.edu", logo="utd_logo.jpeg",
           role="BS in Computer Science", sub="Minor in Cognitive Science", start="Fall 2024", end="Spring 2028")

def dates(j, short=False):
    a = j["s"] if short else j["start"]
    e = j.get("e", j["end"]) if short else j["end"]
    e = "<b>Present</b>" if e == "Present" else e
    return f"{a} - {e}"

def ext(url, cls, text):
    return f'<a class="{cls}" href="{url}" target="_blank" rel="noopener noreferrer">{text}</a>'

def icons(k, cls, labels=False):
    out = []
    for label, f in STACK.get(k, []):
        assert os.path.exists(os.path.join(PUB, f)), f
        img = f'<img src="{f}" alt="" width="16" height="16">'
        out.append(f'<li title="{label}">{img}<span>{label}</span></li>' if labels
                   else f'<li title="{label}">{img}<span class="ix-sr">{label}</span></li>')
    return f'<ul class="{cls}" aria-label="Stack">' + "".join(out) + "</ul>" if out else ""

for j in JOBS + [EDU]:
    assert os.path.exists(os.path.join(PUB, j["logo"])), j["logo"]

CANVAS = '<figure class="ix-loss"><canvas id="ix-loss" aria-hidden="true"></canvas><div class="ix-read" id="ix-read"></div></figure>'

COPY_JS = """
  // Copy the address; the label says so for 1.6s, then goes back.
  document.querySelectorAll('[data-copy]').forEach(function(b){
    var label=b.textContent,t=0;
    b.addEventListener('click',function(e){
      e.preventDefault();
      var done=function(){b.textContent='copied';b.classList.add('is-done');clearTimeout(t);t=setTimeout(function(){b.textContent=label;b.classList.remove('is-done')},1600)};
      if(navigator.clipboard)navigator.clipboard.writeText(b.dataset.copy).then(done,done);else done();
    });
  });
"""

def page(letter, title, css, body, act_extra="", bio2=None):
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Preview {letter}: {title}</title>
{HEAD_FONTS}
{HERO_STYLE}
{BASE_STYLE.replace("</style>", "")}
/* ---- round 4, variant {letter} ---- */
.ix-end{{height:100px}}
.ix-copy{{font:inherit;background:none;border:0;padding:0;cursor:pointer;color:#a8a29e;transition:color .2s}}
.ix-copy:hover{{color:#1c1917}}
.ix-copy.is-done{{color:#c2410c}}
{css}
@media (prefers-reduced-motion:reduce){{.ix-copy,.ix *{{transition:none!important}}}}
</style>
</head>
<body>
{hero(act_extra, bio2)}
<main class="ix">
<div class="ix-col">
{GAP_STRIP}
{body}
  <div class="ix-end"></div>
</div>
</main>
<script>
(function(){{
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
{COPY_JS}
{LOSS_JS}

{MAN_JS}
}})();
</script>
</body>
</html>
"""

# =============================== round 5: A, with decision 20 ===============================
from urllib.parse import quote

# -- verb tense: past roles read in the past tense (every other first bullet already does)
for j in JOBS:
    j["pts"][0] = j["pts"][0].replace("Conducting RLHF", "Conducted RLHF").replace("Developing AI agents", "Developed AI agents")
assert [j["pts"][0].split()[0] for j in JOBS] == ["Managed", "Conducted", "Developed", "Resolved", "Spearheaded"]

# -- hero bio: "UTD" reads "UT Dallas"; the Soccer link gets the ball cursor
assert HERO.count(">UTD</a>") == 1 and HERO.count('<a href="#soccer">') == 1
HERO = HERO.replace(">UTD</a>", ">UT Dallas</a>").replace('<a href="#soccer">', '<a class="gh-ball" href="#soccer">')
BALL = ("<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'>"
        "<circle cx='16' cy='16' r='14' fill='#fff' stroke='#1c1917' stroke-width='1.6'/>"
        "<path d='M16 10.5l5.23 3.8-2 6.15h-6.46l-2-6.15z' fill='#1c1917'/>"
        "<path d='M16 10.5V2M21.23 14.3l8.08-2.63M19.23 20.45l4.99 6.87M12.77 20.45l-4.99 6.87M10.77 14.3l-8.08-2.63' stroke='#1c1917' stroke-width='1.6' fill='none'/>"
        "</svg>")
BALL_CSS = f'.gh-ball{{cursor:url("data:image/svg+xml,{quote(BALL)}") 16 16,pointer}}'

# -- logo strip: each logo links to its entry
ENTRY = {j["logo"]: f"job-{j['k']}" for j in JOBS}
ENTRY[EDU["logo"]] = "edu-utd"
def strip_li(m):
    src = m.group(1)
    return f'<li><a class="ix-lg" href="#{ENTRY[src]}" data-k="{ENTRY[src]}">{m.group(0)[4:-5]}</a></li>'
GAP_STRIP, n = re.subn(r'<li><img src="([^"]+)"[^>]*></li>', strip_li, GAP_STRIP)
assert n == 6, n

A_CSS = """
.a-li{list-style:none;display:grid;grid-template-columns:1fr 1fr;column-gap:24px;row-gap:32px}
.a-t{display:flex;align-items:flex-start;gap:10px}
.a-org{flex:none;width:22px;height:22px;margin-top:3px;object-fit:cover;border-radius:3px}
.a-in{padding-left:32px}
.a-st{list-style:none;display:flex;flex-wrap:wrap;gap:10px;margin:6px 0 2px}
.a-st img{display:block;width:16px;height:16px;object-fit:contain;filter:grayscale(1);opacity:.45;transition:filter .25s,opacity .25s}
.a-li>li:hover .a-st img,.a-li>li.is-hot .a-st img,.a-li>li.is-pop .a-st img{filter:none;opacity:1}
.gh-mail{display:inline-flex;align-items:center;gap:12px;margin-left:4px;padding-left:16px;border-left:1px solid #e7e5e4;font:400 13px/1.4 'Geist Mono',ui-monospace,monospace;letter-spacing:.01em}
.gh-mail a{color:#78716c;text-decoration:none;border-bottom:1px dashed rgba(127,127,127,.5);transition:color .2s,border-color .2s}
.gh-mail a:hover{color:#1c1917;border-bottom-color:#1c1917}
/* logo strip: colour on hover or focus; the entry it points at pops after the scroll settles */
.ix-lg{display:block;border-radius:2px}
.ix-lg img{transition:filter .25s,opacity .25s}
.ix-lg:hover img,.ix-lg:focus-visible img{filter:none;opacity:1}
.a-li>li{border-radius:2px}
.a-li>li.is-pop{animation:a-pop 1.2s ease-out}
@keyframes a-pop{0%{background:rgba(231,229,228,.8);box-shadow:0 0 0 12px rgba(231,229,228,.8);transform:none}
  15%{transform:scale(1.015)}
  100%{background:rgba(231,229,228,0);box-shadow:0 0 0 12px rgba(231,229,228,0);transform:none}}
@keyframes a-pop-still{0%,60%{background:rgba(231,229,228,.8);box-shadow:0 0 0 12px rgba(231,229,228,.8)}
  100%{background:rgba(231,229,228,0);box-shadow:0 0 0 12px rgba(231,229,228,0)}}
/* loss graph: no caption, the graph opens under its rule at the section-head offset */
.a-loss .ix-loss{margin-top:55px}
/* soccer stub, the Soccer link's target until Passions is built */
.a-soc figure{margin-top:55px}
.a-soc img{display:block;width:100%;height:auto}
.a-soc figcaption{margin-top:16px;max-width:536px;color:#a8a29e}
.a-soc figcaption b{display:block;font-weight:600;color:#44403c}
@media (max-width:767px){.a-li{grid-template-columns:1fr}.gh-act{flex-wrap:wrap}.gh-mail{margin-left:0}}
@media (prefers-reduced-motion:reduce){.a-li>li.is-pop{animation-name:a-pop-still}.ix-lg img{transition:none}}
"""

FIX = {
    "a": ("Grey description", ".a-desc{color:#78716c}"),
    "b": ("Serif role line", ".a-role{margin-top:2px;font-family:'Spectral',ui-serif,Georgia,serif;font-size:17px;line-height:1.35;letter-spacing:-.2px;color:#1c1917}\n.a-role+.a-desc{margin-top:4px}"),
    "c": ("Small grey description", ".a-desc{font-size:13.5px;color:#78716c}"),
}

def a_item(j, role_line, edu=False):
    sub = j["sub"] if edu else j["pts"][0]
    d = f'{j["start"]} - {j["end"]}' if edu else dates(j)
    key = "edu-utd" if edu else f"job-{j['k']}"
    title = ext(j['url'], 'ix-b', j['org']) if role_line else f"{ext(j['url'], 'ix-b', j['org'])} &ndash; {j['role']}"
    role = f'\n          <p class="a-role">{j["role"]}</p>' if role_line else ""
    return f"""      <li id="{key}">
        <p class="a-t"><img class="a-org" src="{j['logo']}" alt="" width="22" height="22"><span>{title}</span></p>
        <div class="a-in">{role}
          <p class="a-desc">{sub}</p>
          {"" if edu else icons(j['k'], 'a-st')}
          <p class="ix-d">{d}</p>
        </div>
      </li>"""

def a_body(role_line, lab=""):
    return f"""
  <section class="ix-sec" aria-labelledby="ix-work">
    <h2 class="ix-h" id="ix-work">Work Experience&nbsp;&raquo;</h2>
    <ul class="a-li">
{chr(10).join(a_item(j, role_line) for j in JOBS)}
    </ul>
  </section>
  <section class="ix-sec" aria-labelledby="ix-edu">
    <h2 class="ix-h" id="ix-edu">Education&nbsp;&raquo;</h2>
    <ul class="a-li">
{a_item(EDU, role_line, True)}
    </ul>
  </section>
  <section class="ix-sec a-loss" aria-label="Training loss, live">
    {CANVAS}
  </section>{lab}
  <section class="ix-sec a-soc" id="soccer" aria-label="Soccer">
    <figure>
      <img src="godfrey_soccerShot.jpg" alt="Godfrey playing soccer" width="1400" height="933" loading="lazy">
      <figcaption><b>The Beautiful Game</b>A lifelong athlete, I believe the best results come from disciplined teamwork, bringing in the same energy and translating it over to professional environments.</figcaption>
    </figure>
  </section>"""

A_ACT = f"""
        <span class="gh-mail"><a href="mailto:{MAIL}">{MAIL}</a><button class="ix-copy" type="button" data-copy="{MAIL}">copy</button></span>"""

NAV_JS = """
  // Soccer link and logo strip: scroll smoothly (instantly under reduced motion) instead of jumping.
  var go=function(t,block){t.scrollIntoView({block:block,behavior:reduce?'auto':'smooth'})};
  document.querySelectorAll('a.gh-ball').forEach(function(a){
    a.addEventListener('click',function(e){var t=document.getElementById('soccer');if(!t)return;e.preventDefault();go(t,'start')});
  });
  // Logo strip: hovering a logo lights its entry; clicking scrolls there, then pops it once the scroll settles.
  // Settled = scrollY unchanged for 3 frames (scrollend is missing in older Safari).
  var settle=function(fn){var y=-1,still=0;(function tick(){if(scrollY===y){if(++still>=3)return fn()}else{still=0;y=scrollY}requestAnimationFrame(tick)})()};
  document.querySelectorAll('.ix-lg').forEach(function(a){
    var t=document.getElementById(a.dataset.k);if(!t)return;
    var hot=function(on){return function(){t.classList.toggle('is-hot',on)}};
    a.addEventListener('mouseenter',hot(true));a.addEventListener('focus',hot(true));
    a.addEventListener('mouseleave',hot(false));a.addEventListener('blur',hot(false));
    t.addEventListener('animationend',function(){t.classList.remove('is-pop')});
    a.addEventListener('click',function(e){
      e.preventDefault();t.classList.remove('is-pop');go(t,'center');
      settle(function(){void t.offsetWidth;t.classList.add('is-pop')});
    });
  });
"""

# =============================== round 5b: C won; 3 soccer-ball treatments on C ===============================
import math
def ball(size, cx, cy, r, stroke=1.4):
    """A panel ball: black centre pentagon, 5 seams, 5 outer pentagons clipped by the rim."""
    pr = r * 0.36
    def pent(x, y, rad, rot):
        return " ".join(f"{x + rad * math.cos(math.radians(rot + 72 * n)):.2f},{y + rad * math.sin(math.radians(rot + 72 * n)):.2f}" for n in range(5))
    out = [f"<clipPath id='k'><circle cx='{cx}' cy='{cy}' r='{r}'/></clipPath>",
           f"<circle cx='{cx}' cy='{cy}' r='{r}' fill='#fff'/>",
           f"<polygon points='{pent(cx, cy, pr, -90)}' fill='#1c1917'/>", "<g clip-path='url(#k)' fill='#1c1917' stroke='#1c1917' stroke-width='1'>"]
    for n in range(5):
        a = math.radians(-90 + 72 * n)
        d = r * 1.08
        ox, oy = cx + d * math.cos(a), cy + d * math.sin(a)
        out.append(f"<polygon points='{pent(ox, oy, pr, math.degrees(a) + 180)}'/>")
        out.append(f"<line x1='{cx + pr * math.cos(a):.2f}' y1='{cy + pr * math.sin(a):.2f}' x2='{ox:.2f}' y2='{oy:.2f}'/>")
    out.append("</g>")
    out.append(f"<circle cx='{cx}' cy='{cy}' r='{r}' fill='none' stroke='#1c1917' stroke-width='{stroke}'/>")
    return "".join(out)

def svg(w, h, body):
    return f"<svg xmlns='http://www.w3.org/2000/svg' width='{w}' height='{h}' viewBox='0 0 {w} {h}'>{body}</svg>"
def cur(s, x, y):
    return f'.gh-ball{{cursor:url("data:image/svg+xml,{quote(s)}") {x} {y},pointer}}'

import base64
# The ball itself, cut from public/godfrey_soccerShot.jpg (96x96 crop at 836,489; ball centre 48,47, radius 37, cut at 34).
PHOTO = "data:image/jpeg;base64," + base64.b64encode(open(os.path.join(SP, "ballphoto-raw.jpg"), "rb").read()).decode()
def ball(size, cx, cy, r, stroke=1.4):
    k = 34 / r  # 3px inside the ball edge, so no grass shows at the rim
    return (f"<clipPath id='k'><circle cx='{cx}' cy='{cy}' r='{r}'/></clipPath>"
            f"<image href='{PHOTO}' x='{cx - 48 / k:.2f}' y='{cy - 47 / k:.2f}' width='{96 / k:.2f}' height='{96 / k:.2f}' clip-path='url(#k)'/>")
BALL_A = svg(32, 32, ball(32, 16, 16, 15))
ARROW = "<path d='M2 2v17l4.6-4.3 3.1 7 2.9-1.3-3.1-6.8h6.3z' fill='#fff' stroke='#1c1917' stroke-width='1.4' stroke-linejoin='round'/>"
BALL_B = svg(32, 32, ARROW + ball(32, 23.5, 23.5, 7.6, 1.2))
BALL_C = svg(16, 16, ball(16, 8, 8, 7.2, 1.1))
CURSOR = {
    "a": ("Ball cursor", "The ball from your photo replaces the cursor.", cur(BALL_A, 16, 16), None),
    "b": ("Arrow with a ball", "The normal arrow stays, with a small ball at its tip's lower right.", cur(BALL_B, 2, 2), None),
    "c": ("Ball rolls in", "The normal hand cursor; a small ball rolls in after the word.",
          ".gh-ball{white-space:nowrap}\n.gh-ball .b-roll{display:inline-block;width:.85em;height:.85em;margin-left:4px;vertical-align:-1px;opacity:0;transform:translateX(-8px) rotate(-200deg);transition:opacity .3s,transform .45s ease-out}\n"
          ".gh-ball .b-roll svg{display:block;width:100%;height:100%}\n.gh-ball:hover .b-roll,.gh-ball:focus-visible .b-roll{opacity:1;transform:none}\n"
          "@media (prefers-reduced-motion:reduce){.gh-ball .b-roll{transform:none;transition:opacity .2s}}",
          f'<span class="b-roll" aria-hidden="true">{BALL_C.replace("<svg ", "<svg ")}</span>'),
}
# decision 21: drawn and photo balls rejected; the owner picked the device's own soccer emoji as the cursor.
BALL_EMOJI = svg(32, 32, "<text x='16' y='26' font-size='26' text-anchor='middle'>\u26bd</text>")
CURSOR = {"a": ("Emoji ball cursor", "The device's soccer emoji replaces the cursor.", cur(BALL_EMOJI, 16, 16), None)}
SOCCER_A = '<a class="gh-ball" href="#soccer">Soccer</a>'
CUR_CSS = CURSOR["a"][2]

# =============================== round 6: The Lab, 3 shapes on the decision 22 page ===============================
# Content from lib/projects.ts: the 5 featured projects in order, and "See all projects (N)" with N = all projects.
TECH = {"Nemotron": "tech/nvidia.svg", "ElevenLabs": "tech/elevenlabs.svg", "Raspberry Pi": "tech/raspberrypi.svg",
        "Python": "tech/python.svg", "Nebula API": "tech/nebula.png", "Gemini": "tech/gemini.svg", "FAISS": "tech/meta.svg",
        "HuggingFace": "tech/huggingface.svg", "LangChain": "tech/langchain.svg", "Plaid": "tech/plaid.svg",
        "Twilio": "tech/twilio.svg", "Auth0": "tech/auth0.svg", "SwiftUI": "tech/swift.svg", "Figma": "tech/figma.svg"}
P = lambda **k: k
PROJ = [
    P(k="land", t="LAND", kind="Hackathon", date="November 2026", logo="projects/land/LOGO.png",
      short="A home safety box that asks if you're okay after a quake, and raises an alarm when you can't answer.",
      desc="A safety box for the home. After an earthquake alert, or when someone in the room goes still, it asks out loud if they're okay. Say help, or stay quiet three times, and it raises a demo alarm on a responder dashboard. An NVIDIA Nemotron agent runs the check-in, but a fixed rule in code decides the alarm, never the model. In the demo, the quake and the movement are simulated. Built at HackUTD 2026 with Rafael Amador on hardware.",
      tags=["Nemotron", "ElevenLabs", "Raspberry Pi", "Python"],
      links=[("GitHub", "https://github.com/godfreyponce/hackutd-26"), ("Devpost", "https://devpost.com/software/rickroll-bfz6v9"), ("Video", "https://www.youtube.com/watch?v=tZQrHPPwC6E")],
      cover="projects/land/land-person-and-box.jpg", alt="Staged photo of a person lying still on a bedroom floor, with an inset of the real LAND box and its lit ring"),
    P(k="cometadvisor", t="CometAdvisor", kind="Hackathon", date="March 2026", logo="projects/cometadvisor/LOGO.png",
      short="An AI advisor that turns your transcript into a semester plan.", tags=["ElevenLabs", "Nebula API", "Gemini"],
      links=[("GitHub", "https://github.com/godfreyponce/hackai-26/tree/main"), ("Devpost", "https://devpost.com/software/untitled-project-h2z8qftmvkj9"), ("Video", "https://www.youtube.com/watch?v=T0LmM8ngKk4")],
      cover="projects/cometadvisor/cometLogo.png", alt="CometAdvisor, your AI academic advisor"),
    P(k="remix", t="Remix", kind="Sprint", date="February 2026", logo="projects/remix/LOGO.png",
      short="Mock interviews built from your resume's actual skill gaps.", tags=["FAISS", "HuggingFace", "Gemini", "LangChain"],
      links=[("GitHub", "https://github.com/MMehta45/sprint-ml1")], cover="projects/remix/Godfrey.JPG", alt="Presenting Remix"),
    P(k="nudge", t="Nudge", kind="Hackathon", date="January 2026", logo="projects/nudge/LOGO.png",
      short="An AI budgeting assistant built by four broke college students.", tags=["Gemini", "Plaid", "Twilio", "Auth0"],
      links=[("GitHub", "https://github.com/godfreyponce/tamuhack-26"), ("Devpost", "https://devpost.com/software/tamuhack-pq8rof"), ("Video", "https://www.youtube.com/watch?v=wPNfufwHK0U")],
      cover="projects/nudge/nudge.png", alt="Nudge screenshot"),
    P(k="techassist", t="TechAssist", kind="Hackathon", date="October 2025", logo="tech_assist.png",
      short="A native iOS assistant with scan-to-solution QR navigation for data center techs.", tags=["SwiftUI", "Auth0", "Figma"],
      links=[("GitHub", "https://github.com/godfreyponce/TechAssistCLONE"), ("Devpost", "https://devpost.com/software/techassist"), ("Video", "https://www.youtube.com/watch?v=RTfW7j82g7E")],
      cover=None, alt=None),
]
N_ALL = len(re.findall(r'^    title: "', open("/Users/geovponce/Developer/personalWebsite/lib/projects.ts").read(), re.M))
for p in PROJ:
    for f in [p["logo"], p["cover"]] + [TECH[t] for t in p["tags"]]:
        assert f is None or os.path.exists(os.path.join(PUB, f)), f
short_date = lambda d: d.split()[0][:3] + " " + d.split()[1]

def links(p):
    return ", ".join(ext(u, "ix-a", n) for n, u in p["links"])
def stack(p, labels=False):
    li = "".join(f'<li title="{t}"><img src="{TECH[t]}" alt="" width="16" height="16"><span{"" if labels else " class=ix-sr"}>{t}</span></li>' for t in p["tags"])
    return f'<ul class="a-st" aria-label="Built with">{li}</ul>'

HEAD = '\n  <section class="ix-sec" aria-labelledby="ix-lab">\n    <h2 class="ix-h" id="ix-lab">The Lab&nbsp;&raquo;</h2>\n'
MORE = f'    <p class="ix-more"><a class="ix-btn" href="https://godfreyponce.dev/projects">See all projects ({N_ALL}) <span aria-hidden="true">&rarr;</span></a></p>\n  </section>'
STREAK = L(273, 280)
assert STREAK.strip().startswith('<div class="ix-streak">') and STREAK.strip().endswith("</div>")
HEAT_DATA = L(328, 328)
assert HEAT_DATA.strip().startswith("var HEAT=[")
LAB_JS = HEAT_DATA + """
  // Heatmap cells: the last N weeks of the snapshot. Dark scale on the dark tile, GitHub's light scale on the page ground.
  var PAL={dark:["rgba(255,255,255,.06)","#0e4429","#006d32","#26a641","#39d353"],light:["#ebedf0","#9be9a8","#40c463","#30a14e","#216e39"]};
  document.querySelectorAll('[data-heat]').forEach(function(h){
    var w=+h.dataset.heat,pal=PAL[h.dataset.pal||'dark'],f=document.createDocumentFragment();
    for(var c=53-w;c<53;c++)for(var r=0;r<7;r++){var e=document.createElement('i');e.style.background=pal[+HEAT[r][c]];f.appendChild(e)}
    h.appendChild(f);
  });
""" + L(334, 345) + "\n"
assert "getElementById('ix-num')" in LAB_JS
GH_HREF = 'href="https://github.com/godfreyponce" target="_blank" rel="noopener noreferrer"'

# ---- A Rows: the same two-column list as Work Experience; GitHub is the sixth entry ----
def a_proj(p):
    return f"""      <li id="lab-{p['k']}">
        <p class="a-t"><img class="a-org p-logo" src="{p['logo']}" alt="" width="22" height="22"><span><span class="ix-b">{p['t']}</span> &ndash; {p['kind']}</span></p>
        <div class="a-in">
          <p class="a-desc">{p['short']}</p>
          {stack(p)}
          <p class="ix-d">{p['date']}, {links(p)}</p>
        </div>
      </li>"""
LAB_A = HEAD + '    <ul class="a-li">\n' + "\n".join(a_proj(p) for p in PROJ) + f"""
      <li id="lab-github">
        <p class="a-t"><span class="a-org p-ghm">{GH_SVG}</span><span><a class="ix-b" {GH_HREF}>GitHub</a> &ndash; last 26 weeks</span></p>
        <div class="a-in">
          <p class="a-desc">Explore my repositories and contributions.</p>
          <a class="p-heat ix-heat" {GH_HREF} data-heat="26" data-pal="light" aria-label="GitHub contributions, last 26 weeks"></a>
{STREAK}
        </div>
      </li>
    </ul>
""" + MORE
CSS_A = """
.p-logo{object-fit:contain;border-radius:0}
.p-ghm{display:flex;color:#1c1917}.p-ghm svg{width:100%;height:100%}
.p-heat{display:grid;width:100%;max-width:320px;margin:10px 0 6px}
.p-heat i{border-radius:2px}
.a-in .ix-streak{max-width:320px}
"""

# ---- B Cards: genesiating's measured 3-up cards (round 3's Lab), with the stack under each paragraph ----
def b_card(p):
    cover, alt = ("projects/land/land-inside.jpg", "The real LAND box with its lid lifted and a Raspberry Pi 5 inside") if p["k"] == "land" else (p["cover"], p["alt"])  # the poster cover loses its words at 2.4:1
    slot = (f'<img class="ix-slot" src="{cover}" alt="{alt}">' if cover else
            '<div class="ix-slot ix-dk ix-phones"><img src="projects/techassist/techassist-scan.jpeg" alt="TechAssist QR scanner screen"><img src="projects/techassist/techassist-home.jpg" alt="TechAssist home screen with the work order list"><img src="projects/techassist/techassist-search.jpg" alt="TechAssist troubleshooting article search"></div>')
    return f"""      <li id="lab-{p['k']}">
        {slot}
        <p class="ix-eye">{p['kind']}, {short_date(p['date'])}</p>
        <h3 class="ix-ct">{p['t']}</h3>
        <p class="ix-cp">{p['short']}</p>
        {stack(p)}
        <p class="ix-cl">{links(p)}</p>
      </li>"""
LAB_B = HEAD + '    <ul class="ix-cards">\n' + "\n".join(b_card(p) for p in PROJ) + f"""
      <li id="lab-github">
        <a class="ix-slot ix-dk ix-gh" {GH_HREF} aria-label="GitHub contributions, last 26 weeks"><span class="ix-heat" data-heat="26"></span></a>
        <p class="ix-eye">GitHub, last 26 weeks</p>
        <h3 class="ix-ct">View more on GitHub</h3>
        <p class="ix-cp">Explore my repositories and <a class="ix-a" {GH_HREF}>contributions</a>.</p>
{STREAK}
      </li>
    </ul>
""" + MORE
CSS_B = """
.ix-cards .a-st{margin-top:12px}
.ix-cards>li:hover .a-st img{filter:none;opacity:1}
"""

# ---- C Lead: LAND large, the other four in one row, then the year of GitHub as a full-column band ----
LEAD, REST = PROJ[0], PROJ[1:]
def c_item(p):
    return f"""      <li id="lab-{p['k']}">
        <p class="a-t"><img class="a-org p-logo" src="{p['logo']}" alt="" width="22" height="22"><span class="ix-b">{p['t']}</span></p>
        <p class="a-desc">{p['short']}</p>
        {stack(p)}
        <p class="ix-d">{short_date(p['date'])}</p>
        <p class="c-ln">{links(p)}</p>
      </li>"""
LAB_C = HEAD + f"""    <div class="c-lead" id="lab-{LEAD['k']}">
      <img class="c-img" src="{LEAD['cover']}" alt="{LEAD['alt']}" width="1500" height="1000">
      <div>
        <p class="ix-eye">{LEAD['kind']}, {short_date(LEAD['date'])}</p>
        <h3 class="ix-ct">{LEAD['t']}</h3>
        <p class="ix-cp">{LEAD['desc']}</p>
        {stack(LEAD, labels=True)}
        <p class="ix-cl">{links(LEAD)}</p>
      </div>
    </div>
    <ul class="c-row">
{chr(10).join(c_item(p) for p in REST)}
    </ul>
    <a class="c-gh ix-gh" {GH_HREF} aria-label="GitHub contributions, last 52 weeks"><span class="ix-heat c-heat" data-heat="53"></span></a>
    <div class="c-ghl"><p class="ix-d">GitHub, last 52 weeks. <a class="ix-a" {GH_HREF}>View more on GitHub</a></p>
{STREAK}
    </div>
""" + MORE
CSS_C = """
.p-logo{object-fit:contain;border-radius:0}
.c-ln{color:#a8a29e}
.c-lead{display:grid;grid-template-columns:7fr 5fr;column-gap:30px;align-items:start}
.c-img{display:block;width:100%;height:auto;aspect-ratio:3/2;object-fit:cover}
.c-lead .ix-eye{margin-top:0}
.c-lead .a-st{margin-top:14px;gap:6px 16px}
.c-lead .a-st li{display:flex;align-items:center;gap:6px;font-size:13.5px;color:#78716c}
.c-lead:hover .a-st img,.c-row>li:hover .a-st img{filter:none;opacity:1}
.c-row{list-style:none;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));column-gap:24px;margin-top:56px}
.c-row .a-desc{margin-top:4px}
.c-gh{display:block;margin-top:56px;padding:24px;background:#1c1917}
.c-heat{width:100%;grid-template-columns:repeat(53,minmax(0,1fr))}
.c-ghl{margin-top:12px;display:flex;align-items:center;justify-content:space-between;gap:16px}
.c-ghl .ix-streak{margin-top:0;gap:16px}
@media (max-width:767px){
  .c-lead{grid-template-columns:minmax(0,1fr)}.c-lead .ix-eye{margin-top:20px}
  .c-row{grid-template-columns:minmax(0,1fr);row-gap:32px}
  .c-gh{padding:16px}.c-heat{grid-template-columns:repeat(26,minmax(0,1fr))}.c-heat i:nth-child(-n+189){display:none}
  .c-ghl{flex-direction:column;align-items:flex-start}
}
"""

LAB = {"a": ("Lab rows", CSS_A, LAB_A), "b": ("Lab cards", CSS_B, LAB_B), "c": ("Lab lead", CSS_C, LAB_C)}
for k, (title, css, lab) in []:  # decision 24: D won; A/B/C are no longer written (LAB kept for reference)
    v = page(k.upper(), title, A_CSS + "\n/* round 5 pick C */\n" + FIX["c"][1] + "\n/* decision 22: the emoji cursor */\n" + CUR_CSS
             + "\n/* round 6: The Lab, variant " + k.upper() + " */\n" + css, a_body(False, lab), act_extra=A_ACT)
    assert v.count("})();\n</script>") == 1 and v.count(SOCCER_A) == 1
    v = v.replace("})();\n</script>", NAV_JS + LAB_JS + "})();\n</script>")
    assert "·" not in v and "—" not in v, k
    open(os.path.join(PUB, f"preview-{k}.html"), "w").write(v)
    print(k, title, len(v))
open(os.path.join(SP, "balls.json"), "w").write(__import__("json").dumps({"a": BALL_A, "b": BALL_B, "c": BALL_C}))

# =============================== decision 23: preview D, the live Lab (ProjectStack + ProjectCard variant="stack") ===============================
# Data is read from lib/projects.ts so the cards match the live site; A/B/C above stay as they are.
TS = open("/Users/geovponce/Developer/personalWebsite/lib/projects.ts").read()
STR = r'"((?:[^"\\]|\\.)*)"'
TECH_ICON = {a or b: c for a, b, c in re.findall(r'^  (?:"([^"]+)"|(\w+)): "(/tech/[^"]+)"', TS, re.M)}
assert TECH_ICON["Raspberry Pi"] == "/tech/raspberrypi.svg" and TECH_ICON["FAISS"] == "/tech/meta.svg"
ENTRIES = TS.split("export const projects: Project[] = [", 1)[1].split("\n  },\n")
def field(b, name):
    m = re.search(r"^    %s:\s*%s" % (name, STR), b, re.M)
    return m and m.group(1)
def media(b):
    blk = re.search(r"^    media: \[(.*?)\n    \]", b, re.M | re.S)
    out = []
    for line in re.findall(r"\{ type: .*? \}", blk.group(1)) if blk else []:
        it = dict(re.findall(r'(\w+): ' + STR, line))
        assert it["type"] != "youtube" or it.get("videoId"), line
        if it["src"]:
            it["src"] = it["src"].lstrip("/")
            assert os.path.exists(os.path.join(PUB, it["src"])), it["src"]
        out.append(it)
    return out
LIVE = []
for b in ENTRIES:
    if not re.search(r"^    featured: true,", b, re.M):
        continue
    # 2026-11-10: LAND's full description overflows the 440px stack card, so its card shows shortDesc
    LIVE.append(dict(t=field(b, "title"), desc=field(b, "shortDesc" if field(b, "title") == "LAND" else "description"), status=field(b, "status"), date=field(b, "date"),
                     icon=(field(b, "iconSrc") or "").lstrip("/"), gh=field(b, "githubLink"), dp=field(b, "devpostLink"),
                     link=field(b, "link"), tags=re.findall(STR, re.search(r"^    tags: \[(.*?)\]", b, re.M).group(1)), media=media(b)))
assert [p["t"] for p in LIVE] == [p["t"] for p in PROJ], [p["t"] for p in LIVE]
# 2026-11-10 owner pick: the dark 3:2 LAND photo shows whole (contain over its blurred copy); cover cropped its text and inset
LAND_PHOTO = [it for it in LIVE[0]["media"] if it["src"] == "projects/land/land-person-and-box.jpg"]
assert len(LAND_PHOTO) == 1
LAND_PHOTO[0]["fit"] = "contain"
for p in LIVE:
    assert p["icon"] and os.path.exists(os.path.join(PUB, p["icon"])), p["icon"]
    for t in p["tags"]:
        assert t not in TECH_ICON or os.path.exists(os.path.join(PUB, TECH_ICON[t].lstrip("/"))), t
STATUS = {"live": "Live", "building": "Building", "hackathon": "Hackathon", "project": "Project", "sprint": "Sprint"}
esc = lambda s: html.escape(s, quote=True)

def lucide(paths, size):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
            f'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{paths}</svg>')
I_ARROW = '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>'
I_UP = '<path d="m18 15-6-6-6 6"/>'
I_LEFT, I_RIGHT = '<path d="m15 18-6-6 6-6"/>', '<path d="m9 18 6-6-6-6"/>'
I_FLASK = '<path d="M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2"/><path d="M6.453 15h11.094"/><path d="M8.5 2h7"/>'
I_GH = '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>'

def slide(it, title, active):
    if it["type"] == "youtube":
        inner = ""  # the iframe mounts only while its slide is active, as in MediaCarousel
        data = f' data-yt="{it["videoId"]}"'
    else:
        data = ""
        alt = esc(it.get("alt") or title)
        if it.get("fit") == "contain":
            inner = (f'<img class="lm-blur" src="{it["src"]}" alt="" aria-hidden="true" draggable="false" loading="lazy">'
                     f'<img class="lm-contain" src="{it["src"]}" alt="{alt}" draggable="false" loading="lazy">')
        else:
            pos = f' style="object-position:{it["position"]}"' if it.get("position") else ""
            inner = f'<img class="lm-cover" src="{it["src"]}" alt="{alt}"{pos} draggable="false" loading="lazy">'
    return f'<div class="lm-slide"{data}{"" if active else " aria-hidden=\"true\""}>{inner}</div>'

def carousel(p):
    items = p["media"]
    many = len(items) > 1
    slides = "".join(slide(it, p["t"], i == 0) for i, it in enumerate(items))
    ctrl = ""
    if many:
        dots = "".join(f'<button class="lm-dot{" is-on" if i == 0 else ""}" type="button" aria-label="Go to slide {i + 1}"></button>' for i in range(len(items)))
        ctrl = (f'<button class="lm-arr lm-prev" type="button" aria-label="Previous slide" hidden>{lucide(I_LEFT, 16)}</button>'
                f'<button class="lm-arr lm-next" type="button" aria-label="Next slide">{lucide(I_RIGHT, 16)}</button>'
                f'<div class="lm-dots">{dots}</div>')
    return (f'<div class="lm" role="region" aria-roledescription="carousel" aria-label="{esc(p["t"])}"{" tabindex=\"0\"" if many else ""}>'
            f'<div class="lm-view"><div class="lm-track">{slides}</div></div>{ctrl}</div>')

def chip(t):
    if t not in TECH_ICON:
        return f'<span class="lc-badge">{t}</span>'
    src = TECH_ICON[t].lstrip("/")
    return (f'<span class="lc-chip" tabindex="0"><img src="{src}" alt="{esc(t)}" width="20" height="20"><span class="lc-tip">{t}</span></span>'
            f'<span class="lc-chip-touch"><span class="lc-badge"><img src="{src}" alt="" width="13" height="13">{t}</span></span>')

def card(p, featured):
    rows = []
    if p["gh"]:
        rows.append(f'<a class="lc-ln" href="{p["gh"]}" target="_blank" rel="noopener noreferrer">{lucide(I_GH, 16)} GitHub</a>')
    if p["dp"]:
        rows.append(f'<a class="lc-ln" href="{p["dp"]}" target="_blank" rel="noopener noreferrer">{lucide(I_FLASK, 16)} Devpost</a>')
    if p["link"]:
        rows.append(f'<a class="lc-ln" href="{p["link"]}" target="_blank" rel="noopener noreferrer">{lucide(I_ARROW, 16)} Live demo</a>')
    view = ""
    if rows:
        date = f'<span class="lc-date">{p["date"]}</span>' if p["date"] else ""
        view = f"""
          <div class="lc-view">
            <button class="lc-btn" type="button" aria-expanded="false">View project <span class="lc-ico"><span class="lc-i-arrow">{lucide(I_ARROW, 14)}</span><span class="lc-i-up">{lucide(I_UP, 14)}</span></span></button>
            <div class="lc-bridge"></div>
            <div class="lc-pop"><div class="lc-pop-in">
              <div class="lc-meta"><div class="lc-chips">{"".join(chip(t) for t in p["tags"])}</div>{date}</div>
              <div class="lc-lns">{"".join(rows)}</div>
            </div></div>
          </div>"""
    return f"""<div class="lc{" is-feat" if featured else ""}">
        <div class="lc-media">{carousel(p)}</div>
        <div class="lc-body"><div class="lc-col">
          <div class="lc-top"><div class="lc-id"><img class="lc-logo" src="{p["icon"]}" alt="{esc(p["t"])} logo" width="40" height="40"><h3 class="lc-h">{p["t"]}</h3></div><span class="lc-badge lc-status">{STATUS[p["status"]]}</span></div>
          <p class="lc-desc">{esc(p["desc"])}</p>{view}
        </div></div>
      </div>"""

TOTAL = len(LIVE) + 1
def stacked(i, inner):
    return f'    <div class="ls-card" style="top:calc(7vh + {i * 12}px)">\n      {inner}\n      <div class="ls-veil" aria-hidden="true"></div>\n    </div>'
GH_ITEM = f"""<div class="lg"><a class="lg-tile" {GH_HREF}>
          <span class="lg-dots"></span>
          <span class="lg-mark">{lucide(I_GH, 48)}</span>
          <span class="lg-copy"><span class="lg-h">View more on GitHub</span><span class="lg-p">Explore my repositories and contributions</span></span>
          <span class="lg-heat" data-heat="53" aria-hidden="true"></span>
        </a></div>
{STREAK}"""
LAB_D = HEAD + '    <div class="ls is-grid" id="ls">\n' + "\n".join(stacked(i, card(p, i == 0)) for i, p in enumerate(LIVE)) + "\n" + \
        stacked(len(LIVE), GH_ITEM).replace('class="ls-card"', 'class="ls-card ls-ghc"', 1) + "\n    </div>\n" + MORE
CSS_D = """
/* ---- the live Lab: ProjectStack.tsx + ProjectCard.tsx variant="stack"; grid fallback under 768px or reduced motion ---- */
.ls{position:relative}
.ls.is-stack{display:flex;flex-direction:column;gap:10vh;max-width:900px;margin-left:auto;margin-right:auto}
.ls.is-stack .ls-card{position:sticky;height:440px;transform-origin:top center;will-change:transform}
.ls-veil{position:absolute;inset:0;background:#fafaf9;opacity:0;pointer-events:none;display:none}
.ls.is-stack .ls-veil{display:block}
.ls.is-grid{display:grid;grid-template-columns:minmax(0,1fr);gap:24px}
.ls.is-grid .ls-card{position:relative;top:auto!important}
@media (min-width:768px){.ls.is-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.ls.is-grid .ls-card:first-child{grid-column:span 2}}

/* the card */
.lc{position:relative;display:flex;flex-direction:column;height:100%;overflow:hidden;background:#fff}
.is-stack .lc{flex-direction:row;background:rgba(255,255,255,.85);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px)}
.lc-media{position:relative;display:flex;align-items:center;justify-content:center;width:100%;aspect-ratio:16/9;overflow:hidden;background:#f5f5f4}
.is-stack .lc-media{width:55%;height:100%;aspect-ratio:auto;flex:none}
.lc-body{display:flex;flex-grow:1;flex-direction:column;justify-content:space-between;padding:24px 32px}
.is-stack .lc-body{position:relative;width:45%;justify-content:center;padding:40px}
@media (min-width:768px){
  .is-grid .lc.is-feat{flex-direction:row}
  .is-grid .lc.is-feat .lc-media{width:50%;aspect-ratio:auto;min-height:384px;flex:none}
  .is-grid .lc.is-feat .lc-body{width:50%;padding:40px}
}
.lc-col{display:flex;flex-direction:column}
.lc-top{margin-bottom:16px;display:flex;min-width:0;align-items:center;gap:8px}
.lc-id{display:contents}
@media (min-width:640px){.lc-top{justify-content:space-between;gap:16px}.is-stack .lc-top{flex-wrap:wrap;row-gap:12px}.lc-id{display:flex;align-items:center;gap:16px}}
.lc-logo{display:block;width:40px;height:40px;flex:none;border-radius:4px;object-fit:contain}
.lc-h{min-width:0;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-family:'Spectral',ui-serif,Georgia,serif;font-size:1.03125rem;line-height:1.3;letter-spacing:-.3px;font-weight:500;color:#1c1917}
@media (min-width:640px){.lc-h{flex:none;overflow:visible;text-overflow:clip;white-space:normal}}
.lc-badge{display:inline-flex;align-items:center;gap:6px;border-radius:4px;padding:4px 8px;font-size:12px;line-height:16px;font-weight:500;border:1px solid #e7e5e4;color:#78716c}
.lc-badge img{opacity:.75}
.lc-status{flex:none;border:0;border-radius:0;padding:0}
@media (max-width:639px){.lc-status{font-size:10px}}
.lc-desc{margin-top:8px;font-size:.953125rem;line-height:1.7;color:#78716c}
.lc-view{position:relative;margin-top:24px;width:fit-content}
.lc-btn{display:inline-flex;align-items:center;gap:6px;font:inherit;font-size:14px;line-height:20px;font-weight:500;color:#1c1917;background:none;border:0;padding:0;cursor:pointer;transition:color .15s}
.lc-btn:hover{color:#c2410c}
.lc-ico{display:inline-flex;transition:transform .2s}
.lc-btn:hover .lc-ico{transform:translate(4px,-2px)}
.lc-ico svg{display:block}
.lc-i-up,.lc-view.is-open .lc-i-arrow{display:none}
.lc-view.is-open .lc-i-up{display:inline}
.lc-bridge{position:absolute;left:0;top:100%;height:16px;width:100%}
.is-stack .lc-bridge{top:auto;bottom:100%;height:12px}
.lc-pop{position:relative;z-index:20;overflow:hidden;margin-top:0;max-height:0;opacity:0;transition:max-height .3s ease-out,opacity .3s ease-out,margin .3s ease-out}
.lc-view.is-open .lc-pop{margin-top:8px;max-height:320px;opacity:1}
.is-stack .lc-pop{position:absolute;bottom:100%;left:0;z-index:30;margin:0 0 8px;width:288px;max-width:80vw;max-height:none;overflow:visible;pointer-events:none;transition:opacity .2s}
.is-stack .lc-view.is-open .lc-pop{margin:0 0 8px;max-height:none;pointer-events:auto}
.lc-pop-in{display:flex;flex-direction:column;gap:16px;border:1px solid #e7e5e4;background:#f5f5f4;padding:16px}
.lc-meta{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px;border-bottom:1px solid #e7e5e4;padding:24px 0 8px}
.lc-chips{display:flex;flex-wrap:wrap;align-items:center;gap:16px}
.lc-chip{position:relative;display:inline-flex;outline-offset:4px}
.lc-chip img{display:block;opacity:.75;transition:opacity .15s,transform .15s}
.lc-chip:hover img,.lc-chip:focus-visible img{opacity:1;transform:translateY(-2px)}
.lc-tip{pointer-events:none;position:absolute;bottom:100%;left:50%;margin-bottom:8px;transform:translateX(-50%);white-space:nowrap;border-radius:4px;border:1px solid #e7e5e4;background:#fafaf9;padding:2px 6px;font-size:12px;line-height:16px;font-weight:500;color:#1c1917;opacity:0;transition:opacity .15s}
.lc-chip:hover .lc-tip,.lc-chip:focus-visible .lc-tip{opacity:1}
.lc-chip-touch{display:none}
@media (hover:none){.lc-chip{display:none}.lc-chip-touch{display:contents}}
.lc-date{margin-left:auto;font-size:12px;line-height:16px;font-weight:500;text-transform:uppercase;letter-spacing:.05em;color:#78716c}
.lc-lns{display:flex;flex-direction:column;gap:4px}
.lc-ln{display:flex;align-items:center;gap:8px;border-radius:4px;border:1px solid transparent;padding:8px;font-size:14px;line-height:20px;color:#44403c;text-decoration:none;transition:color .15s,background-color .15s,border-color .15s}
.lc-ln:hover{border-color:#e7e5e4;background:#fff;color:#1c1917}

/* the carousel (MediaCarousel.tsx): arrows on hover, dots, arrow keys, trackpad swipe */
.lm{position:relative;width:100%;height:100%;outline:none}
.lm:focus-visible{box-shadow:0 0 0 2px rgba(28,25,23,.4)}
.lm-view{position:relative;width:100%;height:100%;overflow:hidden}
.lm-track{display:flex;height:100%;transition:transform .5s cubic-bezier(.22,1,.36,1)}
.lm-slide{position:relative;width:100%;height:100%;flex:none;user-select:none}
.lm-slide[aria-hidden]{pointer-events:none}
.lm-slide img,.lm-slide iframe{position:absolute;inset:0;width:100%;height:100%;border:0}
.lm-cover{object-fit:cover}
.lm-blur{object-fit:cover;opacity:.3;filter:blur(40px);transform:scale(1.1)}
.lm-contain{object-fit:contain;padding:24px;box-sizing:border-box}
.lm-arr{position:absolute;top:50%;z-index:10;display:flex;width:32px;height:32px;align-items:center;justify-content:center;transform:translateY(-50%);border-radius:999px;border:1px solid #e7e5e4;background:rgba(255,255,255,.8);-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px);color:#44403c;padding:0;cursor:pointer;opacity:0;transition:opacity .15s,background-color .15s}
.lm-arr[hidden]{display:none}
.lm-arr:hover{background:#fff}
.lm:hover .lm-arr{opacity:1}
.lm-prev{left:8px}.lm-next{right:8px}
.lm-dots{position:absolute;bottom:12px;left:50%;z-index:10;display:flex;align-items:center;gap:6px;transform:translateX(-50%)}
.lm-dot{height:6px;width:6px;border-radius:999px;border:0;padding:0;background:#a8a29e;cursor:pointer;transition:all .2s}
.lm-dot:hover{background:#78716c}
.lm-dot.is-on{width:16px;background:#1c1917}

/* the GitHub tile, last card; the streak row hangs under it in the stack */
.ls-ghc{display:flex;flex-direction:column;gap:12px}
.is-stack .ls-ghc{display:block}
.lg{flex:1;min-height:0}
.is-stack .lg{height:100%}
.lg-tile{position:relative;display:flex;height:100%;flex-direction:column;align-items:center;justify-content:center;gap:16px;overflow:hidden;background:#1c1917;padding:32px;text-align:center;color:#fff;text-decoration:none;transition:background-color .15s}
.is-grid .lg-tile{min-height:240px}
.lg-tile:hover{background:#44403c}
.lg-dots{position:absolute;inset:0;background-image:radial-gradient(#fff 1px,transparent 1px);background-size:16px 16px;opacity:.1}
.lg-mark,.lg-copy,.lg-heat{position:relative;z-index:10}
.lg-mark{display:flex;color:#a8a29e;transition:color .15s}
.lg-tile:hover .lg-mark{color:#fff}
.lg-copy{display:block}
.lg-h{display:block;font-family:'Spectral',ui-serif,Georgia,serif;font-size:1.03125rem;line-height:1.3;letter-spacing:-.3px;font-weight:500}
.lg-p{display:block;margin-top:8px;color:#a8a29e}
.lg-heat{display:none;margin-top:16px;grid-auto-flow:column;grid-template-rows:repeat(7,9px);grid-auto-columns:9px;gap:3px}
.is-stack .lg-heat{display:grid}
.lg-heat i{border-radius:2px}
.ls-ghc .ix-streak{margin-top:0}
.is-stack .ls-ghc .ix-streak{position:absolute;left:0;right:0;top:100%;margin-top:12px}
@media (prefers-reduced-motion:reduce){.lm-track{transition:none}}
"""
STACK_JS = """
  // decision 23: the live Lab. Stack at 768px and up without reduced motion, else the grid (ProjectStack.tsx).
  (function(){
    var ls=document.getElementById('ls');if(!ls)return;
    var cards=[].slice.call(ls.querySelectorAll('.ls-card')),total=cards.length,mq=matchMedia('(min-width: 768px)'),on=false,raf=0;
    var clamp=function(v){return v<0?0:v>1?1:v};
    // useScroll offset ["start start","end end"]: 0 when the stack's top meets the viewport top, 1 when its bottom meets the viewport bottom.
    var frame=function(){
      raf=0;if(!on)return;
      var r=ls.getBoundingClientRect(),span=r.height-innerHeight,p=span>0?clamp(-r.top/span):(r.top<=0?1:0);
      cards.forEach(function(c,i){
        var s0=i/total,target=1-(total-1-i)*0.04;
        c.style.transform='scale('+(1+(target-1)*clamp((p-s0)/(1-s0)))+')';
        c.lastElementChild.style.opacity=i===total-1?0:0.45*clamp((p-s0)*total);
      });
    };
    var ask=function(){if(!raf)raf=requestAnimationFrame(frame)};
    var mode=function(){
      on=mq.matches&&!reduce;
      ls.classList.toggle('is-stack',on);ls.classList.toggle('is-grid',!on);
      if(!on)cards.forEach(function(c){c.style.transform='';c.lastElementChild.style.opacity=''});
      ask();
    };
    mq.addEventListener('change',mode);addEventListener('scroll',ask,{passive:true});addEventListener('resize',ask);
    mode();

    // View project: opens on hover, toggles on click (ProjectCard.tsx).
    ls.querySelectorAll('.lc-view').forEach(function(v){
      var b=v.querySelector('.lc-btn');
      var set=function(open){v.classList.toggle('is-open',open);b.setAttribute('aria-expanded',open)};
      v.addEventListener('mouseenter',function(){set(true)});v.addEventListener('mouseleave',function(){set(false)});
      b.addEventListener('click',function(){set(!v.classList.contains('is-open'))});
    });

    // Carousel (MediaCarousel.tsx): a YouTube slide mounts its iframe only while active.
    ls.querySelectorAll('.lm').forEach(function(m){
      var track=m.querySelector('.lm-track'),slides=[].slice.call(track.children),dots=[].slice.call(m.querySelectorAll('.lm-dot'));
      var prev=m.querySelector('.lm-prev'),next=m.querySelector('.lm-next'),idx=0,n=slides.length;
      var show=function(i){
        idx=Math.max(0,Math.min(n-1,i));
        track.style.transform='translateX('+(-100*idx)+'%)';
        slides.forEach(function(s,k){
          var act=k===idx;
          if(act)s.removeAttribute('aria-hidden');else s.setAttribute('aria-hidden','true');
          if(s.dataset.yt){
            if(act&&!s.firstChild){var f=document.createElement('iframe');f.src='https://www.youtube.com/embed/'+s.dataset.yt+'?autoplay=0&mute=1&controls=1&loop=1&playlist='+s.dataset.yt;f.title=m.getAttribute('aria-label');f.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';f.allowFullscreen=true;s.appendChild(f)}
            else if(!act&&s.firstChild)s.textContent='';
          }
        });
        dots.forEach(function(d,k){d.classList.toggle('is-on',k===idx)});
        if(prev){prev.hidden=idx===0;next.hidden=idx===n-1}
      };
      if(n<2){show(0);return}
      prev.addEventListener('click',function(){show(idx-1)});next.addEventListener('click',function(){show(idx+1)});
      dots.forEach(function(d,k){d.addEventListener('click',function(){show(k)})});
      m.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){e.preventDefault();show(idx+1)}else if(e.key==='ArrowLeft'){e.preventDefault();show(idx-1)}});
      // Trackpad: WHEEL_FIRE_PX 40 and WHEEL_QUIET_MS 150, the constants MediaCarousel.tsx uses.
      var acc=0,locked=false,last=0;
      m.querySelector('.lm-view').addEventListener('wheel',function(e){
        if(Math.abs(e.deltaX)<=Math.abs(e.deltaY))return;
        e.preventDefault();
        if(e.timeStamp-last>150){acc=0;locked=false}
        last=e.timeStamp;if(locked)return;
        acc+=e.deltaX;if(Math.abs(acc)>=40){locked=true;show(idx+Math.sign(acc))}
      },{passive:false});
      show(0);
    });
  })();
"""
v = page("D", "Live Lab stack", A_CSS + "\n/* round 5 pick C */\n" + FIX["c"][1] + "\n/* decision 22: the emoji cursor */\n" + CUR_CSS
         + "\n/* decision 23: The Lab, the live stack */\n" + CSS_D, a_body(False, LAB_D), act_extra=A_ACT)
assert v.count("})();\n</script>") == 1 and v.count(SOCCER_A) == 1 and v.count('id="ix-num"') == 1
v = v.replace("})();\n</script>", NAV_JS + LAB_JS + STACK_JS + "})();\n</script>")
assert "·" not in v and "—" not in v, "d"
open(os.path.join(PUB, "preview-d.html"), "w").write(v)
print("d", "Live Lab stack", len(v))

# =============================== decision 26: Passions in 3 shapes, each on preview D ===============================
# Copy is the live components/sections/Passions.tsx; Snowboarding and Home Lab are text only; no "Beyond my Mac".
D_CSS = A_CSS + "\n/* round 5 pick C */\n" + FIX["c"][1] + "\n/* decision 22: the emoji cursor */\n" + CUR_CSS + "\n/* decision 23: The Lab, the live stack */\n" + CSS_D
D_BODY = a_body(False, LAB_D)
STUB = re.search(r'\n  <section class="ix-sec a-soc" id="soccer".*?</section>', D_BODY, re.S).group(0)
SOC_T, SOC_P = "The Beautiful Game", "A lifelong athlete, I believe the best results come from disciplined teamwork, bringing in the same energy and translating it over to professional environments."
SNOW_T = "Carving Lines"
LAB_T, LAB_P = "Self-hosted by default", "I self host my own infrastructure to avoid paying for subscriptions and to keep my data secure/private."
SOC_IMG = '<img class="{cls}" src="godfrey_soccerShot.jpg" alt="Godfrey playing soccer" width="1400" height="933" loading="lazy">'
PASS_HEAD = '\n  <section class="ix-sec ps" id="soccer" aria-labelledby="ix-pass">\n    <h2 class="ix-h" id="ix-pass">Passions&nbsp;&raquo;</h2>\n'

PASS = {
  "a": ("Passions, List", PASS_HEAD + f"""    <figure class="pa-fig">{SOC_IMG.format(cls="pa-img")}</figure>
    <ul class="pa-li">
      <li><p class="ix-b">Soccer &ndash; {SOC_T}</p><p class="a-desc">{SOC_P}</p></li>
      <li><p class="ix-b">Snowboarding &ndash; {SNOW_T}</p></li>
      <li><p class="ix-b">Home Lab &ndash; {LAB_T}</p><p class="a-desc">{LAB_P}</p></li>
    </ul>
  </section>""", """
.pa-fig{margin-top:55px}
.pa-img{display:block;width:100%;height:auto;aspect-ratio:2.2/1;object-fit:cover;object-position:50% 35%}
.pa-li{list-style:none;margin-top:32px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));column-gap:24px;row-gap:24px}
.pa-li .a-desc{margin-top:4px}
@media (max-width:767px){.pa-li{grid-template-columns:1fr}}
"""),
  "b": ("Passions, Plate", PASS_HEAD + f"""    <div class="pb">
      <figure class="pb-fig">{SOC_IMG.format(cls="pb-img")}<figcaption><p class="ix-eye">Soccer</p><p class="ix-ct">{SOC_T}</p><p class="ix-cp">{SOC_P}</p></figcaption></figure>
      <div class="pb-notes">
        <div class="pb-note"><p class="ix-eye">Snowboarding</p><p class="ix-ct">{SNOW_T}</p></div>
        <div class="pb-note"><p class="ix-eye">Home Lab</p><p class="ix-ct">{LAB_T}</p><p class="ix-cp">{LAB_P}</p></div>
      </div>
    </div>
  </section>""", """
.pb{margin-top:55px;display:grid;grid-template-columns:minmax(0,1.75fr) minmax(0,1fr);column-gap:48px;row-gap:40px;align-items:start}
.pb-img{display:block;width:100%;height:auto}
.pb-fig .ix-cp{max-width:536px}
.pb-notes{display:flex;flex-direction:column}
.pb-note+.pb-note{margin-top:28px;border-top:1px solid #e7e5e4}
.pb-note:first-child .ix-eye{margin-top:0}
@media (max-width:767px){.pb{grid-template-columns:1fr}}
"""),
  "c": ("Passions, Tiles", PASS_HEAD + f"""    <ul class="ix-cards pc">
      <li>{SOC_IMG.format(cls="pc-tile pc-img")}<p class="ix-eye">Soccer</p><p class="ix-ct">{SOC_T}</p><p class="ix-cp">{SOC_P}</p></li>
      <li><div class="pc-tile pc-type pc-lt">{SNOW_T}</div><p class="ix-eye">Snowboarding</p></li>
      <li><div class="pc-tile pc-type pc-dk">{LAB_T}</div><p class="ix-eye">Home Lab</p><p class="ix-cp">{LAB_P}</p></li>
    </ul>
  </section>""", """
.pc{margin-top:55px}
.pc-tile{display:block;width:100%;height:auto;aspect-ratio:4/5}
.pc-img{object-fit:cover;object-position:58% 50%}
.pc-type{display:flex;align-items:flex-end;padding:24px;font-family:'Spectral',ui-serif,Georgia,serif;font-style:italic;font-weight:400;font-size:2rem;line-height:1.15;letter-spacing:-.5px}
.pc-lt{background:#f5f5f4;color:#1c1917}
.pc-dk{background:#1c1917;color:#fafaf9}
@media (max-width:767px){.pc{grid-template-columns:1fr}.pc-tile{aspect-ratio:3/2}}
"""),
}
# decision 27: B (Plate) wins; preview-d.html is now the Lab plus Passions B, and A/B/C are no longer written
for k, (title, sec, css) in [("d", PASS["b"])]:
    v = page(k.upper(), "Live Lab and Passions", D_CSS + "\n/* decision 26: Passions */\n" + css, D_BODY.replace(STUB, sec), act_extra=A_ACT)
    assert v.count("})();\n</script>") == 1 and v.count('id="soccer"') == 1 and v.count('id="ix-num"') == 1
    v = v.replace("})();\n</script>", NAV_JS + LAB_JS + STACK_JS + "})();\n</script>")
    assert "·" not in v and "—" not in v, k
    open(os.path.join(PUB, f"preview-{k}.html"), "w").write(v)
    print(k, title, len(v))

# =============================== decision 29: the footer in 3 shapes, each on preview D ===============================
# Each is preview-d with one footer after </main> and the 100px end spacer dropped; preview-d.html is unchanged.
# Copy is the live components/sections/Footer.tsx. The commit line is a FIXED SAMPLE: a static file cannot call /api/latest-commit.
D_PAGE = v
CHEV = ('<svg class="f-chev" viewBox="0 0 4 5" width="8" height="10" shape-rendering="crispEdges" aria-hidden="true">'
        '<g fill="#3b82f6"><rect x="0" y="0" width="2" height="1"/><rect x="1" y="1" width="2" height="1"/></g>'
        '<rect fill="#6366f1" x="2" y="2" width="2" height="1"/>'
        '<g fill="#8b5cf6"><rect x="1" y="3" width="2" height="1"/><rect x="0" y="4" width="2" height="1"/></g></svg>')
COMMIT = f'<span class="f-commit"><!-- sample value -->{CHEV}lines changed today: <span class="ix-add">+120</span> <span class="ix-del">-34</span></span>'
GH_URL, LI_URL = "https://github.com/godfreyponce", "https://linkedin.com/in/godfreyponce"
NEW = 'target="_blank" rel="noopener noreferrer"'
F_CSS = """
.ix-foot{display:block}
.f-col{max-width:1004px;margin:0 auto;padding:0 24px}
.f-commit{display:inline-flex;align-items:center;gap:6px;white-space:nowrap}
.f-chev{display:block}
"""
TOP_JS = """
  // Footer: links to #top scroll smoothly, as the Soccer link does.
  document.querySelectorAll('.ix-foot a[href="#top"]').forEach(function(a){
    a.addEventListener('click',function(e){var t=document.getElementById('top');if(!t)return;e.preventDefault();go(t,'start')});
  });
"""
FOOT = {
  "a": ("Dark reveal", f"""<footer class="ix-foot fa">
  <div class="f-col">
    <p class="fa-name"><a href="#top">Godfrey Ponce</a></p>
    <ul class="fa-links">
      <li><a href="{GH_URL}" {NEW}>GitHub</a><span>github.com/godfreyponce</span></li>
      <li><a href="{LI_URL}" {NEW}>LinkedIn</a><span>linkedin.com/in/godfreyponce</span></li>
      <li><a href="mailto:{MAIL}">Email</a><span>{MAIL}</span></li>
    </ul>
    <div class="fa-row">{COMMIT}<span>&copy; Godfrey Ponce</span></div>
  </div>
</footer>""", """
/* the page slides up off the footer, as the live site and cmrg.me */
.gh-wrap,main.ix{position:relative;z-index:1}
.fa{position:sticky;bottom:0;z-index:0;background:#1c1917;color:#d6d3d1;padding:48px 0}
.fa-name{font-family:'Spectral',ui-serif,Georgia,serif;font-size:1.5rem;line-height:1.3;letter-spacing:-.4px;font-weight:400}
.fa-name a{color:#fafaf9;text-decoration:none}
.fa-links{list-style:none;margin:32px 0 0;padding:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));column-gap:24px;row-gap:20px}
.fa-links a{font-weight:600;color:#fafaf9;text-decoration:none;border-bottom:1px dashed rgba(250,250,249,.4);transition:border-color .2s}
.fa-links a:hover{border-bottom-color:#fafaf9}
.fa-links span{display:block;margin-top:4px;font:400 13px/1.5 'Geist Mono',ui-monospace,monospace;color:#a8a29e;overflow-wrap:anywhere}
.fa-row{margin-top:48px;padding-top:24px;border-top:1px solid rgba(255,255,255,.1);display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px 24px;font:400 12.5px/1.7 'Geist Mono',ui-monospace,monospace;color:#78716c}
.fa .ix-add{color:#4ade80}.fa .ix-del{color:#f87171}
@media (max-width:767px){.fa-links{grid-template-columns:1fr}.fa-row{flex-direction:column}}
@media (prefers-reduced-motion:reduce){.fa-links a{transition:none}}
"""),
  "b": ("Last section", f"""<footer class="ix-foot fb" aria-labelledby="ix-contact">
  <div class="f-col"><div class="fb-in">
    <h2 class="ix-h" id="ix-contact">Contact&nbsp;&raquo;</h2>
    <p class="fb-mail"><a href="mailto:{MAIL}">{MAIL}</a><button class="ix-copy" type="button" data-copy="{MAIL}">copy</button></p>
    <p class="fb-links"><a class="ix-b" href="{GH_URL}" {NEW}>GitHub</a><a class="ix-b" href="{LI_URL}" {NEW}>LinkedIn</a></p>
    <div class="fb-row">{COMMIT}<span>&copy; Godfrey Ponce</span></div>
  </div></div>
</footer>""", """
.fb-in{border-top:1px solid #e7e5e4}
.fb .ix-h{margin-top:55px}
.fb-mail{margin-top:51px;display:flex;flex-wrap:wrap;align-items:baseline;gap:8px 20px}
.fb-mail a{font-family:'Spectral',ui-serif,Georgia,serif;font-weight:400;font-size:clamp(1.5rem,4.2vw,2.5rem);line-height:1.2;letter-spacing:-.6px;color:#1c1917;text-decoration:none;border-bottom:1px dashed rgba(127,127,127,.5);overflow-wrap:anywhere;transition:border-color .2s}
.fb-mail a:hover{border-bottom-color:#1c1917}
.fb-mail .ix-copy{font:400 13px/1.4 'Geist Mono',ui-monospace,monospace}
.fb-links{margin-top:24px;display:flex;gap:24px}
.fb-row{margin-top:64px;padding:24px 0 64px;border-top:1px solid #e7e5e4;display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px 24px;font:400 12.5px/1.7 'Geist Mono',ui-monospace,monospace;color:#a8a29e}
@media (max-width:767px){.fb-row{flex-direction:column}}
@media (prefers-reduced-motion:reduce){.fb-mail a{transition:none}}
"""),
  "c": ("One line", f"""<footer class="ix-foot fc">
  <div class="f-col"><div class="fc-row">
    <span>&copy; 2026 Godfrey Ponce</span>{COMMIT}<a href="#top">Back to top <span aria-hidden="true">&uarr;</span></a>
  </div></div>
</footer>""", """
.fc-row{border-top:1px solid #e7e5e4;padding:24px 0 48px;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px 24px;font:400 12.5px/1.7 'Geist Mono',ui-monospace,monospace;color:#a8a29e}
.fc-row a{color:#78716c;text-decoration:none;border-bottom:1px dashed rgba(127,127,127,.5);transition:color .2s,border-color .2s}
.fc-row a:hover{color:#1c1917;border-bottom-color:#1c1917}
@media (max-width:767px){.fc-row{flex-direction:column;align-items:flex-start}}
@media (prefers-reduced-motion:reduce){.fc-row a{transition:none}}
"""),
}
# decision 30: A (Dark reveal) wins; preview-d.html is now the Lab, Passions B and footer A, and A/B/C are no longer written
for k, (name, foot, css) in [("d", FOOT["a"])]:
    w = D_PAGE
    for old, new in [("<title>Preview D: Live Lab and Passions</title>", "<title>Preview D: Live Lab, Passions and Footer</title>"),
                     ("  <div class=\"ix-end\"></div>\n", ""),
                     ("</style>\n</head>", f"/* decision 29: footer A, {name} */{F_CSS}{css}</style>\n</head>"),
                     ("</main>\n<script>", f"</main>\n{foot}\n<script>"),
                     ("})();\n</script>", TOP_JS + "})();\n</script>")]:
        assert w.count(old) == 1, (k, old)
        w = w.replace(old, new)
    assert "·" not in w and "—" not in w, k
    open(os.path.join(PUB, f"preview-{k}.html"), "w").write(w)
    print(k, "Live Lab, Passions and Footer", len(w))
