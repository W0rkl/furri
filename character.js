/* fui / original vector character rig. All artwork is recolorable and rendered locally. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.FuiCharacter = api;
})(typeof window !== 'undefined' ? window : null, function () {
  'use strict';
  const species = [
    { id: 'fox', label: 'лис' }, { id: 'wolf', label: 'волк' },
    { id: 'cat', label: 'кот' }, { id: 'rabbit', label: 'кролик' },
    { id: 'dragon', label: 'дракон' }, { id: 'deer', label: 'олень' },
    { id: 'hyena', label: 'гиена' }, { id: 'panda', label: 'красная панда' },
    { id: 'bat', label: 'летучая мышь' }, { id: 'leopard', label: 'ирбис' }
  ];
  const poses = [
    { id: 'stand', label: 'на чилле' }, { id: 'wave', label: 'привет!' },
    { id: 'sit', label: 'посидим?' }, { id: 'dance', label: 'в движении' },
    { id: 'hero', label: 'главный герой' }
  ];
  const parts = [
    { id: 'fur', label: 'шерсть' }, { id: 'markings', label: 'светлые участки' },
    { id: 'hair', label: 'волосы' }, { id: 'eyes', label: 'глаза' },
    { id: 'outfit', label: 'одежда' }
  ];
  const defaults = () => ({
    species: 'wolf', pose: 'stand', fur: '#312541', markings: '#fff3e8',
    hair: '#272037', eyes: '#c966ec', outfit: '#ff654b', accessory: 'collar',
    pattern: 'solid', expression: 'smile', name: 'без имени'
  });
  const ink = '#191724';
  const esc = value => String(value == null ? '' : value).replace(/[&<>"']/g, x => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[x]));
  const hex = (value, fallback) => /^#[0-9a-f]{6}$/i.test(value || '') ? value : fallback;
  const enumValue = (value, values, fallback) => values.includes(value) ? value : fallback;
  const lerp = (a, b, n) => [a[0] + (b[0] - a[0]) * n, a[1] + (b[1] - a[1]) * n];
  const dot = p => `${p[0].toFixed(2)} ${p[1].toFixed(2)}`;
  function pointAround(p, q, width, side) {
    const dx = q[0] - p[0], dy = q[1] - p[1], length = Math.hypot(dx, dy) || 1;
    return [p[0] - dy / length * width * side, p[1] + dx / length * width * side];
  }
  function limb(a, b, c, wa, wb, wc) {
    const a1 = pointAround(a, b, wa, 1), a2 = pointAround(a, b, wa, -1);
    const b1 = pointAround(b, c, wb, 1), b2 = pointAround(b, c, wb, -1);
    const c1 = pointAround(c, b, wc, -1), c2 = pointAround(c, b, wc, 1);
    return `M${dot(a1)}Q${dot(lerp(a1, b1, .7))} ${dot(b1)}L${dot(c1)}Q${dot(c)} ${dot(c2)}L${dot(b2)}Q${dot(lerp(b2, a2, .3))} ${dot(a2)}Z`;
  }
  const rigs = {
    stand: { origin: [300, 365], lean: -3, head: 4, left: [[-66,-44],[-90,28],[-79,118]], right: [[66,-44],[92,34],[78,119]], legs: [[[-32,104],[-38,207],[-49,303]],[[32,104],[44,207],[65,301]]] },
    wave: { origin: [300, 369], lean: 2, head: -7, left: [[-66,-44],[-116,-103],[-113,-187]], right: [[66,-44],[97,32],[82,119]], legs: [[[-32,104],[-43,204],[-60,299]],[[32,104],[39,201],[54,296]]] },
    sit: { origin: [300, 412], lean: 0, head: 2, left: [[-66,-44],[-100,30],[-91,100]], right: [[66,-44],[101,32],[91,100]], legs: [[[-32,104],[-109,155],[-82,259]],[[32,104],[103,156],[91,259]]] },
    dance: { origin: [300, 358], lean: -9, head: 9, left: [[-66,-44],[-142,-34],[-198,-83]], right: [[66,-44],[108,-113],[88,-176]], legs: [[[-32,104],[-59,202],[-114,291]],[[32,104],[90,176],[157,223]]] },
    hero: { origin: [300, 365], lean: 4, head: -9, left: [[-66,-44],[-106,19],[-82,105]], right: [[66,-44],[125,8],[67,56]], legs: [[[-32,104],[-58,200],[-81,301]],[[32,104],[57,202],[87,299]]] }
  };
  let serial = 0;
  function render(input, options) {
    options = options || {};
    const d = defaults(), c = Object.assign({}, d, input || {});
    c.species = enumValue(c.species, species.map(x=>x.id), d.species);
    c.pose = enumValue(c.pose, poses.map(x=>x.id), d.pose);
    c.accessory = enumValue(c.accessory, ['none','collar','earring','glasses'], d.accessory);
    c.pattern = enumValue(c.pattern, ['solid','socks','stripes','spots'], d.pattern);
    c.expression = enumValue(c.expression, ['smile','calm','wink'], d.expression);
    for (const part of parts) c[part.id] = hex(c[part.id], d[part.id]);
    const uid = 'fui-rig-' + String(options.idPrefix || 'figure').replace(/[^a-zA-Z0-9_-]/g,'').slice(0,80) + '-' + (++serial);
    const rig = rigs[c.pose];
    const interactive = options.interactive === true;
    const label = `${String(c.name || 'персонаж').slice(0,80)} — ${species.find(s=>s.id===c.species).label}, ${poses.find(p=>p.id===c.pose).label}`;
    const partAttrs = part => `data-part="${part}"${interactive ? ` class="fui-color-region"` : ''}`;
    const p = (path, part, extra='') => `<path d="${path}" fill="${c[part]}" ${partAttrs(part)} ${extra}/>`;
    const line = (path, width=2, color=ink, extra='') => `<path d="${path}" fill="none" stroke="${color}" stroke-width="${width}" ${extra}/>`;
    const shade = (path, opacity=.16) => `<path d="${path}" fill="${ink}" stroke="none" opacity="${opacity}" pointer-events="none"/>`;
    const shine = (path, opacity=.3) => `<path d="${path}" fill="#fff7ef" stroke="none" opacity="${opacity}" pointer-events="none"/>`;
    const isFeline = ['cat','leopard'].includes(c.species);
    const isRound = ['panda','hyena','leopard'].includes(c.species);
    const isLong = ['fox','wolf','hyena','dragon'].includes(c.species);
    const isWinged = ['bat','dragon'].includes(c.species);
    const sleeves = { left: rig.left, right: rig.right };

    function ear(side) {
      const transform = side > 0 ? 'translate(0 0)' : 'scale(-1 1)';
      let art;
      switch (c.species) {
        case 'rabbit':
          art = p('M28 -69Q29 -119 43 -189Q48 -211 60 -204Q76 -193 68 -149L62 -73Z','fur') + p('M40 -90Q39 -132 50 -186Q55 -199 59 -184Q64 -151 52 -95Z','markings') + line('M49 -177Q44 -142 45 -116',1.5);break;
        case 'bat':
          art = p('M24 -65Q28 -125 81 -167Q101 -112 72 -57Z','fur')+p('M37 -77Q42 -118 76 -146Q82 -111 63 -74Z','markings')+line('M48 -84L71 -129M48 -84L67 -100',1.5);break;
        case 'deer':
          art=p('M30 -66Q45 -103 100 -111Q107 -76 61 -52Z','fur')+p('M45 -70Q63 -94 89 -99Q83 -77 57 -64Z','markings')+line('M40 -91Q41 -125 48 -152M44 -130Q23 -128 21 -150M47 -146Q69 -141 74 -161M46 -146L47 -173',7,c.hair)+line('M42 -92Q43 -126 48 -152M44 -130Q23 -128 21 -150M47 -146Q69 -141 74 -161M46 -146L47 -173',2.5,c.markings);break;
        case 'dragon':
          art=p('M26 -60L38 -103L49 -82L82 -112L72 -75L96 -82L67 -42Z','fur')+p('M41 -64L68 -91L63 -66L77 -70L59 -48Z','markings')+p('M34 -83Q35 -124 55 -156Q64 -132 55 -105L50 -76Z','markings')+line('M42 -104L56 -111M45 -116L59 -122',1.5);break;
        case 'panda':
        case 'hyena':
        case 'leopard':
          art=p('M24 -66Q16 -108 42 -122Q67 -135 80 -110Q93 -81 62 -53Z','fur')+p('M36 -74Q30 -101 47 -108Q66 -117 70 -96Q74 -78 56 -65Z','markings')+shade('M29 -93Q34 -114 49 -113Q34 -93 42 -76L35 -68Z',.2);break;
        default:
          art=p(c.species==='wolf'?'M31 -66L43 -172Q85 -151 102 -85L68 -45Z':'M30 -65L61 -174Q94 -135 104 -82L66 -44Z','fur')+p('M46 -84L54 -147Q81 -126 87 -88L63 -65Z','markings')+line('M57 -128L62 -99L58 -92M72 -111L75 -91',1.4);break;
      }
      return `<g transform="${transform}" data-anatomy="ear-${side > 0 ? 'r':'l'}">${art}</g>`;
    }
    function tail() {
      switch(c.species) {
        case 'rabbit':return p('M44 69Q106 62 111 102Q115 135 83 141Q52 143 48 113Z','markings')+line('M81 87l8 8 -3 12M96 111l-8 9',2);
        case 'deer':return p('M48 65Q111 53 102 106Q96 126 70 118Z','fur')+p('M73 77Q98 75 92 103L78 110Z','markings');
        case 'cat':return `<g data-anatomy="tail">${p('M49 100Q132 150 160 99Q181 56 154 25Q145 17 135 22Q125 28 134 41Q155 67 137 90Q113 117 65 78Z','fur')}${shine('M148 30Q172 65 151 95Q137 113 111 111Q161 89 144 46Z',.15)}</g>`;
        case 'bat':return p('M42 77Q100 104 108 153L78 132L57 141L38 112Z','fur');
        case 'dragon':return p('M47 76Q118 85 140 28Q162 -22 205 -5L190 12L203 27L175 28Q160 121 65 124Z','fur')+p('M183 2L202 -27L208 12L227 22L203 27L190 12Z','outfit')+p('M65 103Q147 117 174 28L189 17Q167 131 65 124Z','markings');
        case 'leopard':return p('M44 85Q120 140 165 126Q203 118 195 80Q185 50 163 47Q152 45 149 57Q148 68 167 74Q181 80 173 96Q142 120 62 65Z','fur')+`<g fill="${c.hair}" stroke="none" pointer-events="none"><ellipse cx="118" cy="104" rx="9" ry="7"/><ellipse cx="151" cy="113" rx="7" ry="9"/><ellipse cx="180" cy="84" rx="6" ry="9"/><ellipse cx="164" cy="60" rx="7" ry="5"/></g>`;
        default: {
          const art=p('M44 73Q103 138 147 94Q181 66 169 2Q167 -33 201 -47Q221 -7 218 33L232 23Q224 90 182 131L192 132Q119 177 53 124Z','fur')+p('M170 3Q166 -31 201 -47Q219 -13 218 25L204 16L203 40L184 28L179 50Q172 28 170 3Z','markings')+shade('M54 107Q129 163 189 104Q154 159 94 143L53 124Z',.17)+line('M106 129Q151 140 178 112M189 82L201 62',1.8);
          return art+(c.species==='panda'?`<g fill="${c.hair}" stroke="none" opacity=".8" pointer-events="none"><path d="M174 38Q196 56 217 45L209 66Q193 77 175 62Z"/><path d="M167 90Q180 106 191 114L173 132L151 109Z"/><path d="M114 119L120 151L97 146L96 119Z"/></g>`:'');
        }
      }
    }
    function wing(side) {
      const transform=side<0?'scale(-1 1)':'';
      return `<g transform="${transform}" data-anatomy="wing">${p('M52 -31Q82 -101 139 -134Q169 -149 205 -164Q175 -121 176 -79Q169 -92 154 -87Q140 -83 137 -57Q118 -71 105 -60Q91 -46 89 -14L62 41Z','fur')}${p('M70 -28Q97 -91 179 -141Q142 -106 139 -71Q117 -83 101 -65Q89 -49 85 -19Z','markings')}${line('M71 -25Q108 -95 193 -154M91 -52L138 -72M116 -88L155 -91',2.5)}${shade('M54 -25Q90 -60 96 -63L90 -15L64 36Z',.25)}</g>`;
    }
    function shoe(ankle, side) {
      const x=ankle[0],y=ankle[1];
      return `<g transform="translate(${x} ${y}) rotate(${side === 0 ? -7:6})">${p('M-19 -17L18 -18L23 -3Q36 4 36 16L-23 16Q-29 8 -24 -4Z','outfit')}<path d="M-25 9L35 9L36 18L-27 18Z" fill="${c.markings}" ${partAttrs('markings')}/>${line('M-12 -12L10 -10M-13 -6L12 -4M-14 0L14 2',2,c.markings)}${line('M22 6L23 12',1.5)}${shine('M-17 -15L-12 -15L-16 8L-21 7Z',.28)}</g>`;
    }
    function leg(points,index) {
      const [hip,knee,ankle]=points;
      return `<g data-anatomy="leg-${index}">${p(limb(hip,knee,ankle,31,24,17),'hair')}${shade(limb([hip[0]+12,hip[1]], [knee[0]+10,knee[1]], [ankle[0]+10,ankle[1]],9,6,3),.28)}${line(`M${dot([hip[0],hip[1]+16])}Q${dot([knee[0]-7,knee[1]-6])} ${dot([knee[0]+2,knee[1]+22])}`,1.5,c.markings,'opacity=".24"')}${p(limb(lerp(knee,ankle,.78),lerp(knee,ankle,.9),ankle,19,18,17),'markings')}${line(`M${dot([ankle[0]-18,ankle[1]-18])}L${dot([ankle[0]+17,ankle[1]-18])}`,4,c.outfit)}${shoe(ankle,index)}</g>`;
    }
    function hand(point, side, waving) {
      let rotation=side<0?-9:9;
      if(waving)rotation=side<0?-18:16;
      const x=point[0], y=point[1];
      const transform=`translate(${x} ${y}) rotate(${rotation})${side>0?' scale(-1 1)':''}`;
      if(waving)return `<g transform="${transform}" data-anatomy="hand">${p('M-13 10L-18 -15Q-25 -29 -19 -32Q-14 -34 -9 -20L-7 -16L-9 -43Q-9 -52 -3 -52Q2 -52 1 -43L2 -22L6 -49Q8 -57 13 -54Q16 -52 14 -44L11 -20L18 -39Q22 -47 26 -43Q29 -40 24 -32L17 -13L25 -20Q32 -26 35 -19Q34 -14 24 -4L12 11Z','fur')}${p('M-9 -8Q2 -16 13 -9L14 2L-6 5Z','markings')}${line('M-6 -15L-3 -7M5 -15L4 -6M14 -13L11 -5',1.5)}</g>`;
      return `<g transform="${transform}" data-anatomy="hand">${p('M-13 -5L-12 13Q-9 31 -3 32Q3 33 3 23Q7 33 13 27L17 11Q25 16 26 9Q26 4 17 -4L13 -10Z','fur')}${p('M-7 2Q4 -1 10 4L11 14L-3 16Z','markings')}${line('M-4 19L-3 25M4 17L5 23M11 14L10 22',1.5)}</g>`;
    }
    function arm(points, side) {
      const [shoulder, elbow,wrist]=points;
      const cuff=lerp(elbow,wrist,.66), sleeveEnd=lerp(elbow,wrist,.72);
      const waving=(c.pose==='wave'&&side<0)||(c.pose==='dance'&&side>0);
      let sleeve=p(limb(shoulder,elbow,sleeveEnd,29,24,17),'outfit');
      sleeve+=shade(limb([shoulder[0]+side*12,shoulder[1]], [elbow[0]+side*11,elbow[1]], sleeveEnd,10,9,4),.22);
      sleeve+=p(limb(cuff,sleeveEnd,wrist,18,16,12),'fur');
      if(c.pattern==='socks')sleeve+=p(limb(lerp(sleeveEnd,wrist,.4),lerp(sleeveEnd,wrist,.7),wrist,14,13,12),'markings');
      sleeve+=line(`M${dot(pointAround(cuff,wrist,18,1))}L${dot(pointAround(cuff,wrist,18,-1))}`,6,c.hair);
      sleeve+=line(`M${dot(lerp(shoulder,elbow,.5))}L${dot([elbow[0]-side*11,elbow[1]+4])}`,2,c.markings,'opacity=".45"');
      return `<g data-anatomy="arm-${side<0?'l':'r'}">${sleeve}${hand(wrist,side,waving)}</g>`;
    }
    function facePattern() {
      // Species marks and user patterns are separate layers. The extra pattern
      // sits on the muzzle, away from natural cheek marks and the hair fringe.
      let natural = '';
      if(c.species==='panda')natural=p('M-58 -32Q-38 -47 -18 -28L-22 2Q-44 17 -64 -1ZM18 -28Q40 -48 60 -31L65 -2Q46 15 23 2Z','hair');
      if(c.species==='hyena'||c.species==='leopard')natural=`<g fill="${c.hair}" stroke="none" pointer-events="none"><path d="M-62 12q-8 -4 -10 5q4 11 11 3ZM-50 27q-5 -3 -7 3q3 8 8 2ZM57 13q8 -5 10 4q-3 11 -11 3ZM45 28q5 -5 9 1q-1 8 -8 5Z"/><ellipse cx="-52" cy="-63" rx="6" ry="4"/><ellipse cx="49" cy="-61" rx="5" ry="4"/></g>`;
      if(c.species==='cat')natural=p('M-68 -7L-46 4L-70 3ZM-65 11L-49 17L-64 20ZM68 -7L46 4L70 3ZM65 11L49 17L64 20Z','hair');
      let chosen = '';
      if(c.pattern==='stripes')chosen=p('M-39 13L-20 19L-36 20ZM-31 26L-14 32L-26 34ZM39 13L20 19L36 20ZM31 26L14 32L26 34Z','hair','stroke="none"');
      if(c.pattern==='spots')chosen=p('M-31 14a3 3 0 1 0 6 0a3 3 0 1 0 -6 0M-23 22a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0 -5 0M-34 25a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M25 14a3 3 0 1 0 6 0a3 3 0 1 0 -6 0M18 22a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0 -5 0M30 25a2 2 0 1 0 4 0a2 2 0 1 0 -4 0','hair','stroke="none"');
      return natural + chosen;
    }
    function eye(side) {
      const mirror=side<0?'scale(-1 1)':'';
      const closed=c.expression==='calm'||(c.expression==='wink'&&side>0);
      if(closed)return `<g transform="${mirror}" data-anatomy="eye">${line('M13 -18Q33 -9 53 -23',4)}${line('M45 -18L53 -15M50 -21L58 -20',2)}${line('M19 -37Q34 -43 48 -38',2.5,c.hair)}</g>`;
      return `<g transform="${mirror}" data-anatomy="eye"><path d="M12 -21Q30 -40 53 -26Q47 -5 25 -6Q15 -9 12 -21Z" fill="#fffaf5"/><path d="M25 -29Q33 -34 42 -28L43 -15Q38 -4 28 -8Q22 -16 25 -29Z" fill="${c.eyes}" ${partAttrs('eyes')}/><ellipse cx="33" cy="-20" rx="4.5" ry="11" fill="${ink}" stroke="none" pointer-events="none"/><path d="M26 -9Q35 -4 42 -14" fill="none" stroke="#fff3ed" stroke-width="3" opacity=".65" pointer-events="none"/><ellipse cx="29" cy="-26" rx="4" ry="5" fill="#fff" stroke="none" pointer-events="none"/><circle cx="39" cy="-15" r="2" fill="#fff" stroke="none" pointer-events="none"/>${line('M10 -22Q30 -41 54 -28L59 -33',4)}${line('M18 -45Q36 -51 49 -42',3,c.hair)}${line('M50 -28L59 -26',2.5)}</g>`;
    }
    function head() {
      const muzzle=isLong?'M-39 3Q-24 -4 -8 4L0 10L8 4Q25 -5 41 2L47 18Q26 48 0 50Q-28 46 -46 19Z':'M-35 5Q-17 -3 0 9Q18 -3 36 5L39 24Q16 46 0 45Q-19 43 -39 24Z';
      let art=ear(-1)+ear(1);
      art+=p('M-61 -49Q-52 -95 0 -91Q54 -92 64 -48L76 -9L68 1L79 12L64 17L73 28L56 30Q38 58 0 62Q-39 58 -57 29L-73 27L-64 16L-79 11L-68 0L-77 -9Z','fur');
      art+=shade('M32 -79Q61 -70 64 -45L76 -9L68 1L79 12L64 17L73 28L56 30Q41 50 14 58Q42 28 43 8Q51 -21 32 -79Z',.15);
      art+=p(muzzle,'markings');
      if(c.species==='deer')art+=p('M-10 -57Q0 -65 10 -57L14 8L0 17L-14 8Z','markings');
      art+=facePattern();
      art+=eye(-1)+eye(1);
      art+=`<path d="M-11 8Q0 2 11 8L5 18Q0 21 -5 18Z" fill="${ink}"/><path d="M-6 8L3 7" stroke="#fff7ef" stroke-width="2" opacity=".7"/>`;
      art+=line(c.expression==='smile'?'M0 19L1 27Q16 35 30 23M1 27Q-9 34 -18 27':c.expression==='wink'?'M0 19L0 27Q15 37 32 21M0 27Q-7 31 -15 27':'M0 19L0 27Q9 32 19 27M0 27Q-9 31 -17 27',2);
      if(c.expression!=='calm')art+=`<path d="M21 28L24 35L28 25Z" fill="#fffaf5" stroke-width="1.2"/>`;
      art+=`<g stroke="${c.eyes}" stroke-width="1.5" opacity=".55" pointer-events="none"><path d="M-45 8l-2 5M-40 10l-2 5M-35 11l-2 4M37 11l2 4M42 10l2 5M47 8l2 5"/></g>`;
      if(isFeline)art+=line('M-42 21L-83 18M-43 27L-77 34M42 21L83 18M43 27L77 34',1.4,ink,'opacity=".7"');
      // Asymmetrical, layered fringe — the visible colour of the entire hair is editable.
      art+=p('M-66 -42Q-92 -59 -76 -88L-92 -92Q-70 -93 -56 -112Q-39 -135 -10 -120L-17 -137Q7 -132 25 -114Q51 -113 66 -91L83 -98Q81 -73 66 -58L82 -55Q67 -40 50 -40L57 -27Q33 -27 16 -57Q14 -30 -5 -13L-12 -44Q-22 -24 -33 -23L-27 -60Q-51 -34 -66 -31Z','hair');
      art+=shine('M-58 -103Q-38 -124 -16 -115Q-38 -111 -56 -87L-73 -78Q-72 -89 -58 -103ZM4 -119Q26 -114 39 -98Q22 -101 12 -110ZM24 -91Q49 -89 59 -73L46 -77Z',.16);
      art+=line('M-65 -61Q-57 -94 -27 -108M-36 -66Q-27 -87 -15 -99M-8 -52Q3 -79 -2 -106M29 -59Q31 -72 20 -88M50 -52L61 -48',1.4,c.eyes,'opacity=".5"');
      art+=p('M-66 -36Q-72 -2 -61 33Q-78 51 -80 76Q-59 67 -50 55L-45 79Q-26 61 -26 47L-40 36L-47 17Z','hair');
      art+=p('M64 -34Q70 -1 60 31Q80 44 82 68L66 63L70 83Q49 71 40 53L28 49L40 33L47 15Z','hair');
      art+=line('M-62 8Q-65 36 -60 49M61 11Q61 40 69 54',1.6,c.eyes,'opacity=".4"');
      if(c.accessory==='earring')art+=`<g fill="none" stroke="#d4cfdf" stroke-width="3"><ellipse cx="-65" cy="12" rx="7" ry="10"/><ellipse cx="63" cy="19" rx="5" ry="7"/></g><path d="M-64 22L-65 36" stroke="#d4cfdf" stroke-width="2"/><path d="M-65 34L-59 42L-65 50L-71 42Z" fill="${c.eyes}" ${partAttrs('eyes')}/>`;
      if(c.accessory==='glasses')art+=`<g fill="none" stroke="#d4cfdf" stroke-width="2.5"><path d="M-59 -29L-13 -28L-16 -5Q-35 3 -53 -8ZM13 -28L58 -29L53 -8Q36 3 16 -5Z"/><path d="M-13 -22Q0 -29 13 -22M-60 -25L-69 -29M59 -25L69 -29"/></g>`;
      return `<g transform="translate(0 -151) rotate(${rig.head})" data-anatomy="head">${art}</g>`;
    }
    function torso() {
      let art=p('M-24 -102L-26 -68L-56 -49L-40 29L37 29L55 -49L26 -68L24 -101Z','fur');
      art+=p('M-15 -94L-17 -66L-27 -56L-15 -40L-21 -29L0 -14L22 -29L15 -40L27 -56L16 -68L16 -95Z','markings');
      art+=p('M-63 -55Q-33 -70 -20 -57L0 -40L21 -57Q37 -71 65 -52L60 38L53 117Q0 130 -53 117L-60 38Z','hair');
      art+=p('M-66 -58L-40 -68L-26 -53L-42 -26L-27 21L-35 93L-65 83L-72 10ZM66 -58L40 -68L26 -53L42 -26L27 21L35 93L65 83L72 10Z','outfit');
      art+=p('M-42 -67L-24 -71L-20 -54L-35 -28L-49 -37ZM42 -67L24 -71L20 -54L35 -28L49 -37Z','outfit');
      art+=shade('M-65 12L-41 -9L-29 21L-35 93L-65 83ZM65 12L41 -9L29 21L35 93L65 83Z',.13);
      art+=shine('M-66 -51L-54 -55L-57 25L-64 38ZM54 -55L65 -51L64 38L57 25Z',.13);
      art+=line('M-32 -44L-22 -10M32 -44L22 -10',2.5,c.markings);
      art+=`<path d="M-25 -14L-21 -7M25 -14L21 -7" stroke="${ink}" stroke-width="4"/>`;
      art+=line('M-56 46L-40 43L-44 65L-59 67M56 46L40 43L44 65L59 67',2,c.markings,'opacity=".5"');
      // Original chest insignia, sharply drawn rather than a placeholder text logo.
      art+=`<g transform="translate(0 17)" fill="${c.markings}" ${partAttrs('markings')} stroke="none"><path d="M-14 -11L-3 -5L0 -19L5 -6L17 -13L12 1L21 5L7 9L0 23L-6 9L-19 5L-11 0Z"/><path d="M-18 29H18V32H-18Z" opacity=".5"/></g>`;
      art+=`<path d="M-54 98Q0 108 54 98L52 119Q0 130 -52 119Z" fill="${ink}"/><path d="M-9 107H10V119H-9Z" fill="none" stroke="#d1cbd5" stroke-width="3"/><path d="M17 112Q30 140 56 123" fill="none" stroke="#c6c1cf" stroke-width="2.5" stroke-dasharray="3 3"/>`;
      if(c.accessory==='collar')art+=`<path d="M-26 -86Q0 -73 26 -86L24 -73Q0 -60 -25 -73Z" fill="${ink}"/><path d="M-4 -79H8V-67H-4Z" fill="none" stroke="#d6d0df" stroke-width="2"/><path d="M0 -65L0 -57" stroke="#d6d0df" stroke-width="2"/><path d="M0 -59L8 -48L0 -36L-8 -48Z" fill="${c.eyes}" ${partAttrs('eyes')}/>`;
      return `<g data-anatomy="torso">${art}</g>`;
    }

    const titleId=uid+'-title';
    const seat = c.pose==='sit' ? `<g data-anatomy="seat" stroke="${ink}" stroke-width="3"><path d="M-91 119L-77 253M91 119L77 253M-80 214H80" fill="none"/><path d="M-97 105Q0 99 97 105L94 125Q0 132 -94 125Z" fill="#ded8d1"/><path d="M-89 112H89" fill="none" opacity=".35"/></g>` : '';
    return `<svg xmlns="http://www.w3.org/2000/svg" class="fui-character${interactive?' is-interactive':''}" viewBox="0 0 600 760" role="img" aria-labelledby="${titleId}" data-species="${c.species}" data-pose="${c.pose}" style="overflow:visible"><title id="${titleId}">${esc(label)}</title><defs><radialGradient id="${uid}-shadow"><stop stop-color="${ink}" stop-opacity=".17"/><stop offset="1" stop-color="${ink}" stop-opacity="0"/></radialGradient></defs><ellipse cx="300" cy="716" rx="173" ry="22" fill="url(#${uid}-shadow)"/><g transform="translate(${rig.origin.join(' ')}) rotate(${rig.lean})" fill="none" stroke="${ink}" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round">${seat}<g data-anatomy="back">${tail()}${isWinged?wing(-1)+wing(1):''}${p('M-58 -175Q-101 -133 -80 -73L-96 -64L-76 -55L-80 -36Q-59 -44 -47 -72L47 -72Q65 -43 82 -39L77 -59L94 -65L78 -76Q99 -134 59 -176Z','hair')}</g>${rig.legs.map(leg).join('')}${arm(sleeves.left,-1)}${arm(sleeves.right,1)}${torso()}${head()}${c.pose==='hero'?`<path d="M71 51L62 62" stroke="${c.markings}" stroke-width="2"/>`:''}</g></svg>`;
  }
  return { species, poses, parts, defaults, render };
});
