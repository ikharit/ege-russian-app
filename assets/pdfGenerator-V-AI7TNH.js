import{a as m,j as u,f as w,aa as S,ab as k,h as D}from"./index-DeZiUfnS.js";import"./framer-motion-BNeFXsM2.js";import"./router-BhV0Q2Lu.js";import"./dooshin-Oq-UgZ7c.js";import"./supabase-Be25SE7n.js";import"./lucide-D-AtUttA.js";import"./recharts-BHceiceg.js";function n(a){const e=document.createElement("div");return e.textContent=a,e.innerHTML}function b(){return`
    <style>
      @page { size: A4; margin: 15mm; }
      * { box-sizing: border-box; }
      body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 20px; color: #333; background: #fff; line-height: 1.5; }
      .page { max-width: 800px; margin: 0 auto; page-break-after: always; }
      .page:last-child { page-break-after: auto; }
      .header { text-align: center; border-bottom: 3px solid #58cc02; padding-bottom: 15px; margin-bottom: 20px; }
      .header h1 { margin: 0; font-size: 24px; color: #1cb0f6; }
      .header .subtitle { color: #666; font-size: 14px; margin-top: 5px; }
      .header .date { color: #999; font-size: 12px; margin-top: 5px; }
      .section { margin: 20px 0; }
      .section h2 { font-size: 18px; color: #58cc02; border-bottom: 2px solid #e5e5e5; padding-bottom: 8px; margin-bottom: 15px; }
      .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin: 15px 0; }
      .stat-card { background: #f8f9fa; border-radius: 12px; padding: 15px; text-align: center; border-left: 4px solid #58cc02; }
      .stat-card .value { font-size: 28px; font-weight: bold; color: #58cc02; }
      .stat-card .label { font-size: 12px; color: #666; margin-top: 5px; }
      table { width: 100%; border-collapse: collapse; margin: 15px 0; font-size: 13px; }
      th { background: #58cc02; color: white; padding: 10px; text-align: left; font-weight: 600; }
      td { padding: 10px; border-bottom: 1px solid #eee; }
      tr:nth-child(even) { background: #f8f9fa; }
      .progress-bar { width: 100%; height: 20px; background: #e5e5e5; border-radius: 10px; overflow: hidden; margin: 10px 0; }
      .progress-bar .fill { height: 100%; background: #58cc02; border-radius: 10px; text-align: center; color: white; font-size: 12px; line-height: 20px; }
      .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
      .badge-green { background: #d4edda; color: #155724; }
      .badge-yellow { background: #fff3cd; color: #856404; }
      .badge-red { background: #f8d7da; color: #721c24; }
      .recommendation { background: #e8f5e9; border-left: 4px solid #58cc02; padding: 12px 15px; margin: 10px 0; border-radius: 0 8px 8px 0; }
      .footer { text-align: center; color: #999; font-size: 11px; margin-top: 30px; padding-top: 15px; border-top: 1px solid #eee; }
      @media print {
        body { padding: 0; }
        .no-print { display: none; }
      }
    </style>
  `}function E(a){const e=u.getState(),r=m.getState(),s=e.profiles.find(o=>o.id===a),l=e.getProfileStats(a),c=r;if(!s||!l)return"<p>Нет данных</p>";const p=w.sections.reduce((o,y)=>o+y.lessons.length,0),i=Object.values(c.lessonProgress).filter(o=>o.status==="completed").length,d=Math.round(i/p*100),t=S(c),v=k(c.wrongAnswers||[]),h=v.patterns.slice(0,5),g=new Date().toLocaleDateString("ru-RU"),x=c.examDate||"2027-06-01",f=Math.max(0,Math.ceil((new Date(x).getTime()-Date.now())/(1e3*60*60*24))),$=h.length>0?h.map(o=>`
      <tr>
        <td>Задание ${o.taskNumber}</td>
        <td>${n(o.errorType)}</td>
        <td>${o.frequency}</td>
        <td>${Math.round(o.confidence*100)}%</td>
      </tr>
    `).join(""):'<tr><td colspan="4" style="text-align:center;color:#999">Пока нет ошибок — отлично! 🎉</td></tr>';return`
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Отчёт — ${n(s.name)}</title>
  ${b()}
</head>
<body>
  <div class="page">
    <div class="header">
      <h1>📊 Отчёт о прогрессе</h1>
      <div class="subtitle">${n(s.name)}</div>
      <div class="date">Сгенерировано: ${g}</div>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="value">${l.level}</div>
        <div class="label">Уровень</div>
      </div>
      <div class="stat-card">
        <div class="value">${l.xp}</div>
        <div class="label">XP</div>
      </div>
      <div class="stat-card">
        <div class="value">${l.streak||0} 🔥</div>
        <div class="label">Стрик (дней)</div>
      </div>
      <div class="stat-card">
        <div class="value">${l.accuracy}%</div>
        <div class="label">Точность</div>
      </div>
    </div>

    <div class="section">
      <h2>🎯 Прогресс по курсу</h2>
      <div class="progress-bar">
        <div class="fill" style="width: ${d}%">${d}%</div>
      </div>
      <p>Пройдено <strong>${i}</strong> из <strong>${p}</strong> уроков</p>
    </div>

    <div class="section">
      <h2>📝 Предсказание на ЕГЭ</h2>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="value">${t.predictedSecondary}</div>
          <div class="label">Тестовый балл</div>
        </div>
        <div class="stat-card">
          <div class="value">${t.confidence}%</div>
          <div class="label">Уверенность</div>
        </div>
        <div class="stat-card">
          <div class="value">${f}</div>
          <div class="label">Дней до экзамена</div>
        </div>
      </div>
      <p>Для <strong>80+</strong> нужно: ${t.neededForExcellent>0?`ещё ${t.neededForExcellent} XP`:"всё готово! 🎉"}</p>
    </div>
  </div>

  <div class="page">
    <div class="section">
      <h2>🧠 Слабые места</h2>
      <table>
        <thead>
          <tr><th>Задание</th><th>Тип ошибки</th><th>Количество</th><th>Уверенность</th></tr>
        </thead>
        <tbody>
          ${$}
        </tbody>
      </table>
    </div>

    <div class="section">
      <h2>💡 Рекомендации</h2>
      ${v.recommendations.slice(0,5).map(o=>`<div class="recommendation">${n(o)}</div>`).join("")}
      ${v.recommendations.length===0?'<div class="recommendation">Отлично! Ошибок почти нет. Продолжай в том же духе! 🌟</div>':""}
    </div>

    <div class="footer">
      📚 ЕГЭ Русский — Подготовка | Сгенерировано ${g}
    </div>
  </div>
</body>
</html>
  `}function O(a){const e=D.getState(),r=u.getState(),s=e.classes[a];if(!s)return"<p>Класс не найден</p>";const l=new Date().toLocaleDateString("ru-RU"),c=s.students||[],p=c.map(d=>{const t=r.getProfileStats(d.id),v=m.getState(),h=Object.values(v.lessonProgress).filter(g=>g.status==="completed").length;return`
      <tr>
        <td>${n(d.name)}</td>
        <td>${(t==null?void 0:t.level)||1}</td>
        <td>${(t==null?void 0:t.xp)||0}</td>
        <td>${(t==null?void 0:t.accuracy)||0}%</td>
        <td>${h}</td>
        <td>${(t==null?void 0:t.streak)||0}</td>
      </tr>
    `}).join(""),i=(s.homework||[]).map(d=>{const t=new Date(d.deadline)<new Date?"❌ Просрочено":"⏳ В процессе";return`
      <tr>
        <td>${n(d.taskTitle)}</td>
        <td>${new Date(d.deadline).toLocaleDateString("ru-RU")}</td>
        <td>-</td>
        <td>${t}</td>
      </tr>
    `}).join("");return`
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Отчёт по классу — ${n(s.name)}</title>
  ${b()}
</head>
<body>
  <div class="page">
    <div class="header">
      <h1>🏫 Отчёт по классу</h1>
      <div class="subtitle">${n(s.name)} | Учитель: ${n(s.teacherName)}</div>
      <div class="date">Сгенерировано: ${l}</div>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="value">${c.length}</div>
        <div class="label">Учеников</div>
      </div>
      <div class="stat-card">
        <div class="value">${Math.round(c.reduce((d,t)=>{var v;return d+(((v=r.getProfileStats(t.id))==null?void 0:v.xp)||0)},0)/Math.max(c.length,1))}</div>
        <div class="label">Средний XP</div>
      </div>
      <div class="stat-card">
        <div class="value">${(s.homework||[]).length}</div>
        <div class="label">Домашних заданий</div>
      </div>
    </div>

    <div class="section">
      <h2>👥 Прогресс учеников</h2>
      <table>
        <thead>
          <tr><th>Имя</th><th>Уровень</th><th>XP</th><th>Точность</th><th>Уроки</th><th>Стрик</th></tr>
        </thead>
        <tbody>
          ${p||'<tr><td colspan="6" style="text-align:center;color:#999">Нет учеников</td></tr>'}
        </tbody>
      </table>
    </div>
  </div>

  <div class="page">
    <div class="section">
      <h2>📚 Домашние задания</h2>
      <table>
        <thead>
          <tr><th>Название</th><th>Дедлайн</th><th>Сдавших</th><th>Статус</th></tr>
        </thead>
        <tbody>
          ${i||'<tr><td colspan="4" style="text-align:center;color:#999">Нет домашних заданий</td></tr>'}
        </tbody>
      </table>
    </div>

    <div class="footer">
      📚 ЕГЭ Русский — Подготовка | Сгенерировано ${l}
    </div>
  </div>
</body>
</html>
  `}function A(){const a=m.getState(),e=a.userStats,r=a.achievements||[],s=a.examResults||[],l=new Date().toLocaleDateString("ru-RU"),c=r.map(i=>{const d=P(i);return`<span class="badge badge-green">${d?d.title:i}</span>`}).join(" "),p=s.map(i=>`
    <tr>
      <td>${i.variantId}</td>
      <td>${new Date(i.date).toLocaleDateString("ru-RU")}</td>
      <td>${i.primaryScore}</td>
      <td>${i.secondaryScore}</td>
    </tr>
  `).join("");return`
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Моё портфолио</title>
  ${b()}
</head>
<body>
  <div class="page">
    <div class="header">
      <h1>📖 Моё портфолио</h1>
      <div class="subtitle">${n(e.name||"Ученик")}</div>
      <div class="date">${l}</div>
    </div>

    <div class="stats-grid">
      <div class="stat-card"><div class="value">${e.level}</div><div class="label">Уровень</div></div>
      <div class="stat-card"><div class="value">${e.xp}</div><div class="label">XP</div></div>
      <div class="stat-card"><div class="value">${e.streak||0} 🔥</div><div class="label">Стрик</div></div>
      <div class="stat-card"><div class="value">${r.length}</div><div class="label">Достижений</div></div>
    </div>

    <div class="section">
      <h2>🏆 Достижения</h2>
      <p>${c||"Пока нет достижений — продолжай учиться!"}</p>
    </div>
  </div>

  <div class="page">
    <div class="section">
      <h2>📝 Пройденные варианты</h2>
      <table>
        <thead><tr><th>Вариант</th><th>Дата</th><th>Первичный</th><th>Тестовый</th></tr></thead>
        <tbody>${p||'<tr><td colspan="4" style="text-align:center;color:#999">Пока не пройдено ни одного варианта</td></tr>'}</tbody>
      </table>
    </div>

    <div class="footer">
      📚 ЕГЭ Русский — Подготовка | Сгенерировано ${l}
    </div>
  </div>
</body>
</html>
  `}function P(a){try{const{achievements:e}=require("../data/achievements");return e.find(r=>r.id===a)}catch{return null}}function C(a){const e=new Blob([a],{type:"text/html; charset=utf-8"}),r=URL.createObjectURL(e);window.open(r,"_blank")}export{E as generateParentReportHTML,A as generateStudentPortfolioHTML,O as generateTeacherReportHTML,C as openReportInNewTab};
